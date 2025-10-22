import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * MissionSection - Project mission statement
 */
export function MissionSection() {
  const t = useThemeClasses();

  return (
    <section className="mb-4 md:mb-6">
      <h2 className={`text-base md:text-lg font-bold ${t.text.heading} mb-2 md:mb-3`}>Mission</h2>
      <p className={`text-xs md:text-sm ${t.text.body} leading-relaxed mb-2 md:mb-3`}>
        Heritage Tracker documents Palestinian cultural heritage destruction in Gaza (2023-2024).
        We create an evidence-based record for researchers, legal advocates, journalists, and the public.
      </p>
      <div className={`${t.bg.tertiary} border-l-4 border-[#009639] p-2 md:p-3 rounded`}>
        <p className={`text-[10px] md:text-xs ${t.text.subheading} font-medium`}>
          "Cultural heritage belongs to all of humanity. Its destruction is everyone's loss."
        </p>
      </div>
    </section>
  );
}
