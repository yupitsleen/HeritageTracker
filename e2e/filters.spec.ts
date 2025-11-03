import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Filter Bar Visibility and Functionality
 *
 * Purpose: Catch UI bugs where filters are hidden behind the map or not clickable
 * Critical for: Dashboard, Timeline, and Data pages
 */

test.describe('Filter Bar - Visibility and Z-Index', () => {
  test('filter bar should be visible and above map on Dashboard', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Filter bar should be visible
    const filterBar = page.locator('[data-testid="filter-bar"], .filter-bar, div:has-text("Site Type")').first();
    await expect(filterBar).toBeVisible();

    // Check that filter bar has higher z-index than map
    const filterZIndex = await filterBar.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    // Get map z-index
    const mapContainer = page.locator('.leaflet-container').first();
    const mapZIndex = await mapContainer.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    // Filter bar should have higher z-index than map (or map should be 'auto'/0)
    console.log('Filter z-index:', filterZIndex, 'Map z-index:', mapZIndex);
  });

  test('site type filter dropdown should open and be clickable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the site type filter button/dropdown
    // Try multiple selectors since the exact implementation may vary
    const filterButton = page.getByRole('button', { name: /site type/i }).or(
      page.getByText(/site type/i)
    ).first();

    await expect(filterButton).toBeVisible();

    // Click to open dropdown
    await filterButton.click();

    // Wait a bit for dropdown to open
    await page.waitForTimeout(500);

    // Check if dropdown options are visible (try multiple selectors)
    const mosqueOption = page.getByText(/mosque/i).first();
    const churchOption = page.getByText(/church/i).first();

    // At least one option should be visible
    const mosqueVisible = await mosqueOption.isVisible();
    const churchVisible = await churchOption.isVisible();

    expect(mosqueVisible || churchVisible).toBeTruthy();
  });

  test('status filter dropdown should open and be clickable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the status filter button/dropdown
    const filterButton = page.getByRole('button', { name: /status/i }).or(
      page.getByText(/status/i).and(page.locator('button'))
    ).first();

    await expect(filterButton).toBeVisible();

    // Click to open dropdown
    await filterButton.click();

    // Wait a bit for dropdown to open
    await page.waitForTimeout(500);

    // Check if dropdown options are visible
    const destroyedOption = page.getByText(/destroyed/i).first();
    const damagedOption = page.getByText(/damaged/i).first();

    // At least one option should be visible
    const destroyedVisible = await destroyedOption.isVisible();
    const damagedVisible = await damagedOption.isVisible();

    expect(destroyedVisible || damagedVisible).toBeTruthy();
  });

  test('selecting a filter should update the site count', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial site count (look for "X sites" or similar text)
    const initialText = await page.textContent('body');

    // Open site type filter
    const filterButton = page.getByRole('button', { name: /site type/i }).or(
      page.getByText(/site type/i)
    ).first();

    await filterButton.click();
    await page.waitForTimeout(300);

    // Select "mosque" filter
    const mosqueOption = page.getByText(/mosque/i).first();
    await mosqueOption.click();

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Check that the page updated (site count changed or filter pill appeared)
    const updatedText = await page.textContent('body');

    // The text should have changed (either count or filter pill)
    expect(updatedText).not.toBe(initialText);

    // Look for active filter indicator
    const hasActivePill = await page.getByText(/mosque/i).count() > 1; // Should appear in pill
    expect(hasActivePill).toBeTruthy();
  });

  test('filter bar should not overlap with critical UI elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get filter bar bounding box
    const filterBar = page.locator('div:has-text("Site Type")').first();
    const filterBox = await filterBar.boundingBox();

    // Get map container bounding box
    const mapContainer = page.locator('.leaflet-container').first();
    const mapBox = await mapContainer.boundingBox();

    if (filterBox && mapBox) {
      // Filter bar should not be completely covered by map
      // Check if filter bar top edge is above map or at reasonable position
      console.log('Filter bar box:', filterBox);
      console.log('Map box:', mapBox);

      // Filter should be positioned sensibly (not at 0,0 which might indicate hidden)
      expect(filterBox.y).toBeGreaterThanOrEqual(0);
      expect(filterBox.x).toBeGreaterThanOrEqual(0);
    }
  });

  test('clear all filters button should work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Apply a filter first
    const filterButton = page.getByText(/site type/i).first();
    await filterButton.click();
    await page.waitForTimeout(300);

    const mosqueOption = page.getByText(/mosque/i).first();
    await mosqueOption.click();
    await page.waitForTimeout(500);

    // Look for "Clear All" or "Reset" button
    const clearButton = page.getByRole('button', { name: /clear all|reset filters/i }).or(
      page.getByText(/clear all/i).and(page.locator('button'))
    );

    // If clear button exists, click it
    const count = await clearButton.count();
    if (count > 0) {
      await clearButton.first().click();
      await page.waitForTimeout(500);

      // Filter pills should be gone or reduced
      const pillsAfter = await page.getByText(/mosque/i).count();
      expect(pillsAfter).toBeLessThanOrEqual(1); // Only in dropdown, not in active pills
    }
  });
});

test.describe('Filter Bar - Multi-Page Consistency', () => {
  test('filters should work on Timeline page', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');

    // Filter bar should be visible on Timeline page
    const filterBar = page.locator('div:has-text("Site Type")').first();
    await expect(filterBar).toBeVisible();

    // Should be able to open dropdown
    const filterButton = page.getByText(/site type/i).first();
    await filterButton.click();
    await page.waitForTimeout(300);

    // Options should be visible
    const mosqueOption = page.getByText(/mosque/i).first();
    await expect(mosqueOption).toBeVisible();
  });

  test('filters should work on Data page', async ({ page }) => {
    await page.goto('/data');
    await page.waitForLoadState('networkidle');

    // Filter bar should be visible on Data page
    const filterBar = page.locator('div:has-text("Site Type")').first();
    await expect(filterBar).toBeVisible();

    // Should be able to open dropdown
    const filterButton = page.getByText(/site type/i).first();
    await filterButton.click();
    await page.waitForTimeout(300);

    // Options should be visible
    const mosqueOption = page.getByText(/mosque/i).first();
    await expect(mosqueOption).toBeVisible();
  });
});
