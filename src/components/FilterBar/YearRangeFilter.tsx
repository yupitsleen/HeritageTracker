import React from "react";
import { Input } from "../Form/Input";
import { Select } from "../Form/Select";
import { Tooltip } from "../Tooltip";
import { InfoIcon } from "../Icons";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface YearRangeFilterProps {
  onStartChange: (year: number | null) => void;
  onEndChange: (year: number | null) => void;
  label: string;
  tooltip?: string;
  supportBCE?: boolean;
  startYearDefault?: string;
  endYearDefault?: string;
  startEraDefault?: "CE" | "BCE";
}

/**
 * YearRangeFilter - Reusable year range picker with BC/BCE support
 * Handles year input and era selection (BCE/CE)
 * Converts years to internal format: BCE = negative, CE = positive
 */
export function YearRangeFilter({
  onStartChange,
  onEndChange,
  label,
  tooltip = "Year filters use Gregorian calendar only",
  supportBCE = true,
  startYearDefault = "",
  endYearDefault = new Date().getFullYear().toString(),
  startEraDefault = "CE",
}: YearRangeFilterProps) {
  const t = useThemeClasses();

  // Local state for year input and era selection
  const [startYearInput, setStartYearInput] = React.useState(startYearDefault);
  const [startYearEra, setStartYearEra] = React.useState<"CE" | "BCE">(startEraDefault);
  const [endYearInput, setEndYearInput] = React.useState(endYearDefault);
  const [endYearEra, setEndYearEra] = React.useState<"CE" | "BCE">("CE");

  // Update parent state when year or era changes
  const handleStartYearChange = (input: string, era: "CE" | "BCE") => {
    setStartYearInput(input);
    setStartYearEra(era);
    if (input.trim() && !isNaN(parseInt(input))) {
      const year = Math.abs(parseInt(input)); // Ensure positive
      onStartChange(era === "BCE" ? -year : year);
    } else {
      onStartChange(null);
    }
  };

  const handleEndYearChange = (input: string, era: "CE" | "BCE") => {
    setEndYearInput(input);
    setEndYearEra(era);
    if (input.trim() && !isNaN(parseInt(input))) {
      const year = Math.abs(parseInt(input)); // Ensure positive
      onEndChange(era === "BCE" ? -year : year);
    } else {
      onEndChange(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className={`text-sm font-semibold ${t.text.heading}`}>{label}</label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <InfoIcon className={`w-4 h-4 ${t.icon.default}`} aria-label="More information" />
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 flex-1">
          <Input
            variant="number"
            value={startYearInput}
            onChange={(e) => handleStartYearChange(e.target.value, startYearEra)}
            placeholder="Year"
            min="1"
            className="flex-1 text-sm py-2 px-3"
          />
          {supportBCE && (
            <Select
              size="small"
              value={startYearEra}
              onChange={(e) =>
                handleStartYearChange(startYearInput, e.target.value as "CE" | "BCE")
              }
              className="px-2 py-2 text-sm"
            >
              <option value="BCE">BCE</option>
              <option value="CE">CE</option>
            </Select>
          )}
        </div>
        <span className={`text-sm font-medium ${t.text.body}`}>to</span>
        <div className="flex items-center gap-1 flex-1">
          <Input
            variant="number"
            value={endYearInput}
            onChange={(e) => handleEndYearChange(e.target.value, endYearEra)}
            placeholder="Year"
            min="1"
            className="flex-1 text-sm py-2 px-3"
          />
          {supportBCE && (
            <Select
              size="small"
              value={endYearEra}
              onChange={(e) =>
                handleEndYearChange(endYearInput, e.target.value as "CE" | "BCE")
              }
              className="px-2 py-2 text-sm"
            >
              <option value="BCE">BCE</option>
              <option value="CE">CE</option>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
