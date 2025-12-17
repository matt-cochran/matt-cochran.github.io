import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // If you are deploying to https://<USERNAME>.github.io/<REPO>/
  // change the base to '/<REPO>/'
  base: './',
  define: {
    'process.env': {}
  }
});