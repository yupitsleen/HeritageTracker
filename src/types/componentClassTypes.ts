/**
 * Component Class Configuration Types
 *
 * Defines types for extensible component Tailwind class configuration.
 */

/**
 * Component class configuration
 *
 * Defines customizable Tailwind classes for UI components, allowing
 * different design systems without code changes.
 *
 * @property id - Unique identifier for this class configuration
 * @property label - Human-readable label
 * @property labelArabic - Optional Arabic label
 * @property isDefault - Whether this is the default configuration
 * @property spacing - Padding and gap classes
 * @property typography - Text size and weight classes
 * @property button - Button size and padding classes
 * @property table - Table cell and header classes
 * @property header - Header component classes
 * @property filterBar - Filter bar component classes
 * @property modal - Modal component classes
 * @property layout - Layout dimension constants
 * @property description - Optional description
 * @property metadata - Optional metadata (author, version, notes)
 *
 * @example
 * ```typescript
 * const compactDesign: ComponentClassConfig = {
 *   id: "compact",
 *   label: "Compact Design",
 *   spacing: { xs: "p-1", sm: "p-2", md: "p-3", lg: "p-4" },
 *   typography: { xs: "text-[10px]", sm: "text-xs", base: "text-sm" },
 *   // ... other categories
 * };
 * ```
 */
export interface ComponentClassConfig {
  id: string;
  label: string;
  labelArabic?: string;
  isDefault?: boolean;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    gapXs: string;
    gapSm: string;
    gapMd: string;
    gapLg: string;
  };
  typography: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  button: {
    xs: string;
    sm: string;
    md: string;
  };
  table: {
    cellX: string;
    cellY: string;
    headerX: string;
    headerY: string;
    text: string;
    headerText: string;
  };
  header: {
    py: string;
    title: string;
    subtitle: string;
    buttonGap: string;
  };
  filterBar: {
    padding: string;
    inputHeight: string;
    inputText: string;
    inputPadding: string;
    buttonPadding: string;
    gap: string;
  };
  modal: {
    padding: string;
    headerPadding: string;
    contentPadding: string;
    gap: string;
  };
  layout: {
    FILTER_BAR_HEIGHT: number;
    TIMELINE_HEIGHT: number;
    FOOTER_CLEARANCE: number;
    MAPS_HEIGHT_OFFSET: number;
  };
  description?: string;
  metadata?: {
    author?: string;
    version?: string;
    notes?: string;
  };
}

/**
 * Registry of component class configurations
 * Maps configuration ID to ComponentClassConfig object
 */
export interface ComponentClassRegistry {
  [id: string]: ComponentClassConfig;
}
