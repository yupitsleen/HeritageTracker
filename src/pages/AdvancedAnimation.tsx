import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { WaybackProvider, useWayback } from "../contexts/WaybackContext";
import { WaybackMap, WaybackSlider } from "../components/AdvancedTimeline";
import { mockSites } from "../data/mockSites";

/**
 * Advanced Animation Page Content
 * Displays Wayback releases and loading/error states
 */
function AdvancedAnimationContent() {
  const { isDark } = useTheme();
  const t = useThemeClasses();
  const navigate = useNavigate();
  const { releases, isLoading, error } = useWayback();
  const [showSiteMarkers, setShowSiteMarkers] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className={`min-h-screen relative transition-colors duration-200 ${t.layout.appBackground}`}
    >
      {/* Header with back button - compact design */}
      <header className={`${isDark ? "bg-black" : "bg-white"} shadow-xl border-b-2 ${isDark ? "border-white" : "border-black"}`}>
        <div className="max-w-full px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <span className="text-base">&larr;</span>
              Back to Main View
            </Button>
            <h1 className={`text-lg font-bold ${t.layout.modalHeading}`}>
              Advanced Satellite Timeline
            </h1>
          </div>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {releases.length > 0 ? `${releases.length} Historical Imagery Versions` : 'Historical Imagery Archive'}
          </div>
        </div>
      </header>

      {/* Main content area - compact padding */}
      <main className="h-[calc(100vh-58px)] p-3">
        {/* Loading State */}
        {isLoading && (
          <div className={`h-full rounded-lg border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl flex items-center justify-center`}>
            <div className="text-center">
              <div className={`text-xl mb-4 ${t.layout.modalHeading}`}>
                Loading Wayback Archive...
              </div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Fetching historical imagery versions...
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`h-full rounded-lg border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl flex items-center justify-center`}>
            <div className="text-center">
              <div className={`text-xl font-bold mb-4 text-red-600`}>
                Error Loading Wayback Archive
              </div>
              <div className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {error}
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                size="sm"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Success State - Map View */}
        {!isLoading && !error && releases.length > 0 && (
          <div className="h-full flex flex-col gap-2">
            {/* Map with optional site markers */}
            <div className={`flex-1 rounded-lg border-2 ${isDark ? "border-white" : "border-black"} shadow-xl overflow-hidden`}>
              <WaybackMap
                sites={mockSites}
                showSiteMarkers={showSiteMarkers}
                onSiteClick={(site) => setSelectedSiteId(site.id)}
              />
            </div>

            {/* Timeline Slider with destruction event markers and site markers toggle */}
            <div className={`rounded-lg border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl`}>
              <WaybackSlider
                sites={mockSites}
                showEventMarkers={true}
                highlightedSiteId={selectedSiteId}
                showSiteMarkers={showSiteMarkers}
                onToggleSiteMarkers={setShowSiteMarkers}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Advanced Animation Page
 * Wrapped with WaybackProvider for state management
 */
export function AdvancedAnimation() {
  return (
    <WaybackProvider>
      <AdvancedAnimationContent />
    </WaybackProvider>
  );
}
