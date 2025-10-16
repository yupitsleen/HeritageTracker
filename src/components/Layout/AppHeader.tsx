import { components, cn } from "../../styles/theme";

interface AppHeaderProps {
  onOpenDonate: () => void;
  onOpenStats: () => void;
  onOpenAbout: () => void;
}

/**
 * Application header with title, description, and action buttons
 * Black background with Palestinian flag colors
 */
export function AppHeader({ onOpenDonate, onOpenStats, onOpenAbout }: AppHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-[#000000]">
      {/* Header - BLACK background */}
      <header className={components.header.base}>
        <div className={cn(components.container.base, "py-3 relative")}>
          <h1 className="text-xl md:text-3xl font-bold text-center">Heritage Tracker</h1>
          <p className="text-[#f5f5f5] mt-1 md:mt-2 text-center text-xs md:text-base">
            Documenting the destruction of cultural heritage in Gaza (2023-2024)
          </p>

          {/* Help Palestine button - desktop only, positioned in top left */}
          <div className="hidden md:flex absolute top-3 left-4 md:top-6 md:left-6">
            <button
              onClick={onOpenDonate}
              className="px-3 py-1.5 bg-[#ed3039] hover:bg-[#d4202a] text-white text-xs md:text-sm rounded transition-colors font-medium"
              aria-label="Help Palestine - Donate to relief efforts"
            >
              Help Palestine
            </button>
          </div>

          {/* Statistics and About buttons - desktop only, positioned in top right */}
          <div className="hidden md:flex absolute top-3 right-4 md:top-6 md:right-6 gap-2">
            <button
              onClick={onOpenStats}
              className="px-3 py-1.5 bg-[#009639] hover:bg-[#007b2f] text-white text-xs md:text-sm rounded transition-colors font-medium"
              aria-label="View Statistics"
            >
              Statistics
            </button>
            <button
              onClick={onOpenAbout}
              className="px-3 py-1.5 bg-[#009639] hover:bg-[#007b2f] text-white text-xs md:text-sm rounded transition-colors font-medium"
              aria-label="About Heritage Tracker"
            >
              About
            </button>
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
