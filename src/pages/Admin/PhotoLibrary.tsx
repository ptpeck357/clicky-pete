import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Photo } from '../../types/photo';
import { adminService } from '../../services/adminService';
import type { EditableTags, TagValues } from '../../services/adminService';
import { PhotoEditModal } from './PhotoEditModal';
import { Icon, PENCIL_PATH, TRASH_PATH } from './icons';

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

type SortKey = 'added' | 'category' | 'location' | 'collection';

const SORT_OPTIONS: [SortKey, string][] = [
	['added', 'Date added'],
	['category', 'Category'],
	['location', 'Location'],
	['collection', 'Collection'],
];

type GroupKey = 'none' | 'category' | 'collection' | 'featured';

const GROUP_OPTIONS: [GroupKey, string][] = [
	['none', 'No grouping'],
	['category', 'Group by category'],
	['collection', 'Group by collection'],
	['featured', 'Group by featured'],
];

/**
 * Featured only ever splits the library in two, so that view alone offers a second level: with
 * a few hundred photos on one side, "Not featured" is a pile rather than a group. The tag
 * groupings are already narrow enough that grouping them again would just be nesting for its
 * own sake, so they do not get it.
 */
type SubGroupKey = Exclude<GroupKey, 'featured'>;

const SUB_GROUP_OPTIONS: [SubGroupKey, string][] = [
	['none', 'All photos'],
	['category', 'By category'],
	['collection', 'By collection'],
];

const UNTAGGED = 'Untagged';

const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });

/** Featured is a flag rather than a tag, so it splits in two: 'Featured' sorts before 'Not featured'. */
const groupNameOf = (photo: Photo, key: Exclude<GroupKey, 'none'>): string => {
	if (key === 'featured') return photo.tags.featured === true ? 'Featured' : 'Not featured';
	return photo.tags[key].trim() || UNTAGGED;
};

// Untagged is a gap rather than a name, so it stays after the real groups in either direction.
const compareGroups = (a: string, b: string, direction: number): number =>
	Number(a === UNTAGGED) - Number(b === UNTAGGED) || direction * collator.compare(a, b);

const GROUP_NOUNS: Record<Exclude<GroupKey, 'none'>, string> = {
	category: 'categories',
	collection: 'collections',
	featured: 'groups',
};

/** Photos already sit next to their neighbours once sorted by the key, so groups are runs. */
const runsOf = (sorted: Photo[], key: Exclude<GroupKey, 'none'>): { name: string; photos: Photo[] }[] => {
	const out: { name: string; photos: Photo[] }[] = [];
	sorted.forEach((photo) => {
		const name = groupNameOf(photo, key);
		const last = out[out.length - 1];
		if (last && last.name === name) last.photos.push(photo);
		else out.push({ name, photos: [photo] });
	});
	return out;
};

/** A hand-edited or stale query string should land on the ungrouped view, not crash the page. */
const readKey = <T extends string>(value: string | null, options: [T, string][]): T =>
	options.find(([key]) => key === value)?.[0] ?? options[0][0];

/** Collection cards show the cover the site would show; the other groups have no such flag. */
const coverOf = (groupPhotos: Photo[], key: Exclude<GroupKey, 'none'>): Photo =>
	(key === 'collection' ? groupPhotos.find((photo) => photo.tags.collectionCover === true) : undefined) ??
	groupPhotos[0];

export const PhotoLibrary: React.FC<PhotoLibraryProps> = ({ photos, values, onChanged, onRemoved, onError }) => {
	const [query, setQuery] = useState('');
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [busy, setBusy] = useState(false);
	const [limit, setLimit] = useState(PAGE_SIZE);
	const [confirmingId, setConfirmingId] = useState<string | null>(null);
	const [sortKey, setSortKey] = useState<SortKey>('added');
	const [descending, setDescending] = useState(true);
	const [groupsDescending, setGroupsDescending] = useState(false);

	/**
	 * Which group is open lives in the URL rather than in state, so the browser's back button
	 * steps out one layer instead of leaving the admin, and a refresh reopens where you were.
	 */
	const [searchParams, setSearchParams] = useSearchParams();
	const groupBy = readKey(searchParams.get('group'), GROUP_OPTIONS);
	const openGroupName = searchParams.get('open');
	// Only the featured split offers a second level, so `sub` is ignored under any other grouping.
	const subGroupBy = groupBy === 'featured' ? readKey(searchParams.get('sub'), SUB_GROUP_OPTIONS) : 'none';
	const openSubGroupName = searchParams.get('sub-open');

	/** Pushes rather than replaces: each layer is a step back. */
	const go = (changes: Partial<Record<'group' | 'open' | 'sub' | 'sub-open', string | null>>) => {
		const next = new URLSearchParams(searchParams);
		Object.entries(changes).forEach(([key, value]) => {
			if (value) next.set(key, value);
			else next.delete(key);
		});
		setSearchParams(next);
		setLimit(PAGE_SIZE);
	};

	const matches = useMemo(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return photos;
		return photos.filter((photo) =>
			[photo.id, photo.file, photo.tags.category, photo.tags.location, photo.tags.collection, photo.tags.date]
				.join(' ')
				.toLowerCase()
				.includes(needle),
		);
	}, [photos, query]);

	/**
	 * Newest means most recently added, not most recently taken: entries are appended on upload,
	 * so position in the array puts the latest additions first without depending on `date`, which
	 * most entries do not have. The tag sorts keep filename ascending inside a run regardless of
	 * direction, so flipping the order only flips the runs. Grouping takes precedence over the
	 * sort, which then orders photos inside each group; the groups have their own direction,
	 * since the card grid and the photos in one group are never on screen together.
	 */
	const ordered = useMemo(() => {
		const position = new Map(matches.map((photo, index) => [photo.id, index]));
		const direction = descending ? -1 : 1;
		const within = (a: Photo, b: Photo): number => {
			if (sortKey === 'added') return direction * (position.get(a.id)! - position.get(b.id)!);
			return direction * collator.compare(a.tags[sortKey], b.tags[sortKey]) || collator.compare(a.file, b.file);
		};
		if (groupBy === 'none') return [...matches].sort(within);
		const groupDirection = groupsDescending ? -1 : 1;
		return [...matches].sort(
			(a, b) => compareGroups(groupNameOf(a, groupBy), groupNameOf(b, groupBy), groupDirection) || within(a, b),
		);
	}, [matches, sortKey, descending, groupBy, groupsDescending]);

	/** Groups are runs in `ordered`, which is already sorted by group name when one is chosen. */
	const groups = useMemo(() => {
		if (groupBy === 'none') return [];
		return runsOf(ordered, groupBy);
	}, [ordered, groupBy]);

	const openGroup = groups.find((group) => group.name === openGroupName);

	/**
	 * Sorting again inside an open group is stable, so the photo sort chosen in the toolbar
	 * survives as the order within each sub-group.
	 */
	const subGroups = useMemo(() => {
		if (!openGroup || subGroupBy === 'none') return [];
		const direction = groupsDescending ? -1 : 1;
		const sorted = [...openGroup.photos].sort((a, b) =>
			compareGroups(groupNameOf(a, subGroupBy), groupNameOf(b, subGroupBy), direction),
		);
		return runsOf(sorted, subGroupBy);
	}, [openGroup, subGroupBy, groupsDescending]);

	const openSubGroup = subGroups.find((group) => group.name === openSubGroupName);

	const showingCards = groupBy !== 'none' && (!openGroup || (subGroupBy !== 'none' && !openSubGroup));

	const cards = openGroup ? subGroups : groups;

	// One flat list drives the grid, the paging and the modal's arrow keys, whichever view is open.
	const listed = showingCards
		? []
		: groupBy === 'none'
			? ordered
			: subGroupBy === 'none'
				? (openGroup?.photos ?? [])
				: (openSubGroup?.photos ?? []);

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
	const editing = editingIndex !== null ? listed[editingIndex] : undefined;

	const hasMore = listed.length > limit;
	const sentinelRef = useRef<HTMLDivElement>(null);

	/**
	 * Rebuilt on every page rather than kept alive, because an observer only fires when the
	 * intersection changes: a sentinel still on screen after the new rows render would never
	 * report again, and a short page would stop paging halfway.
	 */
	useEffect(() => {
		const node = sentinelRef.current;
		if (!node || !hasMore) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) setLimit((current) => current + PAGE_SIZE);
			},
			{ rootMargin: '400px' },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [hasMore, limit]);

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
				{/*
				 * Each view gets the controls that change what is on it. Grouping is chosen before
				 * entering a group, so the select is gone while one is open — the back button is
				 * the way out. The photo sort is pointless on the card grid, where no photo shows.
				 */}
				{!openGroup && (
					<select
						className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={groupBy}
						onChange={(event) => {
							const key = event.target.value as GroupKey;
							go({ group: key === 'none' ? null : key, open: null, sub: null, 'sub-open': null });
						}}
						aria-label="Group by"
					>
						{GROUP_OPTIONS.map(([key, label]) => (
							<option key={key} value={key}>
								{label}
							</option>
						))}
					</select>
				)}
				{groupBy === 'featured' && openGroup && !openSubGroup && (
					<select
						className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={subGroupBy}
						onChange={(event) => {
							const key = event.target.value as SubGroupKey;
							go({ sub: key === 'none' ? null : key, 'sub-open': null });
						}}
						aria-label="Group within this set"
					>
						{SUB_GROUP_OPTIONS.map(([key, label]) => (
							<option key={key} value={key}>
								{label}
							</option>
						))}
					</select>
				)}
				{!showingCards && (
					<select
						className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={sortKey}
						onChange={(event) => {
							const key = event.target.value as SortKey;
							setSortKey(key);
							// Newest first for added, A to Z for a tag: the useful default in each case.
							setDescending(key === 'added');
							setLimit(PAGE_SIZE);
						}}
						aria-label="Sort by"
					>
						{SORT_OPTIONS.map(([key, label]) => (
							<option key={key} value={key}>
								Sort by {label}
							</option>
						))}
					</select>
				)}
				{/* The label names the order in effect, not the one a click would switch to. */}
				<button
					type="button"
					onClick={() => {
						if (showingCards) setGroupsDescending((current) => !current);
						else setDescending((current) => !current);
						setLimit(PAGE_SIZE);
					}}
					className="flex items-center gap-1.5 rounded-md border border-blue-600 px-3 py-2 text-sm text-blue-100 hover:bg-blue-950"
				>
					<span aria-hidden="true">{(showingCards ? groupsDescending : descending) ? '↓' : '↑'}</span>
					{showingCards
						? groupsDescending
							? 'Z to A'
							: 'A to Z'
						: sortKey === 'added'
							? descending
								? 'Newest first'
								: 'Oldest first'
							: descending
								? 'Z to A'
								: 'A to Z'}
				</button>
				<span className="text-sm text-gray-500 tabular-nums">
					{showingCards && !openGroup
						? `${groups.length} ${GROUP_NOUNS[groupBy]} · ${matches.length} photos`
						: matches.length === photos.length
							? `${photos.length} photos`
							: `${matches.length} of ${photos.length}`}
				</span>
			</div>

			{/* Above whatever it leads back from, cards or photos, so the way out is in one place. */}
			{openGroup && (
				<div className="flex flex-wrap items-baseline gap-3">
					<button
						type="button"
						onClick={() => {
							go({ open: null, 'sub-open': null });
						}}
						className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-800"
					>
						← All {groupBy === 'none' ? 'photos' : GROUP_NOUNS[groupBy]}
					</button>
					{openSubGroup ? (
						<>
							<button
								type="button"
								onClick={() => {
									go({ 'sub-open': null });
								}}
								className="text-sm text-gray-400 hover:text-gray-200"
							>
								{openGroup.name}
							</button>
							<span aria-hidden="true" className="text-xs text-gray-600">
								›
							</span>
							<h3 className="text-sm font-medium text-gray-200">{openSubGroup.name}</h3>
							<span className="text-xs text-gray-500 tabular-nums">
								{openSubGroup.photos.length} photos
							</span>
						</>
					) : (
						<>
							<h3 className="text-sm font-medium text-gray-200">{openGroup.name}</h3>
							<span className="text-xs text-gray-500 tabular-nums">
								{subGroups.length > 0
									? `${subGroups.length} ${GROUP_NOUNS[subGroupBy === 'none' ? 'category' : subGroupBy]} · ${openGroup.photos.length} photos`
									: `${openGroup.photos.length} photos`}
							</span>
						</>
					)}
				</div>
			)}

			{showingCards && (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
					{cards.map((group) => (
						<button
							key={group.name}
							type="button"
							onClick={() => {
								if (openGroup) go({ 'sub-open': group.name });
								else go({ open: group.name });
							}}
							className="group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-900 text-left hover:border-blue-600"
						>
							<img
								src={`${CLOUDFRONT_URL}/photos/400/${coverOf(group.photos, openGroup && subGroupBy !== 'none' ? subGroupBy : groupBy).file}`}
								alt=""
								loading="lazy"
								className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
							<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
								<div className="truncate text-sm font-medium text-white">{group.name}</div>
								<div className="text-xs text-gray-300 tabular-nums">
									{group.photos.length} {group.photos.length === 1 ? 'photo' : 'photos'}
								</div>
							</div>
						</button>
					))}
				</div>
			)}

			{!showingCards && (
				<>
					{/* items-start keeps a portrait card from stretching its landscape neighbours. */}
					<div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{listed.slice(0, limit).map((photo, index) => {
							return (
								<article
									key={photo.id}
									className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900"
								>
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
											{photo.tags.date && (
												<span className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-gray-400">
													{photo.tags.date}
												</span>
											)}
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
												{/* Solid and full size: the way out of a destructive prompt is the
												    easiest thing to find in it. */}
												<button
													type="button"
													autoFocus
													disabled={busy}
													onClick={() => setConfirmingId(null)}
													className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-white disabled:opacity-50"
												>
													Cancel
												</button>
												<p className="text-xs text-gray-500">
													Deleting files publishes photos.json first, so the site never points
													at a missing image. That also publishes any other unpublished
													changes.
												</p>
											</div>
										) : (
											<div className="mt-3 flex gap-2">
												<button
													type="button"
													disabled={busy}
													onClick={() => setEditingIndex(index)}
													className="flex items-center gap-1.5 rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-200 hover:border-blue-700 hover:bg-blue-950 disabled:opacity-50"
												>
													<span className="text-blue-400">
														<Icon path={PENCIL_PATH} />
													</span>
													Edit
												</button>
												<button
													type="button"
													disabled={busy}
													onClick={() => setConfirmingId(photo.id)}
													className="flex items-center gap-1.5 rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-200 hover:border-red-700 hover:bg-red-950 disabled:opacity-50"
												>
													<span className="text-red-400">
														<Icon path={TRASH_PATH} />
													</span>
													Remove
												</button>
											</div>
										)}
									</div>
								</article>
							);
						})}
					</div>

					{hasMore && (
						// overflowAnchor keeps the browser from scrolling to compensate for the
						// rows appearing above it, which reads as the page jumping under you.
						<div ref={sentinelRef} className="flex justify-center py-8" style={{ overflowAnchor: 'none' }}>
							<div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-400" />
						</div>
					)}
				</>
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
						editingIndex < Math.min(limit, listed.length) - 1
							? () => setEditingIndex(editingIndex + 1)
							: undefined
					}
				/>
			)}
		</div>
	);
};
