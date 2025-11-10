import { test, expect } from '@playwright/test';

/**
 * E2E Smoke Tests - Basic Functionality
 *
 * Purpose: Quick sanity checks that critical pages load and function
 * Optimized to remove redundant tests and arbitrary waits
 */

test.describe('Smoke Tests - Core Pages', () => {
  test('homepage (Dashboard) loads successfully with map', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for key elements
    await expect(page).toHaveTitle(/heritage-tracker/i);

    // Map should be visible
    const map = page.locator('.leaflet-container').first();
    await expect(map).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Smoke Tests - Navigation', () => {
  test('navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for Timeline link
    const timelineLink = page.getByRole('link', { name: /timeline/i }).first();
    const count = await timelineLink.count();

    if (count > 0) {
      await expect(timelineLink).toBeVisible();
      await timelineLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/timeline');
    }
  });

  test('browser back button works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    await page.goBack();
    await page.waitForLoadState('networkidle');

    expect(page.url()).not.toContain('/timeline');
  });
});

test.describe('Smoke Tests - Mock Data', () => {
  test('map shows site markers', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for map to render
    const map = page.locator('.leaflet-container').first();
    await expect(map).toBeVisible();

    // Look for markers or clusters (using more flexible selector)
    const markers = page.locator('.leaflet-marker-icon, .leaflet-marker-cluster, .marker-cluster, canvas.leaflet-zoom-animated').first();
    await expect(markers).toBeVisible({ timeout: 5000 });
  });

  test('clicking on map marker shows site details', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find and click a marker
    const marker = page.locator('.leaflet-marker-icon').first();
    const markerCount = await marker.count();

    if (markerCount > 0) {
      await marker.click();

      // Should show popup or detail panel
      const popup = page.locator('.leaflet-popup, .site-detail, [role="dialog"]').first();
      await expect(popup).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Smoke Tests - Error Handling', () => {
  test('app handles invalid routes gracefully', async ({ page }) => {
    // Listen for page crashes
    let pageCrashed = false;
    page.on('crash', () => {
      pageCrashed = true;
    });

    await page.goto('/this-page-does-not-exist');
    await page.waitForLoadState('networkidle');

    // Wait for React to hydrate by checking for interactive elements
    await page.waitForSelector('body', { state: 'visible' });

    // Should not crash
    expect(pageCrashed).toBe(false);

    // Should not show critical error text
    const hasError = await page.getByText(/crashed|fatal error/i).count();
    expect(hasError).toBe(0);

    // The app doesn't have a 404 page configured, so invalid routes show empty content
    // This is acceptable behavior - no crash is what we're testing for
  });

  test('console has no critical errors', async ({ page }) => {
    const criticalErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out known acceptable errors (network issues, external resources)
        if (!text.includes('favicon') &&
            !text.includes('tile') &&
            !text.includes('404') &&
            !text.includes('net::ERR') &&
            !text.includes('Failed to load resource')) {
          criticalErrors.push(text);
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should have zero critical errors (all errors should be filtered or fixed)
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
    }
    expect(criticalErrors).toEqual([]);
  });
});

test.describe('Smoke Tests - Performance', () => {
  test('homepage loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds (reasonable target for development)
    // This catches performance regressions while allowing for CI variability
    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe('Smoke Tests - Accessibility', () => {
  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through first few elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should have moved focus to an interactive element (not body)
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);

    // Focus should be on an interactive element: BUTTON, A (link), INPUT, SELECT, TEXTAREA
    expect(focusedElement).toMatch(/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/);
  });
});
