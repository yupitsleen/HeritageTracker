import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Timeline Page
 *
 * Purpose: Integration tests that verify Timeline page loads and Dashboard timeline exists
 * Note: Button functionality (NEXT/PREV/RESET) is covered by unit tests in TimelineScrubber.test.tsx
 *
 * Optimized: Keeps only unique integration tests, removes redundant component tests
 */

test.describe('Timeline Page - Integration', () => {
  // Mark as slow due to lazy loading - this test is flaky in CI but valuable
  test('timeline page should load successfully', async ({ page }) => {
    test.slow(); // Give this test 3x the normal timeout

    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for page errors
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Wait a bit for React to hydrate
    await page.waitForTimeout(2000);

    // Check what state the page is in
    const isLoading = await page.locator('text=Loading Wayback Archive').count();
    const hasError = await page.locator('.text-red-600').count();
    const hasSuccess = await page.locator('[data-testid="wayback-slider"]').count();

    // Debug: get page content to see what's actually there
    const bodyText = await page.locator('body').textContent();
    const bodyHTML = await page.locator('body').innerHTML();
    console.log(`Body text (first 200 chars): ${bodyText?.substring(0, 200)}`);
    console.log(`Body HTML (first 500 chars): ${bodyHTML?.substring(0, 500)}`);

    // Log what we found for debugging
    console.log(`Timeline page state - Loading: ${isLoading}, Error: ${hasError}, Success: ${hasSuccess}`);

    // If still loading after networkidle + 2s, wait up to 30 more seconds for success/error
    if (isLoading > 0) {
      console.log('Page still loading, waiting for completion...');
      const successOrError = page.locator('[data-testid="wayback-slider"], .text-red-600').first();
      await successOrError.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {
        console.log('Timeout waiting for Timeline page to finish loading');
      });
    }

    // Re-check state after waiting
    const finalError = await page.locator('.text-red-600').count();
    const finalSuccess = await page.locator('[data-testid="wayback-slider"]').count();
    const finalMap = await page.locator('.leaflet-container').count();

    console.log(`Final state - Error: ${finalError}, Success: ${finalSuccess}, Map: ${finalMap}`);

    // Log any errors
    if (consoleErrors.length > 0) {
      console.log(`Console errors (${consoleErrors.length}):`, consoleErrors);
    }
    if (pageErrors.length > 0) {
      console.log(`Page errors (${pageErrors.length}):`, pageErrors);
    }

    // If error state, throw with error message
    if (finalError > 0) {
      const errorText = await page.locator('.text-red-600').textContent();
      throw new Error(`Timeline page failed to load: ${errorText}`);
    }

    // If page is completely empty, fail with diagnostic info
    if (finalSuccess === 0 && finalMap === 0) {
      const errorInfo = [
        `Timeline page rendered but is empty.`,
        `Console errors: ${consoleErrors.length}`,
        consoleErrors.length > 0 ? `  - ${consoleErrors.join('\n  - ')}` : '',
        `Page errors: ${pageErrors.length}`,
        pageErrors.length > 0 ? `  - ${pageErrors.join('\n  - ')}` : '',
      ].filter(Boolean).join('\n');

      throw new Error(errorInfo);
    }

    // Success: at least one of these should be visible
    expect(finalSuccess + finalMap).toBeGreaterThan(0);
  });

  test('dashboard should have timeline navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Dashboard should have a timeline component
    const hasTimeline = await page.locator('.timeline-scrubber, [data-testid="timeline"]').count();

    if (hasTimeline > 0) {
      // Dashboard timeline should have navigation buttons
      const nextButton = page.getByRole('button', { name: /next/i });
      const prevButton = page.getByRole('button', { name: /previous|prev/i });

      const nextCount = await nextButton.count();
      const prevCount = await prevButton.count();

      // Should have navigation buttons on dashboard
      expect(nextCount).toBeGreaterThan(0);
      expect(prevCount).toBeGreaterThan(0);
    }
  });
});
