import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterBar } from "./FilterBar";

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
    render(<FilterBar {...mockProps} />);
    expect(screen.getByText("Filters:")).toBeInTheDocument();
  });

  it("displays site count", () => {
    render(<FilterBar {...mockProps} />);
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders BC/BCE dropdowns for Built year filters", () => {
    render(<FilterBar {...mockProps} />);
    const bceDropdowns = screen.getAllByRole("combobox");
    // Should have 2 BCE/CE dropdowns (start and end)
    expect(bceDropdowns.length).toBeGreaterThanOrEqual(2);
  });

  it("renders destruction date inputs", () => {
    render(<FilterBar {...mockProps} />);
    expect(screen.getByText("Destroyed")).toBeInTheDocument();
    const dateInputs = screen.getAllByPlaceholderText(/From|To/i);
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
  });

  it("shows Clear filters button when filters are active", () => {
    render(
      <FilterBar
        {...mockProps}
        selectedTypes={["mosque"]}
      />
    );
    expect(screen.getByText("Clear filters")).toBeInTheDocument();
  });

  it("does not show Clear filters button when no filters are active", () => {
    render(<FilterBar {...mockProps} />);
    expect(screen.queryByText("Clear filters")).not.toBeInTheDocument();
  });
});
