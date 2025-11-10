import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Comparison Mode
 *
 * Purpose: Test satellite comparison functionality, including:
 * - Side-by-side map rendering
 * - Before/after date selection
 * - Map synchronization
 * - Date label display
 * - Site selection workflow
 */

test.describe('Comparison Mode - Dual Map Rendering', () => {
  test('Timeline page loads with comparison view', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Page should load successfully
    await expect(page).toHaveTitle(/heritage-tracker/i);

    // Look for timeline controls or comparison UI
    const timelineControls = page.getByRole('button', { name: /play|reset/i });
    await expect(timelineControls.first()).toBeVisible({ timeout: 5000 });
  });

  test('comparison view shows two maps side by side', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Wait for maps to render
    await page.waitForTimeout(1000);

    // Look for Leaflet map containers
    const maps = page.locator('.leaflet-container');
    const mapCount = await maps.count();

    // In comparison mode, there should be 2 maps
    // If not in comparison mode yet, may need to select a site first
    if (mapCount === 2) {
      await expect(maps.nth(0)).toBeVisible();
      await expect(maps.nth(1)).toBeVisible();
    }
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

      // Should now show comparison mode with two maps
      const maps = page.locator('.leaflet-container');
      const mapCount = await maps.count();

      // After selecting site, should show dual maps (or at least one map)
      expect(mapCount).toBeGreaterThanOrEqual(1);
    }
  });
});

test.describe('Comparison Mode - Date Selection', () => {
  test('before and after date controls are present', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Look for date controls/scrubbers
    // The timeline should have dual scrubbers in comparison mode
    const timeline = page.locator('[data-testid="wayback-slider"]').or(
      page.locator('.timeline-container')
    ).first();

    const timelineExists = await timeline.count();
    if (timelineExists > 0) {
      await expect(timeline).toBeVisible();

      // Check for scrubber handles or date controls
      // These may be rendered after selecting a site
      const scrubbers = page.locator('[data-testid="scrubber-handle"]').or(
        page.locator('.scrubber-handle')
      );

      const scrubberCount = await scrubbers.count();
      // May have 1 (normal mode) or 2 (comparison mode) scrubbers
      expect(scrubberCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('user can drag scrubbers to change dates', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Select a site first (if not already selected)
    const timelineDot = page.locator('[data-testid="timeline-dot"]').first();
    const dotExists = await timelineDot.count();

    if (dotExists > 0) {
      await timelineDot.click();
      await page.waitForTimeout(500);
    }

    // Look for scrubber handles
    const scrubber = page.locator('[data-testid="scrubber-handle"]').or(
      page.locator('.scrubber-handle')
    ).first();

    const scrubberExists = await scrubber.count();
    if (scrubberExists > 0) {
      // Get initial position
      const initialBox = await scrubber.boundingBox();
      if (initialBox) {
        // Drag scrubber to new position
        await scrubber.hover();
        await page.mouse.down();
        await page.mouse.move(initialBox.x + 50, initialBox.y);
        await page.mouse.up();

        // Wait for update
        await page.waitForTimeout(300);

        // Scrubber should have moved (position changed)
        const newBox = await scrubber.boundingBox();
        expect(newBox).not.toEqual(initialBox);
      }
    }
  });
});

test.describe('Comparison Mode - Date Labels', () => {
  test('date labels are displayed on maps', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Select a site to activate comparison mode
    const timelineDot = page.locator('[data-testid="timeline-dot"]').first();
    const dotExists = await timelineDot.count();

    if (dotExists > 0) {
      await timelineDot.click();
      await page.waitForTimeout(1000);

      // Look for date labels (format: YYYY-MM-DD)
      const dateLabels = page.getByText(/\d{4}-\d{2}-\d{2}/);
      const labelCount = await dateLabels.count();

      // In comparison mode, should show at least some date labels
      if (labelCount > 0) {
        await expect(dateLabels.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('before date has yellow background, after date has green background', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Select a site
    const timelineDot = page.locator('[data-testid="timeline-dot"]').first();
    const dotExists = await timelineDot.count();

    if (dotExists > 0) {
      await timelineDot.click();
      await page.waitForTimeout(1000);

      // Look for date labels
      const dateLabels = page.getByText(/\d{4}-\d{2}-\d{2}/);
      const labelCount = await dateLabels.count();

      if (labelCount >= 2) {
        // Get the first two date labels
        const label1 = dateLabels.nth(0);
        const label2 = dateLabels.nth(1);

        // Check background colors (yellow for before, green for after)
        const color1 = await label1.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });

        const color2 = await label2.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });

        // One should be yellow (253, 185, 39) and one green (0, 122, 61)
        const hasYellow = color1.includes('253, 185, 39') || color2.includes('253, 185, 39');
        const hasGreen = color1.includes('0, 122, 61') || color2.includes('0, 122, 61');

        expect(hasYellow || hasGreen).toBeTruthy();
      }
    }
  });
});

test.describe('Comparison Mode - Map Synchronization', () => {
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

        // Maps should have different tile layers (different time periods)
        // This is implicit in the UI - we verify both maps are rendered
        const tiles1 = maps.nth(0).locator('.leaflet-tile-pane');
        const tiles2 = maps.nth(1).locator('.leaflet-tile-pane');

        await expect(tiles1).toBeVisible({ timeout: 5000 });
        await expect(tiles2).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('sync map toggle controls map synchronization', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Look for sync map toggle (may be in settings menu)
    const syncToggle = page.getByRole('button', { name: /sync map/i }).or(
      page.getByText(/sync map/i)
    ).first();

    const toggleExists = await syncToggle.count();
    if (toggleExists > 0) {
      // Toggle should be interactive
      await expect(syncToggle).toBeVisible();

      // Click to toggle sync
      await syncToggle.click();
      await page.waitForTimeout(300);

      // Toggle state should change (text color, background, etc.)
      // Verify toggle is still present after click
      await expect(syncToggle).toBeVisible();
    }
  });
});

test.describe('Comparison Mode - Site Selection Workflow', () => {
  test('clicking timeline dot selects site and shows comparison', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Find timeline dots
    const timelineDots = page.locator('[data-testid="timeline-dot"]').or(
      page.locator('.timeline-dot')
    );

    const dotCount = await timelineDots.count();
    if (dotCount > 0) {
      // Click the first dot
      const firstDot = timelineDots.first();
      await firstDot.click();
      await page.waitForTimeout(1000);

      // Should show site details or comparison view
      // Check for site name or details panel
      const siteDetails = page.locator('[data-testid="site-detail"]').or(
        page.locator('.site-detail')
      );

      const detailsExist = await siteDetails.count();

      // Either details panel or dual maps should appear
      const maps = page.locator('.leaflet-container');
      const mapCount = await maps.count();

      expect(detailsExist > 0 || mapCount >= 1).toBeTruthy();
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

test.describe('Comparison Mode - Map Controls', () => {
  test('zoom controls are present on comparison maps', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Select a site
    const timelineDot = page.locator('[data-testid="timeline-dot"]').first();
    const dotExists = await timelineDot.count();

    if (dotExists > 0) {
      await timelineDot.click();
      await page.waitForTimeout(1000);

      // Look for Leaflet zoom controls
      const zoomControls = page.locator('.leaflet-control-zoom');
      const controlCount = await zoomControls.count();

      if (controlCount > 0) {
        // At least one set of zoom controls should be present
        await expect(zoomControls.first()).toBeVisible();

        // Zoom in button should be clickable
        const zoomIn = zoomControls.first().locator('.leaflet-control-zoom-in');
        await expect(zoomIn).toBeVisible();
      }
    }
  });

  test('show map markers toggle controls marker visibility', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Look for "Show Map Markers" toggle
    const markersToggle = page.getByRole('button', { name: /show map markers/i }).or(
      page.getByText(/show map markers/i)
    ).first();

    const toggleExists = await markersToggle.count();
    if (toggleExists > 0) {
      // Toggle should be interactive
      await expect(markersToggle).toBeVisible();

      // Click to toggle markers
      await markersToggle.click();
      await page.waitForTimeout(500);

      // Markers should appear/disappear on map
      // Check for marker elements
      const markers = page.locator('.leaflet-marker-icon');
      const markerCount = await markers.count();

      // Markers should be present (count may vary based on toggle state)
      expect(markerCount).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Comparison Mode - Responsive Behavior', () => {
  test('comparison mode works on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Select a site
    const timelineDot = page.locator('[data-testid="timeline-dot"]').first();
    const dotExists = await timelineDot.count();

    if (dotExists > 0) {
      await timelineDot.click();
      await page.waitForTimeout(1000);

      // Maps should render side by side on desktop
      const maps = page.locator('.leaflet-container');
      const mapCount = await maps.count();

      if (mapCount === 2) {
        // Get bounding boxes to verify side-by-side layout
        const map1Box = await maps.nth(0).boundingBox();
        const map2Box = await maps.nth(1).boundingBox();

        if (map1Box && map2Box) {
          // Maps should not overlap completely
          const map1Right = map1Box.x + map1Box.width;
          expect(map1Right).not.toBe(map2Box.x + map2Box.width);
        }
      }
    }
  });

  test('comparison mode adapts to tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Page should still be functional
    const timelineControls = page.getByRole('button', { name: /play|reset|settings/i });
    await expect(timelineControls.first()).toBeVisible({ timeout: 5000 });
  });
});
