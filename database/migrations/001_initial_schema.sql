-- Heritage Tracker Initial Database Schema
-- Compatible with both local PostgreSQL and Supabase
-- Version: 1.0
-- Created: 2025-11-02

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable PostGIS for geospatial queries (point data, distance calculations)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Heritage Sites Table
-- Stores Palestinian cultural heritage sites with destruction tracking
CREATE TABLE IF NOT EXISTS heritage_sites (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Information
  name TEXT NOT NULL,
  name_arabic TEXT,

  -- Type Classification
  type TEXT NOT NULL CHECK (type IN (
    'mosque',
    'church',
    'archaeological',
    'museum',
    'historic-building',
    'library',
    'monument',
    'cultural-center'
  )),

  -- Historical Dates
  year_built TEXT NOT NULL,
  year_built_islamic TEXT,

  -- Geospatial Data (PostGIS geography type for accurate distance calculations)
  coordinates GEOGRAPHY(POINT, 4326) NOT NULL,

  -- Status Tracking
  status TEXT NOT NULL CHECK (status IN (
    'destroyed',
    'heavily-damaged',
    'looted',
    'damaged',
    'abandoned',
    'unknown',
    'unharmed'
  )),

  -- Destruction Dates
  date_destroyed DATE,
  date_destroyed_islamic TEXT,

  -- Descriptions
  description TEXT NOT NULL,
  historical_significance TEXT NOT NULL,
  cultural_value TEXT NOT NULL,

  -- Verification Sources (array of organizations)
  verified_by TEXT[] NOT NULL DEFAULT '{}',

  -- Images (JSONB for flexible schema)
  -- Structure: { before: {...}, after: {...}, satellite: {...} }
  images JSONB,

  -- Sources (JSONB array of source citations)
  -- Structure: [{ organization, title, url, date, type }, ...]
  sources JSONB NOT NULL DEFAULT '[]',

  -- Optional Metadata
  unesco_listed BOOLEAN DEFAULT FALSE,
  artifact_count INTEGER,
  is_unique BOOLEAN DEFAULT FALSE,
  religious_significance BOOLEAN DEFAULT FALSE,
  community_gathering_place BOOLEAN DEFAULT FALSE,
  historical_events TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_verified_by CHECK (array_length(verified_by, 1) > 0),
  CONSTRAINT valid_sources CHECK (jsonb_array_length(sources) > 0),
  CONSTRAINT valid_artifact_count CHECK (artifact_count IS NULL OR artifact_count >= 0)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- B-tree indexes for common queries
CREATE INDEX IF NOT EXISTS idx_heritage_type
  ON heritage_sites(type);

CREATE INDEX IF NOT EXISTS idx_heritage_status
  ON heritage_sites(status);

CREATE INDEX IF NOT EXISTS idx_heritage_date_destroyed
  ON heritage_sites(date_destroyed)
  WHERE date_destroyed IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_heritage_unesco
  ON heritage_sites(unesco_listed)
  WHERE unesco_listed = TRUE;

-- Geospatial index for location-based queries (GIST index)
CREATE INDEX IF NOT EXISTS idx_heritage_coordinates
  ON heritage_sites USING GIST(coordinates);

-- Full-text search index for name searches
CREATE INDEX IF NOT EXISTS idx_heritage_name_search
  ON heritage_sites USING GIN(to_tsvector('english', name));

-- Composite index for filtered sorting (common query pattern)
CREATE INDEX IF NOT EXISTS idx_heritage_type_status
  ON heritage_sites(type, status);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Automatically update updated_at timestamp on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON heritage_sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on heritage_sites table
ALTER TABLE heritage_sites ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (anyone can view heritage sites)
CREATE POLICY "Public read access"
  ON heritage_sites
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only authenticated users can insert new sites
CREATE POLICY "Authenticated users can insert"
  ON heritage_sites
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update sites
CREATE POLICY "Authenticated users can update"
  ON heritage_sites
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete sites
CREATE POLICY "Authenticated users can delete"
  ON heritage_sites
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- CUSTOM FUNCTIONS
-- ============================================================================

-- Function: Find heritage sites within a radius of a point
-- Usage: SELECT * FROM sites_near_point(31.5, 34.5, 10);
-- Returns sites within 10km of the specified coordinates
CREATE OR REPLACE FUNCTION sites_near_point(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION
)
RETURNS SETOF heritage_sites AS $$
  SELECT *
  FROM heritage_sites
  WHERE ST_DWithin(
    coordinates::geography,
    ST_MakePoint(lng, lat)::geography,
    radius_km * 1000  -- Convert km to meters
  )
  ORDER BY ST_Distance(
    coordinates::geography,
    ST_MakePoint(lng, lat)::geography
  );
$$ LANGUAGE sql STABLE;

-- Function: Get statistics by site type
CREATE OR REPLACE FUNCTION get_statistics_by_type()
RETURNS TABLE (
  site_type TEXT,
  total_count BIGINT,
  destroyed_count BIGINT,
  damaged_count BIGINT,
  unharmed_count BIGINT
) AS $$
  SELECT
    type as site_type,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE status = 'destroyed') as destroyed_count,
    COUNT(*) FILTER (WHERE status IN ('heavily-damaged', 'damaged')) as damaged_count,
    COUNT(*) FILTER (WHERE status = 'unharmed') as unharmed_count
  FROM heritage_sites
  GROUP BY type
  ORDER BY total_count DESC;
$$ LANGUAGE sql STABLE;

-- Function: Get sites destroyed within a date range
CREATE OR REPLACE FUNCTION get_sites_destroyed_between(
  start_date DATE,
  end_date DATE
)
RETURNS SETOF heritage_sites AS $$
  SELECT *
  FROM heritage_sites
  WHERE date_destroyed IS NOT NULL
    AND date_destroyed BETWEEN start_date AND end_date
  ORDER BY date_destroyed ASC;
$$ LANGUAGE sql STABLE;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE heritage_sites IS
  'Palestinian cultural heritage sites with destruction tracking';

COMMENT ON COLUMN heritage_sites.coordinates IS
  'PostGIS geography point (SRID 4326 - WGS84). Format: POINT(longitude latitude)';

COMMENT ON COLUMN heritage_sites.images IS
  'JSON object with optional before/after/satellite images. Each image has: url, credit, license, sourceUrl, date, description';

COMMENT ON COLUMN heritage_sites.sources IS
  'JSON array of source citations. Each source has: organization, title, url, date, type';

COMMENT ON FUNCTION sites_near_point IS
  'Find heritage sites within specified radius (km) of a point. Returns results sorted by distance.';

-- ============================================================================
-- GRANTS (for local development)
-- ============================================================================

-- Grant all privileges to the heritage_user (local development)
-- In production (Supabase), this is handled by RLS policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'heritage_user') THEN
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO heritage_user;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO heritage_user;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO heritage_user;
  END IF;
END
$$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Uncomment to verify schema after migration:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT indexname FROM pg_indexes WHERE tablename = 'heritage_sites';
-- SELECT proname FROM pg_proc WHERE proname LIKE '%site%';
