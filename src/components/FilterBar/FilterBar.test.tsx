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
    onTypeChange: vi.fn(),
    onStatusChange: vi.fn(),
    onDestructionDateStartChange: vi.fn(),
    onDestructionDateEndChange: vi.fn(),
    onCreationYearStartChange: vi.fn(),
    onCreationYearEndChange: vi.fn(),
    filteredCount: 5,
    totalCount: 10,
  };

  it("renders without crashing", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    expect(screen.getByText("Filters:")).toBeInTheDocument();
  });

  it("displays site count", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
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

  it("renders destruction date inputs", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    expect(screen.getByText(/Destroyed/)).toBeInTheDocument();
    const dateInputs = screen.getAllByPlaceholderText(/From|To/i);
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
  });

  it("shows Clear filters button when filters are active", () => {
    render(
      <CalendarProvider>
        <FilterBar
          {...mockProps}
          selectedTypes={["mosque"]}
        />
      </CalendarProvider>
    );
    expect(screen.getByText("Clear filters")).toBeInTheDocument();
  });

  it("does not show Clear filters button when no filters are active", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    expect(screen.queryByText("Clear filters")).not.toBeInTheDocument();
  });

  it("renders calendar toggle button", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    expect(screen.getByText("Switch to Islamic Calendar")).toBeInTheDocument();
  });

  it("shows Gregorian labels for filters", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    // Filter labels always show Gregorian since filtering uses Gregorian dates
    expect(screen.getByText(/Destroyed \(Gregorian\)/)).toBeInTheDocument();
    expect(screen.getByText(/Built \(CE\/BCE\)/)).toBeInTheDocument();
  });

  it("toggles calendar button text when clicked", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );

    // Initially shows switch to Islamic
    expect(screen.getByText("Switch to Islamic Calendar")).toBeInTheDocument();

    // Click toggle button
    const toggleButton = screen.getByText("Switch to Islamic Calendar");
    fireEvent.click(toggleButton);

    // Should now show switch to Gregorian (but filter labels remain the same)
    expect(screen.getByText("Switch to Gregorian Calendar")).toBeInTheDocument();
    expect(screen.getByText(/Destroyed \(Gregorian\)/)).toBeInTheDocument();
    expect(screen.getByText(/Built \(CE\/BCE\)/)).toBeInTheDocument();
  });
});
