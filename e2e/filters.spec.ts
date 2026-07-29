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

  // Regression: /data used to run its own inline filter that only understood
  // type/status/search, so date and year filters silently did nothing there.
  test("the data page filters by year built, not just type/status/search", async ({ page }) => {
    await page.goto("/data");
    const sidebar = page.getByRole("complementary", { name: /filters/i });

    const count = sidebar.getByText(/showing \d+ of \d+ sites/i);
    await expect(count).toBeVisible({ timeout: 30000 });
    const before = (await count.textContent())?.trim() ?? "";

    await sidebar.getByPlaceholder("From year").fill("1900");

    await expect(count).not.toHaveText(before);
  });

  // Same regression class as the year filter above: destruction dates were the
  // other range the old inline /data filter ignored.
  test("the data page filters by destruction date range", async ({ page }) => {
    await page.goto("/data");
    const sidebar = page.getByRole("complementary", { name: /filters/i });

    const count = sidebar.getByText(/showing \d+ of \d+ sites/i);
    await expect(count).toBeVisible({ timeout: 30000 });
    const before = (await count.textContent())?.trim() ?? "";

    await sidebar.getByPlaceholder("From", { exact: true }).fill("2024-01-01");

    await expect(count).not.toHaveText(before);
  });

  test("Clear All restores the unfiltered result set", async ({ page }) => {
    await page.goto("/data");
    const sidebar = page.getByRole("complementary", { name: /filters/i });

    const count = sidebar.getByText(/showing \d+ of \d+ sites/i);
    await expect(count).toBeVisible({ timeout: 30000 });
    const unfiltered = (await count.textContent())?.trim() ?? "";

    await sidebar.getByRole("checkbox").first().check();
    await expect(count).not.toHaveText(unfiltered);

    await sidebar.getByRole("button", { name: /clear all/i }).click();
    await expect(count).toHaveText(unfiltered);
  });

  test("the Dashboard remembers the sidebar filter layout across a reload", async ({ page }) => {
    await page.goto("/dashboard");
    const sidebar = page.getByRole("complementary", { name: /filters/i });

    // Default is the top bar; switching is a remembered per-user preference.
    await expect(sidebar).toHaveCount(0);
    await page.getByRole("button", { name: /switch to sidebar/i }).click();
    await expect(sidebar).toBeVisible();

    await page.reload();

    await expect(sidebar).toBeVisible({ timeout: 30000 });
  });
});
