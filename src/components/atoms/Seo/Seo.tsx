import React from 'react';
import { DEFAULT_SHARE_IMAGE, SITE_NAME, SITE_URL } from '../../../config/site';

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
 * this needs no portal and no helmet dependency. What it cannot do is put them in the HTML
 * that leaves the server: the app is client-rendered, so a crawler that does not run
 * JavaScript — every social link-preview scraper — still sees the shell in index.html.
 * Prerendering is the open decision that fixes that; these tags are what it would emit.
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
 */
export const JsonLd: React.FC<{ data: object }> = ({ data }) => (
	<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);
