import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * MissionSection - Project mission statement
 */
export function MissionSection() {
  const t = useThemeClasses();

  return (
    <section className="mb-6 md:mb-8">
      <h2 className={`text-xl md:text-2xl font-bold ${t.text.heading} mb-3 md:mb-4`}>Mission</h2>
      <p className={`text-sm md:text-base ${t.text.body} leading-relaxed mb-3 md:mb-4`}>
        Heritage Tracker documents the systematic destruction of Palestinian cultural heritage
        sites in Gaza during the genocide, paticularly in 2023-2024 (this time range will be
        expanded. The range is only meant to limit the scope while the app's MVP is being
        developed). Our goal is to create a transparent, evidence-based record that serves
        researchers, legal advocates, journalists, educators, and the global public.
      </p>
      <div className={`${t.bg.tertiary} border-l-4 border-[#009639] p-3 md:p-4 rounded`}>
        <p className={`text-xs md:text-base ${t.text.subheading} font-medium`}>
          "Cultural heritage belongs to all of humanity. Its destruction is everyone's loss."
        </p>
      </div>
    </section>
  );
}
