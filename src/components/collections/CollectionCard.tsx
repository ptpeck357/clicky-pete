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
			{/* Cover Photo */}
			<div className="aspect-[4/3] relative overflow-hidden">
				<motion.img
					src={coverPhoto.preSignedUrl}
					alt={`${name} collection`}
					className="w-full h-full object-cover"
					whileHover={{ scale: 1.1 }}
					transition={{ duration: 0.3 }}
				/>

				{/* Overlay */}
				<motion.div
					className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end"
					initial={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
				>
					<motion.div
						className="p-4 text-white w-full"
						initial={{ y: 20, opacity: 0 }}
						whileHover={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.1 }}
					>
						<h3 className="text-lg font-semibold mb-1">{name}</h3>
						<p className="text-sm text-gray-300">{count} photos</p>
					</motion.div>
				</motion.div>
			</div>

			{/* Collection Info */}
			<div className="p-4">
				<h3 className="text-white font-semibold text-lg mb-1">{name}</h3>
				<p className="text-gray-400 text-sm">{count} photos</p>
			</div>
		</motion.div>
	);
};
