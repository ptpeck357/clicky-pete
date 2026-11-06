// Types for site-routes.mjs, so vite.config.ts can import it under `tsc -b`.

export const ROOT: string;
export const photos: Array<{ tags: { collection?: string } }>;
export const collections: string[];
export const collectionPath: (collection: string) => string;
export const STATIC_PATHS: string[];
