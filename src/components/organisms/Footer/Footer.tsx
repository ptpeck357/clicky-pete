import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-800 border-t border-gray-700">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
					<motion.div
						className="flex items-center gap-6 text-sm mb-4 sm:mb-0"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.8 }}
						viewport={{ once: true }}
					>
						<span className="text-blue-400">ISO 100</span>
						<span className="text-purple-500">1/1050</span>
						<span className="text-lime-500">f/2.4</span>
					</motion.div>

					<motion.div
						className="text-sm mt-4 sm:mt-0 order-last sm:order-none"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 1.0 }}
						viewport={{ once: true }}
					>
						<span className="text-black-400">© 2026 Peter Peck Photography</span>
					</motion.div>
				</div>
			</div>
		</footer>
	);
};
