/**
 * Migration Status Checker
 *
 * Shows which migrations have been applied and which are pending
 */

import { readdirSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { withConnection } from './utils/db-connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📊 Heritage Tracker Migration Status\n');

async function getMigrationStatus(sql) {
  // Get all migration files
  const migrationsDir = resolve(__dirname, '../migrations');
  const migrationFiles = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.log('⚠️  No migration files found');
    return;
  }

  // Get applied migrations from database
  let appliedMigrations = new Map();
  try {
    const rows = await sql`
      SELECT version, applied_at, duration_ms, description
      FROM schema_migrations
      ORDER BY version
    `;
    rows.forEach(row => {
      appliedMigrations.set(row.version, {
        appliedAt: row.applied_at,
        duration: row.duration_ms,
        description: row.description,
      });
    });
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('⚠️  schema_migrations table does not exist yet');
      console.log('   Run `npm run db:migrate` to create it\n');
    } else {
      throw error;
    }
  }

  // Show status for each migration
  console.log('Migration Status:\n');
  console.log('┌─────────────────────────────┬──────────┬──────────────┬─────────────┐');
  console.log('│ Migration                   │ Status   │ Applied      │ Duration    │');
  console.log('├─────────────────────────────┼──────────┼──────────────┼─────────────┤');

  let pendingCount = 0;
  let appliedCount = 0;

  for (const file of migrationFiles) {
    const version = basename(file, '.sql');
    const applied = appliedMigrations.get(version);

    if (applied) {
      const date = applied.appliedAt.toISOString().split('T')[0];
      const duration = applied.duration ? `${applied.duration}ms` : 'N/A';
      console.log(`│ ${version.padEnd(27)} │ ✅ Done  │ ${date.padEnd(12)} │ ${duration.padEnd(11)} │`);
      appliedCount++;
    } else {
      console.log(`│ ${version.padEnd(27)} │ ⏳ Pending │ ${'-'.padEnd(12)} │ ${'-'.padEnd(11)} │`);
      pendingCount++;
    }
  }

  console.log('└─────────────────────────────┴──────────┴──────────────┴─────────────┘');
  console.log();
  console.log(`Summary:`);
  console.log(`  Total migrations: ${migrationFiles.length}`);
  console.log(`  Applied: ${appliedCount}`);
  console.log(`  Pending: ${pendingCount}`);
  console.log();

  if (pendingCount > 0) {
    console.log('⚠️  Run `npm run db:migrate` to apply pending migrations\n');
  } else {
    console.log('✅ Database is up to date!\n');
  }

  // Show migration details if any are applied
  if (appliedCount > 0 && appliedMigrations.size > 0) {
    console.log('\nMigration Details:\n');
    for (const [version, info] of appliedMigrations) {
      console.log(`${version}:`);
      console.log(`  Applied: ${info.appliedAt.toISOString()}`);
      console.log(`  Duration: ${info.duration}ms`);
      if (info.description && info.description !== 'No description') {
        console.log(`  Description: ${info.description}`);
      }
      console.log();
    }
  }
}

// Run with automatic connection/disconnection
withConnection(getMigrationStatus)
  .catch(error => {
    console.error('\n❌ Failed to get migration status:');
    console.error(error.message);
    process.exit(1);
  });
