import { useMemo, useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { cn } from "../../styles/theme";
import { Z_INDEX } from "../../constants/layout";
import { COLORS } from "../../config/colorThemes";
import type { WaybackRelease } from "../../services/waybackService";

interface ReleaseDatePickerProps {
  releases: WaybackRelease[];
  /** Index of the "before" (yellow) release; hidden when comparison mode is off */
  beforeIndex?: number;
  onBeforeChange?: (index: number) => void;
  /** Index of the "after" (green) release */
  afterIndex: number;
  onAfterChange: (index: number) => void;
  /** Grayed out while the map version is synced automatically */
  disabled?: boolean;
}

/** Local YYYY-MM-DD key — release dates are calendar days, not instants. */
function dayKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseDay(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * ReleaseDatePicker - Calendar pickers for the two Wayback slider positions.
 *
 * Only days with a Wayback release are selectable; every other day is disabled
 * in the popup calendar.
 */
export function ReleaseDatePicker({
  releases,
  beforeIndex,
  onBeforeChange,
  afterIndex,
  onAfterChange,
  disabled = false,
}: ReleaseDatePickerProps) {
  const translate = useTranslation();

  // Release date -> slider index, so a clicked day maps straight back to a release
  const indexByDate = useMemo(
    () => new Map(releases.map((release, index) => [release.releaseDate, index])),
    [releases]
  );

  if (releases.length === 0) return null;

  const showBefore = beforeIndex !== undefined && onBeforeChange !== undefined;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1.5">
      {showBefore && (
        <ReleaseDateField
          label={translate("timeline.beforeImageryDate")}
          color={COLORS.FLAG_YELLOW}
          releases={releases}
          indexByDate={indexByDate}
          selectedIndex={beforeIndex}
          onChange={onBeforeChange}
          disabled={disabled}
        />
      )}
      <ReleaseDateField
        label={translate("timeline.afterImageryDate")}
        color={COLORS.FLAG_GREEN}
        releases={releases}
        indexByDate={indexByDate}
        selectedIndex={afterIndex}
        onChange={onAfterChange}
        disabled={disabled}
      />
      </div>
    </div>
  );
}

interface ReleaseDateFieldProps {
  label: string;
  color: string;
  releases: WaybackRelease[];
  indexByDate: Map<string, number>;
  selectedIndex: number;
  onChange: (index: number) => void;
  disabled: boolean;
}

function ReleaseDateField({
  label,
  color,
  releases,
  indexByDate,
  selectedIndex,
  onChange,
  disabled,
}: ReleaseDateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useThemeClasses();

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  const selectedDate = releases[selectedIndex]
    ? parseDay(releases[selectedIndex].releaseDate)
    : undefined;

  return (
    <>
      {/* Same shape/size/classes as the sidebar's date-range filter inputs, but it
          opens a calendar that can gray out days with no Wayback release. */}
      <button
        type="button"
        ref={refs.setReference}
        {...getReferenceProps()}
        disabled={disabled}
        aria-label={label}
        className={cn(
          "w-full min-w-[9rem] h-8 text-xs px-2 text-left flex items-center gap-2",
          "border rounded-sm transition-all duration-200",
          t.input.base,
          t.input.focus,
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span
          className="w-2 h-2 rounded-full flex-none"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <span className="flex-1">{releases[selectedIndex]?.releaseDate ?? label}</span>
        {/* Mirrors the calendar glyph the native date inputs render in the filters */}
        <CalendarIcon className="w-3.5 h-3.5 flex-none" aria-hidden="true" />
      </button>

      {isOpen && !disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              zIndex: Z_INDEX.DROPDOWN,
            }}
            className={`rounded shadow-lg border p-2 ${t.border.primary} ${t.bg.primary} ${t.text.body}`}
          >
            <DayPicker
              // Vars must sit on the root element itself — .rdp-root declares them
              style={
                {
                  "--rdp-accent-color": COLORS.FLAG_GREEN,
                  "--rdp-accent-background-color": "transparent",
                  "--rdp-today-color": COLORS.FLAG_GREEN,
                  "--rdp-day-height": "32px",
                  "--rdp-day-width": "32px",
                  "--rdp-day_button-height": "30px",
                  "--rdp-day_button-width": "30px",
                  fontSize: "0.75rem",
                } as React.CSSProperties
              }
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate}
              startMonth={parseDay(releases[0].releaseDate)}
              endMonth={parseDay(releases[releases.length - 1].releaseDate)}
              // Days without a Wayback release are not selectable
              disabled={(day: Date) => !indexByDate.has(dayKey(day))}
              onSelect={(day: Date | undefined) => {
                const index = day && indexByDate.get(dayKey(day));
                if (index === undefined) return;
                onChange(index);
                setIsOpen(false);
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
