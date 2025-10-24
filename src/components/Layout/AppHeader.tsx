import { components, cn } from "../../styles/theme";
import { MoonIcon, SunIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../Button";
import { IconButton } from "../Button/IconButton";
import { LanguageSelector } from "../LanguageSelector";
import { COMPACT_HEADER } from "../../constants/compactDesign";

interface AppHeaderProps {
  onOpenDonate: () => void;
  onOpenStats: () => void;
  onOpenAbout: () => void;
  onOpenHelp?: () => void;
}

/**
 * Application header with title, description, and action buttons
 * Black background with Palestinian flag colors
 * Includes dark mode toggle and navigation to advanced animation page
 */
export function AppHeader({ onOpenDonate, onOpenStats, onOpenAbout, onOpenHelp }: AppHeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnHomePage = location.pathname === "/" || location.pathname === "/HeritageTracker" || location.pathname === "/HeritageTracker/";

  return (
    <div className={`sticky top-0 z-[10] transition-colors duration-200 ${
      isDark ? "bg-gray-900 opacity-95" : "bg-[#000000] opacity-90"
    }`} dir="ltr">
      {/* Header - BLACK background, ultra compact */}
      {/* dir="ltr" keeps navigation and utility controls in consistent positions */}
      <header className={components.header.base}>
        <div className={cn(components.container.base, "py-1.5 relative flex items-center justify-between")}>
          {/* Left: Title */}
          <h1 className={`text-lg md:text-xl font-bold text-[#fefefe] uppercase tracking-wide`}>
            Heritage Tracker
          </h1>

          {/* Center: Main action buttons - desktop only */}
          <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 ${COMPACT_HEADER.buttonGap} items-center`}>
            {/* Advanced Animation Navigation - Only show on home page */}
            {isOnHomePage && (
              <Button
                onClick={() => navigate("/advanced-animation")}
                variant="secondary"
                size="xs"
                lightText
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
              lightText
              aria-label="Help Palestine - Donate to relief efforts"
            >
              Help Palestine
            </Button>
            <Button
              onClick={onOpenStats}
              variant="primary"
              size="xs"
              lightText
              aria-label="View Statistics"
            >
              Statistics
            </Button>
            <Button
              onClick={onOpenAbout}
              variant="primary"
              size="xs"
              lightText
              aria-label="About Heritage Tracker"
            >
              About
            </Button>
          </div>

          {/* Right: Icon buttons - desktop only */}
          <div className={`hidden md:flex ${COMPACT_HEADER.buttonGap} items-center`}>
            {/* Help Button - Question mark icon */}
            {onOpenHelp && (
              <IconButton
                icon={<QuestionMarkCircleIcon className="w-4 h-4" />}
                onClick={onOpenHelp}
                ariaLabel="How to use this page"
                title="How to use this page"
              />
            )}

            {/* Language Selector - Dropdown showing all registered locales */}
            <LanguageSelector />

            {/* Dark Mode Toggle - Discrete icon button */}
            <IconButton
              icon={isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              onClick={toggleTheme}
              ariaLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            />
          </div>
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
