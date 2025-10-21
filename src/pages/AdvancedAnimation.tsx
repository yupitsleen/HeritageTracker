import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { WaybackProvider, useWayback } from "../contexts/WaybackContext";
import { WaybackMap } from "../components/AdvancedTimeline/WaybackMap";
import { WaybackSlider } from "../components/AdvancedTimeline/WaybackSlider";

/**
 * Advanced Animation Page Content
 * Displays Wayback releases and loading/error states
 */
function AdvancedAnimationContent() {
  const { isDark } = useTheme();
  const t = useThemeClasses();
  const navigate = useNavigate();
  const { releases, currentRelease, isLoading, error } = useWayback();

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
            150+ Historical Imagery Versions
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
                Fetching 150+ historical imagery versions
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
            {/* Info Panel */}
            <div className={`p-4 rounded-lg border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {releases.length} Releases • {releases[0]?.releaseDate} → {releases[releases.length - 1]?.releaseDate}
                  </div>
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

            {/* Map */}
            <div className={`flex-1 rounded-lg border-2 ${isDark ? "border-white" : "border-black"} shadow-xl overflow-hidden`}>
              <WaybackMap />
            </div>

            {/* Timeline Slider */}
            <div className={`rounded-lg border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl`}>
              <WaybackSlider />
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
