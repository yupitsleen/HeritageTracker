import type { GazaSite } from "../../types";
import { components } from "../../styles/theme";

interface FiltersProps {
  onTypeChange: (type: GazaSite["type"] | "all") => void;
  onStatusChange: (status: GazaSite["status"] | "all") => void;
  selectedType: GazaSite["type"] | "all";
  selectedStatus: GazaSite["status"] | "all";
}

export function Filters({
  onTypeChange,
  onStatusChange,
  selectedType,
  selectedStatus,
}: FiltersProps) {
  const siteTypes: Array<GazaSite["type"] | "all"> = [
    "all",
    "mosque",
    "church",
    "archaeological",
    "museum",
    "historic-building",
  ];

  const statusOptions: Array<GazaSite["status"] | "all"> = [
    "all",
    "destroyed",
    "heavily-damaged",
    "damaged",
  ];

  const formatLabel = (value: string) => {
    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type Filter */}
        <div>
          <label htmlFor="type-filter" className={components.label.base}>
            Site Type
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as GazaSite["type"] | "all")}
            className={components.select.base}
          >
            {siteTypes.map((type) => (
              <option key={type} value={type}>
                {formatLabel(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className={components.label.base}>
            Damage Status
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as GazaSite["status"] | "all")}
            className={components.select.base}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
