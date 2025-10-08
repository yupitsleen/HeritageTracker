import { createContext, useContext, useState, ReactNode } from "react";

export type CalendarType = "gregorian" | "islamic";

interface CalendarContextType {
  calendarType: CalendarType;
  setCalendarType: (type: CalendarType) => void;
  toggleCalendar: () => void;
}

/**
 * CalendarContext provides global state for calendar type selection.
 *
 * Performance Note:
 * Currently, context value updates trigger re-renders in all consuming components.
 * This is acceptable for MVP with limited consumers (3-4 components).
 * If performance becomes an issue, consider:
 * - Wrapping context value in useMemo
 * - Using state management library (Zustand/Jotai)
 * - Component-level memoization (React.memo)
 */
const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [calendarType, setCalendarType] = useState<CalendarType>("gregorian");

  const toggleCalendar = () => {
    setCalendarType((prev) => (prev === "gregorian" ? "islamic" : "gregorian"));
  };

  return (
    <CalendarContext.Provider
      value={{ calendarType, setCalendarType, toggleCalendar }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
