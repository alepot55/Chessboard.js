import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      outDir: 'dist/types',
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Chessboard',
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: (format) => {
        const formatMap: Record<string, string> = {
          es: 'chessboard.esm.js',
          cjs: 'chessboard.cjs.js',
          umd: 'chessboard.umd.js',
          iife: 'chessboard.iife.js',
        };
        return formatMap[format] || `chessboard.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['chess.js'],
      output: {
        globals: {
          'chess.js': 'Chess',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'chessboard.css';
          }
          return assetInfo.name || 'assets/[name].[ext]';
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
    outDir: 'dist',
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@core': resolve(__dirname, 'src/core'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@errors': resolve(__dirname, 'src/errors'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },

  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    postcss: {
      plugins: [],
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,ts}'],
      exclude: ['src/types/**', 'src/**/*.d.ts'],
    },
    setupFiles: ['./tests/setup.ts'],
  },
});
