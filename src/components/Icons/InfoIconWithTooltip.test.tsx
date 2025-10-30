import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InfoIconWithTooltip } from "./InfoIconWithTooltip";

describe("InfoIconWithTooltip", () => {
  it("renders the info icon", () => {
    render(<InfoIconWithTooltip tooltip="Test tooltip" />);
    const icon = screen.getByRole("img");
    expect(icon).toBeInTheDocument();
  });

  it("displays tooltip text on hover", async () => {
    const tooltipText = "This is helpful information";
    render(<InfoIconWithTooltip tooltip={tooltipText} />);

    const icon = screen.getByRole("img");

    // Initially tooltip should not be visible
    expect(screen.queryByText(tooltipText)).not.toBeInTheDocument();

    // Hover over the icon
    fireEvent.mouseEnter(icon.parentElement!);

    // Tooltip should now be visible
    expect(screen.getByText(tooltipText)).toBeInTheDocument();

    // Mouse leave
    fireEvent.mouseLeave(icon.parentElement!);

    // Tooltip should be hidden again
    expect(screen.queryByText(tooltipText)).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<InfoIconWithTooltip tooltip="Test" className="w-6 h-6" />);
    const icon = screen.getByRole("img");
    expect(icon).toHaveClass("w-6", "h-6");
  });

  it("applies default gray color classes", () => {
    render(<InfoIconWithTooltip tooltip="Test" />);
    const icon = screen.getByRole("img");
    expect(icon).toHaveClass("text-gray-400");
  });

  it("includes aria-label from tooltip by default", () => {
    const tooltipText = "Helpful information";
    render(<InfoIconWithTooltip tooltip={tooltipText} />);
    const icon = screen.getByRole("img");
    expect(icon).toHaveAttribute("aria-label", tooltipText);
  });

  it("uses custom aria-label when provided", () => {
    render(<InfoIconWithTooltip tooltip="Tooltip" aria-label="Custom label" />);
    const icon = screen.getByRole("img");
    expect(icon).toHaveAttribute("aria-label", "Custom label");
  });

  it("shows tooltip on focus (keyboard accessibility)", () => {
    const tooltipText = "Keyboard accessible";
    render(<InfoIconWithTooltip tooltip={tooltipText} />);

    const icon = screen.getByRole("img");

    // Focus the icon's parent
    fireEvent.focus(icon.parentElement!);

    // Tooltip should be visible
    expect(screen.getByText(tooltipText)).toBeInTheDocument();

    // Blur
    fireEvent.blur(icon.parentElement!);

    // Tooltip should be hidden
    expect(screen.queryByText(tooltipText)).not.toBeInTheDocument();
  });

  it("renders with cursor-help class for accessibility", () => {
    render(<InfoIconWithTooltip tooltip="Test" />);
    const icon = screen.getByRole("img");
    expect(icon).toHaveClass("cursor-help");
  });

  it("has hover transition effect", () => {
    render(<InfoIconWithTooltip tooltip="Test" />);
    const icon = screen.getByRole("img");
    expect(icon).toHaveClass("transition-colors");
  });
});
