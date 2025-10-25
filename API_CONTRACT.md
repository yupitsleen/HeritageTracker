# Heritage Tracker REST API Contract

**Version:** 1.0
**Last Updated:** October 24, 2025
**Status:** Draft for Backend Implementation

---

## Overview

This document defines the REST API contract between the Heritage Tracker frontend and backend. The frontend is fully implemented and ready to connect to a backend that implements this specification.

**Base URL:** `https://api.heritagetracker.com/api` (production)
**Development URL:** `http://localhost:5000/api`

---

## Authentication

**MVP Phase:** No authentication required (read-only public data)

**Future Phases:** JWT bearer tokens for admin features (POST, PUT, DELETE)

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

Valid values for `GazaSite.status`:
- `destroyed`
- `heavily-damaged`
- `damaged`
- `looted`
- `threatened`

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

- **GET /sites:** < 500ms for 100 sites
- **GET /sites/:id:** < 200ms
- **Pagination:** Support 1000+ sites efficiently

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

**Document Version:** 1.0
**Frontend Ready:** Yes
**Backend Status:** Pending Implementation
