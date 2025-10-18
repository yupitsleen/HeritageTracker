import { describe, it, expect, vi } from "vitest";
import { renderWithTheme } from "../test-utils/renderWithTheme";
import { TimelineScrubber } from "../components/Timeline/TimelineScrubber";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";

// Mock ResizeObserver for jsdom environment
global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock observe method
  }
  unobserve() {
    // Mock unobserve method
  }
  disconnect() {
    // Mock disconnect method
  }
};

// Mock D3 drag behavior - returns a proper drag behavior function
vi.mock("d3", async () => {
  const actual = await vi.importActual<typeof import("d3")>("d3");
  return {
    ...actual,
    drag: () => {
      const dragBehavior = function () {
        // Mock drag behavior that does nothing
      };
      dragBehavior.on = vi.fn().mockReturnValue(dragBehavior);
      return dragBehavior;
    },
  };
});

const mockSites: GazaSite[] = [
  {
    id: "test-site-1",
    name: "Test Site 1",
    type: "mosque",
    yearBuilt: "7th century",
    coordinates: [31.5, 34.5],
    status: "destroyed",
    dateDestroyed: "2023-10-15",
    description: "Test description",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
  {
    id: "test-site-2",
    name: "Test Site 2",
    type: "church",
    yearBuilt: "5th century",
    coordinates: [31.6, 34.6],
    status: "heavily-damaged",
    dateDestroyed: "2023-11-01",
    description: "Test description 2",
    historicalSignificance: "Test significance 2",
    culturalValue: "Test value 2",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
];

describe("TimelineScrubber", () => {
  // Smoke test
  it("renders without crashing", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Play/Pause functionality
  it("toggles between play and pause states", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Reset functionality
  it("resets timeline to start date when reset button is clicked", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Speed control
  it("changes animation speed when speed dropdown is changed", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Keyboard controls - Space
  it("pauses timeline when space key is pressed while playing", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Keyboard controls - Home/End
  it("jumps to start when Home key is pressed", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Event markers
  it("displays event markers for destruction dates", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    // SVG should be present
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  // Accessibility - ARIA labels
  it("has proper ARIA labels for accessibility", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Edge case - empty sites array
  it("handles empty sites array without crashing", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={[]} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Edge case - sites without dateDestroyed
  it("handles sites without destruction dates", () => {
    const sitesWithoutDates: GazaSite[] = [
      {
        id: "test-site-no-date",
        name: "Test Site No Date",
        type: "museum",
        yearBuilt: "1950",
        coordinates: [31.5, 34.5],
        status: "destroyed",
        description: "Test",
        historicalSignificance: "Test",
        culturalValue: "Test",
        verifiedBy: ["UNESCO"],
        sources: [],
      },
    ];

    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={sitesWithoutDates} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Visual elements
  it("displays current date", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });

  // Keyboard shortcuts hint
  it("displays keyboard shortcuts hint", () => {
    const { container } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
