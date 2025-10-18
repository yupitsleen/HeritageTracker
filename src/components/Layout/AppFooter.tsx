import { cn, components } from "../../styles/theme";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { isDark } = useTheme();

  return (
    <footer className={`fixed bottom-0 left-0 right-0 text-[#fefefe] shadow-lg z-[5] opacity-50 transition-colors duration-200 ${
      isDark ? "bg-[#2d5a38]" : "bg-[#009639]"
    }`}>
      {/* Desktop footer - full text with more height */}
      {!isMobile && (
        <div className="py-4">
          <div className={cn(components.container.base)}>
            <p className="text-sm text-center">
              Heritage Tracker • Evidence-based documentation • All data verified by UNESCO,
              Forensic Architecture, and Heritage for Peace
            </p>
          </div>
        </div>
      )}

      {/* Mobile footer - site name with navigation links */}
      {isMobile && (
        <div className="py-2">
          <div className={cn(components.container.base)}>
            <p className="text-xs text-center font-semibold">
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
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
