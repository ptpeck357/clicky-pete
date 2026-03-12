import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { POSTS, fetchPosts } from '../data/posts';
import type { Post } from '../data/posts';

export const Posts: React.FC = () => {
	const navigate = useNavigate();
	const [posts, setPosts] = useState<Post[]>(POSTS);

	useEffect(() => {
		fetchPosts().then(setPosts).catch(console.error);
	}, []);

	return (
		<div className="min-h-screen bg-gray-900">
			<div className="max-w-3xl mx-auto px-6 py-24 sm:py-32">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-16"
				>
					<h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Behind the Frame</h1>
					<p className="text-gray-400 text-lg leading-relaxed">
						A visual journal documenting the intersection of light, perspective, and the stories found in
						between the shutter clicks.
					</p>
				</motion.div>

				{/* Section header */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="flex items-center justify-between mb-10 border-b border-gray-800 pb-4"
				>
					<span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
						Journal Entries
					</span>
					<span className="text-xs font-semibold tracking-widest text-gray-500 uppercase flex items-center gap-1">
						<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
						Newest to Oldest
					</span>
				</motion.div>

				{/* Posts */}
				<div className="space-y-20">
					{posts.map((post, i) => (
						<motion.article
							key={post.id}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
						>
							{/* Meta */}
							<div className="flex items-center gap-3 mb-4">
								<span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">
									{post.date}
								</span>
								<span className="text-gray-600">·</span>
								<span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
									{post.category}
								</span>
							</div>

							{/* Excerpt */}
							<p className="text-gray-300 text-base leading-relaxed mb-6">{post.excerpt}</p>

							{/* Image — clicking navigates to post detail */}
							<motion.div
								className="relative overflow-hidden rounded-lg cursor-pointer group"
								whileHover={{ scale: 1.005 }}
								transition={{ duration: 0.3 }}
								onClick={() => navigate(`/posts/${post.id}`)}
							>
								<img
									src={post.image}
									alt={post.category}
									className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
									style={{ maxHeight: '520px' }}
								/>
								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg" />
								<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<span className="text-xs font-semibold tracking-widest text-white uppercase bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
										Read more →
									</span>
								</div>
							</motion.div>
						</motion.article>
					))}
				</div>
			</div>
		</div>
	);
};
