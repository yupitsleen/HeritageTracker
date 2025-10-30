import { components, cn } from "../../styles/theme";
import { MoonIcon, SunIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "../../contexts/LocaleContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../Button";
import { IconButton } from "../Button/IconButton";
import { LanguageSelector } from "../LanguageSelector";
import { COMPACT_HEADER } from "../../constants/compactDesign";
import { Z_INDEX } from "../../constants/layout";

interface AppHeaderProps {
  onOpenHelp?: () => void;
}

/**
 * Application header with title, description, and action buttons
 * Black background with Palestinian flag colors
 * Includes dark mode toggle and navigation to advanced animation page
 * Stats, About, and Donate now navigate to dedicated pages for better performance
 */
export function AppHeader({ onOpenHelp }: AppHeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const t = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page for highlighting
  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/" || path === "/HeritageTracker" || path === "/HeritageTracker/") return "home";
    if (path.includes("/advanced-animation")) return "advanced-animation";
    if (path.includes("/donate")) return "donate";
    if (path.includes("/stats")) return "stats";
    if (path.includes("/about")) return "about";
    return null;
  };

  const activePage = getActivePage();

  return (
    <div
      className={`sticky top-0 transition-colors duration-200 ${
        isDark ? "bg-gray-900 opacity-95" : "bg-[#000000] opacity-90"
      }`}
      style={{ zIndex: Z_INDEX.STICKY }}
      dir="ltr"
    >
      {/* Header - BLACK background, ultra compact */}
      {/* dir="ltr" keeps navigation and utility controls in consistent positions */}
      <header className={components.header.base}>
        <div className={cn(components.container.base, "py-1.5 relative flex items-center justify-between")}>
          {/* Left: Title - clickable to return home */}
          <h1 className={`text-lg md:text-xl font-bold text-[#fefefe] uppercase tracking-wide`}>
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer uppercase"
              aria-label="Go to home page"
            >
              {t("header.title")}
            </button>
          </h1>

          {/* Center: Main action buttons - desktop only */}
          <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 ${COMPACT_HEADER.buttonGap} items-center`}>
            {/* Home/Dashboard Navigation */}
            <Button
              onClick={() => navigate("/")}
              variant={activePage === "home" ? "primary" : "ghost"}
              size="xs"
              lightText
              aria-label={t("header.dashboard")}
              className={activePage === "home" ? "ring-2 ring-white/50 border" : "border-0"}
            >
              {t("header.dashboard")}
            </Button>

            {/* Advanced Animation Navigation */}
            <Button
              onClick={() => navigate("/advanced-animation")}
              variant={activePage === "advanced-animation" ? "secondary" : "ghost"}
              size="xs"
              lightText
              aria-label={t("header.advancedTimeline")}
              title={t("header.advancedTimeline")}
              className={activePage === "advanced-animation" ? "ring-2 ring-white/50 border" : "border-0"}
            >
              {t("header.advancedTimeline")}
            </Button>

            {/* Donate Navigation */}
            <Button
              onClick={() => navigate("/donate")}
              variant={activePage === "donate" ? "danger" : "ghost"}
              size="xs"
              lightText
              aria-label={t("header.helpPalestine")}
              className={activePage === "donate" ? "ring-2 ring-white/50 border" : "border-0"}
            >
              {t("header.helpPalestine")}
            </Button>

            {/* Stats Navigation */}
            <Button
              onClick={() => navigate("/stats")}
              variant={activePage === "stats" ? "primary" : "ghost"}
              size="xs"
              lightText
              aria-label={t("header.statistics")}
              className={activePage === "stats" ? "ring-2 ring-white/50 border" : "border-0"}
            >
              {t("header.statistics")}
            </Button>

            {/* About Navigation */}
            <Button
              onClick={() => navigate("/about")}
              variant={activePage === "about" ? "primary" : "ghost"}
              size="xs"
              lightText
              aria-label={t("header.about")}
              className={activePage === "about" ? "ring-2 ring-white/50 border" : "border-0"}
            >
              {t("header.about")}
            </Button>
          </div>

          {/* Right: Icon buttons */}
          <div className={`flex ${COMPACT_HEADER.buttonGap} items-center`}>
            {/* Help Button - Question mark icon - desktop only */}
            {onOpenHelp && (
              <IconButton
                icon={<QuestionMarkCircleIcon className="w-4 h-4" />}
                onClick={onOpenHelp}
                ariaLabel={t("common.help")}
                title={t("common.help")}
                className="hidden md:flex"
              />
            )}

            {/* Language Selector - Dropdown showing all registered locales - always visible */}
            <LanguageSelector />

            {/* Dark Mode Toggle - Discrete icon button */}
            <IconButton
              icon={isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              onClick={toggleTheme}
              ariaLabel={isDark ? t("common.settings") : t("common.settings")}
              title={isDark ? t("common.settings") : t("common.settings")}
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
