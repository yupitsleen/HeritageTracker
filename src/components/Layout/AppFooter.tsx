import { cn, components } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface AppFooterProps {
  onOpenDonate: () => void;
  onOpenStats: () => void;
  onOpenAbout: () => void;
  isMobile: boolean;
}

/**
 * Application footer with attribution and navigation
 * Green background with Palestinian flag colors
 * Muted in dark mode
 */
export function AppFooter({ onOpenDonate, onOpenStats, onOpenAbout, isMobile }: AppFooterProps) {
  const t = useThemeClasses();

  return (
    <footer className={`fixed bottom-0 left-0 right-0 text-[#fefefe] shadow-lg z-[5] opacity-50 transition-colors duration-200 ${t.flag.greenBg}`}>
      {/* Desktop footer - ultra compact */}
      {!isMobile && (
        <div className="py-1.5">
          <div className={cn(components.container.base)}>
            <p className="text-[10px] text-center">
              Heritage Tracker • UNESCO, Forensic Architecture, Heritage for Peace •{" "}
              <a
                href="https://github.com/yupitsleen/HeritageTracker"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="View source code on GitHub"
              >
                Github
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
              Heritage Tracker •{" "}
              <button
                onClick={onOpenDonate}
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="Help Palestine - Donate to relief efforts"
              >
                Donate
              </button>
              {" • "}
              <button
                onClick={onOpenStats}
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="View Statistics"
              >
                Stats
              </button>
              {" • "}
              <button
                onClick={onOpenAbout}
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="About Heritage Tracker"
              >
                About
              </button>
              {" • "}
              <a
                href="https://github.com/yupitsleen/HeritageTracker"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#fefefe]/80 transition-colors"
                aria-label="View source code on GitHub"
              >
                Github
              </a>
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
