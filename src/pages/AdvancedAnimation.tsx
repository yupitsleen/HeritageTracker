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
  const { releases, currentRelease, isLoading, error } = useWayback();
  const [showSiteMarkers, setShowSiteMarkers] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className={`min-h-screen relative transition-colors duration-200 ${t.layout.appBackground}`}
    >
      {/* Header with back button */}
      <header className={`${isDark ? "bg-black" : "bg-white"} shadow-xl border-b-2 ${isDark ? "border-white" : "border-black"}`}>
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <span className="text-lg">&larr;</span>
              Back to Main View
            </Button>
            <h1 className={`text-2xl font-bold ${t.layout.modalHeading}`}>
              Advanced Satellite Timeline
            </h1>
          </div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {releases.length > 0 ? `${releases.length} Historical Imagery Versions` : 'Historical Imagery Archive'}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="h-[calc(100vh-80px)] p-6">
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
          <div className="h-full flex flex-col gap-4">
            {/* Info Panel with site markers toggle */}
            <div className={`p-4 rounded-lg border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {releases.length} Releases • {releases[0]?.releaseDate} → {releases[releases.length - 1]?.releaseDate}
                  </div>

                  {/* Site markers toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSiteMarkers}
                      onChange={(e) => setShowSiteMarkers(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Show site markers
                    </span>
                  </label>
                </div>

                {currentRelease && (
                  <div className="text-right">
                    <div className={`text-lg font-bold ${t.layout.modalHeading}`}>
                      {currentRelease.label}
                    </div>
                    <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                      Release #{currentRelease.releaseNum}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map with optional site markers */}
            <div className={`flex-1 rounded-lg border-2 ${isDark ? "border-white" : "border-black"} shadow-xl overflow-hidden`}>
              <WaybackMap
                sites={mockSites}
                showSiteMarkers={showSiteMarkers}
                onSiteClick={(site) => setSelectedSiteId(site.id)}
              />
            </div>

            {/* Timeline Slider with destruction event markers */}
            <div className={`rounded-lg border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl`}>
              <WaybackSlider
                sites={mockSites}
                showEventMarkers={true}
                highlightedSiteId={selectedSiteId}
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
