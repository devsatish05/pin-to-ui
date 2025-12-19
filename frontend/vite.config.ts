import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './ui',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    lib: {
      entry: resolve(__dirname, 'ui/main.ts'),
      name: 'UICommentOverlay',
      fileName: (format) => `ui-comment-overlay.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'ui-comment-overlay.css';
          return assetInfo.name || '';
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Using @use in individual files instead of additionalData
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@ui': resolve(__dirname, './ui'),
      '@overlay': resolve(__dirname, './overlay'),
      '@shared': resolve(__dirname, './shared'),
      '@components': resolve(__dirname, './components')
    }
  }
});
