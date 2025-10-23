/**
 * Color Theme Type Definitions
 *
 * Defines extensible color theme system for visual customization.
 */

/**
 * Color palette definition (e.g., Palestinian flag colors)
 */
export interface ColorPalette {
  /** Palette identifier */
  id: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Color definitions (50-900 scale) */
  colors: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // Primary/base color
    600: string;
    700: string;
    800: string;
    900: string;
  };

  /** Description for documentation */
  description?: string;
}

/**
 * Status color configuration
 */
export interface StatusColorConfig {
  /** Unique identifier */
  id: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Hex color code */
  hex: string;

  /** Tailwind background class */
  bgClass: string;

  /** Tailwind text class */
  textClass: string;

  /** Tailwind border class (optional) */
  borderClass?: string;

  /** Description for documentation */
  description?: string;
}

/**
 * Theme color scheme (light/dark)
 */
export interface ThemeColorScheme {
  /** Scheme identifier */
  id: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Text color classes */
  text: {
    heading: string;
    subheading: string;
    body: string;
    muted: string;
    subtle: string;
  };

  /** Background color classes */
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    hover: string;
    active: string;
  };

  /** Border color classes */
  border: {
    default: string;
    subtle: string;
    strong: string;
    primary: string;
    primary2: string;
  };

  /** Input/form color classes */
  input: {
    base: string;
    focus: string;
  };

  /** Icon color classes */
  icon: {
    default: string;
    muted: string;
  };

  /** Card/container classes */
  card: {
    base: string;
  };

  /** Layout color classes */
  layout: {
    appBackground: string;
    loadingText: string;
    modalHeading: string;
  };

  /** Tooltip color classes */
  tooltip: {
    base: string;
    border: string;
    text: string;
  };

  /** Marker color classes */
  marker: {
    minor: string;
    major: string;
  };

  /** Container background patterns */
  containerBg: {
    semiTransparent: string;
    opaque: string;
    solid: string;
  };

  /** Keyboard shortcut styling */
  kbd: {
    base: string;
  };
}

/**
 * Complete color theme configuration
 */
export interface ColorThemeConfig {
  /** Unique theme identifier */
  id: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Whether this is the default theme */
  isDefault?: boolean;

  /** Color palettes (red, green, black, white) */
  palettes: {
    red: ColorPalette;
    green: ColorPalette;
    black: ColorPalette;
    white: ColorPalette;
  };

  /** Status colors */
  statusColors: {
    destroyed: StatusColorConfig;
    heavilyDamaged: StatusColorConfig;
    damaged: StatusColorConfig;
  };

  /** Light mode color scheme */
  lightScheme: ThemeColorScheme;

  /** Dark mode color scheme */
  darkScheme: ThemeColorScheme;

  /** Description for documentation */
  description?: string;

  /** Theme metadata */
  metadata?: {
    author?: string;
    version?: string;
    culturalSignificance?: string;
  };
}
