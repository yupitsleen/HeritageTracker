import { describe, it, expect } from "vitest";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { About } from "./About";
import { waitFor } from "@testing-library/react";

describe("About", () => {
  it("renders without crashing", () => {
    const { container } = renderWithTheme(<About />);
    expect(container).toBeInTheDocument();
  });

  it("displays content", async () => {
    renderWithTheme(<About />);

    // Wait for lazy-loaded sections to render
    await waitFor(() => {
      const bodyText = document.body.textContent || "";
      expect(bodyText.length).toBeGreaterThan(100); // Has meaningful content
    });
  });

  it("is scrollable", () => {
    const { container } = renderWithTheme(<About />);
    // Check that content is in a scrollable container
    const scrollableDiv = container.querySelector('[class*="overflow"]');
    expect(scrollableDiv).toBeInTheDocument();
  });
});
