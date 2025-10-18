import type { GazaSite } from "../../types";
import { useHeritageStats } from "../../hooks/useHeritageStats";
import { useTheme } from "../../contexts/ThemeContext";

interface StatsDashboardProps {
  sites: GazaSite[];
}

/**
 * Statistics Dashboard - conveys the scale and impact of cultural heritage destruction
 */
export function StatsDashboard({ sites }: StatsDashboardProps) {
  const { isDark } = useTheme();
  // Calculate impactful statistics using extracted hook
  const stats = useHeritageStats(sites);

  return (
    <div className={`max-h-[80vh] overflow-y-auto ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className={`text-2xl md:text-4xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
            The Scale of Destruction
          </h1>
          <p className={`text-sm md:text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Understanding what has been lost to humanity
          </p>
        </div>

        {/* Hero statistic - Years of history */}
        <div className="bg-gradient-to-br from-[#009639]/10 to-[#009639]/5 border-2 border-[#009639] rounded-lg p-4 md:p-8 mb-6 md:mb-8 text-center">
          <div className="text-5xl md:text-7xl font-bold text-[#ed3039] mb-2 md:mb-3">
            {stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) / 10}k` : "5.3k"}
          </div>
          <div className={`text-lg md:text-2xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1 md:mb-2`}>
            Years of Human History
          </div>
          <p className={`text-xs md:text-base ${isDark ? "text-gray-300" : "text-gray-700"} max-w-2xl mx-auto`}>
            From Bronze Age Egyptian settlements to Ottoman architecture, Gaza's heritage spans
            over 5,300 years of continuous civilization. Every destroyed site is an irreplaceable
            loss to humanity.
          </p>
        </div>

        {/* Key impact metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Sites over 1000 years old */}
          <div className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} border-2 ${isDark ? "border-gray-600" : "border-gray-300"} rounded-lg p-4 md:p-6`}>
            <div className="text-3xl md:text-4xl font-bold text-[#009639] mb-1 md:mb-2">{stats.ancientSites}</div>
            <div className={`text-xs md:text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2 md:mb-3`}>
              Sites Over 1,000 Years Old
            </div>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} leading-relaxed hidden md:block`}>
              Ancient mosques, churches, and archaeological sites that survived centuries of
              history—destroyed in months.
            </p>
          </div>

          {/* Religious sites */}
          <div className={`${isDark ? "bg-red-900/20" : "bg-red-50"} border-2 border-[#ed3039] rounded-lg p-4 md:p-6`}>
            <div className="text-3xl md:text-4xl font-bold text-[#ed3039] mb-1 md:mb-2">
              {stats.religiousDestroyed}/{stats.religiousSites}
            </div>
            <div className={`text-xs md:text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2 md:mb-3`}>
              Houses of Worship Destroyed
            </div>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} leading-relaxed hidden md:block`}>
              Active mosques and churches serving Muslim and Christian communities, including
              pilgrimage sites with tombs of revered figures.
            </p>
          </div>

          {/* Museums */}
          <div className={`${isDark ? "bg-orange-900/20" : "bg-orange-50"} border-2 border-orange-400 rounded-lg p-4 md:p-6`}>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1 md:mb-2">
              {stats.museumsDestroyed}/{stats.museums}
            </div>
            <div className={`text-xs md:text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2 md:mb-3`}>
              Museums & Cultural Centers
            </div>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} leading-relaxed hidden md:block`}>
              Including 3,000+ looted artifacts, tens of thousands of books burned, and 150 years
              of archives deliberately destroyed.
            </p>
          </div>
        </div>

        {/* What Was Lost - Specific Examples - Desktop only, mobile shows 1 example */}
        <section className="mb-6 md:mb-8">
          <h2 className={`text-xl md:text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-3 md:mb-4`}>What Humanity Has Lost</h2>
          <div className="space-y-3 md:space-y-4">
            {/* Great Omari Mosque */}
            <div className={`border-l-4 border-[#ed3039] ${isDark ? "bg-gray-700/50" : "bg-gray-50"} p-3 md:p-4 rounded-r-lg`}>
              <h3 className={`text-sm md:text-base font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1`}>Great Omari Mosque</h3>
              <p className={`text-xs md:text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>1,400 years old</strong> • Gaza's oldest and largest mosque
              </p>
              <ul className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} space-y-1 list-disc list-inside`}>
                <li>
                  <strong>62 rare manuscripts destroyed</strong> including handwritten Qurans and
                  Islamic scholarly texts
                </li>
                <li className="hidden md:list-item">
                  Continuous religious heritage from Byzantine, Islamic, Crusader, Mamluk, and
                  Ottoman periods
                </li>
                <li className="hidden md:list-item">Architectural masterpiece blending multiple historical eras</li>
              </ul>
            </div>

            {/* Byzantine Church Jabaliya - Desktop only */}
            <div className={`hidden md:block border-l-4 border-[#ed3039] ${isDark ? "bg-gray-700/50" : "bg-gray-50"} p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1`}>Byzantine Church of Jabaliya</h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>1,580 years old (444 CE)</strong> • Just restored in January 2022
              </p>
              <ul className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} space-y-1 list-disc list-inside`}>
                <li>
                  <strong>400 square meters of Byzantine mosaics</strong> depicting animals,
                  hunting scenes
                </li>
                <li>16 religious texts in ancient Greek adorning the walls</li>
                <li>Completely destroyed 10 months after reopening to the public</li>
              </ul>
            </div>

            {/* Ard-al-Moharbeen Cemetery - Desktop only */}
            <div className={`hidden md:block border-l-4 border-[#ed3039] ${isDark ? "bg-gray-700/50" : "bg-gray-50"} p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1`}>
                Ard-al-Moharbeen Roman Cemetery
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>2,000+ years old</strong> • Discovered Feb 2022, destroyed Oct 2023
              </p>
              <ul className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} space-y-1 list-disc list-inside`}>
                <li>
                  <strong>125+ Roman tombs</strong> from 1st century BCE to 2nd century CE
                </li>
                <li>
                  Two rare lead sarcophagi with intricate carvings (grape harvest motifs, dolphins)
                </li>
                <li>
                  Destroyed <strong>one day</strong> after the conflict began—before excavation was
                  complete
                </li>
              </ul>
            </div>

            {/* Al-Israa University Museum - Desktop only */}
            <div className={`hidden md:block border-l-4 border-[#ed3039] ${isDark ? "bg-gray-700/50" : "bg-gray-50"} p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1`}>Al-Israa University Museum</h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>Last remaining university</strong> in Gaza when destroyed
              </p>
              <ul className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} space-y-1 list-disc list-inside`}>
                <li>
                  <strong>3,000+ rare artifacts looted</strong> by occupying forces before
                  demolition
                </li>
                <li>Building demolished with explosives after 70 days of occupation</li>
                <li>
                  "Deliberate act aimed at erasing Palestinian cultural memory" — University VP
                </li>
              </ul>
            </div>

            {/* Central Archives - Desktop only */}
            <div className={`hidden md:block border-l-4 border-[#ed3039] ${isDark ? "bg-gray-700/50" : "bg-gray-50"} p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1`}>Central Archives of Gaza City</h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>150 years of Palestinian records</strong> • Deliberately burned
              </p>
              <ul className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} space-y-1 list-disc list-inside`}>
                <li>
                  Urban development plans, property records, documents on historic buildings
                </li>
                <li>Handwritten materials from well-known national figures</li>
                <li>
                  UN investigation: <strong>"Interior likely set ablaze"</strong> by Israeli forces
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Looted Artifacts */}
        <section className="mb-6 md:mb-8">
          <h2 className={`text-xl md:text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-3 md:mb-4`}>Looted Artifacts</h2>
          <p className={`text-xs md:text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-3 md:mb-4`}>
            Beyond destruction, deliberate looting of cultural artifacts during occupation represents
            systematic erasure of Palestinian heritage and violations of international law.
          </p>

          {/* Looted artifacts stat */}
          <div className={`${isDark ? "bg-purple-900/20" : "bg-purple-50"} border-2 border-purple-600 rounded-lg p-4 md:p-6 mb-4`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-1">3,000+</div>
                <div className={`text-xs md:text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  Artifacts Looted
                </div>
              </div>
              <div className={`flex-1 text-xs md:text-sm ${isDark ? "text-gray-300" : "text-gray-700"} space-y-2`}>
                <p>
                  <strong>Site:</strong> Al-Israa University Museum
                </p>
                <p>
                  <strong>Taken by:</strong> Israeli forces during 70-day occupation (Oct 2023 - Jan 2024)
                </p>
                <p>
                  <strong>Current location:</strong> Unknown
                </p>
                <p>
                  <strong>Status:</strong> Building demolished with explosives on January 17, 2024
                </p>
              </div>
            </div>
          </div>

          {/* Legal context */}
          <div className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} border-l-4 border-purple-600 p-3 md:p-4 rounded-r-lg`}>
            <p className={`text-xs md:text-sm ${isDark ? "text-gray-200" : "text-gray-800"} mb-2`}>
              <strong>International Law:</strong>
            </p>
            <ul className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"} space-y-1 list-disc list-inside`}>
              <li>
                <strong>1954 Hague Convention Article 4:</strong> Prohibits theft, pillage, or
                misappropriation of cultural property during armed conflict
              </li>
              <li>
                <strong>Rome Statute Article 8(2)(b)(xvi):</strong> Pillaging constitutes a war crime
              </li>
              <li className="hidden md:list-item">
                University VP Ahmed Alhussaina: "Deliberate act aimed at erasing Palestinian cultural
                memory and archaeological heritage"
              </li>
            </ul>
          </div>

          {/* Note for future expansion */}
          <div className={`mt-4 p-3 ${isDark ? "bg-yellow-900/20" : "bg-yellow-50"} border ${isDark ? "border-yellow-700" : "border-yellow-300"} rounded text-xs ${isDark ? "text-gray-400" : "text-gray-600"} hidden md:block`}>
            <p>
              <strong>Note:</strong> This data represents documented cases from verified sources.
              Additional looting incidents may exist but lack sufficient verification for inclusion.
              Research is ongoing to document the full scope of artifact theft and current whereabouts.
            </p>
          </div>
        </section>

        {/* Lost Knowledge - Unsolved Mysteries - Desktop only */}
        <section className="hidden md:block mb-8">
          <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}>Lost Forever: Unsolved Mysteries</h2>
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"} mb-4`}>
            These sites held answers to questions we were still asking. Research that was underway,
            excavations not yet complete, artifacts not yet catalogued—all destroyed before we could
            learn their secrets.
          </p>
          <div className="space-y-4">
            <div className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} border-l-4 border-[#ca8a04] p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2 flex items-center gap-2`}>
                <span className="text-[#ca8a04]">?</span>
                Ard-al-Moharbeen Cemetery - Unfinished Excavation
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>Discovered:</strong> February 2022 • <strong>Destroyed:</strong> October 8,
                2023 (1 day after conflict began)
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}>
                Archaeologists had only excavated 125 tombs from an estimated area of 4,000 square
                meters when the site was destroyed. The full extent of the necropolis, its
                connection to ancient Gaza's role as a Roman port city, and countless artifacts
                still buried underground will never be known.
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} italic`}>
                Questions we'll never answer: How large was the full cemetery? What else was buried
                there? What can the remaining tombs tell us about Roman burial practices in the
                Levant?
              </p>
            </div>

            <div className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} border-l-4 border-[#ca8a04] p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2 flex items-center gap-2`}>
                <span className="text-[#ca8a04]">?</span>
                Byzantine Church of Jabaliya - Mosaics Beneath Debris
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>Restored and reopened:</strong> January 2022 • <strong>Destroyed:</strong>{" "}
                November 2023 (10 months later)
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}>
                The church's 400 square meters of 5th-century mosaics depicting animals and hunting
                scenes were among the finest Byzantine art in Gaza. While archaeologist Fadel Al
                Utol reported in 2025 that the mosaics might be intact beneath rubble, accessing and
                preserving them is now impossible. The 16 ancient Greek religious texts on the walls
                are likely lost forever.
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} italic`}>
                Questions we'll never answer: What did the complete Greek inscriptions say? What
                other mosaics remain undiscovered? What can these artworks teach us about early
                Christian communities in Palestine?
              </p>
            </div>

            <div className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} border-l-4 border-[#ca8a04] p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2 flex items-center gap-2`}>
                <span className="text-[#ca8a04]">?</span>
                Tell es-Sakan - The Oldest Egyptian Colony
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>Age:</strong> 5,300 years old (3300 BCE) • <strong>Status:</strong> Damaged
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}>
                The largest archaeological site in Gaza, Tell es-Sakan contains exceptionally
                well-preserved Early Bronze Age mud-brick architecture. It represents the earliest
                phase of Egyptian expansion into the Levant, but most of the 12-20 acre site remains
                unexcavated. Damage to the site means we may never understand the full story of
                Egyptian-Canaanite relations 5,000 years ago.
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} italic`}>
                Questions we'll never answer: Why was this Egyptian colony abandoned and
                reoccupied? What trade routes connected it to Egypt? What daily life artifacts lie
                beneath the sand?
              </p>
            </div>

            <div className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} border-l-4 border-[#ca8a04] p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2 flex items-center gap-2`}>
                <span className="text-[#ca8a04]">?</span>
                Al-Israa University Museum - 3,000+ Looted Artifacts
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>Looted:</strong> During 70-day occupation • <strong>Whereabouts:</strong>{" "}
                Unknown
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}>
                More than 3,000 rare archaeological artifacts spanning Gaza's entire history were
                looted by occupying forces before the university was demolished. Without
                documentation of what was taken or where these artifacts are now, an entire museum
                collection—representing decades of archaeological work—has vanished.
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} italic`}>
                Questions we'll never answer: Where are these artifacts now? What did they tell us
                about Gaza's history? What research was being conducted on these objects?
              </p>
            </div>

            <div className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} border-l-4 border-[#ca8a04] p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2 flex items-center gap-2`}>
                <span className="text-[#ca8a04]">?</span>
                Central Archives - 150 Years of Records Burned
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>Destroyed:</strong> November 29, 2023 • <strong>UN finding:</strong>{" "}
                "Interior likely set ablaze"
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}>
                Property records, urban planning documents, handwritten materials from national
                figures, and administrative records documenting 150 years of Palestinian life—all
                burned. This wasn't collateral damage; it was systematic erasure of institutional
                memory and historical documentation.
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} italic`}>
                Questions we'll never answer: Who owned what property? How did Gaza develop over
                150 years? What did these historical figures write in their own words?
              </p>
            </div>
          </div>
        </section>

        {/* What Remains - Hope and Urgency - Desktop only */}
        <section className="hidden md:block mb-8">
          <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}>What Remains: Still at Risk</h2>
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"} mb-4`}>
            Of the {stats.total} documented sites, {stats.surviving} are damaged but still standing.
            These sites represent our last chance to preserve what remains of Gaza's heritage—but
            they remain vulnerable and in urgent need of protection.
          </p>

          {/* Survival stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`${isDark ? "bg-yellow-900/20" : "bg-yellow-50"} border-2 border-[#ca8a04] rounded-lg p-4 text-center`}>
              <div className="text-3xl font-bold text-[#ca8a04] mb-1">
                {stats.surviving}/{stats.total}
              </div>
              <div className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Sites Still Standing
              </div>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Damaged or heavily damaged, but not completely destroyed
              </p>
            </div>

            <div className={`${isDark ? "bg-blue-900/20" : "bg-blue-50"} border-2 border-blue-500 rounded-lg p-4 text-center`}>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.religiousSurviving}/{stats.religiousSites}
              </div>
              <div className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Houses of Worship Remain
              </div>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Mosques and churches that can potentially be restored
              </p>
            </div>

            <div className={`${isDark ? "bg-green-900/20" : "bg-green-50"} border-2 border-[#009639] rounded-lg p-4 text-center`}>
              <div className="text-3xl font-bold text-[#009639] mb-1">
                {stats.archaeologicalSurviving}/{stats.archaeological}
              </div>
              <div className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Archaeological Sites
              </div>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Ancient sites with potential for future excavation
              </p>
            </div>
          </div>

          {/* Specific surviving sites */}
          <div className="space-y-3">
            <div className={`${isDark ? "bg-blue-900/20" : "bg-blue-50"} border-l-4 border-blue-500 p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1`}>
                Saint Hilarion Monastery (Damaged)
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>1,700 years old</strong> • UNESCO World Heritage in Danger (July 2024)
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Granted the highest level of immunity by UNESCO in December 2023, this 4th-century
                monastery sustained damage to surrounding infrastructure. The Byzantine mosaics and
                architectural remains are still accessible and could be preserved with immediate
                international protection.
              </p>
            </div>

            <div className={`${isDark ? "bg-blue-900/20" : "bg-blue-50"} border-l-4 border-blue-500 p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1`}>
                Church of St. Porphyrius (Heavily Damaged)
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>1,600 years old</strong> • Third-oldest church in the world still in use
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Despite heavy damage from October 2023 airstrikes, the church structure partially
                survives. It contains the tomb of Saint Porphyrius and irreplaceable Byzantine-era
                mosaics and artifacts. Immediate stabilization could prevent further deterioration.
              </p>
            </div>

            <div className={`${isDark ? "bg-blue-900/20" : "bg-blue-50"} border-l-4 border-blue-500 p-4 rounded-r-lg`}>
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1`}>Tell el-Ajjul (Damaged)</h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                <strong>4,000 years old</strong> • Bronze Age settlement with gold treasures
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Site of one of the greatest Bronze Age finds in the Levant—three hoards of gold
                jewelry discovered by Sir Flinders Petrie in the 1930s. Despite damage, much of the
                site remains unexcavated. With protection, it could still yield invaluable insights
                into Bronze Age trade and craftsmanship.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-[#009639]/10 border-2 border-[#009639] rounded-lg p-6 mt-6">
            <p className={`${isDark ? "text-gray-200" : "text-gray-800"} font-semibold mb-2`}>Why This Matters Now:</p>
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-3`}>
              These surviving sites represent the last fragments of Gaza's 5,300-year cultural
              heritage. Without immediate international intervention—ceasefire, protective measures,
              and documentation—they risk the same fate as the 10 sites already completely
              destroyed.
            </p>
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Under the 1954 Hague Convention and UNESCO Enhanced Protection protocols, these sites
              must be shielded from further harm. Every day of delay increases the risk of
              irreversible loss.
            </p>
          </div>
        </section>

        {/* Comparison Context - Desktop only */}
        <section className="hidden md:block mb-8">
          <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}>Putting It in Perspective</h2>
          <div className="bg-[#009639]/10 border-l-4 border-[#009639] rounded-lg p-6 space-y-4">
            <p className={`${isDark ? "text-gray-200" : "text-gray-800"}`}>
              <strong>If this scale of destruction happened in another city:</strong>
            </p>
            <ul className={`space-y-3 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <li className="flex items-start gap-2">
                <span className="text-[#ed3039] font-bold">→</span>
                <span>
                  In <strong>Rome</strong>: Destroying the Pantheon, the Colosseum, and burning the
                  Vatican Archives
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ed3039] font-bold">→</span>
                <span>
                  In <strong>Jerusalem</strong>: Demolishing the Western Wall, Church of the Holy
                  Sepulchre, and Al-Aqsa Mosque
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ed3039] font-bold">→</span>
                <span>
                  In <strong>Athens</strong>: Destroying the Parthenon, ancient Agora, and the
                  National Archaeological Museum's collections
                </span>
              </li>
            </ul>
            <p className={`${isDark ? "text-gray-200" : "text-gray-800"} pt-3 font-semibold`}>
              These 18 sites are just the beginning—UNESCO has verified damage to 110+ cultural
              sites in Gaza. The full scale of loss may never be fully documented.
            </p>
          </div>
        </section>

        {/* Legal Context */}
        <section className="mb-6 md:mb-8">
          <h2 className={`text-xl md:text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-3 md:mb-4`}>Legal Framework</h2>
          <div className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} border ${isDark ? "border-gray-700" : "border-gray-200"} rounded-lg p-4 md:p-6 space-y-2 md:space-y-3 text-xs md:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <p>
              <strong>1954 Hague Convention:</strong> Prohibits targeting cultural heritage during
              armed conflict. Cultural property must be protected and preserved.
            </p>
            <p>
              <strong>Rome Statute Article 8(2)(b)(ix):</strong> Intentionally directing attacks
              against buildings dedicated to religion, education, art, science, or historic
              monuments constitutes a <strong>war crime</strong>.
            </p>
            <p className="hidden md:block">
              <strong>UNESCO Enhanced Protection:</strong> Saint Hilarion Monastery was granted the
              highest level of immunity in December 2023, then designated World Heritage in Danger
              in July 2024—yet sustained damage to surrounding infrastructure.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className={`text-center text-xs ${isDark ? "text-gray-500" : "text-gray-500"} pt-6 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <p>
            All data verified by UNESCO, Forensic Architecture, and Heritage for Peace • Last
            updated October 2025
          </p>
          <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"} font-medium`}>
            "The deliberate destruction of cultural heritage is an attack on humanity itself." —
            UNESCO
          </p>
        </div>
      </div>
    </div>
  );
}
