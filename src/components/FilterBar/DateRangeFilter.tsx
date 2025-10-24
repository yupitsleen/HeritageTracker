import { Input } from "../Form/Input";
import { FilterLabel } from "./FilterLabel";
import { useThemeClasses } from "../../hooks/useThemeClasses";

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
 * Shows default values when startDate/endDate are null
 */
export function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  label,
  tooltip = "Date filters use Gregorian calendar only",
  defaultStartDate,
  defaultEndDate,
}: DateRangeFilterProps) {
  const t = useThemeClasses();

  return (
    <div>
      <FilterLabel label={label} tooltip={tooltip} />
      <div className="flex items-center gap-2">
        <Input
          variant="date"
          value={(startDate || defaultStartDate)?.toISOString().split("T")[0] || ""}
          onChange={(e) => {
            onStartChange(e.target.value ? new Date(e.target.value) : null);
          }}
          placeholder="From"
          className="flex-1 text-sm py-2 px-3"
        />
        <span className={`text-sm font-medium ${t.text.body}`}>to</span>
        <Input
          variant="date"
          value={(endDate || defaultEndDate)?.toISOString().split("T")[0] || ""}
          onChange={(e) => {
            onEndChange(e.target.value ? new Date(e.target.value) : null);
          }}
          placeholder="To"
          className="flex-1 text-sm py-2 px-3"
        />
      </div>
    </div>
  );
}
