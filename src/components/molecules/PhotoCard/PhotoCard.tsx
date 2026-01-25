import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Spinner } from '../../atoms';
import type { Photo } from '../../../types/photo';

interface PhotoCardProps {
	photo: Photo;
	onClick?: () => void;
	className?: string;
	aspectRatio?: 'square' | 'natural';
	showMetadata?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
	photo,
	onClick,
	className = '',
	aspectRatio = 'square',
	showMetadata = true,
}) => {
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

	const getAspectClass = () => {
		if (aspectRatio === 'square') return 'aspect-square';

		const photoAspectRatio = (photo.tags.aspectRatio as string) || '3:2';
		if (photoAspectRatio === '3:4') return 'aspect-[3/4]';
		if (photoAspectRatio === '3:2') return 'aspect-[3/2]';
		return 'aspect-square';
	};

	return (
		<motion.div
			className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group ${className}`}
			onClick={onClick}
			whileHover={{
				y: -8,
				transition: { duration: 0.2, ease: 'easeOut' },
			}}
			whileTap={{ scale: 0.98 }}
			layout
		>
			<div className={`relative ${getAspectClass()} bg-gray-700 overflow-hidden`}>
				{!imageLoaded && !imageError && (
					<motion.div
						className="absolute inset-0 flex items-center justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<Spinner size="md" color="gray" />
					</motion.div>
				)}

				{imageError ? (
					<motion.div
						className="absolute inset-0 flex items-center justify-center bg-gray-700"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					>
						<div className="text-center text-gray-400">
							<motion.svg
								className="mx-auto h-12 w-12 mb-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: 'spring', stiffness: 200 }}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</motion.svg>
							<p className="text-sm">Failed to load</p>
						</div>
					</motion.div>
				) : (
					<motion.img
						src={photo.preSignedUrl}
						alt={(photo.tags.category as string) || 'Photo'}
						className="w-full h-full object-cover"
						initial={{ opacity: 0, scale: 1.1 }}
						animate={{
							opacity: imageLoaded ? 1 : 0,
							scale: imageLoaded ? 1 : 1.1,
						}}
						transition={{ duration: 0.6, ease: 'easeOut' }}
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageError(true)}
						whileHover={{ scale: 1.05 }}
					/>
				)}

				<motion.div
					className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end"
					initial={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
				>
					<motion.div
						className="p-4 text-white"
						initial={{ y: 20, opacity: 0 }}
						whileHover={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.1 }}
					>
						{photo.tags.category && (
							<motion.div
								initial={{ scale: 0.8, opacity: 0 }}
								whileHover={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.2 }}
							>
								<Tag variant="blue" size="sm">
									{photo.tags.category}
								</Tag>
							</motion.div>
						)}
						{photo.tags.location && (
							<motion.p
								className="text-sm font-medium mt-2"
								initial={{ y: 10, opacity: 0 }}
								whileHover={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.3 }}
							>
								{photo.tags.location}
							</motion.p>
						)}
					</motion.div>
				</motion.div>
			</div>

			{showMetadata && (
				<motion.div className="p-4" initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}>
					<div className="flex items-center justify-between text-sm text-gray-400 mb-2">
						<span>{formatDate(photo.lastModified)}</span>
						<span>{formatFileSize(photo.size)}</span>
					</div>

					<motion.div className="flex flex-wrap gap-1" initial={{ opacity: 0.7 }} whileHover={{ opacity: 1 }}>
						{Object.entries(photo.tags)
							.slice(0, 3)
							.map(([key, value], index) => (
								<motion.div
									key={key}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
								>
									<Tag variant="default" size="sm">
										{key}: {value}
									</Tag>
								</motion.div>
							))}
						{Object.keys(photo.tags).length > 3 && (
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3 }}
							>
								<Tag variant="default" size="sm">
									+{Object.keys(photo.tags).length - 3} more
								</Tag>
							</motion.div>
						)}
					</motion.div>
				</motion.div>
			)}
		</motion.div>
	);
};
