/**
 * Facts about the site itself, as opposed to the photos on it. Everything here ends up in
 * metadata, structured data, or the sitemap, and all three have to agree, so they read it
 * from one place.
 */

/**
 * The site's own origin — not the CloudFront host the photos load from. The apex 302s to
 * www, so www is where a visitor actually lands; a canonical pointing at the apex would
 * point at a redirect. If the domain is ever flipped to prefer the apex (an Amplify setting,
 * not a code change), this line is the only thing that moves.
 */
export const SITE_URL = 'https://www.clickypete.photography';

export const SITE_NAME = 'Clicky Pete Photography';

export const PHOTOGRAPHER_NAME = 'Peter Peck';

/** Where sessions are shot. Used in copy, metadata and the structured data alike. */
export const BUSINESS_CITY = 'Bozeman';
export const BUSINESS_REGION = 'MT';
export const BUSINESS_REGION_NAME = 'Montana';

/** Also rendered as the footer's icon row — Footer imports these rather than repeating them. */
export const SOCIAL_PROFILES = {
	instagram: 'https://instagram.com/clicky_pete',
	youtube: 'https://www.youtube.com/@ptpeck357',
	linkedin: 'https://www.linkedin.com/in/petertpeck/',
} as const;

/**
 * Absolute URL for a share image. Relative paths are refused by every crawler that renders a
 * link preview, and the photos are not served from this origin.
 */
export const photoShareUrl = (file: string): string | undefined => {
	const base = import.meta.env.VITE_CLOUDFRONT_URL;
	return base ? `${base}/photos/2000/${file}` : undefined;
};

/**
 * One fixed hero entry rather than a random pick, so a link to the site previews the same
 * way every time it is shared. `IMG_4350.webp` is a 3:2 Montana hero, which crops acceptably
 * to the 1.91:1 that Facebook and Slack use.
 */
export const DEFAULT_SHARE_IMAGE = photoShareUrl('IMG_4350.webp');
