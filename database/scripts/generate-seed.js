/**
 * Generate SQL seed file from mockSites.ts
 *
 * This script reads the TypeScript mock data and converts it to SQL INSERT statements
 * for seeding the local PostgreSQL database.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse mockSites.ts
const mockSitesPath = resolve(__dirname, '../../src/data/mockSites.ts');
const mockSitesContent = readFileSync(mockSitesPath, 'utf-8');

// Extract the mockSites array using a simple regex
// This works because mockSites is exported as a const array
const arrayMatch = mockSitesContent.match(/export const mockSites: GazaSite\[\] = (\[[\s\S]*\]);/);

if (!arrayMatch) {
  console.error('❌ Could not find mockSites array in mockSites.ts');
  process.exit(1);
}

// Use eval to parse the array (safe because it's our own code)
// Remove the trailing semicolon and parse
const mockSitesString = arrayMatch[1];

// Create a safer evaluation by creating a minimal context
const mockSites = eval(`(${mockSitesString})`);

console.log(`📦 Found ${mockSites.length} sites to convert to SQL`);

// Helper function to escape SQL strings
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'string') {
    return `'${str.replace(/'/g, "''")}'`;
  }
  if (typeof str === 'boolean') {
    return str ? 'TRUE' : 'FALSE';
  }
  if (typeof str === 'number') {
    return str.toString();
  }
  if (Array.isArray(str)) {
    if (str.length === 0) return 'ARRAY[]::TEXT[]';
    return `ARRAY[${str.map(escapeSql).join(', ')}]`;
  }
  if (typeof str === 'object') {
    return `'${JSON.stringify(str).replace(/'/g, "''")}'::jsonb`;
  }
  return 'NULL';
}

// Helper to format coordinates for PostGIS
function formatCoordinates(coords) {
  if (!coords || coords.length !== 2) {
    throw new Error('Invalid coordinates');
  }
  const [lat, lng] = coords;
  return `ST_GeogFromText('POINT(${lng} ${lat})')`;
}

// Generate INSERT statements
const sqlStatements = [];

sqlStatements.push(`-- Heritage Tracker Seed Data
-- Generated from mockSites.ts on ${new Date().toISOString()}
-- ${mockSites.length} heritage sites
--
-- This file is auto-generated. Do not edit manually.
-- To regenerate: npm run db:generate-seed

BEGIN;

-- Disable triggers for faster insertion
SET session_replication_role = 'replica';

-- Clear existing data (for re-seeding)
TRUNCATE TABLE heritage_sites CASCADE;

`);

mockSites.forEach((site, index) => {
  try {
    const values = [
      escapeSql(site.id),
      escapeSql(site.name),
      escapeSql(site.nameArabic),
      escapeSql(site.type),
      escapeSql(site.yearBuilt),
      escapeSql(site.yearBuiltIslamic),
      formatCoordinates(site.coordinates),
      escapeSql(site.status),
      site.dateDestroyed ? escapeSql(site.dateDestroyed) : 'NULL',
      escapeSql(site.dateDestroyedIslamic),
      escapeSql(site.lastUpdated || new Date().toISOString().split('T')[0]),
      escapeSql(site.description),
      escapeSql(site.historicalSignificance),
      escapeSql(site.culturalValue),
      escapeSql(site.verifiedBy || []),
      site.images ? escapeSql(site.images) : 'NULL',
      escapeSql(site.sources || []),
      site.unescoListed !== undefined ? escapeSql(site.unescoListed) : 'NULL',
      site.artifactCount !== undefined ? escapeSql(site.artifactCount) : 'NULL',
      site.isUnique !== undefined ? escapeSql(site.isUnique) : 'NULL',
      site.religiousSignificance !== undefined ? escapeSql(site.religiousSignificance) : 'NULL',
      site.communityGatheringPlace !== undefined ? escapeSql(site.communityGatheringPlace) : 'NULL',
      site.historicalEvents ? escapeSql(site.historicalEvents) : 'NULL',
    ];

    const sql = `INSERT INTO heritage_sites (
  id,
  name,
  name_arabic,
  type,
  year_built,
  year_built_islamic,
  coordinates,
  status,
  date_destroyed,
  date_destroyed_islamic,
  last_updated,
  description,
  historical_significance,
  cultural_value,
  verified_by,
  images,
  sources,
  unesco_listed,
  artifact_count,
  is_unique,
  religious_significance,
  community_gathering_place,
  historical_events
) VALUES (
  ${values.join(',\n  ')}
);

`;

    sqlStatements.push(sql);

    if ((index + 1) % 10 === 0) {
      console.log(`  ✓ Generated ${index + 1}/${mockSites.length} sites`);
    }
  } catch (error) {
    console.error(`❌ Error processing site ${site.id}:`, error.message);
    throw error;
  }
});

sqlStatements.push(`
-- Re-enable triggers
SET session_replication_role = 'origin';

COMMIT;

-- Verify insertion
SELECT COUNT(*) as total_sites FROM heritage_sites;
SELECT type, COUNT(*) as count FROM heritage_sites GROUP BY type ORDER BY count DESC;
`);

// Write to seed file
const seedFilePath = resolve(__dirname, '../seeds/001_mock_sites.sql');
const fullSql = sqlStatements.join('');

writeFileSync(seedFilePath, fullSql, 'utf-8');

console.log(`\n✅ Successfully generated seed file: ${seedFilePath}`);
console.log(`📊 Total sites: ${mockSites.length}`);
console.log(`📄 SQL file size: ${(fullSql.length / 1024).toFixed(2)} KB\n`);
