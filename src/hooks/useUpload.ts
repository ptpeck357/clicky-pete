import { useState } from 'react';
import { uploadService } from '../services/uploadService';
import type { PhotoUpload } from '../types/photo';
import type { UploadResponse } from '../types/api';

export const useUpload = () => {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const uploadPhoto = async (upload: PhotoUpload): Promise<UploadResponse | null> => {
		try {
			setUploading(true);
			setError(null);
			setProgress(0);

			// Simulate progress for better UX
			const progressInterval = setInterval(() => {
				setProgress((prev) => Math.min(prev + 10, 90));
			}, 200);

			const result = await uploadService.uploadPhoto(upload);

			clearInterval(progressInterval);
			setProgress(100);

			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Upload failed');
			return null;
		} finally {
			setUploading(false);
			setTimeout(() => setProgress(0), 1000);
		}
	};

	const uploadMultiplePhotos = async (uploads: PhotoUpload[]): Promise<UploadResponse[]> => {
		try {
			setUploading(true);
			setError(null);
			setProgress(0);

			const results = await uploadService.uploadMultiplePhotos(uploads);
			setProgress(100);

			return results;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Upload failed');
			return [];
		} finally {
			setUploading(false);
			setTimeout(() => setProgress(0), 1000);
		}
	};

	return {
		uploadPhoto,
		uploadMultiplePhotos,
		uploading,
		progress,
		error,
	};
};
