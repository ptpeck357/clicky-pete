import type { Photo } from '../types/photo';
import { shuffleArray } from './array';

export type SortOrder = 'newest' | 'oldest' | 'random';

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
	{ value: 'newest', label: 'Newest' },
	{ value: 'oldest', label: 'Oldest' },
	{ value: 'random', label: 'Random' },
];

/** Anything unrecognised in the URL falls back to the default rather than showing nothing. */
export const parseSortOrder = (value: string | null): SortOrder =>
	SORT_OPTIONS.some((option) => option.value === value) ? (value as SortOrder) : 'newest';

/** Dates are stored as YYYY-MM-DD, so comparing them as strings is comparing them as dates. */
const byDate = (a: Photo, b: Photo) => (a.tags.date ?? '').localeCompare(b.tags.date ?? '');

/**
 * Dated photos in date order, undated shuffled below them.
 *
 * Sorting the undated ones by position instead would freeze the gallery into manifest order
 * while most entries still have no date — the whole set, on the day this ships. Keeping them
 * shuffled means a photo joins the stable block when it gets a date, and the shuffled tail is
 * a visible measure of what is left to tag.
 */
export const sortPhotos = (photos: Photo[], order: SortOrder): Photo[] => {
	if (order === 'random') return shuffleArray(photos);

	const dated = photos.filter((photo) => photo.tags.date);
	const undated = photos.filter((photo) => !photo.tags.date);
	dated.sort(order === 'newest' ? (a, b) => byDate(b, a) : byDate);

	return [...dated, ...shuffleArray(undated)];
};
