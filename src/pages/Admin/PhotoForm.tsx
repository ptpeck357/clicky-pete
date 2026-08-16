import React from 'react';
import type { EditableTags, TagValues } from '../../services/adminService';

interface PhotoFormProps {
	tags: EditableTags;
	values: TagValues;
	onChange: (tags: EditableTags) => void;
	idPrefix: string;
	compact?: boolean;
}

const FLAGS = [
	{ key: 'featured', label: 'Featured', hint: 'Homepage feature section' },
	{ key: 'hero', label: 'Hero', hint: 'Homepage banner carousel' },
	{ key: 'collectionCover', label: 'Cover', hint: 'Cover image for its collection' },
] as const;

const FIELDS = [
	{ key: 'category', label: 'Category', list: 'categories' },
	{ key: 'location', label: 'Location', list: 'locations' },
	{ key: 'collection', label: 'Collection', list: 'collections' },
] as const;

const inputClasses =
	'w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

export const PhotoForm: React.FC<PhotoFormProps> = ({ tags, values, onChange, idPrefix, compact = false }) => (
	<div className="flex flex-col gap-3">
		<div className={compact ? 'grid grid-cols-1 gap-3 sm:grid-cols-3' : 'flex flex-col gap-3'}>
			{FIELDS.map(({ key, label, list }) => {
				const listId = `${idPrefix}-${list}`;
				return (
					<label key={key} className="flex flex-col gap-1">
						<span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
						<input
							className={inputClasses}
							value={tags[key]}
							list={listId}
							// Existing values are suggested rather than enforced: this is what keeps
							// "Idaho" from silently becoming a second collection alongside "idaho".
							onChange={(event) => onChange({ ...tags, [key]: event.target.value })}
							placeholder={`Start typing or pick an existing ${label.toLowerCase()}`}
						/>
						<datalist id={listId}>
							{values[list].map((value) => (
								<option key={value} value={value} />
							))}
						</datalist>
					</label>
				);
			})}
		</div>

		<div className="flex flex-wrap gap-4">
			{FLAGS.map(({ key, label, hint }) => (
				<label key={key} className="flex items-center gap-2 text-sm text-gray-300" title={hint}>
					<input
						type="checkbox"
						className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
						checked={tags[key] === true}
						onChange={(event) => onChange({ ...tags, [key]: event.target.checked || undefined })}
					/>
					{label}
				</label>
			))}
		</div>
	</div>
);
