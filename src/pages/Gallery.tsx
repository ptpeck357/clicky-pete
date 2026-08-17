import React, { useState, useMemo, useEffect, useRef, useCallback, useDeferredValue } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { PhotoGrid, PhotoViewerModal, CollectionsGrid } from '../components/organisms';
import { usePhotos } from '../hooks/usePhotos';
import { photoService } from '../services/photoService';
import { parseSortOrder, sortPhotos } from '../utils/photoOrder';
import type { SortOrder } from '../utils/photoOrder';
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

const sortIconProps: React.SVGProps<SVGSVGElement> = {
	className: 'w-3.5 h-3.5',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
	viewBox: '0 0 24 24',
	'aria-hidden': true,
};

/**
 * Drawn inline rather than pulled from an icon package, matching the other SVGs in the app.
 * The arrow points the way the dates run: down for newest first, up for oldest first.
 */
const SortIcon: React.FC<{ order: SortOrder }> = ({ order }) => {
	if (order === 'random') {
		return (
			<svg {...sortIconProps}>
				<path d="M16 3h5v5" />
				<path d="M4 20 21 3" />
				<path d="M16 21h5v-5" />
				<path d="m15 15 6 6" />
				<path d="M4 4l5 5" />
			</svg>
		);
	}

	return (
		<svg {...sortIconProps}>
			<path d={order === 'newest' ? 'M12 5v14m0 0l-6-6m6 6l6-6' : 'M12 19V5m0 0l-6 6m6-6l6 6'} />
		</svg>
	);
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
	const [searchParams, setSearchParams] = useSearchParams();
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

	const sortOrder = parseSortOrder(searchParams.get('sort'));
	// What the date button reads and does. Random has no direction of its own, so the button
	// falls back to newest — which is also what a click from Random then applies.
	const dateDirection: Exclude<SortOrder, 'random'> = sortOrder === 'oldest' ? 'oldest' : 'newest';
	// Fresh per page load, so the gallery still arrives differently arranged, and bumped by a
	// click on Random — which is what makes clicking it again deal a new order.
	const [shuffleSeed, setShuffleSeed] = useState(() => Math.floor(Math.random() * 2 ** 31));
	const orderedPhotos = useMemo(() => sortPhotos(photos, sortOrder, shuffleSeed), [photos, sortOrder, shuffleSeed]);
	const displayedPhotos = useMemo(() => orderedPhotos.slice(0, photosToShow), [orderedPhotos, photosToShow]);
	const hasMorePhotos = photosToShow < orderedPhotos.length;

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
	// Deliberately not keyed on sortOrder. Re-sorting reorders the same photos, and
	// displayedPhotos always slices the current order from the start, so the count stays
	// meaningful — while resetting it would shorten the page under a reader who has scrolled
	// and let the browser clamp them somewhere they did not ask to be.
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
		} else if (hasMorePhotos) {
			// Load more photos and navigate to the next one
			const nextIndex = currentIndex + 1;
			setPhotosToShow((prev) => Math.max(prev + 12, nextIndex + 1));
			setSelectedPhoto(orderedPhotos[nextIndex]);
		}
	};

	const handlePreviousPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex > 0) {
			setSelectedPhoto(displayedPhotos[currentIndex - 1]);
		}
	};

	/**
	 * Active: flip the direction. Showing Random: come back to date sorting in the direction
	 * the button is already displaying, so the click does what its label says.
	 */
	const handleDateSortClick = () => handleSortChange(sortOrder === 'newest' ? 'oldest' : 'newest');

	const handleSortChange = (order: SortOrder) => {
		// Clicking Random reshuffles, including when it is already the current order — that
		// repeat click is the only way to ask for a different arrangement. Incrementing is
		// enough: any seed the shuffle has not seen produces a different one.
		if (order === 'random') setShuffleSeed((seed) => seed + 1);

		const next = new URLSearchParams(searchParams);
		// Newest is the default, so it stays out of the URL rather than pinning a redundant param.
		if (order === 'newest') {
			next.delete('sort');
		} else {
			next.set('sort', order);
		}
		setSearchParams(next, { replace: true });
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
							{/* Stacked on a phone, side by side from sm: — sorting must never push the
							    category pills onto an extra line. */}
							<div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
								{showAllPhotos && (
									<motion.div variants={filterSectionVariants} initial="hidden" animate="visible">
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
														animate={
															localFilter.category === category ? 'active' : 'inactive'
														}
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

								<motion.div variants={filterSectionVariants} initial="hidden" animate="visible">
									<h3 className="text-base sm:text-lg font-medium text-white mb-3">Sort</h3>
									<div className="flex flex-wrap gap-2" role="group" aria-label="Sort photos">
										{/* One date button that flips direction, rather than two that mostly duplicate
										    each other. Its label is the order in force, so it doubles as the readout. */}
										<motion.button
											onClick={handleDateSortClick}
											aria-pressed={sortOrder !== 'random'}
											title={
												sortOrder === 'random'
													? 'Sort by date'
													: `Sorted ${dateDirection} first — click for ${dateDirection === 'newest' ? 'oldest' : 'newest'}`
											}
											variants={filterButtonVariants}
											initial="inactive"
											animate={sortOrder === 'random' ? 'inactive' : 'active'}
											whileHover="hover"
											whileTap={{ scale: 0.98 }}
											className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer capitalize"
										>
											<SortIcon order={dateDirection} />
											{dateDirection}
										</motion.button>

										<motion.button
											onClick={() => handleSortChange('random')}
											aria-pressed={sortOrder === 'random'}
											title={sortOrder === 'random' ? 'Shuffle again' : 'Shuffle'}
											variants={filterButtonVariants}
											initial="inactive"
											animate={sortOrder === 'random' ? 'active' : 'inactive'}
											whileHover="hover"
											whileTap={{ scale: 0.98 }}
											className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer"
										>
											<SortIcon order="random" />
											Random
										</motion.button>
									</div>
								</motion.div>
							</div>

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

							{/* Only once the grid has paged everything in — otherwise it sits above the
							    loader and anyone who keeps scrolling walks straight past it. */}
							{!hasMorePhotos && !loading && displayedPhotos.length > 0 && (
								<motion.div
									className="max-w-2xl mx-auto text-center px-6 pt-12 pb-16 sm:pt-16 sm:pb-20"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.3 }}
									transition={{ duration: 0.7 }}
								>
									<svg
										viewBox="0 0 24 24"
										className="w-7 h-7 mx-auto mb-6 text-blue-400"
										fill="currentColor"
										aria-hidden="true"
									>
										<path d="M3 18L10 7l4 6 3-4 7 9H3z" />
									</svg>
									<h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
										Want photos like <span className="text-blue-400">these</span>?
									</h2>
									<p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-7">
										Portraits, graduations, families and engagements around Bozeman, at introductory
										rates.
									</p>
									<Link
										to="/contact"
										className="inline-block px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
									>
										See sessions &amp; pricing
									</Link>
								</motion.div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</main>

			<PhotoViewerModal
				photo={selectedPhoto}
				isOpen={isModalOpen}
				onClose={handleModalClose}
				onNext={getCurrentPhotoIndex() < orderedPhotos.length - 1 ? handleNextPhoto : undefined}
				onPrevious={getCurrentPhotoIndex() > 0 ? handlePreviousPhoto : undefined}
				// orderedPhotos, not displayedPhotos: the next photo can sit past the end of
				// what the grid has paged in, and that is exactly the one worth prefetching.
				nextPhoto={orderedPhotos[getCurrentPhotoIndex() + 1]}
				previousPhoto={orderedPhotos[getCurrentPhotoIndex() - 1]}
			/>
		</div>
	);
};
