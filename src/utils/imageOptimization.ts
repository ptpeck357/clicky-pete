/**
 * Optimizes image URLs for better loading performance
 */
export const optimizeImageUrl = (
	url: string,
	options?: {
		width?: number;
		height?: number;
		quality?: number;
		format?: 'webp' | 'jpg' | 'png';
	},
): string => {
	if (!url.includes('unsplash.com')) {
		return url;
	}

	const { width = 800, height, quality = 80, format = 'webp' } = options || {};

	// Parse existing URL
	const urlObj = new URL(url);

	// Set optimized parameters
	urlObj.searchParams.set('w', width.toString());
	if (height) {
		urlObj.searchParams.set('h', height.toString());
	}
	urlObj.searchParams.set('q', quality.toString());
	urlObj.searchParams.set('auto', 'format');
	urlObj.searchParams.set('fit', 'crop');
	urlObj.searchParams.set('fm', format);

	return urlObj.toString();
};

/**
 * Preloads an image and returns a promise
 */
export const preloadImage = (src: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve();
		img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
		img.src = src;
	});
};

/**
 * Preloads multiple images
 */
export const preloadImages = async (urls: string[]): Promise<void> => {
	try {
		await Promise.all(urls.map((url) => preloadImage(url)));
	} catch (error) {
		console.warn('Some images failed to preload:', error);
	}
};
