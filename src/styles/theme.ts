/**
 * Centralized theme configuration
 * Re-exports utility functions and defines common styling utilities
 *
 * This file serves as a single entry point for theme-related imports
 * For theme-aware component styling, use the useThemeClasses() hook
 */

// Re-export utility functions
export { cn } from "../utils/classNames";
export { getStatusColor, getStatusHexColor } from "../utils/colorHelpers";

// Shadow system for elevation
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  // Colored shadows (for special cases)
  red: 'shadow-lg shadow-red-200/50',
  green: 'shadow-lg shadow-green-200/50',
} as const;

// Transition utilities for smooth animations
export const transitions = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-200',
  slow: 'transition-all duration-300',
  colors: 'transition-colors duration-200',
  shadow: 'transition-shadow duration-300',
} as const;
