import { mockSites } from "../data/mockSites";
import { StatsDashboard } from "../components/Stats/StatsDashboard";
import { SharedLayout } from "../components/Layout/SharedLayout";

/**
 * StatsPage - Dedicated page for Statistics content (no modal wrapper)
 *
 * Benefits over modal:
 * - Native browser scrolling (60 FPS guaranteed)
 * - No GPU-intensive backdrop blur
 * - No portal rendering overhead
 * - Better SEO and sharing
 * - Browser back button support
 */
export function StatsPage() {
  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-6 pb-24 max-w-7xl">
        <StatsDashboard sites={mockSites} />
      </div>
    </SharedLayout>
  );
}
