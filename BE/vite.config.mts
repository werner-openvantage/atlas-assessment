import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import path from 'path'

export default defineConfig({
  test: {
    coverage: {
      exclude: ["**/node_modules/**", "**/index.ts"],
    },
    globals: true,
    restoreMocks: true,
  },
  plugins: [tsconfigPaths(), {
    name: 'mjml',
    transform(code, id) {
      if (id.endsWith('.mjml')) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null
        };
      }
    }
  }],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@ts-types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@errors': path.resolve(__dirname, 'src/errors'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@controllers': path.resolve(__dirname, 'src/controllers'),
      '@middleware': path.resolve(__dirname, 'src/middleware'),
    },
  },
});
