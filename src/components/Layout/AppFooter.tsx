import { Link, useLocation } from "react-router-dom";
import { cn } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";
import { ResourcesDropdown } from "./ResourcesDropdown";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { TOOLTIPS } from "../../config/tooltips";
import { Z_INDEX } from "../../constants/layout";
import type { TranslationKey } from "../../types/i18n";

interface AppFooterProps {
  isMobile: boolean;
  /** Pages with a help modal pass its opener; the footer renders the only trigger. */
  onOpenHelp?: () => void;
}

/**
 * Site navigation. The header is a logo and a title now, so the footer is the
 * only thing standing between these pages and being unreachable.
 * Dashboard is desktop-only — mobile visitors are redirected off it to Data.
 */
const NAV_ITEMS: { path: string; translationKey: TranslationKey; desktopOnly?: boolean }[] = [
  { path: "/timeline", translationKey: "header.timeline" },
  { path: "/data", translationKey: "header.data" },
  { path: "/dashboard", translationKey: "header.dashboard", desktopOnly: true },
];

/**
 * Application footer with attribution and navigation
 * Green background with Palestinian flag colors
 * Muted in dark mode
 * Stats, About, and Donate now navigate to dedicated pages for better performance
 * Shows dynamic copyright year and last updated date
 */
export function AppFooter({ isMobile, onOpenHelp }: AppFooterProps) {
  const t = useThemeClasses();
  const translate = useTranslation();
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();

  // "/" renders the Timeline, so it counts as that page for highlighting.
  const activePage = pathname === "/" ? "timeline" : pathname.replace(/^\//, "");

  const nav = (
    <nav
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px]"
      aria-label={translate("aria.mainNavigation")}
    >
      {NAV_ITEMS.filter((item) => !(item.desktopOnly && isMobile)).map(
        ({ path, translationKey }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "underline hover:text-[#fefefe]/80 transition-colors",
              activePage === path.slice(1) && "font-bold no-underline"
            )}
            aria-current={activePage === path.slice(1) ? "page" : undefined}
          >
            {translate(translationKey)}
          </Link>
        )
      )}
      <ResourcesDropdown
        activePage={activePage}
        onNavigate={() => {}}
        layout="desktop"
        direction="up"
      />
      {onOpenHelp && (
        <button
          type="button"
          onClick={onOpenHelp}
          className="flex items-center gap-1 underline hover:text-[#fefefe]/80 transition-colors focus:ring-2 focus:ring-white/60 focus:outline-none rounded"
          title={TOOLTIPS.HEADER.HELP}
        >
          <QuestionMarkCircleIcon className="w-3.5 h-3.5" aria-hidden="true" />
          {translate("common.help")}
        </button>
      )}
    </nav>
  );

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 text-[#fefefe] shadow-lg transition-colors duration-200 ${t.flag.greenBg}`}
      style={{ zIndex: Z_INDEX.STICKY }}
    >
      {/* Desktop footer - ultra compact. One row: the Timeline page sizes its content
          against this footer, so the nav sits beside the copyright, not above it. */}
      {!isMobile && (
        <div className="py-0.5">
          <div className={cn("container mx-auto px-4 flex flex-wrap items-center justify-center gap-x-3")}>
            {nav}
            <p className="text-[10px] text-center">
              {translate("footer.copyright").replace("{year}", currentYear.toString())} •{" "}
              <a
                href="https://github.com/yupitsleen/HeritageTracker"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label={translate("aria.viewGithub")}
              >
                {translate("footer.github")}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Mobile footer - compact */}
      {isMobile && (
        <div className="py-1.5">
          <div className={cn("container mx-auto px-4 flex flex-col items-center gap-0.5")}>
            {nav}
            <p className="text-[10px] text-center font-semibold">
              {translate("footer.title")} •{" "}
              <Link
                to="/donate"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label={translate("aria.helpPalestineDonate")}
              >
                {translate("footer.donate")}
              </Link>
              {" • "}
              <a
                href="https://github.com/yupitsleen/HeritageTracker"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label={translate("aria.viewGithub")}
              >
                {translate("footer.github")}
              </a>
            </p>
            <p className="text-[9px] text-center mt-1 opacity-80">
              {translate("footer.copyright").replace("{year}", currentYear.toString())}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
