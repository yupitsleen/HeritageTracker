import { useMemo } from "react";
import type { GazaSite } from "../types";

/**
 * Heritage statistics calculation hook
 * Computes various metrics about site destruction, age, and cultural significance
 */
export function useHeritageStats(sites: GazaSite[]) {
  return useMemo(() => {
    const total = sites.length;
    const destroyed = sites.filter((s) => s.status === "destroyed").length;
    const damaged = sites.filter((s) => s.status === "damaged").length;
    const heavilyDamaged = sites.filter((s) => s.status === "heavily-damaged").length;
    const surviving = damaged + heavilyDamaged; // Sites that still exist but are damaged

    // Religious and pilgrimage sites
    const religiousSites = sites.filter((s) => s.type === "mosque" || s.type === "church");
    const religiousDestroyed = religiousSites.filter((s) => s.status === "destroyed").length;
    const religiousSurviving = religiousSites.filter((s) => s.status !== "destroyed").length;

    // Age analysis
    const parseAge = (yearBuilt: string): number => {
      // Extract first year/number from yearBuilt string
      const match = yearBuilt.match(/(\d+)\s*(BCE|BC|CE)?/);
      if (!match) return 0;
      const year = parseInt(match[1]);
      const isBCE = match[2] === "BCE" || match[2] === "BC";
      return isBCE ? year : 2024 - year;
    };
    const ages = sites.map((s) => parseAge(s.yearBuilt)).filter((age) => age > 0);
    const oldestSiteAge = Math.max(...ages, 0);

    // Count sites over 1000 years old
    const ancientSites = sites.filter((s) => parseAge(s.yearBuilt) >= 1000).length;

    // Museums and cultural centers (knowledge repositories)
    const museums = sites.filter((s) => s.type === "museum").length;
    const museumsDestroyed =
      museums > 0 ? sites.filter((s) => s.type === "museum" && s.status === "destroyed").length : 0;

    // Archaeological sites
    const archaeological = sites.filter((s) => s.type === "archaeological").length;
    const archaeologicalSurviving = sites.filter(
      (s) => s.type === "archaeological" && s.status !== "destroyed"
    ).length;

    return {
      total,
      destroyed,
      damaged,
      heavilyDamaged,
      surviving,
      religiousSites: religiousSites.length,
      religiousDestroyed,
      religiousSurviving,
      oldestSiteAge,
      ancientSites,
      museums,
      museumsDestroyed,
      archaeological,
      archaeologicalSurviving,
    };
  }, [sites]);
}
