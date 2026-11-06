import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { adminPlugin, adminCssExcludePlugin } from './vite-plugin-admin.ts';
import { collections } from './scripts/site-routes.mjs';

export default defineConfig({
	// The collection names at build time, the same list the sitemap and prerendered pages use.
	// Only the names ship, not the manifest. A collection published from the admin appears here
	// at the next build, as it does in the sitemap.
	define: {
		__SITE_COLLECTIONS__: JSON.stringify(collections),
	},
	resolve: {
		alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
	},
	plugins: [react(), adminCssExcludePlugin(), tailwindcss(), adminPlugin()],
});
