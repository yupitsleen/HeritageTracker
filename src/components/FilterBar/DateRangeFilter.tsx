import { Input } from "../Form/Input";
import { Tooltip } from "../Tooltip";

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartChange: (date: Date | null) => void;
  onEndChange: (date: Date | null) => void;
  label: string;
  tooltip?: string;
}

/**
 * DateRangeFilter - Reusable date range picker with optional tooltip
 * Handles date input validation and formatting
 */
export function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  label,
  tooltip = "Date filters use Gregorian calendar only",
}: DateRangeFilterProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-semibold text-gray-900">{label}</label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          variant="date"
          value={startDate ? startDate.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            onStartChange(e.target.value ? new Date(e.target.value) : null);
          }}
          placeholder="From"
          className="flex-1 text-sm py-2 px-3"
        />
        <span className="text-sm text-gray-600 font-medium">to</span>
        <Input
          variant="date"
          value={endDate ? endDate.toISOString().split("T")[0] : ""}
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
