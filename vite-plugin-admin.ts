import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import sharp from 'sharp';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import type { Photo } from './src/types/photo.ts';

const SIZES = [400, 800, 2000] as const;
const WEBP_QUALITY = 82;
const MANIFEST_KEY = 'data/photos.json';
const MANIFEST_PATH = resolve('src/data/photos.json');
const STATE_PATH = resolve('.admin-state.json');
const CONFIG_PATH = resolve('admin.config.json');

interface AdminConfig {
	bucket: string;
	region: string;
	profile: string;
	distributionId: string;
}

interface PhotoMeta {
	filename: string;
	tags: Photo['tags'];
}

/** Matches the convention of every existing entry: no extension, lowercased, underscores to hyphens. */
const slugify = (filename: string) =>
	filename
		.replace(/\.[^.]+$/, '')
		.toLowerCase()
		.replace(/_/g, '-');

/**
 * Existing entries use tidy ratios like "3:2" and "4:5" rather than the raw pixel ratio,
 * so snap to a known ratio when the image is within 1% of one.
 */
const COMMON_RATIOS: [number, number][] = [
	[3, 2],
	[2, 3],
	[4, 5],
	[5, 4],
	[4, 3],
	[3, 4],
	[16, 9],
	[9, 16],
	[1, 1],
];

const aspectRatio = (width: number, height: number): string => {
	const actual = width / height;
	for (const [w, h] of COMMON_RATIOS) {
		if (Math.abs(actual - w / h) / (w / h) < 0.01) return `${w}:${h}`;
	}
	const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
	const d = gcd(width, height);
	return `${width / d}:${height / d}`;
};

const readConfig = (): AdminConfig => {
	if (!existsSync(CONFIG_PATH)) {
		throw new Error('admin.config.json not found — copy admin.config.example.json and fill it in.');
	}
	return JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) as AdminConfig;
};

const readManifest = (): Photo[] => JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as Photo[];

/** Format must match .prettierignore'd on-disk style exactly, or every publish churns the whole file. */
const writeManifest = (photos: Photo[]) => writeFileSync(MANIFEST_PATH, JSON.stringify(photos, null, 2) + '\n');

const readState = (): { lastPublishedETag?: string } =>
	existsSync(STATE_PATH) ? JSON.parse(readFileSync(STATE_PATH, 'utf8')) : {};

const writeState = (state: { lastPublishedETag?: string }) =>
	writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');

const readBody = (req: IncomingMessage): Promise<Buffer> =>
	new Promise((res, rej) => {
		const chunks: Buffer[] = [];
		req.on('data', (c: Buffer) => chunks.push(c));
		req.on('end', () => res(Buffer.concat(chunks)));
		req.on('error', rej);
	});

const send = (res: ServerResponse, status: number, body: unknown) => {
	res.statusCode = status;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(body));
};

export function adminPlugin(): Plugin {
	return {
		name: 'clicky-pete-admin',
		// Dev server only. There is no build-time equivalent of configureServer, so nothing
		// here can reach a production bundle.
		apply: 'serve',

		configureServer(server) {
			let config: AdminConfig;
			let s3: S3Client;
			let cloudfront: CloudFrontClient;

			const init = () => {
				if (config) return;
				config = readConfig();
				// The SDK's default chain reads AWS_PROFILE from the environment, so the named
				// profile resolves out of ~/.aws without pulling in a credential-provider package.
				process.env.AWS_PROFILE = config.profile;
				s3 = new S3Client({ region: config.region });
				cloudfront = new CloudFrontClient({ region: config.region });
			};

			server.middlewares.use('/__admin', (req, res, next) => {
				const url = (req.url ?? '').split('?')[0];

				const handle = async () => {
					init();

					// Existing photos, plus the distinct tag values used to seed the form's combo-boxes.
					if (req.method === 'GET' && url === '/photos') {
						const photos = readManifest();
						const distinct = (key: 'category' | 'location' | 'collection') =>
							[...new Set(photos.map((p) => p.tags[key]).filter(Boolean))].sort();
						return send(res, 200, {
							photos,
							values: {
								categories: distinct('category'),
								locations: distinct('location'),
								collections: distinct('collection'),
							},
						});
					}

					// One photo: raw bytes in the body, metadata in a header. Avoids multipart parsing.
					if (req.method === 'POST' && url === '/photo') {
						const header = req.headers['x-photo-meta'];
						if (typeof header !== 'string') return send(res, 400, { error: 'missing x-photo-meta header' });
						const meta = JSON.parse(Buffer.from(header, 'base64').toString('utf8')) as PhotoMeta;
						const source = await readBody(req);
						if (!source.length) return send(res, 400, { error: 'empty body' });

						const id = slugify(meta.filename);
						const file = `${id}.webp`;
						const manifest = readManifest();
						if (manifest.some((p) => p.file === file || p.id === id)) {
							return send(res, 409, { error: `${file} already exists in photos.json` });
						}

						// rotate() applies EXIF orientation, then metadata is dropped by default —
						// no GPS or camera data reaches the published files.
						const upright = sharp(source).rotate();
						const { width, height } = await upright.metadata();
						if (!width || !height) return send(res, 400, { error: 'could not read image dimensions' });

						for (const size of SIZES) {
							const body = await sharp(source)
								.rotate()
								.resize({ width: size, withoutEnlargement: true })
								.webp({ quality: WEBP_QUALITY })
								.toBuffer();
							await s3.send(
								new PutObjectCommand({
									Bucket: config.bucket,
									Key: `photos/${size}/${file}`,
									Body: body,
									ContentType: 'image/webp',
								}),
							);
						}

						const entry: Photo = {
							id,
							file,
							tags: { ...meta.tags, aspectRatio: aspectRatio(width, height) },
						};
						writeManifest([...manifest, entry]);
						return send(res, 200, { entry, dimensions: { width, height } });
					}

					// Push photos.json to S3 and clear the CDN copy.
					if (req.method === 'POST' && url === '/publish') {
						const state = readState();
						const head = await s3.send(new HeadObjectCommand({ Bucket: config.bucket, Key: MANIFEST_KEY }));
						// Optimistic lock: if the live file changed since our last publish, someone
						// edited it elsewhere and pushing now would silently discard their change.
						if (state.lastPublishedETag && head.ETag !== state.lastPublishedETag) {
							return send(res, 409, {
								error: 'photos.json on S3 changed since the last publish from this machine',
								liveETag: head.ETag,
								expectedETag: state.lastPublishedETag,
							});
						}

						const body = readFileSync(MANIFEST_PATH);
						const put = await s3.send(
							new PutObjectCommand({
								Bucket: config.bucket,
								Key: MANIFEST_KEY,
								Body: body,
								ContentType: 'application/json',
							}),
						);
						await cloudfront.send(
							new CreateInvalidationCommand({
								DistributionId: config.distributionId,
								InvalidationBatch: {
									CallerReference: `admin-${Date.now()}`,
									Paths: { Quantity: 1, Items: [`/${MANIFEST_KEY}`] },
								},
							}),
						);
						writeState({ lastPublishedETag: put.ETag });
						return send(res, 200, { published: true, entries: readManifest().length, etag: put.ETag });
					}

					// Removes the entry only. S3 objects are left alone deliberately: deleting an
					// object still referenced by the live photos.json breaks the site immediately.
					if (req.method === 'POST' && url === '/delete') {
						const { id } = JSON.parse((await readBody(req)).toString('utf8')) as { id: string };
						const manifest = readManifest();
						const remaining = manifest.filter((p) => p.id !== id);
						if (remaining.length === manifest.length) return send(res, 404, { error: `no entry ${id}` });
						writeManifest(remaining);
						return send(res, 200, { removed: id, entries: remaining.length });
					}

					next();
				};

				handle().catch((err: unknown) => {
					const message = err instanceof Error ? err.message : String(err);
					server.config.logger.error(`[admin] ${message}`);
					send(res, 500, { error: message });
				});
			});
		},
	};
}
