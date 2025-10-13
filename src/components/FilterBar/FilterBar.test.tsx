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

  it("renders filter sections with proper labels", () => {
    render(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    expect(screen.getByText("Site Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Destruction Date")).toBeInTheDocument();
    expect(screen.getByText("Year Built")).toBeInTheDocument();
  });
});
