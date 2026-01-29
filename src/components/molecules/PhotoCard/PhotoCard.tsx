import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tag } from '../../atoms';
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
	const [imageError, setImageError] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const [tagsExpanded, setTagsExpanded] = useState(false);
	const [shouldLoad] = useState(true);
	const imgRef = useRef<HTMLDivElement>(null);

	const handleImageError = useCallback(() => {
		if (retryCount < 2) {
			setRetryCount((prev) => prev + 1);
		} else {
			setImageError(true);
		}
	}, [retryCount]);

	const handleImageLoad = useCallback(() => {
		setImageLoaded(true);
	}, []);

	const getPhotoUrls = () => {
		const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;
		if (!cloudFrontUrl) {
			throw new Error(
				'CloudFront URL not configured. Please set VITE_CLOUDFRONT_URL in your environment variables.',
			);
		}

		const baseUrl = `${cloudFrontUrl}/photos`;
		return {
			src: `${baseUrl}/800/${photo.file}`, // Default/fallback
			srcSet: `${baseUrl}/400/${photo.file} 400w, ${baseUrl}/800/${photo.file} 800w, ${baseUrl}/2000/${photo.file} 2000w`,
			sizes: '(max-width: 640px) 400px, (max-width: 1024px) 800px, 2000px',
		};
	};

	const photoUrls = getPhotoUrls();

	const getImageDimensions = () => {
		if (aspectRatio !== 'natural') return {};

		const photoAspectRatio = photo.tags.aspectRatio || '3:2';
		const [width, height] = photoAspectRatio.split(':').map(Number);

		// Use CSS aspect-ratio to lock container dimensions and prevent layout shift
		return {
			aspectRatio: `${width} / ${height}`,
		};
	};

	const getAspectClass = () => {
		if (aspectRatio === 'natural') return ''; // No aspect ratio constraint for natural layout
		if (aspectRatio === 'square') return 'aspect-square';

		const photoAspectRatio = photo.tags.aspectRatio || '3:2';
		if (photoAspectRatio === '4:5') return 'aspect-[4/5]';
		if (photoAspectRatio === '3:2') return 'aspect-[3/2]';
		return 'aspect-square';
	};

	const displayableTags = Object.entries(photo.tags).filter(
		([key]) => !['featured', 'hero', 'aspectRatio'].includes(key),
	);

	return (
		<div
			className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 ${className}`}
			onClick={onClick}
		>
			<div
				className={`relative ${getAspectClass()} bg-gray-700 overflow-hidden`}
				ref={imgRef}
				style={aspectRatio === 'natural' ? getImageDimensions() : {}}
			>
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
				) : shouldLoad ? (
					<>
						<img
							src={photoUrls.src}
							srcSet={photoUrls.srcSet}
							sizes={photoUrls.sizes}
							alt={photo.tags.category || 'Photo'}
							className={`w-full ${aspectRatio === 'natural' ? 'h-auto' : 'h-full'} object-cover ${
								aspectRatio === 'natural' && !imageLoaded ? 'opacity-0' : 'opacity-100'
							} transition-opacity duration-300`}
							loading="lazy"
							onError={handleImageError}
							onLoad={handleImageLoad}
						/>
					</>
				) : null}

				<div className="absolute inset-0 bg-transparent group-hover:bg-black/50 transition-all duration-300 flex items-end">
					<div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
						{photo.tags.category && (
							<Tag variant="blue" size="sm">
								{photo.tags.category}
							</Tag>
						)}
						{photo.tags.location && <p className="text-sm font-medium mt-2">{photo.tags.location}</p>}
					</div>
				</div>
			</div>

			{showMetadata && (
				<motion.div className="p-4" initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}>
					<motion.div className="flex flex-wrap gap-1" initial={{ opacity: 0.7 }} whileHover={{ opacity: 1 }}>
						{displayableTags.slice(0, tagsExpanded ? undefined : 3).map(([key, value], index) => (
							<motion.div
								key={key}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Tag variant="default" size="sm">
									{key}: {value.toString()}
								</Tag>
							</motion.div>
						))}
						{displayableTags.length > 3 && !tagsExpanded && (
							<motion.button
								onClick={(e) => {
									e.stopPropagation();
									setTagsExpanded(true);
								}}
								className="inline-flex items-center"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Tag variant="default" size="sm">
									+{displayableTags.length - 3} more
								</Tag>
							</motion.button>
						)}
					</motion.div>

					{tagsExpanded && displayableTags.length > 3 && (
						<motion.div
							className="flex justify-center mt-2"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<motion.button
								onClick={(e) => {
									e.stopPropagation();
									setTagsExpanded(false);
								}}
								className="inline-flex items-center"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Tag variant="default" size="sm">
									Show less
								</Tag>
							</motion.button>
						</motion.div>
					)}
				</motion.div>
			)}
		</div>
	);
};
