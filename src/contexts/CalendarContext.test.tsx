import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CalendarProvider, useCalendar } from "./CalendarContext";

// Test component that uses the calendar context
function TestComponent() {
  const { calendarType } = useCalendar();

  return (
    <div>
      <div data-testid="calendar-type">{calendarType}</div>
    </div>
  );
}

describe("CalendarContext", () => {
  it("provides calendar context to children", () => {
    const { container } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("throws error when used outside provider", () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useCalendar must be used within a CalendarProvider");

    console.error = consoleError;
  });
});
