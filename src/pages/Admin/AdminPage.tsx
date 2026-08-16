import React, { useCallback, useEffect, useState } from 'react';
import type { Photo } from '../../types/photo';
import { adminService } from '../../services/adminService';
import type { EditableTags, TagValues } from '../../services/adminService';
import { PhotoForm } from './PhotoForm';
import { PhotoLibrary } from './PhotoLibrary';

type PendingStatus = 'ready' | 'uploading' | 'done' | 'error';

interface Pending {
	key: string;
	file: File;
	preview: string;
	tags: EditableTags;
	status: PendingStatus;
	message?: string;
}

const EMPTY_TAGS: EditableTags = { category: '', location: '', collection: '' };
const EMPTY_VALUES: TagValues = { categories: [], locations: [], collections: [] };

/** Dropping a folder yields directory entries rather than files, so walk them. */
const filesFromDataTransfer = async (dataTransfer: DataTransfer): Promise<File[]> => {
	const entries = [...dataTransfer.items]
		.map((item) => (item.kind === 'file' ? item.webkitGetAsEntry() : null))
		.filter((entry): entry is FileSystemEntry => entry !== null);

	if (!entries.length) return [...dataTransfer.files];

	const collected: File[] = [];
	const walk = async (entry: FileSystemEntry): Promise<void> => {
		if (entry.isFile) {
			const file = await new Promise<File>((resolve, reject) =>
				(entry as FileSystemFileEntry).file(resolve, reject),
			);
			collected.push(file);
			return;
		}
		const reader = (entry as FileSystemDirectoryEntry).createReader();
		const children = await new Promise<FileSystemEntry[]>((resolve, reject) => reader.readEntries(resolve, reject));
		await Promise.all(children.map(walk));
	};

	await Promise.all(entries.map(walk));
	return collected;
};

const isImage = (file: File) => file.type.startsWith('image/');

export const AdminPage: React.FC = () => {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [values, setValues] = useState<TagValues>(EMPTY_VALUES);
	const [pending, setPending] = useState<Pending[]>([]);
	const [tab, setTab] = useState<'upload' | 'library'>('upload');
	const [bulk, setBulk] = useState<EditableTags>(EMPTY_TAGS);
	const [dragging, setDragging] = useState(false);
	const [busy, setBusy] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			const data = await adminService.getPhotos();
			setPhotos(data.photos);
			setValues(data.values);
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	const addFiles = useCallback(
		(files: File[]) => {
			const images = files.filter(isImage);
			setPending((current) => [
				...current,
				...images.map((file, index) => ({
					key: `${file.name}-${Date.now()}-${index}`,
					file,
					preview: URL.createObjectURL(file),
					// Start from the batch defaults so anything already typed above carries
					// down, rather than leaving a second empty form to fill in again.
					tags: { ...bulk },
					status: 'ready' as PendingStatus,
				})),
			]);
			if (images.length < files.length) {
				setNotice(`Skipped ${files.length - images.length} non-image file(s).`);
			}
		},
		[bulk],
	);

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();
			setDragging(false);
			void filesFromDataTransfer(event.dataTransfer).then(addFiles);
		},
		[addFiles],
	);

	const applyBulk = () => {
		setPending((current) =>
			current.map((item) =>
				item.status === 'done'
					? item
					: {
							...item,
							tags: {
								...item.tags,
								...(bulk.category ? { category: bulk.category } : {}),
								...(bulk.location ? { location: bulk.location } : {}),
								...(bulk.collection ? { collection: bulk.collection } : {}),
							},
						},
			),
		);
	};

	const uploadAll = async () => {
		setBusy(true);
		setError(null);
		for (const item of pending) {
			if (item.status === 'done') continue;
			if (!item.tags.category || !item.tags.location || !item.tags.collection) {
				setPending((current) =>
					current.map((p) =>
						p.key === item.key
							? { ...p, status: 'error', message: 'Category, location and collection are all required' }
							: p,
					),
				);
				continue;
			}
			setPending((current) => current.map((p) => (p.key === item.key ? { ...p, status: 'uploading' } : p)));
			try {
				const { entry } = await adminService.uploadPhoto(item.file, item.tags);
				setPending((current) =>
					current.map((p) =>
						p.key === item.key
							? { ...p, status: 'done', message: `${entry.id} · ${entry.tags.aspectRatio}` }
							: p,
					),
				);
				setDirty(true);
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				setPending((current) =>
					current.map((p) => (p.key === item.key ? { ...p, status: 'error', message } : p)),
				);
			}
		}
		await load();
		setBusy(false);
	};

	const publish = async () => {
		setBusy(true);
		setError(null);
		try {
			const result = await adminService.publish();
			setNotice(`Published ${result.entries} photos. Live in a few seconds.`);
			setDirty(false);
			setPending((current) => current.filter((item) => item.status !== 'done'));
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			setBusy(false);
		}
	};

	const readyCount = pending.filter((item) => item.status !== 'done').length;

	return (
		<div className="min-h-screen bg-gray-950 px-6 py-8 text-gray-100">
			<div className="mx-auto flex max-w-5xl flex-col gap-6">
				<header className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Photo Admin</h1>
						<p className="text-sm text-gray-400">
							{photos.length} photos in photos.json · local only, never deployed
						</p>
					</div>
					<div className="flex items-center gap-3">
						{dirty && (
							<span className="rounded-full bg-amber-950 px-3 py-1 text-xs font-medium text-amber-300">
								Unpublished changes
							</span>
						)}
						<button
							type="button"
							onClick={() => void publish()}
							disabled={busy}
							className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
						>
							Publish to site
						</button>
					</div>
				</header>

				{error && (
					<div className="rounded-md border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
						{error}
					</div>
				)}
				{notice && (
					<div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-300">
						{notice}
						<button
							type="button"
							onClick={() => setNotice(null)}
							className="text-gray-500 hover:text-gray-300"
						>
							Dismiss
						</button>
					</div>
				)}

				<nav className="flex gap-1 border-b border-gray-800">
					{(['upload', 'library'] as const).map((name) => (
						<button
							key={name}
							type="button"
							onClick={() => setTab(name)}
							className={`px-4 py-2 text-sm font-medium capitalize ${
								tab === name
									? 'border-b-2 border-blue-500 text-white'
									: 'text-gray-400 hover:text-gray-200'
							}`}
						>
							{name}
						</button>
					))}
				</nav>

				{tab === 'upload' ? (
					<div className="flex flex-col gap-5">
						<div
							onDragOver={(event) => {
								event.preventDefault();
								setDragging(true);
							}}
							onDragLeave={() => setDragging(false)}
							onDrop={onDrop}
							className={`rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors ${
								dragging ? 'border-blue-500 bg-blue-950/30' : 'border-gray-700 bg-gray-900'
							}`}
						>
							<p className="text-gray-300">Drag photos or a folder here</p>
							<p className="mt-1 text-sm text-gray-500">
								Files are read in place — nothing is copied into the project or moved on disk
							</p>
							<label className="mt-4 inline-block cursor-pointer rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
								Choose files
								<input
									type="file"
									multiple
									accept="image/*"
									className="hidden"
									onChange={(event) => addFiles([...(event.target.files ?? [])])}
								/>
							</label>
						</div>

						{pending.length > 0 && (
							<>
								{/* Only worth showing for an actual batch — with one photo it is just a
								    duplicate of the form below it. */}
								{readyCount > 1 && (
									<section className="rounded-lg border border-gray-700 bg-gray-900 p-4">
										<h2 className="text-sm font-medium text-gray-300">Batch defaults</h2>
										<p className="mb-3 text-xs text-gray-500">
											Applied to photos you add from now on. Use the button to overwrite the{' '}
											{readyCount} already listed below.
										</p>
										<PhotoForm
											tags={bulk}
											values={values}
											onChange={setBulk}
											idPrefix="bulk"
											compact
										/>
										<button
											type="button"
											onClick={applyBulk}
											className="mt-3 rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
										>
											Overwrite all {readyCount}
										</button>
									</section>
								)}

								<div className="flex flex-col gap-3">
									{pending.map((item) => (
										<div
											key={item.key}
											className="rounded-lg border border-gray-700 bg-gray-900 p-3"
										>
											<div className="flex gap-4">
												<img
													src={item.preview}
													alt={item.file.name}
													className="h-24 w-32 flex-shrink-0 rounded object-cover"
												/>
												<div className="min-w-0 flex-1">
													<div className="flex items-center justify-between gap-3">
														<span className="truncate font-mono text-sm text-gray-200">
															{item.file.name}
														</span>
														<span
															className={`text-xs ${
																item.status === 'done'
																	? 'text-green-400'
																	: item.status === 'error'
																		? 'text-red-400'
																		: 'text-gray-500'
															}`}
														>
															{item.status === 'uploading' ? 'uploading…' : item.status}
														</span>
													</div>
													{item.message && (
														<p
															className={`mt-1 text-xs ${
																item.status === 'error'
																	? 'text-red-400'
																	: 'text-gray-500'
															}`}
														>
															{item.message}
														</p>
													)}
													{item.status !== 'done' && (
														<div className="mt-3">
															<PhotoForm
																tags={item.tags}
																values={values}
																idPrefix={item.key}
																compact
																onChange={(tags) =>
																	setPending((current) =>
																		current.map((p) =>
																			p.key === item.key ? { ...p, tags } : p,
																		),
																	)
																}
															/>
														</div>
													)}
												</div>
												<button
													type="button"
													onClick={() =>
														setPending((current) =>
															current.filter((p) => p.key !== item.key),
														)
													}
													className="h-8 flex-shrink-0 rounded-md border border-gray-600 px-3 text-sm text-gray-400 hover:bg-gray-800"
												>
													Remove
												</button>
											</div>
										</div>
									))}
								</div>

								<button
									type="button"
									onClick={() => void uploadAll()}
									disabled={busy || readyCount === 0}
									className="self-start rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
								>
									{busy ? 'Uploading…' : `Upload ${readyCount} photo${readyCount === 1 ? '' : 's'}`}
								</button>
								<p className="text-sm text-gray-500">
									Uploading stores the images and updates photos.json locally. They appear on the site
									after you publish.
								</p>
							</>
						)}
					</div>
				) : (
					<PhotoLibrary
						photos={photos}
						values={values}
						onError={setError}
						onChanged={() => {
							setDirty(true);
							void load();
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default AdminPage;
