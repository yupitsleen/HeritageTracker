/**
 * MissionSection - Project mission statement
 */
export function MissionSection() {
  return (
    <section className="mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Mission</h2>
      <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
        Heritage Tracker documents the systematic destruction of Palestinian cultural heritage
        sites in Gaza during the genocide, paticularly in 2023-2024 (this time range will be
        expanded. The range is only meant to limit the scope while the app's MVP is being
        developed). Our goal is to create a transparent, evidence-based record that serves
        researchers, legal advocates, journalists, educators, and the global public.
      </p>
      <div className="bg-gray-50 border-l-4 border-[#009639] p-3 md:p-4 rounded">
        <p className="text-xs md:text-base text-gray-800 font-medium">
          "Cultural heritage belongs to all of humanity. Its destruction is everyone's loss."
        </p>
      </div>
    </section>
  );
}
