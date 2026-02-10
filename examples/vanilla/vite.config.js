import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@mediamonks/image-effect-renderer': path.resolve(__dirname, '../../../image-effect-renderer/src/index.ts'),
    },
  },
});
