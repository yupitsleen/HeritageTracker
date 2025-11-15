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
  const t = useThemeClasses();

  return (
    <div>
      {label && <FilterLabel label={label} tooltip={tooltip} />}
      <div className="flex items-center gap-1.5">
        <Input
          variant="date"
          value={startDate?.toISOString().split("T")[0] || ""}
          onChange={(e) => {
            onStartChange(e.target.value ? new Date(e.target.value) : null);
          }}
          placeholder="From"
          min={defaultStartDate?.toISOString().split("T")[0]}
          max={defaultEndDate?.toISOString().split("T")[0]}
          className="flex-1 h-8 text-xs px-2"
        />
        <span className={`text-xs font-medium ${t.text.body}`}>to</span>
        <Input
          variant="date"
          value={endDate?.toISOString().split("T")[0] || ""}
          onChange={(e) => {
            onEndChange(e.target.value ? new Date(e.target.value) : null);
          }}
          placeholder="To"
          min={defaultStartDate?.toISOString().split("T")[0]}
          max={defaultEndDate?.toISOString().split("T")[0]}
          className="flex-1 h-8 text-xs px-2"
        />
      </div>
    </div>
  );
}
