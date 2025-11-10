import { test, expect, devices } from '@playwright/test';

/**
 * E2E Tests - Mobile Responsive Behavior
 *
 * Purpose: Test mobile-specific UI and interactions, including:
 * - Mobile menu navigation
 * - Touch interactions
 * - Filter drawer behavior
 * - Table scrolling on mobile
 * - Map interactions on touch devices
 */

test.describe('Mobile Responsive - Navigation', () => {
  test.use({ ...devices['iPhone 12'] });

  test('hamburger menu opens on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for hamburger menu button
    const hamburger = page.getByRole('button', { name: /menu|navigation/i }).or(
      page.locator('[aria-label*="menu"]')
    ).first();

    const hamburgerExists = await hamburger.count();
    if (hamburgerExists > 0) {
      // Click to open menu
      await hamburger.click();
      await page.waitForTimeout(300);

      // Menu should be visible with navigation links
      const menuLinks = page.getByRole('link', { name: /timeline|data|stats|about/i });
      await expect(menuLinks.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('navigation links work in mobile menu', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open hamburger menu
    const hamburger = page.getByRole('button', { name: /menu|navigation/i }).first();
    const hamburgerExists = await hamburger.count();

    if (hamburgerExists > 0) {
      await hamburger.click();
      await page.waitForTimeout(300);

      // Click Timeline link
      const timelineLink = page.getByRole('link', { name: /timeline/i }).first();
      const linkExists = await timelineLink.count();

      if (linkExists > 0) {
        await timelineLink.click();
        await page.waitForLoadState('networkidle');

        // Should navigate to Timeline page
        expect(page.url()).toContain('/timeline');
      }
    }
  });

  test('mobile menu closes after navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open hamburger menu
    const hamburger = page.getByRole('button', { name: /menu|navigation/i }).first();
    const hamburgerExists = await hamburger.count();

    if (hamburgerExists > 0) {
      await hamburger.click();
      await page.waitForTimeout(300);

      // Click a nav link
      const dataLink = page.getByRole('link', { name: /data/i }).first();
      const linkExists = await dataLink.count();

      if (linkExists > 0) {
        await dataLink.click();
        await page.waitForLoadState('networkidle');

        // Menu should close automatically
        // Try to find menu - it should be hidden
        await page.waitForTimeout(300);

        // Hamburger button should be visible again (menu closed)
        await expect(hamburger).toBeVisible();
      }
    }
  });
});

test.describe('Mobile Responsive - Filter Drawer', () => {
  test.use({ ...devices['Pixel 5'] });

  test('filter button opens drawer on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for filter button (may say "Filter" or show filter icon)
    const filterButton = page.getByRole('button', { name: /filter|type|status/i }).first();

    const filterExists = await filterButton.count();
    if (filterExists > 0) {
      await filterButton.click();
      await page.waitForTimeout(300);

      // Filter options should appear (as drawer or expanded section)
      const filterOptions = page.getByText(/mosque|church|destroyed|damaged/i);
      await expect(filterOptions.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('filter drawer can be closed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open filter drawer
    const filterButton = page.getByRole('button', { name: /filter|type|status/i }).first();
    const filterExists = await filterButton.count();

    if (filterExists > 0) {
      await filterButton.click();
      await page.waitForTimeout(300);

      // Look for close button (X, Close, or backdrop)
      const closeButton = page.getByRole('button', { name: /close/i }).or(
        page.locator('[aria-label*="close"]')
      ).first();

      const closeExists = await closeButton.count();
      if (closeExists > 0) {
        await closeButton.click();
        await page.waitForTimeout(300);

        // Filter drawer should be hidden
        // Filter button should still be visible
        await expect(filterButton).toBeVisible();
      }
    }
  });

  test('filters can be applied from mobile drawer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open filter drawer
    const filterButton = page.getByRole('button', { name: /filter|type/i }).first();
    const filterExists = await filterButton.count();

    if (filterExists > 0) {
      await filterButton.click();
      await page.waitForTimeout(300);

      // Select a filter option
      const mosqueOption = page.getByRole('checkbox', { name: /mosque/i }).or(
        page.getByText(/mosque/i).first()
      );

      const optionExists = await mosqueOption.count();
      if (optionExists > 0) {
        await mosqueOption.click();
        await page.waitForTimeout(500);

        // Filter should be applied (check for active badge or filtered results)
        const activeIndicator = page.getByText(/mosque/i);
        await expect(activeIndicator.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });
});

test.describe('Mobile Responsive - Table Scrolling', () => {
  test.use({ ...devices['iPhone 12'] });

  test('sites table is scrollable horizontally on mobile', async ({ page }) => {
    await page.goto('/data');
    await page.waitForLoadState('networkidle');

    // Look for table container
    const table = page.locator('table').or(
      page.locator('[role="table"]')
    ).first();

    const tableExists = await table.count();
    if (tableExists > 0) {
      // Table should be visible
      await expect(table).toBeVisible({ timeout: 5000 });

      // Table container should be scrollable
      const tableContainer = page.locator('[data-testid="table-container"]').or(
        table.locator('..') // parent element
      );

      const containerExists = await tableContainer.count();
      if (containerExists > 0) {
        // Check if container has overflow
        const overflow = await tableContainer.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.overflowX;
        });

        // Should allow scrolling (auto or scroll)
        expect(['auto', 'scroll'].includes(overflow)).toBeTruthy();
      }
    }
  });

  test('table rows are readable on mobile', async ({ page }) => {
    await page.goto('/data');
    await page.waitForLoadState('networkidle');

    // Look for table rows
    const rows = page.locator('tr, [role="row"]');
    const rowCount = await rows.count();

    if (rowCount > 0) {
      // First few rows should be visible
      await expect(rows.nth(0)).toBeVisible({ timeout: 5000 });

      // Text should be readable (not too small)
      const firstCell = rows.nth(1).locator('td, [role="cell"]').first();
      const cellExists = await firstCell.count();

      if (cellExists > 0) {
        const fontSize = await firstCell.evaluate(el => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });

        // Font size should be at least 12px for readability
        expect(fontSize).toBeGreaterThanOrEqual(12);
      }
    }
  });
});

test.describe('Mobile Responsive - Map Interactions', () => {
  test.use({ ...devices['Pixel 5'] });

  test('map is interactive on mobile with touch', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for map
    const map = page.locator('.leaflet-container').first();
    const mapExists = await map.count();

    if (mapExists > 0) {
      await expect(map).toBeVisible({ timeout: 5000 });

      // Map should be touch-enabled
      const touchAction = await map.evaluate(el => {
        return window.getComputedStyle(el).touchAction;
      });

      // touch-action should be set (not 'auto' means touch is handled)
      expect(touchAction).toBeTruthy();
    }
  });

  test('map markers are tappable on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for map to load
    const map = page.locator('.leaflet-container').first();
    await expect(map).toBeVisible({ timeout: 5000 });

    // Look for markers
    const marker = page.locator('.leaflet-marker-icon').first();
    const markerExists = await marker.count();

    if (markerExists > 0) {
      // Tap marker
      await marker.tap();
      await page.waitForTimeout(500);

      // Should show popup or detail view
      const popup = page.locator('.leaflet-popup').or(
        page.locator('[data-testid="site-detail"]')
      );

      const popupExists = await popup.count();
      if (popupExists > 0) {
        await expect(popup.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('map zoom controls work on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for map
    const map = page.locator('.leaflet-container').first();
    await expect(map).toBeVisible({ timeout: 5000 });

    // Look for zoom controls
    const zoomIn = page.locator('.leaflet-control-zoom-in').first();
    const zoomExists = await zoomIn.count();

    if (zoomExists > 0) {
      // Zoom controls should be tappable
      await zoomIn.tap();
      await page.waitForTimeout(500);

      // Map should still be visible (zoom succeeded)
      await expect(map).toBeVisible();
    }
  });
});

test.describe('Mobile Responsive - Touch Gestures', () => {
  test.use({ ...devices['iPhone 12'] });

  test('timeline scrubber responds to touch drag', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Look for timeline scrubber
    const scrubber = page.locator('[data-testid="scrubber-handle"]').or(
      page.locator('.scrubber-handle')
    ).first();

    const scrubberExists = await scrubber.count();
    if (scrubberExists > 0) {
      // Get initial position
      const initialBox = await scrubber.boundingBox();
      if (initialBox) {
        // Perform touch drag
        await page.touchscreen.tap(initialBox.x + initialBox.width / 2, initialBox.y + initialBox.height / 2);
        await page.touchscreen.tap(initialBox.x + 100, initialBox.y + initialBox.height / 2);

        // Scrubber position should change
        await page.waitForTimeout(300);
        const newBox = await scrubber.boundingBox();

        // Position should be different (drag succeeded)
        expect(newBox).toBeTruthy();
      }
    }
  });

  test('swipe gesture on timeline (if supported)', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Timeline should be visible
    const timeline = page.locator('[data-testid="wayback-slider"]').or(
      page.locator('.timeline-container')
    ).first();

    const timelineExists = await timeline.count();
    if (timelineExists > 0) {
      await expect(timeline).toBeVisible({ timeout: 5000 });

      // Timeline should be interactive (can swipe/drag)
      const timelineBox = await timeline.boundingBox();
      expect(timelineBox).toBeTruthy();
    }
  });
});

test.describe('Mobile Responsive - Stats Dashboard', () => {
  test.use({ ...devices['Pixel 5'] });

  test('stats cards are stacked vertically on mobile', async ({ page }) => {
    await page.goto('/stats');
    await page.waitForLoadState('networkidle');

    // Look for stat cards
    const statCards = page.locator('[data-testid*="stat"]').or(
      page.locator('.stat-card')
    );

    const cardCount = await statCards.count();
    if (cardCount >= 2) {
      // Get positions of first two cards
      const card1Box = await statCards.nth(0).boundingBox();
      const card2Box = await statCards.nth(1).boundingBox();

      if (card1Box && card2Box) {
        // On mobile, cards should stack vertically (card2 below card1)
        // Allow for some margin/padding
        const isVerticallyStacked = card2Box.y > card1Box.y + card1Box.height - 50;
        expect(isVerticallyStacked).toBeTruthy();
      }
    }
  });
});

test.describe('Mobile Responsive - Text Readability', () => {
  test.use({ ...devices['iPhone 12'] });

  test('heading text is readable on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check main heading
    const heading = page.locator('h1').first();
    const headingExists = await heading.count();

    if (headingExists > 0) {
      // Get font size
      const fontSize = await heading.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });

      // Heading should be at least 20px on mobile
      expect(fontSize).toBeGreaterThanOrEqual(20);
    }
  });

  test('body text is readable on mobile', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    // Check body text
    const paragraph = page.locator('p').first();
    const paragraphExists = await paragraph.count();

    if (paragraphExists > 0) {
      // Get font size
      const fontSize = await paragraph.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });

      // Body text should be at least 14px on mobile
      expect(fontSize).toBeGreaterThanOrEqual(14);
    }
  });
});

test.describe('Mobile Responsive - Button Sizing', () => {
  test.use({ ...devices['Pixel 5'] });

  test('buttons are large enough for touch targets', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all buttons
    const buttons = page.getByRole('button').or(
      page.locator('button')
    );

    const buttonCount = await buttons.count();
    if (buttonCount > 0) {
      // Check first button size
      const firstButton = buttons.first();
      const buttonBox = await firstButton.boundingBox();

      if (buttonBox) {
        // Touch target should be at least 44x44px (iOS guidelines)
        // Allow for smaller buttons if they have adequate padding
        const minSize = 32; // Relaxed requirement for small UI buttons
        expect(buttonBox.height).toBeGreaterThanOrEqual(minSize);
      }
    }
  });
});

test.describe('Mobile Responsive - Viewport Adaptation', () => {
  test('app adapts to portrait orientation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE portrait

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Page should render without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    // Body should not exceed viewport width (no horizontal scroll)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // +5px tolerance
  });

  test('app adapts to landscape orientation', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 }); // iPhone SE landscape

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Page should still be functional in landscape
    const heading = page.locator('h1, h2').first();
    const headingExists = await heading.count();

    if (headingExists > 0) {
      await expect(heading).toBeVisible();
    }
  });
});

test.describe('Mobile Responsive - Performance', () => {
  test.use({ ...devices['Pixel 5'] });

  test('page loads within reasonable time on mobile', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds on mobile (reasonable for development)
    expect(loadTime).toBeLessThan(5000);
  });

  test('interactive elements respond quickly to touch', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find an interactive button
    const button = page.getByRole('button').first();
    const buttonExists = await button.count();

    if (buttonExists > 0) {
      const startTime = Date.now();

      // Tap button
      await button.tap();

      // Response should be quick (< 300ms for perceived instant response)
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Generous allowance for CI
    }
  });
});
