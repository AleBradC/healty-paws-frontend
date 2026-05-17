/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// Bundle visualizer runs only when ANALYZE=1 is set so it doesn't bloat the
// default build. Run with `npm run analyze` (see package.json).
const shouldAnalyze = process.env.ANALYZE === '1'

// https://vite.dev/config/
export default defineConfig({
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
    // 'hidden' generates source maps but doesn't reference them from the
    // bundle so they aren't auto-fetched by the browser. Upload them to
    // Sentry / your error tracker so stack traces stay readable while
    // shipping nothing extra to end users.
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
      // Auth and routing carry the highest weight because regressions there
      // become user-visible breakage or security issues.
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
      ],
    },
  },
})
