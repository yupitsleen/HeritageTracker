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
  return (
    <div className={`border-l-4 border-[#ed3039] bg-gray-50 p-3 md:p-4 rounded-r-lg ${hideOnMobile ? "hidden md:block" : ""}`}>
      <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-xs md:text-sm text-gray-700 mb-2">
        <strong>{age}</strong>
      </p>
      <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
        {facts.map((fact, index) => (
          <li key={index} className={index > 0 ? "hidden md:list-item" : ""}>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}
