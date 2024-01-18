import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import {copy} from 'vite-plugin-copy';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/DepthPortraitWeb/' : '/',
  plugins: [
    react(),
    copy({
      targets: [
        { src: 'public/*', dest: 'assets' },
      ],
      hook: 'writeBundle', // or 'closeBundle' depending on your needs
    }),
    // ... other plugins
  ],
});
