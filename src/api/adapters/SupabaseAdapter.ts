/**
 * Supabase Backend Adapter
 *
 * Connects to Supabase cloud database
 * Production-ready backend with Row-Level Security
 */

import { supabase, isSupabaseConfigured, getSupabaseClient } from '../supabaseClient';
import { applyQueryFilters } from '../queryHelpers';
import type { GazaSite } from '../../types';
import type { Database } from '../database.types';
import type { PaginatedResponse, SitesQueryParams } from '../types';
import type { BackendAdapter } from './types';

/**
 * Convert Supabase row to GazaSite format
 * Handles PostgreSQL -> TypeScript type conversions
 */
function convertSupabaseRow(row: Record<string, unknown>): GazaSite {
  return {
    id: row.id as string,
    name: row.name as string,
    nameArabic: row.name_arabic as string | undefined,
    type: row.type as string,
    yearBuilt: row.year_built as string,
    yearBuiltIslamic: row.year_built_islamic as string | undefined,
    coordinates: (row.coordinates as { coordinates: [number, number] }).coordinates,
    status: row.status as string,
    dateDestroyed: row.date_destroyed as string | undefined,
    dateDestroyedIslamic: row.date_destroyed_islamic as string | undefined,
    lastUpdated: row.last_updated as string,
    description: row.description as string,
    historicalSignificance: row.historical_significance as string,
    culturalValue: row.cultural_value as string,
    verifiedBy: row.verified_by as string[],
    images: row.images as GazaSite['images'],
    sources: row.sources as GazaSite['sources'],
    unescoListed: row.unesco_listed as boolean | undefined,
    artifactCount: row.artifact_count as number | undefined,
    isUnique: row.is_unique as boolean | undefined,
    religiousSignificance: row.religious_significance as boolean | undefined,
    communityGatheringPlace: row.community_gathering_place as boolean | undefined,
    historicalEvents: row.historical_events as string[] | undefined,
  };
}

/**
 * Supabase adapter implementation
 * Uses Supabase client for cloud database access
 */
export class SupabaseAdapter implements BackendAdapter {
  async getAllSites(params?: SitesQueryParams): Promise<GazaSite[]> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }

    let query = supabase.from('heritage_sites').select('*');

    // Apply common filters using helper
    query = applyQueryFilters(query, params);

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch sites: ${error.message}`);
    }

    return data.map(convertSupabaseRow);
  }

  async getSitesPaginated(params?: SitesQueryParams): Promise<PaginatedResponse<GazaSite>> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured. Pagination only available with Supabase backend.');
    }

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 50;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('heritage_sites')
      .select('*', { count: 'exact' })
      .range(from, to);

    // Apply common filters using helper
    query = applyQueryFilters(query, params);

    // Apply sorting
    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    } else {
      query = query.order('name', { ascending: true });
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase pagination error:', error);
      throw new Error(`Failed to fetch paginated sites: ${error.message}`);
    }

    return {
      data: data.map(convertSupabaseRow),
      pagination: {
        page,
        pageSize,
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async getSiteById(id: string): Promise<GazaSite> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('heritage_sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(`Site with ID "${id}" not found`);
      }
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch site: ${error.message}`);
    }

    return convertSupabaseRow(data);
  }

  async getSitesNearLocation(lat: number, lng: number, radiusKm: number): Promise<GazaSite[]> {
    const client = getSupabaseClient();

    const { data, error } = await client.rpc(
      'sites_near_point' as never,
      {
        lat,
        lng,
        radius_km: radiusKm,
      } as never
    );

    if (error) {
      console.error('Geospatial query error:', error);
      throw new Error(`Failed to find nearby sites: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return (data as Database['public']['Tables']['heritage_sites']['Row'][]).map(convertSupabaseRow);
  }

  async createSite(site: Omit<GazaSite, 'id'>): Promise<GazaSite> {
    const client = getSupabaseClient();

    const insertData = {
      name: site.name,
      name_arabic: site.nameArabic,
      type: site.type,
      year_built: site.yearBuilt,
      year_built_islamic: site.yearBuiltIslamic,
      coordinates: `POINT(${site.coordinates[1]} ${site.coordinates[0]})`, // PostGIS format
      status: site.status,
      date_destroyed: site.dateDestroyed,
      date_destroyed_islamic: site.dateDestroyedIslamic,
      description: site.description,
      historical_significance: site.historicalSignificance,
      cultural_value: site.culturalValue,
      verified_by: site.verifiedBy,
      images: site.images ?? null,
      sources: site.sources as unknown,
      unesco_listed: site.unescoListed,
      artifact_count: site.artifactCount,
      is_unique: site.isUnique,
      religious_significance: site.religiousSignificance,
      community_gathering_place: site.communityGatheringPlace,
      historical_events: site.historicalEvents,
    } as unknown as Database['public']['Tables']['heritage_sites']['Insert'];

    const { data, error } = await client
      .from('heritage_sites')
      .insert(insertData as never)
      .select()
      .single();

    if (error) {
      console.error('Failed to create site:', error);
      throw new Error(`Failed to create site: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned after site creation');
    }

    return convertSupabaseRow(data);
  }

  async updateSite(id: string, updates: Partial<GazaSite>): Promise<GazaSite> {
    const client = getSupabaseClient();

    // Convert camelCase to snake_case for database
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.nameArabic !== undefined) dbUpdates.name_arabic = updates.nameArabic;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.description) dbUpdates.description = updates.description;
    // ... add more fields as needed

    const { data, error } = await client
      .from('heritage_sites')
      .update(dbUpdates as never)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Failed to update site ${id}:`, error);
      throw new Error(`Failed to update site: ${error.message}`);
    }

    return convertSupabaseRow(data);
  }

  async deleteSite(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase.from('heritage_sites').delete().eq('id', id);

    if (error) {
      console.error(`Failed to delete site ${id}:`, error);
      throw new Error(`Failed to delete site: ${error.message}`);
    }
  }
}
