import { useThemeClasses } from "../../hooks/useThemeClasses";

interface HeroStatisticProps {
  value: string | number;
  title: string;
  description: string;
}

/**
 * Large hero-style statistic card with gradient background
 * Used for impactful primary metrics
 */
export function HeroStatistic({ value, title, description }: HeroStatisticProps) {
  const t = useThemeClasses();

  return (
    <div className="bg-gradient-to-br from-[#009639]/10 to-[#009639]/5 border-2 border-[#009639] rounded-lg p-4 md:p-8 text-center">
      <div className={`text-5xl md:text-7xl font-bold ${t.stats.destructionNumber} mb-2 md:mb-3`}>
        {value}
      </div>
      <div className={`text-lg md:text-2xl font-semibold ${t.text.heading} mb-1 md:mb-2`}>
        {title}
      </div>
      <p className={`text-xs md:text-base ${t.text.body} max-w-2xl mx-auto`}>
        {description}
      </p>
    </div>
  );
}
