// Bouwt Fatih Quest als één los HTML-bestand (dubbelklik om te openen, geen installatie nodig).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: { alias: { 'virtual:pwa-register': '/src/pwa-stub.ts' } },
  build: { outDir: 'dist-single', emptyOutDir: true },
});
