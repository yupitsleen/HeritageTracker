import type { GazaSite } from "../../types";
import { StatusBadge } from "../StatusBadge";
import { formatLabel } from "../../utils/format";
import { cn } from "../../styles/theme";
import { SiteImage, SiteImagePlaceholder } from "./SiteImage";

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
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900">{site.name}</h3>
          {site.nameArabic && (
            <p className="text-xl text-gray-600 mt-2">
              {site.nameArabic}
            </p>
          )}
        </div>
      </div>

      {/* Key Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
        <InfoItem label="Site Type" value={formatLabel(site.type)} />
        <div>
          <span className="text-sm font-semibold text-gray-700">Year Built:</span>
          <p className="text-gray-900 mt-1">{site.yearBuilt}</p>
          {site.yearBuiltIslamic && (
            <p className="text-gray-600 text-sm mt-1">{site.yearBuiltIslamic}</p>
          )}
        </div>
        <InfoItem label="Status" value={formatLabel(site.status)} />
        {site.dateDestroyed && (
          <div>
            <span className="text-sm font-semibold text-gray-700">Date Destroyed/Damaged:</span>
            <p className="text-gray-900 mt-1">{site.dateDestroyed}</p>
            {site.dateDestroyedIslamic && (
              <p className="text-gray-600 text-sm mt-1">{site.dateDestroyedIslamic}</p>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <section>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
        <p className="text-gray-700 leading-relaxed">{site.description}</p>
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
      <section>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Images</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before image */}
          {site.images?.before ? (
            <SiteImage
              image={site.images.before}
              alt={`${site.name} - Before destruction`}
              label="Before destruction"
            />
          ) : (
            <SiteImagePlaceholder label="Before destruction" />
          )}

          {/* After image */}
          {site.images?.after ? (
            <SiteImage
              image={site.images.after}
              alt={`${site.name} - After destruction`}
              label="After destruction"
            />
          ) : (
            <SiteImagePlaceholder label="After destruction" />
          )}

          {/* Satellite image (optional, only show if provided) */}
          {site.images?.satellite && (
            <SiteImage
              image={site.images.satellite}
              alt={`${site.name} - Satellite imagery`}
              label="Satellite imagery"
            />
          )}
        </div>
      </section>

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
                    <p className="text-sm text-gray-600 mt-1">{source.organization}</p>
                    {source.date && (
                      <p className="text-sm text-gray-500 mt-1">{source.date}</p>
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
