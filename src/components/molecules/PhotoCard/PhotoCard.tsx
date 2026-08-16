import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Photo } from '../../../types/photo';
import { preloadViewerImage } from '../../../utils/imageOptimization';

interface PhotoCardProps {
	photo: Photo;
	onClick?: () => void;
	className?: string;
	aspectRatio?: 'square' | 'natural';
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick, className = '', aspectRatio = 'square' }) => {
	const [imageError, setImageError] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
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
			// Widths the thumbnail actually occupies: the masonry runs 2 columns below 640px
			// and 3–4 above. The previous value claimed 2000px on desktop, so every thumbnail
			// downloaded the 2000px rendition — 352 KB each, against 16 KB for the 400px.
			sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
		};
	};

	const photoUrls = getPhotoUrls();

	const getImageDimensions = () => {
		if (aspectRatio !== 'natural') return {};

		const photoAspectRatio = photo.tags.aspectRatio || '3:2';
		const [width, height] = photoAspectRatio.split(':').map(Number);

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

	return (
		<div
			className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 ${className}`}
			onClick={onClick}
			// Hovering or touching is intent to open. Starting the full-size fetch here buys
			// the download a head start over the click, and costs nothing if it never comes.
			onPointerEnter={() => preloadViewerImage(photo.file)}
			onTouchStart={() => preloadViewerImage(photo.file)}
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
							onError={handleImageError}
							onLoad={handleImageLoad}
						/>
					</>
				) : null}
			</div>
		</div>
	);
};
