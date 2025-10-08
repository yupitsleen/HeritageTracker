import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CalendarProvider, useCalendar } from "./CalendarContext";

// Test component that uses the calendar context
function TestComponent() {
  const { calendarType, setCalendarType, toggleCalendar } = useCalendar();

  return (
    <div>
      <div data-testid="calendar-type">{calendarType}</div>
      <button onClick={() => setCalendarType("islamic")}>Set Islamic</button>
      <button onClick={() => setCalendarType("gregorian")}>Set Gregorian</button>
      <button onClick={toggleCalendar}>Toggle</button>
    </div>
  );
}

describe("CalendarContext", () => {
  it("provides gregorian calendar by default", () => {
    render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );
    expect(screen.getByTestId("calendar-type")).toHaveTextContent("gregorian");
  });

  it("allows setting calendar type", () => {
    render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    fireEvent.click(screen.getByText("Set Islamic"));
    expect(screen.getByTestId("calendar-type")).toHaveTextContent("islamic");

    fireEvent.click(screen.getByText("Set Gregorian"));
    expect(screen.getByTestId("calendar-type")).toHaveTextContent("gregorian");
  });

  it("toggles between gregorian and islamic", () => {
    render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    // Initially gregorian
    expect(screen.getByTestId("calendar-type")).toHaveTextContent("gregorian");

    // Toggle to islamic
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.getByTestId("calendar-type")).toHaveTextContent("islamic");

    // Toggle back to gregorian
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.getByTestId("calendar-type")).toHaveTextContent("gregorian");
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
