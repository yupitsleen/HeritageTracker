/**
 * Centralized theme configuration
 * Colors from the Palestinian flag (exact flag colors)
 * Black (#000000), White (#fefefe), Red (#ed3039), Green (#009639)
 */

export const colors = {
  // Palestinian flag palette (exact colors)
  palestine: {
    // Flag red and tints
    red: {
      50: "#fef3f4",   // Very light red tint
      100: "#fde6e8",  // Light red
      200: "#faccce",  // Soft red
      300: "#f79fa4",  // Medium light red
      400: "#f4656f",  // Medium red
      500: "#ed3039",  // Flag red (exact)
      600: "#d4202a",  // Deep red
      700: "#b01822",  // Darker red
      800: "#92171f",  // Very dark red
      900: "#78191f",  // Nearly black-red
    },
    // Flag green and tints
    green: {
      50: "#f0fdf6",   // Very light green tint
      100: "#dcfce9",  // Light green
      200: "#baf9d2",  // Soft green
      300: "#86f2b0",  // Medium light green
      400: "#4ae187",  // Medium green
      500: "#009639",  // Flag green (exact)
      600: "#007b2f",  // Deep green
      700: "#006226",  // Darker green
      800: "#004e22",  // Very dark green
      900: "#00401e",  // Nearly black-green
    },
    // Flag black and grays
    black: {
      50: "#fafafa",   // Nearly white
      100: "#f5f5f5",  // Very light gray
      200: "#e5e5e5",  // Light gray
      300: "#d4d4d4",  // Medium light gray
      400: "#a3a3a3",  // Medium gray
      500: "#737373",  // Neutral gray
      600: "#525252",  // Dark gray
      700: "#404040",  // Darker gray
      800: "#262626",  // Very dark gray
      900: "#000000",  // Flag black (exact)
    },
    // Flag white and tints
    white: {
      pure: "#fefefe",   // Flag white (exact)
      cream: "#fdfdfd",  // Slight cream tint
      warm: "#fcfcfc",   // Warm white
      soft: "#fafafa",   // Soft white
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
    bg: "bg-[#000000]",                  // Palestine flag black
    text: "text-[#fefefe]",              // Palestine flag white
    hover: "hover:bg-[#262626]",
  },

  secondary: {
    bg: "bg-[#fcfcfc]",                  // Palestine warm white
    text: "text-[#525252]",
  },

  card: {
    bg: "bg-[#fefefe]",                  // Palestine flag white
    border: "border-[#e5e5e5]",          // Palestine light gray
    shadow: "shadow-md",
  },

  badge: {
    bg: "bg-[#dcfce9]",                  // Palestine light green
    text: "text-[#006226]",              // Palestine dark green
  },
};

/**
 * Common component styles
 */
export const components = {
  // Card styles
  card: {
    base: "bg-[#fefefe] rounded-lg shadow-md overflow-hidden border border-[#f5f5f5]",
    padding: "p-6",
    hover: "hover:shadow-lg hover:border-[#a3a3a3] transition-all",
  },

  // Button styles
  button: {
    base: "px-4 py-2 rounded-lg font-semibold transition-colors",
    primary: "bg-[#009639] text-[#fefefe] hover:bg-[#007b2f]",        // Palestine flag green
    secondary: "bg-[#f5f5f5] text-[#404040] hover:bg-[#e5e5e5]",      // Palestine grays
    reset: "px-4 py-2 bg-[#ed3039] text-[#fefefe] rounded-md hover:bg-[#d4202a] transition-colors text-sm",  // Palestine flag red
    toggle: "px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors",
  },

  // Form styles
  input: {
    base: "px-3 py-2 border border-gray-300 rounded-md text-sm",
    focus: "focus:ring-2 focus:ring-[#009639] focus:border-[#009639]",
    number: "w-20",
    date: "",
  },

  select: {
    base: "w-full px-4 py-2 border border-[#d4d4d4] rounded-md focus:ring-2 focus:ring-[#009639] focus:border-[#009639]",  // Palestine flag green focus
    small: "px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#009639] focus:border-[#009639]",
  },

  label: {
    base: "block text-sm font-medium text-[#525252] mb-2",  // Palestine dark gray
    filter: "text-xs font-medium text-gray-600",
  },

  // Tag/Chip styles (for removable filter tags)
  tag: {
    base: "inline-flex items-center gap-1 px-2 py-1 text-xs",
    default: "bg-[#e5e5e5] text-gray-700",
    removeButton: "text-gray-500 hover:text-[#ed3039] font-bold",  // Palestine flag red
  },

  // Badge styles
  badge: {
    base: "inline-block px-2 py-1 rounded text-xs font-medium",
    primary: "bg-[#dcfce9] text-[#006226]",     // Palestine flag light/dark green
    success: "bg-[#dcfce9] text-[#006226]",     // Palestine flag greens
    warning: "bg-[#fef3f4] text-[#b01822]",     // Palestine flag light/dark red
    danger: "bg-[#fde6e8] text-[#d4202a]",      // Palestine flag reds
  },

  // Container styles
  container: {
    base: "container mx-auto px-4",
    section: "py-8",
  },

  // Header styles
  header: {
    base: "bg-[#000000] text-[#fefefe] shadow-lg border-b-2 border-[#009639]",  // Palestine flag black with green accent
    title: "text-3xl font-bold text-center",
    subtitle: "text-[#f5f5f5] mt-2 text-center",  // Light gray text
  },

  // Footer styles
  footer: {
    base: "bg-[#000000] text-[#a3a3a3] mt-16 border-t-2 border-[#009639]",  // Palestine flag black with green accent
    text: "text-sm text-center",
  },

  // Map styles
  map: {
    container: "h-[600px] w-full rounded-lg shadow-md border border-[#e5e5e5]",
  },

  // Table styles
  table: {
    base: "w-full text-sm text-left",
    header: "bg-[#000000] text-[#fefefe] sticky top-0 z-10",  // Palestine flag black and white
    th: "px-4 py-3 font-semibold",
    row: "border-b border-[#e5e5e5] hover:bg-[#fafafa] cursor-pointer transition-all",
    td: "px-4 py-3",
  },

  // Filter styles
  filter: {
    group: "flex flex-col gap-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50/50",
    labelContainer: "flex items-center gap-1 justify-center",
    inputContainer: "flex items-center gap-2",
    rangeSeparator: "text-xs text-gray-500",
    count: "mt-2 text-sm text-gray-600 text-center",
    countNumber: "font-semibold text-gray-900",
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
