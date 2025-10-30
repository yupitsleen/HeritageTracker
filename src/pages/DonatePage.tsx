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
      <div className="max-w-4xl mx-auto py-6">
        <DonateModal />
      </div>
    </SharedLayout>
  );
}
