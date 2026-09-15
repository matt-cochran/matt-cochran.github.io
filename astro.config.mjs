import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cochranweb.com',
  base: '/',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  build: {
    format: 'directory',
  },
});
