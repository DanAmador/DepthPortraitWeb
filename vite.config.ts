import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import {copy} from 'vite-plugin-copy';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/DepthPortraitWeb/' : '/',

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  plugins: [react(),

    copy({
      targets: [
        { src: 'public/**/*', dest: 'dist/Portraits' },
        // You can add more objects to the array to copy additional files or directories
      ],
      hook: 'writeBundle' // default
    })
  ],
});
