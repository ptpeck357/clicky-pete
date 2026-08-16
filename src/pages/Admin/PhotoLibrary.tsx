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
const PAGE_SIZE = 60;

/** aspectRatio is deliberately dropped: it is derived from the image, not edited. */
const toEditable = (photo: Photo): EditableTags => ({
	category: photo.tags.category,
	location: photo.tags.location,
	collection: photo.tags.collection,
	featured: photo.tags.featured,
	hero: photo.tags.hero,
	collectionCover: photo.tags.collectionCover,
});

const FLAG_LABELS: [keyof EditableTags, string][] = [
	['featured', 'Featured'],
	['hero', 'Hero'],
	['collectionCover', 'Cover'],
];

export const PhotoLibrary: React.FC<PhotoLibraryProps> = ({ photos, values, onChanged, onError }) => {
	const [query, setQuery] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState<EditableTags | null>(null);
	const [busy, setBusy] = useState(false);
	const [limit, setLimit] = useState(PAGE_SIZE);

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
			<div className="flex flex-wrap items-center gap-3">
				<input
					className="w-full max-w-md rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={query}
					onChange={(event) => {
						setQuery(event.target.value);
						setLimit(PAGE_SIZE);
					}}
					placeholder="Filter by name, category, location, collection"
				/>
				<span className="text-sm text-gray-500 tabular-nums">
					{matches.length === photos.length
						? `${photos.length} photos`
						: `${matches.length} of ${photos.length}`}
				</span>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{matches.slice(0, limit).map((photo) => {
					const editing = editingId === photo.id;
					return (
						<article
							key={photo.id}
							className={`overflow-hidden rounded-lg border bg-gray-900 ${
								editing ? 'border-blue-600 sm:col-span-2 xl:col-span-3' : 'border-gray-700'
							}`}
						>
							<div className={editing ? 'flex gap-4 p-3' : ''}>
								<img
									src={`${CLOUDFRONT_URL}/photos/400/${photo.file}`}
									alt={photo.file}
									loading="lazy"
									className={
										editing
											? 'h-28 w-40 flex-shrink-0 rounded object-cover'
											: 'aspect-[3/2] w-full object-cover'
									}
								/>

								<div className={editing ? 'min-w-0 flex-1' : 'p-3'}>
									<div className="truncate font-mono text-xs text-gray-300">{photo.file}</div>
									<div className="mt-1 text-sm text-gray-400">
										{photo.tags.category} · {photo.tags.collection}
									</div>
									<div className="truncate text-sm text-gray-500">{photo.tags.location}</div>

									<div className="mt-2 flex flex-wrap items-center gap-2">
										<span className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-gray-400">
											{photo.tags.aspectRatio}
										</span>
										{FLAG_LABELS.map(([key, label]) =>
											photo.tags[key] === true ? (
												<span
													key={key}
													className="rounded bg-blue-950 px-1.5 py-0.5 text-xs text-blue-300"
												>
													{label}
												</span>
											) : null,
										)}
									</div>

									<div className="mt-3 flex gap-2">
										<button
											type="button"
											disabled={busy}
											onClick={() => (editing ? setEditingId(null) : startEdit(photo))}
											className="rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
										>
											{editing ? 'Cancel' : 'Edit'}
										</button>
										<button
											type="button"
											disabled={busy}
											onClick={() => void remove(photo)}
											className="rounded-md border border-gray-700 px-3 py-1 text-sm text-gray-500 hover:border-red-800 hover:text-red-400 disabled:opacity-50"
										>
											Remove
										</button>
									</div>
								</div>
							</div>

							{editing && draft && (
								<div className="border-t border-gray-800 bg-gray-950/40 p-3">
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
						</article>
					);
				})}
			</div>

			{matches.length > limit && (
				<button
					type="button"
					onClick={() => setLimit((current) => current + PAGE_SIZE)}
					className="self-start rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
				>
					Show {Math.min(PAGE_SIZE, matches.length - limit)} more
				</button>
			)}
		</div>
	);
};
