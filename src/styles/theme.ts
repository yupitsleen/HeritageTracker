/**
 * Centralized theme configuration
 * Re-exports colors, components, and utility functions
 *
 * This file serves as a single entry point for all theme-related imports
 */

// Re-export colors
export { colors } from "./colors";

// Re-export components
export { components } from "./components";

// Re-export utility functions
export { cn } from "../utils/classNames";
export { getStatusColor, getStatusHexColor } from "../utils/colorHelpers";
