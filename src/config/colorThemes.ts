/**
 * Color Theme Registry
 *
 * Central registry for color themes. Enables dynamic theme switching
 * without code changes.
 *
 * @example
 * ```typescript
 * // Get Palestinian flag theme:
 * const theme = getColorTheme('palestinian-flag');
 *
 * // Register custom theme:
 * registerColorTheme({
 *   id: 'custom-theme',
 *   label: 'Custom Theme',
 *   palettes: { ... },
 *   statusColors: { ... },
 *   lightScheme: { ... },
 *   darkScheme: { ... }
 * });
 * ```
 */

import type { ColorThemeConfig } from "../types/colorThemeTypes";

/**
 * Consolidated color constants for the Heritage Tracker application
 * Based on the Palestinian flag theme colors
 *
 * This consolidates colors from:
 * - src/constants/colors.ts (main app colors)
 * - src/components/Button/buttonColors.ts (button-specific colors)
 *
 * Single source of truth for all color values across the application.
 * IMPORTANT: Must be defined before COLOR_THEME_REGISTRY to avoid circular references.
 */
export const COLORS = {
  // Palestinian flag colors
  FLAG_RED: '#ed3039',
  FLAG_RED_DARK: '#8b2a30', // Muted for dark mode
  FLAG_RED_HOVER: '#d4202a',

  FLAG_GREEN: '#009639',
  FLAG_GREEN_DARK: '#2d5a38', // Muted for dark mode
  FLAG_GREEN_HOVER: '#007b2f',
  FLAG_GREEN_HOVER_DARK: '#244a2e',

  FLAG_BLACK: '#000000',
  FLAG_WHITE: '#fefefe',

  // Grays
  GRAY_LIGHT: '#f5f5f5',
  GRAY_MEDIUM: '#a3a3a3',
  GRAY_DARK: '#404040',
  GRAY_SUBTLE: '#525252',

  // Border colors
  BORDER_DEFAULT_LIGHT: '#404040',
  BORDER_BLACK: '#000000',

  // Button-specific colors (from buttonColors.ts)
  // Muted/subdued colors for active/toggle states
  SUBDUED_GREEN_DARK: '#2d5a38',         // Muted green for active toggle (dark mode)
  SUBDUED_GREEN_DARK_HOVER: '#3a6b48',   // Hover on active (dark mode)
  SUBDUED_GREEN_LIGHT: '#4a7c59',        // Muted green for active toggle (light mode)
  SUBDUED_GREEN_LIGHT_HOVER: '#5a8c69',  // Hover on active (light mode)
} as const;

/**
 * @deprecated Use COLORS from config/colorThemes instead
 * Kept for backward compatibility - will be removed in next major version
 */
export const PALESTINIAN_FLAG = {
  GREEN: COLORS.FLAG_GREEN,
  RED: COLORS.FLAG_RED,
  BLACK: COLORS.FLAG_BLACK,
  WHITE: COLORS.FLAG_WHITE,
} as const;

/**
 * @deprecated Use COLORS.SUBDUED_* from config/colorThemes instead
 * Kept for backward compatibility - will be removed in next major version
 */
export const SUBDUED_COLORS = {
  GREEN_DARK: COLORS.SUBDUED_GREEN_DARK,
  GREEN_DARK_HOVER: COLORS.SUBDUED_GREEN_DARK_HOVER,
  GREEN_LIGHT: COLORS.SUBDUED_GREEN_LIGHT,
  GREEN_LIGHT_HOVER: COLORS.SUBDUED_GREEN_LIGHT_HOVER,
} as const;

/**
 * Color theme registry - stores all registered themes
 */
export const COLOR_THEME_REGISTRY: Record<string, ColorThemeConfig> = {
  "palestinian-flag": {
    id: "palestinian-flag",
    label: "Palestinian Flag",
    labelArabic: "علم فلسطين",
    isDefault: true,
    description:
      "Official Palestinian flag colors: Red (#ed3039), Green (#009639), Black (#000000), White (#fefefe)",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      culturalSignificance:
        "Palestinian flag colors represent identity and resistance",
    },

    palettes: {
      red: {
        id: "palestine-red",
        label: "Palestinian Red",
        labelArabic: "الأحمر الفلسطيني",
        description: "Palestinian flag red and tints",
        colors: {
          50: "#fef3f4",
          100: "#fde6e8",
          200: "#faccce",
          300: "#f79fa4",
          400: "#f4656f",
          500: "#ed3039", // Flag red (exact)
          600: "#d4202a",
          700: "#b01822",
          800: "#92171f",
          900: "#78191f",
        },
      },
      green: {
        id: "palestine-green",
        label: "Palestinian Green",
        labelArabic: "الأخضر الفلسطيني",
        description: "Palestinian flag green and tints",
        colors: {
          50: "#f0fdf6",
          100: "#dcfce9",
          200: "#baf9d2",
          300: "#86f2b0",
          400: "#4ae187",
          500: "#009639", // Flag green (exact)
          600: "#007b2f",
          700: "#006226",
          800: "#004e22",
          900: "#00401e",
        },
      },
      black: {
        id: "palestine-black",
        label: "Palestinian Black",
        labelArabic: "الأسود الفلسطيني",
        description: "Palestinian flag black and grays",
        colors: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#000000", // Flag black (exact)
        },
      },
      white: {
        id: "palestine-white",
        label: "Palestinian White",
        labelArabic: "الأبيض الفلسطيني",
        description: "Palestinian flag white and tints",
        colors: {
          50: "#fefefe", // Flag white (exact)
          100: "#fdfdfd",
          200: "#fcfcfc",
          300: "#fafafa",
          400: "#f5f5f5",
          500: "#f0f0f0",
          600: "#e5e5e5",
          700: "#d4d4d4",
          800: "#c4c4c4",
          900: "#b4b4b4",
        },
      },
    },

    statusColors: {
      destroyed: {
        id: "destroyed",
        label: "Destroyed",
        labelArabic: "مدمر",
        hex: "#b91c1c",
        bgClass: "bg-[#b91c1c]",
        textClass: "text-[#b91c1c]",
        borderClass: "border-[#b91c1c]",
        description: "Deep red for destroyed sites",
      },
      heavilyDamaged: {
        id: "heavily-damaged",
        label: "Heavily Damaged",
        labelArabic: "متضرر بشدة",
        hex: "#d97706",
        bgClass: "bg-[#d97706]",
        textClass: "text-[#d97706]",
        borderClass: "border-[#d97706]",
        description: "Warm amber for heavily damaged sites",
      },
      damaged: {
        id: "damaged",
        label: "Damaged",
        labelArabic: "متضرر",
        hex: "#ca8a04",
        bgClass: "bg-[#ca8a04]",
        textClass: "text-[#ca8a04]",
        borderClass: "border-[#ca8a04]",
        description: "Muted gold for damaged sites",
      },
    },

    lightScheme: {
      id: "light",
      label: "Light Mode",
      labelArabic: "الوضع الفاتح",
      text: {
        heading: "text-gray-900",
        subheading: "text-gray-800",
        body: "text-gray-700",
        muted: "text-gray-600",
        subtle: "text-gray-500",
      },
      bg: {
        primary: "bg-white",
        secondary: "bg-gray-50",
        tertiary: "bg-gray-100",
        hover: "hover:bg-gray-100",
        active: "bg-gray-200",
      },
      border: {
        default: `border-[${COLORS.BORDER_DEFAULT_LIGHT}]`,
        subtle: "border-gray-300",
        strong: "border-gray-400",
        primary: "border-black",
        primary2: "border-2 border-black",
      },
      input: {
        base: `bg-white border-[${COLORS.BORDER_BLACK}] text-gray-900 placeholder:text-gray-400`,
        focus: `focus:outline-none focus:ring-2 focus:ring-[${COLORS.FLAG_GREEN}] focus:border-transparent`,
      },
      icon: {
        default: "text-gray-400",
        muted: "text-gray-500",
      },
      card: {
        base: "bg-white border-gray-200",
      },
      layout: {
        appBackground: "bg-gray-500",
        loadingText: "text-gray-600",
        modalHeading: "text-gray-900",
      },
      tooltip: {
        base: "bg-white text-black border-gray-300",
        border: "border-gray-300",
        text: "text-black",
      },
      marker: {
        minor: "bg-gray-400",
        major: "bg-gray-300",
      },
      containerBg: {
        semiTransparent: "bg-white/50",
        opaque: "bg-white/90",
        solid: "bg-white",
      },
      kbd: {
        base: "bg-gray-200",
      },
    },

    darkScheme: {
      id: "dark",
      label: "Dark Mode",
      labelArabic: "الوضع الداكن",
      text: {
        heading: "text-gray-100",
        subheading: "text-gray-200",
        body: "text-gray-300",
        muted: "text-gray-400",
        subtle: "text-gray-500",
      },
      bg: {
        primary: "bg-gray-800",
        secondary: "bg-gray-700",
        tertiary: "bg-gray-700/50",
        hover: "hover:bg-gray-700",
        active: "bg-gray-600",
      },
      border: {
        default: "border-gray-700",
        subtle: "border-gray-600",
        strong: "border-gray-500",
        primary: "border-white",
        primary2: "border-2 border-white",
      },
      input: {
        base: "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400",
        focus: `focus:outline-none focus:ring-2 focus:ring-[${COLORS.FLAG_GREEN}] focus:border-transparent`,
      },
      icon: {
        default: "text-gray-300",
        muted: "text-gray-400",
      },
      card: {
        base: "bg-gray-800 border-gray-700",
      },
      layout: {
        appBackground: "bg-gray-600",
        loadingText: "text-gray-300",
        modalHeading: "text-gray-100",
      },
      tooltip: {
        base: "bg-gray-900 text-white border-gray-600",
        border: "border-gray-600",
        text: "text-white",
      },
      marker: {
        minor: "bg-gray-700",
        major: "bg-gray-600",
      },
      containerBg: {
        semiTransparent: "bg-black/50",
        opaque: "bg-black/90",
        solid: "bg-black",
      },
      kbd: {
        base: "bg-gray-700",
      },
    },
  },
};

// ============================================================================
// Color Theme Helper Functions
// ============================================================================

/**
 * Register a new color theme
 *
 * @param config - Color theme configuration
 *
 * @example
 * ```typescript
 * registerColorTheme({
 *   id: 'custom-theme',
 *   label: 'Custom Theme',
 *   palettes: { ... },
 *   statusColors: { ... },
 *   lightScheme: { ... },
 *   darkScheme: { ... }
 * });
 * ```
 */
export function registerColorTheme(config: ColorThemeConfig): void {
  COLOR_THEME_REGISTRY[config.id] = config;
}

/**
 * Get all registered color themes
 *
 * @returns Array of all color themes
 *
 * @example
 * ```typescript
 * const themes = getAllColorThemes();
 * themes.forEach(t => console.log(t.label));
 * ```
 */
export function getAllColorThemes(): ColorThemeConfig[] {
  return Object.values(COLOR_THEME_REGISTRY);
}

/**
 * Get color theme by ID
 *
 * @param id - Theme identifier
 * @returns Color theme configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const theme = getColorTheme('palestinian-flag');
 * if (theme) {
 *   console.log(theme.palettes.red.colors[500]); // '#ed3039'
 * }
 * ```
 */
export function getColorTheme(id: string): ColorThemeConfig | undefined {
  return COLOR_THEME_REGISTRY[id];
}

/**
 * Get default color theme
 *
 * @returns Default color theme or first theme
 *
 * @example
 * ```typescript
 * const defaultTheme = getDefaultColorTheme();
 * // Returns theme with isDefault: true
 * ```
 */
export function getDefaultColorTheme(): ColorThemeConfig {
  const defaultTheme = getAllColorThemes().find((t) => t.isDefault);
  if (defaultTheme) return defaultTheme;

  // Fallback to first theme
  const themes = getAllColorThemes();
  if (themes.length > 0) return themes[0];

  // Final fallback to palestinian-flag
  return COLOR_THEME_REGISTRY["palestinian-flag"];
}

/**
 * Update color theme configuration
 *
 * @param id - Theme identifier
 * @param updates - Partial configuration to update
 *
 * @example
 * ```typescript
 * updateColorTheme('palestinian-flag', {
 *   description: 'Updated description'
 * });
 * ```
 */
export function updateColorTheme(
  id: string,
  updates: Partial<ColorThemeConfig>
): void {
  const existing = COLOR_THEME_REGISTRY[id];
  if (!existing) {
    throw new Error(`Color theme '${id}' not found in registry`);
  }

  COLOR_THEME_REGISTRY[id] = {
    ...existing,
    ...updates,
  };
}

/**
 * Remove color theme from registry
 *
 * @param id - Theme identifier
 *
 * @example
 * ```typescript
 * removeColorTheme('custom-theme');
 * ```
 */
export function removeColorTheme(id: string): void {
  delete COLOR_THEME_REGISTRY[id];
}

/**
 * Get color theme IDs
 *
 * @returns Array of all theme IDs
 *
 * @example
 * ```typescript
 * const ids = getColorThemeIds();
 * // ['palestinian-flag', 'custom-theme']
 * ```
 */
export function getColorThemeIds(): string[] {
  return Object.keys(COLOR_THEME_REGISTRY);
}

/**
 * Check if a color theme ID is valid
 *
 * @param id - Theme identifier
 * @returns True if theme exists in registry
 *
 * @example
 * ```typescript
 * if (isValidColorTheme('palestinian-flag')) {
 *   // Theme exists
 * }
 * ```
 */
export function isValidColorTheme(id: string): boolean {
  return id in COLOR_THEME_REGISTRY;
}

/**
 * Get color theme label (localized)
 *
 * @param id - Theme identifier
 * @param locale - Locale code ('en' or 'ar')
 * @returns Localized label or theme ID if not found
 *
 * @example
 * ```typescript
 * const label = getColorThemeLabel('palestinian-flag', 'ar'); // 'علم فلسطين'
 * ```
 */
export function getColorThemeLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const theme = getColorTheme(id);
  if (!theme) return id;

  return locale === "ar" && theme.labelArabic ? theme.labelArabic : theme.label;
}

/**
 * Get theme color schemes by mode
 *
 * @param id - Theme identifier
 * @param mode - Light or dark mode
 * @returns Theme color scheme or undefined if not found
 *
 * @example
 * ```typescript
 * const lightScheme = getColorScheme('palestinian-flag', 'light');
 * console.log(lightScheme.text.heading); // 'text-gray-900'
 * ```
 */
export function getColorScheme(
  id: string,
  mode: "light" | "dark"
): ColorThemeConfig["lightScheme"] | undefined {
  const theme = getColorTheme(id);
  if (!theme) return undefined;

  return mode === "light" ? theme.lightScheme : theme.darkScheme;
}

/**
 * Get status color configuration
 *
 * @param themeId - Theme identifier
 * @param status - Status type
 * @returns Status color configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const destroyedColor = getStatusColor('palestinian-flag', 'destroyed');
 * console.log(destroyedColor.hex); // '#b91c1c'
 * ```
 */
export function getStatusColor(
  themeId: string,
  status: "destroyed" | "heavilyDamaged" | "damaged"
): ColorThemeConfig["statusColors"]["destroyed"] | undefined {
  const theme = getColorTheme(themeId);
  if (!theme) return undefined;

  return theme.statusColors[status];
}

/**
 * Get palette from theme
 *
 * @param themeId - Theme identifier
 * @param paletteId - Palette identifier ('red', 'green', 'black', 'white')
 * @returns Color palette or undefined if not found
 *
 * @example
 * ```typescript
 * const redPalette = getPalette('palestinian-flag', 'red');
 * console.log(redPalette.colors[500]); // '#ed3039'
 * ```
 */
export function getPalette(
  themeId: string,
  paletteId: "red" | "green" | "black" | "white"
): ColorThemeConfig["palettes"]["red"] | undefined {
  const theme = getColorTheme(themeId);
  if (!theme) return undefined;

  return theme.palettes[paletteId];
}

// ============================================================================
// Convenience Exports (for backward compatibility)
// ============================================================================

/**
 * Default color theme (for backward compatibility)
 */
export const DEFAULT_COLOR_THEME = getDefaultColorTheme();

/**
 * Palestinian flag colors (for backward compatibility)
 */
export const PALESTINIAN_FLAG_COLORS = {
  red: DEFAULT_COLOR_THEME.palettes.red.colors[500],
  green: DEFAULT_COLOR_THEME.palettes.green.colors[500],
  black: DEFAULT_COLOR_THEME.palettes.black.colors[900],
  white: DEFAULT_COLOR_THEME.palettes.white.colors[50],
};
