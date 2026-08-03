import { test, expect } from "@playwright/test";

/**
 * E2E — User preferences (theme, language/RTL)
 *
 * Both are persisted to localStorage and applied to <html>, so the assertions are
 * on document attributes rather than on any styling — they survive a redesign of
 * the footer, the controls, or the theme palette itself.
 *
 * Run against /data on purpose: these are app-wide preferences, so a page with no
 * settings panel of its own still has to offer them.
 */

test.describe("User preferences", () => {
  test("the theme toggle flips the document theme and is remembered", async ({ page }) => {
    await page.goto("/data");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: /switch to dark mode/i }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");
  });

  test("switching to Arabic flips the document to RTL and is remembered", async ({ page }) => {
    await page.goto("/data");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "ltr");

    await page.getByRole("combobox", { name: /language/i }).selectOption("ar");

    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(html).toHaveAttribute("lang", /^ar/);

    await page.reload();
    await expect(html).toHaveAttribute("dir", "rtl");
  });
});
