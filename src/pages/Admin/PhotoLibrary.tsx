import React, { useMemo, useState } from 'react';
import type { Photo } from '../../types/photo';
import { adminService } from '../../services/adminService';
import type { EditableTags, TagValues } from '../../services/adminService';
import { PhotoEditModal } from './PhotoEditModal';

interface PhotoLibraryProps {
	photos: Photo[];
	values: TagValues;
	onChanged: () => void;
	onRemoved: (message: string) => void;
	onError: (message: string) => void;
}

const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL || '';
const PAGE_SIZE = 60;

/**
 * Renders each thumbnail at its own ratio rather than cropping everything to 3:2.
 * Inline rather than a Tailwind class because the value is data-driven, and Tailwind
 * only generates classes it can find as literal strings in source.
 */
const cssAspect = (aspectRatio: string): string => {
	const [w, h] = aspectRatio.split(':').map(Number);
	return w > 0 && h > 0 ? `${w} / ${h}` : '3 / 2';
};

const FLAG_LABELS: [keyof EditableTags, string][] = [
	['featured', 'Featured'],
	['hero', 'Hero'],
	['collectionCover', 'Cover'],
];

export const PhotoLibrary: React.FC<PhotoLibraryProps> = ({ photos, values, onChanged, onRemoved, onError }) => {
	const [query, setQuery] = useState('');
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [busy, setBusy] = useState(false);
	const [limit, setLimit] = useState(PAGE_SIZE);
	const [confirmingId, setConfirmingId] = useState<string | null>(null);

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

	const remove = async (photo: Photo, deleteFiles: boolean) => {
		setBusy(true);
		try {
			const result = await adminService.removePhoto(photo.id, deleteFiles);
			setConfirmingId(null);
			onRemoved(
				result.filesDeleted
					? `${photo.file} removed and its 3 files deleted from storage.`
					: `${photo.file} removed from photos.json. Its files are still in storage.`,
			);
		} catch (error) {
			onError(error instanceof Error ? error.message : String(error));
		} finally {
			setBusy(false);
		}
	};

	// Navigation moves through the filtered set, so arrow keys follow what is on screen.
	const editing = editingIndex !== null ? matches[editingIndex] : undefined;

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

			{/* items-start keeps a portrait card from stretching its landscape neighbours. */}
			<div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{matches.slice(0, limit).map((photo, index) => (
					<article key={photo.id} className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
						<button
							type="button"
							onClick={() => setEditingIndex(index)}
							className="block w-full cursor-zoom-in"
							title="Open full screen to edit"
						>
							<img
								src={`${CLOUDFRONT_URL}/photos/400/${photo.file}`}
								alt={photo.file}
								loading="lazy"
								style={{ aspectRatio: cssAspect(photo.tags.aspectRatio) }}
								className="w-full object-cover"
							/>
						</button>

						<div className="p-3">
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

							{confirmingId === photo.id ? (
								<div className="mt-3 flex flex-col gap-2 rounded-md border border-red-900 bg-red-950/30 p-2">
									<button
										type="button"
										disabled={busy}
										onClick={() => void remove(photo, true)}
										className="rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
									>
										Remove and delete files
									</button>
									<button
										type="button"
										disabled={busy}
										onClick={() => void remove(photo, false)}
										className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-50"
									>
										Remove entry only
									</button>
									<button
										type="button"
										disabled={busy}
										onClick={() => setConfirmingId(null)}
										className="px-3 py-1 text-xs text-gray-400 hover:text-gray-200 disabled:opacity-50"
									>
										Cancel
									</button>
									<p className="text-xs text-gray-500">
										Deleting files publishes photos.json first, so the site never points at a
										missing image. That also publishes any other unpublished changes.
									</p>
								</div>
							) : (
								<div className="mt-3 flex gap-2">
									<button
										type="button"
										disabled={busy}
										onClick={() => setEditingIndex(index)}
										className="rounded-md border border-blue-700 px-3 py-1 text-sm text-blue-300 hover:bg-blue-950 hover:text-blue-200 disabled:opacity-50"
									>
										Edit
									</button>
									<button
										type="button"
										disabled={busy}
										onClick={() => setConfirmingId(photo.id)}
										className="rounded-md border border-red-800 px-3 py-1 text-sm text-red-400 hover:bg-red-950 hover:text-red-300 disabled:opacity-50"
									>
										Remove
									</button>
								</div>
							)}
						</div>
					</article>
				))}
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

			{editing && editingIndex !== null && (
				<PhotoEditModal
					photo={editing}
					values={values}
					onClose={() => setEditingIndex(null)}
					onSaved={() => {
						setEditingIndex(null);
						onChanged();
					}}
					onError={onError}
					onPrevious={editingIndex > 0 ? () => setEditingIndex(editingIndex - 1) : undefined}
					onNext={
						editingIndex < Math.min(limit, matches.length) - 1
							? () => setEditingIndex(editingIndex + 1)
							: undefined
					}
				/>
			)}
		</div>
	);
};
