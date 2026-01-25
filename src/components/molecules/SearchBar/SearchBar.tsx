import React, { useState, useEffect } from 'react';

interface SearchBarProps {
	onSearch: (query: string) => void;
	placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	placeholder = 'Search photos by tags or filename...',
}) => {
	const [query, setQuery] = useState('');

	useEffect(() => {
		const timer = setTimeout(() => {
			onSearch(query);
		}, 300);

		return () => clearTimeout(timer);
	}, [query, onSearch]);

	const handleClear = () => {
		setQuery('');
	};

	return (
		<div className="relative">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>

			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="block w-full pl-10 pr-10 py-2 sm:py-3 border border-gray-600 rounded-md leading-5 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
				placeholder={placeholder}
			/>

			{query && (
				<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
					<button onClick={handleClear} className="text-gray-400 hover:text-gray-300 focus:outline-none">
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
};
