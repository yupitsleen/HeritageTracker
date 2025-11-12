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
import { requestIdMiddleware } from './middleware/requestId.js';
import { loggerMiddleware } from './middleware/logger.js';
import logger from './utils/logger.js';

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

// Request ID tracking - Assign unique ID to each request
app.use(requestIdMiddleware);

// Request logging - Log all requests with timing
app.use(loggerMiddleware);

// Rate limiting configuration (configurable via environment variables)
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes default
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10); // 100 requests default
const RATE_LIMIT_STRICT_MAX = parseInt(process.env.RATE_LIMIT_STRICT_MAX || '20', 10); // 20 requests default for write ops

// Rate limiting - General API protection
const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later',
});

// Stricter rate limiting for write operations (POST, PATCH, DELETE)
const strictLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_STRICT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many write requests from this IP, please try again later',
});

// Apply general rate limiter to all API routes
app.use('/api/', generalLimiter);

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
    logger.info('Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      logger.error('Failed to connect to database');
      logger.error('Make sure PostgreSQL is running: npm run db:start');
      process.exit(1);
    }

    // Start Express server
    app.listen(PORT, () => {
      logger.info({
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        frontendUrl: process.env.CORS_ORIGIN || 'http://localhost:5173',
      }, 'Heritage Tracker API Server started');

      logger.info('API Endpoints:');
      logger.info('  GET    /api/sites              - Get all sites');
      logger.info('  GET    /api/sites/paginated    - Get paginated sites');
      logger.info('  GET    /api/sites/stats        - Get statistics');
      logger.info('  GET    /api/sites/nearby       - Get nearby sites');
      logger.info('  GET    /api/sites/:id          - Get site by ID');
      logger.info('  POST   /api/sites              - Create site');
      logger.info('  PATCH  /api/sites/:id          - Update site');
      logger.info('  DELETE /api/sites/:id          - Delete site');
      logger.info({
        healthCheck: `http://localhost:${PORT}/health`,
        apiHealth: `http://localhost:${PORT}/api/health`,
      }, 'Health check endpoints ready');
    });
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  await sql.end();
  logger.info('Database connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  await sql.end();
  logger.info('Database connection closed');
  process.exit(0);
});

// Start the server
startServer();
