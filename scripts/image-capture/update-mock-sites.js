/**
 * Update mockSites.ts with Image URLs
 *
 * This script reads the generated images and updates mockSites.ts
 * to uncomment and populate the images property for each site.
 *
 * Usage: node scripts/image-capture/update-mock-sites.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// ESM equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const MOCK_SITES_PATH = join(__dirname, '../../src/data/mockSites.ts');
const IMAGES_DIR = join(__dirname, '../../public/images/sites');
const ATTRIBUTION_PATH = join(IMAGES_DIR, 'ATTRIBUTION.json');

/**
 * Check which images exist for each site
 */
async function getAvailableImages() {
  const files = await fs.readdir(IMAGES_DIR);
  const imageMap = new Map();

  for (const file of files) {
    if (!file.endsWith('.jpg')) continue;

    // Extract site ID and type (before/after)
    const match = file.match(/^(.+)-(before|after)\.jpg$/);
    if (!match) continue;

    const [, siteId, type] = match;

    if (!imageMap.has(siteId)) {
      imageMap.set(siteId, {});
    }

    imageMap.get(siteId)[type] = `/images/sites/${file}`;
  }

  return imageMap;
}

/**
 * Load attribution data
 */
async function loadAttribution() {
  try {
    const content = await fs.readFile(ATTRIBUTION_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Warning: Could not load ATTRIBUTION.json, using defaults');
    return {
      credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
      license: "Fair Use - Educational",
      sourceUrl: "https://www.arcgis.com/home/item.html?id=08b4d8a8c0c44c559e021deae91f3a85",
      beforeDate: "2014",
      afterDate: "2025"
    };
  }
}

/**
 * Generate image block for a site
 */
function generateImageBlock(siteId, images, attribution) {
  const lines = [];
  lines.push('    images: {');

  if (images.before) {
    lines.push('      before: {');
    lines.push(`        url: "${images.before}",`);
    lines.push(`        credit: "${attribution.credit}",`);
    lines.push(`        license: "${attribution.license}",`);
    lines.push(`        sourceUrl: "${attribution.sourceUrl}",`);
    lines.push(`        date: "${attribution.beforeDate}",`);
    lines.push(`        description: "Satellite imagery from ${attribution.beforeDate}"`);
    lines.push('      },');
  }

  if (images.after) {
    lines.push('      after: {');
    lines.push(`        url: "${images.after}",`);
    lines.push(`        credit: "${attribution.credit}",`);
    lines.push(`        license: "${attribution.license}",`);
    lines.push(`        sourceUrl: "${attribution.sourceUrl}",`);
    lines.push(`        date: "${attribution.afterDate}",`);
    lines.push(`        description: "Satellite imagery from ${attribution.afterDate}"`);
    lines.push('      }');
  }

  lines.push('    },');

  return lines.join('\n');
}

/**
 * Update mockSites.ts file
 */
async function updateMockSites(imageMap, attribution) {
  console.log('Reading mockSites.ts...');
  let content = await fs.readFile(MOCK_SITES_PATH, 'utf-8');

  let updatedCount = 0;
  let skippedCount = 0;

  // Process each site
  for (const [siteId, images] of imageMap.entries()) {
    console.log(`Processing site: ${siteId}`);

    // Find the site block
    const siteRegex = new RegExp(
      `(\\{\\s*id:\\s*["']${siteId}["'][\\s\\S]*?)` + // Start of site object
      `(\\s*// images: \\{[\\s\\S]*?// \\},?\\s*)` + // Commented image block
      `([\\s\\S]*?sources:)`, // Before sources
      'g'
    );

    const match = siteRegex.exec(content);

    if (match) {
      // Replace commented block with actual images
      const imageBlock = generateImageBlock(siteId, images, attribution);
      const replacement = `${match[1]}\n${imageBlock}\n    ${match[3]}`;

      content = content.replace(siteRegex, replacement);
      updatedCount++;
      console.log(`  ✓ Updated ${siteId}`);
    } else {
      // Try to find site without commented image block
      // and insert images before sources
      const insertRegex = new RegExp(
        `(\\{\\s*id:\\s*["']${siteId}["'][\\s\\S]*?)(\\s*sources:)`,
        'g'
      );

      const insertMatch = insertRegex.exec(content);
      if (insertMatch) {
        const imageBlock = generateImageBlock(siteId, images, attribution);
        const replacement = `${insertMatch[1]}\n${imageBlock}\n    ${insertMatch[2]}`;

        content = content.replace(insertRegex, replacement);
        updatedCount++;
        console.log(`  ✓ Inserted images for ${siteId}`);
      } else {
        skippedCount++;
        console.log(`  ✗ Could not find site ${siteId}`);
      }
    }
  }

  // Write updated content
  console.log('');
  console.log('Writing updated mockSites.ts...');
  await fs.writeFile(MOCK_SITES_PATH, content, 'utf-8');

  return { updatedCount, skippedCount };
}

/**
 * Main execution function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Update mockSites.ts with Image URLs');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Get available images
    const imageMap = await getAvailableImages();
    console.log(`Found images for ${imageMap.size} sites`);
    console.log('');

    // Load attribution
    const attribution = await loadAttribution();

    // Update mockSites.ts
    const { updatedCount, skippedCount } = await updateMockSites(imageMap, attribution);

    // Summary
    console.log('');
    console.log('='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`Sites with images: ${imageMap.size}`);
    console.log(`Updated:           ${updatedCount}`);
    console.log(`Skipped:           ${skippedCount}`);
    console.log('');
    console.log('✓ mockSites.ts has been updated!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
