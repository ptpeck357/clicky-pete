export interface Photo {
	id: string;
	file: string;
	tags: {
		category: string;
		location: string;
		collection: string;
		aspectRatio: string;
		/**
		 * YYYY-MM-DD, so a string compare is also a chronological one. Absent means the date is
		 * unknown: entries predating the field are never backfilled with a guess.
		 */
		date?: string;
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
