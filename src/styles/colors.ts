/**
 * Palestinian Flag Theme Colors
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
} as const;
