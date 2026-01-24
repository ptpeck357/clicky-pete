import React from 'react';
import type { Photo } from '../../types/photo';
import { PhotoCard } from './PhotoCard';
import { LoadingGrid } from '../ui/Loading';

interface PhotoGridProps {
	photos: Photo[];
	loading?: boolean;
	onPhotoClick?: (photo: Photo) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, loading = false, onPhotoClick }) => {
	if (loading) {
		return <LoadingGrid />;
	}

	if (photos.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-gray-500 text-lg mb-2">No photos found</div>
				<p className="text-gray-400">Try adjusting your filters or upload some photos.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{photos.map((photo) => (
				<PhotoCard key={photo.key} photo={photo} onClick={() => onPhotoClick?.(photo)} />
			))}
		</div>
	);
};
