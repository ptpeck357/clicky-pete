import type { Photo, Collection } from '../types/photo';

export const generateCollections = (photos: Photo[]): Collection[] => {
	if (photos.length === 0) return [];

	const collectionGroups = groupPhotosByCollection(photos);
	const collections: Collection[] = [];

	Object.entries(collectionGroups).forEach(([collectionName, collectionPhotos]) => {
		collections.push({
			name: collectionName,
			count: collectionPhotos.length,
			photos: collectionPhotos,
			coverPhoto: selectBestCoverPhoto(collectionPhotos),
		});
	});

	return collections.sort((a, b) => a.name.localeCompare(b.name));
};

const groupPhotosByCollection = (photos: Photo[]): Record<string, Photo[]> => {
	return photos.reduce(
		(groups, photo) => {
			const collection = photo.tags.collection;
			if (collection && collection.trim()) {
				const key = collection.trim();
				if (!groups[key]) groups[key] = [];
				groups[key].push(photo);
			}
			return groups;
		},
		{} as Record<string, Photo[]>,
	);
};

const selectBestCoverPhoto = (photos: Photo[]): Photo => {
	const explicitCover = photos.find((photo) => photo.tags.collectionCover === true);
	if (explicitCover) {
		return explicitCover;
	}

	const sortedPhotos = [...photos].sort((a, b) => {
		const aAspect = a.tags.aspectRatio;
		const bAspect = b.tags.aspectRatio;

		if (aAspect === '3:2' && bAspect !== '3:2') return -1;
		if (bAspect === '3:2' && aAspect !== '3:2') return 1;

		return b.id.localeCompare(a.id);
	});

	return sortedPhotos[0];
};
