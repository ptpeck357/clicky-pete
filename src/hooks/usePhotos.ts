import { useState, useEffect, useCallback, useRef } from 'react';
import { photoService } from '@/services/photoService';
import type { Photo, PhotoFilter } from '@/types/photo';

// One shared empty list, so a pending fetch does not hand memoised callers a new array per render.
const NO_PHOTOS: Photo[] = [];

const keyOf = (filter?: PhotoFilter) =>
	`${filter?.category ?? ''}|${filter?.collection ?? ''}|${filter?.location ?? ''}`;

export const usePhotos = (filter?: PhotoFilter) => {
	const filterKey = keyOf(filter);
	// Photos and errors are stored with the filter they belong to. Until the current filter's
	// fetch lands, the hook reports loading and no photos, rather than the previous view's —
	// which otherwise rendered for a frame and fed the random cover pick on a collection page.
	const [result, setResult] = useState<{ key: string; photos: Photo[] } | null>(null);
	const [failure, setFailure] = useState<{ key: string; message: string } | null>(null);
	const [loading, setLoading] = useState(true);
	// The latest request. Fetches are not cancelled, so one that resolves after a newer request
	// started is dropped instead of overwriting it.
	const latestRequestRef = useRef(0);

	const fetchPhotos = useCallback(async () => {
		const request = ++latestRequestRef.current;
		const key = keyOf({ category: filter?.category, collection: filter?.collection, location: filter?.location });
		try {
			setLoading(true);
			setFailure(null);

			let fetchedPhotos: Photo[];

			if (filter?.category) {
				fetchedPhotos = await photoService.getPhotosByTag('category', filter.category);
			} else if (filter?.collection) {
				fetchedPhotos = await photoService.getPhotosByTag('collection', filter.collection);
			} else if (filter?.location) {
				fetchedPhotos = await photoService.getPhotosByTag('location', filter.location);
			} else {
				fetchedPhotos = await photoService.getPhotos();
			}

			if (request !== latestRequestRef.current) return;
			setResult({ key, photos: fetchedPhotos });
		} catch (err) {
			if (request !== latestRequestRef.current) return;
			setFailure({ key, message: err instanceof Error ? err.message : 'Failed to fetch photos' });
		} finally {
			if (request === latestRequestRef.current) setLoading(false);
		}
	}, [filter?.category, filter?.collection, filter?.location]);

	useEffect(() => {
		fetchPhotos();
	}, [fetchPhotos]);

	const refetch = () => {
		fetchPhotos();
	};

	const isCurrent = result?.key === filterKey;
	const error = failure?.key === filterKey ? failure.message : null;
	return {
		photos: isCurrent ? result.photos : NO_PHOTOS,
		loading: loading || (!isCurrent && !error),
		error,
		refetch,
	};
};
