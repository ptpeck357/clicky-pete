import { client, urlFor } from '../lib/sanity';
import type { SanityImageSource } from '@sanity/image-url';

export interface Journal {
	id: string;
	title: string;
	date: string;
	category: string;
	images: string[];
	body: string;
}

// --- Sanity ---

interface SanityJournal {
	_id: string;
	title: string;
	slug: { current: string };
	date: string;
	category: string;
	photos: SanityImageSource[];
	body?: string;
}

const JOURNALS_QUERY = `*[_type == "journal"] | order(date desc) {
	_id, title, slug, date, category, photos, body
}`;

const JOURNAL_QUERY = `*[_type == "journal" && slug.current == $slug][0] {
	_id, title, slug, date, category, photos, body
}`;

function transformJournal(j: SanityJournal): Journal {
	return {
		id: j.slug.current,
		title: j.title,
		date: new Date(j.date).toLocaleDateString('en-US', {
			month: 'long',
			day: '2-digit',
			year: 'numeric',
		}),
		category: j.category,
		images: (j.photos ?? []).map((photo) => urlFor(photo).width(1200).url()),
		body: j.body ?? '',
	};
}

export async function fetchJournals(): Promise<Journal[]> {
	const data = await client!.fetch<SanityJournal[]>(JOURNALS_QUERY);
	return data.map(transformJournal);
}

export async function fetchJournalById(id: string): Promise<Journal | undefined> {
	const data = await client!.fetch<SanityJournal | null>(JOURNAL_QUERY, { slug: id });
	return data ? transformJournal(data) : undefined;
}
