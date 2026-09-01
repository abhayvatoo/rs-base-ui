import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  external: ['react', 'react-dom'],
  clean: true,
  sourcemap: true,
  esbuildOptions(options) {
    options.jsx = 'automatic';
  }
});
