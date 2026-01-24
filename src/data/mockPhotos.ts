import type { Photo } from '../types/photo';

// Using Unsplash for high-quality placeholder photos
export const mockPhotos: Photo[] = [
	// Idaho Collection
	{
		key: 'idaho-sawtooth-1',
		lastModified: '2024-01-15T10:30:00Z',
		size: 2048576,
		tags: {
			category: 'landscape',
			location: 'Sawtooth Mountains, Idaho',
			collection: 'Idaho',
			equipment: 'Canon EOS R5',
			uploaded: '2024-01-15',
			featured: true,
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
	},
	{
		key: 'idaho-boise-river-1',
		lastModified: '2024-01-14T14:20:00Z',
		size: 1536000,
		tags: {
			category: 'landscape',
			location: 'Boise River, Idaho',
			collection: 'Idaho',
			equipment: 'Sony A7R IV',
			uploaded: '2024-01-14',
			featured: true,
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
	},
	{
		key: 'idaho-craters-moon-1',
		lastModified: '2024-01-13T18:45:00Z',
		size: 1843200,
		tags: {
			category: 'landscape',
			location: 'Craters of the Moon, Idaho',
			collection: 'Idaho',
			equipment: 'Canon EOS R5',
			uploaded: '2024-01-13',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec3e5e?w=800&h=800&fit=crop',
	},

	// Montana Collection
	{
		key: 'montana-glacier-1',
		lastModified: '2024-01-12T08:15:00Z',
		size: 2304000,
		tags: {
			category: 'landscape',
			location: 'Glacier National Park, Montana',
			collection: 'Montana',
			equipment: 'Canon EOS R5',
			uploaded: '2024-01-12',
			featured: true,
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=800&fit=crop',
	},
	{
		key: 'montana-beartooth-1',
		lastModified: '2024-01-11T16:30:00Z',
		size: 1920000,
		tags: {
			category: 'landscape',
			location: 'Beartooth Highway, Montana',
			collection: 'Montana',
			equipment: 'Sony A7R IV',
			uploaded: '2024-01-11',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
	},
	{
		key: 'montana-yellowstone-1',
		lastModified: '2024-01-10T06:45:00Z',
		size: 2560000,
		tags: {
			category: 'landscape',
			location: 'Yellowstone, Montana',
			collection: 'Montana',
			equipment: 'Canon EOS R5',
			uploaded: '2024-01-10',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
	},

	// Drone Collection
	{
		key: 'drone-aerial-forest-1',
		lastModified: '2024-01-09T12:20:00Z',
		size: 2048000,
		tags: {
			category: 'aerial',
			location: 'Pacific Northwest',
			collection: 'Drone',
			equipment: 'DJI Mavic 3',
			uploaded: '2024-01-09',
			featured: true,
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=800&fit=crop',
	},
	{
		key: 'drone-coastal-1',
		lastModified: '2024-01-08T09:10:00Z',
		size: 1024000,
		tags: {
			category: 'aerial',
			location: 'Oregon Coast',
			collection: 'Drone',
			equipment: 'DJI Mavic 3',
			uploaded: '2024-01-08',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=800&fit=crop',
	},
	{
		key: 'drone-mountain-lake-1',
		lastModified: '2024-01-07T20:30:00Z',
		size: 1792000,
		tags: {
			category: 'aerial',
			location: 'Alpine Lake',
			collection: 'Drone',
			equipment: 'DJI Mavic 3',
			uploaded: '2024-01-07',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec3e5e?w=800&h=800&fit=crop',
	},

	// Street Photography Collection
	{
		key: 'street-tokyo-1',
		lastModified: '2024-01-06T15:45:00Z',
		size: 1638400,
		tags: {
			category: 'street',
			location: 'Tokyo, Japan',
			collection: 'Street',
			equipment: 'Fujifilm X-T4',
			uploaded: '2024-01-06',
			featured: true,
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=800&fit=crop',
	},
	{
		key: 'street-paris-1',
		lastModified: '2024-01-05T07:20:00Z',
		size: 2304000,
		tags: {
			category: 'street',
			location: 'Paris, France',
			collection: 'Street',
			equipment: 'Fujifilm X-T4',
			uploaded: '2024-01-05',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=800&fit=crop',
	},

	// Portrait Collection
	{
		key: 'portrait-studio-1',
		lastModified: '2024-01-04T13:15:00Z',
		size: 1536000,
		tags: {
			category: 'portrait',
			location: 'Studio',
			collection: 'Portraits',
			equipment: 'Canon EOS R5',
			uploaded: '2024-01-04',
			featured: true,
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?w=800&h=800&fit=crop',
	},
	{
		key: 'portrait-outdoor-1',
		lastModified: '2024-01-03T11:25:00Z',
		size: 1728000,
		tags: {
			category: 'portrait',
			location: 'Golden Gate Park',
			collection: 'Portraits',
			equipment: 'Sony A7R IV',
			uploaded: '2024-01-03',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
	},
];

// Helper function to get featured photos
export const getFeaturedPhotos = (): Photo[] => {
	return mockPhotos.filter((photo) => photo.tags.featured === true);
};

// Helper function to get photos by category
export const getPhotosByCategory = (category: string): Photo[] => {
	return mockPhotos.filter((photo) => photo.tags.category === category);
};

// Helper function to get photos by collection
export const getPhotosByCollection = (collection: string): Photo[] => {
	return mockPhotos.filter((photo) => photo.tags.collection === collection);
};

// Helper function to get unique categories
export const getCategories = (): string[] => {
	const categories = mockPhotos
		.map((photo) => photo.tags.category)
		.filter((category): category is string => typeof category === 'string');
	return [...new Set(categories)].sort();
};

// Helper function to get unique collections
export const getCollections = (): string[] => {
	const collections = mockPhotos
		.map((photo) => photo.tags.collection)
		.filter((collection): collection is string => typeof collection === 'string');
	return [...new Set(collections)].sort();
};

// Helper function to get collection stats
export const getCollectionStats = () => {
	const collections = getCollections();
	return collections.map((collection) => ({
		name: collection,
		count: getPhotosByCollection(collection).length,
		coverPhoto: getPhotosByCollection(collection)[0],
	}));
};

// Helper function to search photos
export const searchPhotos = (query: string): Photo[] => {
	const lowercaseQuery = query.toLowerCase();
	return mockPhotos.filter(
		(photo) =>
			Object.entries(photo.tags).some(([, value]) => {
				if (typeof value === 'string') {
					return value.toLowerCase().includes(lowercaseQuery);
				}
				return false;
			}) || photo.key.toLowerCase().includes(lowercaseQuery),
	);
};
