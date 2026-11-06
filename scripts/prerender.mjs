/**
 * Writes a static HTML file per route into dist/, so a crawler that never runs JavaScript —
 * every link-preview scraper, and Google's first pass — gets the page's title, description,
 * canonical, Open Graph tags and copy instead of an empty <div id="root">.
 *
 * Runs after both Vite builds: the client build's dist/index.html is the template (it carries
 * the hashed asset tags), and the SSR build's dist-ssr/entry-server.js does the rendering.
 *
 * File layout follows Amplify's clean URLs, which serve /about from about.html:
 *
 *   /                  → home.html       (index.html stays the empty shell; see below)
 *   /about             → about.html
 *   /gallery/Montana   → gallery/Montana.html
 *
 * index.html is left as the client-rendered shell because it is the SPA fallback for every
 * URL without a file of its own — an unknown path or collection, a query string Amplify does
 * not match. A prerendered Home there would hydrate against the wrong page and hand those URLs
 * Home's canonical. Serving home.html for / takes a rewrite rule in the Amplify console; until
 * it exists, / gets the shell, exactly as before.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, STATIC_PATHS, collections, collectionPath } from './site-routes.mjs';

const DIST = join(ROOT, 'dist');

const { render } = await import(pathToFileURL(join(ROOT, 'dist-ssr/entry-server.js')).href);

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

const paths = [...STATIC_PATHS, ...collections.map(collectionPath)];

const outputFile = (path) => {
	if (path === '/') return 'home.html';
	// Amplify looks a request up by its decoded path, so "San Luis Obispo, CA" is written with
	// its space and comma rather than as %20 and %2C.
	return `${decodeURIComponent(path.slice(1))}.html`;
};

// Vite replaces %VITE_…% in index.html only when the variable is set, and leaves the
// placeholder in place otherwise. A shell shipped with one would point the preconnect at a
// relative path on this site, silently.
const unreplaced = template.match(/%VITE_\w+%/);
if (unreplaced) {
	throw new Error(`dist/index.html still contains ${unreplaced[0]}; is it set for this build?`);
}

for (const path of paths) {
	const html = await render(path);

	// The markers of an outlined Suspense boundary: the page emitted hidden after the footer,
	// for an inline script to move into place, which the CSP blocks. entry-server.tsx turns
	// outlining off; if one ever appears anyway, fail the build rather than ship a blank page.
	if (/<template|<script(?! type="application\/ld\+json")|\$RC|\$RT/.test(html)) {
		throw new Error(`${path} rendered a streamed Suspense boundary; see progressiveChunkSize in entry-server.tsx`);
	}

	// With no <html> or <head> in the tree, React emits the hoisted <title>, <meta> and <link>
	// elements first, then the app. App's root element is the first <div>.
	const split = html.indexOf('<div');
	const head = html.slice(0, split);
	const body = html.slice(split);

	if (split === -1 || head.replace(/<(title)[^>]*>[^<]*<\/title>|<(meta|link)\b[^>]*\/?>/g, '').trim() !== '') {
		throw new Error(`${path}: could not separate the hoisted head elements from the page`);
	}

	const page = template
		// React's <title> replaces the static one; main.tsx expects at most one.
		.replace(/<title>[^<]*<\/title>/, '')
		// Function replacements, because a string one reads "$&" and friends as patterns and the
		// page copy has dollar signs in it.
		.replace('</head>', () => `${head}</head>`)
		.replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);

	const file = join(DIST, outputFile(path));
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, page);
}

console.log(`prerender: ${paths.length} pages`);
