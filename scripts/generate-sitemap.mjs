/**
 * Writes public/sitemap.xml from photos.json, before Vite copies public/ into dist.
 *
 * The collection routes are the reason this is generated rather than hand-written: they exist
 * only as values inside the manifest, and are reachable in the UI by clicking a card, so a
 * crawler landing on / has no path to them. A hand-maintained list would be wrong the first
 * time a collection is added.
 *
 * The file is gitignored — it is derived, and committing it would mean a diff on every photo
 * added. Amplify runs `npm run build`, so the deployed copy is always current.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Kept in step with src/config/site.ts by hand: this script is Node, that file is bundled TS,
// and one constant is not worth a build step to share.
const SITE_URL = 'https://www.clickypete.photography';

// The CloudFront host the site reads as VITE_CLOUDFRONT_URL. Hardcoded for the same reason as
// SITE_URL, and because reading .env here would make the build depend on a file Amplify does
// not have in the same form.
const PHOTO_URL = 'https://photos.clickypete.photography';

// Google reads at most 1,000 <image:image> entries per <url>. The largest collection is a few
// hundred short of it; the check below fails the build rather than let Google drop the rest.
const MAX_IMAGES_PER_URL = 1000;

const photos = JSON.parse(readFileSync(join(ROOT, 'src/data/photos.json'), 'utf8'));

const collections = [...new Set(photos.map((photo) => photo.tags.collection).filter(Boolean))].sort();

const escapeXml = (text) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The same sentence describePhoto() in src/utils/photoAlt.ts builds for alt text, with the
// same readableCategory(). Duplicated for the reason SITE_URL is; change one and change the other.
const readableCategory = (category) =>
	category
		.split('|')
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part, index) => (index === 0 ? part : part.toLowerCase()))
		.join(' and ');

const describePhoto = ({ tags: { category, location, collection } }) => {
	const subject = category ? `${readableCategory(category)} photography` : 'Photograph';
	const place = location ? ` in ${location}` : '';
	const series = collection && collection !== location ? ` — ${collection} collection` : '';
	return `${subject}${place}${series}`;
};

/** Newest photo date in a set, which is the closest thing to a "last modified" the data has. */
const latestDate = (entries) => entries.map((photo) => photo.tags.date).filter(Boolean).sort().at(-1);

const siteLastMod = latestDate(photos);

const urls = [
	{ loc: '/', priority: '1.0', lastmod: siteLastMod },
	{ loc: '/gallery', priority: '0.9', lastmod: siteLastMod },
	{ loc: '/contact', priority: '0.9' },
	{ loc: '/about', priority: '0.7' },
	...collections.map((collection) => {
		const members = photos.filter((photo) => photo.tags.collection === collection);
		if (members.length > MAX_IMAGES_PER_URL) {
			throw new Error(`${collection} has ${members.length} photos, over Google's ${MAX_IMAGES_PER_URL} per URL`);
		}
		return {
			loc: `/gallery/${encodeURIComponent(collection)}`,
			priority: '0.8',
			lastmod: latestDate(members),
			images: members,
		};
	}),
];

const imageEntry = (photo) =>
	[
		'\t\t<image:image>',
		`\t\t\t<image:loc>${PHOTO_URL}/photos/2000/${encodeURIComponent(photo.file)}</image:loc>`,
		`\t\t\t<image:title>${escapeXml(describePhoto(photo))}</image:title>`,
		'\t\t</image:image>',
	].join('\n');

const body = urls
	.map(({ loc, priority, lastmod, images = [] }) =>
		[
			'\t<url>',
			`\t\t<loc>${SITE_URL}${loc}</loc>`,
			lastmod ? `\t\t<lastmod>${lastmod}</lastmod>` : null,
			`\t\t<priority>${priority}</priority>`,
			...images.map(imageEntry),
			'\t</url>',
		]
			.filter(Boolean)
			.join('\n'),
	)
	.join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;

writeFileSync(join(ROOT, 'public/sitemap.xml'), xml);

const imageCount = urls.reduce((total, url) => total + (url.images?.length ?? 0), 0);
console.log(`sitemap.xml: ${urls.length} urls (${collections.length} collections), ${imageCount} images`);
