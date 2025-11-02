/**
 * Database Connection Pool
 *
 * PostgreSQL connection using 'postgres' package
 * Supports both local Docker and cloud deployments
 */

import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'heritage_tracker',
  username: process.env.DB_USER || 'heritage_user',
  password: process.env.DB_PASSWORD || 'heritage_dev_password',
  max: 10, // Maximum pool size
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
};

// Create connection pool
const sql = postgres(config);

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected:', result[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Close database connection pool
 * @returns {Promise<void>}
 */
export async function closeConnection() {
  await sql.end();
  console.log('Database connection pool closed');
}

// Export sql instance
export default sql;
