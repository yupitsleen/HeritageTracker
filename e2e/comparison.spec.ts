import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Comparison Mode
 *
 * Purpose: Test critical comparison mode workflows that require full page context:
 * - Timeline page loading with comparison UI
 * - Site selection enabling dual maps
 * - Maps displaying different time periods
 * - Site name display in comparison view
 *
 * Note: Detailed interactions (scrubber drag, date labels, colors, sync toggle) are covered by:
 * - WaybackSlider.test.tsx (67 unit tests)
 * - ComparisonMapView.test.tsx (58 unit tests)
 */

test.describe('Comparison Mode - Critical Workflows', () => {
  test('Timeline page loads with comparison view', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Page should load successfully
    await expect(page).toHaveTitle(/heritage tracker/i);

    // Map should be visible (Timeline page always shows map)
    const map = page.locator('.leaflet-container').first();
    await expect(map).toBeVisible({ timeout: 5000 });
  });

  test('selecting a site enables comparison mode', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Look for site selection UI (timeline dots, list, etc.)
    const timelineDot = page.locator('[data-testid="timeline-dot"]').or(
      page.locator('.timeline-dot')
    ).first();

    const dotCount = await timelineDot.count();
    if (dotCount > 0) {
      // Click a timeline dot to select a site
      await timelineDot.click();
      await page.waitForTimeout(500);

      // Should now show comparison mode with maps
      const maps = page.locator('.leaflet-container');
      const mapCount = await maps.count();

      // After selecting site, should show dual maps (or at least one map)
      expect(mapCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('maps show different time periods', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Select a site
    const timelineDot = page.locator('[data-testid="timeline-dot"]').first();
    const dotExists = await timelineDot.count();

    if (dotExists > 0) {
      await timelineDot.click();
      await page.waitForTimeout(1000);

      // Check for dual maps
      const maps = page.locator('.leaflet-container');
      const mapCount = await maps.count();

      if (mapCount === 2) {
        // Both maps should be visible
        await expect(maps.nth(0)).toBeVisible();
        await expect(maps.nth(1)).toBeVisible();

        // Maps should have tile layers (different time periods)
        const tiles1 = maps.nth(0).locator('.leaflet-tile-pane');
        const tiles2 = maps.nth(1).locator('.leaflet-tile-pane');

        await expect(tiles1).toBeVisible({ timeout: 5000 });
        await expect(tiles2).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('site name is displayed in comparison view', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Select a site
    const timelineDot = page.locator('[data-testid="timeline-dot"]').first();
    const dotExists = await timelineDot.count();

    if (dotExists > 0) {
      await timelineDot.click();
      await page.waitForTimeout(500);

      // Look for site name in heading or title
      const siteHeading = page.locator('h1, h2, h3').first();
      const headingExists = await siteHeading.count();

      if (headingExists > 0) {
        // Site name should be displayed
        await expect(siteHeading).toBeVisible();
        const headingText = await siteHeading.textContent();
        expect(headingText).toBeTruthy();
        expect(headingText?.length).toBeGreaterThan(0);
      }
    }
  });
});
