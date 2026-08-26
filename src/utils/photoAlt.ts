import type { Photo } from '../types/photo';

/**
 * Alt text describing an actual photo, rather than the one word its category happens to be.
 *
 * Every thumbnail used to read `alt="Landscape"`, several hundred times over, which is worth
 * nothing to a screen reader and nothing to image search. The manifest already carries where
 * the photo was taken and what it belongs to, so the sentence is composed rather than typed:
 *
 *   Landscape photography in Horse Prairie, MT — Montana collection
 *
 * Anything missing is dropped rather than guessed, since a fair number of entries predate
 * one field or another.
 */
export const describePhoto = (photo: Photo): string => {
	const { category, location, collection } = photo.tags;

	const subject = category ? `${category} photography` : 'Photograph';
	const place = location ? ` in ${location}` : '';
	// The collection is only worth appending when it says something the location did not.
	const series = collection && collection !== location ? ` — ${collection} collection` : '';

	return `${subject}${place}${series}`;
};
