/**
 * Frame Rate Configuration Types
 *
 * Defines types for extensible frame rate configuration.
 */

/**
 * Frame rate configuration
 *
 * Defines animation frame rate (frames per second) for timeline playback
 * and other animations.
 *
 * @property id - Unique identifier for this frame rate configuration
 * @property label - Human-readable label
 * @property labelArabic - Optional Arabic label
 * @property isDefault - Whether this is the default configuration
 * @property fps - Target frames per second (e.g., 30, 60)
 * @property frameInterval - Frame interval in milliseconds (1000 / fps)
 * @property description - Optional description
 * @property metadata - Optional metadata (author, version, notes)
 *
 * @example
 * ```typescript
 * const fps60: FrameRateConfig = {
 *   id: "fps-60",
 *   label: "60 FPS",
 *   fps: 60,
 *   frameInterval: 16, // ~16ms per frame
 *   description: "Smooth 60 frames per second animation",
 * };
 * ```
 */
export interface FrameRateConfig {
  id: string;
  label: string;
  labelArabic?: string;
  isDefault?: boolean;
  fps: number;
  frameInterval: number;
  description?: string;
  metadata?: {
    author?: string;
    version?: string;
    notes?: string;
  };
}

/**
 * Registry of frame rate configurations
 * Maps configuration ID to FrameRateConfig object
 */
export interface FrameRateRegistry {
  [id: string]: FrameRateConfig;
}
