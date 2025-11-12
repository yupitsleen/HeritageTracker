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
});
