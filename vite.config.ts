import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { adminPlugin, adminCssExcludePlugin } from './vite-plugin-admin.ts';

export default defineConfig({
	plugins: [react(), adminCssExcludePlugin(), tailwindcss(), adminPlugin()],
});
