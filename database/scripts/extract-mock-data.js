/**
 * Extract mock data from TypeScript to JSON
 *
 * This script safely extracts mockSites.ts data and converts it to JSON
 * Avoids using eval() by actually importing the TypeScript module
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function extractMockData() {
  try {
    // Import the TypeScript module directly (Vite/Node 18+ supports .ts imports)
    // For better compatibility, we'll use a different approach: read and parse with a proper parser
    const { mockSites } = await import('../../src/data/mockSites.ts');

    if (!mockSites || !Array.isArray(mockSites)) {
      throw new Error('mockSites is not an array or not found');
    }

    console.log(`📦 Extracted ${mockSites.length} sites from mockSites.ts`);

    // Write to JSON file
    const jsonPath = resolve(__dirname, '../seeds/mockSites.json');
    writeFileSync(jsonPath, JSON.stringify(mockSites, null, 2), 'utf-8');

    console.log(`✅ Successfully exported to: ${jsonPath}`);
    console.log(`📄 File size: ${(JSON.stringify(mockSites).length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('❌ Failed to extract mock data:', error.message);
    console.error('\nNote: If you get import errors, run this with tsx or ts-node:');
    console.error('  npx tsx database/scripts/extract-mock-data.js');
    console.error('  or install tsx: npm install --save-dev tsx\n');
    process.exit(1);
  }
}

extractMockData();
