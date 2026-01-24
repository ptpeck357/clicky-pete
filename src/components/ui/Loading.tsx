import React from 'react';

interface LoadingProps {
	size?: 'sm' | 'md' | 'lg';
	text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text = 'Loading...' }) => {
	const sizeClasses = {
		sm: 'h-4 w-4',
		md: 'h-8 w-8',
		lg: 'h-12 w-12',
	};

	return (
		<div className="flex flex-col items-center justify-center p-8">
			<svg
				className={`animate-spin ${sizeClasses[size]} text-blue-600`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			{text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
		</div>
	);
};

export const LoadingGrid: React.FC = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="animate-pulse">
					<div className="bg-gray-300 aspect-square rounded-lg mb-4" />
					<div className="h-4 bg-gray-300 rounded mb-2" />
					<div className="h-3 bg-gray-300 rounded w-2/3" />
				</div>
			))}
		</div>
	);
};
