-- ============================================================================
-- Migration Tracking Table
-- ============================================================================
-- This table tracks which migrations have been applied to the database.
-- It enables idempotent migrations - you can run `npm run db:migrate` safely
-- multiple times without error.
--
-- Usage:
--   - Before applying a migration, check if its version exists in this table
--   - After applying a migration, insert its version with timestamp
--   - Migrations are applied in alphabetical order by filename
--
-- Created: 2025-11-02
-- Author: Heritage Tracker Team
-- ============================================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration_ms INTEGER,
  description TEXT
);

-- Index for fast lookups (though PRIMARY KEY already creates one)
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at
  ON schema_migrations(applied_at DESC);

-- Add comment for documentation
COMMENT ON TABLE schema_migrations IS
  'Tracks applied database migrations for idempotent migration system';
COMMENT ON COLUMN schema_migrations.version IS
  'Migration filename without .sql extension (e.g., 001_initial_schema)';
COMMENT ON COLUMN schema_migrations.applied_at IS
  'Timestamp when migration was applied';
COMMENT ON COLUMN schema_migrations.duration_ms IS
  'Time taken to apply migration in milliseconds';
COMMENT ON COLUMN schema_migrations.description IS
  'Human-readable description of the migration';
