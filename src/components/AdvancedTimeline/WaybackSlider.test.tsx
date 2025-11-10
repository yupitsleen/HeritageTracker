import { describe, it, expect, vi } from "vitest";
import { renderWithTheme, screen, fireEvent } from "../../test-utils/renderWithTheme";
import { WaybackSlider } from "./WaybackSlider";
import type { WaybackRelease } from "../../services/waybackService";

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

      // Should render Previous and Next buttons
      expect(screen.getByLabelText("Previous")).toBeInTheDocument();
      expect(screen.getByLabelText("Next")).toBeInTheDocument();
    });

    it("renders empty state when no releases provided", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(<WaybackSlider releases={[]} currentIndex={0} onIndexChange={onIndexChange} />);

      expect(screen.getByText("No imagery releases available")).toBeInTheDocument();
    });

    it("renders navigation buttons correctly", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      // Should have Previous and Next buttons
      expect(screen.getByLabelText("Previous")).toBeInTheDocument();
      expect(screen.getByLabelText("Next")).toBeInTheDocument();
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

      expect(screen.getByRole("button", { name: /Previous/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
    });

    it("calls onIndexChange when Next button clicked", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      const nextButton = screen.getByRole("button", { name: /Next/i });
      fireEvent.click(nextButton);

      expect(onIndexChange).toHaveBeenCalledWith(3);
    });

    it("calls onIndexChange when Previous button clicked", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
      );

      const prevButton = screen.getByRole("button", { name: /Previous/i });
      fireEvent.click(prevButton);

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it("disables Previous button at first release", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      const prevButton = screen.getByRole("button", { name: /Previous/i });
      expect(prevButton).toBeDisabled();
    });

    it("disables Next button at last release", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={4} onIndexChange={onIndexChange} />
      );

      const nextButton = screen.getByRole("button", { name: /Next/i });
      expect(nextButton).toBeDisabled();
    });

    it("does not call onIndexChange when disabled Previous is clicked", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={0} onIndexChange={onIndexChange} />
      );

      const prevButton = screen.getByRole("button", { name: /Previous/i });
      fireEvent.click(prevButton);

      expect(onIndexChange).not.toHaveBeenCalled();
    });

    it("does not call onIndexChange when disabled Next is clicked", () => {
      const onIndexChange = vi.fn();
      renderWithTheme(
        <WaybackSlider releases={mockReleases} currentIndex={4} onIndexChange={onIndexChange} />
      );

      const nextButton = screen.getByRole("button", { name: /Next/i });
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

      // Should have white scrubber circle with green border (now uses inline style)
      const scrubber = container.querySelector('[style*="border-color"][style*="rgb(0, 150, 57)"]');
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

      // Both buttons should be disabled (only one release)
      const prevButton = screen.getByRole("button", { name: /Previous/i });
      const nextButton = screen.getByRole("button", { name: /Next/i });
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
        <WaybackSlider releases={mockReleases} currentIndex={2} onIndexChange={onIndexChange} />
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

  describe("Comparison Mode", () => {
    describe("Dual Scrubber Rendering", () => {
      it("renders two scrubbers when comparison mode is enabled", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={4}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        // Should have two scrubber indicators (white circles with colored borders)
        const scrubbers = container.querySelectorAll(".w-3.h-3.bg-white");
        expect(scrubbers).toHaveLength(2);
      });

      it("renders only one scrubber when comparison mode is disabled", () => {
        const onIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={2}
            onIndexChange={onIndexChange}
            comparisonMode={false}
          />
        );

        // Should have only one scrubber
        const scrubbers = container.querySelectorAll(".w-3.h-3.bg-white");
        expect(scrubbers).toHaveLength(1);
      });

      it("renders yellow scrubber for before index", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={4}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        // Should have yellow border scrubber (Palestinian flag yellow #FDB927)
        // Now uses inline style instead of CSS class
        const yellowScrubber = container.querySelector('[style*="border-color"][style*="rgb(253, 185, 39)"]');
        expect(yellowScrubber).toBeTruthy();
      });

      it("renders green scrubber for current index", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={4}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        // Should have green border scrubber (Palestinian flag green #009639)
        // Now uses inline style instead of CSS class
        const greenScrubber = container.querySelector('[style*="border-color"][style*="rgb(0, 150, 57)"]');
        expect(greenScrubber).toBeTruthy();
      });

      it("shows correct date on yellow scrubber tooltip", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={4}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        // Yellow tooltip should show release at beforeIndex (index 1 = "2014-06-15")
        // Now uses inline style with DateLabel component
        const yellowTooltips = container.querySelectorAll('[style*="background-color"][style*="rgb(253, 185, 39)"]');
        expect(yellowTooltips.length).toBeGreaterThan(0);
        expect(yellowTooltips[0]).toHaveTextContent("2014-06-15");
      });

      it("shows correct date on green scrubber tooltip", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={4}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        // Green tooltip should show release at currentIndex (index 4 = "2016-03-05")
        // Now uses inline style with DateLabel component
        // Note: There may be multiple green elements (progress bar uses CSS class, tooltip uses inline style)
        const greenTooltips = container.querySelectorAll('[style*="background-color"][style*="rgb(0, 150, 57)"]');
        expect(greenTooltips.length).toBeGreaterThan(0);

        // Find the tooltip with text (should be the DateLabel component)
        let foundTooltip = false;
        greenTooltips.forEach((el) => {
          if (el.textContent && el.textContent.includes("2016-03-05")) {
            foundTooltip = true;
          }
        });
        expect(foundTooltip).toBe(true);
      });
    });

    describe("Click Behavior in Comparison Mode", () => {
      it("calls onBeforeIndexChange when clicking near yellow scrubber", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={4}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        // Find timeline bar
        const timeline = container.querySelector(".h-3.cursor-pointer");
        expect(timeline).toBeInTheDocument();

        // Simulate click at 10% (closer to beforeIndex at position ~25%)
        if (timeline) {
          const rect = { left: 0, width: 1000 } as DOMRect;
          vi.spyOn(timeline, "getBoundingClientRect").mockReturnValue(rect);

          fireEvent.click(timeline, { clientX: 100 }); // 10% position
        }

        // Should call onBeforeIndexChange, not onIndexChange
        expect(onBeforeIndexChange).toHaveBeenCalled();
      });

      it("calls onIndexChange when clicking near green scrubber", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={4}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        // Find timeline bar
        const timeline = container.querySelector(".h-3.cursor-pointer");
        expect(timeline).toBeInTheDocument();

        // Simulate click at 90% (closer to currentIndex at position ~100%)
        if (timeline) {
          const rect = { left: 0, width: 1000 } as DOMRect;
          vi.spyOn(timeline, "getBoundingClientRect").mockReturnValue(rect);

          fireEvent.click(timeline, { clientX: 900 }); // 90% position
        }

        // Should call onIndexChange, not onBeforeIndexChange
        expect(onIndexChange).toHaveBeenCalled();
      });

      it("moves closest scrubber based on click position", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={3}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        const timeline = container.querySelector(".h-3.cursor-pointer");

        // Click in the middle (50%) - should move whichever is closer
        if (timeline) {
          const rect = { left: 0, width: 1000 } as DOMRect;
          vi.spyOn(timeline, "getBoundingClientRect").mockReturnValue(rect);

          fireEvent.click(timeline, { clientX: 500 }); // 50% position
        }

        // Either handler should be called (which one depends on scrubber positions)
        expect(onIndexChange.mock.calls.length + onBeforeIndexChange.mock.calls.length).toBe(1);
      });
    });

    describe("Single Mode Fallback", () => {
      it("calls onIndexChange when comparison mode is off", () => {
        const onIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={2}
            onIndexChange={onIndexChange}
            comparisonMode={false}
          />
        );

        const timeline = container.querySelector(".h-3.cursor-pointer");

        if (timeline) {
          const rect = { left: 0, width: 1000 } as DOMRect;
          vi.spyOn(timeline, "getBoundingClientRect").mockReturnValue(rect);

          fireEvent.click(timeline, { clientX: 500 });
        }

        expect(onIndexChange).toHaveBeenCalled();
      });

      it("does not call onBeforeIndexChange when comparison mode is off", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={2}
            onIndexChange={onIndexChange}
            comparisonMode={false}
            beforeIndex={0}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        const timeline = container.querySelector(".h-3.cursor-pointer");

        if (timeline) {
          const rect = { left: 0, width: 1000 } as DOMRect;
          vi.spyOn(timeline, "getBoundingClientRect").mockReturnValue(rect);

          fireEvent.click(timeline, { clientX: 500 });
        }

        expect(onBeforeIndexChange).not.toHaveBeenCalled();
      });
    });

    describe("Navigation Buttons in Comparison Mode", () => {
      it("updates both scrubbers when Next button clicked", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={2}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        const nextButton = screen.getByRole("button", { name: /Next/i });
        fireEvent.click(nextButton);

        // Green slider should move to index 3
        expect(onIndexChange).toHaveBeenCalledWith(3);
        // Yellow slider should move to index 2 (one step before green)
        expect(onBeforeIndexChange).toHaveBeenCalledWith(2);
      });

      it("updates both scrubbers when Previous button clicked", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={3}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={2}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        const prevButton = screen.getByRole("button", { name: /Previous/i });
        fireEvent.click(prevButton);

        // Green slider should move to index 2
        expect(onIndexChange).toHaveBeenCalledWith(2);
        // Yellow slider should move to index 1 (one step before green)
        expect(onBeforeIndexChange).toHaveBeenCalledWith(1);
      });

      it("keeps yellow slider at 0 when Previous is clicked at green index 1", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={1}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={0}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        const prevButton = screen.getByRole("button", { name: /Previous/i });
        fireEvent.click(prevButton);

        // Green slider should move to index 0
        expect(onIndexChange).toHaveBeenCalledWith(0);
        // Yellow slider should stay at 0 (can't go below 0)
        expect(onBeforeIndexChange).toHaveBeenCalledWith(0);
      });

      it("does not update yellow slider when comparison mode is off", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={2}
            onIndexChange={onIndexChange}
            comparisonMode={false}
            beforeIndex={1}
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        const nextButton = screen.getByRole("button", { name: /Next/i });
        fireEvent.click(nextButton);

        // Green slider should move
        expect(onIndexChange).toHaveBeenCalledWith(3);
        // Yellow slider should NOT move (comparison mode off)
        expect(onBeforeIndexChange).not.toHaveBeenCalled();
      });
    });

    describe("Edge Cases", () => {
      it("handles missing onBeforeIndexChange gracefully", () => {
        const onIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={2}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={0}
          />
        );

        const timeline = container.querySelector(".h-3.cursor-pointer");

        // Should not crash when clicking
        if (timeline) {
          const rect = { left: 0, width: 1000 } as DOMRect;
          vi.spyOn(timeline, "getBoundingClientRect").mockReturnValue(rect);

          expect(() => {
            fireEvent.click(timeline, { clientX: 100 });
          }).not.toThrow();
        }
      });

      it("renders only green scrubber when beforeRelease is null", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={2}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={-1} // Invalid index
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        // Should still render green scrubber (now uses inline style)
        const greenScrubber = container.querySelector('[style*="border-color"][style*="rgb(0, 150, 57)"]');
        expect(greenScrubber).toBeTruthy();

        // Yellow scrubber should not be present (invalid beforeIndex)
        const scrubbers = container.querySelectorAll(".w-3.h-3.bg-white");
        expect(scrubbers).toHaveLength(1); // Only green
      });

      it("handles same beforeIndex and currentIndex", () => {
        const onIndexChange = vi.fn();
        const onBeforeIndexChange = vi.fn();
        const { container } = renderWithTheme(
          <WaybackSlider
            releases={mockReleases}
            currentIndex={2}
            onIndexChange={onIndexChange}
            comparisonMode={true}
            beforeIndex={2} // Same as currentIndex
            onBeforeIndexChange={onBeforeIndexChange}
          />
        );

        // Should render both scrubbers (they may overlap visually)
        const scrubbers = container.querySelectorAll(".w-3.h-3.bg-white");
        expect(scrubbers).toHaveLength(2);
      });
    });
  });
});
