/**
 * The site's URLs, derived from photos.json. Shared by generate-sitemap.mjs and prerender.mjs
 * so the sitemap and the prerendered pages always name the same set — a collection added to
 * the manifest gets both, or neither.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const photos = JSON.parse(readFileSync(join(ROOT, 'src/data/photos.json'), 'utf8'));

export const collections = [...new Set(photos.map((photo) => photo.tags.collection).filter(Boolean))].sort();

export const collectionPath = (collection) => `/gallery/${encodeURIComponent(collection)}`;

/** Routes with a page of their own, in sitemap order. Collections follow them. */
export const STATIC_PATHS = ['/', '/gallery', '/contact', '/about'];
