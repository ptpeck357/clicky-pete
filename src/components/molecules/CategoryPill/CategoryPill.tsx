import React from 'react';
import { Button } from '../../atoms';

interface CategoryPillProps {
	category: string;
	isActive?: boolean;
	onClick: () => void;
	count?: number;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ category, isActive = false, onClick, count }) => {
	return (
		<Button
			variant={isActive ? 'primary' : 'ghost'}
			size="md"
			onClick={onClick}
			className="rounded-full capitalize"
		>
			{category}
			{count !== undefined && (
				<span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-blue-500' : 'bg-gray-700'}`}>
					{count}
				</span>
			)}
		</Button>
	);
};
