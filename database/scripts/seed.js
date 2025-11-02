/**
 * Database Seed Runner
 *
 * Runs all seed files in database/seeds/ in order.
 * Populates the database with initial data from mockSites.
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://heritage_user:heritage_dev_password@localhost:5432/heritage_tracker';

console.log('🌱 Heritage Tracker Database Seeding\n');

async function runSeeds() {
  let sql;

  try {
    // Connect to database
    console.log('📡 Connecting to database...');
    sql = postgres(DATABASE_URL, {
      max: 1,
      onnotice: () => {}, // Suppress NOTICE messages
    });

    // Test connection
    await sql`SELECT 1`;
    console.log('✅ Connected to database\n');

    // Get seed files
    const seedsDir = resolve(__dirname, '../seeds');
    const seedFiles = readdirSync(seedsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Ensure seeds run in order

    if (seedFiles.length === 0) {
      console.log('⚠️  No seed files found');
      console.log('💡 Run: npm run db:generate-seed to create seed file from mockSites.ts\n');
      return;
    }

    console.log(`📋 Found ${seedFiles.length} seed file(s):\n`);

    // Run each seed
    for (const file of seedFiles) {
      const filePath = resolve(seedsDir, file);
      const seedSql = readFileSync(filePath, 'utf-8');

      console.log(`  ⏳ Running: ${file}`);

      try {
        // Execute the seed SQL
        await sql.unsafe(seedSql);

        console.log(`  ✅ Completed: ${file}\n`);
      } catch (error) {
        console.error(`  ❌ Failed: ${file}`);
        console.error(`     Error: ${error.message}\n`);
        throw error;
      }
    }

    // Show statistics
    const stats = await sql`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'destroyed') as destroyed,
        COUNT(*) FILTER (WHERE status = 'heavily-damaged') as heavily_damaged,
        COUNT(*) FILTER (WHERE status = 'damaged') as damaged
      FROM heritage_sites
    `;

    const typeStats = await sql`
      SELECT type, COUNT(*) as count
      FROM heritage_sites
      GROUP BY type
      ORDER BY count DESC
    `;

    console.log('📊 Seeding Statistics:');
    console.log(`   Total sites: ${stats[0].total}`);
    console.log(`   Destroyed: ${stats[0].destroyed}`);
    console.log(`   Heavily damaged: ${stats[0].heavily_damaged}`);
    console.log(`   Damaged: ${stats[0].damaged}`);
    console.log();
    console.log('   By type:');
    typeStats.forEach(t => console.log(`     • ${t.type}: ${t.count}`));
    console.log();

    console.log('✅ Database seeded successfully!\n');
  } catch (error) {
    console.error('\n❌ Seeding failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

runSeeds();
