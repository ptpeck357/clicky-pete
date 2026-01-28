import type { Photo } from '../types/photo';

const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL || '';
const PHOTOS_JSON_PATH = '/data/photos.json';

export const cloudFrontPhotoService = {
	async getPhotos(): Promise<Photo[]> {
		if (!CLOUDFRONT_URL) {
			throw new Error(
				'CloudFront URL not configured. Please set VITE_CLOUDFRONT_URL in your environment variables.',
			);
		}

		try {
			const response = await fetch(`${CLOUDFRONT_URL}${PHOTOS_JSON_PATH}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch photos: ${response.status} ${response.statusText}`);
			}

			const photos: Photo[] = await response.json();
			return photos;
		} catch (error) {
			console.error('Failed to fetch photos from CloudFront:', error);
			throw error;
		}
	},

	async getPhotosByTag(tagKey: string, tagValue: string): Promise<Photo[]> {
		const allPhotos = await this.getPhotos();
		return allPhotos.filter((photo) => {
			const tagVal = photo.tags[tagKey as keyof typeof photo.tags];
			return tagVal === tagValue || (typeof tagVal === 'boolean' && tagVal.toString() === tagValue);
		});
	},

	async getCategories(): Promise<string[]> {
		const allPhotos = await this.getPhotos();
		const categories = allPhotos
			.map((photo) => photo.tags.category)
			.filter((category) => category && category.length > 0);
		return [...new Set(categories)].sort();
	},

	async getCollections(): Promise<string[]> {
		const allPhotos = await this.getPhotos();
		const collections = allPhotos
			.map((photo) => photo.tags.collection)
			.filter((collection) => collection && collection.length > 0);
		return [...new Set(collections)].sort();
	},

	async getFeaturedPhotos(): Promise<Photo[]> {
		const allPhotos = await this.getPhotos();
		return allPhotos.filter((photo) => photo.tags.featured === true);
	},

	async getHeroPhotos(): Promise<Photo[]> {
		const allPhotos = await this.getPhotos();
		return allPhotos.filter((photo) => photo.tags.hero === true);
	},

	getPhotoUrl(photo: Photo, size: 'small' | 'medium' | 'large' = 'medium'): string {
		if (!CLOUDFRONT_URL) {
			throw new Error(
				'CloudFront URL not configured. Please set VITE_CLOUDFRONT_URL in your environment variables.',
			);
		}

		const sizeMap = {
			small: '400',
			medium: '800',
			large: '2000',
		};

		return `${CLOUDFRONT_URL}/photos/${sizeMap[size]}/${photo.file}`;
	},

	getResponsivePhotoUrl(photo: Photo, targetWidth?: number): string {
		if (!CLOUDFRONT_URL) {
			throw new Error(
				'CloudFront URL not configured. Please set VITE_CLOUDFRONT_URL in your environment variables.',
			);
		}

		let size: 'small' | 'medium' | 'large' = 'medium';

		if (targetWidth) {
			if (targetWidth <= 400) {
				size = 'small';
			} else if (targetWidth <= 800) {
				size = 'medium';
			} else {
				size = 'large';
			}
		}

		return this.getPhotoUrl(photo, size);
	},
};
