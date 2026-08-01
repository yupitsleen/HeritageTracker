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
 * Inputs show the full year range of the visible sites until the user edits them
 */
export function YearRangeFilter({
  onStartChange,
  onEndChange,
  label,
  tooltip,
  supportBCE = true,
  startYearDefault,
  endYearDefault,
  startEraDefault,
}: YearRangeFilterProps) {
  // null = untouched, so the displayed value tracks the sites' actual range
  const [startYearInput, setStartYearInput] = React.useState<string | null>(null);
  const [startYearEra, setStartYearEra] = React.useState<"CE" | "BCE" | null>(null);
  const [endYearInput, setEndYearInput] = React.useState<string | null>(null);
  const [endYearEra, setEndYearEra] = React.useState<"CE" | "BCE" | null>(null);

  const startYearValue = startYearInput ?? startYearDefault ?? "";
  const startEraValue = startYearEra ?? startEraDefault ?? "CE";
  const endYearValue = endYearInput ?? endYearDefault ?? "";
  const endEraValue = endYearEra ?? "CE";

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
            value={startYearValue}
            onChange={(e) => handleStartYearChange(e.target.value, startEraValue)}
            placeholder="From year"
            min="1"
            className="flex-1 min-w-[5rem] h-8 text-xs px-2"
          />
          {supportBCE && (
            <div className="flex-none w-16">
              <Select
                size="small"
                value={startEraValue}
                onChange={(e) =>
                  handleStartYearChange(startYearValue, e.target.value as "CE" | "BCE")
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
            value={endYearValue}
            onChange={(e) => handleEndYearChange(e.target.value, endEraValue)}
            placeholder="To year"
            min="1"
            className="flex-1 min-w-[5rem] h-8 text-xs px-2"
          />
          {supportBCE && (
            <div className="flex-none w-16">
              <Select
                size="small"
                value={endEraValue}
                onChange={(e) =>
                  handleEndYearChange(endYearValue, e.target.value as "CE" | "BCE")
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
