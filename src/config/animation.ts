import type { AnimationSpeedConfig, AnimationConfig } from "../types/animationTypes";

/**
 * Animation speed configurations
 *
 * Defines available playback speeds for timeline animation.
 * Each speed is a multiplier: 0.5x = half speed, 2x = double speed, etc.
 */
export const ANIMATION_SPEEDS: AnimationSpeedConfig[] = [
  {
    value: 0.25,
    label: "0.25x",
    labelArabic: "٠.٢٥×",
    description: "Quarter speed - very slow playback",
  },
  {
    value: 0.5,
    label: "0.5x",
    labelArabic: "٠.٥×",
    description: "Half speed - slow playback for detailed viewing",
  },
  {
    value: 1,
    label: "1x",
    labelArabic: "١×",
    description: "Normal speed - default playback",
    isDefault: true,
  },
  {
    value: 2,
    label: "2x",
    labelArabic: "٢×",
    description: "Double speed - fast playback",
  },
  {
    value: 4,
    label: "4x",
    labelArabic: "٤×",
    description: "Quadruple speed - very fast playback",
  },
  {
    value: 8,
    label: "8x",
    labelArabic: "٨×",
    description: "8x speed - ultra fast playback",
  },
];

/**
 * Default animation configuration
 *
 * Central configuration for timeline animation behavior.
 * Modify these values to adjust playback speed, frame rate, and behavior.
 */
export const ANIMATION_CONFIG: AnimationConfig = {
  speeds: ANIMATION_SPEEDS,
  defaultSpeed: 1,
  frameInterval: 16, // ~60fps (16ms per frame)
  timeIncrementPerFrame: 24 * 60 * 60 * 1000, // 1 day per frame at 1x speed
  pauseAtStart: true, // Pause at start to show baseline imagery
  pauseAtStartDuration: 1000, // 1 second pause
};

/**
 * Get animation speed configuration by value
 *
 * @param value - Speed multiplier value
 * @returns Speed configuration or undefined if not found
 */
export function getAnimationSpeed(value: number): AnimationSpeedConfig | undefined {
  return ANIMATION_SPEEDS.find((speed) => speed.value === value);
}

/**
 * Get all available animation speeds
 *
 * @returns Array of all speed configurations
 */
export function getAvailableSpeeds(): AnimationSpeedConfig[] {
  return ANIMATION_SPEEDS;
}

/**
 * Get default animation speed
 *
 * @returns Default speed configuration
 */
export function getDefaultSpeed(): AnimationSpeedConfig {
  const defaultSpeed = ANIMATION_SPEEDS.find((speed) => speed.isDefault);
  return defaultSpeed || ANIMATION_SPEEDS[0];
}

/**
 * Get animation speed values only (for type constraints)
 *
 * @returns Array of speed values
 */
export function getSpeedValues(): number[] {
  return ANIMATION_SPEEDS.map((speed) => speed.value);
}

/**
 * Check if a speed value is valid
 *
 * @param value - Speed value to check
 * @returns True if speed is registered
 */
export function isValidSpeed(value: number): boolean {
  return ANIMATION_SPEEDS.some((speed) => speed.value === value);
}

/**
 * Get animation speed label with fallback
 *
 * @param value - Speed multiplier value
 * @param locale - Locale for label (default: "en")
 * @returns Display label in requested locale
 */
export function getSpeedLabel(value: number, locale: string = "en"): string {
  const speedConfig = getAnimationSpeed(value);

  if (!speedConfig) {
    return `${value}x`;
  }

  if (locale === "ar" && speedConfig.labelArabic) {
    return speedConfig.labelArabic;
  }

  return speedConfig.label;
}

/**
 * Calculate time increment for a given speed
 *
 * @param speed - Speed multiplier
 * @returns Time increment in milliseconds
 */
export function calculateTimeIncrement(speed: number): number {
  return ANIMATION_CONFIG.timeIncrementPerFrame * speed;
}
