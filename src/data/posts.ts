import { client, urlFor } from '../lib/sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export interface Post {
	id: string;
	date: string;
	category: string;
	image: string;
	excerpt: string;
	body: string;
}

// Static fallback — used when Sanity is not configured
export const POSTS: Post[] = [
	{
		id: 'highlands-silence',
		date: 'May 04, 2024',
		category: 'Highlands',
		image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
		excerpt:
			"There's a silence at 12,000 feet that you can't find anywhere else. It's not an empty silence, but a heavy, resonant one.",
		body: "I spent four days tracking the light across these granite peaks. Every morning I was up before dawn, watching the alpenglow creep down the ridgeline — that brief window where the sky turns impossible shades of pink and amber before the sun crests the horizon. The silence at that altitude is something you feel in your chest. It's not the absence of sound, but the presence of something older and heavier than noise. These photos are my attempt to hold onto that feeling.",
	},
];

export const getPostById = (id: string): Post | undefined => POSTS.find((p) => p.id === id);

// --- Sanity ---

interface SanityPost {
	_id: string;
	slug: { current: string };
	date: string;
	category: string;
	image: SanityImageSource;
	excerpt: string;
	body?: string;
}

const POSTS_QUERY = `*[_type == "post"] | order(date desc) {
	_id, slug, date, category, image, excerpt, body
}`;

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
	_id, slug, date, category, image, excerpt, body
}`;

function transformPost(p: SanityPost): Post {
	return {
		id: p.slug.current,
		date: new Date(p.date).toLocaleDateString('en-US', {
			month: 'long',
			day: '2-digit',
			year: 'numeric',
		}),
		category: p.category,
		image: urlFor(p.image).width(1200).url(),
		excerpt: p.excerpt,
		body: p.body ?? '',
	};
}

export async function fetchPosts(): Promise<Post[]> {
	if (!import.meta.env.VITE_SANITY_PROJECT_ID) return POSTS;
	const data = await client.fetch<SanityPost[]>(POSTS_QUERY);
	return data.map(transformPost);
}

export async function fetchPostById(id: string): Promise<Post | undefined> {
	if (!import.meta.env.VITE_SANITY_PROJECT_ID) return getPostById(id);
	const data = await client.fetch<SanityPost | null>(POST_QUERY, { slug: id });
	return data ? transformPost(data) : undefined;
}
