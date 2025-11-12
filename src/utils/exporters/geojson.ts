/**
 * GeoJSON exporter for Heritage Tracker
 *
 * Exports site data in GeoJSON format (RFC 7946) for use with:
 * - QGIS, ArcGIS, and other GIS tools
 * - Leaflet, Mapbox, and web mapping libraries
 * - Geospatial analysis tools
 *
 * @see https://geojson.org/
 * @see https://tools.ietf.org/html/rfc7946
 */

import type { Site } from "../../types";
import type { ExportConfig, ExportFunction } from "../../types/export";

/**
 * GeoJSON Feature properties (all site metadata except coordinates)
 */
interface GeoJSONProperties {
  id: string;
  name: string;
  nameArabic?: string;
  type: string;
  yearBuilt: string;
  status: string;
  dateDestroyed?: string;
  sourceUrl?: string;
  unescoListed?: boolean;
  religiousSignificance?: string;
  architecturalStyle?: string;
  artifactCount?: number;
  isUnique?: boolean;
  lastAssessmentDate?: string;
}

/**
 * GeoJSON Feature (single site)
 */
interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude] - GeoJSON spec
  };
  properties: GeoJSONProperties;
}

/**
 * GeoJSON FeatureCollection (complete export)
 */
interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
  // Optional metadata
  metadata?: {
    title: string;
    description: string;
    generated: string;
    source: string;
    license: string;
    siteCount: number;
  };
}

/**
 * Convert a single Site to a GeoJSON Feature
 *
 * IMPORTANT: GeoJSON uses [longitude, latitude] order (opposite of Leaflet)
 * Leaflet uses [lat, lng], GeoJSON uses [lng, lat]
 */
function siteToGeoJSONFeature(site: Site): GeoJSONFeature {
  const [lat, lng] = site.coordinates; // Leaflet format: [lat, lng]

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [lng, lat], // GeoJSON format: [lng, lat]
    },
    properties: {
      id: site.id,
      name: site.name,
      nameArabic: site.nameArabic,
      type: site.type,
      yearBuilt: site.yearBuilt,
      status: site.status,
      dateDestroyed: site.dateDestroyed,
      // sourceUrl: site.sourceUrl, // Property does not exist on current Site type
      unescoListed: site.unescoListed,
      // religiousSignificance: site.religiousSignificance,
      // architecturalStyle: site.architecturalStyle,
      artifactCount: site.artifactCount,
      isUnique: site.isUnique,
      // lastAssessmentDate: site.lastAssessmentDate,
    },
  };
}

/**
 * Export sites as GeoJSON FeatureCollection
 *
 * @param sites - Array of sites to export
 * @returns GeoJSON string (RFC 7946 compliant)
 */
export const exportGeoJSON: ExportFunction = (sites: Site[]): string => {
  const featureCollection: GeoJSONFeatureCollection = {
    type: "FeatureCollection",
    features: sites.map(siteToGeoJSONFeature),
    metadata: {
      title: "Gaza Heritage Sites",
      description: "Cultural heritage sites damaged or destroyed in Gaza",
      generated: new Date().toISOString(),
      source: "Heritage Tracker (https://yupitsleen.github.io/HeritageTracker/)",
      license: "Educational Fair Use - Attribution Required",
      siteCount: sites.length,
    },
  };

  // Pretty-print with 2-space indentation for readability
  return JSON.stringify(featureCollection, null, 2);
};

/**
 * GeoJSON export configuration
 */
export const GEOJSON_CONFIG: ExportConfig = {
  id: "geojson",
  label: "GeoJSON",
  labelArabic: "جيو جيسون",
  fileExtension: "geojson",
  mimeType: "application/geo+json",
  description: "Geographic data format for GIS tools (QGIS, ArcGIS, Leaflet)",
  icon: "🌍",
  recommended: {
    gis: true,
    analysis: false,
    api: false,
  },
};
