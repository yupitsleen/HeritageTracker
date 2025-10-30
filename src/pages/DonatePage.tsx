import { DonateModal } from "../components/Donate/DonateModal";
import { SharedLayout } from "../components/Layout/SharedLayout";

/**
 * DonatePage - Dedicated page for donation information
 *
 * Benefits over modal:
 * - Native browser scrolling (60 FPS guaranteed)
 * - No GPU-intensive backdrop blur
 * - No portal rendering overhead
 * - Better SEO and sharing
 * - Browser back button support
 */
export function DonatePage() {
  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-6 pb-24 max-w-7xl">
        <DonateModal />
      </div>
    </SharedLayout>
  );
}
