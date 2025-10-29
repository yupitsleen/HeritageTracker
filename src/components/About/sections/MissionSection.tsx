import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * MissionSection - Project mission statement
 */
export function MissionSection() {
  const t = useThemeClasses();

  return (
    <section className="mb-4 md:mb-6">
      <h2 className={`text-base md:text-lg font-bold ${t.text.heading} mb-2 md:mb-3`}>Understanding Genocide</h2>

      <p className={`text-xs md:text-sm ${t.text.body} leading-relaxed mb-2 md:mb-3`}>
        Genocide is not only the mass killing of a people—it is the systematic eradication of their
        existence from history. The 1948 UN Genocide Convention explicitly recognizes that destroying
        a group's cultural and religious heritage constitutes genocide. When you destroy a people's
        mosques, churches, museums, libraries, and ancient sites, you attempt to erase proof they ever existed.
      </p>

      <p className={`text-xs md:text-sm ${t.text.body} leading-relaxed mb-3 md:mb-4`}>
        Since October 2023, Gaza has witnessed both: over 45,000 Palestinians killed, with heritage
        sites systematically targeted—1,400-year-old mosques reduced to rubble, museums looted and
        demolished, libraries containing irreplaceable manuscripts burned. This is not collateral damage.
        This is the deliberate erasure of Palestinian existence from the land.
      </p>

      <div className={`${t.bg.tertiary} border-l-4 border-[#ed3039] p-2 md:p-3 rounded mb-3`}>
        <p className={`text-[10px] md:text-xs ${t.text.subheading} font-semibold mb-1`}>
          UN Genocide Convention, Article II(e):
        </p>
        <p className={`text-[10px] md:text-xs ${t.text.body} italic`}>
          Genocide includes "deliberately inflicting on the group conditions of life calculated to
          bring about its physical destruction in whole or in part" and acts committed with "intent
          to destroy, in whole or in part, a national, ethnical, racial or religious group."
        </p>
      </div>

      <h3 className={`text-sm md:text-base font-bold ${t.text.heading} mb-2`}>Our Mission</h3>
      <p className={`text-xs md:text-sm ${t.text.body} leading-relaxed mb-2 md:mb-3`}>
        Heritage Tracker documents this cultural destruction with forensic precision. We create an
        evidence-based record for international courts, historians, and humanity. Every site documented
        here is verified by UNESCO, Forensic Architecture, and Heritage for Peace. This is not activism—this
        is documentation of what international law defines as genocide.
      </p>

      <div className={`${t.bg.tertiary} border-l-4 border-[#009639] p-2 md:p-3 rounded`}>
        <p className={`text-[10px] md:text-xs ${t.text.subheading} font-medium`}>
          "The destruction of cultural heritage is tantamount to the destruction of the people
          themselves, as heritage forms an integral part of their identity and history."
          — International Criminal Court
        </p>
      </div>
    </section>
  );
}
