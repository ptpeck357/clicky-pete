import React from 'react';
import { DEFAULT_SHARE_IMAGE, SITE_NAME, SITE_URL } from '@/config/site';

interface SeoProps {
	/** Full <title>, written per page. Not suffixed here — some pages read better without one. */
	title: string;
	description: string;
	/** Canonical path, leading slash, no origin: '/gallery', '/gallery/Montana'. */
	path: string;
	/** Absolute URL. Falls back to the site's default share image. */
	image?: string;
	/** For pages that exist but should never be a search result — the 404, for one. */
	noIndex?: boolean;
}

/**
 * Per-page document metadata.
 *
 * React 19 hoists <title>, <meta> and <link> into <head> from wherever they are rendered, so
 * this needs no portal and no helmet dependency. scripts/prerender.mjs renders them into each
 * route's static HTML at build, for crawlers that never run JavaScript; main.tsx removes those
 * copies before React takes over, so the list of tags here and the selector there move together.
 */
export const Seo: React.FC<SeoProps> = ({ title, description, path, image, noIndex = false }) => {
	const url = `${SITE_URL}${path}`;
	const shareImage = image ?? DEFAULT_SHARE_IMAGE;

	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={url} />
			{noIndex && <meta name="robots" content="noindex, follow" />}

			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={SITE_NAME} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={url} />
			{shareImage && <meta property="og:image" content={shareImage} />}

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			{shareImage && <meta name="twitter:image" content={shareImage} />}
		</>
	);
};

/**
 * Structured data, rendered inline. React does not hoist a script with a non-JavaScript type,
 * so this stays where it is placed — which Google accepts anywhere in the document.
 *
 * `<` is escaped because the collection name comes straight from the URL: a `</script>` in it
 * would close this element early in any server-rendered or prerendered copy of the page.
 */
export const JsonLd: React.FC<{ data: object }> = ({ data }) => (
	<script
		type="application/ld+json"
		dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
	/>
);
