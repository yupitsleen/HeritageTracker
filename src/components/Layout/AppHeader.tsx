import { components, cn } from "../../styles/theme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../Button";
import { COMPACT_HEADER } from "../../constants/compactDesign";

interface AppHeaderProps {
  onOpenDonate: () => void;
  onOpenStats: () => void;
  onOpenAbout: () => void;
}

/**
 * Application header with title, description, and action buttons
 * Black background with Palestinian flag colors
 * Includes dark mode toggle and navigation to advanced animation page
 */
export function AppHeader({ onOpenDonate, onOpenStats, onOpenAbout }: AppHeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnHomePage = location.pathname === "/" || location.pathname === "/HeritageTracker" || location.pathname === "/HeritageTracker/";

  return (
    <div className={`sticky top-0 z-[5] transition-colors duration-200 ${
      isDark ? "bg-gray-900 opacity-95" : "bg-[#000000] opacity-90"
    }`}>
      {/* Header - BLACK background, ultra compact */}
      <header className={components.header.base}>
        <div className={cn(components.container.base, "py-1.5")}>
          <h1 className={`text-base md:text-lg font-bold text-center text-[#fefefe]`}>Heritage Tracker</h1>
        </div>

        {/* All buttons - desktop only, right-aligned in top right, positioned relative to header */}
        <div className={`hidden md:flex absolute top-1.5 right-2 ${COMPACT_HEADER.buttonGap} items-center`}>
          {/* Dark Mode Toggle - Discrete icon button */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
            }`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <SunIcon className="w-4 h-4" />
            ) : (
              <MoonIcon className="w-4 h-4" />
            )}
          </button>

          {/* Advanced Animation Navigation - Only show on home page */}
          {isOnHomePage && (
            <Button
              onClick={() => navigate("/advanced-animation")}
              variant="secondary"
              size="xs"
              aria-label="Open Advanced Animation Timeline"
              title="View historical satellite imagery timeline with destruction events"
            >
              Advanced Timeline
            </Button>
          )}

          <Button
            onClick={onOpenDonate}
            variant="danger"
            size="xs"
            aria-label="Help Palestine - Donate to relief efforts"
          >
            Help Palestine
          </Button>
          <Button
            onClick={onOpenStats}
            variant="primary"
            size="xs"
            aria-label="View Statistics"
          >
            Statistics
          </Button>
          <Button
            onClick={onOpenAbout}
            variant="primary"
            size="xs"
            aria-label="About Heritage Tracker"
          >
            About
          </Button>
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
