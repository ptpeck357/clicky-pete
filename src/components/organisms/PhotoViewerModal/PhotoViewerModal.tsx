import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '../../../types/photo';

interface PhotoViewerModalProps {
	photo: Photo | null;
	isOpen: boolean;
	onClose: () => void;
	onNext?: () => void;
	onPrevious?: () => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({ photo, isOpen, onClose, onNext, onPrevious }) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imageError, setImageError] = useState(false);
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

	const onCloseRef = useRef(onClose);
	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		if (!isOpen) return;

		window.history.pushState({ modal: 'photo' }, '');

		const handlePopState = () => {
			onCloseRef.current();
		};

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
			if ((window.history.state as { modal?: string } | null)?.modal === 'photo') {
				window.history.back();
			}
		};
	}, [isOpen]);

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

	const currentPhotoId = photo?.id;
	const [lastPhotoId, setLastPhotoId] = useState<string | undefined>();

	if (currentPhotoId !== lastPhotoId) {
		setImageLoaded(false);
		setImageError(false);
		setLastPhotoId(currentPhotoId);
	}

	if (!photo) return null;

	const getPhotoUrls = () => {
		const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;
		if (!cloudFrontUrl) {
			throw new Error(
				'CloudFront URL not configured. Please set VITE_CLOUDFRONT_URL in your environment variables.',
			);
		}

		const baseUrl = `${cloudFrontUrl}/photos`;
		return {
			src: `${baseUrl}/2000/${photo.file}`,
			srcSet: `${baseUrl}/800/${photo.file} 800w, ${baseUrl}/2000/${photo.file} 2000w`,
			sizes: '(max-width: 1024px) 800px, 2000px',
		};
	};

	const photoUrls = getPhotoUrls();

	const getModalDimensions = () => {
		const aspectRatio = (photo.tags.aspectRatio as string) || '3:2';

		// Derived from the photo's own ratio rather than branching on the literal strings
		// "4:5" and everything-else. Any other crop used to be framed as if it were 3:2,
		// leaving the rounded border and shadow floating clear of the image edges.
		const [ratioWidth, ratioHeight] = aspectRatio.split(':').map(Number);
		const ratio = ratioWidth > 0 && ratioHeight > 0 ? ratioWidth / ratioHeight : 3 / 2;

		// The 1200/800 caps are deliberate and predate this: they keep 3:2 and 4:5 rendering
		// exactly as before, so only ratios that previously had no correct branch change.
		const maxWidth = Math.min(windowDimensions.width * 0.9, 1200);
		const maxHeight = Math.min(windowDimensions.height * 0.8, 800);

		let containerWidth = maxWidth;
		let containerHeight = containerWidth / ratio;

		if (containerHeight > maxHeight) {
			containerHeight = maxHeight;
			containerWidth = containerHeight * ratio;
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
						className="absolute inset-0 bg-black/60 backdrop-blur-md"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<motion.button
						className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
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
							className="hidden md:block absolute md:left-10 top-1/2 transform -translate-y-1/2 z-10 md:p-3 rounded-full bg-white text-black hover:bg-white/80 transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								onPrevious();
							}}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: [0, -4, 0] }}
							transition={{
								opacity: { delay: 0.3, duration: 0.3 },
								x: { delay: 0.6, repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
							}}
						>
							<svg
								className="w-4 h-4 md:w-6 md:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
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
							className="hidden md:block absolute md:right-10 top-1/2 transform -translate-y-1/2 z-10 md:p-3 rounded-full bg-white text-black hover:bg-white/80 transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								onNext();
							}}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: [0, 4, 0] }}
							transition={{
								opacity: { delay: 0.3, duration: 0.3 },
								x: { delay: 0.6, repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
							}}
						>
							<svg
								className="w-4 h-4 md:w-6 md:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</motion.button>
					)}

					<motion.div
						className="relative flex flex-col items-center justify-center touch-pan-y"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.4, ease: 'easeOut' }}
						onPanEnd={(_, info) => {
							const { offset, velocity } = info;
							if (offset.x < -50 || velocity.x < -500) {
								onNext?.();
							} else if (offset.x > 50 || velocity.x > 500) {
								onPrevious?.();
							}
						}}
					>
						{!imageLoaded && !imageError && (
							<motion.div
								className="absolute inset-0 flex items-center justify-center"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
							</motion.div>
						)}

						{imageError && (
							<motion.div
								className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<div className="text-center text-gray-400">
									<motion.svg
										className="mx-auto h-16 w-16 mb-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ type: 'spring', stiffness: 200 }}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</motion.svg>
									<p className="text-lg font-medium">Failed to load image</p>
									<p className="text-sm text-gray-500 mt-1">The image could not be displayed</p>
								</div>
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
								src={photoUrls.src}
								srcSet={photoUrls.srcSet}
								sizes={photoUrls.sizes}
								alt={(photo.tags.category as string) || 'Photo'}
								draggable={false}
								className={`w-full h-full object-contain transition-opacity duration-300 select-none ${
									imageLoaded ? 'opacity-100' : 'opacity-0'
								}`}
								onLoad={() => setImageLoaded(true)}
								onError={() => setImageError(true)}
								initial={{ opacity: 0 }}
								animate={{ opacity: imageLoaded ? 1 : 0 }}
								transition={{ duration: 0.3 }}
							/>

							{/* Mobile: arrows inside image, centered on photo */}
							{onPrevious && (
								<motion.button
									className="md:hidden absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
									onClick={(e) => {
										e.stopPropagation();
										onPrevious();
									}}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: [0, -4, 0] }}
									transition={{
										opacity: { delay: 0.3, duration: 0.3 },
										x: { delay: 0.6, repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
									}}
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
									className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
									onClick={(e) => {
										e.stopPropagation();
										onNext();
									}}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: [0, 4, 0] }}
									transition={{
										opacity: { delay: 0.3, duration: 0.3 },
										x: { delay: 0.6, repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
									}}
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</motion.button>
							)}

							{/* Desktop: Overlay on image */}
							{imageLoaded && !imageError && (
								<motion.div
									className="hidden md:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg"
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
							)}
						</div>

						{/* Mobile: Metadata below image */}
						<div className="md:hidden mt-3 text-center">
							<div className="text-white">
								{photo.tags.category && (
									<span className="inline-block bg-blue-600 text-[10px] px-2 py-0.5 rounded-full mb-1 font-medium">
										{photo.tags.category}
									</span>
								)}
								{photo.tags.location && <p className="text-xs font-medium">{photo.tags.location}</p>}
								{photo.tags.collection && (
									<p className="text-[10px] text-gray-400">{photo.tags.collection} Collection</p>
								)}
							</div>
						</div>
					</motion.div>

					<motion.div
						className="hidden lg:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 items-center gap-4 text-white/70 text-sm"
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
