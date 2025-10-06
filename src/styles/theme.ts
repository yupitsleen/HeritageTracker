/**
 * Centralized theme configuration
 * Colors inspired by the Palestinian flag with subdued, sophisticated shades
 * Red, Black, White, Green palette with various tones
 */

export const colors = {
  // Palestinian flag-inspired palette
  palestine: {
    // Subdued reds (from flag's red)
    red: {
      50: "#fef2f2",   // Very light red tint
      100: "#fee2e2",  // Light red
      200: "#fecaca",  // Soft red
      300: "#fca5a5",  // Medium light red
      400: "#f87171",  // Medium red
      500: "#dc2626",  // Base red (subdued from flag)
      600: "#b91c1c",  // Deep red
      700: "#991b1b",  // Darker red
      800: "#7f1d1d",  // Very dark red
      900: "#5c1414",  // Nearly black-red
    },
    // Subdued greens (from flag's green)
    green: {
      50: "#f0fdf4",   // Very light green tint
      100: "#dcfce7",  // Light green
      200: "#bbf7d0",  // Soft green
      300: "#86efac",  // Medium light green
      400: "#4ade80",  // Medium green
      500: "#16a34a",  // Base green (subdued from flag)
      600: "#15803d",  // Deep green
      700: "#166534",  // Darker green
      800: "#14532d",  // Very dark green
      900: "#0f3d21",  // Nearly black-green
    },
    // Blacks and grays (from flag's black)
    black: {
      50: "#f8f9fa",   // Nearly white
      100: "#e9ecef",  // Very light gray
      200: "#dee2e6",  // Light gray
      300: "#ced4da",  // Medium light gray
      400: "#adb5bd",  // Medium gray
      500: "#6c757d",  // Neutral gray
      600: "#495057",  // Dark gray
      700: "#343a40",  // Darker gray
      800: "#212529",  // Very dark gray
      900: "#1a1d20",  // Nearly black
    },
    // Whites and cream tones
    white: {
      pure: "#ffffff",   // Pure white
      cream: "#fafaf9",  // Slight cream tint
      warm: "#f5f5f4",   // Warm white
      soft: "#f1f0ef",   // Soft white
    },
  },

  // Status colors using Palestine palette
  status: {
    destroyed: "bg-[#b91c1c]",           // Deep red
    destroyedText: "text-[#b91c1c]",
    heavilyDamaged: "bg-[#d97706]",     // Warm amber (between red and green)
    heavilyDamagedText: "text-[#d97706]",
    damaged: "bg-[#ca8a04]",            // Muted gold
    damagedText: "text-[#ca8a04]",
  },

  // Base colors
  primary: {
    bg: "bg-[#212529]",                  // Palestine black-gray
    text: "text-white",
    hover: "hover:bg-[#343a40]",
  },

  secondary: {
    bg: "bg-[#f5f5f4]",                  // Palestine warm white
    text: "text-[#495057]",
  },

  card: {
    bg: "bg-white",
    border: "border-[#dee2e6]",          // Palestine light gray
    shadow: "shadow-md",
  },

  badge: {
    bg: "bg-[#dcfce7]",                  // Palestine light green
    text: "text-[#166534]",              // Palestine dark green
  },
};

/**
 * Common component styles
 */
export const components = {
  // Card styles
  card: {
    base: "bg-white rounded-lg shadow-md overflow-hidden border border-[#e9ecef]",
    padding: "p-6",
    hover: "hover:shadow-lg hover:border-[#adb5bd] transition-all",
  },

  // Button styles
  button: {
    base: "px-4 py-2 rounded-lg font-semibold transition-colors",
    primary: "bg-[#15803d] text-white hover:bg-[#166534]",        // Palestine green
    secondary: "bg-[#e9ecef] text-[#343a40] hover:bg-[#dee2e6]",  // Palestine grays
    reset: "px-4 py-2 bg-[#b91c1c] text-white rounded-md hover:bg-[#991b1b] transition-colors text-sm",  // Palestine red
  },

  // Form styles
  select: {
    base: "w-full px-4 py-2 border border-[#ced4da] rounded-md focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a]",  // Palestine green focus
  },

  label: {
    base: "block text-sm font-medium text-[#495057] mb-2",  // Palestine dark gray
  },

  // Badge styles
  badge: {
    base: "inline-block px-2 py-1 rounded text-xs font-medium",
    primary: "bg-[#dcfce7] text-[#166534]",     // Palestine light/dark green
    success: "bg-[#dcfce7] text-[#166534]",     // Palestine greens
    warning: "bg-[#fef2f2] text-[#991b1b]",     // Palestine light/dark red
    danger: "bg-[#fee2e2] text-[#b91c1c]",      // Palestine reds
  },

  // Container styles
  container: {
    base: "container mx-auto px-4",
    section: "py-8",
  },

  // Header styles
  header: {
    base: "bg-[#212529] text-white shadow-lg border-b-2 border-[#16a34a]",  // Black with green accent
    title: "text-3xl font-bold",
    subtitle: "text-[#e9ecef] mt-2",  // Light gray text
  },

  // Footer styles
  footer: {
    base: "bg-[#212529] text-[#adb5bd] mt-16 border-t-2 border-[#16a34a]",  // Black with green accent
    text: "text-sm text-center",
  },

  // Map styles
  map: {
    container: "h-[600px] w-full rounded-lg shadow-md border border-[#dee2e6]",
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
 * Using Palestine-inspired palette
 */
export const getStatusHexColor = (
  status: "destroyed" | "heavily-damaged" | "damaged"
): string => {
  const colorMap = {
    destroyed: "#b91c1c",        // Deep Palestine red
    "heavily-damaged": "#d97706", // Warm amber
    damaged: "#ca8a04",           // Muted gold
  };
  return colorMap[status];
};

/**
 * Utility to combine class names
 */
export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(" ");
};
