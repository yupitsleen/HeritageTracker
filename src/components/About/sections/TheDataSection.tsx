import { useMemo } from "react";
import { useThemeClasses } from "../../../hooks/useThemeClasses";
import type { GazaSite } from "../../../types";

interface TheDataSectionProps {
  sites: GazaSite[];
}

/**
 * TheDataSection - Current dataset statistics (desktop only)
 * Now dynamically calculated from actual site data
 */
export function TheDataSection({ sites }: TheDataSectionProps) {
  const t = useThemeClasses();

  // Calculate stats dynamically from site data
  const stats = useMemo(() => {
    const total = sites.length;
    const destroyed = sites.filter((s) => s.status === "destroyed").length;
    const damaged = sites.filter((s) => s.status === "damaged" || s.status === "heavily-damaged").length;

    // Calculate oldest site age
    const parseAge = (yearBuilt: string): number => {
      const match = yearBuilt.match(/(\d+)\s*(BCE|BC|CE)?/);
      if (!match) return 0;
      const year = parseInt(match[1]);
      const isBCE = match[2] === "BCE" || match[2] === "BC";
      return isBCE ? year : 2025 - year;
    };
    const ages = sites.map((s) => parseAge(s.yearBuilt)).filter((age) => age > 0);
    const oldestSiteAge = Math.max(...ages, 0);

    return { total, destroyed, damaged, oldestSiteAge };
  }, [sites]);

  return (
    <section className="hidden md:block mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">The Data</h2>
      <div className={`${t.bg.tertiary} rounded-lg p-6 space-y-4`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#009639]">{stats.total}</div>
            <div className="text-base text-gray-900">Sites Documented</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ed3039]">{stats.destroyed}</div>
            <div className="text-base text-gray-900">Completely Destroyed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ca8a04]">{stats.damaged}</div>
            <div className="text-base text-gray-900">Damaged</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) / 10}k` : "—"}
            </div>
            <div className="text-base text-gray-900">Years of History</div>
          </div>
        </div>
        <p className="text-base text-gray-900 text-center mt-4">
          As of January 2025 • {stats.total} documented heritage sites
        </p>
      </div>
    </section>
  );
}
