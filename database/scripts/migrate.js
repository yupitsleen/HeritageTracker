/**
 * Database Migration Runner
 *
 * Runs all migration files in database/migrations/ in order.
 * Supports both local PostgreSQL and Supabase with automatic retry logic.
 *
 * Features:
 * - Idempotent: safe to run multiple times
 * - Tracks applied migrations in schema_migrations table
 * - Skips already-applied migrations
 * - Records migration duration
 * - Transactional: each migration runs in its own transaction
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { withConnection } from './utils/db-connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🗄️  Heritage Tracker Database Migration\n');

/**
 * Get list of applied migrations from database
 * @param {import('postgres').Sql} sql - PostgreSQL client
 * @returns {Promise<Set<string>>} Set of applied migration versions
 */
async function getAppliedMigrations(sql) {
  try {
    const rows = await sql`SELECT version FROM schema_migrations ORDER BY version`;
    return new Set(rows.map(r => r.version));
  } catch (error) {
    // If schema_migrations table doesn't exist yet, return empty set
    if (error.message.includes('does not exist')) {
      return new Set();
    }
    throw error;
  }
}

/**
 * Extract description from migration file
 * @param {string} sqlContent - Migration SQL content
 * @returns {string} Migration description
 */
function extractDescription(sqlContent) {
  // Look for description in comments
  const match = sqlContent.match(/--\s*Description:\s*(.+)/i);
  if (match) {
    return match[1].trim();
  }

  // Fallback: extract from first comment line
  const firstComment = sqlContent.match(/--\s*(.+)/);
  if (firstComment) {
    return firstComment[1].trim().substring(0, 200);
  }

  return 'No description';
}

/**
 * Apply a single migration
 * @param {import('postgres').Sql} sql - PostgreSQL client
 * @param {string} file - Migration filename
 * @param {string} sqlContent - Migration SQL content
 * @returns {Promise<number>} Duration in milliseconds
 */
async function applyMigration(sql, file, sqlContent) {
  const version = basename(file, '.sql');
  const description = extractDescription(sqlContent);
  const start = Date.now();

  // Run migration in a transaction
  await sql.begin(async (tx) => {
    // Execute the migration SQL
    await tx.unsafe(sqlContent);

    // Record migration in tracking table (if not 000_schema_migrations itself)
    if (version !== '000_schema_migrations') {
      await tx`
        INSERT INTO schema_migrations (version, duration_ms, description)
        VALUES (${version}, ${Date.now() - start}, ${description})
      `;
    }
  });

  return Date.now() - start;
}

async function runMigrations(sql) {
  // Get migration files
  const migrationsDir = resolve(__dirname, '../migrations');
  const migrationFiles = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort(); // Ensure migrations run in order (000, 001, 002, etc.)

  if (migrationFiles.length === 0) {
    console.log('⚠️  No migration files found');
    return;
  }

  console.log(`📋 Found ${migrationFiles.length} migration file(s)\n`);

  // Get already-applied migrations
  const appliedMigrations = await getAppliedMigrations(sql);

  // Filter to only pending migrations
  const pendingMigrations = migrationFiles.filter(file => {
    const version = basename(file, '.sql');
    return !appliedMigrations.has(version);
  });

  if (pendingMigrations.length === 0) {
    console.log('✅ All migrations already applied. Database is up to date!\n');

    // Show applied migrations
    console.log(`📊 Applied migrations: ${appliedMigrations.size}`);
    if (appliedMigrations.size > 0) {
      const migrations = await sql`
        SELECT version, applied_at, duration_ms
        FROM schema_migrations
        ORDER BY version
      `;
      migrations.forEach(m => {
        console.log(`   • ${m.version} (${m.duration_ms}ms on ${m.applied_at.toISOString().split('T')[0]})`);
      });
    }
    console.log();
    return;
  }

  console.log(`🔄 Applying ${pendingMigrations.length} pending migration(s):\n`);

  // Run each pending migration
  for (const file of pendingMigrations) {
    const filePath = resolve(migrationsDir, file);
    const migrationSql = readFileSync(filePath, 'utf-8');
    const version = basename(file, '.sql');

    console.log(`  ⏳ ${version}...`);

    try {
      const duration = await applyMigration(sql, file, migrationSql);
      console.log(`  ✅ ${version} (${duration}ms)\n`);
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

  // Show migration summary
  const allAppliedMigrations = await getAppliedMigrations(sql);
  console.log(`✅ Migration complete! Total applied: ${allAppliedMigrations.size}\n`);
}

// Run migrations with automatic connection/disconnection and retry logic
withConnection(runMigrations)
  .catch(error => {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    process.exit(1);
  });
