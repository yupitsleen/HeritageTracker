import { useTranslation } from "../../contexts/LocaleContext";
import { TABLE_CONFIG, Z_INDEX } from "../../constants/layout";
import { COMPACT_TABLE } from "../../constants/compactDesign";
import { SortIcon } from "./SortIcon";
import type { SortField, SortDirection } from "../../hooks/useTableSort";

interface TableHeaderProps {
  visibleColumns: Set<string>;
  variant: "compact" | "expanded";
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

/**
 * Table header with sortable columns
 * Renders only visible columns based on variant/configuration
 */
export function TableHeader({
  visibleColumns,
  variant,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  const translate = useTranslation();

  return (
    <thead
      className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-950 text-white"
      style={{ zIndex: Z_INDEX.CONTENT }}
    >
      <tr>
        {visibleColumns.has("type") && (
          <th
            className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none text-center transition-colors duration-200 hover:bg-gray-800/30`}
            onClick={() => onSort("type")}
            style={{ width: `${TABLE_CONFIG.TYPE_COLUMN_WIDTH}px` }}
          >
            {translate("table.type")}
            <SortIcon field="type" currentField={sortField} direction={sortDirection} />
          </th>
        )}
        {visibleColumns.has("name") && (
          <th
            className={`pl-2 pr-1 ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-800/30`}
            onClick={() => onSort("name")}
            style={{ width: variant === "compact" ? "200px" : "auto", maxWidth: variant === "compact" ? "200px" : "none" }}
          >
            {translate("table.siteName")}
            <SortIcon field="name" currentField={sortField} direction={sortDirection} />
          </th>
        )}
        {visibleColumns.has("status") && (
          <th
            className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-800/30`}
            onClick={() => onSort("status")}
          >
            {translate("table.status")}
            <SortIcon field="status" currentField={sortField} direction={sortDirection} />
          </th>
        )}
        {visibleColumns.has("dateDestroyed") && (
          <th
            className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-800/30`}
            onClick={() => onSort("dateDestroyed")}
          >
            {variant === "compact"
              ? translate("table.destructionDate")
              : translate("table.destructionDateGregorian")}
            <SortIcon field="dateDestroyed" currentField={sortField} direction={sortDirection} />
          </th>
        )}
        {visibleColumns.has("dateDestroyedIslamic") && (
          <th
            className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-800/30`}
            onClick={() => onSort("dateDestroyedIslamic")}
          >
            {translate("table.destructionDateIslamic")}
            <SortIcon field="dateDestroyedIslamic" currentField={sortField} direction={sortDirection} />
          </th>
        )}
        {visibleColumns.has("sourceAssessmentDate") && (
          <th
            className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-800/30`}
            onClick={() => onSort("sourceAssessmentDate")}
          >
            {translate("table.surveyDate")}
            <SortIcon field="sourceAssessmentDate" currentField={sortField} direction={sortDirection} />
          </th>
        )}
        {visibleColumns.has("yearBuilt") && (
          <th
            className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-800/30`}
            onClick={() => onSort("yearBuilt")}
          >
            {translate("table.builtGregorian")}
            <SortIcon field="yearBuilt" currentField={sortField} direction={sortDirection} />
          </th>
        )}
        {visibleColumns.has("yearBuiltIslamic") && (
          <th
            className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-800/30`}
            onClick={() => onSort("yearBuiltIslamic")}
          >
            {translate("table.builtIslamic")}
            <SortIcon field="yearBuiltIslamic" currentField={sortField} direction={sortDirection} />
          </th>
        )}
        {visibleColumns.has("lastUpdated") && (
          <th
            className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-800/30`}
            onClick={() => onSort("lastUpdated")}
          >
            {translate("table.lastUpdated")}
            <SortIcon field="lastUpdated" currentField={sortField} direction={sortDirection} />
          </th>
        )}
      </tr>
    </thead>
  );
}
