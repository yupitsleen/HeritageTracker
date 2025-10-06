import { TILE_CONFIGS } from "../constants/map";

/**
 * Custom hook to get tile configuration based on browser language
 * Returns Arabic tiles for Arabic browsers, English tiles otherwise
 */
export const useTileConfig = () => {
  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  const isArabic = browserLang.startsWith("ar");

  return isArabic ? TILE_CONFIGS.arabic : TILE_CONFIGS.english;
};
