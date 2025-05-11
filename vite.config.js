import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Automatically opens the app in the browser
  },
  build: {
    rollupOptions: {
      input: '/index.html', // Ensure index.html is the entry point
    },
  },
  publicDir: 'public',
});