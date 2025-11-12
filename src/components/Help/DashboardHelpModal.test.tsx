import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardHelpModal } from "./DashboardHelpModal";
import { ThemeProvider } from "../../contexts/ThemeContext";

/**
 * Test wrapper with required contexts
 */
function renderWithContext(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
}

describe("DashboardHelpModal", () => {
  describe("Smoke Tests", () => {
    it("renders without crashing", () => {
      renderWithContext(<DashboardHelpModal />);
    });

    it("renders main heading", () => {
      renderWithContext(<DashboardHelpModal />);
      expect(screen.getByText("How to Use Heritage Tracker")).toBeInTheDocument();
    });
  });

  describe("Content Tests", () => {
    it("renders all section headings", () => {
      renderWithContext(<DashboardHelpModal />);

      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.getByText("Site Table (Left)")).toBeInTheDocument();
      expect(screen.getByText("Maps (Center & Right)")).toBeInTheDocument();
      expect(screen.getByText("Timeline (Bottom)")).toBeInTheDocument();
      expect(screen.getByText("Filtering")).toBeInTheDocument();
      expect(screen.getByText("Timeline Page")).toBeInTheDocument();
    });

    it("mentions 70 sites representing 140-160 buildings", () => {
      renderWithContext(<DashboardHelpModal />);
      expect(screen.getByText(/70 cultural heritage sites in Gaza \(representing 140-160 buildings\)/i)).toBeInTheDocument();
    });

    it("describes site table features", () => {
      renderWithContext(<DashboardHelpModal />);
      expect(screen.getByText(/Click on a site name to view detailed information/i)).toBeInTheDocument();
      expect(screen.getByText(/Drag the resize handle to adjust table width/i)).toBeInTheDocument();
    });

    it("describes map features", () => {
      renderWithContext(<DashboardHelpModal />);
      expect(screen.getByText(/Heritage Map \(center\):/)).toBeInTheDocument();
      expect(screen.getByText(/Site Detail View \(right\):/)).toBeInTheDocument();
      expect(screen.getByText(/Toggle between street and satellite views/i)).toBeInTheDocument();
    });

    it("describes timeline features", () => {
      renderWithContext(<DashboardHelpModal />);
      expect(screen.getByText(/Red dots represent destruction events/i)).toBeInTheDocument();
      expect(screen.getByText(/play\/pause to animate/i)).toBeInTheDocument();
    });

    it("describes filtering features", () => {
      renderWithContext(<DashboardHelpModal />);
      expect(screen.getByText(/search bar to find sites by name/i)).toBeInTheDocument();
      expect(screen.getByText(/filter dropdowns/i)).toBeInTheDocument();
    });

    it("mentions Timeline Page with ESRI Wayback", () => {
      renderWithContext(<DashboardHelpModal />);
      expect(screen.getByText(/186 historical satellite imagery versions/i)).toBeInTheDocument();
      expect(screen.getByText(/ESRI Wayback/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("uses semantic HTML sections", () => {
      const { container } = renderWithContext(<DashboardHelpModal />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);
    });

    it("uses proper heading hierarchy", () => {
      const { container } = renderWithContext(<DashboardHelpModal />);

      const h2 = container.querySelector("h2");
      expect(h2).toBeInTheDocument();
      expect(h2).toHaveTextContent("How to Use Heritage Tracker");

      const h3Elements = container.querySelectorAll("h3");
      expect(h3Elements.length).toBeGreaterThanOrEqual(6); // At least 6 subsections
    });

    it("uses lists for instructional content", () => {
      const { container } = renderWithContext(<DashboardHelpModal />);
      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("applies theme classes correctly", () => {
      const { container } = renderWithContext(<DashboardHelpModal />);
      const heading = container.querySelector("h2");
      expect(heading?.className).toContain("text-2xl");
      expect(heading?.className).toContain("font-bold");
    });
  });
});
