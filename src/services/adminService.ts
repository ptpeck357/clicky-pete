import type { Photo } from '../types/photo';

/**
 * Talks to the dev-only middleware in vite-plugin-admin.ts. These endpoints exist
 * only while `npm run dev` is running and have no production equivalent.
 */

export type PhotoTags = Photo['tags'];
export type EditableTags = Omit<PhotoTags, 'aspectRatio'>;

export interface TagValues {
	categories: string[];
	locations: string[];
	collections: string[];
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
	const response = await fetch(`/__admin${path}`, init);
	const body: unknown = await response.json().catch(() => ({}));
	if (!response.ok) {
		const message =
			typeof body === 'object' && body !== null && 'error' in body
				? String((body as { error: unknown }).error)
				: `${response.status} ${response.statusText}`;
		throw new Error(message);
	}
	return body as T;
};

export const adminService = {
	async getPhotos(): Promise<{ photos: Photo[]; values: TagValues; expectedRatios: string[] }> {
		return request('/photos');
	},

	/**
	 * Uploads one image: resized to three sizes, stored, and appended to photos.json.
	 * Rejected with 422 if the crop is not 3:2 or 4:5, unless allowAnyRatio is set.
	 */
	async uploadPhoto(file: File, tags: EditableTags, allowAnyRatio = false): Promise<{ entry: Photo }> {
		const meta = btoa(JSON.stringify({ filename: file.name, tags }));
		return request('/photo', {
			method: 'POST',
			headers: {
				'x-photo-meta': meta,
				'Content-Type': 'application/octet-stream',
				...(allowAnyRatio ? { 'x-allow-any-ratio': 'true' } : {}),
			},
			body: file,
		});
	},

	async updateTags(id: string, tags: EditableTags): Promise<{ entry: Photo }> {
		return request('/update', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, tags }),
		});
	},

	/**
	 * Removes the entry from photos.json. With deleteFiles, the manifest is published first
	 * and the three stored renditions are then deleted — that order matters, since the live
	 * site would show a broken image for any file removed while still referenced.
	 */
	async removePhoto(
		id: string,
		deleteFiles = false,
	): Promise<{ removed: string; entries: number; filesDeleted: boolean; deleted?: string[] }> {
		return request('/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, deleteFiles }),
		});
	},

	/** Pushes photos.json live and clears the CDN cache. */
	async publish(): Promise<{ published: boolean; entries: number }> {
		return request('/publish', { method: 'POST' });
	},
};
