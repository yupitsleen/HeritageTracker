import { useThemeClasses } from "../../hooks/useThemeClasses";

interface SiteLossExampleProps {
  name: string;
  age: string;
  facts: string[];
  hideOnMobile?: boolean;
}

/**
 * Card displaying specific heritage loss example
 * Shows site name, age, and key facts as bullet points
 */
export function SiteLossExample({ name, age, facts, hideOnMobile = false }: SiteLossExampleProps) {
  const t = useThemeClasses();

  return (
    <div className={`border-l-4 border-[#ed3039] p-3 md:p-4 rounded-r-lg ${hideOnMobile ? "hidden md:block" : ""}`}>
      <h3 className={`text-sm md:text-base font-bold ${t.text.heading} mb-1`}>{name}</h3>
      <p className={`text-xs md:text-sm ${t.text.body} mb-2`}>
        <strong>{age}</strong>
      </p>
      <ul className={`text-xs ${t.text.muted} space-y-1 list-disc list-inside`}>
        {facts.map((fact, index) => (
          <li key={index} className={index > 0 ? "hidden md:list-item" : ""}>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}
