import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhotoViewerModal } from '../components/gallery/PhotoViewerModal';
import { getFeaturedPhotos } from '../data/mockPhotos';
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

const buttonVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: { opacity: 1, scale: 1 },
};

const photoGridVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const photoItemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

export const Home: React.FC = () => {
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Get featured photos
	const featuredPhotos = useMemo(() => getFeaturedPhotos(), []);

	// Initialize displayed photos using lazy initial state
	const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>(() => featuredPhotos.slice(0, 8));
	const [photosPerPage] = useState(8);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMorePhotos, setHasMorePhotos] = useState(() => featuredPhotos.length > 8);
	const [showViewCollections, setShowViewCollections] = useState(false);

	// Infinite scroll handler
	const loadMorePhotos = useCallback(() => {
		const startIndex = currentPage * photosPerPage;
		const endIndex = startIndex + photosPerPage;
		const newPhotos = featuredPhotos.slice(startIndex, endIndex);

		if (newPhotos.length > 0) {
			setDisplayedPhotos((prev) => [...prev, ...newPhotos]);
			setCurrentPage((prev) => prev + 1);

			// Check if we've loaded all featured photos
			if (endIndex >= featuredPhotos.length) {
				setHasMorePhotos(false);
				setShowViewCollections(true);
			}
		} else {
			setHasMorePhotos(false);
			setShowViewCollections(true);
		}
	}, [currentPage, photosPerPage, featuredPhotos]);

	// Scroll event listener for infinite scroll
	useEffect(() => {
		const handleScroll = () => {
			if (
				hasMorePhotos &&
				window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 // Load when 1000px from bottom
			) {
				loadMorePhotos();
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [hasMorePhotos, loadMorePhotos]);

	const featuredPhoto = displayedPhotos[0]; // First photo as hero
	const recentPhotos = displayedPhotos.slice(1); // Rest of photos

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
		return displayedPhotos.findIndex((p) => p.key === selectedPhoto.key);
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
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				{featuredPhoto && (
					<>
						<motion.div
							className="absolute inset-0 bg-cover bg-center cursor-pointer group"
							style={{ backgroundImage: `url(${featuredPhoto.preSignedUrl})` }}
							initial={{ scale: 1.1, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 1.5, ease: 'easeOut' }}
							onClick={() => handlePhotoClick(featuredPhoto)}
						/>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 1, delay: 0.5 }}
						/>

						{/* Click indicator for hero image */}
						<motion.div
							className="absolute top-8 right-8 bg-black bg-opacity-50 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
							whileHover={{ scale: 1.1 }}
							onClick={() => handlePhotoClick(featuredPhoto)}
						>
							<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
								/>
							</svg>
						</motion.div>
					</>
				)}

				{/* Loading state for hero */}
				{displayedPhotos.length === 0 && (
					<motion.div
						className="absolute inset-0 bg-gray-800"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					/>
				)}

				<motion.div
					className="relative z-10 text-center max-w-4xl mx-auto px-4"
					variants={heroVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.div className="mb-6" variants={textVariants}>
						<span className="inline-flex items-center text-sm text-blue-400 mb-4">
							<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
									clipRule="evenodd"
								/>
							</svg>
							Featured Collection
						</span>
					</motion.div>

					<motion.h1
						className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
						variants={textVariants}
						transition={{ duration: 0.8, ease: 'easeOut' }}
					>
						Capturing the Wild &<span className="block text-blue-400">The Moment</span>
					</motion.h1>

					<motion.p
						className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed px-4"
						variants={textVariants}
						transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
					>
						Immersive photography from the peaks of Montana to the neon streets of Tokyo.
					</motion.p>

					<motion.div
						className="flex items-center justify-center space-x-4 mb-8"
						variants={buttonVariants}
						transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
					>
						<motion.button
							className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</motion.button>
						<motion.button
							className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</motion.button>
					</motion.div>
				</motion.div>

				{/* Scroll indicator */}
				<motion.button
					className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-full p-2"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 2, duration: 0.8 }}
					onClick={() => {
						const photoSection = document.querySelector('#photo-section');
						if (photoSection) {
							photoSection.scrollIntoView({
								behavior: 'smooth',
								block: 'start',
							});
						}
					}}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					aria-label="Scroll to photo gallery"
				>
					<motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
						<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

			{/* Photo Grid */}
			<motion.section
				id="photo-section"
				className="py-16 bg-gray-900"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{displayedPhotos.length === 0 ? (
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
							variants={photoGridVariants}
							initial="hidden"
							animate="visible"
						>
							{Array.from({ length: 9 }).map((_, i) => (
								<motion.div
									key={i}
									variants={photoItemVariants}
									transition={{ duration: 0.6, ease: 'easeOut' }}
								>
									<div className="bg-gray-800 aspect-square rounded-lg mb-4 animate-pulse" />
								</motion.div>
							))}
						</motion.div>
					) : (
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
							variants={photoGridVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
						>
							{recentPhotos.map((photo, index) => (
								<motion.div
									key={photo.key}
									variants={photoItemVariants}
									transition={{ duration: 0.6, ease: 'easeOut' }}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<div
										onClick={() => handlePhotoClick(photo)}
										className={`group relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 ${
											index === 0 ? 'md:col-span-2 md:row-span-2' : ''
										} ${index === 3 ? 'lg:row-span-2' : ''}`}
									>
										<div
											className={`bg-gray-800 ${index === 0 ? 'aspect-[2/1]' : 'aspect-square'}`}
										>
											<motion.img
												src={photo.preSignedUrl}
												alt={(photo.tags.category as string) || 'Photo'}
												className="w-full h-full object-cover"
												initial={{ opacity: 0, scale: 1.1 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ duration: 0.6 }}
												whileHover={{ scale: 1.1 }}
											/>
										</div>
										<motion.div
											className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end"
											initial={{ opacity: 0 }}
											whileHover={{ opacity: 1 }}
										>
											<motion.div
												className="p-6 text-white"
												initial={{ y: 20, opacity: 0 }}
												whileHover={{ y: 0, opacity: 1 }}
												transition={{ delay: 0.1 }}
											>
												{photo.tags.category && (
													<span className="inline-block bg-blue-600 text-xs px-3 py-1 rounded-full mb-2 font-medium">
														{photo.tags.category as string}
													</span>
												)}
												{photo.tags.location && (
													<p className="text-sm font-medium">
														{photo.tags.location as string}
													</p>
												)}
											</motion.div>
										</motion.div>

										{/* Click indicator */}
										<motion.div
											className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
											whileHover={{ scale: 1.1 }}
										>
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
												/>
											</svg>
										</motion.div>
									</div>
								</motion.div>
							))}
						</motion.div>
					)}

					{/* Loading more photos indicator */}
					{hasMorePhotos && (
						<motion.div
							className="text-center mt-8"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<div className="inline-flex items-center text-gray-400">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2" />
								Loading more featured photos...
							</div>
						</motion.div>
					)}

					{/* View Collections Button - Show when all featured photos are loaded */}
					{showViewCollections && (
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
									View Collections
								</motion.button>
							</Link>
						</motion.div>
					)}
				</div>
			</motion.section>

			{/* Quote Section */}
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
						"Photography is the art of frozen time... the ability to store emotion and feelings within a
						frame."
					</motion.blockquote>
					<motion.cite
						className="block mt-6 text-gray-500"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						viewport={{ once: true }}
					>
						— Meshack Otieno
					</motion.cite>
				</div>
			</motion.section>

			{/* Photo Modal */}
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
