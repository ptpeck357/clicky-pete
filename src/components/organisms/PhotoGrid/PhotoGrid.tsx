import React from 'react';
import { motion } from 'framer-motion';
import { PhotoCard } from '../../molecules';
import { Spinner } from '../../atoms';
import type { Photo } from '../../../types/photo';

interface PhotoGridProps {
	photos: Photo[];
	loading?: boolean;
	onPhotoClick?: (photo: Photo) => void;
	layout?: 'grid' | 'masonry';
	aspectRatio?: 'square' | 'natural';
	showMetadata?: boolean;
	columns?: 'default' | 'large';
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0,
		},
	},
};

const itemVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		scale: 0.9,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.5,
		},
	},
};

export const PhotoGrid: React.FC<PhotoGridProps> = ({
	photos,
	loading = false,
	onPhotoClick,
	layout = 'grid',
	aspectRatio = 'square',
	showMetadata = true,
	columns = 'default',
}) => {
	if (loading) {
		return (
			<motion.div
				className="flex justify-center items-center py-12"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<Spinner size="lg" color="blue" />
			</motion.div>
		);
	}

	if (photos.length === 0) {
		return (
			<motion.div
				className="text-center py-12"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<motion.svg
					className="mx-auto h-12 w-12 text-gray-500 mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</motion.svg>
				<h3 className="text-lg font-medium text-gray-300 mb-2">No photos found</h3>
				<p className="text-gray-500">Try adjusting your filters or upload some photos.</p>
			</motion.div>
		);
	}

	const gridClasses = (() => {
		if (layout === 'masonry') return 'masonry-grid';

		if (aspectRatio === 'natural') {
			if (columns === 'large') {
				return 'columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4';
			}
			return 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4';
		}

		if (columns === 'large') {
			return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';
		}

		return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6';
	})();

	return (
		<motion.div className={gridClasses} variants={containerVariants} initial="hidden" animate="visible">
			{photos.map((photo) => (
				<motion.div
					key={photo.key}
					variants={itemVariants}
					whileHover={{
						scale: 1.02,
						transition: { duration: 0.2 },
					}}
					whileTap={{ scale: 0.98 }}
					className={aspectRatio === 'natural' ? 'break-inside-avoid mb-4' : ''}
				>
					<PhotoCard
						photo={photo}
						onClick={() => onPhotoClick?.(photo)}
						className={layout === 'masonry' ? 'masonry-item' : ''}
						aspectRatio={aspectRatio}
						showMetadata={showMetadata}
					/>
				</motion.div>
			))}
		</motion.div>
	);
};
