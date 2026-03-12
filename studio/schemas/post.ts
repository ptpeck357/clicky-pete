import { defineField, defineType } from 'sanity';

export const post = defineType({
	name: 'post',
	title: 'Post',
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
			name: 'category',
			title: 'Category',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'image',
			title: 'Photo',
			type: 'image',
			options: { hotspot: true },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'excerpt',
			title: 'Excerpt',
			description: 'Short teaser shown on the feed.',
			type: 'text',
			rows: 3,
			validation: (Rule) => Rule.required(),
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
			media: 'image',
			subtitle: 'category',
		},
	},
});
