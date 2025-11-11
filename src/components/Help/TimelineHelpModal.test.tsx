import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimelineHelpModal } from "./TimelineHelpModal";
import { ThemeProvider } from "../../contexts/ThemeContext";

function renderWithTheme(component: React.ReactElement) {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
}

describe("TimelineHelpModal", () => {
  describe("Smoke Tests", () => {
    it("renders without crashing", () => {
      renderWithTheme(<TimelineHelpModal />);
      expect(screen.getByText("How to Use Satellite Timeline")).toBeInTheDocument();
    });
  });

  describe("Content Tests", () => {
    it("renders all section headings", () => {
      renderWithTheme(<TimelineHelpModal />);

      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.getByText("Satellite Map")).toBeInTheDocument();
      expect(screen.getByText("Wayback Timeline Slider")).toBeInTheDocument();
      expect(screen.getByText("Comparison Mode")).toBeInTheDocument();
      expect(screen.getByText("Navigation Controls")).toBeInTheDocument();
      expect(screen.getByText("Site Timeline (Bottom)")).toBeInTheDocument();
      expect(screen.getByText("Tips")).toBeInTheDocument();
    });

    it("renders overview description", () => {
      renderWithTheme(<TimelineHelpModal />);
      expect(
        screen.getByText(/The Satellite Timeline provides access to 186 historical satellite imagery versions/i)
      ).toBeInTheDocument();
    });

    it("renders satellite map instructions", () => {
      renderWithTheme(<TimelineHelpModal />);
      expect(screen.getByText(/Full-screen satellite view showing the entire region/i)).toBeInTheDocument();
    });

    it("renders wayback timeline slider instructions", () => {
      renderWithTheme(<TimelineHelpModal />);
      expect(screen.getByText(/Year Markers:/i)).toBeInTheDocument();
      expect(screen.getByText(/Gray Lines:/i)).toBeInTheDocument();
      expect(screen.getByText(/Red Dots:/i)).toBeInTheDocument();
      // Green Scrubber appears in both Wayback and Comparison sections
      const greenScrubbers = screen.getAllByText(/Green Scrubber:/i);
      expect(greenScrubbers.length).toBeGreaterThanOrEqual(1);
    });

    it("renders comparison mode instructions", () => {
      renderWithTheme(<TimelineHelpModal />);
      expect(screen.getByText(/Click "Comparison Mode" button above the timeline/i)).toBeInTheDocument();
      expect(screen.getByText(/Yellow Scrubber:/i)).toBeInTheDocument();
    });

    it("renders navigation controls instructions", () => {
      renderWithTheme(<TimelineHelpModal />);
      expect(screen.getByText(/Reset:/i)).toBeInTheDocument();
      expect(screen.getByText(/Previous \(⏮\):/i)).toBeInTheDocument();
      expect(screen.getByText(/Play\/Pause \(▶\/⏸\):/i)).toBeInTheDocument();
      expect(screen.getByText(/Next \(⏭\):/i)).toBeInTheDocument();
    });

    it("renders site timeline instructions", () => {
      renderWithTheme(<TimelineHelpModal />);
      expect(screen.getByText(/Shows destruction events for all heritage sites/i)).toBeInTheDocument();
      expect(screen.getByText(/Sync map on dot click/i)).toBeInTheDocument();
    });

    it("renders tips section", () => {
      renderWithTheme(<TimelineHelpModal />);
      expect(screen.getByText(/Compare satellite imagery before and after destruction events/i)).toBeInTheDocument();
      expect(screen.getByText(/Watch seasonal changes in the landscape/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility Tests", () => {
    it("uses semantic HTML structure", () => {
      renderWithTheme(<TimelineHelpModal />);

      // Check for h2 heading
      const mainHeading = screen.getByRole("heading", { level: 2, name: /How to Use Satellite Timeline/i });
      expect(mainHeading).toBeInTheDocument();

      // Check for h3 subheadings
      const subheadings = screen.getAllByRole("heading", { level: 3 });
      expect(subheadings.length).toBeGreaterThan(5);
    });

    it("uses unordered lists for bullet points", () => {
      const { container } = renderWithTheme(<TimelineHelpModal />);

      // Check for multiple lists
      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBeGreaterThan(5);
    });
  });
});
