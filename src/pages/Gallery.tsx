import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PhotoGrid, PhotoViewerModal, CollectionsGrid } from '../components/organisms';
import { SearchBar } from '../components/molecules';
import { usePhotos } from '../hooks/usePhotos';
import { shuffleArray } from '../utils/array';
import type { Photo, PhotoFilter } from '../types/photo';

const filterButtonVariants = {
	inactive: {
		scale: 1,
		backgroundColor: 'rgb(55, 65, 81)',
		color: 'rgb(209, 213, 219)',
	},
	active: {
		scale: 1.05,
		backgroundColor: 'rgb(37, 99, 235)',
		color: 'rgb(255, 255, 255)',
	},
	hover: {
		scale: 1.02,
		backgroundColor: 'rgb(75, 85, 99)',
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
	const { collection: urlCollection } = useParams<{ collection: string }>();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const showAllPhotos = searchParams.get('view') === 'all';

	const filter = useMemo<PhotoFilter>(() => {
		if (showAllPhotos) {
			return {}; // No filter for all photos
		}
		return urlCollection ? { collection: urlCollection } : {};
	}, [urlCollection, showAllPhotos]);

	const viewMode = useMemo<'collections' | 'photos'>(() => {
		return urlCollection || showAllPhotos ? 'photos' : 'collections';
	}, [urlCollection, showAllPhotos]);

	const [localFilter, setLocalFilter] = useState<PhotoFilter>({});
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const finalFilter = { ...filter, ...localFilter };
	const { photos, loading, error, refetch } = usePhotos(finalFilter);

	const shuffledPhotos = useMemo(() => shuffleArray(photos), [photos]);

	const handleCategoryChange = (category: string | undefined) => {
		setLocalFilter({ category });
		navigate('/gallery?view=all');
	};

	const handleCollectionSelect = (collection: string) => {
		navigate(`/gallery/${collection}`);
	};

	const handleSearchChange = (search: string) => {
		setLocalFilter((prev) => ({ ...prev, search: search || undefined }));
	};

	const handlePhotoClick = (photo: Photo) => {
		setSelectedPhoto(photo);
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedPhoto(null);
	};

	const getCurrentPhotoIndex = () => {
		if (!selectedPhoto) return -1;
		return shuffledPhotos.findIndex((p) => p.key === selectedPhoto.key);
	};

	const handleNextPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex < shuffledPhotos.length - 1) {
			setSelectedPhoto(shuffledPhotos[currentIndex + 1]);
		}
	};

	const handlePreviousPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex > 0) {
			setSelectedPhoto(shuffledPhotos[currentIndex - 1]);
		}
	};

	const handleBackToCollections = () => {
		navigate('/gallery');
	};

	const categories = ['landscape', 'portrait', 'street', 'aerial', 'wildlife'];

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
			<main className="p-4 sm:p-6 bg-gray-900">
				<motion.div className="mb-6 sm:mb-8" variants={headerVariants} initial="hidden" animate="visible">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
						<div>
							<div className="flex items-center gap-4 mb-2">
								<motion.h1
									className="text-2xl sm:text-3xl font-bold text-white"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: 0.1 }}
								>
									{viewMode === 'collections'
										? 'Collections'
										: showAllPhotos
											? 'All Photos'
											: filter.collection
												? `${filter.collection} Collection`
												: 'Gallery'}
								</motion.h1>

								{viewMode === 'photos' && (
									<motion.button
										onClick={handleBackToCollections}
										className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.4 }}
									>
										← Back to Collections
									</motion.button>
								)}
							</div>

							<motion.p
								className="text-gray-400 text-sm sm:text-base"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								{viewMode === 'collections'
									? 'Browse photo collections by location and theme'
									: loading
										? 'Loading...'
										: `${photos.length} photos`}
								{localFilter.category && ` in ${localFilter.category}`}
								{filter.collection && ` from ${filter.collection}`}
							</motion.p>
						</div>

						{viewMode === 'photos' && (
							<motion.div
								className="mt-4 lg:mt-0 w-full lg:w-96"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.3 }}
							>
								<SearchBar onSearch={handleSearchChange} />
							</motion.div>
						)}
					</div>
				</motion.div>

				<motion.div
					className="mb-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					<div className="flex gap-2">
						<motion.button
							onClick={() => navigate('/gallery')}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								viewMode === 'collections'
									? 'bg-blue-600 text-white'
									: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Collections
						</motion.button>
						<motion.button
							onClick={() => {
								setLocalFilter({});
								navigate('/gallery?view=all');
							}}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								showAllPhotos ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							All Photos
						</motion.button>
					</div>
				</motion.div>

				<AnimatePresence mode="wait">
					{viewMode === 'collections' ? (
						<motion.div
							key="collections"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							<CollectionsGrid onCollectionSelect={handleCollectionSelect} />
						</motion.div>
					) : (
						<motion.div
							key="photos"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							{showAllPhotos && (
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
											animate={!localFilter.category ? 'active' : 'inactive'}
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
												animate={localFilter.category === category ? 'active' : 'inactive'}
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
							)}

							<PhotoGrid
								photos={shuffledPhotos}
								loading={loading}
								onPhotoClick={handlePhotoClick}
								aspectRatio="natural"
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</main>

			<PhotoViewerModal
				photo={selectedPhoto}
				isOpen={isModalOpen}
				onClose={handleModalClose}
				onNext={getCurrentPhotoIndex() < shuffledPhotos.length - 1 ? handleNextPhoto : undefined}
				onPrevious={getCurrentPhotoIndex() > 0 ? handlePreviousPhoto : undefined}
			/>
		</div>
	);
};
