import { test, expect } from "@playwright/test";

/**
 * E2E — Export from the data table
 *
 * The exporters themselves are unit-tested; what a redesign can break is the
 * wiring — the format select and Export button actually producing a download.
 * Asserting on the suggested filename proves the chosen format reached the exporter.
 */

test.describe("Export workflows", () => {
  test("exporting the data table downloads a CSV", async ({ page }) => {
    await page.goto("/data");

    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: /export csv/i }).click();

    expect((await download).suggestedFilename()).toMatch(/^heritage-tracker-sites-.*\.csv$/);
  });

  test("choosing GeoJSON exports GeoJSON, not the default format", async ({ page }) => {
    await page.goto("/data");
    await page.getByRole("combobox", { name: /select export format/i }).selectOption("geojson");

    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: /export geojson/i }).click();

    expect((await download).suggestedFilename()).toMatch(/\.geojson$/);
  });
});
