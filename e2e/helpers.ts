import { Page } from '@playwright/test';

/**
 * Wait for page to be fully loaded and hydrated
 * Uses event-driven waits instead of arbitrary timeouts
 */
export async function waitForPageReady(page: Page, options?: {
  waitForMap?: boolean;
  waitForTimeline?: boolean;
  timeout?: number;
}) {
  const { waitForMap = false, waitForTimeline = false, timeout = 10000 } = options || {};

  // Wait for network to be idle
  await page.waitForLoadState('networkidle');

  // Wait for React hydration by checking for interactive elements
  await page.locator('body').waitFor({ state: 'visible', timeout: 5000 });

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
    // Timeline page uses lazy loading, give it more time
    await page.locator('button:has-text("Next"), button:has-text("Previous"), .leaflet-container').first().waitFor({
      state: 'visible',
      timeout: 15000
    }).catch(() => {
      console.log('Timeline controls not found within timeout');
    });
  }
}

/**
 * Navigate to a page and wait for it to be ready
 */
export async function gotoAndWait(page: Page, url: string, options?: Parameters<typeof waitForPageReady>[1]) {
  await page.goto(url);
  await waitForPageReady(page, options);
}
