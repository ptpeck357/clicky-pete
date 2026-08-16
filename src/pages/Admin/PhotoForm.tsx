import React from 'react';
import type { EditableTags, TagValues } from '../../services/adminService';
import { Combobox } from './Combobox';

interface PhotoFormProps {
	tags: EditableTags;
	values: TagValues;
	onChange: (tags: EditableTags) => void;
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

export const PhotoForm: React.FC<PhotoFormProps> = ({ tags, values, onChange, compact = false }) => (
	<div className="flex flex-col gap-3">
		<div className={compact ? 'grid grid-cols-1 gap-3 sm:grid-cols-3' : 'flex flex-col gap-3'}>
			{FIELDS.map(({ key, label, list }) => (
				<Combobox
					key={key}
					label={label}
					value={tags[key]}
					options={values[list]}
					onChange={(value) => onChange({ ...tags, [key]: value })}
					placeholder={`Pick or type a ${label.toLowerCase()}`}
				/>
			))}
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
