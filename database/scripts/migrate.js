/**
 * Database Migration Runner
 *
 * Runs all migration files in database/migrations/ in order.
 * Supports both local PostgreSQL and Supabase with automatic retry logic.
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { withConnection } from './utils/db-connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🗄️  Heritage Tracker Database Migration\n');

async function runMigrations(sql) {
  // Get migration files
  const migrationsDir = resolve(__dirname, '../migrations');
  const migrationFiles = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort(); // Ensure migrations run in order

  if (migrationFiles.length === 0) {
    console.log('⚠️  No migration files found');
    return;
  }

  console.log(`📋 Found ${migrationFiles.length} migration(s):\n`);

  // Run each migration
  for (const file of migrationFiles) {
    const filePath = resolve(migrationsDir, file);
    const migrationSql = readFileSync(filePath, 'utf-8');

    console.log(`  ⏳ Running: ${file}`);

    try {
      // Execute the migration SQL
      // Note: postgres.js doesn't support multiple statements in one query,
      // so we need to split by semicolons (crude but works for our migrations)
      await sql.unsafe(migrationSql);

      console.log(`  ✅ Completed: ${file}\n`);
    } catch (error) {
      console.error(`  ❌ Failed: ${file}`);
      console.error(`     Error: ${error.message}\n`);
      throw error;
    }
  }

  // Verify tables were created
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;

  console.log('📊 Database tables:');
  tables.forEach(t => console.log(`   • ${t.table_name}`));
  console.log();

  console.log('✅ All migrations completed successfully!\n');
}

// Run migrations with automatic connection/disconnection and retry logic
withConnection(runMigrations)
  .catch(error => {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    process.exit(1);
  });
