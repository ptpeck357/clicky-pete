import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '../../types/photo';

interface PhotoViewerModalProps {
	photo: Photo | null;
	isOpen: boolean;
	onClose: () => void;
	onNext?: () => void;
	onPrevious?: () => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({ photo, isOpen, onClose, onNext, onPrevious }) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [windowDimensions, setWindowDimensions] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 1920,
		height: typeof window !== 'undefined' ? window.innerHeight : 1080,
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	}, []);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		const handleArrowKeys = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft' && onPrevious) {
				onPrevious();
			} else if (e.key === 'ArrowRight' && onNext) {
				onNext();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.addEventListener('keydown', handleArrowKeys);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.removeEventListener('keydown', handleArrowKeys);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose, onNext, onPrevious]);

	const currentPhotoKey = photo?.key;
	const [lastPhotoKey, setLastPhotoKey] = useState<string | undefined>();

	if (currentPhotoKey !== lastPhotoKey) {
		setImageLoaded(false);
		setLastPhotoKey(currentPhotoKey);
	}

	if (!photo) return null;

	const getModalDimensions = () => {
		const aspectRatio = (photo.tags.aspectRatio as string) || '3:2';
		const isPortrait = aspectRatio === '3:4';

		const viewportWidth = windowDimensions.width;
		const viewportHeight = windowDimensions.height;

		let containerWidth: number;
		let containerHeight: number;

		if (isPortrait) {
			// For 3:4 portraits, prioritize height
			containerHeight = Math.min(viewportHeight * 0.85, 800);
			containerWidth = containerHeight * (3 / 4);

			// Ensure it doesn't exceed viewport width
			if (containerWidth > viewportWidth * 0.9) {
				containerWidth = viewportWidth * 0.9;
				containerHeight = containerWidth * (4 / 3);
			}
		} else {
			// For 3:2 landscapes, prioritize width
			containerWidth = Math.min(viewportWidth * 0.85, 1200);
			containerHeight = containerWidth * (2 / 3);

			// Ensure it doesn't exceed viewport height
			if (containerHeight > viewportHeight * 0.9) {
				containerHeight = viewportHeight * 0.9;
				containerWidth = containerHeight * (3 / 2);
			}
		}

		return { containerWidth, containerHeight, aspectRatio };
	};

	const { containerWidth, containerHeight, aspectRatio } = getModalDimensions();

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					<motion.div
						className="absolute inset-0 bg-black/80 backdrop-blur-md"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<motion.button
						className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
						onClick={onClose}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2 }}
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</motion.button>

					{onPrevious && (
						<motion.button
							className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
							onClick={onPrevious}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
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
					)}

					{onNext && (
						<motion.button
							className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
							onClick={onNext}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</motion.button>
					)}

					<motion.div
						className="relative flex items-center justify-center"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.4, ease: 'easeOut' }}
					>
						{!imageLoaded && (
							<motion.div
								className="absolute inset-0 flex items-center justify-center"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
							</motion.div>
						)}

						<div
							className="relative rounded-lg shadow-2xl overflow-hidden"
							style={{
								width: `${containerWidth}px`,
								height: `${containerHeight}px`,
								aspectRatio: aspectRatio.replace(':', '/'),
							}}
						>
							<motion.img
								src={photo.preSignedUrl}
								alt={(photo.tags.category as string) || 'Photo'}
								className={`w-full h-full object-cover transition-opacity duration-300 ${
									imageLoaded ? 'opacity-100' : 'opacity-0'
								}`}
								onLoad={() => setImageLoaded(true)}
								initial={{ opacity: 0 }}
								animate={{ opacity: imageLoaded ? 1 : 0 }}
								transition={{ duration: 0.3 }}
							/>

							<motion.div
								className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.3 }}
							>
								<div className="text-white">
									{photo.tags.category && (
										<span className="inline-block bg-blue-600 text-xs px-3 py-1 rounded-full mb-2 font-medium">
											{photo.tags.category}
										</span>
									)}
									{photo.tags.location && (
										<p className="text-sm font-medium mb-1">{photo.tags.location}</p>
									)}
									{photo.tags.collection && (
										<p className="text-xs text-gray-300">{photo.tags.collection} Collection</p>
									)}
								</div>
							</motion.div>
						</div>
					</motion.div>

					<motion.div
						className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-white/70 text-sm"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						{onPrevious && (
							<span className="flex items-center gap-1">
								<kbd className="px-2 py-1 bg-white/20 rounded text-xs">←</kbd>
								Previous
							</span>
						)}
						<span className="flex items-center gap-1">
							<kbd className="px-2 py-1 bg-white/20 rounded text-xs">ESC</kbd>
							Close
						</span>
						{onNext && (
							<span className="flex items-center gap-1">
								<kbd className="px-2 py-1 bg-white/20 rounded text-xs">→</kbd>
								Next
							</span>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
