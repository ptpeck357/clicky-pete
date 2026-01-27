import type { Photo } from '../types/photo';
import {
	mockPhotos,
	getPhotosByCategory,
	getPhotosByCollection,
	getCategories,
	getCollections,
} from '../data/mockPhotos';

export const mockPhotoService = {
	async getPhotos(prefix?: string): Promise<Photo[]> {
		console.log('mockPhotoService: getPhotos called with prefix:', prefix);
		console.log('mockPhotoService: mockPhotos length:', mockPhotos.length);

		if (prefix) {
			const filtered = mockPhotos.filter((photo) => photo.key.startsWith(prefix));
			console.log('mockPhotoService: filtered photos:', filtered.length);
			return filtered;
		}

		console.log('mockPhotoService: returning all photos:', mockPhotos.length);
		return mockPhotos;
	},

	async getPhotosByTag(tagKey: string, tagValue?: string): Promise<Photo[]> {
		console.log('mockPhotoService: getPhotosByTag called with:', { tagKey, tagValue });

		if (tagKey === 'category' && tagValue) {
			const result = getPhotosByCategory(tagValue);
			console.log('mockPhotoService: category filter result:', result.length);
			return result;
		}

		if (tagKey === 'collection' && tagValue) {
			const result = getPhotosByCollection(tagValue);
			console.log('mockPhotoService: collection filter result:', { tagValue, count: result.length });
			return result;
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

	async getPhoto(key: string): Promise<Blob> {
		throw new Error(`Mock service: Use preSignedUrl instead for photo ${key}`);
	},

	async getPhotoUrl(key: string, expirationHours = 1): Promise<string> {
		const photo = mockPhotos.find((p) => p.key === key);
		if (!photo) throw new Error('Photo not found');

		console.log(`Mock: Generated URL for ${key} with ${expirationHours}h expiration`);

		return photo.preSignedUrl || '';
	},

	async getPhotoTags(key: string): Promise<Record<string, string | boolean>> {
		const photo = mockPhotos.find((p) => p.key === key);
		if (!photo) throw new Error('Photo not found');
		return photo.tags;
	},

	async updatePhotoTags(key: string, tags: Record<string, string | boolean>): Promise<void> {
		console.log(`Mock: Updated tags for ${key}:`, tags);
	},

	async deletePhoto(key: string): Promise<void> {
		console.log(`Mock: Deleted photo ${key}`);
	},

	async getCategories(): Promise<string[]> {
		return getCategories();
	},

	async getCollections(): Promise<string[]> {
		return getCollections();
	},
};
