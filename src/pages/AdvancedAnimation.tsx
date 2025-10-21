import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

/**
 * Advanced Animation Page
 * Full-screen dedicated page for Wayback Archive satellite imagery timeline
 * with all 150+ historical versions
 */
export function AdvancedAnimation() {
  const { isDark } = useTheme();
  const t = useThemeClasses();
  const navigate = useNavigate();

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
        <div className={`h-full rounded-lg border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl flex items-center justify-center`}>
          <div className="text-center">
            <h2 className={`text-3xl font-bold mb-4 ${t.layout.modalHeading}`}>
              Advanced Animation Coming Soon
            </h2>
            <p className={`text-lg mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              This page will feature:
            </p>
            <ul className={`text-left max-w-2xl mx-auto space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              <li>✓ Full-screen split-screen map comparison</li>
              <li>✓ 150+ ESRI Wayback satellite imagery versions (2014-2025)</li>
              <li>✓ Advanced timeline slider with precise date selection</li>
              <li>✓ Play/pause animation through all historical versions</li>
              <li>✓ Variable playback speed controls</li>
              <li>✓ Export timeline as GIF or MP4 video</li>
              <li>✓ Before/after swipe comparison tool</li>
              <li>✓ Site-specific destruction timeline view</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
