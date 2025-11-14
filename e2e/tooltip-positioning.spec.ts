import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Tooltip Positioning Bug
 *
 * BUG: Info icon tooltip renders far away on first hover, but correctly on subsequent hovers
 *
 * ROOT CAUSE: On first hover, tooltip dimensions are not yet available when positioning logic runs
 *
 * FIX: Use ResizeObserver to detect when tooltip has been laid out with accurate dimensions
 *
 * This test verifies the fix by checking tooltip positions are consistent across multiple hovers
 */

test.describe('Tooltip Positioning - Timeline Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the actual Timeline page where the bug occurs
    await page.goto('/timeline');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Wait a bit for components to mount
    await page.waitForTimeout(500);
  });

  test('Timeline info icon tooltip renders consistently on first and subsequent hovers', async ({ page }) => {
    // Find any info icon with cursor-help class (these use InfoIconWithTooltip)
    const infoIcons = page.locator('svg.cursor-help');

    // Get the first one (timeline info icon)
    const infoIcon = infoIcons.first();

    // Verify icon exists
    await expect(infoIcon).toBeVisible();

    // Get icon position for reference
    const iconBox = await infoIcon.boundingBox();
    console.log('Icon position:', iconBox);

    // === FIRST HOVER ===
    await infoIcon.hover();

    // Wait for ANY tooltip to appear (they have bg-gray-900 class)
    const tooltip = page.locator('.bg-gray-900.text-white').first();
    await expect(tooltip).toBeVisible({ timeout: 2000 });

    // Get position on first hover
    const firstBox = await tooltip.boundingBox();
    expect(firstBox).not.toBeNull();
    console.log('First hover - Tooltip position:', firstBox);

    // Tooltip should not be at origin
    expect(firstBox!.x).toBeGreaterThan(0);
    expect(firstBox!.y).toBeGreaterThan(0);

    // Calculate distance from icon on first hover
    const firstDistance = Math.sqrt(
      Math.pow(firstBox!.x - iconBox!.x, 2) +
      Math.pow(firstBox!.y - iconBox!.y, 2)
    );
    console.log('First hover - Distance from icon:', firstDistance);

    // Move mouse away
    await page.mouse.move(0, 0);
    await expect(tooltip).not.toBeVisible();

    // Wait a moment
    await page.waitForTimeout(500);

    // === SECOND HOVER ===
    await infoIcon.hover();
    await expect(tooltip).toBeVisible({ timeout: 2000 });

    const secondBox = await tooltip.boundingBox();
    expect(secondBox).not.toBeNull();
    console.log('Second hover - Tooltip position:', secondBox);

    // Calculate distance from icon on second hover
    const secondDistance = Math.sqrt(
      Math.pow(secondBox!.x - iconBox!.x, 2) +
      Math.pow(secondBox!.y - iconBox!.y, 2)
    );
    console.log('Second hover - Distance from icon:', secondDistance);

    // CRITICAL: Positions should match EXACTLY (within 2px for sub-pixel rendering)
    const xDiff = Math.abs(secondBox!.x - firstBox!.x);
    const yDiff = Math.abs(secondBox!.y - firstBox!.y);

    console.log('Position difference - X:', xDiff, 'Y:', yDiff);

    // If bug exists: first hover will be far (>100px diff), second will be correct
    expect(xDiff, `X position changed by ${xDiff}px between hovers`).toBeLessThan(2);
    expect(yDiff, `Y position changed by ${yDiff}px between hovers`).toBeLessThan(2);
  });

  test('Info icon tooltip appears near the icon (not far away)', async ({ page }) => {
    const infoIcon = page.locator('svg.cursor-help').first();
    await expect(infoIcon).toBeVisible();

    const iconBox = await infoIcon.boundingBox();
    expect(iconBox).not.toBeNull();

    await infoIcon.hover();

    const tooltip = page.locator('.bg-gray-900.text-white').first();
    await expect(tooltip).toBeVisible({ timeout: 2000 });

    const tooltipBox = await tooltip.boundingBox();
    expect(tooltipBox).not.toBeNull();

    // Calculate distance between icon and tooltip
    const distance = Math.sqrt(
      Math.pow(tooltipBox!.x - iconBox!.x, 2) +
      Math.pow(tooltipBox!.y - iconBox!.y, 2)
    );

    // Tooltip should be within 500px of icon (reasonable proximity)
    // The tooltip is positioned above/below the icon, so distance includes its height
    // If bug exists, it would render far away (> 700px) or inconsistently
    expect(distance).toBeLessThan(500);
  });
});
