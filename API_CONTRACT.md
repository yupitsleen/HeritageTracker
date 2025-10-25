# Heritage Tracker REST API Contract

**Version:** 2.0
**Last Updated:** October 25, 2025
**Status:** Ready for Backend Implementation
**Recommended Backend:** Supabase (PostgreSQL) or C#/.NET

---

## Overview

This document defines the REST API contract between the Heritage Tracker frontend and backend. The frontend is fully implemented and ready to connect to a backend that implements this specification.

**Architecture designed for:** Thousands to millions of heritage sites globally

### Recommended Backend Approach

**Option A: Supabase (PostgreSQL) - Recommended for Fast Implementation**
- Auto-generated REST API from database schema
- Built-in authentication, storage, and real-time
- PostGIS for geospatial queries
- Free tier → $25/mo at scale
- Setup time: 2-3 hours

**Option B: C#/.NET Core - Recommended for Enterprise**
- Full control over business logic
- ASP.NET Core Web API
- Entity Framework + PostgreSQL/SQL Server
- Setup time: 40+ hours

**Base URL (Supabase):** `https://[project-id].supabase.co/rest/v1/`
**Base URL (Custom):** `https://api.heritagetracker.com/api`

---

## Authentication

**Public Read Access:** No authentication required for GET requests

**Admin Write Access:** JWT bearer tokens for POST, PUT, DELETE operations

### Supabase Authentication
```http
Authorization: Bearer <supabase_jwt_token>
apikey: <supabase_anon_key>
```

### Custom Backend Authentication
```http
Authorization: Bearer <jwt_token>
```

---

## Common Response Format

### Success Response

```json
{
  "data": <T>,
  "success": true,
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context (optional)"
    }
  },
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Data Types

### GazaSite

The core heritage site data model.

```typescript
interface GazaSite {
  id: string;                          // Unique identifier (kebab-case)
  name: string;                        // English name
  nameArabic?: string;                 // Arabic name (RTL)
  type: string;                        // Site type (see Site Types)
  yearBuilt: string;                   // Year or period built (e.g., "7th century", "1320")
  yearBuiltIslamic?: string;           // Islamic calendar date (e.g., "1st century AH")
  coordinates: [number, number];       // [latitude, longitude]
  status: string;                      // Current status (see Site Statuses)
  dateDestroyed?: string;              // ISO date (YYYY-MM-DD) or null if not destroyed
  dateDestroyedIslamic?: string;       // Islamic calendar date
  description: string;                 // Brief description
  historicalSignificance: string;      // Historical context
  culturalValue: string;               // Cultural importance
  verifiedBy: string[];                // List of verification sources
  images?: {
    before?: ImageWithAttribution;
    after?: ImageWithAttribution;
    satellite?: ImageWithAttribution;
  };
  sources: Source[];                   // Source citations

  // Optional metadata
  unescoListed?: boolean;
  artifactCount?: number;
  isUnique?: boolean;
  religiousSignificance?: boolean;
  communityGatheringPlace?: boolean;
  historicalEvents?: string[];
}
```

### ImageWithAttribution

```typescript
interface ImageWithAttribution {
  url: string;              // Image URL
  credit: string;           // Photographer/organization
  license?: string;         // e.g., "CC BY-SA 4.0"
  sourceUrl?: string;       // Original source URL
  date?: string;            // When photo was taken
  description?: string;     // Image description
}
```

### Source

```typescript
interface Source {
  organization: string;     // e.g., "UNESCO", "Forensic Architecture"
  title: string;            // Document/report title
  url?: string;             // Source URL
  date?: string;            // Publication date
  type: string;             // e.g., "report", "article", "imagery"
}
```

### Site Types (Reference)

Valid values for `GazaSite.type`:
- `mosque`
- `church`
- `archaeological`
- `museum`
- `historic-building`
- `library`
- `monument`
- `cultural-center`

### Site Statuses (Reference)

Valid values for `GazaSite.status` (ordered by severity):
- `destroyed` - Completely destroyed, no structural integrity remaining
- `heavily-damaged` - Major structural damage, may not be repairable
- `looted` - Artifacts or valuables stolen or removed
- `damaged` - Partial damage, repairable with restoration work
- `abandoned` - No longer in use or maintained, but structurally intact
- `unknown` - Status cannot be verified or is uncertain
- `unharmed` - No damage, fully intact and preserved

---

## Endpoints

### 1. Get All Sites

Fetch all heritage sites with optional filtering.

**Endpoint:** `GET /sites`

**Query Parameters:**

| Parameter             | Type     | Required | Description                           |
|-----------------------|----------|----------|---------------------------------------|
| `type`                | string   | No       | Filter by site type (comma-separated) |
| `status`              | string   | No       | Filter by status (comma-separated)    |
| `dateDestroyedStart`  | string   | No       | Filter by destruction date (ISO)      |
| `dateDestroyedEnd`    | string   | No       | Filter by destruction date (ISO)      |

**Example Request:**

```http
GET /sites?type=mosque,church&status=destroyed
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "great-omari-mosque",
      "name": "Great Omari Mosque",
      "nameArabic": "جامع العمري الكبير",
      "type": "mosque",
      "yearBuilt": "7th century",
      "coordinates": [31.5069, 34.4668],
      "status": "destroyed",
      "dateDestroyed": "2023-12-07",
      "description": "Gaza's oldest and largest mosque...",
      "historicalSignificance": "One of the oldest mosques in Palestine...",
      "culturalValue": "Contained 62 rare manuscripts...",
      "verifiedBy": ["UNESCO", "Heritage for Peace"],
      "sources": [
        {
          "organization": "UNESCO",
          "title": "Gaza Heritage Damage Assessment",
          "url": "https://www.unesco.org/...",
          "date": "2024-05-27",
          "type": "official"
        }
      ]
    }
  ],
  "success": true,
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

---

### 2. Get Paginated Sites

Fetch sites with pagination (for large datasets).

**Endpoint:** `GET /sites/paginated`

**Query Parameters:**

| Parameter             | Type     | Required | Default | Description                           |
|-----------------------|----------|----------|---------|---------------------------------------|
| `page`                | number   | No       | 1       | Page number (1-indexed)               |
| `pageSize`            | number   | No       | 10      | Items per page                        |
| `type`                | string   | No       | -       | Filter by site type                   |
| `status`              | string   | No       | -       | Filter by status                      |
| `sortBy`              | string   | No       | name    | Sort field (name, dateDestroyed, etc.)|
| `sortOrder`           | string   | No       | asc     | Sort order (asc, desc)                |

**Example Request:**

```http
GET /sites/paginated?page=2&pageSize=20&sortBy=dateDestroyed&sortOrder=desc
```

**Response:** `200 OK`

```json
{
  "data": [
    /* Array of GazaSite objects */
  ],
  "pagination": {
    "page": 2,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  },
  "success": true,
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

---

### 3. Get Site by ID

Fetch a single site by its unique identifier.

**Endpoint:** `GET /sites/:id`

**Path Parameters:**

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| `id`      | string | Yes      | Site unique ID     |

**Example Request:**

```http
GET /sites/great-omari-mosque
```

**Response:** `200 OK`

```json
{
  "data": {
    "id": "great-omari-mosque",
    "name": "Great Omari Mosque",
    /* ... full GazaSite object */
  },
  "success": true,
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

**Error Response:** `404 Not Found`

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Site with ID \"invalid-id\" not found"
  },
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

---

### 4. Create Site (Admin Only - Future)

Create a new heritage site.

**Endpoint:** `POST /sites`

**Authorization:** Required (JWT bearer token)

**Request Body:**

```json
{
  "name": "New Heritage Site",
  "nameArabic": "موقع تراثي جديد",
  "type": "mosque",
  "yearBuilt": "1850",
  "coordinates": [31.5, 34.5],
  "status": "destroyed",
  "dateDestroyed": "2024-01-15",
  "description": "Description...",
  "historicalSignificance": "Significance...",
  "culturalValue": "Value...",
  "verifiedBy": ["UNESCO"],
  "sources": [
    {
      "organization": "UNESCO",
      "title": "Report Title",
      "type": "report"
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "new-heritage-site",
    /* ... full GazaSite object with generated ID */
  },
  "success": true,
  "message": "Site created successfully",
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

---

### 5. Update Site (Admin Only - Future)

Update an existing heritage site.

**Endpoint:** `PUT /sites/:id`

**Authorization:** Required (JWT bearer token)

**Request Body:** Partial `GazaSite` object (only fields to update)

```json
{
  "status": "heavily-damaged",
  "description": "Updated description..."
}
```

**Response:** `200 OK`

```json
{
  "data": {
    /* ... updated GazaSite object */
  },
  "success": true,
  "message": "Site updated successfully",
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

---

### 6. Delete Site (Admin Only - Future)

Delete a heritage site.

**Endpoint:** `DELETE /sites/:id`

**Authorization:** Required (JWT bearer token)

**Response:** `200 OK`

```json
{
  "data": null,
  "success": true,
  "message": "Site deleted successfully",
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

---

## CORS Configuration

The backend must allow requests from the frontend domain.

**Production:**
```
Access-Control-Allow-Origin: https://heritagetracker.com
```

**Development:**
```
Access-Control-Allow-Origin: http://localhost:5173
```

**Allowed Methods:** `GET, POST, PUT, DELETE, OPTIONS`
**Allowed Headers:** `Content-Type, Authorization`

---

## Data Validation Rules

### Required Fields

All sites must have:
- `id` (unique, kebab-case)
- `name`
- `type` (must match valid types)
- `yearBuilt`
- `coordinates` (valid [lat, lng] within Gaza bounds)
- `status` (must match valid statuses)
- `description`
- `historicalSignificance`
- `culturalValue`
- `verifiedBy` (non-empty array)
- `sources` (non-empty array)

### Coordinate Validation

Gaza bounds (approximate):
- Latitude: 31.2° to 31.6°
- Longitude: 34.2° to 34.6°

### Date Formats

- **dateDestroyed:** ISO 8601 format (`YYYY-MM-DD`)
- **yearBuilt:** Flexible string (year, century, or period)

---

## Performance Requirements

### For Thousands of Sites
- **GET /sites (paginated):** < 500ms for page of 50 sites
- **GET /sites/:id:** < 200ms
- **Filtering:** < 1s with indexes on type, status, coordinates
- **Geospatial queries:** < 500ms with PostGIS spatial indexes
- **Pagination:** Required for datasets > 100 sites
- **Response size:** Keep pages under 1MB

### Database Indexing Strategy
```sql
-- Critical indexes for performance
CREATE INDEX idx_heritage_type ON heritage_sites(type);
CREATE INDEX idx_heritage_status ON heritage_sites(status);
CREATE INDEX idx_date_destroyed ON heritage_sites(date_destroyed);
CREATE INDEX idx_coordinates ON heritage_sites USING GIST(coordinates);
CREATE INDEX idx_name_search ON heritage_sites USING GIN(to_tsvector('english', name));
```

---

## Data Sources

The backend should integrate data from:
1. **UNESCO** - Official heritage damage verification
2. **Forensic Architecture** - Satellite imagery and coordinates
3. **Heritage for Peace** - Ground documentation

All sites must be verified by at least one authoritative source.

---

## Migration Notes

### Current Frontend Mock Data

The frontend currently uses `src/data/mockSites.ts` with 44 sites. This data should seed the initial backend database.

### Environment Variables

Frontend expects:
```bash
VITE_API_URL=https://api.heritagetracker.com/api
VITE_USE_MOCK_API=false  # Disable MSW in production
```

---

## Testing Endpoints

### Health Check (Optional)

```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T19:30:00.000Z"
}
```

---

## Next Steps

1. **Backend Team:** Implement endpoints per this specification
2. **Database:** PostgreSQL or MongoDB recommended
3. **Deployment:** Provide production API URL
4. **SSL:** Ensure HTTPS for production
5. **Rate Limiting:** Consider rate limits for public endpoints

---

## Questions or Clarifications

Contact frontend team for:
- Additional fields needed
- Filter requirements
- Performance constraints
- Data format questions

---

## Appendix A: Supabase Implementation Guide

### Quick Start with Supabase (2-3 hours)

#### Step 1: Create Supabase Project
1. Sign up at https://supabase.com
2. Create new project
3. Wait for database provisioning (~2 minutes)
4. Copy project URL and anon key

#### Step 2: Database Schema

```sql
-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create heritage_sites table
CREATE TABLE heritage_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_arabic TEXT,
  type TEXT NOT NULL CHECK (type IN ('mosque', 'church', 'archaeological', 'museum', 'historic-building', 'library', 'monument', 'cultural-center')),
  year_built TEXT NOT NULL,
  year_built_islamic TEXT,
  coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('destroyed', 'heavily-damaged', 'looted', 'damaged', 'abandoned', 'unknown', 'unharmed')),
  date_destroyed DATE,
  date_destroyed_islamic TEXT,
  description TEXT NOT NULL,
  historical_significance TEXT NOT NULL,
  cultural_value TEXT NOT NULL,
  verified_by TEXT[] NOT NULL,
  images JSONB,
  sources JSONB NOT NULL,

  -- Optional metadata
  unesco_listed BOOLEAN DEFAULT FALSE,
  artifact_count INTEGER,
  is_unique BOOLEAN DEFAULT FALSE,
  religious_significance BOOLEAN DEFAULT FALSE,
  community_gathering_place BOOLEAN DEFAULT FALSE,
  historical_events TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_heritage_type ON heritage_sites(type);
CREATE INDEX idx_heritage_status ON heritage_sites(status);
CREATE INDEX idx_date_destroyed ON heritage_sites(date_destroyed);
CREATE INDEX idx_coordinates ON heritage_sites USING GIST(coordinates);
CREATE INDEX idx_name_search ON heritage_sites USING GIN(to_tsvector('english', name));

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON heritage_sites
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

#### Step 3: Row-Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE heritage_sites ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access"
ON heritage_sites FOR SELECT
TO public
USING (true);

-- Restrict write access to authenticated users
CREATE POLICY "Authenticated users can insert"
ON heritage_sites FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update"
ON heritage_sites FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete"
ON heritage_sites FOR DELETE
TO authenticated
USING (true);
```

#### Step 4: Frontend Integration

```typescript
// .env.production
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_USE_MOCK_API=false

// src/api/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// src/api/sites.ts - Update to use Supabase
export async function getAllSites(params?: SitesQueryParams) {
  let query = supabase
    .from('heritage_sites')
    .select('*');

  // Apply filters
  if (params?.types?.length) {
    query = query.in('type', params.types);
  }
  if (params?.statuses?.length) {
    query = query.in('status', params.statuses);
  }
  if (params?.dateDestroyedStart) {
    query = query.gte('date_destroyed', params.dateDestroyedStart);
  }
  if (params?.dateDestroyedEnd) {
    query = query.lte('date_destroyed', params.dateDestroyedEnd);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// Paginated query
export async function getSitesPaginated(params: SitesQueryParams) {
  const page = params.page || 1;
  const pageSize = params.pageSize || 50;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('heritage_sites')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order(params.sortBy || 'name', {
      ascending: params.sortOrder === 'asc'
    });

  // Apply filters...

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalItems: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  };
}

// Geospatial query (sites within radius)
export async function getSitesNearLocation(
  lat: number,
  lng: number,
  radiusKm: number
) {
  const { data, error } = await supabase
    .rpc('sites_near_point', {
      lat, lng, radius_km: radiusKm
    });

  if (error) throw error;
  return data;
}
```

#### Step 5: Custom SQL Functions

```sql
-- Function for geospatial search
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
  );
$$ LANGUAGE sql STABLE;
```

### Supabase Features You Get Free

1. **Auto-generated REST API** - No backend code needed
2. **Real-time subscriptions** - Live updates when data changes
3. **Storage** - For heritage site images
4. **Auth** - Built-in user authentication
5. **Edge Functions** - For custom business logic (optional)
6. **Database backups** - Automatic daily backups
7. **Admin dashboard** - View/edit data without SQL

### Migration from Mock Adapter

```typescript
// Update src/api/sites.ts
const shouldUseMockData = () => import.meta.env.VITE_USE_MOCK_API === 'true';

export async function getAllSites(params?: SitesQueryParams) {
  if (shouldUseMockData()) {
    return mockGetAllSites(); // Keep for development
  }

  // Supabase production
  return getSupabaseSites(params);
}
```

---

## Appendix B: C#/.NET Implementation Guide

### Quick Start with ASP.NET Core (40+ hours)

#### Database Schema (Entity Framework)

```csharp
public class HeritageSite
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? NameArabic { get; set; }
    public string Type { get; set; } = string.Empty;
    public string YearBuilt { get; set; } = string.Empty;
    public string? YearBuiltIslamic { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? DateDestroyed { get; set; }
    public string? DateDestroyedIslamic { get; set; }
    public string Description { get; set; } = string.Empty;
    public string HistoricalSignificance { get; set; } = string.Empty;
    public string CulturalValue { get; set; } = string.Empty;
    public List<string> VerifiedBy { get; set; } = new();
    public ImageSet? Images { get; set; }
    public List<Source> Sources { get; set; } = new();

    // Metadata
    public bool UnescoListed { get; set; }
    public int? ArtifactCount { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// DbContext
public class HeritageDbContext : DbContext
{
    public DbSet<HeritageSite> Sites { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HeritageSite>()
            .HasIndex(s => s.Type);
        modelBuilder.Entity<HeritageSite>()
            .HasIndex(s => s.Status);
        modelBuilder.Entity<HeritageSite>()
            .HasIndex(s => s.DateDestroyed);
    }
}
```

#### API Controller

```csharp
[ApiController]
[Route("api/sites")]
public class SitesController : ControllerBase
{
    private readonly HeritageDbContext _context;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<HeritageSite>>>> GetSites(
        [FromQuery] string? type,
        [FromQuery] string? status)
    {
        var query = _context.Sites.AsQueryable();

        if (!string.IsNullOrEmpty(type))
        {
            var types = type.Split(',');
            query = query.Where(s => types.Contains(s.Type));
        }

        if (!string.IsNullOrEmpty(status))
        {
            var statuses = status.Split(',');
            query = query.Where(s => statuses.Contains(s.Status));
        }

        var sites = await query.ToListAsync();

        return Ok(new ApiResponse<List<HeritageSite>>
        {
            Data = sites,
            Success = true,
            Timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("paginated")]
    public async Task<ActionResult<PaginatedResponse<HeritageSite>>> GetSitesPaginated(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var totalItems = await _context.Sites.CountAsync();
        var sites = await _context.Sites
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new PaginatedResponse<HeritageSite>
        {
            Data = sites,
            Pagination = new PaginationInfo
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
            }
        });
    }
}
```

---

**Document Version:** 2.0
**Frontend Ready:** Yes (Scaled for thousands of sites)
**Backend Status:** Pending Implementation (Supabase recommended)
