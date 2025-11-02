/**
 * Database Connection Utility
 *
 * Provides reusable database connection logic with retry support
 * for migration and seed scripts.
 */

import postgres from 'postgres';

/**
 * Get database URL from environment or use default
 * @returns {string} Database connection URL
 */
export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    'postgresql://heritage_user:heritage_dev_password@localhost:5432/heritage_tracker'
  );
}

/**
 * Connect to database with retry logic
 *
 * Retries connection with exponential backoff to handle
 * cases where PostgreSQL is still starting (common with Docker)
 *
 * @param {Object} options - Connection options
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 5)
 * @param {number} options.initialDelay - Initial delay in ms before first retry (default: 2000)
 * @param {number} options.backoffMultiplier - Delay multiplier for each retry (default: 1.5)
 * @returns {Promise<postgres.Sql>} PostgreSQL client connection
 */
export async function connectWithRetry(options = {}) {
  const {
    maxRetries = 5,
    initialDelay = 2000,
    backoffMultiplier = 1.5,
  } = options;

  const dbUrl = getDatabaseUrl();
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📡 Connecting to database (attempt ${attempt}/${maxRetries})...`);

      const sql = postgres(dbUrl, {
        max: 1, // Only one connection needed for scripts
        onnotice: () => {}, // Suppress NOTICE messages
      });

      // Test connection
      await sql`SELECT NOW() as current_time`;

      console.log('✅ Database connected successfully\n');
      return sql;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`❌ Failed to connect after ${maxRetries} attempts`);
        console.error(`   Error: ${error.message}`);
        throw new Error(`Database connection failed: ${error.message}`);
      }

      console.log(`⏳ Connection failed, waiting ${delay}ms before retry...`);
      console.log(`   Error: ${error.message}\n`);

      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, delay));

      // Increase delay for next attempt (exponential backoff)
      delay = Math.floor(delay * backoffMultiplier);
    }
  }

  throw new Error('Unexpected error in connectWithRetry');
}

/**
 * Disconnect from database gracefully
 *
 * @param {postgres.Sql} sql - PostgreSQL client connection
 * @returns {Promise<void>}
 */
export async function disconnect(sql) {
  if (sql) {
    try {
      await sql.end({ timeout: 5 });
      console.log('\n✅ Database connection closed');
    } catch (error) {
      console.warn(`⚠️  Error closing database connection: ${error.message}`);
    }
  }
}

/**
 * Execute a function with automatic connection/disconnection
 *
 * @param {Function} fn - Async function that receives sql client
 * @param {Object} options - Connection options (passed to connectWithRetry)
 * @returns {Promise<any>} Result from fn
 */
export async function withConnection(fn, options = {}) {
  let sql;

  try {
    sql = await connectWithRetry(options);
    return await fn(sql);
  } finally {
    await disconnect(sql);
  }
}
