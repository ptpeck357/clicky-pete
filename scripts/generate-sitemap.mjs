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

const photos = JSON.parse(readFileSync(join(ROOT, 'src/data/photos.json'), 'utf8'));

const collections = [...new Set(photos.map((photo) => photo.tags.collection).filter(Boolean))].sort();

/** Newest photo date in a set, which is the closest thing to a "last modified" the data has. */
const latestDate = (entries) => entries.map((photo) => photo.tags.date).filter(Boolean).sort().at(-1);

const siteLastMod = latestDate(photos);

const urls = [
	{ loc: '/', priority: '1.0', lastmod: siteLastMod },
	{ loc: '/gallery', priority: '0.9', lastmod: siteLastMod },
	{ loc: '/contact', priority: '0.9' },
	{ loc: '/about', priority: '0.7' },
	...collections.map((collection) => ({
		loc: `/gallery/${encodeURIComponent(collection)}`,
		priority: '0.8',
		lastmod: latestDate(photos.filter((photo) => photo.tags.collection === collection)),
	})),
];

const body = urls
	.map(({ loc, priority, lastmod }) =>
		[
			'\t<url>',
			`\t\t<loc>${SITE_URL}${loc}</loc>`,
			lastmod ? `\t\t<lastmod>${lastmod}</lastmod>` : null,
			`\t\t<priority>${priority}</priority>`,
			'\t</url>',
		]
			.filter(Boolean)
			.join('\n'),
	)
	.join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(join(ROOT, 'public/sitemap.xml'), xml);

console.log(`sitemap.xml: ${urls.length} urls (${collections.length} collections)`);
