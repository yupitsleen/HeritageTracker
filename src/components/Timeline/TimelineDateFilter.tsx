import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { Input } from "../Form/Input";

interface TimelineDateFilterProps {
  destructionDateStart: Date | null;
  destructionDateEnd: Date | null;
  defaultStartDate: Date;
  defaultEndDate: Date;
  onDestructionDateStartChange: (date: Date | null) => void;
  onDestructionDateEndChange: (date: Date | null) => void;
}

/**
 * Timeline date range filter
 *
 * Features:
 * - Start/End date inputs
 * - Clear filter button
 * - Always reserves space for clear button (prevents layout shift)
 *
 * Responsibilities:
 * - Render date filter UI
 * - Forward user interactions to parent
 */
export function TimelineDateFilter({
  destructionDateStart,
  destructionDateEnd,
  defaultStartDate,
  defaultEndDate,
  onDestructionDateStartChange,
  onDestructionDateEndChange,
}: TimelineDateFilterProps) {
  const translate = useTranslation();
  const t = useThemeClasses();

  const hasActiveFilter = destructionDateStart || destructionDateEnd;

  return (
    <div className="flex items-center gap-1.5 ml-auto">
      <label className={`text-[10px] font-semibold ${t.text.heading}`}>
        {translate("timeline.dateFilter")}:
      </label>

      <Input
        variant="date"
        value={(destructionDateStart || defaultStartDate).toISOString().split("T")[0]}
        onChange={(e) => {
          onDestructionDateStartChange(e.target.value ? new Date(e.target.value) : null);
        }}
        placeholder={translate("timeline.from")}
        className="flex-none w-28 text-[10px] py-0.5 px-1.5"
      />

      <span className={`text-[10px] font-medium ${t.text.body}`}>
        {translate("timeline.to")}
      </span>

      <Input
        variant="date"
        value={(destructionDateEnd || defaultEndDate).toISOString().split("T")[0]}
        onChange={(e) => {
          onDestructionDateEndChange(e.target.value ? new Date(e.target.value) : null);
        }}
        placeholder={translate("timeline.to")}
        className="flex-none w-28 text-[10px] py-0.5 px-1.5"
      />

      {/* Clear Date Filter button - always reserve space, only visible when filter is active */}
      <button
        onClick={() => {
          onDestructionDateStartChange(null);
          onDestructionDateEndChange(null);
        }}
        className={`${t.timeline.clearFilterVisible} ${
          hasActiveFilter
            ? `${t.bg.secondary} ${t.text.body} ${t.bg.hover}`
            : t.timeline.clearFilterInvisible
        }`}
        aria-label={translate("timeline.clearFilter")}
        disabled={!hasActiveFilter}
      >
        {translate("timeline.clear")}
      </button>
    </div>
  );
}
