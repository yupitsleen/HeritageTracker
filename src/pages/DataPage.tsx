import { mockSites } from "../data/mockSites";
import { SitesTable } from "../components/SitesTable";
import { SharedLayout } from "../components/Layout/SharedLayout";

export function DataPage() {
  return (
    <SharedLayout>
      <div className="h-[calc(100vh-140px)] py-6">
        <SitesTable
          sites={mockSites}
          onSiteClick={() => {}}
          onSiteHighlight={() => {}}
          highlightedSiteId={null}
          variant="expanded"
        />
      </div>
    </SharedLayout>
  );
}
