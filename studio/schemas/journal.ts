import { defineField, defineType } from 'sanity';

export const journal = defineType({
	name: 'journal',
	title: 'Journal Entry',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'date',
			title: 'Date',
			type: 'datetime',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'photos',
			title: 'Photos',
			description: 'First photo is used as the cover on the feed. Add as many as you like.',
			type: 'array',
			of: [{ type: 'image', options: { hotspot: true } }],
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: 'body',
			title: 'Body',
			description: 'Full journal entry shown on the detail page.',
			type: 'text',
			rows: 8,
		}),
	],
	preview: {
		select: {
			title: 'title',
			media: 'photos.0',
			subtitle: 'date',
		},
	},
});
