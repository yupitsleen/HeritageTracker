/**
 * Simple site loader that imports mock sites data
 * This avoids complex regex parsing of TypeScript
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ESM equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import mock sites - Vite will handle TypeScript
const mockSitesPath = join(__dirname, '../../src/data/mockSites.ts');

// For Node.js to import TypeScript, we need to use tsx or compile first
// Simple workaround: Read file and eval it after stripping types
import fs from 'fs/promises';

export async function loadAllSites() {
  const content = await fs.readFile(mockSitesPath, 'utf-8');

  // Remove type annotations and imports for simple eval
  let cleaned = content
    .replace(/import .+ from .+;/g, '')
    .replace(/export const mockSites: Site\[\] = /, 'const mockSites = ')
    .replace(/: \[number, number\]/g, '')
    .replace(/type: ["']([^"']+)["']/g, (match, p1) => `type: "${p1}"`)
    .replace(/status: ["']([^"']+)["']/g, (match, p1) => `status: "${p1}"`);

  // Evaluate the cleaned code
  const mockSites = eval(cleaned + '; mockSites;');

  // Extract only what we need
  return mockSites.map(site => ({
    id: site.id,
    name: site.name,
    lat: site.coordinates[0],
    lng: site.coordinates[1]
  }));
}
