import { Input } from "../Form/Input";
import { FilterLabel } from "./FilterLabel";
import { useTranslation } from "../../contexts/LocaleContext";

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartChange: (date: Date | null) => void;
  onEndChange: (date: Date | null) => void;
  label: string;
  tooltip?: string;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
}

/**
 * DateRangeFilter - Reusable date range picker with optional tooltip
 * Handles date input validation and formatting
 * Input fields are empty when no filter is active (startDate/endDate are null)
 */
export function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  label,
  tooltip,
  defaultStartDate,
  defaultEndDate,
}: DateRangeFilterProps) {
  const translate = useTranslation();

  return (
    <div>
      {label && <FilterLabel label={label} tooltip={tooltip} />}
      {/* Stacked From/To so both inputs stay uniform and are never clipped, at any width.
          Native date inputs ignore placeholder, so the bound is named via aria-label. */}
      <div className="flex flex-col gap-1.5">
        <Input
          variant="date"
          value={startDate?.toISOString().split("T")[0] || ""}
          onChange={(e) => onStartChange(e.target.value ? new Date(e.target.value) : null)}
          aria-label={translate("filters.fromDate")}
          min={defaultStartDate?.toISOString().split("T")[0]}
          max={defaultEndDate?.toISOString().split("T")[0]}
          className="w-full min-w-[9rem] h-8 text-xs px-2"
        />
        <Input
          variant="date"
          value={endDate?.toISOString().split("T")[0] || ""}
          onChange={(e) => onEndChange(e.target.value ? new Date(e.target.value) : null)}
          aria-label={translate("filters.toDate")}
          min={defaultStartDate?.toISOString().split("T")[0]}
          max={defaultEndDate?.toISOString().split("T")[0]}
          className="w-full min-w-[9rem] h-8 text-xs px-2"
        />
      </div>
    </div>
  );
}
