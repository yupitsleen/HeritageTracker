import { test, expect } from "@playwright/test";

/**
 * E2E — Filter workflows (real browser)
 *
 * The Timeline landing ('/') now renders the faceted filter sidebar: facet options
 * are visible directly (no popover to open). This proves the sidebar's real wiring —
 * applying a filter changes the observable result count — which a redesign must
 * preserve. Component-level behavior is covered by FilterBar.baseline.test.tsx.
 *
 * The sidebar is the <aside aria-label="Filters"> (ARIA role "complementary"), and
 * it only appears once Wayback imagery loads, so we wait on its content.
 */

test.describe("Filter workflows", () => {
  test("the filter sidebar shows facet options directly", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.getByRole("complementary", { name: /filters/i });

    await expect(sidebar.getByRole("heading", { name: /^type$/i })).toBeVisible({ timeout: 30000 });
    // Options are visible without opening anything (the discoverability win).
    await expect(sidebar.getByRole("checkbox").first()).toBeVisible();
  });

  test("applying a type filter changes the result count", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.getByRole("complementary", { name: /filters/i });

    const count = sidebar.getByText(/showing \d+ of \d+ sites/i);
    await expect(count).toBeVisible({ timeout: 30000 });
    const before = (await count.textContent())?.trim() ?? "";

    await sidebar.getByRole("checkbox").first().check();

    // Narrowing to a single type changes the visible result count.
    await expect(count).not.toHaveText(before);
  });
});
