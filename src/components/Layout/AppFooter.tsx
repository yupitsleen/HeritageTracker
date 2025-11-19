import { Link } from "react-router-dom";
import { cn } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";
import { Z_INDEX } from "../../constants/layout";

interface AppFooterProps {
  isMobile: boolean;
  transparent?: boolean; // If true, use transparent background. If false, use green background.
}

/**
 * Application footer with attribution and navigation
 * Can be transparent (Dashboard/Timeline) or green (all other pages)
 * Stats, About, and Donate now navigate to dedicated pages for better performance
 */
export function AppFooter({ isMobile, transparent = false }: AppFooterProps) {
  const t = useThemeClasses();
  const translate = useTranslation();

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 shadow-lg transition-colors duration-200 ${
        transparent ? 'bg-transparent' : 'bg-[#009639]'
      } ${transparent ? t.text.primary : 'text-white'}`}
      style={{ zIndex: Z_INDEX.STICKY }}
    >
      {/* Desktop footer - ultra compact */}
      {!isMobile && (
        <div className="py-1.5">
          <div className={cn("container mx-auto px-4")}>
            <p className="text-[10px] text-center">
              {translate("footer.title")} •{" "}
              <a
                href="https://github.com/yupitsleen/HeritageTracker"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline transition-colors ${
                  transparent ? 'hover:text-[#fefefe]/80' : 'hover:text-white/80'
                }`}
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
          <div className={cn("container mx-auto px-4")}>
            <p className="text-[10px] text-center font-semibold">
              {translate("footer.title")} •{" "}
              <Link
                to="/donate"
                className={`underline transition-colors ${
                  transparent ? 'hover:text-[#fefefe]/80' : 'hover:text-white/80'
                }`}
                aria-label={translate("aria.helpPalestineDonate")}
              >
                {translate("footer.donate")}
              </Link>
              {" • "}
              <Link
                to="/stats"
                className={`underline transition-colors ${
                  transparent ? 'hover:text-[#fefefe]/80' : 'hover:text-white/80'
                }`}
                aria-label={translate("aria.viewStatistics")}
              >
                {translate("footer.stats")}
              </Link>
              {" • "}
              <Link
                to="/about"
                className={`underline transition-colors ${
                  transparent ? 'hover:text-[#fefefe]/80' : 'hover:text-white/80'
                }`}
                aria-label={translate("aria.aboutHeritageTracker")}
              >
                {translate("footer.about")}
              </Link>
              {" • "}
              <a
                href="https://github.com/yupitsleen/HeritageTracker"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline transition-colors ${
                  transparent ? 'hover:text-[#fefefe]/80' : 'hover:text-white/80'
                }`}
                aria-label={translate("aria.viewGithub")}
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
