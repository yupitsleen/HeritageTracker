import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Timeline Page
 *
 * Integration checks that the Timeline page renders its Wayback comparison UI and that the
 * Dashboard exposes the timeline event-navigation controls. Detailed scrubber/slider behavior
 * is covered by unit tests (WaybackSlider.test.tsx, TimelineScrubber.test.tsx).
 */

test.describe('Timeline Page - Integration', () => {
  test('timeline page loads with the wayback comparison UI', async ({ page }) => {
    test.slow(); // Wayback archive fetch + lazy map chunks are slow under parallel load.

    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // The bottom panel is tabbed and opens on the site timeline, so select Imagery.
    await page.getByRole('tab', { name: /^imagery$/i }).click();

    // Success is observable: the Wayback slider and the satellite map both render.
    await expect(page.getByTestId('wayback-slider')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('.leaflet-container').first()).toBeVisible({ timeout: 30000 });
  });

  test('dashboard exposes timeline event-navigation controls', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // The scrubber renders as a labelled region containing Previous/Next event buttons.
    const scrubber = page.getByRole('region', { name: /timeline scrubber/i });
    await expect(scrubber).toBeVisible({ timeout: 15000 });

    await expect(page.getByRole('button', { name: /previous destruction event/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /next destruction event/i })).toBeVisible();
  });
});
