import { useMemo } from 'react';
import { usePhotos } from './usePhotos';
import { generateCollections } from '../services/collectionService';

export const useCollections = () => {
	const { photos, loading: photosLoading, error: photosError } = usePhotos({});

	// Generate collections when photos change
	const collections = useMemo(() => {
		if (photosLoading || photos.length === 0) {
			return [];
		}
		return generateCollections(photos);
	}, [photos, photosLoading]);

	return {
		collections,
		loading: photosLoading,
		error: photosError,
	};
};
