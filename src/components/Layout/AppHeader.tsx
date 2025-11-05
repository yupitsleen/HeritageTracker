import { useState, useEffect } from "react";
import { cn } from "../../styles/theme";
import { MoonIcon, SunIcon, QuestionMarkCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "../../contexts/LocaleContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../Button";
import { IconButton } from "../Button/IconButton";
import { LanguageSelector } from "../LanguageSelector";
import { NavigationLinks } from "./NavigationLinks";
import { COMPACT_HEADER } from "../../constants/compactDesign";
import { Z_INDEX } from "../../constants/layout";

interface AppHeaderProps {
  onOpenHelp?: () => void;
}

/**
 * Application header with title, description, and action buttons
 * Black background with Palestinian flag colors
 * Includes dark mode toggle and navigation to all pages
 * Dashboard, Data, Timeline, Stats, About, and Donate pages
 * Mobile: Hamburger menu for navigation
 */
export function AppHeader({ onOpenHelp }: AppHeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const t = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if screen is mobile size (< 1024px lg breakpoint)
  // Dashboard page redirects mobile users to Data page, so hide Dashboard nav on mobile
  const [isMobileSize, setIsMobileSize] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  });

  // Update mobile size state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  // Determine active page for highlighting
  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/" || path === "/HeritageTracker" || path === "/HeritageTracker/") return "dashboard";
    if (path.includes("/data")) return "data";
    if (path.includes("/timeline")) return "timeline";
    if (path.includes("/donate")) return "donate";
    if (path.includes("/stats")) return "stats";
    if (path.includes("/about")) return "about";
    return null;
  };

  const activePage = getActivePage();

  // Close mobile menu when navigating
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className={`sticky top-0 transition-colors duration-200 ${
        isDark ? "bg-gray-900" : "bg-[#000000]"
      }`}
      style={{ zIndex: Z_INDEX.STICKY }}
      dir="ltr"
    >
      {/* Header - BLACK background, ultra compact */}
      {/* dir="ltr" keeps navigation and utility controls in consistent positions */}
      <header className="bg-[#000000] text-[#fefefe] shadow-lg border-b-2 border-[#009639]">
        <div className={cn("container mx-auto px-4", "py-1.5 relative flex items-center justify-between")}>
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

          {/* Center: Main action buttons - hidden on small/medium screens, shown on large+ */}
          <div className={`hidden xl:flex absolute left-1/2 -translate-x-1/2 ${COMPACT_HEADER.buttonGap} items-center`}>
            <NavigationLinks
              activePage={activePage}
              isMobileSize={isMobileSize}
              onNavigate={(path) => navigate(path)}
              layout="desktop"
            />
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
                className="hidden xl:flex"
              />
            )}

            {/* Language Selector - Dropdown showing all registered locales - desktop only */}
            <div className="hidden xl:flex">
              <LanguageSelector />
            </div>

            {/* Dark Mode Toggle - Discrete icon button - desktop only */}
            <div className="hidden xl:flex">
              <IconButton
                icon={isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                onClick={toggleTheme}
                ariaLabel={isDark ? t("common.settings") : t("common.settings")}
                title={isDark ? t("common.settings") : t("common.settings")}
              />
            </div>

            {/* Hamburger Menu Button - Mobile/Tablet only (< 1280px) */}
            <IconButton
              icon={isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              ariaLabel={isMobileMenuOpen ? "Close menu" : "Open menu"}
              title={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="xl:hidden"
            />
          </div>
        </div>

        {/* Mobile Menu Drawer - Slides down from top */}
        {isMobileMenuOpen && (
          <div
            className="xl:hidden bg-[#000000] border-t border-gray-700 animate-slideDown"
            style={{ zIndex: Z_INDEX.DROPDOWN }}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {/* Navigation Links */}
              <NavigationLinks
                activePage={activePage}
                isMobileSize={isMobileSize}
                onNavigate={handleNavigation}
                layout="mobile"
              />

              {/* Divider */}
              <div className="border-t border-gray-700 my-2"></div>

              {/* Utility Controls */}
              <div className="flex items-center justify-between px-3">
                <span className="text-sm text-gray-400">Language</span>
                <LanguageSelector />
              </div>

              <div className="flex items-center justify-between px-3">
                <span className="text-sm text-gray-400">Theme</span>
                <IconButton
                  icon={isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                  onClick={toggleTheme}
                  ariaLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                />
              </div>

              {onOpenHelp && (
                <Button
                  onClick={() => {
                    onOpenHelp();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  size="sm"
                  lightText
                  className="w-full justify-start"
                >
                  <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
                  {t("common.help")}
                </Button>
              )}
            </nav>
          </div>
        )}
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
