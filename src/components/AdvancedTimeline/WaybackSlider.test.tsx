import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WaybackSlider } from "./WaybackSlider";
import { ThemeProvider } from "../../contexts/ThemeContext";
import type { WaybackRelease } from "../../services/waybackService";

// Helper to render with theme provider
function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

// Mock releases for testing
const mockReleases: WaybackRelease[] = [
  {
    releaseNum: 1,
    releaseDate: "2014-02-20",
    label: "2014-02-20",
    tileUrl: "https://example.com/tile/1/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    releaseNum: 2,
    releaseDate: "2014-06-15",
    label: "2014-06-15",
    tileUrl: "https://example.com/tile/2/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    releaseNum: 3,
    releaseDate: "2015-01-10",
    label: "2015-01-10",
    tileUrl: "https://example.com/tile/3/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    releaseNum: 4,
    releaseDate: "2015-08-20",
    label: "2015-08-20",
    tileUrl: "https://example.com/tile/4/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    releaseNum: 5,
    releaseDate: "2016-03-05",
    label: "2016-03-05",
    tileUrl: "https://example.com/tile/5/{z}/{y}/{x}",
    maxZoom: 19,
  },
];

describe("WaybackSlider", () => {
  describe("Rendering", () => {
    it("renders without crashing with releases", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Date appears in multiple places (main display + tooltips), so use getAllByText
      const dateElements = screen.getAllByText("2014-02-20");
      expect(dateElements.length).toBeGreaterThan(0);
      expect(screen.getByText("1 / 5")).toBeInTheDocument();
    });

    it("renders empty state when no releases provided", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(<WaybackSlider releases={[]} currentIndex={0} onIndexChange={onIndexChange} />);

      expect(screen.getByText("No imagery releases available")).toBeInTheDocument();
    });

    it("displays current release date and position", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      // Date appears in multiple places (main display + tooltips), so use getAllByText
      const dateElements = screen.getAllByText("2015-01-10");
      expect(dateElements.length).toBeGreaterThan(0);
      expect(screen.getByText("3 / 5")).toBeInTheDocument();
    });

    it("renders year labels for timeline", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Should show years from 2014 to 2016
      expect(screen.getByText("2014")).toBeInTheDocument();
      expect(screen.getByText("2015")).toBeInTheDocument();
      expect(screen.getByText("2016")).toBeInTheDocument();
    });
  });

  describe("Previous/Next Buttons", () => {
    it("renders Previous and Next buttons", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      expect(screen.getByRole("button", { name: /Previous imagery release/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Next imagery release/i })).toBeInTheDocument();
    });

    it("calls onIndexChange when Next button clicked", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      const nextButton = screen.getByRole("button", { name: /Next imagery release/i });
      fireEvent.click(nextButton);

      expect(onIndexChange).toHaveBeenCalledWith(3);
    });

    it("calls onIndexChange when Previous button clicked", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      const prevButton = screen.getByRole("button", { name: /Previous imagery release/i });
      fireEvent.click(prevButton);

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it("disables Previous button at first release", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      const prevButton = screen.getByRole("button", { name: /Previous imagery release/i });
      expect(prevButton).toBeDisabled();
    });

    it("disables Next button at last release", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={4} onIndexChange={onIndexChange} />
      );

      const nextButton = screen.getByRole("button", { name: /Next imagery release/i });
      expect(nextButton).toBeDisabled();
    });

    it("does not call onIndexChange when disabled Previous is clicked", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      const prevButton = screen.getByRole("button", { name: /Previous imagery release/i });
      fireEvent.click(prevButton);

      expect(onIndexChange).not.toHaveBeenCalled();
    });

    it("does not call onIndexChange when disabled Next is clicked", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={4} onIndexChange={onIndexChange} />
      );

      const nextButton = screen.getByRole("button", { name: /Next imagery release/i });
      fireEvent.click(nextButton);

      expect(onIndexChange).not.toHaveBeenCalled();
    });
  });

  describe("Clickable Timeline", () => {
    it("handles timeline click to change release", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Find the clickable timeline bar (has cursor-pointer class)
      const timeline = container.querySelector(".cursor-pointer");
      expect(timeline).toBeTruthy();

      if (timeline) {
        // Mock getBoundingClientRect for click position calculation
        vi.spyOn(timeline, "getBoundingClientRect").mockReturnValue({
          left: 0,
          width: 100,
          top: 0,
          right: 100,
          bottom: 10,
          height: 10,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        });

        // Click at 50% position (middle of timeline)
        fireEvent.click(timeline, { clientX: 50 });

        // Should call onIndexChange with some index
        expect(onIndexChange).toHaveBeenCalled();
      }
    });

    it("finds nearest release when timeline is clicked", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      const timeline = container.querySelector(".cursor-pointer");
      if (timeline) {
        vi.spyOn(timeline, "getBoundingClientRect").mockReturnValue({
          left: 0,
          width: 100,
          top: 0,
          right: 100,
          bottom: 10,
          height: 10,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        });

        // Click at start (should select first release)
        fireEvent.click(timeline, { clientX: 0 });
        expect(onIndexChange).toHaveBeenCalledWith(0);

        // Click at end (should select last release)
        fireEvent.click(timeline, { clientX: 100 });
        expect(onIndexChange).toHaveBeenCalledWith(4);
      }
    });
  });

  describe("Tooltips", () => {
    it("renders tooltips with release dates", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Tooltips should contain release dates
      // They use opacity-0 initially and group-hover:opacity-100
      const tooltips = container.querySelectorAll(".group-hover\\:opacity-100");
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it("tooltip elements are present for each release", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Should have tick marks with group class (one per release)
      const tickMarkContainers = container.querySelectorAll(".group");
      expect(tickMarkContainers.length).toBe(mockReleases.length);
    });
  });

  describe("Visual Indicators", () => {
    it("highlights current release tick mark", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      // Current release should have white tick mark (bg-white class)
      const whiteTicks = container.querySelectorAll(".bg-white");
      expect(whiteTicks.length).toBeGreaterThan(0);
    });

    it("renders green progress fill", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      // Should have green progress fill
      const greenFill = container.querySelector(".bg-\\[\\#009639\\]");
      expect(greenFill).toBeTruthy();
    });

    it("renders scrubber indicator at current position", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      // Should have white scrubber circle with green border
      const scrubber = container.querySelector(".border-\\[\\#009639\\]");
      expect(scrubber).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("handles single release", () => {
      const onIndexChange = vi.fn();
      const singleRelease = [mockReleases[0]];

      renderWithTheme(
        <WaybackSlider releases={singleRelease} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Date appears in multiple places (main display + tooltips), so use getAllByText
      const dateElements = screen.getAllByText("2014-02-20");
      expect(dateElements.length).toBeGreaterThan(0);
      expect(screen.getByText("1 / 1")).toBeInTheDocument();

      // Both buttons should be disabled
      const prevButton = screen.getByRole("button", { name: /Previous imagery release/i });
      const nextButton = screen.getByRole("button", { name: /Next imagery release/i });
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("handles currentIndex beyond releases length gracefully", () => {
      const onIndexChange = vi.fn();

      // Should not crash even with invalid index
      expect(() => {
        renderWithTheme(
          <WaybackSlider releases={mockReleases} currentIndex={100} onIndexChange={onIndexChange} />
        );
      }).not.toThrow();
    });

    it("updates display when currentIndex changes", () => {
      const onIndexChange = vi.fn();
      const { rerender } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Initial date check
      let dateElements = screen.getAllByText("2014-02-20");
      expect(dateElements.length).toBeGreaterThan(0);

      // Update to different index
      rerender(
        <ThemeProvider>
          <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
        </ThemeProvider>
      );

      // New date check
      dateElements = screen.getAllByText("2015-01-10");
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe("Dark Mode Support", () => {
    it("renders in dark mode without errors", () => {
      // Set dark mode
      localStorage.setItem("heritage-tracker-theme", "dark");

      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Date appears in multiple places (main display + tooltips), so use getAllByText
      const dateElements = screen.getAllByText("2014-02-20");
      expect(dateElements.length).toBeGreaterThan(0);

      localStorage.removeItem("heritage-tracker-theme");
    });

    it("renders in light mode without errors", () => {
      // Set light mode
      localStorage.setItem("heritage-tracker-theme", "light");

      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Date appears in multiple places (main display + tooltips), so use getAllByText
      const dateElements = screen.getAllByText("2014-02-20");
      expect(dateElements.length).toBeGreaterThan(0);

      localStorage.removeItem("heritage-tracker-theme");
    });
  });

  // NEW FEATURE TESTS

  describe("Tick Mark Hover Improvements", () => {
    it("green progress fill has pointer-events-none to allow tick mark hover", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      // Green progress fill should have pointer-events-none class
      const greenFill = container.querySelector(".bg-\\[\\#009639\\]");
      expect(greenFill).toHaveClass("pointer-events-none");
    });

    it("renders wider invisible hitbox for tick marks", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Tick marks should have 8px-wide hitbox (w-2 class = 8px)
      // Each tick mark container has a child div with w-2 class for wider hover area
      const hitboxes = container.querySelectorAll(".w-2");
      expect(hitboxes.length).toBeGreaterThan(0);
    });

    it("tick marks are wrapped in group for hover effects", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Each tick mark should be in a .group container for hover
      const groups = container.querySelectorAll(".group");
      expect(groups.length).toBe(mockReleases.length);
    });

    it("tooltips appear on group hover", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Tooltips should have group-hover:opacity-100 class
      const tooltips = container.querySelectorAll(".group-hover\\:opacity-100");
      expect(tooltips.length).toBe(mockReleases.length);
    });
  });

  describe("Scrubber Tooltip", () => {
    it("renders floating date tooltip above scrubber", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      // Should have tooltip with current date positioned above scrubber
      // Tooltip uses bottom-full mb-2 classes to appear above
      const scrubberTooltip = container.querySelector(".bottom-full");
      expect(scrubberTooltip).toBeTruthy();
    });

    it("scrubber tooltip displays current release date", () => {
      const onIndexChange = vi.fn();
      const { getAllByText } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      // Current date should appear in scrubber tooltip
      const dateElements = getAllByText("2015-01-10");
      // Should have at least 2: main display + scrubber tooltip
      expect(dateElements.length).toBeGreaterThan(1);
    });

    it("scrubber tooltip has green background matching theme", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Scrubber tooltip should have green background (bg-[#009639])
      const greenTooltips = container.querySelectorAll(".bg-\\[\\#009639\\]");
      // At least one should exist (the scrubber tooltip)
      expect(greenTooltips.length).toBeGreaterThan(0);
    });

    it("scrubber tooltip is always visible (not just on hover)", () => {
      const onIndexChange = vi.fn();
      const { container } = renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      // Find the scrubber tooltip specifically (green background, not the gray tick mark tooltips)
      const scrubberTooltips = container.querySelectorAll(".bg-\\[\\#009639\\]");
      expect(scrubberTooltips.length).toBeGreaterThan(0);

      // The scrubber tooltip should have bottom-full class for positioning above
      const tooltipsAbove = container.querySelectorAll(".bottom-full");
      // Should have multiple: tick mark tooltips (5) + scrubber tooltip (1) = 6 total
      expect(tooltipsAbove.length).toBeGreaterThan(5);
    });
  });
});
