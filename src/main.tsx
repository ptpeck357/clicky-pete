import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';

import './styles/globals.css';

// Every tag <Seo> writes, plus index.html's static <title>. A prerendered page carries the
// server's copies in <head>; the shell carries only the static title, kept for clients that
// never run this script. React 19 hoists each page's tags from <Seo> but never removes ones it
// did not create, so without this the rendered head carries two of each. Keep the list in step
// with Seo.tsx. An inline script in index.html would do it earlier, but script-src 'self' in
// customHttp.yml blocks inline script.
document
	.querySelectorAll(
		'head > title, head > meta[name="description"], head > meta[name="robots"], head > link[rel="canonical"], head > meta[property^="og:"], head > meta[name^="twitter:"]',
	)
	.forEach((element) => element.remove());

const root = document.getElementById('root')!;

const app = (
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// scripts/prerender.mjs fills #root for every route it knows. index.html, the fallback for
// everything else, leaves it empty.
if (root.hasChildNodes()) {
	ReactDOM.hydrateRoot(root, app);
} else {
	ReactDOM.createRoot(root).render(app);
}
