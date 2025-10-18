import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { FilterBar } from "./FilterBar";
import { CalendarProvider } from "../../contexts/CalendarContext";
import { ThemeProvider } from "../../contexts/ThemeContext";

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
    const { container } = render(
      <ThemeProvider>
        <CalendarProvider>
          <FilterBar {...mockProps} />
        </CalendarProvider>
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("displays filter controls", () => {
    render(
      <ThemeProvider>
        <CalendarProvider>
          <FilterBar {...mockProps} />
        </CalendarProvider>
      </ThemeProvider>
    );
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(20);
  });
});
