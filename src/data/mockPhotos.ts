import type { Photo } from '../types/photo';

// Using Unsplash for high-quality placeholder photos
export const mockPhotos: Photo[] = [
	{
		key: 'landscape-1',
		lastModified: '2024-01-15T10:30:00Z',
		size: 2048576,
		tags: {
			category: 'landscape',
			location: 'Yosemite National Park',
			equipment: 'Canon EOS R5',
			style: 'golden-hour',
			uploaded: '2024-01-15',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
	},
	{
		key: 'portrait-1',
		lastModified: '2024-01-14T14:20:00Z',
		size: 1536000,
		tags: {
			category: 'portrait',
			location: 'Studio',
			equipment: 'Sony A7R IV',
			style: 'dramatic-lighting',
			uploaded: '2024-01-14',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?w=800&h=800&fit=crop',
	},
	{
		key: 'street-1',
		lastModified: '2024-01-13T18:45:00Z',
		size: 1843200,
		tags: {
			category: 'street',
			location: 'Tokyo',
			equipment: 'Fujifilm X-T4',
			style: 'neon-lights',
			uploaded: '2024-01-13',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=800&fit=crop',
	},
	{
		key: 'nature-1',
		lastModified: '2024-01-12T08:15:00Z',
		size: 2304000,
		tags: {
			category: 'nature',
			location: 'Pacific Northwest',
			equipment: 'Canon EOS R5',
			style: 'misty-forest',
			uploaded: '2024-01-12',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
	},
	{
		key: 'architecture-1',
		lastModified: '2024-01-11T16:30:00Z',
		size: 1920000,
		tags: {
			category: 'architecture',
			location: 'New York City',
			equipment: 'Sony A7R IV',
			style: 'modern-geometric',
			uploaded: '2024-01-11',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=800&fit=crop',
	},
	{
		key: 'landscape-2',
		lastModified: '2024-01-10T06:45:00Z',
		size: 2560000,
		tags: {
			category: 'landscape',
			location: 'Iceland',
			equipment: 'Canon EOS R5',
			style: 'aurora-borealis',
			uploaded: '2024-01-10',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=800&fit=crop',
	},
	{
		key: 'wildlife-1',
		lastModified: '2024-01-09T12:20:00Z',
		size: 2048000,
		tags: {
			category: 'wildlife',
			location: 'Serengeti',
			equipment: 'Canon EOS R5',
			style: 'telephoto',
			uploaded: '2024-01-09',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=800&fit=crop',
	},
	{
		key: 'macro-1',
		lastModified: '2024-01-08T09:10:00Z',
		size: 1024000,
		tags: {
			category: 'macro',
			location: 'Garden',
			equipment: 'Sony A7R IV',
			style: 'close-up',
			uploaded: '2024-01-08',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop',
	},
	{
		key: 'street-2',
		lastModified: '2024-01-07T20:30:00Z',
		size: 1792000,
		tags: {
			category: 'street',
			location: 'Paris',
			equipment: 'Fujifilm X-T4',
			style: 'black-white',
			uploaded: '2024-01-07',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=800&fit=crop',
	},
	{
		key: 'portrait-2',
		lastModified: '2024-01-06T15:45:00Z',
		size: 1638400,
		tags: {
			category: 'portrait',
			location: 'Outdoor',
			equipment: 'Canon EOS R5',
			style: 'natural-light',
			uploaded: '2024-01-06',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
	},
	{
		key: 'landscape-3',
		lastModified: '2024-01-05T07:20:00Z',
		size: 2304000,
		tags: {
			category: 'landscape',
			location: 'Swiss Alps',
			equipment: 'Sony A7R IV',
			style: 'mountain-peak',
			uploaded: '2024-01-05',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec3e5e?w=800&h=800&fit=crop',
	},
	{
		key: 'abstract-1',
		lastModified: '2024-01-04T13:15:00Z',
		size: 1536000,
		tags: {
			category: 'abstract',
			location: 'Studio',
			equipment: 'Canon EOS R5',
			style: 'color-splash',
			uploaded: '2024-01-04',
		},
		preSignedUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=800&fit=crop',
	},
];

// Helper function to get photos by category
export const getPhotosByCategory = (category: string): Photo[] => {
	return mockPhotos.filter((photo) => photo.tags.category === category);
};

// Helper function to get unique categories
export const getCategories = (): string[] => {
	const categories = mockPhotos.map((photo) => photo.tags.category);
	return [...new Set(categories)].sort();
};

// Helper function to search photos
export const searchPhotos = (query: string): Photo[] => {
	const lowercaseQuery = query.toLowerCase();
	return mockPhotos.filter(
		(photo) =>
			Object.values(photo.tags).some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
			photo.key.toLowerCase().includes(lowercaseQuery),
	);
};
