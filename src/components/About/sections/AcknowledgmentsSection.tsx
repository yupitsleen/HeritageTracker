import { useTheme } from "../../../contexts/ThemeContext";

/**
 * AcknowledgmentsSection - Credits to organizations and researchers (desktop only)
 */
export function AcknowledgmentsSection() {
  const { isDark } = useTheme();

  return (
    <section className="hidden md:block mb-6">
      <h2 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Acknowledgments</h2>
      <p className={`text-sm leading-relaxed ${isDark ? "text-white" : "text-gray-900"}`}>
        This project builds on work by UNESCO, Forensic Architecture, Heritage for Peace, Palestinian Museum, Institute for Palestine Studies, ICOM, and countless researchers and community members dedicated to documenting Palestinian cultural heritage.
      </p>
    </section>
  );
}
