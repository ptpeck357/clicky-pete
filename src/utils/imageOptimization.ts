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
