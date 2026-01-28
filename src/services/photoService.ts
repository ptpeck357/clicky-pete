import { cloudFrontPhotoService } from './cloudFrontPhotoService';
import type { Photo } from '../types/photo';

export const photoService = {
	async getPhotos(): Promise<Photo[]> {
		return await cloudFrontPhotoService.getPhotos();
	},

	async getPhotosByTag(tagKey: string, tagValue?: string): Promise<Photo[]> {
		return await cloudFrontPhotoService.getPhotosByTag(tagKey, tagValue || '');
	},

	async getCategories(): Promise<string[]> {
		return await cloudFrontPhotoService.getCategories();
	},

	async getCollections(): Promise<string[]> {
		return await cloudFrontPhotoService.getCollections();
	},

	async getFeaturedPhotos(): Promise<Photo[]> {
		return await cloudFrontPhotoService.getFeaturedPhotos();
	},

	async getHeroPhotos(): Promise<Photo[]> {
		return await cloudFrontPhotoService.getHeroPhotos();
	},

	getResponsivePhotoUrl(photo: Photo, targetWidth?: number): string {
		return cloudFrontPhotoService.getResponsivePhotoUrl(photo, targetWidth);
	},
};
