/**
 * Frame Rate Configuration Registry
 *
 * Central registry for frame rate configurations.
 * Defines target FPS and frame intervals for animations.
 *
 * @example
 * ```typescript
 * // Get current frame rate
 * const config = getDefaultFrameRateConfig();
 * const interval = config.frameInterval; // 16ms for 60fps
 *
 * // Register custom frame rate
 * registerFrameRateConfig({
 *   id: "fps-120",
 *   label: "120 FPS",
 *   fps: 120,
 *   frameInterval: 8, // ~8ms per frame
 * });
 * ```
 */

import type {
  FrameRateConfig,
  FrameRateRegistry,
} from "../types/frameRateTypes";

/**
 * Global frame rate configuration registry
 */
export const FRAME_RATE_REGISTRY: FrameRateRegistry = {
  "fps-30": {
    id: "fps-30",
    label: "30 FPS",
    labelArabic: "٣٠ إطارًا في الثانية",
    fps: 30,
    frameInterval: 33, // ~33ms per frame
    description: "30 frames per second - acceptable for mobile devices",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes:
        "Lower frame rate for better performance on mobile and low-end devices",
    },
  },
  "fps-60": {
    id: "fps-60",
    label: "60 FPS",
    labelArabic: "٦٠ إطارًا في الثانية",
    isDefault: true,
    fps: 60,
    frameInterval: 16, // ~16ms per frame
    description: "60 frames per second - smooth desktop experience",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes:
        "Standard frame rate for smooth animations on modern desktop browsers",
    },
  },
};

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Register a new frame rate configuration
 *
 * @param config - The frame rate configuration to register
 *
 * @example
 * ```typescript
 * registerFrameRateConfig({
 *   id: "fps-120",
 *   label: "120 FPS",
 *   fps: 120,
 *   frameInterval: 8,
 * });
 * ```
 */
export function registerFrameRateConfig(config: FrameRateConfig): void {
  FRAME_RATE_REGISTRY[config.id] = config;
}

/**
 * Get all frame rate configurations
 *
 * @returns Array of all registered frame rate configurations
 *
 * @example
 * ```typescript
 * const configs = getAllFrameRateConfigs();
 * console.log(`Found ${configs.length} frame rate configurations`);
 * ```
 */
export function getAllFrameRateConfigs(): FrameRateConfig[] {
  return Object.values(FRAME_RATE_REGISTRY);
}

/**
 * Get a frame rate configuration by ID
 *
 * @param id - Configuration ID
 * @returns The frame rate configuration, or undefined if not found
 *
 * @example
 * ```typescript
 * const config = getFrameRateConfig("fps-60");
 * if (config) {
 *   console.log(`Frame interval: ${config.frameInterval}ms`);
 * }
 * ```
 */
export function getFrameRateConfig(id: string): FrameRateConfig | undefined {
  return FRAME_RATE_REGISTRY[id];
}

/**
 * Get the default frame rate configuration
 *
 * @returns The default frame rate configuration
 *
 * @example
 * ```typescript
 * const defaultConfig = getDefaultFrameRateConfig();
 * const fps = defaultConfig.fps; // 60
 * ```
 */
export function getDefaultFrameRateConfig(): FrameRateConfig {
  const defaultConfig = Object.values(FRAME_RATE_REGISTRY).find(
    (config) => config.isDefault
  );

  // Fallback to first config if no default is set
  return defaultConfig || Object.values(FRAME_RATE_REGISTRY)[0];
}

/**
 * Update an existing frame rate configuration
 *
 * @param id - Configuration ID
 * @param updates - Partial configuration to merge with existing
 * @throws Error if configuration not found
 *
 * @example
 * ```typescript
 * updateFrameRateConfig("fps-60", {
 *   frameInterval: 17, // Slightly lower frame rate
 * });
 * ```
 */
export function updateFrameRateConfig(
  id: string,
  updates: Partial<FrameRateConfig>
): void {
  if (!FRAME_RATE_REGISTRY[id]) {
    throw new Error(`Frame rate configuration '${id}' not found in registry`);
  }
  FRAME_RATE_REGISTRY[id] = { ...FRAME_RATE_REGISTRY[id], ...updates };
}

/**
 * Remove a frame rate configuration from the registry
 *
 * @param id - Configuration ID to remove
 *
 * @example
 * ```typescript
 * removeFrameRateConfig("fps-120");
 * ```
 */
export function removeFrameRateConfig(id: string): void {
  delete FRAME_RATE_REGISTRY[id];
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all frame rate configuration IDs
 *
 * @returns Array of all configuration IDs
 *
 * @example
 * ```typescript
 * const ids = getFrameRateConfigIds();
 * console.log(`Available configs: ${ids.join(", ")}`);
 * ```
 */
export function getFrameRateConfigIds(): string[] {
  return Object.keys(FRAME_RATE_REGISTRY);
}

/**
 * Check if a frame rate configuration ID exists in the registry
 *
 * @param id - Configuration ID to check
 * @returns True if configuration exists, false otherwise
 *
 * @example
 * ```typescript
 * if (isValidFrameRateConfig("fps-60")) {
 *   console.log("Configuration exists");
 * }
 * ```
 */
export function isValidFrameRateConfig(id: string): boolean {
  return id in FRAME_RATE_REGISTRY;
}

/**
 * Get frame rate configuration label in specified language
 *
 * @param id - Configuration ID
 * @param locale - Language code ('en' or 'ar')
 * @returns The label in the requested language, or English fallback, or the ID
 *
 * @example
 * ```typescript
 * const label = getFrameRateConfigLabel("fps-60", "ar");
 * console.log(label); // "٦٠ إطارًا في الثانية"
 * ```
 */
export function getFrameRateConfigLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const config = FRAME_RATE_REGISTRY[id];
  if (!config) return id;

  if (locale === "ar" && config.labelArabic) {
    return config.labelArabic;
  }

  return config.label;
}

/**
 * Get frame interval for a configuration
 *
 * @param id - Configuration ID (defaults to default configuration)
 * @returns The frame interval in milliseconds
 *
 * @example
 * ```typescript
 * const interval = getFrameInterval(); // 16 (for 60fps default)
 * const interval = getFrameInterval("fps-30"); // 33
 * ```
 */
export function getFrameInterval(id?: string): number {
  const config = id
    ? getFrameRateConfig(id)
    : getDefaultFrameRateConfig();
  return config?.frameInterval || 16; // Default to 60fps if not found
}

/**
 * Get frames per second for a configuration
 *
 * @param id - Configuration ID (defaults to default configuration)
 * @returns The frames per second
 *
 * @example
 * ```typescript
 * const fps = getFps(); // 60
 * const fps = getFps("fps-30"); // 30
 * ```
 */
export function getFps(id?: string): number {
  const config = id
    ? getFrameRateConfig(id)
    : getDefaultFrameRateConfig();
  return config?.fps || 60; // Default to 60fps if not found
}

/**
 * Create a frame rate configuration from FPS value
 *
 * Utility function to calculate frame interval from FPS and create config.
 *
 * @param fps - Target frames per second
 * @param id - Configuration ID (defaults to "fps-{fps}")
 * @param label - Optional label (defaults to "{fps} FPS")
 * @returns A new FrameRateConfig object
 *
 * @example
 * ```typescript
 * const fps120 = createFrameRateConfigFromFps(120);
 * // { id: "fps-120", label: "120 FPS", fps: 120, frameInterval: 8 }
 * registerFrameRateConfig(fps120);
 * ```
 */
export function createFrameRateConfigFromFps(
  fps: number,
  id?: string,
  label?: string
): FrameRateConfig {
  const frameInterval = Math.round(1000 / fps);
  return {
    id: id || `fps-${fps}`,
    label: label || `${fps} FPS`,
    fps,
    frameInterval,
  };
}

// ============================================================================
// Backward Compatibility
// ============================================================================

/**
 * @deprecated Use getDefaultFrameRateConfig() instead
 * Exported for backward compatibility with existing code
 */
export const DEFAULT_FRAME_RATE_CONFIG = getDefaultFrameRateConfig();

/**
 * @deprecated Use getFrameInterval() instead
 * Exported for backward compatibility with existing code
 */
export const FRAME_INTERVAL = getFrameInterval();

/**
 * @deprecated Use getFps() instead
 * Exported for backward compatibility with existing code
 */
export const TARGET_FPS = getFps();
