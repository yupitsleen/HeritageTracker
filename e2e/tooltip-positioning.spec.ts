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

    // CRITICAL: Positions should match EXACTLY (within 5px tolerance)
    // Note: Small Y differences (2-5px) can occur due to text wrapping changes
    const xDiff = Math.abs(secondBox!.x - firstBox!.x);
    const yDiff = Math.abs(secondBox!.y - firstBox!.y);

    console.log('Position difference - X:', xDiff, 'Y:', yDiff);

    // If bug exists: first hover will be far (>100px diff), second will be correct
    expect(xDiff, `X position changed by ${xDiff}px between hovers`).toBeLessThan(2);
    expect(yDiff, `Y position changed by ${yDiff}px between hovers`).toBeLessThan(6);
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

  test('Tooltip has proper box shape (not too horizontal or too vertical)', async ({ page }) => {
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
    // - Width ≤ 288px (max-w-[18rem] = 288px)
    // - Aspect ratio between 0.5:1 and 8:1 (not too tall/narrow, not too wide/flat)
    // - If aspect ratio > 10, it's a long horizontal line (BAD)
    // - If aspect ratio < 0.5, it's a tall vertical line (BAD)
    expect(box!.width, 'Tooltip width should respect max-w-[18rem] (288px)').toBeLessThanOrEqual(292); // 4px tolerance
    expect(aspectRatio, 'Tooltip should not be a long horizontal line (aspect ratio should be < 8)').toBeLessThan(8);
    expect(aspectRatio, 'Tooltip should not be too tall and narrow (aspect ratio should be > 0.5)').toBeGreaterThan(0.5);

    // Height should be reasonable (at least 24px for text + padding)
    expect(box!.height, 'Tooltip should have reasonable height for wrapped text').toBeGreaterThan(24);
  });
});

test.describe('Tooltip Padding - FilterBar Status Button', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard where FilterBar is visible
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('CRITICAL: FilterBar status button tooltip has reasonable padding', async ({ page }) => {
    // Find the "Select status..." button specifically
    const statusButton = page.locator('button:has-text("Select status")').first();

    await expect(statusButton).toBeVisible({ timeout: 2000 });

    // Hover over the status button
    await statusButton.hover();

    // Wait for tooltip to appear
    const tooltip = page.locator('.bg-gray-900.text-white').first();
    await expect(tooltip).toBeVisible({ timeout: 2000 });

    const box = await tooltip.boundingBox();
    expect(box).not.toBeNull();

    const tooltipText = (await tooltip.textContent()) || '';
    console.log(`\nStatus tooltip text: "${tooltipText}"`);
    console.log(`Status tooltip dimensions: ${Math.round(box!.width)}px x ${Math.round(box!.height)}px`);

    // Measure actual text content width using browser APIs
    const textMetrics = await tooltip.evaluate((el) => {
      // Get computed style
      const computedStyle = window.getComputedStyle(el);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const paddingRight = parseFloat(computedStyle.paddingRight);

      // Create a temporary span with same font properties to measure text width
      const span = document.createElement('span');
      span.style.font = computedStyle.font;
      span.style.fontSize = computedStyle.fontSize;
      span.style.fontFamily = computedStyle.fontFamily;
      span.style.fontWeight = computedStyle.fontWeight;
      span.style.letterSpacing = computedStyle.letterSpacing;
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'nowrap';
      span.textContent = el.textContent;

      document.body.appendChild(span);
      const textWidth = span.getBoundingClientRect().width;
      document.body.removeChild(span);

      return {
        textWidth,
        paddingLeft,
        paddingRight,
        containerWidth: el.getBoundingClientRect().width,
        containerHeight: el.getBoundingClientRect().height
      };
    });

    console.log(`Text width (unwrapped): ${Math.round(textMetrics.textWidth)}px`);
    console.log(`Container width: ${Math.round(textMetrics.containerWidth)}px`);
    console.log(`Padding: ${Math.round(textMetrics.paddingLeft)}px + ${Math.round(textMetrics.paddingRight)}px = ${Math.round(textMetrics.paddingLeft + textMetrics.paddingRight)}px`);

    const minRequiredWidth = textMetrics.textWidth + textMetrics.paddingLeft + textMetrics.paddingRight;
    console.log(`Min required width (single line): ${Math.round(minRequiredWidth)}px`);

    // Take screenshot to inspect visually
    await page.screenshot({ path: 'test-results/status-tooltip-padding.png' });

    // For wrapped tooltips: if tooltip is at max-width but only 2 lines tall,
    // check if it's actually using the width efficiently
    if (textMetrics.containerWidth >= 319 && textMetrics.containerHeight < 65) {
      console.log('⚠️  Tooltip at max-width (320px) with only 2 lines - checking width efficiency');

      // For a 2-line tooltip, estimate the width each line would need
      // If text wraps into 2 lines, each line should be roughly half the text
      // A well-sized tooltip should have lines that are reasonably balanced
      const estimatedLineWidth = textMetrics.textWidth / 2 + textMetrics.paddingLeft + textMetrics.paddingRight;
      console.log(`Estimated width for 2-line wrap: ~${Math.round(estimatedLineWidth)}px`);

      const excessWidth = textMetrics.containerWidth - estimatedLineWidth;
      console.log(`Excess width: ${Math.round(excessWidth)}px`);

      // CRITICAL: For short tooltips (<40 chars), if wrapping to 2 lines,
      // tooltip shouldn't be much wider than half the text width + padding
      // This catches cases where w-max isn't working and tooltip stretches unnecessarily
      if (tooltipText.length < 65) {
        expect(
          excessWidth,
          `Wrapped tooltip has ${Math.round(excessWidth)}px excessive width (${Math.round(textMetrics.containerWidth)}px container vs ~${Math.round(estimatedLineWidth)}px needed for balanced 2-line wrap)`
        ).toBeLessThanOrEqual(40);
      }
    }
  });

  test('FilterBar tooltips padding scan (all buttons)', async ({ page }) => {
    // Scan ALL buttons with cursor-help class to find padding issues
    const helpCursors = page.locator('.cursor-help, button[aria-label]');
    const count = await helpCursors.count();

    console.log(`\nFound ${count} potential tooltip triggers on dashboard`);

    let excessivePaddingCount = 0;
    const problematicTooltips: string[] = [];

    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = helpCursors.nth(i);

      try {
        await element.hover({ timeout: 1000 });

        const tooltip = page.locator('.bg-gray-900.text-white').first();
        const tooltipVisible = await tooltip.isVisible({ timeout: 500 }).catch(() => false);

        if (!tooltipVisible) {
          await page.mouse.move(0, 0);
          continue;
        }

        const box = await tooltip.boundingBox();
        if (!box) {
          await page.mouse.move(0, 0);
          continue;
        }

        const tooltipText = (await tooltip.textContent()) || '';
        const textLength = tooltipText.length;

        // Calculate expected width
        // For text-xs (12px font), average character is ~6-7px wide
        const charWidth = 6.5;
        const estimatedTextWidth = textLength * charWidth;
        const horizontalPadding = 24; // px-3 = 12px left + 12px right

        const actualWidth = box.width;

        console.log(`\n[${i}] "${tooltipText.substring(0, 50)}${textLength > 50 ? '...' : ''}"`);
        console.log(`    Chars: ${textLength}, Expected: ~${Math.round(estimatedTextWidth + horizontalPadding)}px`);
        console.log(`    Actual width: ${Math.round(actualWidth)}px`);

        // For short text (<= 40 chars), tooltip shouldn't be much wider than needed
        if (textLength <= 40) {
          const singleLineWidth = estimatedTextWidth + horizontalPadding;
          const widthRatio = actualWidth / singleLineWidth;
          const excessWidth = actualWidth - singleLineWidth;

          console.log(`    Width ratio: ${widthRatio.toFixed(2)}, Excess: ${Math.round(excessWidth)}px`);

          // STRICT CHECK: Flag any tooltip with >30px excess width for short text
          // This catches cases where w-max isn't working and tooltip stretches unnecessarily
          if (excessWidth > 30 && textLength < 30) {
            console.log(`    ⚠️  EXCESSIVE PADDING: ${Math.round(excessWidth)}px extra width!`);
            excessivePaddingCount++;
            problematicTooltips.push(`"${tooltipText}" (${Math.round(actualWidth)}px vs ${Math.round(singleLineWidth)}px expected, ${Math.round(excessWidth)}px excess)`);
          }
        }

        await page.mouse.move(0, 0);
        await page.waitForTimeout(100);
      } catch {
        // Skip elements that can't be hovered
        continue;
      }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Tooltips scanned: ${Math.min(count, 10)}`);
    console.log(`Excessive padding found: ${excessivePaddingCount}`);

    if (problematicTooltips.length > 0) {
      console.log(`\nProblematic tooltips:`);
      problematicTooltips.forEach(t => console.log(`  - ${t}`));
    }

    // Fail test if we find excessive padding
    expect(
      excessivePaddingCount,
      `Found ${excessivePaddingCount} tooltips with excessive padding`
    ).toBe(0);
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
