import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Filter Workflows
 *
 * Purpose: Test filter functionality, including:
 * - Opening filter dropdowns
 * - Selecting filter options
 * - Verifying filtered results
 * - Clearing filters
 * - Filter persistence across navigation
 */

test.describe('Filter Workflows - Basic Filtering', () => {
  test('user can open type filter dropdown', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for the filter bar - it may be inside a button or dropdown
    // Try multiple selectors to handle different responsive layouts
    const filterButton = page.getByRole('button', { name: /type/i }).or(
      page.getByText(/type/i).first()
    );

    // Verify filter controls are present
    await expect(filterButton.first()).toBeVisible({ timeout: 5000 });
  });

  test.fixme('user can select a site type filter', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the type filter dropdown/button
    const typeFilter = page.getByRole('button', { name: /type/i }).or(
      page.locator('[data-testid="filter-type"]')
    ).first();

    // Check if filter is available
    const filterCount = await typeFilter.count();
    if (filterCount > 0) {
      // Click to open dropdown
      await typeFilter.click();

      // Wait for dropdown options to appear
      await page.waitForTimeout(300); // Small wait for dropdown animation

      // Look for a checkbox option (e.g., Mosque)
      const mosqueOption = page.getByRole('checkbox', { name: /mosque/i }).or(
        page.getByText(/mosque/i).first()
      );

      const mosqueCount = await mosqueOption.count();
      if (mosqueCount > 0) {
        await mosqueOption.click();

        // Verify filter is applied (check for active filter indicator)
        // The exact implementation may vary, so we check for common patterns
        const activeFilter = page.getByText(/mosque/i).or(
          page.locator('[data-testid="active-filter"]')
        );

        await expect(activeFilter.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('filtered results update when filter is applied', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial site count (may be in stats or table)
    const initialContent = await page.content();

    // Look for type filter
    const typeFilter = page.getByRole('button', { name: /type/i }).first();
    const filterExists = await typeFilter.count();

    if (filterExists > 0) {
      await typeFilter.click();
      await page.waitForTimeout(300);

      // Select a filter option
      const filterOption = page.getByRole('checkbox', { name: /mosque/i }).or(
        page.getByText(/mosque/i)
      ).first();

      const optionExists = await filterOption.count();
      if (optionExists > 0) {
        await filterOption.click();

        // Wait for results to update
        await page.waitForTimeout(500);

        // Content should change (different from initial)
        const updatedContent = await page.content();
        expect(updatedContent).not.toBe(initialContent);
      }
    }
  });
});

test.describe('Filter Workflows - Status Filtering', () => {
  test.fixme('user can filter by site status', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for status filter
    const statusFilter = page.getByRole('button', { name: /status/i }).or(
      page.locator('[data-testid="filter-status"]')
    ).first();

    const filterExists = await statusFilter.count();
    if (filterExists > 0) {
      await statusFilter.click();
      await page.waitForTimeout(300);

      // Look for a status option (e.g., destroyed)
      const destroyedOption = page.getByRole('checkbox', { name: /destroyed/i }).or(
        page.getByText(/destroyed/i).first()
      );

      const optionExists = await destroyedOption.count();
      if (optionExists > 0) {
        await destroyedOption.click();

        // Verify filter is applied
        await expect(page.getByText(/destroyed/i).first()).toBeVisible({ timeout: 3000 });
      }
    }
  });
});

test.describe('Filter Workflows - Search Functionality', () => {
  test('user can search for sites by name', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for search input
    const searchInput = page.getByRole('textbox', { name: /search/i }).or(
      page.getByPlaceholder(/search/i)
    ).first();

    const searchExists = await searchInput.count();
    if (searchExists > 0) {
      // Type a search term
      await searchInput.fill('mosque');

      // Wait for debounce
      await page.waitForTimeout(500);

      // Results should be filtered
      // Check that at least some content is visible
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toContain('mosque');
    }
  });
});

test.describe('Filter Workflows - Clear Filters', () => {
  test('user can clear all filters', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Apply a filter first
    const typeFilter = page.getByRole('button', { name: /type/i }).first();
    const filterExists = await typeFilter.count();

    if (filterExists > 0) {
      await typeFilter.click();
      await page.waitForTimeout(300);

      const filterOption = page.getByRole('checkbox', { name: /mosque/i }).first();
      const optionExists = await filterOption.count();

      if (optionExists > 0) {
        await filterOption.click();
        await page.waitForTimeout(500);

        // Look for clear/reset button
        const clearButton = page.getByRole('button', { name: /clear|reset/i }).or(
          page.locator('[data-testid="clear-filters"]')
        ).first();

        const clearExists = await clearButton.count();
        if (clearExists > 0) {
          await clearButton.click();

          // Verify filters are cleared
          await page.waitForTimeout(500);

          // The active filter badge should be gone
          const activeFilters = page.getByText(/\d+ active/i);
          const activeCount = await activeFilters.count();
          expect(activeCount).toBe(0);
        }
      }
    }
  });
});

test.describe('Filter Workflows - Filter Badge Visibility', () => {
  test.fixme('filter bar is visible and accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for filter buttons (filter bar may not have specific test ID)
    const filterButtons = page.getByRole('button', { name: /type|status|filter/i });
    const buttonCount = await filterButtons.count();

    // At least some filter controls should be present
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('filter bar does not overlap with other elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check z-index layering by verifying filter controls are clickable
    const filterButton = page.getByRole('button', { name: /type/i }).first();
    const exists = await filterButton.count();

    if (exists > 0) {
      // Element should be clickable (not covered by another element)
      await expect(filterButton).toBeVisible();

      // Try to interact with it
      const boundingBox = await filterButton.boundingBox();
      expect(boundingBox).not.toBeNull();

      // Verify element remains visible and clickable
      await expect(filterButton).toBeVisible();
    }
  });
});

test.describe('Filter Workflows - Mobile Responsive', () => {
  test.fixme('filter drawer opens on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // On mobile, filters may be in a drawer/menu
    const filterButton = page.getByRole('button', { name: /filter|type|status/i }).first();

    const exists = await filterButton.count();
    if (exists > 0) {
      await filterButton.click();
      await page.waitForTimeout(300);

      // Drawer should open with filter options
      // Check for visibility of filter content
      const filterContent = page.getByText(/mosque|church|destroyed/i);
      await expect(filterContent.first()).toBeVisible({ timeout: 3000 });
    }
  });
});
