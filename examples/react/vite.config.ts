import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mediamonks/image-effect-renderer': path.resolve(__dirname, '../../../image-effect-renderer/src/index.ts'),
    },
  },
});
