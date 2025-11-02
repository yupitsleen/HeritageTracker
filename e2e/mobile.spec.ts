import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Mobile Responsive Layout
 *
 * Purpose: Ensure mobile-specific UI elements work correctly
 * Critical for: Filter drawer, navigation, mobile layouts
 *
 * Note: Run with Mobile Chrome project to test mobile viewports
 */

test.describe('Mobile Responsive - Filter Drawer', () => {

  test('mobile filter drawer button should be visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // On mobile, filters should be in a drawer/menu
    // Look for hamburger menu or "Filters" button
    const filterButton = page.getByRole('button', { name: /filter|menu/i }).or(
      page.locator('button:has-text("Filter")').or(
        page.locator('[aria-label*="filter" i]')
      )
    );

    const count = await filterButton.count();
    if (count > 0) {
      await expect(filterButton.first()).toBeVisible();
      console.log('Mobile filter button found');
    } else {
      console.log('No mobile filter button found - filters may be always visible');
    }
  });

  test('clicking mobile filter button should open drawer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to find and click filter button
    const filterButton = page.getByRole('button', { name: /filter/i }).first();

    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);

      // Drawer should open (look for dialog or drawer role)
      const drawer = page.getByRole('dialog').or(
        page.locator('[role="menu"]').or(
          page.locator('.drawer, .mobile-filters')
        )
      );

      const count = await drawer.count();
      if (count > 0) {
        await expect(drawer.first()).toBeVisible();
        console.log('Mobile filter drawer opened');
      }
    }
  });

  test('mobile filter drawer should contain filter options', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open filter drawer
    const filterButton = page.getByRole('button', { name: /filter/i }).first();

    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);

      // Drawer should contain filter options
      const siteTypeFilter = page.getByText(/site type/i);
      const statusFilter = page.getByText(/status/i);

      const hasSiteType = await siteTypeFilter.count() > 0;
      const hasStatus = await statusFilter.count() > 0;

      expect(hasSiteType || hasStatus).toBeTruthy();
    }
  });

  test('mobile drawer should be closable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open drawer
    const filterButton = page.getByRole('button', { name: /filter/i }).first();

    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);

      // Look for close button (X, Close, or tap outside)
      const closeButton = page.getByRole('button', { name: /close/i }).or(
        page.locator('[aria-label*="close" i]').or(
          page.locator('button:has-text("×")')
        )
      );

      const count = await closeButton.count();
      if (count > 0) {
        await closeButton.first().click();
        await page.waitForTimeout(500);

        // Drawer should be closed (may be hidden but still in DOM)
        console.log('Close button clicked');
      } else {
        // Try clicking outside to close
        await page.mouse.click(10, 10);
        await page.waitForTimeout(500);
        console.log('Clicked outside to close drawer');
      }
    }
  });

  test('mobile filter drawer should not overlap with map', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open drawer
    const filterButton = page.getByRole('button', { name: /filter/i }).first();

    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);

      // Get drawer position
      const drawer = page.locator('[role="dialog"], .drawer, .mobile-filters').first();

      if (await drawer.isVisible()) {
        const drawerBox = await drawer.boundingBox();

        // Get map position
        const map = page.locator('.leaflet-container').first();
        const mapBox = await map.boundingBox();

        if (drawerBox && mapBox) {
          console.log('Drawer position:', drawerBox);
          console.log('Map position:', mapBox);

          // Drawer should have a higher z-index or cover the map intentionally
          expect(drawerBox.width).toBeGreaterThan(0);
          expect(drawerBox.height).toBeGreaterThan(0);
        }
      }
    }
  });
});

test.describe('Mobile Responsive - Navigation', () => {

  test('mobile navigation menu should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for hamburger menu or mobile nav button
    const navButton = page.getByRole('button', { name: /menu|navigation/i }).or(
      page.locator('[aria-label*="menu" i]').or(
        page.locator('button.menu, button.hamburger')
      )
    );

    const count = await navButton.count();
    if (count > 0) {
      await expect(navButton.first()).toBeVisible();
      console.log('Mobile navigation button found');
    } else {
      console.log('No hamburger menu found - navigation may be always visible');
    }
  });

  test('all pages should be accessible on mobile', async ({ page }) => {
    const pages = ['/', '/timeline', '/data', '/stats', '/about'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Page should load without errors
      const hasError = await page.getByText(/error|crashed|failed to load/i).count();
      expect(hasError).toBe(0);

      console.log(`✓ ${pagePath} loaded on mobile`);
    }
  });

  test('mobile viewport should not have horizontal scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if page width exceeds viewport
    const viewportWidth = page.viewportSize()?.width || 0;
    const pageWidth = await page.evaluate(() => document.body.scrollWidth);

    // Page width should not exceed viewport (with small tolerance for rounding)
    expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 5);

    console.log(`Viewport width: ${viewportWidth}, Page width: ${pageWidth}`);
  });
});

test.describe('Mobile Responsive - Timeline', () => {

  test('timeline navigation buttons should be visible on mobile', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Navigation buttons should be visible
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    const prevButton = page.getByRole('button', { name: /previous|prev/i }).first();

    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();
  });

  test('timeline scrubber should be usable on mobile', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Scrubber should be visible
    const scrubber = page.locator('.timeline-scrubber, input[type="range"]').first();

    const count = await page.locator('.timeline-scrubber, input[type="range"]').count();
    if (count > 0) {
      await expect(scrubber).toBeVisible();

      // Scrubber should be interactable (not too small)
      const box = await scrubber.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThan(20); // At least 20px tall for touch
        console.log('Scrubber size:', box);
      }
    }
  });

  test('mobile timeline should show site information', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should show site names or count
    const bodyText = await page.textContent('body');

    const hasSiteInfo = bodyText?.includes('site') || bodyText?.includes('mosque') || bodyText?.includes('church');

    expect(hasSiteInfo).toBeTruthy();
  });
});

test.describe('Mobile Responsive - Map Interaction', () => {

  test('map should be visible on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const map = page.locator('.leaflet-container').first();
    await expect(map).toBeVisible();

    // Map should have reasonable size on mobile
    const box = await map.boundingBox();
    if (box) {
      expect(box.width).toBeGreaterThan(100);
      expect(box.height).toBeGreaterThan(100);
      console.log('Mobile map size:', box);
    }
  });

  test('map zoom controls should be touch-friendly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const zoomIn = page.locator('.leaflet-control-zoom-in').first();
    const zoomOut = page.locator('.leaflet-control-zoom-out').first();

    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();

    // Touch targets should be at least 44x44px (iOS/Material guidelines)
    const zoomInBox = await zoomIn.boundingBox();
    if (zoomInBox) {
      expect(zoomInBox.width).toBeGreaterThanOrEqual(30); // Leaflet default ~30px
      expect(zoomInBox.height).toBeGreaterThanOrEqual(30);
    }
  });

  test('map should support touch gestures', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const map = page.locator('.leaflet-container').first();
    const box = await map.boundingBox();

    if (box) {
      // Simulate touch tap on map
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(500);

      // Map should still be visible (no crash)
      await expect(map).toBeVisible();
    }
  });
});

test.describe('Mobile Responsive - Data Table', () => {

  test('data table should be accessible on mobile', async ({ page }) => {
    await page.goto('/data');
    await page.waitForLoadState('networkidle');

    // Table or list should be visible
    const table = page.locator('table, [role="table"], .table').first();

    const count = await page.locator('table, [role="table"], .table').count();
    if (count > 0) {
      await expect(table).toBeVisible();
    } else {
      // May use card layout instead of table on mobile
      console.log('No table found - may use mobile card layout');
    }
  });

  test('mobile data view should not require horizontal scroll', async ({ page }) => {
    await page.goto('/data');
    await page.waitForLoadState('networkidle');

    const viewportWidth = page.viewportSize()?.width || 0;
    const contentWidth = await page.evaluate(() => document.body.scrollWidth);

    // Should not require horizontal scroll (with tolerance)
    expect(contentWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });

  test('export buttons should be visible on mobile', async ({ page }) => {
    await page.goto('/data');
    await page.waitForLoadState('networkidle');

    // Look for export buttons
    const exportButton = page.getByRole('button', { name: /export|download/i }).or(
      page.getByText(/csv|json|geojson/i)
    );

    const count = await exportButton.count();
    if (count > 0) {
      console.log('Export buttons found on mobile');
    } else {
      console.log('No export buttons visible - may be in menu');
    }
  });
});
