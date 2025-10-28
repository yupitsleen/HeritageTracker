/**
 * Status color legend for map and timeline markers
 */
import { useTranslation } from "../../contexts/LocaleContext";

export function StatusLegend() {
  const translate = useTranslation();

  const statusColors = [
    { key: "destroyed", color: "#b91c1c" },
    { key: "heavilyDamaged", color: "#d97706" },
    { key: "damaged", color: "#ca8a04" },
  ] as const;

  return (
    <div className="flex items-center justify-center gap-4 mb-3 px-3 py-2 bg-white rounded-lg border border-gray-200">
      <span className="text-xs font-semibold text-gray-700">{translate("legend.colorKey")}</span>
      {statusColors.map((status) => (
        <div key={status.key} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: status.color }}
          />
          <span className="text-xs text-gray-700">{translate(`siteStatus.${status.key}`)}</span>
        </div>
      ))}
    </div>
  );
}
