import { useThemeClasses } from "../../hooks/useThemeClasses";

interface StatCardProps {
  value: string | number;
  title: string;
  description?: string;
  variant?: "green" | "red" | "orange" | "yellow" | "blue" | "purple" | "gray";
}

/**
 * Reusable stat card with color variant support
 * Used for displaying key metrics in a grid layout
 */
export function StatCard({ value, title, description, variant = "gray" }: StatCardProps) {
  const t = useThemeClasses();
  const variantStyles = {
    green: {
      bg: "",
      border: "border-[#009639]",
      text: "text-[#009639]",
    },
    red: {
      bg: "",
      border: "border-[#ed3039]",
      text: "text-[#ed3039]",
    },
    orange: {
      bg: "",
      border: "border-orange-400",
      text: "text-orange-600",
    },
    yellow: {
      bg: "",
      border: "border-[#ca8a04]",
      text: "text-[#ca8a04]",
    },
    blue: {
      bg: "",
      border: "border-blue-500",
      text: "text-blue-600",
    },
    purple: {
      bg: "",
      border: "border-purple-600",
      text: "text-purple-600",
    },
    gray: {
      bg: "",
      border: "border-gray-300",
      text: "text-[#009639]",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} border-2 ${styles.border} rounded-lg p-4 md:p-6 text-center`}>
      <div className={`text-3xl md:text-4xl font-bold ${styles.text} mb-1 md:mb-2`}>
        {value}
      </div>
      <div className={`text-xs md:text-sm font-semibold ${t.text.heading} mb-2 md:mb-3`}>
        {title}
      </div>
      {description && (
        <p className={`text-xs ${t.text.muted} leading-relaxed hidden md:block`}>
          {description}
        </p>
      )}
    </div>
  );
}
