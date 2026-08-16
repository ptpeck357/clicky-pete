import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Photo } from '../../types/photo';
import { adminService } from '../../services/adminService';
import type { EditableTags, TagValues } from '../../services/adminService';
import { PhotoForm } from './PhotoForm';

interface PhotoEditModalProps {
	photo: Photo;
	values: TagValues;
	onClose: () => void;
	onSaved: () => void;
	onError: (message: string) => void;
	onPrevious?: () => void;
	onNext?: () => void;
}

const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL || '';

const toEditable = (photo: Photo): EditableTags => ({
	category: photo.tags.category,
	location: photo.tags.location,
	collection: photo.tags.collection,
	featured: photo.tags.featured,
	hero: photo.tags.hero,
	collectionCover: photo.tags.collectionCover,
});

/** Arrow keys should move between photos, but not while typing into a field. */
const isTyping = (target: EventTarget | null) =>
	target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

export const PhotoEditModal: React.FC<PhotoEditModalProps> = ({
	photo,
	values,
	onClose,
	onSaved,
	onError,
	onPrevious,
	onNext,
}) => {
	const [draft, setDraft] = useState<EditableTags>(() => toEditable(photo));
	const [saving, setSaving] = useState(false);

	// Moving to another photo reuses this component, so reset the draft with it.
	useEffect(() => {
		setDraft(toEditable(photo));
	}, [photo]);

	const save = useCallback(async () => {
		setSaving(true);
		try {
			await adminService.updateTags(photo.id, draft);
			onSaved();
		} catch (error) {
			onError(error instanceof Error ? error.message : String(error));
		} finally {
			setSaving(false);
		}
	}, [draft, onError, onSaved, photo.id]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
			if (isTyping(event.target)) return;
			if (event.key === 'ArrowLeft') onPrevious?.();
			if (event.key === 'ArrowRight') onNext?.();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onClose, onNext, onPrevious]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="fixed inset-0 z-50 flex flex-col bg-black/90 lg:flex-row"
			onClick={onClose}
		>
			<div className="relative flex min-h-0 flex-1 items-center justify-center p-4">
				{/* On wide screens the sidebar's close button sits in the same corner, so this
				    one only appears once the layout stacks. */}
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					title="Close (Esc)"
					className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/80 text-2xl leading-none text-white hover:bg-black lg:hidden"
				>
					×
				</button>
				<img
					src={`${CLOUDFRONT_URL}/photos/2000/${photo.file}`}
					alt={photo.file}
					onClick={(event) => event.stopPropagation()}
					className="max-h-full max-w-full object-contain"
				/>

				{onPrevious && (
					<button
						type="button"
						aria-label="Previous photo"
						onClick={(event) => {
							event.stopPropagation();
							onPrevious();
						}}
						className="absolute left-4 rounded-full border border-white/30 bg-black/80 px-4 py-3 text-xl text-white hover:bg-black"
					>
						‹
					</button>
				)}
				{onNext && (
					<button
						type="button"
						aria-label="Next photo"
						onClick={(event) => {
							event.stopPropagation();
							onNext();
						}}
						className="absolute right-4 rounded-full border border-white/30 bg-black/80 px-4 py-3 text-xl text-white hover:bg-black"
					>
						›
					</button>
				)}
			</div>

			<aside
				onClick={(event) => event.stopPropagation()}
				className="flex w-full flex-col gap-4 overflow-y-auto border-t border-gray-800 bg-gray-950 p-5 lg:w-96 lg:border-t-0 lg:border-l"
			>
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<div className="truncate font-mono text-sm text-gray-200">{photo.file}</div>
						<div className="mt-1 text-xs text-gray-500">
							{photo.id} · {photo.tags.aspectRatio}
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						title="Close (Esc)"
						className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-gray-500 bg-gray-800 text-xl leading-none text-gray-100 hover:border-gray-400 hover:bg-gray-700"
					>
						×
					</button>
				</div>

				<PhotoForm tags={draft} values={values} onChange={setDraft} idPrefix={`modal-${photo.id}`} />

				<div className="flex gap-2">
					<button
						type="button"
						disabled={saving}
						onClick={() => void save()}
						className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{saving ? 'Saving…' : 'Save changes'}
					</button>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md border border-gray-500 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-100 hover:border-gray-400 hover:bg-gray-700"
					>
						Cancel
					</button>
				</div>

				<p className="text-xs text-gray-600">
					Esc closes, arrow keys move between photos. Changes are saved to photos.json locally — publish to
					put them on the site.
				</p>
			</aside>
		</motion.div>
	);
};
