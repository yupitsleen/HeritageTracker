/**
 * Centralized theme configuration
 * Defines colors, spacing, and reusable style classes
 */

export const colors = {
  // Status colors
  status: {
    destroyed: "bg-red-600",
    destroyedText: "text-red-600",
    heavilyDamaged: "bg-orange-600",
    heavilyDamagedText: "text-orange-600",
    damaged: "bg-yellow-600",
    damagedText: "text-yellow-600",
  },

  // Base colors
  primary: {
    bg: "bg-gray-900",
    text: "text-white",
    hover: "hover:bg-gray-800",
  },

  secondary: {
    bg: "bg-gray-50",
    text: "text-gray-600",
  },

  card: {
    bg: "bg-white",
    border: "border-gray-200",
    shadow: "shadow-md",
  },

  badge: {
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
};

/**
 * Common component styles
 */
export const components = {
  // Card styles
  card: {
    base: "bg-white rounded-lg shadow-md overflow-hidden",
    padding: "p-6",
    hover: "hover:shadow-lg transition-shadow",
  },

  // Button styles
  button: {
    base: "px-4 py-2 rounded-lg font-semibold transition-colors",
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    reset: "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm",
  },

  // Form styles
  select: {
    base: "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  },

  label: {
    base: "block text-sm font-medium text-gray-700 mb-2",
  },

  // Badge styles
  badge: {
    base: "inline-block px-2 py-1 rounded text-xs font-medium",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  },

  // Container styles
  container: {
    base: "container mx-auto px-4",
    section: "py-8",
  },

  // Header styles
  header: {
    base: "bg-gray-900 text-white shadow-lg",
    title: "text-3xl font-bold",
    subtitle: "text-gray-300 mt-2",
  },

  // Footer styles
  footer: {
    base: "bg-gray-900 text-gray-400 mt-16",
    text: "text-sm text-center",
  },

  // Map styles
  map: {
    container: "h-[600px] w-full rounded-lg shadow-md",
  },
};

/**
 * Helper function to get status color class
 */
export const getStatusColor = (
  status: "destroyed" | "heavily-damaged" | "damaged",
  variant: "bg" | "text" = "bg"
) => {
  const statusMap = {
    destroyed: variant === "bg" ? colors.status.destroyed : colors.status.destroyedText,
    "heavily-damaged":
      variant === "bg" ? colors.status.heavilyDamaged : colors.status.heavilyDamagedText,
    damaged: variant === "bg" ? colors.status.damaged : colors.status.damagedText,
  };

  return statusMap[status];
};

/**
 * Get hex color for D3/SVG rendering based on status
 */
export const getStatusHexColor = (
  status: "destroyed" | "heavily-damaged" | "damaged"
): string => {
  const colorMap = {
    destroyed: "#dc2626", // red-600
    "heavily-damaged": "#ea580c", // orange-600
    damaged: "#ca8a04", // yellow-600
  };
  return colorMap[status];
};

/**
 * Utility to combine class names
 */
export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(" ");
};
