import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { WaybackProvider, useWayback } from "../contexts/WaybackContext";

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
        <div className={`h-full rounded-lg border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl p-8 overflow-auto`}>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-full">
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
            <div className="flex items-center justify-center h-full">
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

          {/* Success State */}
          {!isLoading && !error && releases.length > 0 && (
            <div className="text-center">
              <h2 className={`text-3xl font-bold mb-4 ${t.layout.modalHeading}`}>
                Wayback Archive Loaded Successfully
              </h2>
              <div className={`text-6xl font-bold mb-6 text-[#009639]`}>
                {releases.length}
              </div>
              <p className={`text-lg mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Historical Imagery Versions Available
              </p>

              {/* Current Release Info */}
              {currentRelease && (
                <div className={`inline-block p-6 rounded-lg border ${isDark ? "border-white/30 bg-black/30" : "border-black/30 bg-white/30"} mb-8`}>
                  <div className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Currently Viewing:
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${t.layout.modalHeading}`}>
                    {currentRelease.label}
                  </div>
                  <div className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                    Release #{currentRelease.releaseNum}
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div className={`text-sm mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {releases[0]?.releaseDate} → {releases[releases.length - 1]?.releaseDate}
              </div>

              <p className={`text-lg mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Coming Soon:
              </p>
              <ul className={`text-left max-w-2xl mx-auto space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <li>✓ Full-screen split-screen map comparison</li>
                <li>✓ Advanced timeline slider with precise date selection</li>
                <li>✓ Play/pause animation through all historical versions</li>
                <li>✓ Variable playback speed controls (0.25x - 8x)</li>
                <li>✓ Export timeline as GIF or MP4 video</li>
                <li>✓ Before/after swipe comparison tool</li>
                <li>✓ Site-specific destruction timeline view</li>
              </ul>
            </div>
          )}
        </div>
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
