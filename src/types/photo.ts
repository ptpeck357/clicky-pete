export interface Photo {
	id: string;
	file: string;
	tags: {
		category: string;
		location: string;
		collection: string;
		aspectRatio: string;
		featured?: boolean;
		hero?: boolean;
		collectionCover?: boolean;
	};
}

export interface Collection {
	name: string;
	count: number;
	coverPhoto: Photo;
	photos: Photo[];
	description?: string;
}

export interface PhotoFilter {
	category?: string;
	location?: string;
	collection?: string;
}
