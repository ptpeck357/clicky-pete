import React from 'react';
import { CategoryFilter } from '../organisms/CategoryFilter';

interface SidebarProps {
	selectedCategory?: string;
	onCategoryChange: (category: string | undefined) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onCategoryChange }) => {
	return (
		<aside className="w-64 bg-gray-800 border-r border-gray-700 h-full overflow-y-auto">
			<div className="p-6">
				<CategoryFilter selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />
			</div>
		</aside>
	);
};
