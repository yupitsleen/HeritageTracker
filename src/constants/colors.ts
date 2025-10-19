/**
 * Color constants for the Heritage Tracker application
 * Based on the Palestinian flag theme colors
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
} as const;
