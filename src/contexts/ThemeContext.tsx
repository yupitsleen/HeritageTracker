import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

/**
 * Dark Mode Color Mapping Reference
 *
 * This reference documents the systematic color transformations applied
 * when switching between light and dark themes. These mappings ensure
 * consistent contrast ratios and visual hierarchy across both modes.
 *
 * Light Mode → Dark Mode
 * ========================================
 *
 * Text Colors:
 * ------------
 * text-gray-900 (headings)      → text-gray-100
 * text-gray-800 (subheadings)   → text-gray-200
 * text-gray-700 (body text)     → text-gray-300
 * text-gray-600 (muted text)    → text-gray-400
 * text-gray-500 (subtle text)   → text-gray-500 (unchanged)
 *
 * Backgrounds:
 * ------------
 * bg-white (primary)            → bg-gray-800
 * bg-gray-50 (secondary)        → bg-gray-700
 * bg-gray-100 (tertiary)        → bg-gray-700
 * bg-gray-50/50 (semi-trans)    → bg-gray-700/50
 *
 * Borders:
 * --------
 * border-gray-200 (default)     → border-gray-700
 * border-gray-300 (subtle)      → border-gray-600
 * border-gray-400 (strong)      → border-gray-500
 *
 * Palestinian Flag Theme Colors:
 * ------------------------------
 * Red:   #ed3039 (vibrant)      → #8b2a30 (muted)
 * Green: #009639 (vibrant)      → #2d5a38 (muted)
 * Black: #000000                → #000000 (unchanged)
 * White: #fefefe                → #fefefe (unchanged)
 *
 * Usage:
 * ------
 * Instead of manual conditionals, use the useThemeClasses() hook:
 *
 * @example
 * ```tsx
 * import { useThemeClasses } from '../hooks/useThemeClasses';
 *
 * function MyComponent() {
 *   const t = useThemeClasses();
 *   return <h1 className={`text-2xl ${t.text.heading}`}>Title</h1>;
 * }
 * ```
 */

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider for managing light/dark mode
 * Persists theme preference to localStorage
 * Applies data-theme attribute to document root for CSS selectors
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize from localStorage or default to light
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("heritage-tracker-theme");
    return (stored === "dark" || stored === "light") ? stored : "light";
  });

  // Persist theme changes to localStorage and apply to document root
  useEffect(() => {
    localStorage.setItem("heritage-tracker-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
