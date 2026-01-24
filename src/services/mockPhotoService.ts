import type { Photo } from '../types/photo';
import {
	mockPhotos,
	getPhotosByCategory,
	getPhotosByCollection,
	getCategories,
	getCollections,
	searchPhotos,
} from '../data/mockPhotos';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockPhotoService = {
	// Get all photos
	async getPhotos(prefix?: string): Promise<Photo[]> {
		console.log('mockPhotoService: getPhotos called with prefix:', prefix);
		console.log('mockPhotoService: mockPhotos length:', mockPhotos.length);

		await delay(500); // Simulate network delay

		// If prefix is provided, filter photos by key prefix
		if (prefix) {
			const filtered = mockPhotos.filter((photo) => photo.key.startsWith(prefix));
			console.log('mockPhotoService: filtered photos:', filtered.length);
			return filtered;
		}

		console.log('mockPhotoService: returning all photos:', mockPhotos.length);
		return mockPhotos;
	},

	// Get photos by tag
	async getPhotosByTag(tagKey: string, tagValue?: string): Promise<Photo[]> {
		await delay(300);

		if (tagKey === 'category' && tagValue) {
			return getPhotosByCategory(tagValue);
		}

		if (tagKey === 'collection' && tagValue) {
			return getPhotosByCollection(tagValue);
		}

		return mockPhotos.filter((photo) => {
			if (!photo.tags[tagKey]) return false;
			if (!tagValue) return true;
			const tagVal = photo.tags[tagKey];
			if (typeof tagVal === 'string') {
				return tagVal.toLowerCase() === tagValue.toLowerCase();
			}
			return false;
		});
	},

	// Get photo by key (simulate blob response)
	async getPhoto(key: string): Promise<Blob> {
		await delay(200);
		// In a real app, this would return the actual image blob
		// For now, we throw an error and suggest using preSignedUrl
		throw new Error(`Mock service: Use preSignedUrl instead for photo ${key}`);
	},

	// Get photo URL (return the preSignedUrl)
	async getPhotoUrl(key: string, expirationHours = 1): Promise<string> {
		await delay(100);
		const photo = mockPhotos.find((p) => p.key === key);
		if (!photo) throw new Error('Photo not found');

		// In a real implementation, expirationHours would be used to generate a time-limited URL
		// For mock, we just return the static URL but log the expiration for debugging
		console.log(`Mock: Generated URL for ${key} with ${expirationHours}h expiration`);

		return photo.preSignedUrl || '';
	},

	// Get photo tags
	async getPhotoTags(key: string): Promise<Record<string, string | boolean>> {
		await delay(100);
		const photo = mockPhotos.find((p) => p.key === key);
		if (!photo) throw new Error('Photo not found');
		return photo.tags;
	},

	// Update photo tags (mock - doesn't actually update)
	async updatePhotoTags(key: string, tags: Record<string, string | boolean>): Promise<void> {
		await delay(200);
		console.log(`Mock: Updated tags for ${key}:`, tags);
	},

	// Delete photo (mock - doesn't actually delete)
	async deletePhoto(key: string): Promise<void> {
		await delay(300);
		console.log(`Mock: Deleted photo ${key}`);
	},

	// Get all categories
	async getCategories(): Promise<string[]> {
		await delay(200);
		return getCategories();
	},

	// Get all collections
	async getCollections(): Promise<string[]> {
		await delay(200);
		return getCollections();
	},

	// Search photos
	async searchPhotos(query: string): Promise<Photo[]> {
		await delay(400);
		return searchPhotos(query);
	},
};
