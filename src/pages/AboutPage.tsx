import { Link } from "react-router-dom";
import { mockSites } from "../data/mockSites";
import { About } from "../components/About/About";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { ChevronIcon } from "../components/Icons/ChevronIcon";

/**
 * AboutPage - Dedicated page for About content (no modal wrapper)
 *
 * Benefits over modal:
 * - Native browser scrolling (60 FPS guaranteed)
 * - No GPU-intensive backdrop blur
 * - No portal rendering overhead
 * - Better SEO and sharing
 * - Browser back button support
 */
export function AboutPage() {
  const t = useThemeClasses();

  return (
    <div className={`min-h-screen ${t.bg.primary}`}>
      {/* Header with back button */}
      <div className={`sticky top-0 z-10 ${t.bg.primary} border-b ${t.border.primary} shadow-sm`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 ${t.text.body} hover:underline transition-colors`}
          >
            <ChevronIcon direction="left" className="w-4 h-4" />
            Back to Map
          </Link>
        </div>
      </div>

      {/* About content (no modal wrapper) */}
      <div className="max-w-4xl mx-auto">
        <About sites={mockSites} />
      </div>
    </div>
  );
}
