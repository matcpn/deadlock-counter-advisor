import { defineConfig } from 'vite';
export default defineConfig({ base: './', build: { rollupOptions: { output: {
  manualChunks: id => id.endsWith('/game-catalog.json') ? 'game-catalog' : id.endsWith('/reviewed-catalog.json') ? 'reviewed-catalog' : undefined
} } } });
