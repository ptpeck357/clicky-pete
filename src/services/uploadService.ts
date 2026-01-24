import { apiClient } from './api';
import type { PhotoUpload } from '../types/photo';
import type { UploadResponse } from '../types/api';

export const uploadService = {
	async uploadPhoto(upload: PhotoUpload): Promise<UploadResponse> {
		const formData = new FormData();
		formData.append('file', upload.file);

		// Build query parameters
		const params = new URLSearchParams();
		if (upload.customKey) params.append('customKey', upload.customKey);
		if (upload.category) params.append('category', upload.category);
		if (upload.location) params.append('location', upload.location);
		if (upload.equipment) params.append('equipment', upload.equipment);
		if (upload.style) params.append('style', upload.style);

		const queryString = params.toString();
		const endpoint = `/images/upload${queryString ? `?${queryString}` : ''}`;

		return apiClient.post<UploadResponse>(endpoint, formData);
	},

	async uploadMultiplePhotos(uploads: PhotoUpload[]): Promise<UploadResponse[]> {
		const uploadPromises = uploads.map((upload) => this.uploadPhoto(upload));
		return Promise.all(uploadPromises);
	},
};
