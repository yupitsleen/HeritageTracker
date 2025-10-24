import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { FilterLabel } from "./FilterLabel";

describe("FilterLabel", () => {
  it("renders label text", () => {
    renderWithTheme(<FilterLabel label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders without tooltip when tooltip prop is not provided", () => {
    const { container } = renderWithTheme(<FilterLabel label="Test Label" />);
    // Should not render InfoIcon when no tooltip
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders with tooltip when tooltip prop is provided", () => {
    const { container } = renderWithTheme(<FilterLabel label="Test Label" tooltip="Helper text" />);
    // Should render InfoIcon when tooltip is provided
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies default className", () => {
    const { container } = renderWithTheme(<FilterLabel label="Test Label" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "items-center", "gap-2", "mb-2");
  });

  it("applies custom className when provided", () => {
    const { container } = renderWithTheme(<FilterLabel label="Test Label" className="custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
    expect(wrapper).not.toHaveClass("flex", "items-center");
  });

  it("renders label with correct theme classes", () => {
    const { container } = renderWithTheme(<FilterLabel label="Test Label" />);
    const label = container.querySelector("label");
    expect(label).toHaveClass("text-sm", "font-semibold");
  });

  it("integrates properly with tooltip", () => {
    renderWithTheme(<FilterLabel label="Test Label" tooltip="This is helpful information" />);
    // The Tooltip component should wrap the InfoIcon
    // We can verify the structure is correct
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
  });
});
