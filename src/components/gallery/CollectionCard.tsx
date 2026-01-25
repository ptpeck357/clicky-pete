import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Collection } from '../../types/photo';

interface CollectionCardProps {
	collection: Collection;
	onClick?: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onClick }) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imageError, setImageError] = useState(false);

	// Safety checks
	if (!collection || !collection.coverPhoto) {
		return null;
	}

	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
		hover: {
			opacity: 0.9,
			transition: { duration: 0.3 },
		},
	};

	const textVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { delay: 0.2, duration: 0.4 },
		},
		hover: {
			y: -5,
			transition: { duration: 0.3 },
		},
	};

	const badgeVariants = {
		hidden: { scale: 0, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
		},
		hover: {
			scale: 1.1,
		},
	};

	return (
		<motion.div className="collection-card" onClick={onClick} whileHover="hover" initial="hidden" animate="visible">
			<div className="collection-image">
				{!imageLoaded && !imageError && (
					<motion.div
						className="image-loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div className="loading-spinner" />
					</motion.div>
				)}

				{imageError ? (
					<motion.div
						className="image-error"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					>
						<svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<p>Failed to load</p>
					</motion.div>
				) : (
					<motion.img
						src={collection.coverPhoto.preSignedUrl}
						alt={collection.name}
						className="cover-image"
						initial={{ opacity: 0, scale: 1.1 }}
						animate={{
							opacity: imageLoaded ? 1 : 0,
							scale: imageLoaded ? 1 : 1.1,
						}}
						transition={{ duration: 0.6, ease: 'easeOut' }}
						whileHover={{ scale: 1.05 }}
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageError(true)}
					/>
				)}

				<motion.div
					className="collection-overlay"
					variants={overlayVariants}
					initial="hidden"
					animate="visible"
					whileHover="hover"
				>
					{/* Collection Title - Bottom Left */}
					<motion.div className="absolute bottom-4 left-4" variants={textVariants}>
						<motion.h3 className="text-white text-lg font-bold drop-shadow-lg" variants={textVariants}>
							{collection.name}
						</motion.h3>
					</motion.div>

					{/* Photo Count - Top Right */}
					<motion.div
						className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1"
						variants={badgeVariants}
						transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
					>
						<span className="text-white text-sm font-medium">
							{collection.photos?.length || collection.count || 0} Photos
						</span>
					</motion.div>
				</motion.div>
			</div>
		</motion.div>
	);
};
