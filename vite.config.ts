import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

const shouldAnalyze = process.env.ANALYZE === '1'

export default defineConfig({
  cacheDir: process.env.VITE_CACHE_DIR || 'node_modules/.vite',
  plugins: [
    react(),
    ...(shouldAnalyze
      ? [
          visualizer({
            filename: 'dist/bundle-report.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  build: {
    sourcemap: 'hidden',
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: 80,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      thresholds: {
        lines: 60,
        functions: 60,
        statements: 60,
        branches: 50,
        'src/context/AuthenticationContext.tsx': {
          lines: 80,
          functions: 80,
          statements: 80,
          branches: 70,
        },
        'src/router/**': {
          lines: 80,
          functions: 80,
          statements: 80,
          branches: 70,
        },
      },
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/test/**',
        'src/generated/**',
        'src/main.tsx',
        'src/App.tsx',
        'src/ApolloProviderWrapper.tsx',
        'src/lib/graphql/**',
        'src/api/**',
        'src/types.ts',
        'src/**/types.ts',
      ],
    },
  },
})
