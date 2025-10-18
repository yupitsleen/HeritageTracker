import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // Performance optimizations
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    isolate: true, // Changed to true to prevent mock interference between test files
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
