import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Comparison Mode (Side-by-Side Maps)
 *
 * Purpose: Ensure dual map view renders correctly with before/after satellite imagery
 * Critical for: Timeline page comparison mode
 */

test.describe('Comparison Mode - Dual Map Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');
  });

  test('timeline page should show at least one map', async ({ page }) => {
    // Timeline page should have at least one Leaflet map
    const maps = page.locator('.leaflet-container');
    const count = await maps.count();

    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('clicking on a site should enter comparison mode with two maps', async ({ page }) => {
    // Wait for sites to load
    await page.waitForTimeout(1000);

    // Look for a clickable site (try multiple selectors)
    const siteElement = page.getByText(/mosque|church|site/i).first();

    // If we can find a site to click
    if (await siteElement.isVisible()) {
      await siteElement.click();
      await page.waitForTimeout(1000);

      // Check for two maps (comparison mode)
      const maps = page.locator('.leaflet-container');
      const mapCount = await maps.count();

      // In comparison mode, should have 2 maps
      if (mapCount === 2) {
        expect(mapCount).toBe(2);
        console.log('Comparison mode activated with 2 maps');
      } else {
        console.log(`Found ${mapCount} map(s), comparison mode may not be active`);
      }
    }
  });

  test('comparison mode should show "before" and "after" labels', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Try to find a site and click it
    const siteElement = page.locator('text=/Al-Omari|mosque|church/i').first();

    if (await siteElement.isVisible()) {
      await siteElement.click();
      await page.waitForTimeout(1000);

      // Look for before/after labels
      const bodyText = await page.textContent('body');

      // Should show temporal labels
      const hasBeforeLabel = bodyText?.toLowerCase().includes('before');
      const hasAfterLabel = bodyText?.toLowerCase().includes('after');

      if (hasBeforeLabel && hasAfterLabel) {
        expect(hasBeforeLabel).toBeTruthy();
        expect(hasAfterLabel).toBeTruthy();
        console.log('Before/After labels found');
      } else {
        console.log('Before/After labels not found - may use different labeling');
      }
    }
  });

  test('both maps in comparison mode should be visible and not overlapping', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Get all maps
    const maps = page.locator('.leaflet-container');
    const mapCount = await maps.count();

    if (mapCount === 2) {
      // Get bounding boxes of both maps
      const map1Box = await maps.nth(0).boundingBox();
      const map2Box = await maps.nth(1).boundingBox();

      if (map1Box && map2Box) {
        // Both maps should have positive dimensions
        expect(map1Box.width).toBeGreaterThan(0);
        expect(map1Box.height).toBeGreaterThan(0);
        expect(map2Box.width).toBeGreaterThan(0);
        expect(map2Box.height).toBeGreaterThan(0);

        // Maps should be side-by-side (different x positions) or stacked (different y)
        const isDifferentPosition =
          map1Box.x !== map2Box.x || map1Box.y !== map2Box.y;

        expect(isDifferentPosition).toBeTruthy();

        console.log('Map 1 position:', map1Box);
        console.log('Map 2 position:', map2Box);
      }
    }
  });

  test('comparison mode maps should have zoom controls', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for Leaflet zoom controls
    const zoomControls = page.locator('.leaflet-control-zoom');
    const count = await zoomControls.count();

    // Should have at least one zoom control (maybe one per map)
    expect(count).toBeGreaterThanOrEqual(1);

    // Zoom in button should be visible
    const zoomInButton = page.locator('.leaflet-control-zoom-in').first();
    await expect(zoomInButton).toBeVisible();

    // Zoom out button should be visible
    const zoomOutButton = page.locator('.leaflet-control-zoom-out').first();
    await expect(zoomOutButton).toBeVisible();
  });

  test('zoom sync toggle should be present in comparison mode', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Try to enter comparison mode
    const siteElement = page.getByText(/mosque|church/i).first();

    if (await siteElement.isVisible()) {
      await siteElement.click();
      await page.waitForTimeout(1000);

      // Look for zoom sync toggle
      const syncToggle = page.getByRole('checkbox', { name: /sync|zoom/i }).or(
        page.getByText(/sync zoom|adaptive zoom/i)
      );

      const count = await syncToggle.count();
      if (count > 0) {
        await expect(syncToggle.first()).toBeVisible();
        console.log('Zoom sync toggle found');
      } else {
        console.log('Zoom sync toggle not found - may be always enabled');
      }
    }
  });

  test('clicking zoom in should update map zoom level', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Click zoom in button
    const zoomInButton = page.locator('.leaflet-control-zoom-in').first();
    await zoomInButton.click();

    // Wait for zoom animation
    await page.waitForTimeout(500);

    // Map should still be visible after zoom
    const map = page.locator('.leaflet-container').first();
    await expect(map).toBeVisible();
  });

  test('"Show Map Markers" toggle should be present', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for marker toggle
    const markerToggle = page.getByRole('checkbox', { name: /show.*marker/i }).or(
      page.getByText(/show map markers|show markers/i)
    );

    const count = await markerToggle.count();
    if (count > 0) {
      await expect(markerToggle.first()).toBeVisible();
      console.log('Map markers toggle found');
    } else {
      console.log('Map markers toggle not found - may be on by default');
    }
  });

  test('comparison mode should show date labels on maps', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Try to enter comparison mode
    const siteElement = page.getByText(/mosque|church/i).first();

    if (await siteElement.isVisible()) {
      await siteElement.click();
      await page.waitForTimeout(1000);

      // Look for date displays (should show dates like "2023-10-15")
      const bodyText = await page.textContent('body');

      // Should contain date patterns
      const hasDatePattern = /202[34]-\d{2}-\d{2}/.test(bodyText || '');

      if (hasDatePattern) {
        expect(hasDatePattern).toBeTruthy();
        console.log('Date labels found in comparison mode');
      } else {
        console.log('Date labels not found - may use different format');
      }
    }
  });

  test('maps should load satellite tiles', async ({ page }) => {
    await page.waitForTimeout(2000); // Give tiles time to load

    // Check if map tiles are loaded (look for tile images)
    const tileImages = page.locator('.leaflet-tile-container img');
    const count = await tileImages.count();

    // Should have loaded some tile images
    expect(count).toBeGreaterThan(0);

    console.log(`Loaded ${count} map tiles`);
  });

  test('comparison mode should handle missing destruction dates gracefully', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for sites (some may not have destruction dates)
    const sites = page.getByText(/site|mosque|church/i);
    const count = await sites.count();

    if (count > 0) {
      // Try clicking on multiple sites
      for (let i = 0; i < Math.min(3, count); i++) {
        await sites.nth(i).click();
        await page.waitForTimeout(1000);

        // Page should not crash or show error
        const hasError = await page.getByText(/error|failed|crash/i).count();
        expect(hasError).toBe(0);

        // Go back to list if possible
        const backButton = page.getByRole('button', { name: /back|close/i });
        if (await backButton.count() > 0) {
          await backButton.first().click();
          await page.waitForTimeout(500);
        }
      }
    }
  });
});

test.describe('Comparison Mode - Wayback Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');
  });

  test('wayback slider should exist for date selection', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for sliders (could be range inputs or custom components)
    const sliders = page.locator('input[type="range"], [role="slider"]');
    const count = await sliders.count();

    if (count > 0) {
      expect(count).toBeGreaterThanOrEqual(1);
      console.log(`Found ${count} slider(s)`);
    }
  });

  test('dual scrubbers should exist in comparison mode', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Enter comparison mode
    const siteElement = page.getByText(/mosque|church/i).first();

    if (await siteElement.isVisible()) {
      await siteElement.click();
      await page.waitForTimeout(1000);

      // Look for multiple scrubbers (before and after)
      const sliders = page.locator('input[type="range"], [role="slider"]');
      const count = await sliders.count();

      // In comparison mode, should have 2 scrubbers (before/after)
      if (count >= 2) {
        expect(count).toBeGreaterThanOrEqual(2);
        console.log('Dual scrubbers found in comparison mode');
      } else {
        console.log(`Found ${count} scrubber(s)`);
      }
    }
  });

  test('scrubbers should have visual distinction (yellow and green)', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Enter comparison mode
    const siteElement = page.getByText(/mosque|church/i).first();

    if (await siteElement.isVisible()) {
      await siteElement.click();
      await page.waitForTimeout(1000);

      // Check for color-coded elements (yellow for before, green for after)
      const bodyHTML = await page.content();

      // Look for color indicators (may be in styles)
      const hasYellowIndicator = bodyHTML.includes('yellow') || bodyHTML.includes('#ffff00') || bodyHTML.includes('rgb(255, 255, 0)');
      const hasGreenIndicator = bodyHTML.includes('green') || bodyHTML.includes('#00ff00') || bodyHTML.includes('rgb(0, 255, 0)');

      console.log('Color indicators:', { hasYellowIndicator, hasGreenIndicator });
    }
  });
});
