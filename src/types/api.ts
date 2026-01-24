export interface ApiResponse<T> {
	data?: T;
	message?: string;
	error?: string;
}

export interface PhotosResponse {
	images: Photo[];
	count: number;
}

export interface CategoriesResponse {
	categories: string[];
	count: number;
}

export interface UploadResponse {
	key: string;
	url: string;
	tags: Record<string, string | boolean>;
	message: string;
}

export interface Photo {
	key: string;
	lastModified: string;
	size: number;
	tags: Record<string, string | boolean>;
	preSignedUrl?: string;
}
