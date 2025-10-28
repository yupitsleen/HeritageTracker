import type { GazaSite } from "../../types";
import { StatusBadge } from "../StatusBadge";
import { formatLabel, translateSiteType, translateStatus } from "../../utils/format";
import { cn } from "../../styles/theme";
import { SiteImage, SiteImagePlaceholder } from "./SiteImage";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";

interface SiteDetailPanelProps {
  site: GazaSite;
}

/**
 * Comprehensive detail panel for heritage sites
 * Displays full information, images, and sources
 */
export function SiteDetailPanel({ site }: SiteDetailPanelProps) {
  const t = useThemeClasses();
  const translate = useTranslation();

  // Translate site type and status
  const siteTypeLabel = translateSiteType(translate, site.type);
  const siteStatusLabel = translateStatus(translate, site.status);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-3">
        <StatusBadge status={site.status} className="inline-block" />

        {/* Site Names */}
        <div className="text-center">
          <h3 className={`text-3xl font-bold ${t.text.heading}`}>{site.name}</h3>
          {site.nameArabic && (
            <p className={`text-xl mt-2 ${t.text.muted}`}>
              {site.nameArabic}
            </p>
          )}
        </div>
      </div>

      {/* Key Information Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg p-4 ${t.bg.tertiary}`}>
        <InfoItem label={translate("siteDetail.siteType")} value={siteTypeLabel} t={t} />
        <div>
          <span className={`text-sm font-semibold ${t.text.body}`}>{translate("siteDetail.yearBuilt")}:</span>
          <p className={`mt-1 ${t.text.heading}`}>{site.yearBuilt}</p>
          {site.yearBuiltIslamic && (
            <p className={`text-sm mt-1 ${t.text.muted}`}>{site.yearBuiltIslamic}</p>
          )}
        </div>
        <InfoItem label={translate("siteDetail.status")} value={siteStatusLabel} t={t} />
        {site.dateDestroyed && (
          <div>
            <span className={`text-sm font-semibold ${t.text.body}`}>{translate("siteDetail.dateDestroyed")}:</span>
            <p className={`mt-1 ${t.text.heading}`}>{site.dateDestroyed}</p>
            {site.dateDestroyedIslamic && (
              <p className={`text-sm mt-1 ${t.text.muted}`}>{site.dateDestroyedIslamic}</p>
            )}
          </div>
        )}
        <InfoItem label={translate("siteDetail.lastUpdated")} value={site.lastUpdated} t={t} />
      </div>

      {/* Description */}
      <section>
        <h4 className={`text-lg font-semibold mb-2 ${t.text.heading}`}>{translate("siteDetail.description")}</h4>
        <p className={`leading-relaxed ${t.text.body}`}>{site.description}</p>
      </section>

      {/* Historical Significance */}
      {site.historicalSignificance && (
        <section>
          <h4 className={`text-lg font-semibold mb-2 ${t.text.heading}`}>
            {translate("siteDetail.historicalSignificance")}
          </h4>
          <p className={`leading-relaxed ${t.text.body}`}>{site.historicalSignificance}</p>
        </section>
      )}

      {/* Cultural Value / What Was Lost */}
      {site.culturalValue && (
        <section>
          <h4 className={`text-lg font-semibold mb-2 ${t.text.heading}`}>{translate("siteDetail.whatWasLost")}</h4>
          <p className={`leading-relaxed ${t.text.body}`}>{site.culturalValue}</p>
        </section>
      )}

      {/* Images Section */}
      <section>
        <h4 className={`text-lg font-semibold mb-3 ${t.text.heading}`}>{translate("siteDetail.images")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before image */}
          {site.images?.before ? (
            <SiteImage
              image={site.images.before}
              alt={`${site.name} - ${translate("siteDetail.beforeDestruction")}`}
              label={translate("siteDetail.beforeDestruction")}
            />
          ) : (
            <SiteImagePlaceholder label={translate("siteDetail.beforeDestruction")} />
          )}

          {/* After image */}
          {site.images?.after ? (
            <SiteImage
              image={site.images.after}
              alt={`${site.name} - ${translate("siteDetail.afterDestruction")}`}
              label={translate("siteDetail.afterDestruction")}
            />
          ) : (
            <SiteImagePlaceholder label={translate("siteDetail.afterDestruction")} />
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
          <h4 className={`text-lg font-semibold mb-3 ${t.text.heading}`}>{translate("siteDetail.sources")}</h4>
          <div className="space-y-3">
            {site.sources.map((source, index) => (
              <div
                key={index}
                className={`border-l-4 border-blue-500 pl-4 py-2 rounded-r ${t.bg.tertiary}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`font-medium ${t.text.heading}`}>{source.title}</p>
                    <p className={`text-sm mt-1 ${t.text.muted}`}>{source.organization}</p>
                    {source.date && (
                      <p className={`text-sm mt-1 ${t.text.subtle}`}>{source.date}</p>
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
                      {translate("table.viewDetails")}
                    </a>
                  )}
                </div>
                <span
                  className={cn(
                    "inline-block mt-2 px-2 py-1 text-xs font-medium rounded",
                    t.bg.secondary,
                    t.text.body
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
      <section className={`text-sm border-t pt-4 ${t.text.subtle} ${t.border.default}`}>
        <p>
          <span className="font-medium">{translate("siteDetail.coordinates")}:</span> {site.coordinates[0]},{" "}
          {site.coordinates[1]}
        </p>
      </section>
    </div>
  );
}

/**
 * Helper component for displaying key-value information
 */
function InfoItem({ label, value, t }: { label: string; value: string; t: ReturnType<typeof useThemeClasses> }) {
  return (
    <div>
      <span className={`text-sm font-semibold ${t.text.body}`}>{label}:</span>
      <p className={`mt-1 ${t.text.heading}`}>{value}</p>
    </div>
  );
}
