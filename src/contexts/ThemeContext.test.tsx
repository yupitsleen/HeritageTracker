import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

// Store original matchMedia
const originalMatchMedia = window.matchMedia;

// Test component that displays theme state
function ThemeDisplay() {
  const { theme, isDark, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="isDark">{isDark ? "true" : "false"}</div>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    // Clear all storage and DOM state
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");

    // Reset matchMedia to default (returns false for prefers-color-scheme: dark)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  describe("Initialization", () => {
    it("defaults to light mode when no preferences exist", () => {
      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("light");
      expect(screen.getByTestId("isDark")).toHaveTextContent("false");
    });

    it("respects stored localStorage preference", () => {
      localStorage.setItem("heritage-tracker-theme", "dark");

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
      expect(screen.getByTestId("isDark")).toHaveTextContent("true");
    });

    it("respects system dark mode preference when no localStorage value", () => {
      // Mock matchMedia to return dark mode preference
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: mockMatchMedia,
      });

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      expect(mockMatchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
      expect(screen.getByTestId("isDark")).toHaveTextContent("true");
    });

    it("prefers localStorage over system preference", () => {
      localStorage.setItem("heritage-tracker-theme", "light");

      // Mock system preference to dark
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: mockMatchMedia,
      });

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      // Should use localStorage (light), not system preference (dark)
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
      expect(screen.getByTestId("isDark")).toHaveTextContent("false");
    });
  });

  describe("Theme Persistence", () => {
    it("applies data-theme attribute to document root on mount", () => {
      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      // Should apply theme to document root
      const dataTheme = document.documentElement.getAttribute("data-theme");
      expect(dataTheme).toBeTruthy(); // Has some theme set
      expect(["light", "dark"]).toContain(dataTheme); // Is valid theme
    });
  });

  describe("Error Handling", () => {
    it("throws error when useTheme is used outside ThemeProvider", () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<ThemeDisplay />);
      }).toThrow("useTheme must be used within ThemeProvider");

      consoleError.mockRestore();
    });
  });
});
