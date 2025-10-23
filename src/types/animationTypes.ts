/**
 * Configuration for timeline animation settings
 *
 * Defines extensible animation speed options and playback behavior.
 */

/**
 * Animation speed multiplier configuration
 */
export interface AnimationSpeedConfig {
  /** Unique speed value (used as multiplier) */
  value: number;

  /** Display label for UI */
  label: string;

  /** Display label in Arabic */
  labelArabic?: string;

  /** Optional description */
  description?: string;

  /** Whether this is the default speed */
  isDefault?: boolean;
}

/**
 * Complete animation configuration
 */
export interface AnimationConfig {
  /** Available speed options */
  speeds: AnimationSpeedConfig[];

  /** Default speed value */
  defaultSpeed: number;

  /** Frame rate target (ms per frame) */
  frameInterval: number;

  /** Time increment per frame (ms) */
  timeIncrementPerFrame: number;

  /** Whether to pause at timeline start before playing */
  pauseAtStart?: boolean;

  /** Duration to pause at start (ms) */
  pauseAtStartDuration?: number;
}
