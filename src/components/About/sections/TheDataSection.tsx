import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * TheDataSection - Current dataset statistics (desktop only)
 */
export function TheDataSection() {
  const t = useThemeClasses();

  return (
    <section className="hidden md:block mb-8">
      <h2 className={`text-2xl font-bold ${t.text.heading} mb-4`}>The Data</h2>
      <div className={`${t.bg.tertiary} rounded-lg p-6 space-y-4`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#009639]">18</div>
            <div className={`text-sm ${t.text.muted}`}>Sites Documented</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ed3039]">10</div>
            <div className={`text-sm ${t.text.muted}`}>Completely Destroyed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ca8a04]">8</div>
            <div className={`text-sm ${t.text.muted}`}>Damaged</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${t.text.body}`}>1,700+</div>
            <div className={`text-sm ${t.text.muted}`}>Years of History</div>
          </div>
        </div>
        <p className={`text-sm ${t.text.muted} text-center mt-4`}>
          As of October 2025 • 18 of 20-25 priority sites documented
        </p>
      </div>
    </section>
  );
}
