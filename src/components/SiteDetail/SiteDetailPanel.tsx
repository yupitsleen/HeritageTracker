import type { GazaSite } from "../../types";
import { StatusBadge } from "../StatusBadge";
import { formatLabel } from "../../utils/format";
import { cn } from "../../styles/theme";

interface SiteDetailPanelProps {
  site: GazaSite;
}

/**
 * Comprehensive detail panel for heritage sites
 * Displays full information, images, and sources
 */
export function SiteDetailPanel({ site }: SiteDetailPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-3">
        <StatusBadge status={site.status} className="inline-block" />

        {/* Site Names */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900">{site.name}</h3>
          {site.nameArabic && (
            <p className="text-xl text-gray-600 mt-2 text-right" dir="rtl">
              {site.nameArabic}
            </p>
          )}
        </div>
      </div>

      {/* Key Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
        <InfoItem label="Site Type" value={formatLabel(site.type)} />
        <InfoItem label="Year Built" value={site.yearBuilt} />
        <InfoItem label="Location" value={site.location} />
        {site.dateDestroyed && (
          <InfoItem label="Date Destroyed/Damaged" value={site.dateDestroyed} />
        )}
      </div>

      {/* Description */}
      <section>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
        <p className="text-gray-700 leading-relaxed">{site.description}</p>
        {site.descriptionArabic && (
          <p className="text-gray-700 leading-relaxed mt-3 text-right" dir="rtl">
            {site.descriptionArabic}
          </p>
        )}
      </section>

      {/* Historical Significance */}
      {site.historicalSignificance && (
        <section>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Historical Significance
          </h4>
          <p className="text-gray-700 leading-relaxed">{site.historicalSignificance}</p>
        </section>
      )}

      {/* Cultural Value / What Was Lost */}
      {site.culturalValue && (
        <section>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">What Was Lost</h4>
          <p className="text-gray-700 leading-relaxed">{site.culturalValue}</p>
        </section>
      )}

      {/* Images Section */}
      {site.images && site.images.length > 0 && (
        <section>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Images</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {site.images.map((image, index) => (
              <div key={index} className="space-y-2">
                <img
                  src={image.url}
                  alt={image.caption || `${site.name} - Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                {image.caption && (
                  <p className="text-sm text-gray-600">{image.caption}</p>
                )}
                {image.credit && (
                  <p className="text-xs text-gray-500">Credit: {image.credit}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sources Section */}
      {site.sources && site.sources.length > 0 && (
        <section>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Sources</h4>
          <div className="space-y-3">
            {site.sources.map((source, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{source.title}</p>
                    {source.author && (
                      <p className="text-sm text-gray-600 mt-1">By {source.author}</p>
                    )}
                    {source.publisher && (
                      <p className="text-sm text-gray-600">
                        Published by {source.publisher}
                      </p>
                    )}
                    {source.date && (
                      <p className="text-sm text-gray-500 mt-1">{source.date}</p>
                    )}
                    {source.description && (
                      <p className="text-sm text-gray-700 mt-2">{source.description}</p>
                    )}
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "ml-4 px-3 py-1 text-sm font-medium",
                        "bg-blue-600 text-white rounded hover:bg-blue-700",
                        "transition-colors whitespace-nowrap"
                      )}
                    >
                      View Source
                    </a>
                  )}
                </div>
                <span
                  className={cn(
                    "inline-block mt-2 px-2 py-1 text-xs font-medium rounded",
                    "bg-gray-200 text-gray-700"
                  )}
                >
                  {formatLabel(source.type)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Coordinates (for reference) */}
      <section className="text-sm text-gray-500 border-t pt-4">
        <p>
          <span className="font-medium">Coordinates:</span> {site.coordinates[0]},{" "}
          {site.coordinates[1]}
        </p>
      </section>
    </div>
  );
}

/**
 * Helper component for displaying key-value information
 */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm font-semibold text-gray-700">{label}:</span>
      <p className="text-gray-900 mt-1">{value}</p>
    </div>
  );
}
