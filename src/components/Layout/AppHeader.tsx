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
    <div className="sticky top-0 z-[5] bg-[#000000] opacity-90">
      {/* Header - BLACK background */}
      <header className={components.header.base}>
        <div className={cn(components.container.base, "py-3")}>
          <h1 className="text-xl md:text-3xl font-bold text-center">Heritage Tracker</h1>
          <p className="text-[#f5f5f5] mt-1 md:mt-2 text-center text-xs md:text-base">
            Documenting the destruction of cultural heritage in Gaza (2023-2024)
          </p>
        </div>

        {/* All buttons - desktop only, right-aligned in top right, positioned relative to header */}
        <div className="hidden md:flex absolute top-3 right-4 md:top-6 md:right-6 gap-3">
          <button
            onClick={onOpenDonate}
            className="px-4 py-2 bg-[#ed3039] hover:bg-[#d4202a] text-white
                       text-sm rounded-lg shadow-md hover:shadow-lg
                       transition-all duration-200 font-semibold
                       active:scale-95"
            aria-label="Help Palestine - Donate to relief efforts"
          >
            Help Palestine
          </button>
          <button
            onClick={onOpenStats}
            className="px-4 py-2 bg-[#009639] hover:bg-[#007b2f] text-white
                       text-sm rounded-lg shadow-md hover:shadow-lg
                       transition-all duration-200 font-semibold
                       active:scale-95"
            aria-label="View Statistics"
          >
            Statistics
          </button>
          <button
            onClick={onOpenAbout}
            className="px-4 py-2 bg-[#009639] hover:bg-[#007b2f] text-white
                       text-sm rounded-lg shadow-md hover:shadow-lg
                       transition-all duration-200 font-semibold
                       active:scale-95"
            aria-label="About Heritage Tracker"
          >
            About
          </button>
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
