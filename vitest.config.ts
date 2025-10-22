import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // Performance optimizations - balanced approach
    pool: 'forks', // Use forks instead of threads for better isolation
    poolOptions: {
      forks: {
        singleFork: false, // Enable parallel execution
        minForks: 1,
        maxForks: 4, // Parallel test files execution
      },
    },
    isolate: true, // Keep isolation to prevent test interference
    // Only run tests that changed (during watch mode)
    changed: false,
    // Reduce transform overhead
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
      },
    },
  },
})
