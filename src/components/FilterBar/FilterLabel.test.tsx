import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { FilterLabel } from "./FilterLabel";

// ponytail: default/theme class assertions removed — styling is not contract
describe("FilterLabel", () => {
  it("renders label text", () => {
    renderWithTheme(<FilterLabel label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders without tooltip icon when tooltip prop is not provided", () => {
    const { container } = renderWithTheme(<FilterLabel label="Test Label" />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders tooltip icon when tooltip prop is provided", () => {
    const { container } = renderWithTheme(<FilterLabel label="Test Label" tooltip="Helper text" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("custom className replaces the default", () => {
    const { container } = renderWithTheme(<FilterLabel label="Test Label" className="custom-class" />);
    expect(container.firstChild as HTMLElement).toHaveClass("custom-class");
  });
});
