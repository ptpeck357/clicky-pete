/**
 * Checks src/data/photos.json against the conventions the publish pipeline relies on.
 *
 * The manifest is the one file in the repo that is generated, prettier-ignored and read by
 * production at runtime, so nothing else in CI looks at it. A bad entry here is not a failed
 * build — it is a photo that 404s from CloudFront, or a mixed-case S3 key that has to be
 * cleaned up by hand afterwards.
 *
 * Run: npm run validate:manifest [path]
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MANIFEST_PATH = resolve(process.argv[2] ?? 'src/data/photos.json');

/** Mirrors slugify() in vite-plugin-admin.ts: no extension, lowercased, underscores to hyphens. */
const slugify = (filename) =>
	filename
		.replace(/\.[^.]+$/, '')
		.toLowerCase()
		.replace(/_/g, '-');

/** The filename becomes an S3 key, so the same restriction the upload endpoint applies holds here. */
const SAFE_FILENAME = /^[A-Za-z0-9][A-Za-z0-9_-]*\.webp$/;

const EXPECTED_RATIOS = ['3:2', '4:5', '4:3'];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** The round trip is what rejects 2026-02-31, which the pattern alone accepts and Date rolls forward. */
const isCalendarDate = (value) => {
	if (!DATE_PATTERN.test(value)) return false;
	const parsed = new Date(`${value}T00:00:00Z`);
	return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

const STRING_TAGS = ['category', 'location', 'collection'];
const FLAG_TAGS = ['featured', 'hero', 'collectionCover'];
const KNOWN_TAGS = [...STRING_TAGS, 'aspectRatio', 'date', ...FLAG_TAGS];

const errors = [];
const fail = (message) => errors.push(message);

const raw = readFileSync(MANIFEST_PATH, 'utf8');

let photos;
try {
	photos = JSON.parse(raw);
} catch (error) {
	console.error(`photos.json is not valid JSON: ${error.message}`);
	process.exit(1);
}

if (!Array.isArray(photos) || photos.length === 0) {
	console.error('photos.json must be a non-empty array.');
	process.exit(1);
}

/**
 * The file is in .prettierignore, so this is the only thing standing between a hand edit and a
 * reformat that churns every line on the next publish.
 */
if (raw !== `${JSON.stringify(photos, null, 2)}\n`) {
	fail('formatting: not JSON.stringify(photos, null, 2) plus a trailing newline. Re-publish or reformat.');
}

const seenIds = new Map();
const seenFiles = new Map();

photos.forEach((photo, index) => {
	const where = `entry ${index} (${photo?.id ?? 'no id'})`;

	if (typeof photo?.id !== 'string' || typeof photo?.file !== 'string' || typeof photo?.tags !== 'object') {
		fail(`${where}: needs a string id, a string file and a tags object.`);
		return;
	}

	if (!SAFE_FILENAME.test(photo.file)) {
		fail(`${where}: file "${photo.file}" is not a plain .webp name — it becomes an S3 key verbatim.`);
	}

	if (photo.id !== slugify(photo.file)) {
		fail(`${where}: id should be "${slugify(photo.file)}" to match file "${photo.file}".`);
	}

	// Two entries pointing at one object means removing either deletes the other's photo.
	const duplicateId = seenIds.get(photo.id);
	if (duplicateId !== undefined) fail(`${where}: duplicate id, already used by entry ${duplicateId}.`);
	else seenIds.set(photo.id, index);

	// S3 keys are case-sensitive but two names differing only in case is always a mistake here.
	const fileKey = photo.file.toLowerCase();
	const duplicateFile = seenFiles.get(fileKey);
	if (duplicateFile !== undefined) fail(`${where}: file "${photo.file}" already used by entry ${duplicateFile}.`);
	else seenFiles.set(fileKey, index);

	const { tags } = photo;

	for (const tag of STRING_TAGS) {
		if (typeof tags[tag] !== 'string' || tags[tag].trim() === '') fail(`${where}: tags.${tag} must be a non-empty string.`);
	}

	if (!EXPECTED_RATIOS.includes(tags.aspectRatio)) {
		fail(`${where}: aspectRatio "${tags.aspectRatio}" is not one of ${EXPECTED_RATIOS.join(', ')}.`);
	}

	if ('date' in tags && !isCalendarDate(tags.date ?? '')) {
		fail(`${where}: date "${tags.date}" is not a real YYYY-MM-DD calendar date.`);
	}

	for (const flag of FLAG_TAGS) {
		if (flag in tags && typeof tags[flag] !== 'boolean') fail(`${where}: tags.${flag} must be a boolean.`);
	}

	// A misspelled tag is silently ignored by the site, so it can only be caught here.
	for (const key of Object.keys(tags)) {
		if (!KNOWN_TAGS.includes(key)) fail(`${where}: unknown tag "${key}".`);
	}
});

// A second cover in one collection wins or loses by array position, which nothing else depends on.
const coversByCollection = new Map();
for (const photo of photos) {
	if (!photo?.tags?.collectionCover) continue;
	const covers = coversByCollection.get(photo.tags.collection) ?? [];
	covers.push(photo.id);
	coversByCollection.set(photo.tags.collection, covers);
}
for (const [collection, covers] of coversByCollection) {
	if (covers.length > 1) fail(`collection "${collection}": ${covers.length} collectionCover entries (${covers.join(', ')}).`);
}

if (errors.length > 0) {
	console.error(`photos.json: ${errors.length} problem${errors.length === 1 ? '' : 's'} in ${photos.length} entries\n`);
	for (const error of errors) console.error(`  ${error}`);
	console.error('');
	process.exit(1);
}

const dated = photos.filter((photo) => photo.tags.date).length;
console.log(`photos.json: ${photos.length} entries, ${dated} dated, ${coversByCollection.size} collection covers — OK`);
