import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { About } from "./About";
import { ThemeProvider } from "../../contexts/ThemeContext";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe("About", () => {
  it("renders without crashing", () => {
    const { container } = renderWithTheme(<About />);
    expect(container).toBeInTheDocument();
  });

  it("displays content", () => {
    renderWithTheme(<About />);
    // Check that page has substantive content
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(100); // Has meaningful content
  });

  it("is scrollable", () => {
    const { container } = renderWithTheme(<About />);
    // Check that content is in a scrollable container
    const scrollableDiv = container.querySelector('[class*="overflow"]');
    expect(scrollableDiv).toBeInTheDocument();
  });
});
