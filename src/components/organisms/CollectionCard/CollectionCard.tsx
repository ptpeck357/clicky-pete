import React from 'react';
import { motion } from 'framer-motion';
import { MotionLink } from '@/components/atoms';
import { collectionPath } from '@/config/site';
import type { Photo } from '@/types/photo';

interface CollectionCardProps {
	name: string;
	count: number;
	coverPhoto: Photo;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ name, count, coverPhoto }) => {
	const getPhotoUrls = () => {
		const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;
		if (!cloudFrontUrl) {
			throw new Error(
				'CloudFront URL not configured. Please set VITE_CLOUDFRONT_URL in your environment variables.',
			);
		}

		const baseUrl = `${cloudFrontUrl}/photos`;
		return {
			src: `${baseUrl}/800/${coverPhoto.file}`, // Default/fallback
			srcSet: `${baseUrl}/400/${coverPhoto.file} 400w, ${baseUrl}/800/${coverPhoto.file} 800w, ${baseUrl}/2000/${coverPhoto.file} 2000w`,
			sizes: '(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px',
		};
	};

	const photoUrls = getPhotoUrls();

	return (
		<MotionLink
			to={collectionPath(name)}
			className="block relative bg-gray-800 rounded-lg overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
			// The browser's native link drag would cancel the whileTap press mid-scale.
			draggable={false}
			aria-label={`${name} collection, ${count} photos`}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="aspect-square relative overflow-hidden">
				<motion.img
					src={photoUrls.src}
					srcSet={photoUrls.srcSet}
					sizes={photoUrls.sizes}
					alt={`${name} collection`}
					draggable={false}
					className="w-full h-full object-cover"
					whileHover={{ scale: 1.1 }}
					transition={{ duration: 0.3 }}
				/>

				<motion.div
					className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
				>
					<svg
						className="w-3 h-3 sm:w-4 sm:h-4 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span className="text-white text-xs sm:text-sm font-medium">{count}</span>
				</motion.div>

				<motion.div
					className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<h3 className="text-white text-sm sm:text-xl font-bold drop-shadow-lg">{name}</h3>
				</motion.div>
			</div>
		</MotionLink>
	);
};
