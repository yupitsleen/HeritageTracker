/**
 * Component Class Configuration Registry
 *
 * Central registry for component Tailwind class configurations.
 * Allows switching between different design systems (compact, spacious, etc.)
 * without code changes.
 *
 * @example
 * ```typescript
 * // Get current design system classes
 * const classes = getDefaultComponentClassConfig();
 * const cellPadding = classes.table.cellX; // "px-1"
 *
 * // Register custom design system
 * registerComponentClassConfig({
 *   id: "spacious",
 *   label: "Spacious Design",
 *   spacing: { xs: "p-2", sm: "p-4", md: "p-6", lg: "p-8" },
 *   // ... other categories
 * });
 * ```
 */

import type {
  ComponentClassConfig,
  ComponentClassRegistry,
} from "../types/componentClassTypes";

/**
 * Global component class configuration registry
 */
export const COMPONENT_CLASS_REGISTRY: ComponentClassRegistry = {
  compact: {
    id: "compact",
    label: "Compact Design System",
    labelArabic: "نظام التصميم المدمج",
    isDefault: true,
    spacing: {
      xs: "p-1",
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
      gapXs: "gap-1",
      gapSm: "gap-2",
      gapMd: "gap-3",
      gapLg: "gap-4",
    },
    typography: {
      xs: "text-[10px]",
      sm: "text-xs",
      base: "text-sm",
      lg: "text-base",
      xl: "text-xl",
    },
    button: {
      xs: "px-2 py-0.5 text-xs",
      sm: "px-3 py-1 text-xs",
      md: "px-4 py-1.5 text-sm",
    },
    table: {
      cellX: "px-1",
      cellY: "py-1.5",
      headerX: "px-1",
      headerY: "py-2",
      text: "text-xs",
      headerText: "text-xs font-semibold",
    },
    header: {
      py: "py-2",
      title: "text-lg md:text-xl",
      subtitle: "text-[10px] md:text-xs",
      buttonGap: "gap-2",
    },
    filterBar: {
      padding: "p-2",
      inputHeight: "h-7",
      inputText: "text-xs",
      inputPadding: "px-2 py-1",
      buttonPadding: "px-2 py-1",
      gap: "gap-2",
    },
    modal: {
      padding: "p-4",
      headerPadding: "p-3",
      contentPadding: "p-3",
      gap: "gap-3",
    },
    layout: {
      FILTER_BAR_HEIGHT: 80,
      TIMELINE_HEIGHT: 100,
      FOOTER_CLEARANCE: 24,
      MAPS_HEIGHT_OFFSET: 185,
    },
    description:
      "Enterprise data-dense UI spacing and typography for desktop-first utility",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes:
        "Compact design maximizes information density for internal inventory/dashboard aesthetic",
    },
  },
};

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Register a new component class configuration
 *
 * @param config - The component class configuration to register
 *
 * @example
 * ```typescript
 * registerComponentClassConfig({
 *   id: "spacious",
 *   label: "Spacious Design",
 *   spacing: { xs: "p-2", sm: "p-4", md: "p-6", lg: "p-8" },
 *   // ... other categories
 * });
 * ```
 */
export function registerComponentClassConfig(
  config: ComponentClassConfig
): void {
  COMPONENT_CLASS_REGISTRY[config.id] = config;
}

/**
 * Get all component class configurations
 *
 * @returns Array of all registered component class configurations
 *
 * @example
 * ```typescript
 * const configs = getAllComponentClassConfigs();
 * console.log(`Found ${configs.length} design systems`);
 * ```
 */
export function getAllComponentClassConfigs(): ComponentClassConfig[] {
  return Object.values(COMPONENT_CLASS_REGISTRY);
}

/**
 * Get a component class configuration by ID
 *
 * @param id - Configuration ID
 * @returns The component class configuration, or undefined if not found
 *
 * @example
 * ```typescript
 * const config = getComponentClassConfig("compact");
 * if (config) {
 *   console.log(`Cell padding: ${config.table.cellX}`);
 * }
 * ```
 */
export function getComponentClassConfig(
  id: string
): ComponentClassConfig | undefined {
  return COMPONENT_CLASS_REGISTRY[id];
}

/**
 * Get the default component class configuration
 *
 * @returns The default component class configuration
 *
 * @example
 * ```typescript
 * const defaultConfig = getDefaultComponentClassConfig();
 * const spacing = defaultConfig.spacing;
 * ```
 */
export function getDefaultComponentClassConfig(): ComponentClassConfig {
  const defaultConfig = Object.values(COMPONENT_CLASS_REGISTRY).find(
    (config) => config.isDefault
  );

  // Fallback to first config if no default is set
  return defaultConfig || Object.values(COMPONENT_CLASS_REGISTRY)[0];
}

/**
 * Update an existing component class configuration
 *
 * @param id - Configuration ID
 * @param updates - Partial configuration to merge with existing
 * @throws Error if configuration not found
 *
 * @example
 * ```typescript
 * updateComponentClassConfig("compact", {
 *   spacing: { xs: "p-2", sm: "p-3", md: "p-4", lg: "p-6" },
 * });
 * ```
 */
export function updateComponentClassConfig(
  id: string,
  updates: Partial<ComponentClassConfig>
): void {
  if (!COMPONENT_CLASS_REGISTRY[id]) {
    throw new Error(
      `Component class configuration '${id}' not found in registry`
    );
  }
  COMPONENT_CLASS_REGISTRY[id] = {
    ...COMPONENT_CLASS_REGISTRY[id],
    ...updates,
  };
}

/**
 * Remove a component class configuration from the registry
 *
 * @param id - Configuration ID to remove
 *
 * @example
 * ```typescript
 * removeComponentClassConfig("custom-design");
 * ```
 */
export function removeComponentClassConfig(id: string): void {
  delete COMPONENT_CLASS_REGISTRY[id];
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all component class configuration IDs
 *
 * @returns Array of all configuration IDs
 *
 * @example
 * ```typescript
 * const ids = getComponentClassConfigIds();
 * console.log(`Available configs: ${ids.join(", ")}`);
 * ```
 */
export function getComponentClassConfigIds(): string[] {
  return Object.keys(COMPONENT_CLASS_REGISTRY);
}

/**
 * Check if a component class configuration ID exists in the registry
 *
 * @param id - Configuration ID to check
 * @returns True if configuration exists, false otherwise
 *
 * @example
 * ```typescript
 * if (isValidComponentClassConfig("compact")) {
 *   console.log("Configuration exists");
 * }
 * ```
 */
export function isValidComponentClassConfig(id: string): boolean {
  return id in COMPONENT_CLASS_REGISTRY;
}

/**
 * Get component class configuration label in specified language
 *
 * @param id - Configuration ID
 * @param locale - Language code ('en' or 'ar')
 * @returns The label in the requested language, or English fallback, or the ID
 *
 * @example
 * ```typescript
 * const label = getComponentClassConfigLabel("compact", "ar");
 * console.log(label); // "نظام التصميم المدمج"
 * ```
 */
export function getComponentClassConfigLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const config = COMPONENT_CLASS_REGISTRY[id];
  if (!config) return id;

  if (locale === "ar" && config.labelArabic) {
    return config.labelArabic;
  }

  return config.label;
}

/**
 * Get classes for a specific category
 *
 * @param category - Category name (spacing, typography, button, etc.)
 * @param id - Configuration ID (defaults to default configuration)
 * @returns The classes for the specified category
 *
 * @example
 * ```typescript
 * const spacing = getCategoryClasses("spacing");
 * const tablePadding = spacing.sm; // "p-2"
 * ```
 */
export function getCategoryClasses<
  K extends keyof Omit<
    ComponentClassConfig,
    "id" | "label" | "labelArabic" | "isDefault" | "description" | "metadata"
  >
>(category: K, id?: string): ComponentClassConfig[K] {
  const config = id
    ? getComponentClassConfig(id)
    : getDefaultComponentClassConfig();
  if (!config) {
    throw new Error(`Component class config not found: ${id}`);
  }
  return config[category];
}

// ============================================================================
// Backward Compatibility
// ============================================================================

/**
 * @deprecated Use getDefaultComponentClassConfig() instead
 * Exported for backward compatibility with existing code
 */
export const DEFAULT_COMPONENT_CLASS_CONFIG =
  getDefaultComponentClassConfig();

/**
 * Legacy exports from compactDesign.ts
 * @deprecated Use getCategoryClasses("spacing") instead
 */
export const COMPACT_SPACING = getCategoryClasses("spacing", "compact");

/**
 * Legacy exports from compactDesign.ts
 * @deprecated Use getCategoryClasses("typography") instead
 */
export const COMPACT_TYPOGRAPHY = getCategoryClasses("typography", "compact");

/**
 * Legacy exports from compactDesign.ts
 * @deprecated Use getCategoryClasses("button") instead
 */
export const COMPACT_BUTTON = getCategoryClasses("button", "compact");

/**
 * Legacy exports from compactDesign.ts
 * @deprecated Use getCategoryClasses("table") instead
 */
export const COMPACT_TABLE = getCategoryClasses("table", "compact");

/**
 * Legacy exports from compactDesign.ts
 * @deprecated Use getCategoryClasses("header") instead
 */
export const COMPACT_HEADER = getCategoryClasses("header", "compact");

/**
 * Legacy exports from compactDesign.ts
 * @deprecated Use getCategoryClasses("filterBar") instead
 */
export const COMPACT_FILTER_BAR = getCategoryClasses("filterBar", "compact");

/**
 * Legacy exports from compactDesign.ts
 * @deprecated Use getCategoryClasses("modal") instead
 */
export const COMPACT_MODAL = getCategoryClasses("modal", "compact");

/**
 * Legacy exports from compactDesign.ts
 * @deprecated Use getCategoryClasses("layout") instead
 */
export const COMPACT_LAYOUT = getCategoryClasses("layout", "compact");
