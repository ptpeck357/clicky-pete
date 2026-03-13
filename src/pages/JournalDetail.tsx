import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJournalById } from '../data/journals';
import type { Journal } from '../data/journals';

export const JournalDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [entry, setEntry] = useState<Journal | null>(null);
	const [loading, setLoading] = useState(!!id);
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	useEffect(() => {
		if (!id) return;
		let cancelled = false;
		fetchJournalById(id).then((data) => {
			if (!cancelled) {
				setEntry(data ?? null);
				setLoading(false);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [id]);

	useEffect(() => {
		if (lightboxIndex === null) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setLightboxIndex(null);
			if (e.key === 'ArrowRight' && entry && lightboxIndex < entry.images.length - 1)
				setLightboxIndex((i) => (i ?? 0) + 1);
			if (e.key === 'ArrowLeft' && lightboxIndex > 0) setLightboxIndex((i) => (i ?? 0) - 1);
		};
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [lightboxIndex, entry]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
			</div>
		);
	}

	if (!entry) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-400 text-lg mb-6">Entry not found.</p>
					<button
						onClick={() => navigate('/journal')}
						className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
					>
						← Back to Journal
					</button>
				</div>
			</div>
		);
	}

	const activeImage = lightboxIndex !== null ? entry.images[lightboxIndex] : null;

	return (
		<div className="min-h-screen bg-gray-900">
			<div className="max-w-3xl mx-auto px-6 py-24 sm:py-32">
				<motion.button
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.4 }}
					onClick={() => navigate('/journal')}
					className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium mb-12 group"
				>
					<svg
						className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					Back to Journal
				</motion.button>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="flex items-center gap-3 mb-3"
				>
					<span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">{entry.date}</span>
					<span className="text-gray-600">·</span>
					<span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
						{entry.category}
					</span>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.15 }}
					className="text-3xl sm:text-4xl font-bold text-white mb-6"
				>
					{entry.title}
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-gray-400 text-base leading-relaxed mb-10"
				>
					{entry.body}
				</motion.p>

				<div className="space-y-4">
					{entry.images.map((src, i) => (
						<motion.div
							key={src}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.25 + i * 0.1 }}
							className="relative overflow-hidden rounded-lg cursor-zoom-in group"
							onClick={() => setLightboxIndex(i)}
						>
							<img
								src={src}
								alt={`${entry.category} ${i + 1}`}
								className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
							/>
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
								<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 backdrop-blur-sm">
									<svg
										className="w-6 h-6 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
										/>
									</svg>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			<AnimatePresence>
				{lightboxIndex !== null && activeImage && (
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<motion.div
							className="absolute inset-0 bg-black/80 backdrop-blur-md"
							onClick={() => setLightboxIndex(null)}
						/>

						<motion.button
							className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
							onClick={() => setLightboxIndex(null)}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
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

						{lightboxIndex > 0 && (
							<motion.button
								className="absolute left-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									setLightboxIndex((i) => (i ?? 1) - 1);
								}}
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
						)}

						{lightboxIndex < entry.images.length - 1 && (
							<motion.button
								className="absolute right-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									setLightboxIndex((i) => (i ?? 0) + 1);
								}}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</motion.button>
						)}

						<motion.img
							key={activeImage}
							src={activeImage}
							alt={entry.category}
							className="relative z-10 max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
							initial={{ opacity: 0, scale: 0.85 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.85 }}
							transition={{ duration: 0.3, ease: 'easeOut' }}
							onClick={(e) => e.stopPropagation()}
						/>

						<motion.div
							className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/60 text-sm"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							{entry.images.length > 1 && (
								<span>
									{lightboxIndex + 1} / {entry.images.length}
								</span>
							)}
							<span className="flex items-center gap-1">
								<kbd className="px-2 py-1 bg-white/20 rounded text-xs">ESC</kbd>
								Close
							</span>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
