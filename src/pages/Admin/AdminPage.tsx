import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Photo } from '../../types/photo';
import { adminService } from '../../services/adminService';
import type { EditableTags, PublishState, TagValues } from '../../services/adminService';
import { PhotoForm } from './PhotoForm';
import { PhotoLibrary } from './PhotoLibrary';
import { Icon, TRASH_PATH } from './icons';

type PendingStatus = 'ready' | 'uploading' | 'done' | 'error';

interface Pending {
	key: string;
	file: File;
	preview: string;
	tags: EditableTags;
	status: PendingStatus;
	message?: string;
	ratio?: string;
	/** Set when the crop is not one of the expected ratios and upload was allowed anyway. */
	allowAnyRatio?: boolean;
}

const COMMON_RATIOS: [number, number][] = [
	[3, 2],
	[2, 3],
	[4, 5],
	[5, 4],
	[4, 3],
	[3, 4],
	[16, 9],
	[9, 16],
	[1, 1],
];

/** Mirrors the server's calculation so a bad crop is caught on drop, before any upload. */
const ratioOf = (width: number, height: number): string => {
	const actual = width / height;
	for (const [w, h] of COMMON_RATIOS) {
		if (Math.abs(actual - w / h) / (w / h) < 0.01) return `${w}:${h}`;
	}
	const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
	const d = gcd(width, height);
	return `${width / d}:${height / d}`;
};

const measure = async (file: File): Promise<string | undefined> => {
	try {
		const bitmap = await createImageBitmap(file);
		const ratio = ratioOf(bitmap.width, bitmap.height);
		bitmap.close();
		return ratio;
	} catch {
		return undefined;
	}
};

/**
 * Local date, not UTC: toISOString() reports tomorrow for anything dropped after 5pm Pacific,
 * which is exactly when a day's photos get published. Built by hand rather than through a
 * locale, so the field order cannot depend on ICU data.
 */
const todayLocal = (): string => {
	const now = new Date();
	const month = `${now.getMonth() + 1}`.padStart(2, '0');
	const day = `${now.getDate()}`.padStart(2, '0');
	return `${now.getFullYear()}-${month}-${day}`;
};

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

const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`;

/**
 * Counts as a sentence rather than a total, since the three differ in weight: one removal is
 * worth reading twice, five retags are routine.
 */
const pendingSummary = (pending: PublishState['pending']): string | undefined => {
	if (!pending) return undefined;
	const parts = [
		pending.added && `${plural(pending.added, 'photo')} added`,
		pending.removed && `${plural(pending.removed, 'photo')} removed`,
		pending.retagged && `${plural(pending.retagged, 'photo')} retagged`,
	].filter((part): part is string => Boolean(part));
	// The manifest can differ by formatting alone, with every entry identical.
	return parts.length ? parts.join(' · ') : 'formatting only';
};

/** Drift is reported ahead of everything else: publishing over it is refused, so it is the news. */
const publishStateBadge = (state: PublishState | null): { label: string; className: string } => {
	if (!state) return { label: '', className: '' };
	if (state.drifted) {
		return { label: 'Live copy changed elsewhere', className: 'bg-red-950 text-red-300' };
	}
	if (!state.comparable) {
		return { label: 'Publish state unknown', className: 'bg-gray-800 text-gray-400' };
	}
	if (state.inSync) {
		return { label: 'In sync with live', className: 'bg-gray-800 text-gray-400' };
	}
	return {
		label: `Unpublished: ${pendingSummary(state.pending) ?? 'changes'}`,
		className: 'bg-amber-950 text-amber-300',
	};
};

export const AdminPage: React.FC = () => {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [values, setValues] = useState<TagValues>(EMPTY_VALUES);
	const [pending, setPending] = useState<Pending[]>([]);
	// In the URL rather than in state, so retagging a photo cannot land you back on the upload
	// tab, and a refresh reopens where you were. /admin?tab=library is also bookmarkable.
	const [searchParams, setSearchParams] = useSearchParams();
	const tab: 'upload' | 'library' = searchParams.get('tab') === 'library' ? 'library' : 'upload';
	const setTab = (name: 'upload' | 'library') => {
		const next = new URLSearchParams(searchParams);
		if (name === 'library') {
			next.set('tab', name);
		} else {
			next.delete('tab');
		}
		setSearchParams(next, { replace: true });
	};
	const [bulk, setBulk] = useState<EditableTags>(EMPTY_TAGS);
	const [dragging, setDragging] = useState(false);
	const [busy, setBusy] = useState(false);
	const [publishState, setPublishState] = useState<PublishState | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);
	// Supplied by the server so the warning here cannot drift from what upload enforces.
	const [expectedRatios, setExpectedRatios] = useState<string[]>([]);

	/**
	 * Asking S3 rather than tracking edits in the session: changes made before this page was
	 * opened count as unpublished too, and only the live copy knows.
	 */
	const refreshPublishState = useCallback(async () => {
		try {
			setPublishState(await adminService.getPublishState());
		} catch {
			// A missing bucket or expired credentials must not hide the library behind an error.
			setPublishState(null);
		}
	}, []);

	const load = useCallback(async () => {
		try {
			const data = await adminService.getPhotos();
			setPhotos(data.photos);
			setValues(data.values);
			setExpectedRatios(data.expectedRatios);
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		}
		await refreshPublishState();
	}, [refreshPublishState]);

	useEffect(() => {
		void load();
	}, [load]);

	/**
	 * Swaps the pre-filled date for the real capture date on files that carry one. Sequential
	 * on purpose: a dropped folder would otherwise start a sharp read per photo at once.
	 */
	const applyCaptureDates = useCallback(async (items: Pending[], prefilled: string) => {
		for (const item of items) {
			const { date } = await adminService.probeDate(item.file).catch(() => ({ date: undefined }));
			if (!date || date === prefilled) continue;
			setPending((current) =>
				current.map((p) =>
					// Only the value we filled in is replaced — a date typed while the probe was
					// in flight was typed on purpose and wins.
					p.key === item.key && p.tags.date === prefilled ? { ...p, tags: { ...p.tags, date } } : p,
				),
			);
		}
	}, []);

	const addFiles = useCallback(
		(files: File[]) => {
			const images = files.filter(isImage);
			const seededDate = bulk.date || todayLocal();
			const added = images.map((file, index) => ({
				key: `${file.name}-${Date.now()}-${index}`,
				file,
				preview: URL.createObjectURL(file),
				// Start from the batch defaults so anything already typed above carries
				// down, rather than leaving a second empty form to fill in again.
				tags: { ...bulk, date: seededDate },
				status: 'ready' as PendingStatus,
			}));
			setPending((current) => [...current, ...added]);

			// Measure in the background; a wrong crop should be visible before uploading.
			for (const item of added) {
				void measure(item.file).then((ratio) =>
					setPending((current) => current.map((p) => (p.key === item.key ? { ...p, ratio } : p))),
				);
			}

			// A batch date was typed deliberately, so EXIF should not talk it back down.
			if (!bulk.date) void applyCaptureDates(added, seededDate);

			if (images.length < files.length) {
				setNotice(`Skipped ${files.length - images.length} non-image file(s).`);
			}
		},
		[bulk, applyCaptureDates],
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
								...(bulk.date ? { date: bulk.date } : {}),
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
				const { entry } = await adminService.uploadPhoto(item.file, item.tags, item.allowAnyRatio === true);
				setPending((current) =>
					current.map((p) =>
						p.key === item.key
							? { ...p, status: 'done', message: `${entry.id} · ${entry.tags.aspectRatio}` }
							: p,
					),
				);
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
			setPending((current) => current.filter((item) => item.status !== 'done'));
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			// Re-read after a failure too: a 409 means the live copy is ahead, which the badge says.
			await refreshPublishState();
			setBusy(false);
		}
	};

	const readyCount = pending.filter((item) => item.status !== 'done').length;
	const badge = publishStateBadge(publishState);

	// Same vertical gradient the public pages use, so the admin does not read as a different app.
	return (
		<div className="min-h-screen bg-[linear-gradient(to_bottom,#111827_0%,#0a1120_15%,#0d1a33_30%,#12274c_50%,#17325f_70%,#1b3a6b_80%,#0e1c38_90%,#111827_100%)] px-6 py-8 text-gray-100">
			<div className="mx-auto flex max-w-5xl flex-col gap-6">
				<header className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Photo Admin</h1>
						<p className="text-sm text-gray-400">
							{photos.length} photos in photos.json · local only, never deployed
						</p>
					</div>
					<div className="flex items-center gap-3">
						{publishState && (
							<span
								title={
									publishState.liveModified
										? `Live copy last written ${new Date(publishState.liveModified).toLocaleString()}`
										: undefined
								}
								className={`rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
							>
								{badge.label}
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
										<PhotoForm tags={bulk} values={values} onChange={setBulk} compact />
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
													{item.ratio &&
														expectedRatios.length > 0 &&
														!expectedRatios.includes(item.ratio) &&
														item.status !== 'done' && (
															<div className="mt-2 flex flex-wrap items-center gap-3 rounded-md border border-amber-700 bg-amber-950/40 px-3 py-2">
																<span className="text-xs text-amber-300">
																	Crop is <strong>{item.ratio}</strong> — expected{' '}
																	{expectedRatios.join(' or ')}. Re-export from
																	Lightroom, or upload as is.
																</span>
																<button
																	type="button"
																	onClick={() =>
																		setPending((current) =>
																			current.map((p) =>
																				p.key === item.key
																					? {
																							...p,
																							allowAnyRatio:
																								!p.allowAnyRatio,
																						}
																					: p,
																			),
																		)
																	}
																	className={`rounded-md border px-3 py-1 text-xs ${
																		item.allowAnyRatio
																			? 'border-amber-500 bg-amber-900 text-amber-100'
																			: 'border-amber-700 text-amber-300 hover:bg-amber-900/60'
																	}`}
																>
																	{item.allowAnyRatio
																		? 'Will upload as is'
																		: 'Upload as is'}
																</button>
															</div>
														)}
													{item.status !== 'done' && (
														<div className="mt-3">
															<PhotoForm
																tags={item.tags}
																values={values}
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
													className="flex h-8 flex-shrink-0 items-center gap-1.5 rounded-md border border-gray-600 px-3 text-sm text-gray-200 hover:border-red-700 hover:bg-red-950"
												>
													<span className="text-red-400">
														<Icon path={TRASH_PATH} />
													</span>
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
						onChanged={() => void load()}
						onRemoved={(message) => {
							setNotice(message);
							void load();
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default AdminPage;
