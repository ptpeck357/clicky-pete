import {
	BUSINESS_CITY,
	BUSINESS_REGION,
	BUSINESS_REGION_NAME,
	DEFAULT_SHARE_IMAGE,
	PHOTOGRAPHER_NAME,
	SITE_NAME,
	SITE_URL,
	SOCIAL_PROFILES,
} from '../../../config/site';

/**
 * The business, for local search. `areaServed` rather than a street address on purpose:
 * sessions happen wherever the client wants, and there is no studio to send anyone to.
 * `priceRange` mirrors the session prices on /contact loosely, which is all the field is for.
 */
export const businessSchema = {
	'@context': 'https://schema.org',
	'@type': 'ProfessionalService',
	'@id': `${SITE_URL}/#business`,
	name: SITE_NAME,
	alternateName: `${PHOTOGRAPHER_NAME} Photography`,
	description: `Portrait, graduation, family and engagement photography in ${BUSINESS_CITY}, ${BUSINESS_REGION_NAME}, alongside landscape and night work from across the Mountain West.`,
	url: SITE_URL,
	...(DEFAULT_SHARE_IMAGE ? { image: DEFAULT_SHARE_IMAGE } : {}),
	priceRange: '$$',
	address: {
		'@type': 'PostalAddress',
		addressLocality: BUSINESS_CITY,
		addressRegion: BUSINESS_REGION,
		addressCountry: 'US',
	},
	areaServed: [
		{ '@type': 'City', name: `${BUSINESS_CITY}, ${BUSINESS_REGION}` },
		{ '@type': 'AdministrativeArea', name: `Gallatin County, ${BUSINESS_REGION_NAME}` },
	],
	founder: {
		'@type': 'Person',
		name: PHOTOGRAPHER_NAME,
		jobTitle: 'Photographer',
		sameAs: Object.values(SOCIAL_PROFILES),
	},
	sameAs: Object.values(SOCIAL_PROFILES),
	makesOffer: ['Portrait session', 'Graduation session', 'Family session', 'Engagement session'].map((name) => ({
		'@type': 'Offer',
		itemOffered: { '@type': 'Service', name, serviceType: 'Photography' },
	})),
};

/**
 * Breadcrumbs for a collection view. Only built for `/gallery/:collection` — a two-item trail
 * on `/gallery` itself tells a search engine nothing it cannot see from the URL.
 */
export const collectionBreadcrumbSchema = (collection: string) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: [
		{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
		{ '@type': 'ListItem', position: 2, name: 'Gallery', item: `${SITE_URL}/gallery` },
		{
			'@type': 'ListItem',
			position: 3,
			name: collection,
			item: `${SITE_URL}/gallery/${encodeURIComponent(collection)}`,
		},
	],
});
