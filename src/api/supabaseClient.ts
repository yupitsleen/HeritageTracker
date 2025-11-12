/**
 * Supabase Client for Heritage Tracker
 *
 * Centralized Supabase connection with TypeScript support.
 * Uses environment variables for configuration.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { logger } from '../utils/logger';

/**
 * Get Supabase configuration from environment variables
 */
const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    logger.warn(
      'Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    );
  }

  return { url, anonKey };
};

/**
 * Create Supabase client instance
 *
 * This client provides:
 * - Type-safe database queries
 * - Authentication
 * - Real-time subscriptions
 * - File storage
 */
export function createSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    // Return null if not configured (development with mock data)
    return null;
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

/**
 * Supabase client singleton
 *
 * Use this throughout the app for database queries.
 *
 * @example
 * ```typescript
 * import { supabase } from './api/supabaseClient';
 *
 * const { data, error } = await supabase
 *   .from('heritage_sites')
 *   .select('*');
 * ```
 */
export const supabase = createSupabaseClient();

/**
 * Check if Supabase is configured and should be used
 */
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null && import.meta.env.VITE_USE_MOCK_API !== 'true';
};

/**
 * Get Supabase client with null check
 *
 * Throws error if not configured (for production).
 * Use this in API functions that require Supabase.
 */
export const getSupabaseClient = (): ReturnType<typeof createClient<Database>> => {
  if (!supabase) {
    throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }
  return supabase;
};
