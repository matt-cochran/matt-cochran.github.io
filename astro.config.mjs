import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://matt-cochran.github.io',
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
