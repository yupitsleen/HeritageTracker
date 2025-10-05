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
 */
export interface GazaSite {
  id: string;
  name: string;
  nameArabic?: string;
  type: "mosque" | "church" | "archaeological" | "museum" | "historic-building";
  yearBuilt: string;
  coordinates: [number, number]; // [latitude, longitude] - Leaflet format
  status: "destroyed" | "heavily-damaged" | "damaged";
  dateDestroyed?: string;
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
