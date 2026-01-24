import React from 'react';
import { CategoryPill } from '../../molecules';
import { Spinner } from '../../atoms';
import { useCategories } from '../../../hooks/useCategories';

interface CategoryFilterProps {
	selectedCategory?: string;
	onCategoryChange: (category: string | undefined) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
	const { categories, loading, error } = useCategories();

	if (loading) {
		return (
			<div className="flex justify-center py-4">
				<Spinner size="sm" color="gray" />
			</div>
		);
	}

	if (error) {
		return <div className="text-red-400 text-sm text-center py-4">Failed to load categories</div>;
	}

	return (
		<div className="flex flex-wrap gap-3 justify-center">
			<CategoryPill category="All" isActive={!selectedCategory} onClick={() => onCategoryChange(undefined)} />

			{categories.map((category) => (
				<CategoryPill
					key={category}
					category={category}
					isActive={selectedCategory === category}
					onClick={() => onCategoryChange(category)}
				/>
			))}
		</div>
	);
};
