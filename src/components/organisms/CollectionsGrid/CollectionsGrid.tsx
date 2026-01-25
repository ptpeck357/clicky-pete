import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CollectionCard } from '../CollectionCard';
import { getCollectionStats } from '../../../data/mockPhotos';
import { Spinner } from '../../atoms';
import type { Collection } from '../../../types/photo';

interface CollectionsGridProps {
	onCollectionSelect: (collection: string) => void;
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0,
		},
	},
};

export const CollectionsGrid: React.FC<CollectionsGridProps> = ({ onCollectionSelect }) => {
	const [collections, setCollections] = useState<Collection[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				setLoading(true);
				// Add a small delay to show loading state
				await new Promise((resolve) => setTimeout(resolve, 200));
				const collectionStats = getCollectionStats();
				setCollections(collectionStats);
			} catch (error) {
				console.error('Failed to fetch collections:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCollections();
	}, []);

	if (loading) {
		return (
			<motion.div
				className="flex flex-col justify-center items-center py-16"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<Spinner size="lg" color="blue" />
				<motion.p
					className="text-gray-400 mt-4 text-sm"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					Loading collections...
				</motion.p>
			</motion.div>
		);
	}

	if (collections.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-400">No collections found</p>
			</div>
		);
	}

	return (
		<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			{collections.map((collection) => (
				<CollectionCard
					key={collection.name}
					name={collection.name}
					count={collection.count}
					coverPhoto={collection.coverPhoto}
					onClick={() => onCollectionSelect(collection.name)}
				/>
			))}
		</motion.div>
	);
};
