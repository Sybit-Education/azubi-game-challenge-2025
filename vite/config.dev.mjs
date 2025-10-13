import { defineConfig } from 'vite';

export default defineConfig({
  base: 'azubi-game-challenge-2025/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    },
  },
  server: {
    port: 8080
  }
});
