import { components, cn } from "../../styles/theme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface AppHeaderProps {
  onOpenDonate: () => void;
  onOpenStats: () => void;
  onOpenAbout: () => void;
}

/**
 * Application header with title, description, and action buttons
 * Black background with Palestinian flag colors
 * Includes dark mode toggle
 */
export function AppHeader({ onOpenDonate, onOpenStats, onOpenAbout }: AppHeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const t = useThemeClasses();

  return (
    <div className={`sticky top-0 z-[5] transition-colors duration-200 ${
      isDark ? "bg-gray-900 opacity-95" : "bg-[#000000] opacity-90"
    }`}>
      {/* Header - BLACK background */}
      <header className={components.header.base}>
        <div className={cn(components.container.base, "py-3")}>
          <h1 className={`text-xl md:text-3xl font-bold text-center ${isDark ? t.text.heading : "text-white"}`}>Heritage Tracker</h1>
          <p className={`mt-1 md:mt-2 text-center text-xs md:text-base ${isDark ? t.text.body : "text-[#f5f5f5]"}`}>
            Documenting the destruction of cultural heritage in Gaza (2023-2024)
          </p>
        </div>

        {/* All buttons - desktop only, right-aligned in top right, positioned relative to header */}
        <div className="hidden md:flex absolute top-3 right-4 md:top-6 md:right-6 gap-3 items-center">
          {/* Dark Mode Toggle - Discrete icon button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
            }`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onOpenDonate}
            className={`px-4 py-2 text-white text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold active:scale-95 ${t.flag.redBg} ${isDark ? "hover:bg-[#a01f25]" : "hover:bg-[#d4202a]"}`}
            aria-label="Help Palestine - Donate to relief efforts"
          >
            Help Palestine
          </button>
          <button
            onClick={onOpenStats}
            className={`px-4 py-2 text-white text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold active:scale-95 ${t.flag.greenBg} ${t.flag.greenHover}`}
            aria-label="View Statistics"
          >
            Statistics
          </button>
          <button
            onClick={onOpenAbout}
            className={`px-4 py-2 text-white text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold active:scale-95 ${t.flag.greenBg} ${t.flag.greenHover}`}
            aria-label="About Heritage Tracker"
          >
            About
          </button>
        </div>
      </header>

      {/* Flag-colored horizontal line - RED, BLACK, RED, GREEN (4px high, 4 bars) */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#ed3039]"></div>
        <div className="flex-1 bg-[#000000]"></div>
        <div className="flex-1 bg-[#ed3039]"></div>
        <div className="flex-1 bg-[#009639]"></div>
      </div>
    </div>
  );
}
