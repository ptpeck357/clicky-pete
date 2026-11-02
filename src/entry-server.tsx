import React from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './app/App';

/**
 * Renders one route to HTML at build time, for scripts/prerender.mjs. `prerender` waits for
 * every lazy route chunk before resolving, so the HTML holds the whole page rather than the
 * Suspense fallback. Photos are fetched in effects, which never run here: a prerendered page
 * carries its copy and metadata, and the photos arrive once the client takes over.
 */
export async function render(url: string): Promise<string> {
	const { prelude } = await prerender(
		<React.StrictMode>
			<StaticRouter location={url}>
				<AppContent />
			</StaticRouter>
		</React.StrictMode>,
		// Above this size React outlines a finished Suspense boundary instead of inlining it:
		// the page is emitted after the footer, hidden, and moved into place by an inline
		// script — which script-src 'self' blocks. The default is a few kilobytes, so /contact
		// and /about would ship invisible without it.
		{ progressiveChunkSize: Number.POSITIVE_INFINITY },
	);

	return new Response(prelude).text();
}
