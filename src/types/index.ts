/**
 * Core type definitions for Heritage Tracker MVP
 * Only includes types we're actively using - following JIT principle
 */

/**
 * Source documentation reference
 */
export interface Source {
  organization: string;
  title: string;
  url?: string;
  date?: string;
  type: "official" | "academic" | "journalism" | "documentation";
}

/**
 * Gaza heritage site (MVP simplified schema)
 *
 * Islamic Calendar Dates:
 * - yearBuiltIslamic and dateDestroyedIslamic are manually entered and should be
 *   verified using Islamic calendar conversion tools before data entry
 * - These dates are stored as formatted strings for display purposes
 * - All filtering logic uses Gregorian dates for consistency
 */
export interface GazaSite {
  id: string;
  name: string;
  nameArabic?: string;
  type: "mosque" | "church" | "archaeological" | "museum" | "historic-building";
  yearBuilt: string;
  yearBuiltIslamic?: string; // Manually verified Islamic calendar date
  coordinates: [number, number]; // [latitude, longitude] - Leaflet format
  status: "destroyed" | "heavily-damaged" | "damaged";
  dateDestroyed?: string;
  dateDestroyedIslamic?: string; // Manually verified Islamic calendar date
  description: string;
  historicalSignificance: string;
  culturalValue: string;
  verifiedBy: string[];
  images?: {
    before?: string;
    after?: string;
    satellite?: string;
  };
  sources: Source[];
}
