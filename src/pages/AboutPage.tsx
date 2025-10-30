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
      <div className="max-w-4xl mx-auto py-6">
        <About sites={mockSites} />
      </div>
    </SharedLayout>
  );
}
