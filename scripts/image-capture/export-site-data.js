/**
 * Export site data to JSON for image capture script
 * Run this first: node scripts/image-capture/export-site-data.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MOCK_SITES_PATH = join(__dirname, '../../src/data/mockSites.ts');
const OUTPUT_PATH = join(__dirname, 'sites-data.json');

async function main() {
  console.log('Exporting site data...');

  const content = await fs.readFile(MOCK_SITES_PATH, 'utf-8');

  // Extract site objects
  const sites = [];
  const siteMatches = content.matchAll(/\{[\s\S]*?id:\s*["']([^"']+)["'][\s\S]*?name:\s*["']([^"']+)["'][\s\S]*?coordinates:\s*\[([^,]+),\s*([^\]]+)\][\s\S]*?\},?\s*(?=\{|$)/g);

  for (const match of siteMatches) {
    sites.push({
      id: match[1].trim(),
      name: match[2].trim(),
      lat: parseFloat(match[3].trim()),
      lng: parseFloat(match[4].trim())
    });
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(sites, null, 2));

  console.log(`✓ Exported ${sites.length} sites to ${OUTPUT_PATH}`);
  console.log('Now run: node scripts/image-capture/capture-sites.js');
}

main();
