import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
    filteredSiteCount: 18,
    totalSiteCount: 18,
    onTypeChange: vi.fn(),
    onStatusChange: vi.fn(),
    onDestructionDateStartChange: vi.fn(),
    onDestructionDateEndChange: vi.fn(),
    onCreationYearStartChange: vi.fn(),
    onCreationYearEndChange: vi.fn(),
    onSearchChange: vi.fn(),
  };

  it("renders without crashing", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    // Check that filter controls are present
    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBeGreaterThan(0);
  });

  it("renders BC/BCE dropdowns for Built year filters", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    const bceDropdowns = screen.getAllByRole("combobox");
    // Should have 2 BCE/CE dropdowns (start and end)
    expect(bceDropdowns.length).toBeGreaterThanOrEqual(2);
  });

  it("renders date range inputs", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    const dateInputs = screen.getAllByPlaceholderText(/From|To/i);
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
  });

  it("shows Clear button when filters are active", () => {
    render(
      <CalendarProvider>
        <FilterBar
          {...mockProps}
          selectedTypes={["mosque"]}
        />
      </CalendarProvider>
    );
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("Clear button is disabled when no filters are active", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    const clearButton = screen.getByText("Clear");
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toBeDisabled();
  });

  it("renders calendar toggle button", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    const buttons = screen.getAllByRole("button");
    const calendarButton = buttons.find(btn => btn.textContent?.includes("Calendar"));
    expect(calendarButton).toBeInTheDocument();
  });

  it("toggles calendar when button clicked", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );

    const buttons = screen.getAllByRole("button");
    const calendarButton = buttons.find(btn => btn.textContent?.includes("Calendar"));

    const initialText = calendarButton?.textContent;

    // Click toggle button
    if (calendarButton) {
      fireEvent.click(calendarButton);
    }

    // Text should change after toggle
    expect(calendarButton?.textContent).not.toBe(initialText);
  });
});
