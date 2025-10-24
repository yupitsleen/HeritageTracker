/**
 * Marker Icon CDN Configuration Types
 *
 * Defines types for extensible marker icon CDN URL configuration.
 */

/**
 * Marker icon CDN configuration
 *
 * Defines CDN URLs for marker icons and shadows, allowing for custom icon sets
 * or alternative CDN sources without code changes.
 *
 * @property id - Unique identifier for this icon configuration
 * @property label - Human-readable label
 * @property labelArabic - Optional Arabic label
 * @property isDefault - Whether this is the default configuration
 * @property iconBaseUrl - Base URL for marker icon images (expects color parameter)
 * @property shadowUrl - URL for marker shadow image
 * @property description - Optional description of the icon set
 * @property metadata - Optional metadata (author, version, notes)
 *
 * @example
 * ```typescript
 * const leafletColorMarkers: MarkerIconConfig = {
 *   id: "leaflet-color-markers",
 *   label: "Leaflet Color Markers",
 *   iconBaseUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img",
 *   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
 * };
 * ```
 */
export interface MarkerIconConfig {
  id: string;
  label: string;
  labelArabic?: string;
  isDefault?: boolean;
  iconBaseUrl: string;
  shadowUrl: string;
  description?: string;
  metadata?: {
    author?: string;
    version?: string;
    notes?: string;
  };
}

/**
 * Registry of marker icon configurations
 * Maps configuration ID to MarkerIconConfig object
 */
export interface MarkerIconRegistry {
  [id: string]: MarkerIconConfig;
}
