import { useState, useEffect, useCallback } from 'react';
import { photoService } from '../services/photoService';
import type { Photo, PhotoFilter } from '../types/photo';

export const usePhotos = (filter?: PhotoFilter) => {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPhotos = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

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

			// Apply search filter if provided
			if (filter?.search) {
				const searchTerm = filter.search.toLowerCase();
				fetchedPhotos = fetchedPhotos.filter(
					(photo) =>
						Object.values(photo.tags).some((tag) => {
							if (typeof tag === 'string') {
								return tag.toLowerCase().includes(searchTerm);
							}
							return false;
						}) || photo.key.toLowerCase().includes(searchTerm),
				);
			}

			setPhotos(fetchedPhotos);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch photos');
		} finally {
			setLoading(false);
		}
	}, [filter?.category, filter?.collection, filter?.location, filter?.search]);

	useEffect(() => {
		fetchPhotos();
	}, [fetchPhotos]);

	const refetch = () => {
		fetchPhotos();
	};

	return { photos, loading, error, refetch };
};
