import type { Photo } from '../types/photo';
import { shuffleWith } from './array';

export type SortOrder = 'newest' | 'oldest' | 'random';

const SORT_ORDERS: SortOrder[] = ['newest', 'oldest', 'random'];

/** Anything unrecognised in the URL falls back to the default rather than showing nothing. */
export const parseSortOrder = (value: string | null): SortOrder =>
	SORT_ORDERS.includes(value as SortOrder) ? (value as SortOrder) : 'newest';

/** Dates are stored as YYYY-MM-DD, so comparing them as strings is comparing them as dates. */
const byDate = (a: Photo, b: Photo) => (a.tags.date ?? '').localeCompare(b.tags.date ?? '');

/**
 * Seeded randomness, so an order is a function of its inputs: the same seed rebuilds the same
 * arrangement across re-renders, and a new seed is what produces a new one. `Math.random` here
 * would reshuffle on every render instead of on every click.
 */
const mulberry32 = (seed: number) => {
	let state = seed;
	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

/**
 * Dated photos in date order, undated shuffled below them.
 *
 * Sorting the undated ones by position instead would freeze the gallery into manifest order
 * while most entries still have no date — the whole set, on the day this ships. Keeping them
 * shuffled means a photo joins the stable block when it gets a date, and the shuffled tail is
 * a visible measure of what is left to tag.
 */
export const sortPhotos = (photos: Photo[], order: SortOrder, seed: number): Photo[] => {
	const random = mulberry32(seed);
	if (order === 'random') return shuffleWith(photos, random);

	const dated = photos.filter((photo) => photo.tags.date);
	const undated = photos.filter((photo) => !photo.tags.date);
	dated.sort(order === 'newest' ? (a, b) => byDate(b, a) : byDate);

	return [...dated, ...shuffleWith(undated, random)];
};
