import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PhotoViewerModal, PhotoGrid } from '../components/organisms';
import { photoService } from '../services/photoService';
import { shuffleArray } from '../utils/array';
import { preloadImages } from '../utils/imageOptimization';
import type { Photo } from '../types/photo';

const heroVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 1,
			staggerChildren: 0.3,
			delayChildren: 0.2,
		},
	},
};

const textVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: { opacity: 1, y: 0 },
};

export const Home: React.FC = () => {
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
	const [heroPhotos, setHeroPhotos] = useState<Photo[]>([]);

	const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
	const [heroImagesLoaded, setHeroImagesLoaded] = useState(false);

	const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
	const [photosToShow, setPhotosToShow] = useState(12);

	const loadMoreRef = useRef<HTMLDivElement>(null);
	const hasMorePhotos = photosToShow < featuredPhotos.length;

	const handleLoadMore = useCallback(() => {
		setPhotosToShow((prev) => Math.min(prev + 12, featuredPhotos.length));
	}, [featuredPhotos.length]);

	useEffect(() => {
		const sentinel = loadMoreRef.current;
		if (!sentinel || !hasMorePhotos) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					handleLoadMore();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasMorePhotos, handleLoadMore]);

	useEffect(() => {
		const loadPhotos = async () => {
			try {
				const [featured, hero] = await Promise.all([
					photoService.getFeaturedPhotos(),
					photoService.getHeroPhotos(),
				]);

				const shuffledFeatured = shuffleArray(featured);
				setFeaturedPhotos(shuffledFeatured);

				const heroToUse = hero.length > 0 ? hero : shuffledFeatured.slice(0, 3);
				setHeroPhotos(heroToUse);
			} catch (error) {
				console.error('Failed to load photos:', error);
			}
		};
		window.scrollTo(0, 0);

		loadPhotos();
	}, []);

	useEffect(() => {
		setDisplayedPhotos(featuredPhotos.slice(0, photosToShow));
	}, [featuredPhotos, photosToShow]);

	useEffect(() => {
		if (heroPhotos.length === 0) return;

		const LOADING_TIMEOUT_MS = 15000;
		let hasCompleted = false;

		const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;
		if (!cloudFrontUrl) {
			console.error('CloudFront URL not configured');
			return;
		}

		const heroImageUrls = heroPhotos.flatMap((photo) => [
			`${cloudFrontUrl}/photos/800/${photo.file}`,
			`${cloudFrontUrl}/photos/2000/${photo.file}`,
		]);

		const timeoutId = setTimeout(() => {
			if (!hasCompleted) {
				console.warn('Hero images loading timed out, proceeding anyway');
				hasCompleted = true;
				setHeroImagesLoaded(true);
			}
		}, LOADING_TIMEOUT_MS);

		if (heroImageUrls.length > 0) {
			preloadImages(heroImageUrls)
				.then(() => {
					if (!hasCompleted) {
						hasCompleted = true;
						clearTimeout(timeoutId);
						setHeroImagesLoaded(true);
					}
				})
				.catch(() => {
					if (!hasCompleted) {
						hasCompleted = true;
						clearTimeout(timeoutId);
						setHeroImagesLoaded(true);
					}
				});
		} else {
			hasCompleted = true;
			clearTimeout(timeoutId);
			setHeroImagesLoaded(true);
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [heroPhotos]);

	const getHeroImageUrl = (photo: Photo, cloudFrontUrl: string) => {
		const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
		let size = '2000';

		if (viewportWidth <= 640) {
			size = '800';
		} else if (viewportWidth <= 1024) {
			size = '800';
		} else {
			size = '2000';
		}

		return `${cloudFrontUrl}/photos/${size}/${photo.file}`;
	};

	useEffect(() => {
		if (heroPhotos.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentHeroIndex((prev) => (prev + 1) % heroPhotos.length);
		}, 2500);

		return () => clearInterval(interval);
	}, [heroPhotos.length]);

	const recentPhotos = displayedPhotos.slice(1);

	// Parallax effect for hero background
	const { scrollY } = useScroll();
	const backgroundY = useTransform(scrollY, [0, 500], [0, 300]);

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
		}
	};

	const handlePreviousPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex > 0) {
			setSelectedPhoto(displayedPhotos[currentIndex - 1]);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<section className="relative h-screen w-full -mt-16 flex items-center justify-center overflow-hidden">
				{!heroImagesLoaded && (
					<div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-30">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4" />
							<p className="text-gray-400">Loading gallery...</p>
						</div>
					</div>
				)}

				{heroPhotos.length > 0 ? (
					<motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
						{heroPhotos.map((photo, index) => {
							const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;
							if (!cloudFrontUrl) {
								console.error('CloudFront URL not configured');
								return null;
							}

							const imageUrl = getHeroImageUrl(photo, cloudFrontUrl);
							const isVisible = index === currentHeroIndex && heroImagesLoaded;

							return (
								<div
									key={photo.id}
									className="absolute inset-0 transition-opacity duration-1000 ease-in-out overflow-hidden bg-black flex items-center justify-center"
									style={{
										opacity: isVisible ? 1 : 0,
									}}
								>
									<img
										src={imageUrl}
										alt={photo.tags.category || 'Hero photo'}
										className="w-full h-full object-contain sm:object-cover"
									/>
								</div>
							);
						})}
					</motion.div>
				) : (
					<div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
						<div className="text-center text-gray-400">
							<p className="text-lg">No hero photos available</p>
							<p className="text-sm">
								Please configure your CloudFront URL and ensure photos.json contains hero photos
							</p>
						</div>
					</div>
				)}

				<motion.div
					className="relative z-10 text-center max-w-4xl mx-auto px-4"
					variants={heroVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.h1
						className="text-2xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
						variants={textVariants}
						transition={{ duration: 0.8, ease: 'easeOut' }}
					>
						Capturing <span className="block text-blue-400">The Moment</span>
					</motion.h1>

					<motion.p
						className="text-base sm:text-xl md:text-2xl text-white-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
						variants={textVariants}
						transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
					>
						Climb mountains not so the world can see you, but so you can see the world. <br /> - David
						McCullough Jr.
					</motion.p>
				</motion.div>

				<motion.button
					className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 p-3 transition-all duration-300 mb-safe"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1, duration: 0.8 }}
					onClick={() => {
						const photoSection = document.querySelector('#photo-section');
						if (photoSection) {
							photoSection.scrollIntoView({
								behavior: 'smooth',
								block: 'start',
							});
						}
					}}
					whileHover={{ scale: 1.1, y: -2 }}
					whileTap={{ scale: 0.95 }}
					aria-label="Scroll to photo gallery"
				>
					<motion.div
						animate={{ y: [0, 8, 0] }}
						transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
					>
						<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</motion.div>
				</motion.button>
			</section>

			<motion.section
				id="photo-section"
				className="py-16 bg-gray-900"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<PhotoGrid
						photos={recentPhotos}
						loading={displayedPhotos.length === 0}
						onPhotoClick={handlePhotoClick}
						aspectRatio="natural"
						showMetadata={false}
						columns="large"
					/>

					{hasMorePhotos ? (
						<div ref={loadMoreRef} className="flex justify-center py-8">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
						</div>
					) : (
						<motion.div
							className="text-center mt-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<Link to="/gallery">
								<motion.button
									className="px-8 py-3 border border-gray-600 text-white rounded-full font-medium hover:bg-white hover:text-gray-900 transition-all duration-300"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									View All Collections
								</motion.button>
							</Link>
						</motion.div>
					)}
				</div>
			</motion.section>

			<motion.section
				className="py-20 bg-gray-800 mb-12"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 1 }}
				viewport={{ once: true }}
			>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<motion.blockquote
						className="text-2xl md:text-3xl font-light text-gray-300 leading-relaxed"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						viewport={{ once: true }}
					>
						For his invisible attributes, namely, his eternal power and divine nature, have been clearly
						perceived, ever since the creation of the world, in the things that have been made. So they are
						without excuse.
					</motion.blockquote>
					<motion.cite
						className="block mt-6 text-gray-500"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						viewport={{ once: true }}
					>
						- Romans 1:20
					</motion.cite>
				</div>
			</motion.section>

			<PhotoViewerModal
				photo={selectedPhoto}
				isOpen={isModalOpen}
				onClose={handleModalClose}
				onNext={getCurrentPhotoIndex() < displayedPhotos.length - 1 ? handleNextPhoto : undefined}
				onPrevious={getCurrentPhotoIndex() > 0 ? handlePreviousPhoto : undefined}
			/>
		</div>
	);
};
