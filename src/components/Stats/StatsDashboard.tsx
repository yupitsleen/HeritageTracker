import { memo } from "react";
import type { Site } from "../../types";
import { useHeritageStats } from "../../hooks/useHeritageStats";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { LAST_UPDATED, HUMAN_CASUALTIES, EXTERNAL_SOURCES, TARGETED_CASUALTIES, ESCALATION_STATISTICS } from "../../constants/statistics";

interface StatsDashboardProps {
  sites: Site[];
}

/**
 * Statistics Dashboard - conveys the scale and impact of cultural heritage destruction
 *
 * Performance optimizations:
 * - Removed resize listener (use pure CSS instead)
 * - Memoized component to prevent re-renders
 * - Added CSS containment for better scroll performance
 */
export const StatsDashboard = memo(function StatsDashboard({ sites }: StatsDashboardProps) {
  const t = useThemeClasses();
  // Calculate impactful statistics using extracted hook (already memoized)
  const stats = useHeritageStats(sites);

  return (
    <div style={{ contain: 'layout style paint' }}>
      <div className="p-3 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold mb-1.5 ${t.text.heading}`}>
            Documenting Genocide
          </h1>
          <p className={`text-sm md:text-lg ${t.text.heading}`}>
            The systematic erasure of a people and their history
          </p>
        </div>

        {/* Escalation & Acceleration - Shows systematic intensification */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${t.text.heading}`}>
            Escalation & Acceleration: From Ethnic Cleansing to Genocide
          </h2>
          <p className={`text-sm md:text-base mb-3 ${t.text.heading}`}>
            Since October 7, 2023, Israel has dramatically accelerated the pace of Palestinian deaths,
            home destruction, and cultural erasure. In just <strong>{ESCALATION_STATISTICS.timeProportion}</strong> of
            the time since the Nakba began, <strong>{ESCALATION_STATISTICS.proportions.deathsSince1948}</strong> of
            all Palestinian deaths have occurred.
          </p>

          {/* Key Acceleration Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* Deaths Per Day */}
            <div className={`${t.bg.tertiary} border-2 border-[#ed3039] rounded-lg p-3`}>
              <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                {ESCALATION_STATISTICS.deathsPerDay.accelerationFactor}x
              </div>
              <div className={`text-xs md:text-sm font-semibold mb-2 ${t.text.heading}`}>
                Faster Killing Rate
              </div>
              <div className={`text-xs space-y-1 ${t.text.heading}`}>
                <p><strong>1948-2023:</strong> {ESCALATION_STATISTICS.deathsPerDay.nakbaEra} deaths/day</p>
                <p><strong>Oct 2023-Now:</strong> {ESCALATION_STATISTICS.deathsPerDay.gazaGenocide} deaths/day</p>
              </div>
            </div>

            {/* Homes Per Year */}
            <div className={`${t.bg.tertiary} border-2 border-orange-400 rounded-lg p-3`}>
              <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.culturalNumber}`}>
                {ESCALATION_STATISTICS.homesPerYear.accelerationFactor}x
              </div>
              <div className={`text-xs md:text-sm font-semibold mb-2 ${t.text.heading}`}>
                Faster Home Destruction
              </div>
              <div className={`text-xs space-y-1 ${t.text.heading}`}>
                <p><strong>West Bank (1967-2023):</strong> {ESCALATION_STATISTICS.homesPerYear.westBank.toLocaleString()}/year</p>
                <p><strong>Gaza (2023-2025):</strong> {ESCALATION_STATISTICS.homesPerYear.gazaGenocide.toLocaleString()}/year</p>
              </div>
            </div>

            {/* Heritage Per Year */}
            <div className={`${t.stats.culturalCardBg} border-2 border-[#009639] rounded-lg p-3`}>
              <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.heritageNumber}`}>
                {ESCALATION_STATISTICS.heritageSitesPerYear.accelerationFactor}x
              </div>
              <div className={`text-xs md:text-sm font-semibold mb-2 ${t.text.heading}`}>
                Faster Heritage Erasure
              </div>
              <div className={`text-xs space-y-1 ${t.text.heading}`}>
                <p><strong>1948-2023:</strong> {ESCALATION_STATISTICS.heritageSitesPerYear.nakbaEra} sites/year</p>
                <p><strong>Oct 2023-Now:</strong> {ESCALATION_STATISTICS.heritageSitesPerYear.gazaGenocide} sites/year</p>
              </div>
            </div>
          </div>

          {/* Gaza Housing Destruction */}
          <div className={`${t.stats.destructionCardBg} border-2 border-[#ed3039] rounded-lg p-3 mb-3`}>
            <h3 className={`text-sm md:text-base font-bold mb-2 ${t.text.heading}`}>
              Housing Destruction in Gaza (Oct 2023 - Nov 2025)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div>
                <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                  {ESCALATION_STATISTICS.gazaHousing.totalHomesAffected}
                </div>
                <div className={`text-xs md:text-sm ${t.text.heading}`}>Homes Affected</div>
              </div>
              <div>
                <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                  {ESCALATION_STATISTICS.gazaHousing.destroyed}
                </div>
                <div className={`text-xs md:text-sm ${t.text.heading}`}>Destroyed</div>
              </div>
              <div>
                <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                  {ESCALATION_STATISTICS.gazaHousing.damaged}
                </div>
                <div className={`text-xs md:text-sm ${t.text.heading}`}>Damaged</div>
              </div>
              <div>
                <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                  {ESCALATION_STATISTICS.gazaHousing.percentAffected}
                </div>
                <div className={`text-xs md:text-sm ${t.text.heading}`}>Of All Housing</div>
              </div>
            </div>
          </div>

          {/* Impact Statement */}
          <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
            <p className={`text-sm md:text-base ${t.text.heading}`}>
              <strong>This isn't random escalation—it's calculated genocide at industrial scale.</strong> The data shows systematic
              intensification: 22.5x faster killing, 387x faster home destruction, 1.7x faster heritage erasure.
              For every heritage site destroyed, {ESCALATION_STATISTICS.ratios.homesPerHeritageSite.toLocaleString()} homes were leveled
              and {ESCALATION_STATISTICS.ratios.deathsPerHeritageSite.toLocaleString()} Palestinians were killed.
            </p>
          </div>

          {/* Sources */}
          <div className="mt-3 text-xs">
            <p className={`font-semibold mb-1 ${t.text.heading}`}>Sources & Documentation:</p>
            <p className={`${t.text.heading}`}>
              <strong>Data:</strong> UN OCHA, UNOSAT, Gaza Ministry of Health, UNESCO.
              See <a
                href="https://github.com/yourusername/heritage-tracker/blob/main/docs/research/ESCALATION_STATISTICS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70 transition-opacity"
              >
                full documentation
              </a> for methodology and calculations.
            </p>
          </div>
        </section>

        {/* Human Toll - Critical Context */}
        <div className={`${t.stats.destructionBg} border-2 border-[#ed3039] rounded-lg p-3 md:p-6 mb-4 md:mb-6`}>
          <div className="grid grid-cols-2 gap-4 md:gap-6 text-center">
            <div>
              <div className={`text-3xl md:text-5xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                {HUMAN_CASUALTIES.deaths}
              </div>
              <div className={`text-xs md:text-base font-semibold ${t.text.heading}`}>Palestinians Killed</div>
              <p className={`text-xs md:text-sm mt-1 ${t.text.heading}`}>
                {HUMAN_CASUALTIES.womenAndChildrenPercent} women & children
              </p>
            </div>
            <div>
              <div className={`text-3xl md:text-5xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                {HUMAN_CASUALTIES.displaced}
              </div>
              <div className={`text-xs md:text-base font-semibold ${t.text.heading}`}>Forcibly Displaced</div>
              <p className={`text-xs md:text-sm mt-1 ${t.text.heading}`}>
                {HUMAN_CASUALTIES.displacedPercent} of Gaza's population
              </p>
            </div>
          </div>
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-[#ed3039]/30 text-center">
            <p className={`text-sm md:text-base font-medium ${t.text.heading}`}>
              Genocide destroys both people and their heritage. This page documents the cultural erasure.
            </p>
          </div>
        </div>

        {/* Targeted Killings - Protected Groups Under International Law */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${t.text.heading}`}>
            Targeting Those Who Document, Heal, and Help
          </h2>
          <p className={`text-sm md:text-base mb-3 ${t.text.heading}`}>
            International law protects journalists, medical workers, and humanitarian aid workers.
            Gaza has seen unprecedented systematic targeting of all three groups.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* Journalists */}
            <div className={`${t.bg.tertiary} border-2 ${t.border.default} rounded-lg p-3`}>
              <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                {TARGETED_CASUALTIES.journalists.killed}
              </div>
              <div className={`text-xs md:text-sm font-semibold mb-2 ${t.text.heading}`}>
                Journalists Killed
              </div>
              <div className={`text-xs space-y-1 ${t.text.heading}`}>
                <p><strong>{TARGETED_CASUALTIES.journalists.directlyTargeted}</strong> directly targeted</p>
                <p><strong>{TARGETED_CASUALTIES.journalists.arrested}</strong> arrested</p>
                <p><strong>{TARGETED_CASUALTIES.journalists.missing}</strong> missing</p>
              </div>
            </div>

            {/* Aid Workers */}
            <div className={`${t.bg.tertiary} border-2 ${t.border.default} rounded-lg p-3`}>
              <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                {TARGETED_CASUALTIES.aidWorkers.killed}
              </div>
              <div className={`text-xs md:text-sm font-semibold mb-2 ${t.text.heading}`}>
                Aid Workers Killed
              </div>
              <div className={`text-xs space-y-1 ${t.text.heading}`}>
                <p><strong>{TARGETED_CASUALTIES.aidWorkers.unrwaStaff}</strong> UNRWA staff</p>
                <p><strong>{TARGETED_CASUALTIES.aidWorkers.averagePerWeek}</strong> killed per week (2025)</p>
                <p>Deadliest year on record</p>
              </div>
            </div>

            {/* Healthcare Workers */}
            <div className={`${t.bg.tertiary} border-2 ${t.border.default} rounded-lg p-3`}>
              <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.destructionNumber}`}>
                {TARGETED_CASUALTIES.healthcareWorkers.killed}
              </div>
              <div className={`text-xs md:text-sm font-semibold mb-2 ${t.text.heading}`}>
                Healthcare Workers Killed
              </div>
              <div className={`text-xs space-y-1 ${t.text.heading}`}>
                <p><strong>{TARGETED_CASUALTIES.healthcareWorkers.attacksOnHealthcare}</strong> attacks on healthcare</p>
                <p><strong>{TARGETED_CASUALTIES.healthcareWorkers.hospitalsAffected}</strong> hospitals damaged</p>
                <p><strong>{TARGETED_CASUALTIES.healthcareWorkers.detained}</strong> doctors detained</p>
              </div>
            </div>
          </div>

          {/* Historical Comparison */}
          <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3 mb-3`}>
            <h3 className={`text-sm md:text-base font-bold mb-2 ${t.text.heading}`}>
              Unprecedented in Modern Conflict
            </h3>
            <div className="space-y-2 text-xs md:text-sm">
              <div className={`${t.text.heading}`}>
                <strong>Journalists:</strong> CPJ (Committee to Protect Journalists) states this is{' '}
                <span className="font-bold">"the deadliest and most deliberate effort to kill and silence journalists that CPJ has ever documented"</span>
                {' '}since they began tracking in 1992. 75% of all journalists killed worldwide in 2023 died in Gaza.
              </div>
              <div className={`${t.text.heading}`}>
                <strong>Aid Workers:</strong> UN OCHA reports 2023 was{' '}
                <span className="font-bold">"the deadliest year on record for the global humanitarian community"</span>
                {' '}with a 137% increase from 2022. More than half of all aid workers killed globally in 2023 died in Gaza's first 3 months.
              </div>
              <div className={`${t.text.heading}`}>
                <strong>Healthcare Workers:</strong> WHO documented 735+ attacks on healthcare facilities.
                UN Human Rights experts called it{' '}
                <span className="font-bold">"relentless Israeli attacks on Gaza's healthcare system."</span>
                {' '}Multiple doctors killed with their entire families.
              </div>
            </div>
          </div>

          {/* Geneva Conventions Context */}
          <div className={`${t.stats.destructionCardBg} border-2 border-[#ed3039] rounded-lg p-3`}>
            <h3 className={`text-sm md:text-base font-bold mb-2 ${t.text.heading}`}>
              Protected Under International Law
            </h3>
            <div className="space-y-2 text-xs md:text-sm">
              <div className={`${t.text.heading}`}>
                <strong>Geneva Conventions (1949):</strong> Medical personnel, facilities, and transports
                must be protected and respected in all circumstances. Attacks on hospitals and medical
                workers are grave breaches constituting war crimes.
              </div>
              <div className={`${t.text.heading}`}>
                <strong>Additional Protocol I (1977), Article 79:</strong> Journalists engaged in dangerous
                professional missions in areas of armed conflict shall be considered as civilians and must
                be protected as such.
              </div>
              <div className={`${t.text.heading}`}>
                <strong>UN Security Council Resolution 2286 (2016):</strong> Condemns attacks on medical
                facilities and humanitarian personnel, demands all parties comply with international
                humanitarian law.
              </div>
              <div className={`${t.text.heading}`}>
                <strong>Rome Statute Article 8:</strong> Intentionally directing attacks against personnel
                involved in humanitarian assistance or peacekeeping missions constitutes a war crime.
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="mt-3 text-xs">
            <p className={`font-semibold mb-1 ${t.text.heading}`}>Sources & Verification:</p>
            <div className={`space-y-1 ${t.text.heading}`}>
              <p>
                <strong>Journalists:</strong>{' '}
                <a
                  href={TARGETED_CASUALTIES.journalists.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70 transition-opacity"
                >
                  {TARGETED_CASUALTIES.journalists.source}
                </a>
              </p>
              <p>
                <strong>Aid Workers:</strong>{' '}
                <a
                  href={TARGETED_CASUALTIES.aidWorkers.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70 transition-opacity"
                >
                  {TARGETED_CASUALTIES.aidWorkers.source}
                </a>
              </p>
              <p>
                <strong>Healthcare Workers:</strong>{' '}
                <a
                  href={TARGETED_CASUALTIES.healthcareWorkers.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70 transition-opacity"
                >
                  {TARGETED_CASUALTIES.healthcareWorkers.source}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Hero statistic - Years of history */}
        <div className="bg-gradient-to-br from-[#009639]/10 to-[#009639]/5 border-2 border-[#009639] rounded-lg p-3 md:p-6 mb-4 md:mb-6 text-center">
          <div className={`text-4xl md:text-6xl font-bold mb-1.5 md:mb-2 ${t.stats.destructionNumber}`}>
            {stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) / 10}k` : "—"}
          </div>
          <div className={`text-lg md:text-2xl font-semibold mb-1 ${t.text.heading}`}>
            Years of Human History
          </div>
          <p className={`text-xs md:text-base max-w-2xl mx-auto ${t.text.heading}`}>
            Gaza's heritage spans over {stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) * 100}` : '5,000'} years—Bronze Age to Ottoman. Irreplaceable losses.
          </p>
        </div>

        {/* Key impact metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          {/* Sites over 1000 years old */}
          <div className={`${t.bg.tertiary} border-2 ${t.border.subtle} rounded-lg p-3 md:p-4`}>
            <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.heritageNumber}`}>{stats.ancientSites}</div>
            <div className={`text-xs md:text-sm font-semibold mb-1.5 md:mb-2 ${t.text.heading}`}>
              Sites Over 1,000 Years Old
            </div>
            <p className={`hidden md:block text-xs leading-relaxed ${t.text.heading}`}>
              Survived centuries—destroyed in months.
            </p>
          </div>

          {/* Religious sites */}
          <div className={`${t.stats.destructionCardBg} border-2 border-[#ed3039] rounded-lg p-3 md:p-4`}>
            <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.destructionNumber}`}>
              {stats.religiousDestroyed}/{stats.religiousSites}
            </div>
            <div className={`text-xs md:text-sm font-semibold mb-1.5 md:mb-2 ${t.text.heading}`}>
              Houses of Worship Destroyed
            </div>
            <p className={`hidden md:block text-xs leading-relaxed ${t.text.heading}`}>
              Active mosques and churches serving communities.
            </p>
          </div>

          {/* Museums */}
          <div className={`${t.stats.culturalCardBg} border-2 border-orange-400 rounded-lg p-3 md:p-4`}>
            <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.stats.culturalNumber}`}>
              {stats.museumsDestroyed}/{stats.museums}
            </div>
            <div className={`text-xs md:text-sm font-semibold mb-1.5 md:mb-2 ${t.text.heading}`}>
              Museums & Cultural Centers
            </div>
            <p className={`hidden md:block text-xs leading-relaxed ${t.text.heading}`}>
              Rare artifacts, libraries, and centuries of archives.
            </p>
          </div>
        </div>

        {/* What Was Lost - Key Examples */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${t.text.heading}`}>Notable Losses</h2>
          <div className="space-y-2 md:space-y-3">
            {/* Great Omari Mosque */}
            <div className={`border-l-4 border-[#ed3039] ${t.bg.tertiary} p-2 md:p-3 rounded-r-lg`}>
              <h3 className={`text-sm md:text-base font-bold mb-0.5 ${t.text.heading}`}>Great Omari Mosque</h3>
              <p className={`text-xs md:text-sm ${t.text.heading}`}>
                <strong>1,400 years old</strong> • 62 rare manuscripts destroyed
              </p>
            </div>

            {/* Al-Israa University Museum */}
            <div className={`hidden md:block border-l-4 border-[#ed3039] ${t.bg.tertiary} p-3 rounded-r-lg`}>
              <h3 className={`text-base font-bold mb-0.5 ${t.text.heading}`}>Al-Israa University Museum</h3>
              <p className={`text-sm ${t.text.heading}`}>
                3,000+ artifacts looted • Building demolished with explosives
              </p>
            </div>
          </div>
        </section>

        {/* Comparative Scale - If This Were Your City */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${t.text.heading}`}>If This Were Your City</h2>
          <p className={`text-sm md:text-base mb-3 ${t.text.heading}`}>
            Gaza's heritage destruction, proportionally applied to other cities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
              <h3 className={`text-sm md:text-base font-bold mb-2 ${t.text.heading}`}>Rome</h3>
              <p className={`text-xs md:text-sm mb-2 ${t.text.heading}`}>
                The Pantheon, Colosseum, and 8 medieval churches—destroyed in 14 months.
              </p>
              <p className={`text-xs italic ${t.text.heading}`}>
                Equivalent to Gaza's losses
              </p>
            </div>
            <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
              <h3 className={`text-sm md:text-base font-bold mb-2 ${t.text.heading}`}>Paris</h3>
              <p className={`text-xs md:text-sm mb-2 ${t.text.heading}`}>
                Notre-Dame, Sainte-Chapelle, The Louvre, and 12 historic churches—leveled.
              </p>
              <p className={`text-xs italic ${t.text.heading}`}>
                Equivalent to Gaza's losses
              </p>
            </div>
            <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
              <h3 className={`text-sm md:text-base font-bold mb-2 ${t.text.heading}`}>New York</h3>
              <p className={`text-xs md:text-sm mb-2 ${t.text.heading}`}>
                St. Patrick's Cathedral, Trinity Church, The Met, MoMA, and colonial-era sites—erased.
              </p>
              <p className={`text-xs italic ${t.text.heading}`}>
                Equivalent to Gaza's losses
              </p>
            </div>
          </div>
        </section>

        {/* Legal Context */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${t.text.heading}`}>Legal Framework</h2>
          <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3 md:p-4 space-y-1.5 md:space-y-2 text-xs md:text-sm ${t.text.heading}`}>
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
            <p className="hidden md:block">
              <strong>UNESCO Enhanced Protection:</strong> Saint Hilarion Monastery was granted the
              highest level of immunity in December 2023, then designated World Heritage in Danger
              in July 2024—yet sustained damage to surrounding infrastructure.
            </p>
          </div>
        </section>

        {/* Footer with Sources */}
        <div className={`text-center text-xs pt-4 border-t ${t.border.default} ${t.text.heading}`}>
          <p className="mb-2">
            <strong>Heritage data:</strong> UNESCO, Forensic Architecture, Heritage for Peace
          </p>
          <p className="mb-2">
            <strong>Casualty data:</strong> Gaza Ministry of Health, verified by{' '}
            <a
              href={EXTERNAL_SOURCES.unOcha}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              UN OCHA
            </a>{' '}
            and{' '}
            <a
              href={EXTERNAL_SOURCES.unrwa}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              UNRWA
            </a>
          </p>
          <p className="mb-3">
            Last updated {LAST_UPDATED} • See{' '}
            <a
              href="https://github.com/yourusername/heritage-tracker/blob/main/docs/research/CASUALTY_STATISTICS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              full source documentation
            </a>
          </p>
          <p className={`font-medium ${t.text.heading}`}>
            "The deliberate destruction of cultural heritage is an attack on humanity itself." —
            UNESCO
          </p>
        </div>
      </div>
    </div>
  );
});
