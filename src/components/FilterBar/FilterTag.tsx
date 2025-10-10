import { components, cn } from "../../styles/theme";

interface FilterTagProps {
  label: string;
  onRemove: () => void;
  ariaLabel: string;
}

/**
 * Removable filter tag/chip component
 * Used to display active filters with remove button
 */
export function FilterTag({ label, onRemove, ariaLabel }: FilterTagProps) {
  return (
    <span className={cn(components.tag.base, components.tag.default)}>
      {label}
      <button
        onClick={onRemove}
        className={components.tag.removeButton}
        aria-label={ariaLabel}
      >
        ×
      </button>
    </span>
  );
}
