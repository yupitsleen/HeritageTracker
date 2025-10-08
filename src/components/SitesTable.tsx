import type { GazaSite } from "../types";
import { components, getStatusHexColor } from "../styles/theme";

interface SitesTableProps {
  sites: GazaSite[];
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
}

/**
 * Compact table view of heritage sites with click-to-view-details
 */
export function SitesTable({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
}: SitesTableProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex-shrink-0 px-2">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Heritage Sites</h2>
          <p className="text-sm text-gray-600 mt-1">
            Click any row to view details
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className={components.table.base}>
          <thead className={components.table.header}>
            <tr>
              <th className={components.table.th}>Site Name</th>
              <th className={components.table.th}>Type</th>
              <th className={components.table.th}>Status</th>
              <th className={components.table.th}>Date Destroyed</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr
                key={site.id}
                className={`${components.table.row} ${
                  highlightedSiteId === site.id ? "ring-2 ring-black ring-inset" : ""
                }`}
                onClick={() => {
                  onSiteClick(site);
                  onSiteHighlight?.(site.id);
                }}
              >
                <td className={components.table.td}>
                  <div className="font-semibold text-gray-900">{site.name}</div>
                  {site.titleArabic && (
                    <div className="text-sm text-gray-600 mt-1" dir="rtl">
                      {site.titleArabic}
                    </div>
                  )}
                </td>
                <td className={components.table.td}>
                  <span className="capitalize">
                    {site.type.replace("-", " ")}
                  </span>
                </td>
                <td className={components.table.td}>
                  <span
                    className="font-semibold capitalize"
                    style={{ color: getStatusHexColor(site.status) }}
                  >
                    {site.status.replace("-", " ")}
                  </span>
                </td>
                <td className={components.table.td}>
                  {new Date(site.dateDestroyed).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
