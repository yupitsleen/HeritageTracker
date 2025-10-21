import { useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { COLORS } from "../constants/colors";

/**
 * Theme-aware CSS class utility hook
 *
 * Provides centralized, type-safe access to theme-conditional classes.
 * Eliminates the need for repeated `isDark ? "..." : "..."` conditionals.
 *
 * @example
 * ```tsx
 * const t = useThemeClasses();
 * return <h1 className={`text-2xl ${t.text.heading}`}>Title</h1>
 * ```
 *
 * @returns Object containing theme-aware CSS classes organized by category
 */
export function useThemeClasses() {
  const { isDark } = useTheme();

  return useMemo(() => ({
    /**
     * Text color classes
     */
    text: {
      /** Primary heading text (h1, h2) */
      heading: isDark ? "text-gray-100" : "text-gray-900",
      /** Secondary heading text (h3, h4) */
      subheading: isDark ? "text-gray-200" : "text-gray-800",
      /** Body text */
      body: isDark ? "text-gray-300" : "text-gray-700",
      /** Muted/secondary text */
      muted: isDark ? "text-gray-400" : "text-gray-600",
      /** Subtle/disabled text */
      subtle: isDark ? "text-gray-500" : "text-gray-500",
    },

    /**
     * Background color classes
     */
    bg: {
      /** Primary background (cards, containers) */
      primary: isDark ? "bg-gray-800" : "bg-white",
      /** Secondary background (nested containers) */
      secondary: isDark ? "bg-gray-700" : "bg-gray-50",
      /** Tertiary background (subtle emphasis) */
      tertiary: isDark ? "bg-gray-700/50" : "bg-gray-100",
      /** Hover state background */
      hover: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",
      /** Active/selected state */
      active: isDark ? "bg-gray-600" : "bg-gray-200",
    },

    /**
     * Border color classes
     */
    border: {
      /** Default border color */
      default: isDark ? "border-gray-700" : `border-[${COLORS.BORDER_DEFAULT_LIGHT}]`,
      /** Subtle border */
      subtle: isDark ? "border-gray-600" : "border-gray-300",
      /** Strong/emphasis border */
      strong: isDark ? "border-gray-500" : "border-gray-400",
      /** Black border (consistent across themes) */
      black: `border-[${COLORS.BORDER_BLACK}]`,
    },

    /**
     * Palestinian flag theme colors (muted in dark mode)
     */
    flag: {
      /** Background colors for Palestinian flag red */
      redBg: isDark ? "bg-[#8b2a30]" : "bg-[#ed3039]",
      /** Background colors for Palestinian flag green */
      greenBg: isDark ? "bg-[#2d5a38]" : "bg-[#009639]",
      /** Hover state for green buttons */
      greenHover: isDark ? "hover:bg-[#244a2e]" : "hover:bg-[#007b2f]",
    },

    /**
     * Form input classes
     */
    input: {
      /** Base input styling */
      base: isDark
        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
        : `bg-white border-[${COLORS.BORDER_BLACK}] text-gray-900 placeholder:text-gray-400`,
      /** Focus state */
      focus: `focus:outline-none focus:ring-2 focus:ring-[${COLORS.FLAG_GREEN}] focus:border-transparent`,
      /** Number input width */
      number: "w-20",
    },

    /**
     * Icon color classes
     */
    icon: {
      /** Default icon color */
      default: isDark ? "text-gray-300" : "text-gray-400",
      /** Muted icon color */
      muted: isDark ? "text-gray-400" : "text-gray-500",
    },

    /**
     * Card/container classes
     */
    card: {
      /** Card background and border */
      base: isDark
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200",
    },

    /**
     * Table classes
     */
    table: {
      /** Base table styling */
      base: "w-full text-sm text-left",
      /** Table cell padding */
      td: "px-4 py-3",
    },

    /**
     * Layout/container classes
     */
    layout: {
      /** Main app background */
      appBackground: isDark ? "bg-gray-800" : "bg-gray-200",
      /** Loading/fallback text */
      loadingText: isDark ? "text-gray-300" : "text-gray-600",
      /** Modal heading */
      modalHeading: isDark ? "text-gray-100" : "text-gray-900",
      /** Skip to content link focus state */
      skipLink: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10002] focus:bg-[#009639] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg",
    },

    /**
     * Timeline component classes
     */
    timeline: {
      /** Timeline container - Ultra compact */
      container: isDark
        ? "backdrop-blur-sm border border-[#000000] rounded px-2 pt-1.5 pb-1 shadow-lg transition-colors duration-200 bg-[#000000]/95"
        : "backdrop-blur-sm border border-[#000000] rounded px-2 pt-1.5 pb-1 shadow-lg transition-colors duration-200 bg-white/95",
      /** Current date display */
      currentDate: isDark ? "text-xs font-semibold text-center flex-1 text-[#fefefe]" : "text-xs font-semibold text-center flex-1",
      /** Clear date filter button (visible state) */
      clearFilterVisible: "flex items-center gap-1.5 px-2 py-1 rounded shadow-md hover:shadow-lg transition-all duration-200 text-[10px] font-semibold active:scale-95 border border-[#000000]",
      /** Clear date filter button (invisible/disabled state) */
      clearFilterInvisible: "invisible",
      /** Speed control select */
      speedSelect: "px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-[#009639] focus:border-[#009639]",
      /** Keyboard hint kbd element */
      kbdKey: "px-0.5 py-0 border rounded text-[10px]",
    },
  }), [isDark]);
}
