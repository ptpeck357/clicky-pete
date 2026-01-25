import React from 'react';
import { motion } from 'framer-motion';
import type { Photo } from '../../types/photo';

interface CollectionCardProps {
	name: string;
	count: number;
	coverPhoto: Photo;
	onClick: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ name, count, coverPhoto, onClick }) => {
	return (
		<motion.div
			className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
			onClick={onClick}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="aspect-square relative overflow-hidden">
				<motion.img
					src={coverPhoto.preSignedUrl}
					alt={`${name} collection`}
					className="w-full h-full object-cover"
					whileHover={{ scale: 1.1 }}
					transition={{ duration: 0.3 }}
				/>

				{/* Photo Count - Top Right */}
				<motion.div
					className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
				>
					<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span className="text-white text-sm font-medium">{count}</span>
				</motion.div>

				{/* Collection Title - Bottom Left */}
				<motion.div
					className="absolute bottom-4 left-4"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<h3 className="text-white text-xl font-bold drop-shadow-lg">{name}</h3>
				</motion.div>
			</div>
		</motion.div>
	);
};
