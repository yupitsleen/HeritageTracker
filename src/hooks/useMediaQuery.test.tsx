import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  // Mock matchMedia
  let listeners: ((event: MediaQueryListEvent) => void)[] = [];
  let mockMatches = false;

  beforeEach(() => {
    listeners = [];
    mockMatches = false;

    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: mockMatches,
        media: query,
        onchange: null,
        addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
          if (event === "change") {
            listeners.push(handler);
          }
        }),
        removeEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
          if (event === "change") {
            listeners = listeners.filter((l) => l !== handler);
          }
        }),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    listeners = [];
  });

  describe("Smoke Tests", () => {
    it("should return initial match value", () => {
      mockMatches = true;
      const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
      expect(result.current).toBe(true);
    });

    it("should return false when media query does not match", () => {
      mockMatches = false;
      const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
      expect(result.current).toBe(false);
    });
  });

  describe("Media Query Updates", () => {
    it("should update when media query match changes", () => {
      mockMatches = false;
      const { result, rerender } = renderHook(() => useMediaQuery("(max-width: 768px)"));

      expect(result.current).toBe(false);

      // Simulate media query change
      mockMatches = true;
      listeners.forEach((listener) => {
        listener({ matches: true, media: "(max-width: 768px)" } as MediaQueryListEvent);
      });

      rerender();
      expect(result.current).toBe(true);
    });

    it("should update when media query no longer matches", () => {
      mockMatches = true;
      const { result, rerender } = renderHook(() => useMediaQuery("(max-width: 768px)"));

      expect(result.current).toBe(true);

      // Simulate media query change
      mockMatches = false;
      listeners.forEach((listener) => {
        listener({ matches: false, media: "(max-width: 768px)" } as MediaQueryListEvent);
      });

      rerender();
      expect(result.current).toBe(false);
    });
  });

  describe("Cleanup", () => {
    it("should remove event listener on unmount", () => {
      const { unmount } = renderHook(() => useMediaQuery("(max-width: 768px)"));

      expect(listeners.length).toBeGreaterThan(0);

      unmount();

      expect(listeners.length).toBe(0);
    });
  });

  describe("Multiple Queries", () => {
    it("should handle multiple media queries independently", () => {
      const { result: result1 } = renderHook(() => useMediaQuery("(max-width: 768px)"));
      const { result: result2 } = renderHook(() => useMediaQuery("(min-width: 1024px)"));

      expect(result1.current).toBe(false);
      expect(result2.current).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle complex media queries", () => {
      const { result } = renderHook(() =>
        useMediaQuery("(min-width: 768px) and (max-width: 1024px)")
      );
      expect(result.current).toBe(false);
    });

    it("should handle prefers-color-scheme queries", () => {
      const { result } = renderHook(() => useMediaQuery("(prefers-color-scheme: dark)"));
      expect(result.current).toBe(false);
    });
  });
});
