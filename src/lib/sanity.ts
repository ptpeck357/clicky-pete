import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;

export const client = projectId
	? createClient({
			projectId,
			dataset: (import.meta.env.VITE_SANITY_DATASET as string) || 'production',
			apiVersion: '2024-01-01',
			useCdn: true,
		})
	: null;

const builder = client ? imageUrlBuilder(client) : null;

export const urlFor = (source: SanityImageSource) => builder!.image(source);
