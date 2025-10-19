import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

const originalMatchMedia = window.matchMedia;

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
  beforeAll(() => {
    localStorage.clear();
    localStorage.removeItem("heritage-tracker-theme");
    document.documentElement.removeAttribute("data-theme");
  });

  beforeEach(() => {
    localStorage.clear();
    localStorage.removeItem("heritage-tracker-theme");
    document.documentElement.removeAttribute("data-theme");

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
      const mockStorage: Record<string, string> = { "heritage-tracker-theme": "dark" };

      vi.stubGlobal("localStorage", {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value; },
        removeItem: (key: string) => { delete mockStorage[key]; },
        clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); },
        length: Object.keys(mockStorage).length,
        key: (index: number) => Object.keys(mockStorage)[index] || null,
      });

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
      expect(screen.getByTestId("isDark")).toHaveTextContent("true");

      vi.unstubAllGlobals();
    });

    it("respects system dark mode preference when no localStorage value", () => {
      const mockStorage: Record<string, string> = {};

      vi.stubGlobal("localStorage", {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value; },
        removeItem: (key: string) => { delete mockStorage[key]; },
        clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); },
        length: Object.keys(mockStorage).length,
        key: (index: number) => Object.keys(mockStorage)[index] || null,
      });

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

      window.matchMedia = mockMatchMedia;

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      expect(mockMatchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
      expect(screen.getByTestId("isDark")).toHaveTextContent("true");

      vi.unstubAllGlobals();
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
