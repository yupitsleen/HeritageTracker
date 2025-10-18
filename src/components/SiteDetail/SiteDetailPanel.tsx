import type { GazaSite } from "../../types";
import { StatusBadge } from "../StatusBadge";
import { formatLabel } from "../../utils/format";
import { cn } from "../../styles/theme";
import { SiteImage, SiteImagePlaceholder } from "./SiteImage";
import { useTheme } from "../../contexts/ThemeContext";

interface SiteDetailPanelProps {
  site: GazaSite;
}

/**
 * Comprehensive detail panel for heritage sites
 * Displays full information, images, and sources
 */
export function SiteDetailPanel({ site }: SiteDetailPanelProps) {
  const { isDark } = useTheme();
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-3">
        <StatusBadge status={site.status} className="inline-block" />

        {/* Site Names */}
        <div className="text-center">
          <h3 className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{site.name}</h3>
          {site.nameArabic && (
            <p className={`text-xl mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {site.nameArabic}
            </p>
          )}
        </div>
      </div>

      {/* Key Information Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg p-4 ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
        <InfoItem label="Site Type" value={formatLabel(site.type)} isDark={isDark} />
        <div>
          <span className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Year Built:</span>
          <p className={`mt-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>{site.yearBuilt}</p>
          {site.yearBuiltIslamic && (
            <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{site.yearBuiltIslamic}</p>
          )}
        </div>
        <InfoItem label="Status" value={formatLabel(site.status)} isDark={isDark} />
        {site.dateDestroyed && (
          <div>
            <span className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Date Destroyed/Damaged:</span>
            <p className={`mt-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>{site.dateDestroyed}</p>
            {site.dateDestroyedIslamic && (
              <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{site.dateDestroyedIslamic}</p>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <section>
        <h4 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>Description</h4>
        <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{site.description}</p>
      </section>

      {/* Historical Significance */}
      {site.historicalSignificance && (
        <section>
          <h4 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            Historical Significance
          </h4>
          <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{site.historicalSignificance}</p>
        </section>
      )}

      {/* Cultural Value / What Was Lost */}
      {site.culturalValue && (
        <section>
          <h4 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>What Was Lost</h4>
          <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{site.culturalValue}</p>
        </section>
      )}

      {/* Images Section */}
      <section>
        <h4 className={`text-lg font-semibold mb-3 ${isDark ? "text-gray-100" : "text-gray-900"}`}>Images</h4>
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
          <h4 className={`text-lg font-semibold mb-3 ${isDark ? "text-gray-100" : "text-gray-900"}`}>Sources</h4>
          <div className="space-y-3">
            {site.sources.map((source, index) => (
              <div
                key={index}
                className={`border-l-4 border-blue-500 pl-4 py-2 rounded-r ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>{source.title}</p>
                    <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{source.organization}</p>
                    {source.date && (
                      <p className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>{source.date}</p>
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
                    isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
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
      <section className={`text-sm border-t pt-4 ${isDark ? "text-gray-500 border-gray-700" : "text-gray-500 border-gray-200"}`}>
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
function InfoItem({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div>
      <span className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{label}:</span>
      <p className={`mt-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
