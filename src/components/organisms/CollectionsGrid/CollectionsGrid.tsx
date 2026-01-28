import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CollectionCard } from '../CollectionCard';
import { photoService } from '../../../services/photoService';
import { generateCollections } from '../../../services/collectionService';
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
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				setLoading(true);
				setError(null);

				const allPhotos = await photoService.getPhotos();
				const generatedCollections = generateCollections(allPhotos);

				setCollections(generatedCollections);
			} catch (error) {
				console.error('Failed to fetch collections:', error);
				setError(error instanceof Error ? error.message : 'Failed to load collections');
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

	if (error) {
		return (
			<div className="text-center py-12">
				<p className="text-red-400 mb-4">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
				>
					Try Again
				</button>
			</div>
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
