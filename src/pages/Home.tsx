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
	const [heroTextVisible, setHeroTextVisible] = useState(true);

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
			{ threshold: 0.1, rootMargin: '400px' },
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

	useEffect(() => {
		if (!heroImagesLoaded) return;
		const t = setTimeout(() => setHeroTextVisible(false), 3500);
		return () => clearTimeout(t);
	}, [heroImagesLoaded]);

	const recentPhotos = displayedPhotos.slice(1);

	// Parallax effect for hero background
	const { scrollY } = useScroll();
	const backgroundY = useTransform(scrollY, [0, 800], [0, -350]);
	const textY = useTransform(scrollY, [0, 500], [0, -150]);
	const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

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
			const nextIndex = currentIndex + 1;
			setPhotosToShow((prev) => Math.max(prev + 12, nextIndex + 1));
			setSelectedPhoto(featuredPhotos[nextIndex]);
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
					<motion.div
						className="absolute inset-0 z-0 -top-[350px] -bottom-[350px]"
						style={{ y: backgroundY }}
					>
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
									className="absolute inset-x-0 top-[350px] bottom-[350px] transition-opacity duration-1000 ease-in-out overflow-hidden bg-gray-900 flex items-center justify-center"
									style={{
										opacity: isVisible ? 1 : 0,
									}}
								>
									<img
										src={imageUrl}
										alt=""
										aria-hidden="true"
										className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 sm:hidden"
									/>
									<img
										src={imageUrl}
										alt={photo.tags.category || 'Hero photo'}
										className="relative w-full h-full object-contain sm:object-cover"
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
					className="relative z-10"
					animate={{ opacity: heroTextVisible ? 1 : 0 }}
					transition={{ duration: 1, ease: 'easeOut' }}
				>
					<motion.div
						className="text-center max-w-4xl mx-auto px-4"
						variants={heroVariants}
						initial="hidden"
						animate="visible"
						style={{ y: textY, opacity: textOpacity }}
					>
						<motion.h1
							className="text-2xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.8),0_4px_40px_rgba(0,0,0,0.5)]"
							variants={textVariants}
							transition={{ duration: 0.8, ease: 'easeOut' }}
						>
							Capturing <span className="block text-blue-400">The Moment</span>
						</motion.h1>
					</motion.div>
				</motion.div>

				<div
					className="absolute bottom-[12%] left-1/2 -translate-x-1/2 z-10 cursor-pointer"
					onClick={() => document.getElementById('photo-section')?.scrollIntoView({ behavior: 'smooth' })}
					aria-label="Scroll down"
				>
					<div className="scroll-arrow" />
				</div>

				{heroPhotos.length > 1 && (
					<>
						<div className="hidden sm:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 gap-2 z-10">
							{heroPhotos.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentHeroIndex(index)}
									className={`w-2 h-2 rounded-full transition-all duration-300 ${
										index === currentHeroIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
									}`}
									aria-label={`Go to image ${index + 1}`}
								/>
							))}
						</div>
						<div className="flex sm:hidden absolute top-[calc(50%+34vw+2rem)] left-1/2 transform -translate-x-1/2 gap-2 z-10">
							{heroPhotos.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentHeroIndex(index)}
									className={`w-2 h-2 rounded-full transition-all duration-300 ${
										index === currentHeroIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
									}`}
									aria-label={`Go to image ${index + 1}`}
								/>
							))}
						</div>
					</>
				)}
			</section>

			<motion.section
				id="photo-section"
				className="py-16 bg-[linear-gradient(to_bottom,#111827_0%,#05080f_15%,#070d1c_30%,#0a1226_50%,#0c1830_70%,#0f1d3c_80%,#070d1c_90%,#111827_100%)]"
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
						columns="large"
					/>

					{hasMorePhotos ? (
						<div ref={loadMoreRef} className="flex justify-center py-8" style={{ overflowAnchor: 'none' }}>
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
									View All Photos
								</motion.button>
							</Link>
						</motion.div>
					)}
				</div>
			</motion.section>

			<PhotoViewerModal
				photo={selectedPhoto}
				isOpen={isModalOpen}
				onClose={handleModalClose}
				onNext={
					getCurrentPhotoIndex() < displayedPhotos.length - 1 || hasMorePhotos ? handleNextPhoto : undefined
				}
				onPrevious={getCurrentPhotoIndex() > 0 ? handlePreviousPhoto : undefined}
			/>
		</div>
	);
};
