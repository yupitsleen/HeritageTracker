import React from "react";
import { Input } from "../Form/Input";
import { Select } from "../Form/Select";
import { FilterLabel } from "./FilterLabel";

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
 * Input fields are empty when no filter is active
 */
export function YearRangeFilter({
  onStartChange,
  onEndChange,
  label,
  tooltip,
  supportBCE = true,
}: YearRangeFilterProps) {
  // Local state for year input and era selection (empty by default)
  const [startYearInput, setStartYearInput] = React.useState("");
  const [startYearEra, setStartYearEra] = React.useState<"CE" | "BCE">("CE");
  const [endYearInput, setEndYearInput] = React.useState("");
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
      {label && <FilterLabel label={label} tooltip={tooltip} />}
      {/* Stacked From/To rows so the year field and the BCE/CE selector stay uniform
          and are never clipped, at any width. The select sits in a fixed-width box so
          its base w-full fills that box instead of hogging the row. */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Input
            variant="number"
            value={startYearInput}
            onChange={(e) => handleStartYearChange(e.target.value, startYearEra)}
            placeholder="From year"
            min="1"
            className="flex-1 min-w-[5rem] h-8 text-xs px-2"
          />
          {supportBCE && (
            <div className="flex-none w-16">
              <Select
                size="small"
                value={startYearEra}
                onChange={(e) =>
                  handleStartYearChange(startYearInput, e.target.value as "CE" | "BCE")
                }
                className="h-8 px-1.5 text-xs"
              >
                <option value="BCE">BCE</option>
                <option value="CE">CE</option>
              </Select>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Input
            variant="number"
            value={endYearInput}
            onChange={(e) => handleEndYearChange(e.target.value, endYearEra)}
            placeholder="To year"
            min="1"
            className="flex-1 min-w-[5rem] h-8 text-xs px-2"
          />
          {supportBCE && (
            <div className="flex-none w-16">
              <Select
                size="small"
                value={endYearEra}
                onChange={(e) =>
                  handleEndYearChange(endYearInput, e.target.value as "CE" | "BCE")
                }
                className="h-8 px-1.5 text-xs"
              >
                <option value="BCE">BCE</option>
                <option value="CE">CE</option>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
