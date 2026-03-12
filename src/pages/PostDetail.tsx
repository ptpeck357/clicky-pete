import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById } from '../data/posts';
import type { Post } from '../data/posts';

export const PostDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(!!id);
	const [lightboxOpen, setLightboxOpen] = useState(false);

	useEffect(() => {
		if (!id) return;
		let cancelled = false;
		fetchPostById(id).then((data) => {
			if (!cancelled) {
				setPost(data ?? null);
				setLoading(false);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [id]);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setLightboxOpen(false);
		};
		if (lightboxOpen) document.addEventListener('keydown', handleEsc);
		return () => document.removeEventListener('keydown', handleEsc);
	}, [lightboxOpen]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
			</div>
		);
	}

	if (!post) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-400 text-lg mb-6">Post not found.</p>
					<button
						onClick={() => navigate('/posts')}
						className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
					>
						← Back to Posts
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900">
			<div className="max-w-3xl mx-auto px-6 py-24 sm:py-32">
				{/* Back link */}
				<motion.button
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.4 }}
					onClick={() => navigate('/posts')}
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
					Back to Posts
				</motion.button>

				{/* Meta */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="flex items-center gap-3 mb-5"
				>
					<span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">{post.date}</span>
					<span className="text-gray-600">·</span>
					<span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
						{post.category}
					</span>
				</motion.div>

				{/* Excerpt */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.15 }}
					className="text-gray-300 text-lg leading-relaxed mb-4"
				>
					{post.excerpt}
				</motion.p>

				{/* Body */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-gray-400 text-base leading-relaxed mb-10"
				>
					{post.body}
				</motion.p>

				{/* Photo — click to open lightbox */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.25 }}
					className="relative overflow-hidden rounded-lg cursor-zoom-in group"
					onClick={() => setLightboxOpen(true)}
				>
					<img
						src={post.image}
						alt={post.category}
						className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
					/>
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
						<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 backdrop-blur-sm">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
			</div>

			{/* Lightbox */}
			<AnimatePresence>
				{lightboxOpen && (
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						{/* Backdrop */}
						<motion.div
							className="absolute inset-0 bg-black/80 backdrop-blur-md"
							onClick={() => setLightboxOpen(false)}
						/>

						{/* Close button */}
						<motion.button
							className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
							onClick={() => setLightboxOpen(false)}
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

						{/* Image */}
						<motion.img
							src={post.image}
							alt={post.category}
							className="relative z-10 max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
							initial={{ opacity: 0, scale: 0.85 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.85 }}
							transition={{ duration: 0.4, ease: 'easeOut' }}
							onClick={(e) => e.stopPropagation()}
						/>

						{/* ESC hint */}
						<motion.div
							className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-white/60 text-sm"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
						>
							<kbd className="px-2 py-1 bg-white/20 rounded text-xs">ESC</kbd>
							Close
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
