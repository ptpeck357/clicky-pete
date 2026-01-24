import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Loading } from '../ui/Loading';

interface CategoryFilterProps {
	selectedCategory?: string;
	onCategoryChange: (category: string | undefined) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
	const { categories, loading, error } = useCategories();

	if (loading) {
		return <Loading size="sm" text="Loading categories..." />;
	}

	if (error) {
		return <div className="text-red-600 text-sm">Failed to load categories</div>;
	}

	return (
		<div>
			<h3 className="font-medium text-white mb-3">Categories</h3>
			<div className="space-y-2">
				<button
					onClick={() => onCategoryChange(undefined)}
					className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
						!selectedCategory ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700 hover:bg-gray-100'
					}`}
				>
					All Photos
				</button>

				{categories.map((category) => (
					<button
						key={category}
						onClick={() => onCategoryChange(category)}
						className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors capitalize ${
							selectedCategory === category
								? 'bg-blue-100 text-blue-800 font-medium'
								: 'text-gray-700 hover:bg-gray-100'
						}`}
					>
						{category}
					</button>
				))}
			</div>
		</div>
	);
};
