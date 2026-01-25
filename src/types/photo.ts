export interface Photo {
	key: string;
	lastModified: string;
	size: number;
	tags: Record<string, string | boolean>;
	preSignedUrl?: string;
}

export interface Collection {
	name: string;
	count: number;
	coverPhoto: Photo;
	photos: Photo[];
	description?: string;
}

export interface PhotoUpload {
	file: File;
	category?: string;
	location?: string;
	customKey?: string;
}

export interface PhotoFilter {
	category?: string;
	location?: string;
	collection?: string;
	search?: string;
}
