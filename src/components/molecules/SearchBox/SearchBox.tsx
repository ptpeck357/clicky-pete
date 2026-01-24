import React, { useState, useEffect } from 'react';
import { Input } from '../../atoms';

interface SearchBoxProps {
	onSearch: (query: string) => void;
	placeholder?: string;
	debounceMs?: number;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
	onSearch,
	placeholder = 'Search photos...',
	debounceMs = 300,
}) => {
	const [query, setQuery] = useState('');

	useEffect(() => {
		const timer = setTimeout(() => {
			onSearch(query);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [query, onSearch, debounceMs]);

	const handleClear = () => {
		setQuery('');
	};

	const searchIcon = (
		<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	);

	return (
		<div className="relative">
			<Input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder={placeholder}
				icon={searchIcon}
			/>

			{query && (
				<button
					onClick={handleClear}
					className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
				>
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			)}
		</div>
	);
};
