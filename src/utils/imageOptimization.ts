/**
 * Starts fetching the rendition the photo viewer will ask for, so the download is already
 * in flight before the modal opens. srcset and sizes match the viewer's exactly — set them
 * before src, or the browser starts on the fallback and fetches twice.
 */
export const preloadViewerImage = (file: string): void => {
	const base = import.meta.env.VITE_CLOUDFRONT_URL;
	if (!base) return;
	const img = new Image();
	img.srcset = `${base}/photos/800/${file} 800w, ${base}/photos/2000/${file} 2000w`;
	img.sizes = '(max-width: 1024px) 800px, 2000px';
	img.src = `${base}/photos/2000/${file}`;
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
