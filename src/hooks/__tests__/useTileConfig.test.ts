import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useTileConfig } from "../useTileConfig";
import { TILE_CONFIGS } from "../../constants/map";

describe("useTileConfig", () => {
  // Store original navigator.language
  let originalLanguage: string;
  let originalLanguages: readonly string[] | undefined;

  beforeEach(() => {
    // Save original values
    originalLanguage = navigator.language;
    originalLanguages = navigator.languages;
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(navigator, "language", {
      value: originalLanguage,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "languages", {
      value: originalLanguages,
      writable: true,
      configurable: true,
    });
  });

  describe("Language Detection", () => {
    it('Test 1: Returns Arabic tiles for navigator.language = "ar"', () => {
      // Mock navigator.language as Arabic
      Object.defineProperty(navigator, "language", {
        value: "ar",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.arabic);
      expect(result.current.url).toBe(TILE_CONFIGS.arabic.url);
    });

    it('Test 2: Returns Arabic tiles for navigator.language = "ar-SA"', () => {
      // Mock navigator.language as Arabic (Saudi Arabia)
      Object.defineProperty(navigator, "language", {
        value: "ar-SA",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.arabic);
      expect(result.current.url).toBe(TILE_CONFIGS.arabic.url);
    });

    it('Test 3: Returns English tiles for navigator.language = "en"', () => {
      // Mock navigator.language as English
      Object.defineProperty(navigator, "language", {
        value: "en",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.english);
      expect(result.current.url).toBe(TILE_CONFIGS.english.url);
    });

    it("Test 4: Returns English tiles for unsupported languages (fallback)", () => {
      // Mock navigator.language as French (unsupported)
      Object.defineProperty(navigator, "language", {
        value: "fr",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.english);
      expect(result.current.url).toBe(TILE_CONFIGS.english.url);
    });
  });

  describe("Additional Tests (Edge Cases)", () => {
    it("Returns Arabic tiles for ar-EG (Egypt)", () => {
      Object.defineProperty(navigator, "language", {
        value: "ar-EG",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.arabic);
    });

    it("Returns Arabic tiles for ar-PS (Palestine)", () => {
      Object.defineProperty(navigator, "language", {
        value: "ar-PS",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.arabic);
    });

    it("Returns English tiles for en-US", () => {
      Object.defineProperty(navigator, "language", {
        value: "en-US",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.english);
    });

    it("Returns English tiles for en-GB", () => {
      Object.defineProperty(navigator, "language", {
        value: "en-GB",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.english);
    });

    it("Returns English tiles for Spanish (es)", () => {
      Object.defineProperty(navigator, "language", {
        value: "es",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.english);
    });

    it("Returns English tiles for German (de)", () => {
      Object.defineProperty(navigator, "language", {
        value: "de",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.english);
    });

    it("Returns English tiles for Chinese (zh)", () => {
      Object.defineProperty(navigator, "language", {
        value: "zh",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.english);
    });

    it("Handles undefined navigator.language gracefully", () => {
      // Mock navigator.language as undefined (fallback to navigator.languages[0])
      Object.defineProperty(navigator, "language", {
        value: undefined,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "languages", {
        value: ["en-US"],
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      expect(result.current).toEqual(TILE_CONFIGS.english);
    });

    it("Handles empty navigator.languages array", () => {
      // Mock both navigator.language and navigator.languages as undefined/empty
      Object.defineProperty(navigator, "language", {
        value: undefined,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "languages", {
        value: [],
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      // Should fallback to "en" as default
      expect(result.current).toEqual(TILE_CONFIGS.english);
    });

    it("Returns correct tile config properties", () => {
      Object.defineProperty(navigator, "language", {
        value: "en",
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useTileConfig());

      // Verify tile config structure
      expect(result.current).toHaveProperty("url");
      expect(result.current).toHaveProperty("attribution");
      expect(typeof result.current.url).toBe("string");
      expect(typeof result.current.attribution).toBe("string");
    });

    it("Returns consistent result across multiple renders", () => {
      Object.defineProperty(navigator, "language", {
        value: "ar",
        writable: true,
        configurable: true,
      });

      const { result, rerender } = renderHook(() => useTileConfig());
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      expect(firstResult).toEqual(secondResult);
    });
  });
});
