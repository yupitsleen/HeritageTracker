import { useState, useEffect } from "react";
import type { GazaSite } from "../../types";
import { useHeritageStats } from "../../hooks/useHeritageStats";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { LAST_UPDATED } from "../../constants/statistics";
import { BREAKPOINTS } from "../../constants/layout";

interface StatsDashboardProps {
  sites: GazaSite[];
}

/**
 * Statistics Dashboard - conveys the scale and impact of cultural heritage destruction
 */
export function StatsDashboard({ sites }: StatsDashboardProps) {
  const { isDark } = useTheme();
  const t = useThemeClasses();
  // Calculate impactful statistics using extracted hook
  const stats = useHeritageStats(sites);

  // Detect desktop vs mobile for conditional rendering (not just CSS hiding)
  const [isDesktop, setIsDesktop] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth >= BREAKPOINTS.MOBILE;
  });

  useEffect(() => {
    // SSR safety check - ensure window exists
    if (typeof window === 'undefined') return;

    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= BREAKPOINTS.MOBILE);
    };
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <div className={`max-h-[80vh] overflow-y-auto ${t.bg.primary}`}>
      <div className="p-3 md:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6 text-center">
          <h1 className={`text-xl md:text-3xl font-bold ${t.text.heading} mb-1.5`}>
            Documenting Genocide
          </h1>
          <p className={`text-xs md:text-base ${t.text.muted}`}>
            The systematic erasure of a people and their history
          </p>
        </div>

        {/* Human Toll - Critical Context */}
        <div className={`bg-gradient-to-br ${isDark ? "from-red-900/30 to-red-900/10" : "from-red-50 to-red-100"} border-2 border-[#ed3039] rounded-lg p-3 md:p-6 mb-4 md:mb-6`}>
          <div className="grid grid-cols-2 gap-4 md:gap-6 text-center">
            <div>
              <div className="text-3xl md:text-5xl font-bold text-[#ed3039] mb-1">45,000+</div>
              <div className={`text-[10px] md:text-sm font-semibold ${t.text.heading}`}>Palestinians Killed</div>
              <p className={`text-[10px] md:text-xs ${t.text.muted} mt-1`}>70% women & children</p>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold text-[#ed3039] mb-1">1.9M</div>
              <div className={`text-[10px] md:text-sm font-semibold ${t.text.heading}`}>Forcibly Displaced</div>
              <p className={`text-[10px] md:text-xs ${t.text.muted} mt-1`}>90% of Gaza's population</p>
            </div>
          </div>
          <div className={`mt-3 md:mt-4 pt-3 md:pt-4 border-t border-[#ed3039]/30 text-center`}>
            <p className={`text-xs md:text-sm ${t.text.body} font-medium`}>
              Genocide destroys both people and their heritage. This page documents the cultural erasure.
            </p>
          </div>
        </div>

        {/* Hero statistic - Years of history */}
        <div className="bg-gradient-to-br from-[#009639]/10 to-[#009639]/5 border-2 border-[#009639] rounded-lg p-3 md:p-6 mb-4 md:mb-6 text-center">
          <div className="text-4xl md:text-6xl font-bold text-[#ed3039] mb-1.5 md:mb-2">
            {stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) / 10}k` : "—"}
          </div>
          <div className={`text-base md:text-xl font-semibold ${t.text.heading} mb-1`}>
            Years of Human History
          </div>
          <p className={`text-[10px] md:text-sm ${t.text.body} max-w-2xl mx-auto`}>
            Gaza's heritage spans over {stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) * 100}` : '5,000'} years—Bronze Age to Ottoman. Irreplaceable losses.
          </p>
        </div>

        {/* Key impact metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          {/* Sites over 1000 years old */}
          <div className={`${t.bg.tertiary} border-2 ${t.border.subtle} rounded-lg p-3 md:p-4`}>
            <div className="text-2xl md:text-3xl font-bold text-[#009639] mb-1">{stats.ancientSites}</div>
            <div className={`text-[10px] md:text-xs font-semibold ${t.text.heading} mb-1.5 md:mb-2`}>
              Sites Over 1,000 Years Old
            </div>
            {isDesktop && (
              <p className={`text-[10px] ${t.text.muted} leading-relaxed`}>
                Survived centuries—destroyed in months.
              </p>
            )}
          </div>

          {/* Religious sites */}
          <div className={`${isDark ? "bg-red-900/20" : "bg-red-50"} border-2 border-[#ed3039] rounded-lg p-3 md:p-4`}>
            <div className="text-2xl md:text-3xl font-bold text-[#ed3039] mb-1">
              {stats.religiousDestroyed}/{stats.religiousSites}
            </div>
            <div className={`text-[10px] md:text-xs font-semibold ${t.text.heading} mb-1.5 md:mb-2`}>
              Houses of Worship Destroyed
            </div>
            {isDesktop && (
              <p className={`text-[10px] ${t.text.muted} leading-relaxed`}>
                Active mosques and churches serving communities.
              </p>
            )}
          </div>

          {/* Museums */}
          <div className={`${isDark ? "bg-orange-900/20" : "bg-orange-50"} border-2 border-orange-400 rounded-lg p-3 md:p-4`}>
            <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">
              {stats.museumsDestroyed}/{stats.museums}
            </div>
            <div className={`text-[10px] md:text-xs font-semibold ${t.text.heading} mb-1.5 md:mb-2`}>
              Museums & Cultural Centers
            </div>
            {isDesktop && (
              <p className={`text-[10px] ${t.text.muted} leading-relaxed`}>
                Rare artifacts, libraries, and centuries of archives.
              </p>
            )}
          </div>
        </div>

        {/* What Was Lost - Key Examples */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-base md:text-lg font-bold ${t.text.heading} mb-2 md:mb-3`}>Notable Losses</h2>
          <div className="space-y-2 md:space-y-3">
            {/* Great Omari Mosque */}
            <div className={`border-l-4 border-[#ed3039] ${t.bg.tertiary} p-2 md:p-3 rounded-r-lg`}>
              <h3 className={`text-xs md:text-sm font-bold ${t.text.heading} mb-0.5`}>Great Omari Mosque</h3>
              <p className={`text-[10px] md:text-xs ${t.text.body}`}>
                <strong>1,400 years old</strong> • 62 rare manuscripts destroyed
              </p>
            </div>

            {/* Al-Israa University Museum */}
            {isDesktop && (
            <div className={`border-l-4 border-[#ed3039] ${t.bg.tertiary} p-3 rounded-r-lg`}>
              <h3 className={`text-sm font-bold ${t.text.heading} mb-0.5`}>Al-Israa University Museum</h3>
              <p className={`text-xs ${t.text.body}`}>
                3,000+ artifacts looted • Building demolished with explosives
              </p>
            </div>
            )}
          </div>
        </section>


        {/* Comparative Scale - If This Were Your City */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-base md:text-lg font-bold ${t.text.heading} mb-2 md:mb-3`}>If This Were Your City</h2>
          <p className={`text-xs md:text-sm ${t.text.body} mb-3`}>
            Gaza's heritage destruction, proportionally applied to other cities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
              <h3 className={`text-xs md:text-sm font-bold ${t.text.heading} mb-2`}>Rome</h3>
              <p className={`text-[10px] md:text-xs ${t.text.body} mb-2`}>
                The Pantheon, Colosseum, and 8 medieval churches—destroyed in 14 months.
              </p>
              <p className={`text-[10px] ${t.text.muted} italic`}>
                Equivalent to Gaza's losses
              </p>
            </div>
            <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
              <h3 className={`text-xs md:text-sm font-bold ${t.text.heading} mb-2`}>Paris</h3>
              <p className={`text-[10px] md:text-xs ${t.text.body} mb-2`}>
                Notre-Dame, Sainte-Chapelle, The Louvre, and 12 historic churches—leveled.
              </p>
              <p className={`text-[10px] ${t.text.muted} italic`}>
                Equivalent to Gaza's losses
              </p>
            </div>
            <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
              <h3 className={`text-xs md:text-sm font-bold ${t.text.heading} mb-2`}>New York</h3>
              <p className={`text-[10px] md:text-xs ${t.text.body} mb-2`}>
                St. Patrick's Cathedral, Trinity Church, The Met, MoMA, and colonial-era sites—erased.
              </p>
              <p className={`text-[10px] ${t.text.muted} italic`}>
                Equivalent to Gaza's losses
              </p>
            </div>
          </div>
        </section>

        {/* Legal Context */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-base md:text-lg font-bold ${t.text.heading} mb-2 md:mb-3`}>Legal Framework</h2>
          <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3 md:p-4 space-y-1.5 md:space-y-2 text-[10px] md:text-xs ${t.text.body}`}>
            <p>
              <strong>1954 Hague Convention:</strong> Prohibits targeting cultural heritage during
              armed conflict. Cultural property must be protected and preserved.
            </p>
            <p>
              <strong>Rome Statute Article 8(2)(b)(ix):</strong> Intentionally directing attacks
              against buildings dedicated to religion, education, art, science, or historic
              monuments constitutes a <strong>war crime</strong>.
            </p>
            <p>
              <strong>UN Genocide Convention Article II:</strong> Genocide includes acts committed
              with intent to destroy, in whole or in part, a national, ethnical, racial or religious
              group—including destruction of their cultural heritage.
            </p>
            {isDesktop && (
              <p>
                <strong>UNESCO Enhanced Protection:</strong> Saint Hilarion Monastery was granted the
                highest level of immunity in December 2023, then designated World Heritage in Danger
                in July 2024—yet sustained damage to surrounding infrastructure.
              </p>
            )}
          </div>
        </section>

        {/* Footer */}
        <div className={`text-center text-[10px] ${t.text.subtle} pt-4 border-t ${t.border.default}`}>
          <p>
            All data verified by UNESCO, Forensic Architecture, and Heritage for Peace • Last
            updated {LAST_UPDATED}
          </p>
          <p className={`mt-2 ${t.text.muted} font-medium`}>
            "The deliberate destruction of cultural heritage is an attack on humanity itself." —
            UNESCO
          </p>
        </div>
      </div>
    </div>
  );
}
