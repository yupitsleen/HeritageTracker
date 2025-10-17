import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimeToggle } from "./TimeToggle";

describe("TimeToggle", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all three time period buttons", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="PRE_CONFLICT_2023" onPeriodChange={mockOnChange} />);

    expect(screen.getByText("2014")).toBeInTheDocument();
    expect(screen.getByText("Aug 2023")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("highlights the selected period", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="BASELINE_2014" onPeriodChange={mockOnChange} />);

    const button2014 = screen.getByText("2014");
    expect(button2014).toHaveClass("bg-[#009639]", "text-white");
  });

  it("calls onPeriodChange when a button is clicked", async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    render(<TimeToggle selectedPeriod="PRE_CONFLICT_2023" onPeriodChange={mockOnChange} />);

    const currentButton = screen.getByText("Current");
    await user.click(currentButton);

    expect(mockOnChange).toHaveBeenCalledWith("CURRENT");
  });

  it("calls onPeriodChange with correct period for each button", async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    render(<TimeToggle selectedPeriod="CURRENT" onPeriodChange={mockOnChange} />);

    await user.click(screen.getByText("2014"));
    expect(mockOnChange).toHaveBeenCalledWith("BASELINE_2014");

    await user.click(screen.getByText("Aug 2023"));
    expect(mockOnChange).toHaveBeenCalledWith("PRE_CONFLICT_2023");

    await user.click(screen.getByText("Current"));
    expect(mockOnChange).toHaveBeenCalledWith("CURRENT");
  });

  it("has proper ARIA labels for accessibility", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="PRE_CONFLICT_2023" onPeriodChange={mockOnChange} />);

    const button2014 = screen.getByLabelText("Switch to 2014 Baseline satellite imagery");
    const buttonAug2023 = screen.getByLabelText(
      "Switch to Aug 2023 (Pre-conflict) satellite imagery"
    );
    const buttonCurrent = screen.getByLabelText("Switch to Current satellite imagery");

    expect(button2014).toBeInTheDocument();
    expect(buttonAug2023).toBeInTheDocument();
    expect(buttonCurrent).toBeInTheDocument();
  });

  it("renders buttons with correct styling classes", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="PRE_CONFLICT_2023" onPeriodChange={mockOnChange} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("px-3", "py-1.5", "text-xs", "font-semibold");
    });
  });

  it("applies different styles to selected and unselected buttons", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="BASELINE_2014" onPeriodChange={mockOnChange} />);

    const selected = screen.getByText("2014");
    const unselected = screen.getByText("Current");

    expect(selected).toHaveClass("bg-[#009639]", "text-white");
    expect(unselected).toHaveClass("bg-white", "text-gray-700", "hover:bg-gray-100");
  });
});
