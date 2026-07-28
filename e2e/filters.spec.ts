import { test, expect } from '@playwright/test';

/**
 * E2E — Filter workflows (real browser)
 *
 * The FilterBar's popover/drawer widgets are Headless UI components that only deliver
 * interaction events in a real browser (not jsdom), so the actual
 * "apply a filter → results change" wiring is proven here. Component-level behavior
 * (callbacks, popover contents, 0-count hidden, search debounce) is covered by
 * src/components/FilterBar/FilterBar.baseline.test.tsx.
 *
 * The Timeline landing ('/') renders the FilterBar only after Wayback imagery loads,
 * so each test waits for the type-filter button before interacting.
 */

test.describe('Filter workflows', () => {
  test('user can open the type filter dropdown', async ({ page }) => {
    await page.goto('/');

    const typeButton = page.getByRole('button', { name: /select types/i });
    await expect(typeButton).toBeVisible({ timeout: 30000 });

    await typeButton.click();
    // The type options (checkboxes) become visible in the popover — catches z-index/render bugs.
    await expect(page.getByRole('checkbox').first()).toBeVisible();
  });

  test('applying a type filter changes the result count', async ({ page }) => {
    await page.goto('/');

    const typeButton = page.getByRole('button', { name: /select types/i });
    await expect(typeButton).toBeVisible({ timeout: 30000 });

    const count = page.getByText(/showing \d+ of \d+ sites/i);
    await expect(count).toBeVisible();
    const before = (await count.textContent())?.trim() ?? '';

    await typeButton.click();
    await page.getByRole('checkbox').first().check();

    // Narrowing to a single type changes the visible result count (the observable
    // outcome a redesign must preserve).
    await expect(count).not.toHaveText(before);
  });
});
