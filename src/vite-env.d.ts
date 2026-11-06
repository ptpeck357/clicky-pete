/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CLOUDFRONT_URL: string;
	readonly VITE_GA_MEASUREMENT_ID?: string;
}

/** Defined in vite.config.ts from photos.json. Read it through SITE_COLLECTIONS in config/site. */
declare const __SITE_COLLECTIONS__: readonly string[];

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
