// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from "path"
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Explicitly set MIME type for .jsx files
    mimeTypes: {
      'jsx': 'application/javascript',
    },
  },
  // Ensure .jsx files are treated as JavaScript
  esbuild: {
    loader: { '.jsx': 'jsx' },
  },
});