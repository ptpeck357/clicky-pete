import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoGrid } from '../components/organisms/PhotoGrid';
import { PhotoModal } from '../components/gallery/PhotoModal';
import { SearchBar } from '../components/filters/SearchBar';
import { usePhotos } from '../hooks/usePhotos';
import type { Photo, PhotoFilter } from '../types/photo';

const filterButtonVariants = {
	inactive: {
		scale: 1,
		backgroundColor: 'rgb(55, 65, 81)', // gray-700
		color: 'rgb(209, 213, 219)', // gray-300
	},
	active: {
		scale: 1.05,
		backgroundColor: 'rgb(37, 99, 235)', // blue-600
		color: 'rgb(255, 255, 255)',
	},
	hover: {
		scale: 1.02,
		backgroundColor: 'rgb(75, 85, 99)', // gray-600
		transition: { duration: 0.2 },
	},
};

const headerVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6 },
	},
};

const filterSectionVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, delay: 0.2 },
	},
};

export const Gallery: React.FC = () => {
	const [filter, setFilter] = useState<PhotoFilter>({});
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { photos, loading, error, refetch } = usePhotos(filter);

	const handleCategoryChange = (category: string | undefined) => {
		setFilter((prev) => ({ ...prev, category }));
	};

	const handleLocationChange = (location: string | undefined) => {
		setFilter((prev) => ({ ...prev, location }));
	};

	const handleSearchChange = (search: string) => {
		setFilter((prev) => ({ ...prev, search: search || undefined }));
	};

	const handlePhotoClick = (photo: Photo) => {
		setSelectedPhoto(photo);
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedPhoto(null);
	};

	const handlePhotoDelete = async (photo: Photo) => {
		try {
			// TODO: Implement delete functionality
			console.log('Delete photo:', photo.key);
			refetch();
		} catch (error) {
			console.error('Failed to delete photo:', error);
		}
	};

	const getCurrentPhotoIndex = () => {
		if (!selectedPhoto) return -1;
		return photos.findIndex((p) => p.key === selectedPhoto.key);
	};

	const handleNextPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex < photos.length - 1) {
			setSelectedPhoto(photos[currentIndex + 1]);
		}
	};

	const handlePreviousPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex > 0) {
			setSelectedPhoto(photos[currentIndex - 1]);
		}
	};

	const locations = ['Studio', 'Outdoor', 'Urban', 'Nature', 'Beach', 'Mountain'];
	const categories = ['landscape', 'portrait', 'street', 'nature', 'wildlife', 'macro', 'architecture', 'abstract'];

	if (error) {
		return (
			<motion.div
				className="min-h-screen bg-gray-900 flex items-center justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className="text-center">
					<motion.div
						className="text-red-400 text-lg mb-4"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						Failed to load photos
					</motion.div>
					<motion.button
						onClick={refetch}
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						Try Again
					</motion.button>
				</div>
			</motion.div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900">
			{/* Main Content - Full Width */}
			<main className="p-4 sm:p-6 bg-gray-900">
				{/* Header */}
				<motion.div className="mb-6 sm:mb-8" variants={headerVariants} initial="hidden" animate="visible">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
						<div>
							<motion.h1
								className="text-2xl sm:text-3xl font-bold text-white mb-2"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.1 }}
							>
								Gallery
							</motion.h1>
							<motion.p
								className="text-gray-400 text-sm sm:text-base"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								{loading ? 'Loading...' : `${photos.length} photos`}
								{filter.category && ` in ${filter.category}`}
							</motion.p>
						</div>

						<motion.div
							className="mt-4 lg:mt-0 w-full lg:w-96"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<SearchBar onSearch={handleSearchChange} />
						</motion.div>
					</div>
				</motion.div>

				{/* Category Filters - Top Bar */}
				<motion.div
					className="mb-4 sm:mb-6"
					variants={filterSectionVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.h3
						className="text-base sm:text-lg font-medium text-white mb-3"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
					>
						Category
					</motion.h3>
					<motion.div
						className="flex flex-wrap gap-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<motion.button
							onClick={() => handleCategoryChange(undefined)}
							variants={filterButtonVariants}
							initial="inactive"
							animate={!filter.category ? 'active' : 'inactive'}
							whileHover="hover"
							whileTap={{ scale: 0.98 }}
							className="px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors"
						>
							All
						</motion.button>
						{categories.map((category, index) => (
							<motion.button
								key={category}
								onClick={() => handleCategoryChange(category)}
								variants={filterButtonVariants}
								initial="inactive"
								animate={filter.category === category ? 'active' : 'inactive'}
								whileHover="hover"
								whileTap={{ scale: 0.98 }}
								className="px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors capitalize"
								style={{ animationDelay: `${index * 0.05}s` }}
							>
								{category}
							</motion.button>
						))}
					</motion.div>
				</motion.div>

				{/* Location Filters - Top Bar */}
				<motion.div
					className="mb-4 sm:mb-6"
					variants={filterSectionVariants}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.1 }}
				>
					<motion.h3
						className="text-base sm:text-lg font-medium text-white mb-3"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						Location
					</motion.h3>
					<motion.div
						className="flex flex-wrap gap-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<motion.button
							onClick={() => handleLocationChange(undefined)}
							variants={filterButtonVariants}
							initial="inactive"
							animate={!filter.location ? 'active' : 'inactive'}
							whileHover="hover"
							whileTap={{ scale: 0.98 }}
							className="px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors"
						>
							All Locations
						</motion.button>
						{locations.map((location, index) => (
							<motion.button
								key={location}
								onClick={() => handleLocationChange(location)}
								variants={filterButtonVariants}
								initial="inactive"
								animate={filter.location === location ? 'active' : 'inactive'}
								whileHover="hover"
								whileTap={{ scale: 0.98 }}
								className="px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors"
								style={{ animationDelay: `${index * 0.05}s` }}
							>
								{location}
							</motion.button>
						))}
					</motion.div>
				</motion.div>

				{/* Active Filters */}
				<AnimatePresence>
					{(filter.category || filter.location || filter.search) && (
						<motion.div
							className="flex flex-wrap gap-2 mb-4"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
						>
							<span className="text-sm text-gray-400">Active filters:</span>
							<AnimatePresence>
								{filter.category && (
									<motion.span
										className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										layout
									>
										Category: {filter.category}
										<motion.button
											onClick={() => handleCategoryChange(undefined)}
											className="ml-2 text-blue-600 hover:text-blue-800"
											whileHover={{ scale: 1.2 }}
											whileTap={{ scale: 0.9 }}
										>
											×
										</motion.button>
									</motion.span>
								)}
								{filter.location && (
									<motion.span
										className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										layout
									>
										Location: {filter.location}
										<motion.button
											onClick={() => handleLocationChange(undefined)}
											className="ml-2 text-green-600 hover:text-green-800"
											whileHover={{ scale: 1.2 }}
											whileTap={{ scale: 0.9 }}
										>
											×
										</motion.button>
									</motion.span>
								)}
								{filter.search && (
									<motion.span
										className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										layout
									>
										Search: "{filter.search}"
									</motion.span>
								)}
							</AnimatePresence>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Photo Grid */}
				<PhotoGrid photos={photos} loading={loading} onPhotoClick={handlePhotoClick} />
			</main>

			{/* Photo Modal */}
			<PhotoModal
				photo={selectedPhoto}
				isOpen={isModalOpen}
				onClose={handleModalClose}
				onDelete={handlePhotoDelete}
				onNext={getCurrentPhotoIndex() < photos.length - 1 ? handleNextPhoto : undefined}
				onPrevious={getCurrentPhotoIndex() > 0 ? handlePreviousPhoto : undefined}
			/>
		</div>
	);
};
