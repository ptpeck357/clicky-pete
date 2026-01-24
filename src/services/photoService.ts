import { apiClient } from './api';
import { mockPhotoService } from './mockPhotoService';
import type { Photo, PhotosResponse, CategoriesResponse } from '../types/api';

// Toggle between mock and real API
const USE_MOCK_DATA = import.meta.env?.VITE_USE_MOCK_DATA === 'true' || true; // Default to mock for development

export const photoService = {
	// Get all photos
	async getPhotos(prefix?: string): Promise<Photo[]> {
		console.log('photoService: getPhotos called with USE_MOCK_DATA:', USE_MOCK_DATA);

		if (USE_MOCK_DATA) {
			console.log('photoService: Using mock data');
			return mockPhotoService.getPhotos(prefix);
		}

		const params = prefix ? `?prefix=${encodeURIComponent(prefix)}` : '';
		const response = await apiClient.get<PhotosResponse>(`/images${params}`);
		return response.images;
	},

	// Get photos by tag
	async getPhotosByTag(tagKey: string, tagValue?: string): Promise<Photo[]> {
		if (USE_MOCK_DATA) {
			return mockPhotoService.getPhotosByTag(tagKey, tagValue);
		}

		const params = tagValue ? `?tagValue=${encodeURIComponent(tagValue)}` : '';
		const response = await apiClient.get<PhotosResponse>(`/images/by-tag/${tagKey}${params}`);
		return response.images;
	},

	// Get photo by key
	async getPhoto(key: string): Promise<Blob> {
		if (USE_MOCK_DATA) {
			return mockPhotoService.getPhoto(key);
		}

		const response = await fetch(`${import.meta.env?.VITE_API_URL || 'https://localhost:7000/api'}/images/${key}`);
		if (!response.ok) {
			throw new Error('Failed to fetch photo');
		}
		return response.blob();
	},

	// Get photo URL
	async getPhotoUrl(key: string, expirationHours = 1): Promise<string> {
		if (USE_MOCK_DATA) {
			return mockPhotoService.getPhotoUrl(key, expirationHours);
		}

		const response = await apiClient.get<{ url: string }>(`/images/${key}/url?expirationHours=${expirationHours}`);
		return response.url;
	},

	// Get photo tags
	async getPhotoTags(key: string): Promise<Record<string, string | boolean>> {
		if (USE_MOCK_DATA) {
			return mockPhotoService.getPhotoTags(key);
		}

		const response = await apiClient.get<{ tags: Record<string, string | boolean> }>(`/images/${key}/tags`);
		return response.tags;
	},

	// Update photo tags
	async updatePhotoTags(key: string, tags: Record<string, string | boolean>): Promise<void> {
		if (USE_MOCK_DATA) {
			return mockPhotoService.updatePhotoTags(key, tags);
		}

		await apiClient.put(`/images/${key}/tags`, tags);
	},

	// Delete photo
	async deletePhoto(key: string): Promise<void> {
		if (USE_MOCK_DATA) {
			return mockPhotoService.deletePhoto(key);
		}

		await apiClient.delete(`/images/${key}`);
	},

	// Get all categories
	async getCategories(): Promise<string[]> {
		if (USE_MOCK_DATA) {
			return mockPhotoService.getCategories();
		}

		const response = await apiClient.get<CategoriesResponse>('/images/categories');
		return response.categories;
	},

	// Get all collections
	async getCollections(): Promise<string[]> {
		if (USE_MOCK_DATA) {
			return mockPhotoService.getCollections();
		}

		const response = await apiClient.get<{ collections: string[] }>('/images/collections');
		return response.collections;
	},

	// Search photos
	async searchPhotos(query: string): Promise<Photo[]> {
		if (USE_MOCK_DATA) {
			return mockPhotoService.searchPhotos(query);
		}

		// For real API, we'd implement search on the backend
		const allPhotos = await this.getPhotos();
		return allPhotos.filter(
			(photo) =>
				Object.values(photo.tags).some(
					(tag) => typeof tag === 'string' && tag.toLowerCase().includes(query.toLowerCase()),
				) || photo.key.toLowerCase().includes(query.toLowerCase()),
		);
	},
};
