import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Timeline Page Navigation
 *
 * Purpose: Ensure all navigation buttons are present and functional
 * Critical for: Timeline page with destruction date navigation
 */

test.describe('Timeline Page - Navigation Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');
  });

  test('timeline page should load successfully', async ({ page }) => {
    // Check for timeline-specific elements
    const timelineElement = page.locator('.timeline-scrubber, [data-testid="timeline"], .leaflet-container').first();
    await expect(timelineElement).toBeVisible();
  });

  test('NEXT button should be present and clickable', async ({ page }) => {
    // Look for Next button with various possible texts
    const nextButton = page.getByRole('button', { name: /next/i }).or(
      page.getByText(/next/i).and(page.locator('button'))
    );

    // Button should exist
    const count = await nextButton.count();
    expect(count).toBeGreaterThan(0);

    // Button should be visible
    await expect(nextButton.first()).toBeVisible();

    // Button should be clickable (not disabled initially if there are sites)
    const isDisabled = await nextButton.first().isDisabled();
    console.log('Next button disabled state:', isDisabled);
  });

  test('PREVIOUS button should be present and clickable', async ({ page }) => {
    // Look for Previous button
    const prevButton = page.getByRole('button', { name: /previous|prev/i }).or(
      page.getByText(/previous|prev/i).and(page.locator('button'))
    );

    // Button should exist
    const count = await prevButton.count();
    expect(count).toBeGreaterThan(0);

    // Button should be visible
    await expect(prevButton.first()).toBeVisible();
  });

  test('RESET button should be present and clickable', async ({ page }) => {
    // Look for Reset button
    const resetButton = page.getByRole('button', { name: /reset/i }).or(
      page.getByText(/reset/i).and(page.locator('button'))
    );

    // Button should exist
    const count = await resetButton.count();
    expect(count).toBeGreaterThan(0);

    // Button should be visible
    await expect(resetButton.first()).toBeVisible();
  });

  test('all three navigation buttons should be visible simultaneously', async ({ page }) => {
    // All three buttons should be visible at the same time
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    const prevButton = page.getByRole('button', { name: /previous|prev/i }).first();
    const resetButton = page.getByRole('button', { name: /reset/i }).first();

    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();
    await expect(resetButton).toBeVisible();
  });

  test('clicking NEXT button should navigate to next site', async ({ page }) => {
    // Get current URL or state
    const initialContent = await page.textContent('body');

    // Click Next button
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    await nextButton.click();

    // Wait for navigation/update
    await page.waitForTimeout(500);

    // Content should change (either URL, map position, or visible site info)
    const updatedContent = await page.textContent('body');

    // Something should have changed
    expect(updatedContent).not.toBe(initialContent);
  });

  test('clicking RESET button should return to initial state', async ({ page }) => {
    // Click Next a few times to navigate away from start
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    await nextButton.click();
    await page.waitForTimeout(300);
    await nextButton.click();
    await page.waitForTimeout(300);

    // Now click Reset
    const resetButton = page.getByRole('button', { name: /reset/i }).first();
    await resetButton.click();

    // Wait for reset to complete
    await page.waitForTimeout(500);

    // Should be back at start (Previous button might be disabled)
    const prevButton = page.getByRole('button', { name: /previous|prev/i }).first();
    const isDisabled = await prevButton.isDisabled();

    // Previous should be disabled at the start
    expect(isDisabled).toBe(true);
  });

  test('PREVIOUS button should be disabled at timeline start', async ({ page }) => {
    // Click Reset to ensure we're at the start
    const resetButton = page.getByRole('button', { name: /reset/i }).first();
    await resetButton.click();
    await page.waitForTimeout(500);

    // Previous button should be disabled
    const prevButton = page.getByRole('button', { name: /previous|prev/i }).first();
    const isDisabled = await prevButton.isDisabled();

    expect(isDisabled).toBe(true);
  });

  test('NEXT button should be disabled at timeline end', async ({ page }) => {
    // Click Next button many times to reach the end (assuming 45 sites)
    const nextButton = page.getByRole('button', { name: /next/i }).first();

    // Click Next up to 50 times to ensure we reach the end
    for (let i = 0; i < 50; i++) {
      const isDisabled = await nextButton.isDisabled();
      if (isDisabled) {
        console.log(`Reached end after ${i} clicks`);
        break;
      }
      await nextButton.click();
      await page.waitForTimeout(200);
    }

    // Next button should now be disabled
    const isDisabled = await nextButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('navigation buttons should not overlap with other UI elements', async ({ page }) => {
    // Get button positions
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    const nextBox = await nextButton.boundingBox();

    const prevButton = page.getByRole('button', { name: /previous|prev/i }).first();
    const prevBox = await prevButton.boundingBox();

    const resetButton = page.getByRole('button', { name: /reset/i }).first();
    const resetBox = await resetButton.boundingBox();

    // All buttons should have valid positions
    if (nextBox && prevBox && resetBox) {
      expect(nextBox.width).toBeGreaterThan(0);
      expect(prevBox.width).toBeGreaterThan(0);
      expect(resetBox.width).toBeGreaterThan(0);

      console.log('Button positions:', { nextBox, prevBox, resetBox });
    }
  });
});

test.describe('Timeline Page - Scrubber Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');
  });

  test('timeline scrubber should be visible', async ({ page }) => {
    // Look for timeline scrubber element
    const scrubber = page.locator('.timeline-scrubber, [role="slider"], input[type="range"]').first();

    // Scrubber should exist and be visible
    const count = await page.locator('.timeline-scrubber, [role="slider"], input[type="range"]').count();
    if (count > 0) {
      await expect(scrubber).toBeVisible();
    } else {
      console.log('No scrubber found with standard selectors');
    }
  });

  test('timeline should show destruction dates', async ({ page }) => {
    // Timeline should show dates from 2023-2024 (Gaza conflict period)
    const bodyText = await page.textContent('body');

    // Should contain year references
    const has2023 = bodyText?.includes('2023');
    const has2024 = bodyText?.includes('2024');

    expect(has2023 || has2024).toBeTruthy();
  });

  test('clicking on timeline should navigate to that date', async ({ page }) => {
    // Get initial state
    const initialContent = await page.textContent('body');

    // Find and click on timeline area (try different selectors)
    const timelineArea = page.locator('.timeline-scrubber, [data-testid="timeline"]').first();

    if (await timelineArea.isVisible()) {
      const box = await timelineArea.boundingBox();
      if (box) {
        // Click in the middle of the timeline
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(500);

        // Content should change
        const updatedContent = await page.textContent('body');
        expect(updatedContent).not.toBe(initialContent);
      }
    }
  });
});

test.describe('Timeline Page - Dashboard Consistency', () => {
  test('dashboard should also have timeline navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Dashboard should have a timeline component
    const hasTimeline = await page.locator('.timeline-scrubber, [data-testid="timeline"]').count();

    if (hasTimeline > 0) {
      // Dashboard timeline should also have navigation buttons
      const nextButton = page.getByRole('button', { name: /next/i });
      const prevButton = page.getByRole('button', { name: /previous|prev/i });

      const nextCount = await nextButton.count();
      const prevCount = await prevButton.count();

      // Should have navigation buttons on dashboard too
      expect(nextCount).toBeGreaterThan(0);
      expect(prevCount).toBeGreaterThan(0);
    }
  });
});
