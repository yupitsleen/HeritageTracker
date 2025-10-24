/**
 * Marker Size Configuration Types
 *
 * Defines types for extensible marker size configuration with responsive breakpoints.
 */

/**
 * Marker size dimensions for Leaflet icon configuration
 *
 * @property iconSize - Icon dimensions [width, height]
 * @property iconAnchor - Icon anchor point [x, y] (point of the icon which corresponds to marker's location)
 * @property popupAnchor - Popup anchor point [x, y] (point from which popup should open relative to iconAnchor)
 * @property shadowSize - Shadow dimensions [width, height]
 */
export interface MarkerSizeDimensions {
  iconSize: [number, number];
  iconAnchor: [number, number];
  popupAnchor: [number, number];
  shadowSize: [number, number];
}

/**
 * Marker size configuration with responsive breakpoints
 *
 * Allows different marker sizes at various screen widths for improved
 * mobile and desktop experiences.
 *
 * @property id - Unique identifier for this size configuration
 * @property label - Human-readable label
 * @property labelArabic - Optional Arabic label
 * @property isDefault - Whether this is the default configuration
 * @property default - Default marker size (normal state)
 * @property highlighted - Highlighted/selected marker size
 * @property mobile - Optional mobile breakpoint configuration (width < 768px)
 * @property tablet - Optional tablet breakpoint configuration (768px ≤ width < 1024px)
 * @property desktop - Optional desktop breakpoint configuration (width ≥ 1024px)
 * @property description - Optional description
 * @property metadata - Optional metadata (author, version, notes)
 *
 * @example
 * ```typescript
 * const responsiveMarkers: MarkerSizeConfig = {
 *   id: "responsive-v1",
 *   label: "Responsive Markers",
 *   default: {
 *     iconSize: [12, 20],
 *     iconAnchor: [6, 20],
 *     popupAnchor: [0, -17],
 *     shadowSize: [20, 20],
 *   },
 *   highlighted: {
 *     iconSize: [25, 41],
 *     iconAnchor: [12, 41],
 *     popupAnchor: [1, -34],
 *     shadowSize: [41, 41],
 *   },
 *   mobile: {
 *     default: { iconSize: [16, 26], ... },
 *     highlighted: { iconSize: [32, 52], ... },
 *   },
 * };
 * ```
 */
export interface MarkerSizeConfig {
  id: string;
  label: string;
  labelArabic?: string;
  isDefault?: boolean;
  default: MarkerSizeDimensions;
  highlighted: MarkerSizeDimensions;
  mobile?: {
    default: MarkerSizeDimensions;
    highlighted: MarkerSizeDimensions;
  };
  tablet?: {
    default: MarkerSizeDimensions;
    highlighted: MarkerSizeDimensions;
  };
  desktop?: {
    default: MarkerSizeDimensions;
    highlighted: MarkerSizeDimensions;
  };
  description?: string;
  metadata?: {
    author?: string;
    version?: string;
    notes?: string;
  };
}

/**
 * Registry of marker size configurations
 * Maps configuration ID to MarkerSizeConfig object
 */
export interface MarkerSizeRegistry {
  [id: string]: MarkerSizeConfig;
}

/**
 * Screen breakpoint type
 */
export type Breakpoint = "mobile" | "tablet" | "desktop";
