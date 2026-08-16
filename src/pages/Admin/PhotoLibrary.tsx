import React, { useMemo, useState } from 'react';
import type { Photo } from '../../types/photo';
import { adminService } from '../../services/adminService';
import type { EditableTags, TagValues } from '../../services/adminService';
import { PhotoForm } from './PhotoForm';

interface PhotoLibraryProps {
	photos: Photo[];
	values: TagValues;
	onChanged: () => void;
	onError: (message: string) => void;
}

const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL || '';

/** aspectRatio is deliberately dropped: it is derived from the image, not edited. */
const toEditable = (photo: Photo): EditableTags => ({
	category: photo.tags.category,
	location: photo.tags.location,
	collection: photo.tags.collection,
	featured: photo.tags.featured,
	hero: photo.tags.hero,
	collectionCover: photo.tags.collectionCover,
});

export const PhotoLibrary: React.FC<PhotoLibraryProps> = ({ photos, values, onChanged, onError }) => {
	const [query, setQuery] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState<EditableTags | null>(null);
	const [busy, setBusy] = useState(false);

	const matches = useMemo(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return photos;
		return photos.filter((photo) =>
			[photo.id, photo.file, photo.tags.category, photo.tags.location, photo.tags.collection]
				.join(' ')
				.toLowerCase()
				.includes(needle),
		);
	}, [photos, query]);

	const startEdit = (photo: Photo) => {
		setEditingId(photo.id);
		setDraft(toEditable(photo));
	};

	const save = async (id: string) => {
		if (!draft) return;
		setBusy(true);
		try {
			await adminService.updateTags(id, draft);
			setEditingId(null);
			setDraft(null);
			onChanged();
		} catch (error) {
			onError(error instanceof Error ? error.message : String(error));
		} finally {
			setBusy(false);
		}
	};

	const remove = async (photo: Photo) => {
		if (!window.confirm(`Remove ${photo.file} from photos.json? The image stays in storage.`)) return;
		setBusy(true);
		try {
			await adminService.removePhoto(photo.id);
			onChanged();
		} catch (error) {
			onError(error instanceof Error ? error.message : String(error));
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-baseline gap-3">
				<input
					className="w-full max-w-md rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Filter by name, category, location, collection"
				/>
				<span className="text-sm text-gray-400 tabular-nums">
					{matches.length} of {photos.length}
				</span>
			</div>

			<div className="grid grid-cols-1 gap-3">
				{matches.slice(0, 60).map((photo) => (
					<div key={photo.id} className="rounded-lg border border-gray-700 bg-gray-900 p-3">
						<div className="flex gap-4">
							<img
								src={`${CLOUDFRONT_URL}/photos/400/${photo.file}`}
								alt={photo.file}
								loading="lazy"
								className="h-20 w-28 flex-shrink-0 rounded object-cover"
							/>
							<div className="min-w-0 flex-1">
								<div className="font-mono text-sm text-gray-200">{photo.file}</div>
								<div className="mt-1 text-sm text-gray-400">
									{photo.tags.category} · {photo.tags.location} · {photo.tags.collection}
								</div>
								<div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
									<span>{photo.tags.aspectRatio}</span>
									{photo.tags.featured === true && <span className="text-blue-400">featured</span>}
									{photo.tags.hero === true && <span className="text-blue-400">hero</span>}
									{photo.tags.collectionCover === true && (
										<span className="text-blue-400">cover</span>
									)}
								</div>
							</div>
							<div className="flex flex-shrink-0 flex-col gap-2">
								<button
									type="button"
									disabled={busy}
									onClick={() => (editingId === photo.id ? setEditingId(null) : startEdit(photo))}
									className="rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
								>
									{editingId === photo.id ? 'Cancel' : 'Edit'}
								</button>
								<button
									type="button"
									disabled={busy}
									onClick={() => void remove(photo)}
									className="rounded-md border border-red-800 px-3 py-1 text-sm text-red-400 hover:bg-red-950 disabled:opacity-50"
								>
									Remove
								</button>
							</div>
						</div>

						{editingId === photo.id && draft && (
							<div className="mt-3 border-t border-gray-700 pt-3">
								<PhotoForm
									tags={draft}
									values={values}
									onChange={setDraft}
									idPrefix={`lib-${photo.id}`}
									compact
								/>
								<button
									type="button"
									disabled={busy}
									onClick={() => void save(photo.id)}
									className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
								>
									Save changes
								</button>
							</div>
						)}
					</div>
				))}
			</div>

			{matches.length > 60 && (
				<p className="text-sm text-gray-500">Showing the first 60. Narrow the filter to reach the rest.</p>
			)}
		</div>
	);
};
