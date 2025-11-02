/**
 * Heritage Tracker - Local Backend Server
 *
 * Express REST API server for local development
 * Connects to PostgreSQL database and serves heritage sites data
 *
 * Start: npm run server:start
 * Dev: npm run server:dev (with auto-reload)
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import sql, { testConnection } from './db.js';
import * as sitesController from './controllers/sitesController.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import {
  validateSiteBody,
  validateSiteId,
  validatePagination,
  validateNearbyParams,
} from './middleware/validator.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// Middleware
// ============================================================================

// CORS - Allow frontend to access API
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Rate limiting - General API protection
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later',
});

// Stricter rate limiting for write operations (POST, PATCH, DELETE)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many write requests from this IP, please try again later',
});

// Apply general rate limiter to all API routes
app.use('/api/', generalLimiter);

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ============================================================================
// Health Check Routes
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Heritage Tracker API',
  });
});

app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Heritage Tracker API',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

// ============================================================================
// API Routes
// ============================================================================

// GET /api/sites - Get all sites (with optional filters)
app.get('/api/sites', validatePagination, sitesController.getAllSites);

// GET /api/sites/paginated - Get paginated sites
app.get('/api/sites/paginated', validatePagination, sitesController.getPaginatedSites);

// GET /api/sites/stats - Get site statistics
app.get('/api/sites/stats', sitesController.getSiteStatistics);

// GET /api/sites/nearby - Get sites near a point
app.get('/api/sites/nearby', validateNearbyParams, sitesController.getSitesNearby);

// GET /api/sites/:id - Get single site by ID
app.get('/api/sites/:id', validateSiteId, sitesController.getSiteById);

// POST /api/sites - Create new site
app.post('/api/sites', strictLimiter, validateSiteBody(false), sitesController.createSite);

// PATCH /api/sites/:id - Update existing site
app.patch(
  '/api/sites/:id',
  strictLimiter,
  validateSiteId,
  validateSiteBody(true),
  sitesController.updateSite
);

// DELETE /api/sites/:id - Delete site
app.delete('/api/sites/:id', strictLimiter, validateSiteId, sitesController.deleteSite);

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================================================
// Server Startup
// ============================================================================

async function startServer() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      console.error('Make sure PostgreSQL is running: npm run db:start');
      process.exit(1);
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log('\n✅ Heritage Tracker API Server');
      console.log(`   Port: ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Frontend URL: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      console.log('\n📚 API Endpoints:');
      console.log(`   GET    /api/sites              - Get all sites`);
      console.log(`   GET    /api/sites/paginated    - Get paginated sites`);
      console.log(`   GET    /api/sites/stats        - Get statistics`);
      console.log(`   GET    /api/sites/nearby       - Get nearby sites`);
      console.log(`   GET    /api/sites/:id          - Get site by ID`);
      console.log(`   POST   /api/sites              - Create site`);
      console.log(`   PATCH  /api/sites/:id          - Update site`);
      console.log(`   DELETE /api/sites/:id          - Delete site`);
      console.log('\n🔗 Health Check:');
      console.log(`   http://localhost:${PORT}/health`);
      console.log(`   http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down server...');
  await sql.end();
  console.log('Database connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\nShutting down server...');
  await sql.end();
  console.log('Database connection closed');
  process.exit(0);
});

// Start the server
startServer();
