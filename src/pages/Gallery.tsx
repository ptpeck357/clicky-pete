import React, { useState, useMemo, useEffect, useRef, useCallback, useDeferredValue } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { PhotoGrid, PhotoViewerModal, CollectionsGrid } from '../components/organisms';
import { usePhotos } from '../hooks/usePhotos';
import { photoService } from '../services/photoService';
import { shuffleArray } from '../utils/array';
import { preloadViewerImage } from '../utils/imageOptimization';
import type { Photo, PhotoFilter } from '../types/photo';

const filterButtonVariants = {
	inactive: {
		scale: 1,
		backgroundColor: 'rgb(55, 65, 81)',
		color: 'rgb(209, 213, 219)',
		transition: { duration: 0.15 },
	},
	active: {
		scale: 1.05,
		backgroundColor: 'rgb(37, 99, 235)',
		color: 'rgb(255, 255, 255)',
		transition: { duration: 0.15 },
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
	const location = useLocation();

	const showAllPhotos = !urlCollection && searchParams.get('view') !== 'collections';

	const formatCategoryName = (category: string): string => {
		return category
			.toLowerCase()
			.split(/[\s\-_|]+/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' | ');
	};

	const filter = useMemo<PhotoFilter>(() => {
		if (showAllPhotos) {
			return {};
		}
		return urlCollection ? { collection: urlCollection } : {};
	}, [urlCollection, showAllPhotos]);

	const viewMode = useMemo<'collections' | 'photos'>(() => {
		return urlCollection || showAllPhotos ? 'photos' : 'collections';
	}, [urlCollection, showAllPhotos]);

	const [localFilter, setLocalFilter] = useState<PhotoFilter>({});
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [categories, setCategories] = useState<string[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(false);
	const [photosToShow, setPhotosToShow] = useState(15);

	const deferredCategory = useDeferredValue(localFilter.category);
	const fetchFilter = useMemo<PhotoFilter>(
		() => (deferredCategory ? { ...filter, category: deferredCategory } : filter),
		[filter, deferredCategory],
	);
	const { photos, loading, error, refetch } = usePhotos(fetchFilter);

	const shuffledPhotos = useMemo(() => shuffleArray(photos), [photos]);
	const displayedPhotos = useMemo(() => shuffledPhotos.slice(0, photosToShow), [shuffledPhotos, photosToShow]);
	const hasMorePhotos = photosToShow < shuffledPhotos.length;

	const { scrollY } = useScroll();
	const heroParallaxY = useTransform(scrollY, [0, 700], [0, -200]);

	const coverPhoto = useMemo(() => {
		if (!urlCollection || photos.length === 0) return null;
		const orient = (p: Photo, want: 'portrait' | 'landscape') => {
			const ar = p.tags.aspectRatio;
			if (!ar) return false;
			const [w, h] = ar.split(':').map(Number);
			return want === 'portrait' ? h > w : w > h;
		};
		const landscapes = photos.filter((p) => orient(p, 'landscape'));
		const pool = landscapes.length > 0 ? landscapes : photos.filter((p) => orient(p, 'portrait'));
		if (pool.length === 0) return null;
		return pool[Math.floor(Math.random() * pool.length)];
	}, [urlCollection, photos]);

	const coverPhotoUrl = useMemo(() => {
		if (!coverPhoto) return '';
		const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;
		return `${cloudFrontUrl}/photos/2000/${coverPhoto.file}`;
	}, [coverPhoto]);

	const isLoadingMoreRef = useRef(false);
	const observerRef = useRef<IntersectionObserver | null>(null);
	useEffect(() => {
		setPhotosToShow(15);
		isLoadingMoreRef.current = false;
	}, [urlCollection, showAllPhotos]);

	useEffect(() => {
		setIsModalOpen(false);
		setSelectedPhoto(null);
	}, [location.pathname, location.search]);

	const handleLoadMore = useCallback(() => {
		if (isLoadingMoreRef.current) return;
		isLoadingMoreRef.current = true;
		setPhotosToShow((prev) => prev + 12);
		setTimeout(() => {
			isLoadingMoreRef.current = false;
		}, 150);
	}, []);

	const loadMoreRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (observerRef.current) {
				observerRef.current.disconnect();
				observerRef.current = null;
			}

			if (node && !loading) {
				const observer = new IntersectionObserver(
					(entries) => {
						if (entries[0].isIntersecting) {
							handleLoadMore();
							setTimeout(() => {
								if (observerRef.current === observer) {
									observer.unobserve(node);
									observer.observe(node);
								}
							}, 200);
						}
					},
					{ threshold: 0.1, rootMargin: '400px' },
				);
				observer.observe(node);
				observerRef.current = observer;
			}
		},
		[loading, handleLoadMore],
	);

	useEffect(() => {
		if (showAllPhotos) {
			const fetchCategories = async () => {
				try {
					setCategoriesLoading(true);
					const fetchedCategories = await photoService.getCategories();
					setCategories(fetchedCategories);
				} catch (error) {
					console.error('Failed to fetch categories:', error);
					setCategories([]);
				} finally {
					setCategoriesLoading(false);
				}
			};

			fetchCategories();
		}
	}, [showAllPhotos]);

	const handleCategoryChange = (category: string | undefined) => {
		setLocalFilter({ category });
		setPhotosToShow(12);
		if (!showAllPhotos) {
			navigate('/gallery', { replace: true });
		}
	};

	const handleCollectionSelect = (collection: string) => {
		setLocalFilter({});
		navigate(`/gallery/${collection}`);
	};

	const handlePhotoClick = (photo: Photo) => {
		setSelectedPhoto(photo);
		setIsModalOpen(true);
		preloadNeighbours(photo);
	};

	// Arrow keys and the on-screen arrows move to the next photo, so fetch those two while
	// the current one is being looked at. Both are usually already cached by the time
	// anyone presses anything.
	const preloadNeighbours = (photo: Photo) => {
		const index = shuffledPhotos.findIndex((p) => p.id === photo.id);
		for (const neighbour of [shuffledPhotos[index - 1], shuffledPhotos[index + 1]]) {
			if (neighbour) preloadViewerImage(neighbour.file);
		}
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedPhoto(null);
	};

	const getCurrentPhotoIndex = () => {
		if (!selectedPhoto) return -1;
		return displayedPhotos.findIndex((p) => p.id === selectedPhoto.id);
	};

	const handleNextPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex < displayedPhotos.length - 1) {
			setSelectedPhoto(displayedPhotos[currentIndex + 1]);
			preloadNeighbours(displayedPhotos[currentIndex + 1]);
		} else if (hasMorePhotos) {
			// Load more photos and navigate to the next one
			const nextIndex = currentIndex + 1;
			setPhotosToShow((prev) => Math.max(prev + 12, nextIndex + 1));
			setSelectedPhoto(shuffledPhotos[nextIndex]);
		}
	};

	const handlePreviousPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex > 0) {
			setSelectedPhoto(displayedPhotos[currentIndex - 1]);
			preloadNeighbours(displayedPhotos[currentIndex - 1]);
		}
	};

	const handleBackToCollections = () => {
		setLocalFilter({});
		navigate('/gallery?view=collections');
	};

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
			{urlCollection && (
				<div className="relative -mt-16 overflow-hidden bg-gray-900 h-[calc(40vh+4rem)] sm:h-[calc(65vh+4rem)]">
					{coverPhotoUrl && (
						<motion.div
							className="absolute inset-x-0 -top-[150px] -bottom-[150px]"
							style={{ y: heroParallaxY }}
						>
							<img
								src={coverPhotoUrl}
								alt={`${urlCollection} collection`}
								className="absolute inset-0 w-full h-full object-cover"
							/>
						</motion.div>
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/35 to-gray-900/15" />
					<div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
						<h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
							{urlCollection}
						</h1>
						<p className="text-gray-300 text-sm sm:text-lg drop-shadow">
							{loading ? 'Loading...' : `${photos.length} photos`}
						</p>
					</div>
				</div>
			)}

			<main className="p-4 sm:p-6 bg-[linear-gradient(to_bottom,#111827_0%,#040711_15%,#060e1c_30%,#08142a_50%,#0a1a38_70%,#0d2244_80%,#060e1c_90%,#111827_100%)]">
				{urlCollection && (
					<div className="mb-4">
						<motion.button
							onClick={handleBackToCollections}
							className="px-3 py-1.5 text-sm bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4 }}
						>
							← Back to Collections
						</motion.button>
					</div>
				)}
				{!urlCollection && (
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
												: 'Gallery'}
									</motion.h1>
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
								</motion.p>
							</div>
						</div>
					</motion.div>
				)}

				{!urlCollection && (
					<motion.div
						className="mb-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<div className="flex gap-2">
							<motion.button
								onClick={() => {
									setLocalFilter({});
									setPhotosToShow(12);
									navigate('/gallery');
								}}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									showAllPhotos
										? 'bg-blue-600 text-white'
										: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								All Photos
							</motion.button>
							<motion.button
								onClick={() => {
									setLocalFilter({});
									navigate('/gallery?view=collections');
								}}
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
						</div>
					</motion.div>
				)}

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
											className="px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer"
										>
											All
										</motion.button>

										{categoriesLoading ? (
											<motion.div
												className="px-3 py-2 text-xs sm:text-sm text-gray-400"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
											>
												Loading categories...
											</motion.div>
										) : categories.length > 0 ? (
											categories.map((category, index) => (
												<motion.button
													key={category}
													onClick={() => handleCategoryChange(category)}
													variants={filterButtonVariants}
													initial="inactive"
													animate={localFilter.category === category ? 'active' : 'inactive'}
													whileHover="hover"
													whileTap={{ scale: 0.98 }}
													className="px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer"
													style={{ animationDelay: `${index * 0.05}s` }}
												>
													{formatCategoryName(category)}
												</motion.button>
											))
										) : (
											<motion.div
												className="px-3 py-2 text-xs sm:text-sm text-gray-400"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
											>
												No categories available
											</motion.div>
										)}
									</motion.div>
								</motion.div>
							)}

							<PhotoGrid
								photos={displayedPhotos}
								loading={loading}
								onPhotoClick={handlePhotoClick}
								aspectRatio="natural"
							/>

							{hasMorePhotos && (
								<div
									ref={loadMoreRef}
									className="flex justify-center py-8"
									style={{ overflowAnchor: 'none' }}
								>
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
								</div>
							)}
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
