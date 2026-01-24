import React, { useState, useEffect } from 'react';
import { photoService } from '../../services/photoService';

interface TagFilterProps {
	onFilterChange: (filters: { [key: string]: string }) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ onFilterChange }) => {
	const [allTags, setAllTags] = useState<{ [key: string]: string[] }>({});
	const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAllTags = async () => {
			try {
				setLoading(true);
				const photos = await photoService.getPhotos();

				const tagsByKey: { [key: string]: Set<string> } = {};

				photos.forEach((photo) => {
					Object.entries(photo.tags).forEach(([key, value]) => {
						if (key !== 'uploaded') {
							// Skip upload date
							if (!tagsByKey[key]) {
								tagsByKey[key] = new Set();
							}
							tagsByKey[key].add(value);
						}
					});
				});

				// Convert Sets to sorted arrays
				const sortedTags: { [key: string]: string[] } = {};
				Object.entries(tagsByKey).forEach(([key, valueSet]) => {
					sortedTags[key] = Array.from(valueSet).sort();
				});

				setAllTags(sortedTags);
			} catch (error) {
				console.error('Failed to fetch tags:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAllTags();
	}, []);

	const handleFilterChange = (tagKey: string, tagValue: string) => {
		const newFilters = { ...selectedFilters };

		if (newFilters[tagKey] === tagValue) {
			// Remove filter if clicking the same value
			delete newFilters[tagKey];
		} else {
			// Set new filter
			newFilters[tagKey] = tagValue;
		}

		setSelectedFilters(newFilters);
		onFilterChange(newFilters);
	};

	const clearAllFilters = () => {
		setSelectedFilters({});
		onFilterChange({});
	};

	if (loading) {
		return (
			<div className="animate-pulse">
				<div className="h-4 bg-gray-300 rounded mb-3 w-20"></div>
				<div className="space-y-2">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="h-8 bg-gray-200 rounded"></div>
					))}
				</div>
			</div>
		);
	}

	const hasActiveFilters = Object.keys(selectedFilters).length > 0;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="font-medium text-gray-900">Filters</h3>
				{hasActiveFilters && (
					<button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800">
						Clear all
					</button>
				)}
			</div>

			{Object.entries(allTags).map(([tagKey, values]) => (
				<div key={tagKey}>
					<h4 className="font-medium text-gray-700 mb-2 capitalize">{tagKey}</h4>
					<div className="space-y-1">
						{values.map((value) => (
							<button
								key={value}
								onClick={() => handleFilterChange(tagKey, value)}
								className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
									selectedFilters[tagKey] === value
										? 'bg-blue-100 text-blue-800 font-medium'
										: 'text-gray-600 hover:bg-gray-100'
								}`}
							>
								{value}
							</button>
						))}
					</div>
				</div>
			))}

			{Object.keys(allTags).length === 0 && <p className="text-gray-500 text-sm">No tags available</p>}
		</div>
	);
};
