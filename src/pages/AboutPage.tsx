import { mockSites } from "../data/mockSites";
import { About } from "../components/About/About";
import { SharedLayout } from "../components/Layout/SharedLayout";

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
  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-6 pb-24 max-w-7xl">
        <About sites={mockSites} />
      </div>
    </SharedLayout>
  );
}
