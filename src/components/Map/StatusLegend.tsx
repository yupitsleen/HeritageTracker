/**
 * Status color legend for map and timeline markers
 * Compact inline version for desktop filter bar
 */
import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface StatusLegendProps {
  /** Compact mode for inline display in filter bar */
  compact?: boolean;
}

export function StatusLegend({ compact = false }: StatusLegendProps) {
  const translate = useTranslation();
  const t = useThemeClasses();

  const statusColors = [
    { key: "destroyed", color: "#b91c1c" },
    { key: "heavilyDamaged", color: "#d97706" },
    { key: "damaged", color: "#ca8a04" },
  ] as const;

  if (compact) {
    // Compact inline version for filter bar
    return (
      <div
        className="flex items-center gap-2"
        role="region"
        aria-label={translate("legend.colorKey")}
      >
        <span className={`text-xs font-medium ${t.text.muted}`}>{translate("legend.colorKey")}</span>
        {statusColors.map((status) => (
          <div key={status.key} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: status.color }}
              aria-hidden="true"
            />
            <span className={`text-[10px] ${t.text.muted}`}>{translate(`siteStatus.${status.key}`)}</span>
          </div>
        ))}
      </div>
    );
  }

  // Original full version
  return (
    <div
      className={`flex items-center justify-center gap-4 mb-3 px-3 py-2 ${t.bg.primary} rounded-lg border ${t.border.default}`}
      role="region"
      aria-label={translate("legend.colorKey")}
    >
      <span className={`text-xs font-semibold ${t.text.body}`}>{translate("legend.colorKey")}</span>
      {statusColors.map((status) => (
        <div key={status.key} className="flex items-center gap-1.5">
          <div
            className={`w-3 h-3 rounded-full border-2 ${t.bg.primary} shadow-sm`}
            style={{ backgroundColor: status.color }}
            aria-hidden="true"
          />
          <span className={`text-xs ${t.text.body}`}>{translate(`siteStatus.${status.key}`)}</span>
        </div>
      ))}
    </div>
  );
}
