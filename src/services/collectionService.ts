import type { Photo, Collection } from '../types/photo';

// Collection size patterns for visual variety
const SIZE_PATTERNS = ['large', 'medium', 'small', 'medium', 'small', 'large', 'small', 'medium'] as const;

export const generateCollections = (photos: Photo[]): Collection[] => {
	if (photos.length === 0) return [];

	// Group photos by location first, then by category
	const locationGroups = groupPhotosByLocation(photos);
	const categoryGroups = groupPhotosByCategory(photos);

	const collections: Collection[] = [];

	// Create location-based collections
	Object.entries(locationGroups).forEach(([location, locationPhotos], index) => {
		if (locationPhotos.length >= 3) {
			// Only create collections with 3+ photos
			collections.push({
				id: `location-${location.toLowerCase().replace(/\s+/g, '-')}`,
				name: location,
				photos: locationPhotos,
				coverPhoto: selectBestCoverPhoto(locationPhotos),
				size: SIZE_PATTERNS[index % SIZE_PATTERNS.length],
				category: 'location',
			});
		}
	});

	// Create category-based collections for categories with enough photos
	Object.entries(categoryGroups).forEach(([category, categoryPhotos], index) => {
		if (categoryPhotos.length >= 5) {
			// Higher threshold for category collections
			// Skip if we already have a location collection with similar photos
			const hasOverlap = collections.some((col) => col.photos.some((photo) => categoryPhotos.includes(photo)));

			if (!hasOverlap || categoryPhotos.length > 10) {
				collections.push({
					id: `category-${category.toLowerCase().replace(/\s+/g, '-')}`,
					name: formatCategoryName(category),
					photos: categoryPhotos,
					coverPhoto: selectBestCoverPhoto(categoryPhotos),
					size: SIZE_PATTERNS[(collections.length + index) % SIZE_PATTERNS.length],
					category: 'theme',
				});
			}
		}
	});

	// Create special collections
	const specialCollections = createSpecialCollections(photos);
	collections.push(...specialCollections);

	// Sort collections by photo count (descending) and return
	return collections.sort((a, b) => b.photos.length - a.photos.length).slice(0, 12); // Limit to 12 collections for performance
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
	// Prefer photos with good aspect ratios and recent dates
	const sortedPhotos = [...photos].sort((a, b) => {
		// Prefer landscape photos for covers
		const aAspect = a.tags.aspectRatio as string;
		const bAspect = b.tags.aspectRatio as string;

		if (aAspect === '3:2' && bAspect !== '3:2') return -1;
		if (bAspect === '3:2' && aAspect !== '3:2') return 1;

		// Then by date (most recent first)
		return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
	});

	return sortedPhotos[0];
};

const formatCategoryName = (category: string): string => {
	// Convert category names to display format
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

	// Recent photos collection
	const recentPhotos = [...photos]
		.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
		.slice(0, 15);

	if (recentPhotos.length >= 5) {
		collections.push({
			id: 'recent',
			name: 'Recent',
			photos: recentPhotos,
			coverPhoto: recentPhotos[0],
			size: 'large',
			category: 'special',
		});
	}

	// Night photography collection
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
			id: 'night-photography',
			name: 'Night Photography',
			photos: nightPhotos,
			coverPhoto: selectBestCoverPhoto(nightPhotos),
			size: 'medium',
			category: 'special',
		});
	}

	// Graduation/Events collection
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
			id: 'events',
			name: 'Events & Celebrations',
			photos: eventPhotos,
			coverPhoto: selectBestCoverPhoto(eventPhotos),
			size: 'small',
			category: 'special',
		});
	}

	return collections;
};
