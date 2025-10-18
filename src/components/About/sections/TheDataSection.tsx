import { useTheme } from "../../../contexts/ThemeContext";

/**
 * TheDataSection - Current dataset statistics (desktop only)
 */
export function TheDataSection() {
  const { isDark } = useTheme();

  return (
    <section className="hidden md:block mb-8">
      <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}>The Data</h2>
      <div className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} rounded-lg p-6 space-y-4`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#009639]">18</div>
            <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Sites Documented</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ed3039]">10</div>
            <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Completely Destroyed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ca8a04]">8</div>
            <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Damaged</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>1,700+</div>
            <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Years of History</div>
          </div>
        </div>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} text-center mt-4`}>
          As of October 2025 • 18 of 20-25 priority sites documented
        </p>
      </div>
    </section>
  );
}
