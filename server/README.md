# Heritage Tracker - Local Backend Server

Express REST API server for local development with PostgreSQL database.

## Architecture

**3-Layer Pattern:**
```
HTTP Request
    ↓
Controller (sitesController.js) - HTTP concerns
    ↓
Service (sitesService.js) - Business logic
    ↓
Repository (sitesRepository.js) - Data access
    ↓
Database (PostgreSQL + PostGIS)
```

## Quick Start

### One-Time Setup

```bash
# 1. Start PostgreSQL database and load seed data
npm run db:setup

# Wait 5 seconds for database to start, then the script will:
# - Run migrations (create schema)
# - Generate seed SQL from mockSites.ts
# - Load 45 heritage sites
```

### Start Backend Server

```bash
# Development mode (with auto-reload)
npm run server:dev

# Production mode
npm run server:start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Health Checks

```
GET /health              - Basic health check
GET /api/health          - Health check with database status
```

### Heritage Sites

```
GET    /api/sites              - Get all sites (with optional filters)
GET    /api/sites/paginated    - Get paginated sites
GET    /api/sites/stats        - Get site statistics
GET    /api/sites/nearby       - Get sites near a geographic point
GET    /api/sites/:id          - Get site by ID
POST   /api/sites              - Create new site
PATCH  /api/sites/:id          - Update existing site
DELETE /api/sites/:id          - Delete site
```

## Query Parameters

### Filtering (GET /api/sites)

```
types              - Array of site types (mosque, church, etc.)
statuses           - Array of statuses (destroyed, damaged, etc.)
search             - Text search across name, description
startDate          - Filter by destruction date (start)
endDate            - Filter by destruction date (end)
page               - Page number (default: 1)
pageSize           - Items per page (default: 50, max: 100)
```

Example:
```
GET /api/sites?types=mosque&types=church&statuses=destroyed&page=1&pageSize=20
```

### Nearby Search (GET /api/sites/nearby)

```
lat                - Latitude (required)
lng                - Longitude (required)
radius             - Radius in kilometers (default: 10, max: 1000)
```

Example:
```
GET /api/sites/nearby?lat=31.5&lng=34.5&radius=50
```

## File Structure

```
server/
├── index.js                      # Express server entry point
├── db.js                         # PostgreSQL connection pool
├── package.json                  # Server dependencies
├── controllers/
│   └── sitesController.js        # HTTP request handlers
├── services/
│   └── sitesService.js           # Business logic & validation
├── repositories/
│   └── sitesRepository.js        # Database queries
├── middleware/
│   ├── errorHandler.js           # Error handling
│   └── validator.js              # Request validation
└── utils/
    └── converters.js             # Data format conversions
```

## Environment Variables

Create `.env` file in project root:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=heritage_tracker
DB_USER=heritage_user
DB_PASSWORD=heritage_dev_password

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Database Commands

```bash
npm run db:start           # Start PostgreSQL (Docker)
npm run db:stop            # Stop PostgreSQL
npm run db:reset           # Reset database (delete all data)
npm run db:logs            # View database logs
npm run db:migrate         # Run migrations
npm run db:generate-seed   # Generate seed SQL from mockSites.ts
npm run db:seed            # Load seed data
npm run db:setup           # Complete setup (all of the above)
```

## Development

### Auto-Reload with Nodemon

```bash
npm run server:dev
```

Changes to any `.js` file in `server/` will automatically reload the server.

### Running with Frontend

```bash
# Terminal 1: Start backend
npm run server:dev

# Terminal 2: Start frontend
npm run dev

# Or run both together:
npm run dev:full
```

### Enable Local Backend in Frontend

Update `.env.development`:
```env
VITE_USE_MOCK_API=false
VITE_USE_LOCAL_BACKEND=true
VITE_API_URL=http://localhost:5000/api
```

## Error Handling

All errors return JSON in this format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "stack": "Stack trace (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Testing

### Manual Testing with curl

```bash
# Health check
curl http://localhost:5000/health

# Get all sites
curl http://localhost:5000/api/sites

# Get site by ID
curl http://localhost:5000/api/sites/site-001

# Create site (requires full site object)
curl -X POST http://localhost:5000/api/sites \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Site",
    "type": "mosque",
    "coordinates": [31.5, 34.5],
    "status": "destroyed",
    "yearBuilt": "1500",
    "description": "Test description",
    "historicalSignificance": "Test significance",
    "culturalValue": "Test value",
    "verifiedBy": ["Test Source"],
    "sources": []
  }'

# Update site
curl -X PATCH http://localhost:5000/api/sites/site-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "partially_damaged"}'

# Delete site
curl -X DELETE http://localhost:5000/api/sites/site-001
```

## Troubleshooting

### Database connection fails

```
❌ Failed to connect to database
```

**Solution:**
1. Ensure Docker Desktop is running
2. Start database: `npm run db:start`
3. Check logs: `npm run db:logs`
4. Verify port 5432 is available

### Port 5000 already in use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
1. Find process: `netstat -ano | findstr :5000`
2. Kill process or change `PORT` in `.env`

### Migration fails

```
Error: relation "heritage_sites" does not exist
```

**Solution:**
```bash
npm run db:reset     # Reset database
npm run db:setup     # Rerun setup
```

### Frontend can't connect to backend

1. Verify backend is running: `curl http://localhost:5000/health`
2. Check CORS settings in `server/index.js`
3. Verify `.env.development` has correct `VITE_API_URL`
4. Restart Vite dev server

## Production Deployment

This local backend is **for development only**. For production:

1. Use Supabase Cloud (recommended)
2. Or deploy Express server to a hosting service:
   - Railway
   - Render
   - Heroku
   - DigitalOcean App Platform

Migration path is straightforward - same database schema works with Supabase!

## Security Notes

- **Development only:** Default credentials are insecure
- **No authentication:** All endpoints are open
- **No rate limiting:** Add in production
- **CORS:** Currently allows all origins from localhost

## License

Educational/non-profit use only. See main project LICENSE.
