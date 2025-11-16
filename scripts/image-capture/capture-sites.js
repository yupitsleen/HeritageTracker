/**
 * Automated Screenshot Generator for Heritage Sites
 *
 * This script uses Playwright to generate before/after satellite imagery
 * for all 70 heritage sites using ESRI Wayback imagery.
 *
 * Before: 2014 (oldest Wayback release)
 * After: 2025 (newest Wayback release)
 *
 * Usage: node scripts/image-capture/capture-sites.js
 */

import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// ESM equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const TEMPLATE_PATH = join(__dirname, 'map-template.html');
const SITES_DATA_PATH = join(__dirname, 'sites-data.json');
const OUTPUT_DIR = join(__dirname, '../../public/images/sites');

// Wayback configuration
const WAYBACK_API_URL = "https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json";

// Map settings
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;
const ZOOM_LEVEL = 17; // Close zoom to show detail

// Crop settings - crop to center 20% of image for tighter focus
const CROP_ENABLED = true;
const CROP_PERCENTAGE = 0.20; // 20% of original size

// ESRI attribution
const ATTRIBUTION = {
  credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  license: "Fair Use - Educational",
  sourceUrl: "https://livingatlas.arcgis.com/"
};

/**
 * Fetch all Wayback releases from ESRI API
 */
async function fetchWaybackReleases() {
  console.log('Fetching Wayback releases from ESRI API...');
  const response = await fetch(WAYBACK_API_URL);

  if (!response.ok) {
    throw new Error(`Wayback API request failed: ${response.status}`);
  }

  const data = await response.json();

  // Transform to array and sort by release number
  const releases = Object.entries(data).map(([releaseNum, item]) => {
    // Extract date from title
    const dateMatch = item.itemTitle.match(/(\d{4}-\d{2}-\d{2})/);
    const releaseDate = dateMatch ? dateMatch[1] : '1970-01-01';

    // Convert tile URL format
    const tileUrl = item.itemURL
      .replace('{level}', '{z}')
      .replace('{row}', '{y}')
      .replace('{col}', '{x}');

    return {
      releaseNum: Number(releaseNum),
      releaseDate,
      tileUrl
    };
  });

  // Sort by date (oldest first)
  releases.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

  console.log(`Found ${releases.length} Wayback releases`);
  console.log(`Oldest: ${releases[0].releaseDate}`);
  console.log(`Newest: ${releases[releases.length - 1].releaseDate}`);

  return releases;
}

/**
 * Load sites from JSON file
 */
async function loadSites() {
  console.log('Loading sites from sites-data.json...');
  const content = await fs.readFile(SITES_DATA_PATH, 'utf-8');
  const sites = JSON.parse(content);
  console.log(`Loaded ${sites.length} sites`);
  return sites;
}

/**
 * Capture screenshot of a site with specific Wayback imagery
 */
async function captureScreenshot(page, site, tileUrl, outputPath) {
  try {
    console.log(`  Capturing: ${site.name} (${site.lat}, ${site.lng})`);

    // Load the template
    await page.goto(`file://${TEMPLATE_PATH}`, { waitUntil: 'networkidle' });

    // Initialize map with site coordinates and tile URL
    await page.evaluate(({ lat, lng, zoom, tileUrl }) => {
      return window.initMap(lat, lng, zoom, tileUrl);
    }, {
      lat: site.lat,
      lng: site.lng,
      zoom: ZOOM_LEVEL,
      tileUrl
    });

    // Take screenshot with optional cropping
    // Calculate crop dimensions (center 60% of image)
    let screenshotOptions = {
      path: outputPath,
      type: 'jpeg',
      quality: 90
    };

    if (CROP_ENABLED) {
      const cropWidth = Math.floor(MAP_WIDTH * CROP_PERCENTAGE);
      const cropHeight = Math.floor(MAP_HEIGHT * CROP_PERCENTAGE);
      const x = Math.floor((MAP_WIDTH - cropWidth) / 2);
      const y = Math.floor((MAP_HEIGHT - cropHeight) / 2);

      screenshotOptions.clip = {
        x,
        y,
        width: cropWidth,
        height: cropHeight
      };
    }

    // Use page.screenshot instead of locator.screenshot for clip to work
    await page.screenshot(screenshotOptions);

    console.log(`  ✓ Saved: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Failed to capture ${site.id}:`, error.message);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Heritage Site Image Capture Script');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Fetch Wayback releases
    const releases = await fetchWaybackReleases();
    const beforeRelease = releases[0]; // Oldest (2014)
    const afterRelease = releases[releases.length - 1]; // Newest (2025)

    console.log('');
    console.log('Selected releases:');
    console.log(`  Before: ${beforeRelease.releaseDate}`);
    console.log(`  After:  ${afterRelease.releaseDate}`);
    console.log('');

    // Load sites
    const sites = await loadSites();

    // Launch browser
    console.log('Launching headless browser...');
    const browser = await chromium.launch({
      headless: true,
      args: ['--disable-web-security'] // Allow CORS for tiles
    });

    const context = await browser.newContext({
      viewport: { width: MAP_WIDTH, height: MAP_HEIGHT }
    });

    const page = await context.newPage();

    // Process each site
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < sites.length; i++) {
      const site = sites[i];
      console.log(`[${i + 1}/${sites.length}] ${site.name}`);

      // Capture "before" image (2014)
      const beforePath = join(OUTPUT_DIR, `${site.id}-before.jpg`);
      const beforeSuccess = await captureScreenshot(page, site, beforeRelease.tileUrl, beforePath);

      if (beforeSuccess) {
        // Small delay between screenshots
        await page.waitForTimeout(500);

        // Capture "after" image (2025)
        const afterPath = join(OUTPUT_DIR, `${site.id}-after.jpg`);
        const afterSuccess = await captureScreenshot(page, site, afterRelease.tileUrl, afterPath);

        if (afterSuccess) {
          successCount++;
        } else {
          failCount++;
        }
      } else {
        failCount++;
      }

      console.log('');
    }

    // Close browser
    await browser.close();

    // Generate attribution file
    const attributionData = {
      credit: ATTRIBUTION.credit,
      license: ATTRIBUTION.license,
      sourceUrl: ATTRIBUTION.sourceUrl,
      beforeDate: beforeRelease.releaseDate,
      afterDate: afterRelease.releaseDate,
      generatedAt: new Date().toISOString(),
      totalSites: sites.length,
      successfulCaptures: successCount,
      failedCaptures: failCount
    };

    await fs.writeFile(
      join(OUTPUT_DIR, 'ATTRIBUTION.json'),
      JSON.stringify(attributionData, null, 2)
    );

    // Summary
    console.log('='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total sites:      ${sites.length}`);
    console.log(`Successful:       ${successCount} (${(successCount / sites.length * 100).toFixed(1)}%)`);
    console.log(`Failed:           ${failCount}`);
    console.log(`Images generated: ${successCount * 2}`);
    console.log(`Output directory: ${OUTPUT_DIR}`);
    console.log('');
    console.log('Next step: Run update-mock-sites.js to update mockSites.ts');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
