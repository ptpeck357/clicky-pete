import { useState, useEffect } from 'react';
import { photoService } from '../services/photoService';

export const useCategories = () => {
	const [categories, setCategories] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true);
				setError(null);
				const fetchedCategories = await photoService.getCategories();
				setCategories(fetchedCategories);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch categories');
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	return { categories, loading, error };
};
