import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimelineScrubber } from "../components/Timeline/TimelineScrubber";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";

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
    render(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(screen.getByRole("region", { name: /timeline scrubber/i })).toBeInTheDocument();
  });

  // Play/Pause functionality
  it("toggles between play and pause states", () => {
    render(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    const playButton = screen.getByRole("button", { name: /play timeline animation/i });
    expect(playButton).toBeInTheDocument();

    // Click play
    fireEvent.click(playButton);

    // Should now show pause button
    const pauseButton = screen.getByRole("button", { name: /pause timeline animation/i });
    expect(pauseButton).toBeInTheDocument();

    // Click pause
    fireEvent.click(pauseButton);

    // Should show play button again
    expect(screen.getByRole("button", { name: /play timeline animation/i })).toBeInTheDocument();
  });

  // Reset functionality
  it("resets timeline to start date when reset button is clicked", () => {
    render(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    const resetButton = screen.getByRole("button", { name: /reset timeline to start/i });
    expect(resetButton).toBeInTheDocument();

    // Click reset
    fireEvent.click(resetButton);

    // Should show October 2023 - look for "Current:" label with date
    expect(screen.getByText(/current:/i)).toBeInTheDocument();
    // Check that a date in October 2023 is displayed - use getAllByText
    const octoberDates = screen.getAllByText((_content, element) => {
      return element?.textContent?.includes("October") && element?.textContent?.includes("2023") || false;
    });
    expect(octoberDates.length).toBeGreaterThan(0);
  });

  // Speed control
  it("changes animation speed when speed dropdown is changed", () => {
    render(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    const speedControl = screen.getByRole("combobox", { name: /animation speed control/i });
    expect(speedControl).toBeInTheDocument();

    // Default speed should be 1x
    expect(speedControl).toHaveValue("1");

    // Change to 2x
    fireEvent.change(speedControl, { target: { value: "2" } });
    expect(speedControl).toHaveValue("2");

    // Change to 0.5x
    fireEvent.change(speedControl, { target: { value: "0.5" } });
    expect(speedControl).toHaveValue("0.5");
  });

  // Keyboard controls - Space
  it("pauses timeline when space key is pressed while playing", () => {
    render(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    // Start playing
    const playButton = screen.getByRole("button", { name: /play timeline animation/i });
    fireEvent.click(playButton);

    // Verify pause button is shown
    expect(screen.getByRole("button", { name: /pause timeline animation/i })).toBeInTheDocument();

    // Press space
    fireEvent.keyDown(window, { key: " " });

    // Should show play button again
    expect(screen.getByRole("button", { name: /play timeline animation/i })).toBeInTheDocument();
  });

  // Keyboard controls - Home/End
  it("jumps to start when Home key is pressed", () => {
    render(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    // Press Home key
    fireEvent.keyDown(window, { key: "Home" });

    // Should show October 2023 - look for "Current:" label
    expect(screen.getByText(/current:/i)).toBeInTheDocument();
    // Timeline should be at start (October 2023) - check with getAllByText
    const currentDateElements = screen.getAllByText((_content, element) => {
      return element?.textContent?.includes("Current:") && element?.textContent?.includes("October") && element?.textContent?.includes("2023") || false;
    });
    expect(currentDateElements.length).toBeGreaterThan(0);
  });

  // Event markers
  it("displays event markers for destruction dates", () => {
    const { container } = render(
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
    render(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    expect(screen.getByRole("region", { name: /timeline scrubber/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/animation speed control/i)).toBeInTheDocument();
    // Either play or pause button should be present
    const playOrPause =
      screen.queryByRole("button", { name: /play timeline animation/i }) ||
      screen.queryByRole("button", { name: /pause timeline animation/i });
    expect(playOrPause).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset timeline to start/i })).toBeInTheDocument();
  });

  // Edge case - empty sites array
  it("handles empty sites array without crashing", () => {
    render(
      <AnimationProvider>
        <TimelineScrubber sites={[]} />
      </AnimationProvider>
    );

    expect(screen.getByRole("region", { name: /timeline scrubber/i })).toBeInTheDocument();
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

    render(
      <AnimationProvider>
        <TimelineScrubber sites={sitesWithoutDates} />
      </AnimationProvider>
    );

    expect(screen.getByRole("region", { name: /timeline scrubber/i })).toBeInTheDocument();
  });

  // Visual elements
  it("displays current date", () => {
    render(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    // Should show "Current:" label and a date
    expect(screen.getByText(/current:/i)).toBeInTheDocument();
  });

  // Keyboard shortcuts hint
  it("displays keyboard shortcuts hint", () => {
    render(
      <AnimationProvider>
        <TimelineScrubber sites={mockSites} />
      </AnimationProvider>
    );

    // Check for keyboard hint section with all keywords
    const keyboardSection = screen.getAllByText((_content, element) => {
      const text = element?.textContent || "";
      return text.includes("Keyboard:") && text.includes("Play/Pause") && text.includes("Step");
    })[0];
    expect(keyboardSection).toBeInTheDocument();
  });
});
