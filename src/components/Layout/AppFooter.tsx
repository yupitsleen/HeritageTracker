import { Link } from "react-router-dom";
import { cn, components } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";

interface AppFooterProps {
  isMobile: boolean;
}

/**
 * Application footer with attribution and navigation
 * Green background with Palestinian flag colors
 * Muted in dark mode
 * Stats, About, and Donate now navigate to dedicated pages for better performance
 */
export function AppFooter({ isMobile }: AppFooterProps) {
  const t = useThemeClasses();
  const translate = useTranslation();

  return (
    <footer className={`fixed bottom-0 left-0 right-0 text-[#fefefe] shadow-lg z-[5] opacity-50 transition-colors duration-200 ${t.flag.greenBg}`}>
      {/* Desktop footer - ultra compact */}
      {!isMobile && (
        <div className="py-1.5">
          <div className={cn(components.container.base)}>
            <p className="text-[10px] text-center">
              {translate("footer.title")} • {translate("footer.sources")} •{" "}
              <a
                href="https://github.com/yupitsleen/HeritageTracker"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="View source code on GitHub"
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
          <div className={cn(components.container.base)}>
            <p className="text-[10px] text-center font-semibold">
              {translate("footer.title")} •{" "}
              <Link
                to="/donate"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="Help Palestine - Donate to relief efforts"
              >
                {translate("footer.donate")}
              </Link>
              {" • "}
              <Link
                to="/stats"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="View Statistics"
              >
                {translate("footer.stats")}
              </Link>
              {" • "}
              <Link
                to="/about"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="About Heritage Tracker"
              >
                {translate("footer.about")}
              </Link>
              {" • "}
              <a
                href="https://github.com/yupitsleen/HeritageTracker"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="View source code on GitHub"
              >
                {translate("footer.github")}
              </a>
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
