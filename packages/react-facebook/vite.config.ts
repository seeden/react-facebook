import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimize for testing and development
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    strictPort: true,
  },

  // Build optimizations for component testing
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },

  // Define global variables for testing
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },

  // Optimize dependencies for faster dev server startup
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
