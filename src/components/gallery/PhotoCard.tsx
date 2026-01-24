import React, { useState } from 'react';
import type { Photo } from '../../types/photo';
import { Card } from '../ui/Card';

interface PhotoCardProps {
	photo: Photo;
	onClick?: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick }) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imageError, setImageError] = useState(false);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const formatFileSize = (bytes: number) => {
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		if (bytes === 0) return '0 Bytes';
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
	};

	return (
		<Card hover onClick={onClick}>
			<div className="relative aspect-square bg-gray-200 overflow-hidden">
				{!imageLoaded && !imageError && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
					</div>
				)}

				{imageError ? (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
						<div className="text-center text-gray-500">
							<svg
								className="mx-auto h-12 w-12 mb-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<p className="text-sm">Failed to load</p>
						</div>
					</div>
				) : (
					<img
						src={photo.preSignedUrl}
						alt={photo.tags.category || 'Photo'}
						className={`w-full h-full object-cover transition-opacity duration-200 ${
							imageLoaded ? 'opacity-100' : 'opacity-0'
						}`}
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageError(true)}
					/>
				)}

				{/* Overlay with tags */}
				<div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-end">
					<div className="p-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-200">
						{photo.tags.category && (
							<span className="inline-block bg-blue-600 text-xs px-2 py-1 rounded-full mb-2">
								{photo.tags.category}
							</span>
						)}
						{photo.tags.location && <p className="text-sm font-medium">{photo.tags.location}</p>}
					</div>
				</div>
			</div>

			{/* Photo info */}
			<div className="p-4">
				<div className="flex items-center justify-between text-sm text-gray-600 mb-2">
					<span>{formatDate(photo.lastModified)}</span>
					<span>{formatFileSize(photo.size)}</span>
				</div>

				<div className="flex flex-wrap gap-1">
					{Object.entries(photo.tags)
						.slice(0, 3)
						.map(([key, value]) => (
							<span
								key={key}
								className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
							>
								{key}: {value}
							</span>
						))}
					{Object.keys(photo.tags).length > 3 && (
						<span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
							+{Object.keys(photo.tags).length - 3} more
						</span>
					)}
				</div>
			</div>
		</Card>
	);
};
