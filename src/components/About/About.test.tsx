import { describe, it, expect } from "vitest";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { About } from "./About";
import { waitFor } from "@testing-library/react";
import { mockSites } from "../../data/mockSites";

describe("About", () => {
  it("renders without crashing", () => {
    const { container } = renderWithTheme(<About sites={mockSites} />);
    expect(container).toBeInTheDocument();
  });

  it("displays content", async () => {
    renderWithTheme(<About sites={mockSites} />);

    // Wait for sections to render
    await waitFor(() => {
      const bodyText = document.body.textContent || "";
      expect(bodyText.length).toBeGreaterThan(100); // Has meaningful content
    });
  });
});
