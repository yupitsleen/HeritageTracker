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

  test('Tooltip has proper box shape (not a long horizontal line)', async ({ page }) => {
    const infoIcon = page.locator('svg.cursor-help').first();
    await expect(infoIcon).toBeVisible();

    await infoIcon.hover();

    const tooltip = page.locator('.bg-gray-900.text-white').first();
    await expect(tooltip).toBeVisible({ timeout: 2000 });

    const box = await tooltip.boundingBox();
    expect(box).not.toBeNull();

    console.log('Tooltip dimensions:', { width: box!.width, height: box!.height });

    // Calculate aspect ratio (width / height)
    const aspectRatio = box!.width / box!.height;
    console.log('Tooltip aspect ratio (width/height):', aspectRatio);

    // A nicely proportioned rectangle should have:
    // - Width < 320px (max-w-80 = 320px)
    // - Aspect ratio between 1:1 and 8:1 (not a long horizontal line)
    // - If aspect ratio > 10, it's a single horizontal line (BAD)
    expect(box!.width, 'Tooltip width should respect max-w-80 (320px)').toBeLessThanOrEqual(320);
    expect(aspectRatio, 'Tooltip should not be a long horizontal line (aspect ratio should be < 10)').toBeLessThan(10);

    // Height should be reasonable (at least 24px for text + padding)
    expect(box!.height, 'Tooltip should have reasonable height for wrapped text').toBeGreaterThan(24);
  });
});

test.describe('Tooltip Shape - Dashboard Data Table', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard where data table tooltip issue is worst
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('CRITICAL: Data table info icon tooltip wraps text properly (not one long line)', async ({ page }) => {
    // Find the data table info icon
    // It should be near "Heritage Sites" text
    const infoIcons = page.locator('svg.cursor-help');

    // Find the one in the data table header
    const tableInfoIcon = infoIcons.nth(1); // Second info icon should be in the table

    await expect(tableInfoIcon).toBeVisible();

    await tableInfoIcon.hover();

    const tooltip = page.locator('.bg-gray-900.text-white').first();
    await expect(tooltip).toBeVisible({ timeout: 2000 });

    const box = await tooltip.boundingBox();
    expect(box).not.toBeNull();

    console.log('Data table tooltip dimensions:', { width: box!.width, height: box!.height });

    const aspectRatio = box!.width / box!.height;
    console.log('Data table tooltip aspect ratio:', aspectRatio);

    // CRITICAL TEST: Tooltip should wrap into multiple lines
    // If it's rendering as "Click any row to view full site details, sources, and images"
    // in one line, width will be ~800px and height will be ~32px (aspect ratio ~25)

    // Expected: Text wraps into 2-3 lines, width ~250-320px, height ~60-80px (aspect ratio ~3-5)
    expect(box!.width, 'Tooltip should not stretch to full text width').toBeLessThanOrEqual(320);
    expect(aspectRatio, 'Tooltip must wrap text (not be a single horizontal line)').toBeLessThan(8);

    // If wrapping properly, height should be at least 40px (2+ lines)
    expect(box!.height, 'Tooltip should have multiple lines of text').toBeGreaterThan(40);
  });

  test('Tooltip respects max-width constraint', async ({ page }) => {
    const infoIcons = page.locator('svg.cursor-help');

    // Test all info icons on the page
    const count = await infoIcons.count();
    console.log(`Found ${count} info icons on dashboard`);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const icon = infoIcons.nth(i);
      await icon.hover();

      const tooltip = page.locator('.bg-gray-900.text-white').first();
      await expect(tooltip).toBeVisible({ timeout: 2000 });

      const box = await tooltip.boundingBox();
      expect(box).not.toBeNull();

      console.log(`Icon ${i} - Tooltip: ${box!.width}px x ${box!.height}px`);

      // All tooltips should respect max-w-80 (320px)
      expect(box!.width, `Tooltip ${i} should not exceed max-width`).toBeLessThanOrEqual(330); // 10px tolerance for borders

      // Move mouse away
      await page.mouse.move(0, 0);
      await page.waitForTimeout(200);
    }
  });
});
