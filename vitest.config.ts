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
  },
})
