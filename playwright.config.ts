import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Heritage Tracker
 *
 * Tests run against the Vite dev server with Mock API enabled.
 * No backend required - uses mock data from src/data/mockSites.ts
 */
export default defineConfig({
  testDir: './e2e',

  /* Maximum time one test can run for */
  timeout: 60 * 1000, // 60 seconds (increased from 30s default)

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only - reduced for faster feedback */
  retries: process.env.CI ? 1 : 0,

  /* Use 2 workers on CI for faster execution, all available locally */
  workers: process.env.CI ? 2 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'html' : 'list',

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment to test on Firefox and WebKit
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports - Disabled temporarily */
    // Mobile tests need additional work for mobile-specific features
    // Uncomment when mobile UI features are fully implemented
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // Disabled: WebKit/Safari not installed
    // Run 'npx playwright install webkit' to enable
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes to start server
  },
});
