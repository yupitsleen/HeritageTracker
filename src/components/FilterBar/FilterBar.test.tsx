import { describe, it, expect, vi } from "vitest";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { FilterBar } from "./FilterBar";
import { CalendarProvider } from "../../contexts/CalendarContext";

describe("FilterBar", () => {
  const mockProps = {
    selectedTypes: [],
    selectedStatuses: [],
    destructionDateStart: null,
    destructionDateEnd: null,
    creationYearStart: null,
    creationYearEnd: null,
    searchTerm: "",
    onTypeChange: vi.fn(),
    onStatusChange: vi.fn(),
    onDestructionDateStartChange: vi.fn(),
    onDestructionDateEndChange: vi.fn(),
    onCreationYearStartChange: vi.fn(),
    onCreationYearEndChange: vi.fn(),
    onSearchChange: vi.fn(),
  };

  it("renders without crashing", () => {
    const { container } = renderWithTheme(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("displays filter controls", () => {
    renderWithTheme(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(20);
  });
});
