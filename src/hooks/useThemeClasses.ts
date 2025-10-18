import { useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";

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
      default: isDark ? "border-gray-700" : "border-[#404040]",
      /** Subtle border */
      subtle: isDark ? "border-gray-600" : "border-gray-300",
      /** Strong/emphasis border */
      strong: isDark ? "border-gray-500" : "border-gray-400",
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
        : "bg-white border-[#000000] text-gray-900 placeholder:text-gray-400",
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
  }), [isDark]);
}
