import { Page } from '@playwright/test';

/**
 * Wait for page to be fully loaded and hydrated
 * Includes extra waits for React lazy loading and map initialization
 */
export async function waitForPageReady(page: Page, options?: {
  waitForMap?: boolean;
  waitForTimeline?: boolean;
  timeout?: number;
}) {
  const { waitForMap = false, waitForTimeline = false, timeout = 15000 } = options || {};

  // Wait for network to be idle
  await page.waitForLoadState('networkidle');

  // Give React time to hydrate
  await page.waitForTimeout(2000);

  // Wait for specific elements based on page type
  if (waitForMap) {
    await page.locator('.leaflet-container').first().waitFor({
      state: 'visible',
      timeout
    }).catch(() => {
      console.log('Map container not found within timeout');
    });
  }

  if (waitForTimeline) {
    await page.locator('[data-testid="timeline"], .timeline-scrubber').first().waitFor({
      state: 'visible',
      timeout
    }).catch(() => {
      console.log('Timeline not found within timeout');
    });
  }

  // Additional wait for any async data loading
  await page.waitForTimeout(500);
}

/**
 * Navigate to a page and wait for it to be ready
 */
export async function gotoAndWait(page: Page, url: string, options?: Parameters<typeof waitForPageReady>[1]) {
  await page.goto(url);
  await waitForPageReady(page, options);
}
