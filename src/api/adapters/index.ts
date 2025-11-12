/**
 * Backend Adapter Factory
 *
 * Automatically selects the correct adapter based on environment variables
 * Provides a single instance (singleton pattern) for consistent behavior
 */

import { MockAdapter } from './MockAdapter';
import { LocalBackendAdapter } from './LocalBackendAdapter';
import { SupabaseAdapter } from './SupabaseAdapter';
import type { BackendAdapter } from './types';
import { logger } from '../../utils/logger';

/**
 * Get the appropriate backend adapter based on environment configuration
 * Priority: Mock > Local Backend > Supabase
 */
function createAdapter(): BackendAdapter {
  // Priority 1: Mock API (fastest, no setup required)
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    logger.info('📦 Using mock adapter for development');
    return new MockAdapter();
  }

  // Priority 2: Local Backend (realistic development)
  if (import.meta.env.VITE_USE_LOCAL_BACKEND === 'true') {
    logger.info('🔧 Using local backend adapter');
    return new LocalBackendAdapter();
  }

  // Priority 3: Supabase Cloud (production)
  logger.info('☁️ Using Supabase cloud adapter');
  return new SupabaseAdapter();
}

/**
 * Singleton adapter instance
 * All API calls use this same instance
 */
export const adapter: BackendAdapter = createAdapter();

/**
 * Export adapter types for external use
 */
export type { BackendAdapter } from './types';
export { MockAdapter, LocalBackendAdapter, SupabaseAdapter };
