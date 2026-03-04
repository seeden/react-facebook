import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname),
  server: {
    port: 5174,
    strictPort: true,
  },
  resolve: {
    alias: {
      'react-facebook': resolve(__dirname, '../../src/index'),
    },
  },
});
