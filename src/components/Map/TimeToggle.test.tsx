import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimeToggle } from "./TimeToggle";
import { AnimationProvider } from "../../contexts/AnimationContext";

// Wrapper component to provide AnimationContext
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AnimationProvider>{children}</AnimationProvider>
);

describe("TimeToggle", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all three time period buttons", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="PRE_CONFLICT_2023" onPeriodChange={mockOnChange} />, {
      wrapper: Wrapper,
    });

    // Check for year-only labels (e.g., "2014", "2023", "2025")
    expect(screen.getByText("2014")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument(); // Current year
  });

  it("highlights the selected period", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="BASELINE_2014" onPeriodChange={mockOnChange} />, {
      wrapper: Wrapper,
    });

    const button2014 = screen.getByText(/2014/);
    expect(button2014).toHaveClass("bg-[#009639]", "text-white");
  });

  it("calls onPeriodChange when a button is clicked", async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    render(<TimeToggle selectedPeriod="PRE_CONFLICT_2023" onPeriodChange={mockOnChange} />, {
      wrapper: Wrapper,
    });

    const currentButton = screen.getByLabelText("Switch to Current satellite imagery");
    await user.click(currentButton);

    expect(mockOnChange).toHaveBeenCalledWith("CURRENT");
  });

  it("calls onPeriodChange with correct period for each button", async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    render(<TimeToggle selectedPeriod="CURRENT" onPeriodChange={mockOnChange} />, {
      wrapper: Wrapper,
    });

    await user.click(screen.getByLabelText("Switch to 2014 Baseline satellite imagery"));
    expect(mockOnChange).toHaveBeenCalledWith("BASELINE_2014");

    await user.click(screen.getByLabelText("Switch to Aug 2023 (Pre-conflict) satellite imagery"));
    expect(mockOnChange).toHaveBeenCalledWith("PRE_CONFLICT_2023");

    await user.click(screen.getByLabelText("Switch to Current satellite imagery"));
    expect(mockOnChange).toHaveBeenCalledWith("CURRENT");
  });

  it("has proper ARIA labels for accessibility", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="PRE_CONFLICT_2023" onPeriodChange={mockOnChange} />, {
      wrapper: Wrapper,
    });

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
    render(<TimeToggle selectedPeriod="PRE_CONFLICT_2023" onPeriodChange={mockOnChange} />, {
      wrapper: Wrapper,
    });

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("px-3", "py-1.5", "text-xs", "font-semibold");
    });
  });

  it("applies different styles to selected and unselected buttons", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="BASELINE_2014" onPeriodChange={mockOnChange} />, {
      wrapper: Wrapper,
    });

    const selected = screen.getByText(/2014/);
    const unselected = screen.getByLabelText("Switch to Current satellite imagery");

    expect(selected).toHaveClass("bg-[#009639]", "text-white");
    expect(unselected).toHaveClass("bg-white", "text-gray-700", "hover:bg-gray-100");
  });

  it("displays full date in tooltip on hover", () => {
    const mockOnChange = vi.fn();
    render(<TimeToggle selectedPeriod="PRE_CONFLICT_2023" onPeriodChange={mockOnChange} />, {
      wrapper: Wrapper,
    });

    const button2014 = screen.getByText("2014");
    const button2023 = screen.getByText("2023");

    // Check that tooltips contain full dates
    expect(button2014).toHaveAttribute("title", "Feb 20, 2014");
    expect(button2023).toHaveAttribute("title", "Aug 31, 2023");
  });
});
