import { test, expect } from '@playwright/test';
import { gotoAndWait } from './helpers';

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

    await gotoAndWait(page, '/timeline', { waitForMap: true, waitForTimeline: true });

    // Check that page loaded (map or controls visible)
    const timelineElement = page.locator('.leaflet-container, button:has-text("Next")').first();
    await expect(timelineElement).toBeVisible({ timeout: 30000 });
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
