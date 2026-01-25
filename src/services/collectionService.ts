import type { Photo, Collection } from '../types/photo';

export const generateCollections = (photos: Photo[]): Collection[] => {
	if (photos.length === 0) return [];

	const locationGroups = groupPhotosByLocation(photos);
	const categoryGroups = groupPhotosByCategory(photos);

	const collections: Collection[] = [];

	Object.entries(locationGroups).forEach(([location, locationPhotos]) => {
		if (locationPhotos.length >= 3) {
			collections.push({
				name: location,
				count: locationPhotos.length,
				photos: locationPhotos,
				coverPhoto: selectBestCoverPhoto(locationPhotos),
			});
		}
	});

	Object.entries(categoryGroups).forEach(([category, categoryPhotos]) => {
		if (categoryPhotos.length >= 5) {
			const hasOverlap = collections.some((col) => col.photos.some((photo) => categoryPhotos.includes(photo)));

			if (!hasOverlap || categoryPhotos.length > 10) {
				collections.push({
					name: formatCategoryName(category),
					count: categoryPhotos.length,
					photos: categoryPhotos,
					coverPhoto: selectBestCoverPhoto(categoryPhotos),
				});
			}
		}
	});

	const specialCollections = createSpecialCollections(photos);
	collections.push(...specialCollections);

	return collections.sort((a, b) => b.photos.length - a.photos.length).slice(0, 12);
};

const groupPhotosByLocation = (photos: Photo[]): Record<string, Photo[]> => {
	return photos.reduce(
		(groups, photo) => {
			const location = photo.tags.location as string;
			if (location && location.trim()) {
				const key = location.trim();
				if (!groups[key]) groups[key] = [];
				groups[key].push(photo);
			}
			return groups;
		},
		{} as Record<string, Photo[]>,
	);
};

const groupPhotosByCategory = (photos: Photo[]): Record<string, Photo[]> => {
	return photos.reduce(
		(groups, photo) => {
			const category = photo.tags.category as string;
			if (category && category.trim()) {
				const key = category.trim();
				if (!groups[key]) groups[key] = [];
				groups[key].push(photo);
			}
			return groups;
		},
		{} as Record<string, Photo[]>,
	);
};

const selectBestCoverPhoto = (photos: Photo[]): Photo => {
	const sortedPhotos = [...photos].sort((a, b) => {
		const aAspect = a.tags.aspectRatio as string;
		const bAspect = b.tags.aspectRatio as string;

		if (aAspect === '3:2' && bAspect !== '3:2') return -1;
		if (bAspect === '3:2' && aAspect !== '3:2') return 1;

		return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
	});

	return sortedPhotos[0];
};

const formatCategoryName = (category: string): string => {
	const categoryMap: Record<string, string> = {
		landscape: 'Landscapes',
		portrait: 'Portraits',
		street: 'Street Photography',
		aerial: 'Drone Photography',
		wildlife: 'Wildlife',
		architecture: 'Architecture',
		nature: 'Nature',
		urban: 'Urban',
		travel: 'Travel',
		night: 'Night Photography',
	};

	return categoryMap[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);
};

const createSpecialCollections = (photos: Photo[]): Collection[] => {
	const collections: Collection[] = [];

	const recentPhotos = [...photos]
		.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
		.slice(0, 15);

	if (recentPhotos.length >= 5) {
		collections.push({
			name: 'Recent',
			count: recentPhotos.length,
			photos: recentPhotos,
			coverPhoto: recentPhotos[0],
		});
	}

	const nightPhotos = photos.filter((photo) => {
		const category = photo.tags.category as string;
		const tags = Object.values(photo.tags).join(' ').toLowerCase();
		return (
			category?.toLowerCase().includes('night') ||
			tags.includes('night') ||
			tags.includes('dark') ||
			tags.includes('evening')
		);
	});

	if (nightPhotos.length >= 3) {
		collections.push({
			name: 'Night Photography',
			count: nightPhotos.length,
			photos: nightPhotos,
			coverPhoto: selectBestCoverPhoto(nightPhotos),
		});
	}

	const eventPhotos = photos.filter((photo) => {
		const tags = Object.values(photo.tags).join(' ').toLowerCase();
		return (
			tags.includes('graduation') ||
			tags.includes('event') ||
			tags.includes('ceremony') ||
			tags.includes('celebration')
		);
	});

	if (eventPhotos.length >= 3) {
		collections.push({
			name: 'Events & Celebrations',
			count: eventPhotos.length,
			photos: eventPhotos,
			coverPhoto: selectBestCoverPhoto(eventPhotos),
		});
	}

	return collections;
};
