import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import sharp from 'sharp';
import exifReader from 'exif-reader';
import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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
 * The stored filename keeps the original casing — every existing entry pairs a lowercased id
 * with a filename as the camera wrote it, e.g. `img-8553` / `IMG_8553.webp`. Only the
 * extension changes.
 */
const webpName = (filename: string) => `${filename.replace(/\.[^.]+$/, '')}.webp`;

/**
 * The supplied name becomes both a storage key and a manifest id, so it is checked before
 * either is derived. Anything outside this is a typo or a paste accident: every camera name
 * in the manifest fits it, from IMG_8553.jpg to 20220302-DJI_0221.jpg.
 */
const SAFE_FILENAME = /^[A-Za-z0-9][A-Za-z0-9_-]*\.[A-Za-z0-9]+$/;

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

/**
 * The crops that are shot deliberately: 3:2 landscape, 4:5 portrait, and 4:3 for horizontal
 * shots of people, where 3:2 is wide enough to leave dead space. Anything else means the
 * Lightroom export used the wrong crop. Rejecting at upload is cheaper than noticing later
 * and having to remove three objects and a manifest entry.
 *
 * Served to the client via GET /photos so the pre-upload warning cannot drift from what the
 * server actually enforces.
 */
const EXPECTED_RATIOS = ['3:2', '4:5', '4:3'];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The round-trip through UTC is what rejects 2026-02-31: the pattern alone accepts it and
 * Date rolls it silently forward to 3 March. A month like 13 does not round-trip at all —
 * toISOString() throws on an invalid date rather than returning a value that differs.
 */
const isCalendarDate = (value: string): boolean => {
	if (!DATE_PATTERN.test(value)) return false;
	const parsed = new Date(`${value}T00:00:00Z`);
	return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

/** exif-reader parses date tags as UTC, so the local getters would shift a 00:30 capture back a day. */
const isoDate = (date: Date): string | undefined => {
	if (Number.isNaN(date.getTime())) return undefined;
	const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
	const day = `${date.getUTCDate()}`.padStart(2, '0');
	return `${date.getUTCFullYear()}-${month}-${day}`;
};

/**
 * DateTimeOriginal is when the shutter fired. Image.DateTime is when the file was last
 * written, so a Lightroom export would report the export date as the capture date — it is
 * deliberately not consulted.
 */
const captureDate = (exif?: Buffer): string | undefined => {
	if (!exif) return undefined;
	try {
		const tags = exifReader(exif);
		const taken = tags.Photo?.DateTimeOriginal ?? tags.Photo?.DateTimeDigitized;
		return taken instanceof Date ? isoDate(taken) : undefined;
	} catch {
		// A camera writing a malformed block is not a reason to refuse the photo.
		return undefined;
	}
};

/** Raised when a supplied date is not a real calendar date. */
class InvalidDate extends Error {
	constructor(readonly value: string) {
		super(`"${value}" is not a date. Use YYYY-MM-DD — 2026-02-31 and 08-16-2026 are both rejected.`);
	}
}

/**
 * A cleared date field arrives as an empty string, which means "unknown" — the key is dropped
 * rather than stored, so those entries stay identical to the ones that never had a date.
 */
const withValidatedDate = <T extends { date?: string }>(tags: T): T => {
	if (tags.date && !isCalendarDate(tags.date)) throw new InvalidDate(tags.date);
	const cleaned = { ...tags };
	if (!cleaned.date) delete cleaned.date;
	return cleaned;
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

/** Raised when the live photos.json changed outside this machine since the last publish. */
class PublishConflict extends Error {
	constructor(
		readonly liveETag?: string,
		readonly expectedETag?: string,
	) {
		super('photos.json on S3 changed since the last publish from this machine');
	}
}

/** HeadObject throws rather than returning a flag when the key is absent. */
const objectExists = async (s3: S3Client, bucket: string, key: string): Promise<boolean> => {
	try {
		await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
		return true;
	} catch (error) {
		const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
		if (status === 404) return false;
		throw error;
	}
};

const send = (res: ServerResponse, status: number, body: unknown) => {
	res.statusCode = status;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(body));
};

/**
 * Keeps the admin's utility classes out of the production stylesheet.
 *
 * This has to be build-only. Putting `@source not` directly in globals.css also strips the
 * classes in dev, which leaves the admin unstyled — thumbnails render at full size because
 * their sizing utilities were never generated.
 */
export function adminCssExcludePlugin(): Plugin {
	return {
		name: 'clicky-pete-admin-css-exclude',
		apply: 'build',
		enforce: 'pre',
		transform(code, id) {
			if (!id.includes('globals.css')) return null;
			return code.replace("@import 'tailwindcss';", "@import 'tailwindcss';\n@source not '../pages/Admin';");
		},
	};
}

export function adminPlugin(): Plugin {
	return {
		name: 'clicky-pete-admin',
		// Dev server only. There is no build-time equivalent of configureServer, so nothing
		// here can reach a production bundle.
		apply: 'serve',

		configureServer(server) {
			// The admin writes photos.json on every retag. Nothing imports it, so Vite has no
			// module to update and should stay quiet — but leaving it watched means a save and a
			// reload are one file event apart, and a reload mid-way through tagging the back
			// catalogue loses your place in the list. Unwatching removes the possibility.
			server.watcher.unwatch(MANIFEST_PATH);

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

			/** Uploads photos.json and clears the CDN copy. Shared by /publish and /delete. */
			const publishManifest = async (): Promise<string | undefined> => {
				const state = readState();
				const head = await s3.send(new HeadObjectCommand({ Bucket: config.bucket, Key: MANIFEST_KEY }));
				// Optimistic lock: if the live file changed since our last publish, someone
				// edited it elsewhere and pushing now would silently discard their change.
				if (state.lastPublishedETag && head.ETag !== state.lastPublishedETag) {
					throw new PublishConflict(head.ETag, state.lastPublishedETag);
				}

				const put = await s3.send(
					new PutObjectCommand({
						Bucket: config.bucket,
						Key: MANIFEST_KEY,
						Body: readFileSync(MANIFEST_PATH),
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
				return put.ETag;
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
							expectedRatios: EXPECTED_RATIOS,
							values: {
								categories: distinct('category'),
								locations: distinct('location'),
								collections: distinct('collection'),
							},
						});
					}

					// Capture date out of the source bytes, so the form can show it before anything is
					// uploaded. Reads only — nothing is stored, resized or sent to S3 here.
					if (req.method === 'POST' && url === '/probe') {
						const source = await readBody(req);
						if (!source.length) return send(res, 400, { error: 'empty body' });
						const { exif } = await sharp(source).metadata();
						return send(res, 200, { date: captureDate(exif) });
					}

					// One photo: raw bytes in the body, metadata in a header. Avoids multipart parsing.
					if (req.method === 'POST' && url === '/photo') {
						const header = req.headers['x-photo-meta'];
						if (typeof header !== 'string') return send(res, 400, { error: 'missing x-photo-meta header' });
						const meta = JSON.parse(Buffer.from(header, 'base64').toString('utf8')) as PhotoMeta;
						const source = await readBody(req);
						if (!source.length) return send(res, 400, { error: 'empty body' });

						if (!SAFE_FILENAME.test(meta.filename)) {
							return send(res, 400, {
								error: `"${meta.filename}" is not a usable filename. Use letters, digits, dashes and underscores with a single extension — the name becomes both the stored key and the photo's id.`,
							});
						}

						// Before any upload: a date rejected further down would otherwise fail the
						// request with all three renditions already sitting in the bucket.
						const tags = withValidatedDate(meta.tags);

						const id = slugify(meta.filename);
						const file = webpName(meta.filename);
						const manifest = readManifest();
						if (manifest.some((p) => p.file === file || p.id === id)) {
							return send(res, 409, { error: `${file} already exists in photos.json` });
						}

						// The manifest check alone would miss an object that exists in storage but was
						// never listed — /delete leaves files behind by design — and uploading would
						// then overwrite a different photo without a word.
						const existing = await objectExists(s3, config.bucket, `photos/2000/${file}`);
						if (existing) {
							return send(res, 409, {
								error: `photos/2000/${file} already exists in storage but is not in photos.json. Rename the file, or delete the stored copy first.`,
								orphan: true,
							});
						}

						// rotate() applies EXIF orientation, then metadata is dropped by default —
						// no GPS or camera data reaches the published files.
						const upright = sharp(source).rotate();
						const { width, height } = await upright.metadata();
						if (!width || !height) return send(res, 400, { error: 'could not read image dimensions' });

						const ratio = aspectRatio(width, height);
						if (!EXPECTED_RATIOS.includes(ratio) && req.headers['x-allow-any-ratio'] !== 'true') {
							return send(res, 422, {
								error: `${meta.filename} is ${ratio} (${width}×${height}). Expected ${EXPECTED_RATIOS.join(' or ')} — check the Lightroom export crop.`,
								ratio,
								width,
								height,
							});
						}

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
							tags: { ...tags, aspectRatio: ratio },
						};
						writeManifest([...manifest, entry]);
						return send(res, 200, { entry, dimensions: { width, height } });
					}

					// Push photos.json to S3 and clear the CDN copy.
					if (req.method === 'POST' && url === '/publish') {
						try {
							const etag = await publishManifest();
							return send(res, 200, { published: true, entries: readManifest().length, etag });
						} catch (error) {
							if (error instanceof PublishConflict) {
								return send(res, 409, {
									error: error.message,
									liveETag: error.liveETag,
									expectedETag: error.expectedETag,
								});
							}
							throw error;
						}
					}

					// Retag an existing photo. aspectRatio is not editable: it is derived from the
					// image, and a hand-typed value is how layout bugs get in.
					if (req.method === 'POST' && url === '/update') {
						const { id, tags } = JSON.parse((await readBody(req)).toString('utf8')) as {
							id: string;
							tags: Omit<Photo['tags'], 'aspectRatio'>;
						};
						const manifest = readManifest();
						const target = manifest.find((p) => p.id === id);
						if (!target) return send(res, 404, { error: `no entry ${id}` });
						const validated = withValidatedDate(tags);
						const updated = manifest.map((p) =>
							p.id === id ? { ...p, tags: { ...validated, aspectRatio: p.tags.aspectRatio } } : p,
						);
						writeManifest(updated);
						return send(res, 200, { entry: updated.find((p) => p.id === id) });
					}

					// Removes the entry. Stored files are kept unless deleteFiles is set, because
					// deleting an object the live photos.json still references breaks the site
					// immediately — so when files do go, the manifest is published first.
					if (req.method === 'POST' && url === '/delete') {
						const { id, deleteFiles } = JSON.parse((await readBody(req)).toString('utf8')) as {
							id: string;
							deleteFiles?: boolean;
						};
						const manifest = readManifest();
						const target = manifest.find((p) => p.id === id);
						if (!target) return send(res, 404, { error: `no entry ${id}` });

						const remaining = manifest.filter((p) => p.id !== id);
						writeManifest(remaining);

						if (deleteFiles !== true) {
							return send(res, 200, { removed: id, entries: remaining.length, filesDeleted: false });
						}

						try {
							await publishManifest();
						} catch (error) {
							if (error instanceof PublishConflict) {
								// The entry is already out of the local manifest; leaving the files in
								// place is the safe half-way state, so report rather than delete blind.
								return send(res, 409, {
									error: `${error.message}. The entry was removed locally but the files were kept — publish, then delete again.`,
									removed: id,
									entries: remaining.length,
									filesDeleted: false,
								});
							}
							throw error;
						}

						const deleted: string[] = [];
						for (const size of SIZES) {
							const Key = `photos/${size}/${target.file}`;
							await s3.send(new DeleteObjectCommand({ Bucket: config.bucket, Key }));
							deleted.push(Key);
						}
						return send(res, 200, {
							removed: id,
							entries: remaining.length,
							filesDeleted: true,
							published: true,
							deleted,
						});
					}

					next();
				};

				handle().catch((err: unknown) => {
					if (err instanceof InvalidDate) return send(res, 400, { error: err.message });
					const message = err instanceof Error ? err.message : String(err);
					server.config.logger.error(`[admin] ${message}`);
					send(res, 500, { error: message });
				});
			});
		},
	};
}
