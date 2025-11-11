import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    // Exclude E2E tests (Playwright tests)
    exclude: ['**/node_modules/**', '**/e2e/**'],
    // Aggressive performance optimizations - maximize parallel execution
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
        minForks: 2,
        maxForks: 8, // Run up to 8 test files in parallel
      },
    },
    isolate: true, // Keep isolation to prevent test failures
    // Reduce overhead
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
      },
    },
    // Code coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'e2e/',
        'dist/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/test-utils/**',
        '**/__tests__/**',
        'vitest.setup.ts',
        'vite.config.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        'server/**', // Backend code (separate coverage needed)
        'database/**',
      ],
      include: ['src/**/*.{ts,tsx}'],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
})
