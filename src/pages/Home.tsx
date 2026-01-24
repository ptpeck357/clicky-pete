import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePhotos } from '../hooks/usePhotos';

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
	const { photos, loading } = usePhotos();
	const featuredPhoto = photos[0]; // First photo as hero
	const recentPhotos = photos.slice(1, 9); // Next 8 photos

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				{featuredPhoto && !loading && (
					<>
						<motion.div
							className="absolute inset-0 bg-cover bg-center"
							style={{ backgroundImage: `url(${featuredPhoto.preSignedUrl})` }}
							initial={{ scale: 1.1, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 1.5, ease: 'easeOut' }}
						/>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-40"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 1, delay: 0.5 }}
						/>
					</>
				)}

				{/* Loading state for hero */}
				{loading && (
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
				<motion.div
					className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 2, duration: 0.8 }}
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
				</motion.div>
			</section>

			{/* Category Filters */}
			<motion.section
				className="py-12 bg-gray-900"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12"
						variants={photoGridVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{[
							{ to: '/gallery', label: 'All', active: true },
							{ to: '/category/landscape', label: 'Landscape' },
							{ to: '/category/portrait', label: 'Portrait' },
							{ to: '/category/street', label: 'Street' },
							{ to: '/category/nature', label: 'Nature' },
						].map((item) => (
							<motion.div
								key={item.label}
								variants={photoItemVariants}
								transition={{ duration: 0.6, ease: 'easeOut' }}
							>
								<Link to={item.to}>
									<motion.button
										className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base ${
											item.active
												? 'bg-blue-600 text-white'
												: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
										}`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										{item.label}
									</motion.button>
								</Link>
							</motion.div>
						))}
					</motion.div>
				</div>
			</motion.section>

			{/* Photo Grid */}
			<motion.section
				className="py-16 bg-gray-900"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{loading ? (
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
									<Link
										to="/gallery"
										className={`group relative overflow-hidden rounded-lg block transition-transform duration-300 ${
											index === 0 ? 'md:col-span-2 md:row-span-2' : ''
										} ${index === 3 ? 'lg:row-span-2' : ''}`}
									>
										<div
											className={`bg-gray-800 ${index === 0 ? 'aspect-[2/1]' : 'aspect-square'}`}
										>
											<motion.img
												src={photo.preSignedUrl}
												alt={photo.tags.category || 'Photo'}
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
														{photo.tags.category}
													</span>
												)}
												{photo.tags.location && (
													<p className="text-sm font-medium">{photo.tags.location}</p>
												)}
											</motion.div>
										</motion.div>
									</Link>
								</motion.div>
							))}
						</motion.div>
					)}

					<motion.div
						className="text-center mt-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						viewport={{ once: true }}
					>
						<Link to="/gallery">
							<motion.button
								className="px-8 py-3 border border-gray-600 text-white rounded-full font-medium hover:bg-white hover:text-gray-900 transition-all duration-300"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Load More Memories
							</motion.button>
						</Link>
					</motion.div>
				</div>
			</motion.section>

			{/* Quote Section */}
			<motion.section
				className="py-20 bg-gray-800"
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
		</div>
	);
};
