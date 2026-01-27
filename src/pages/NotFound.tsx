import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFound: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
			<div className="text-center max-w-md mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<motion.h1
						className="text-8xl font-bold text-blue-400 mb-4"
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						404
					</motion.h1>

					<motion.h2
						className="text-2xl font-semibold mb-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						Page Not Found
					</motion.h2>

					<motion.p
						className="text-gray-400 mb-8 leading-relaxed"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the
						wrong URL.
					</motion.p>

					<motion.div
						className="space-y-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.8 }}
					>
						<Link to="/">
							<motion.button
								className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Go Home
							</motion.button>
						</Link>

						<Link to="/gallery">
							<motion.button
								className="w-full px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-colors duration-200"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Browse Gallery
							</motion.button>
						</Link>
					</motion.div>
				</motion.div>

				<motion.div
					className="mt-12"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 1 }}
				>
					<motion.svg
						className="mx-auto h-24 w-24 text-gray-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						initial={{ rotate: -10 }}
						animate={{ rotate: 0 }}
						transition={{ duration: 0.5, delay: 1.2 }}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1}
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</motion.svg>
				</motion.div>
			</div>
		</div>
	);
};
