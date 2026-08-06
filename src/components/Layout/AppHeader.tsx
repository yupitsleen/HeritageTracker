import type { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "../../contexts/LocaleContext";
import { useNavigate } from "react-router-dom";
import { Z_INDEX } from "../../constants/layout";
import { TOOLTIPS } from "../../config/tooltips";
import logo from "../../assets/HeritageTrackerLogo.png";

/**
 * Application header: centered logo + title, nothing else.
 * Black background with Palestinian flag colors.
 */
export function AppHeader({
  leading,
  contentInsetLeft = 16,
  titleLeft,
}: {
  leading?: ReactNode;
  /**
   * Left edge (px) of the page content the title lines up with — the comparison
   * maps, so THEN sits over the green map and NOW over the red one. Pages
   * without a left sidebar can leave it at the default page gutter.
   */
  contentInsetLeft?: number;
  /**
   * Where the logo + location start (px). Pass the map's left edge *as if the
   * panel were open* — it stays there whether the panel is open or railed.
   */
  titleLeft?: number;
}) {
  const { isDark } = useTheme();
  const t = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className={`sticky top-0 transition-colors duration-200 ${
        isDark ? "bg-gray-900" : "bg-[#121212]"
      }`}
      style={{ zIndex: Z_INDEX.STICKY }}
      dir="ltr"
    >
      <header className="relative bg-[#121212] text-[#fefefe] shadow-lg">
        {/* Top-left square slot — absolute so it never shifts the centered title. */}
        {leading && <div className="absolute inset-y-0 left-0">{leading}</div>}
        <div className="h-10">
          {/* Logo + Title - clickable to return home.
              ponytail: split on "&" — every locale keeps the latin "Then & Now".
              The words are spread across the content band: THEN over the left
              (green) map, NOW over the right (red) one, "&" on the seam between
              them. pointer-events sit on the glyphs only, so the full-width band
              doesn't swallow clicks meant for the leading slot. */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-1.5 inset-x-0 pointer-events-none cursor-pointer text-lg md:text-xl font-bold uppercase tracking-wide leading-7"
            aria-label="Go to home page"
            title={TOOLTIPS.HEADER.HOME}
          >
            <h1 className="relative flex items-center">
              {/* Logo + GAZA: sit past the leading square and stay put — the panel
                  opening or railing must not slide them onto its toggle button.
                  ponytail: h-7 matches the title's line-height at both text sizes */}
              {/* ml, not pl: padding is inside the box, so a padded span would
                  cover the leading square and eat its clicks. */}
              <span
                className="flex items-center gap-2 pointer-events-auto text-[#fefefe]"
                style={{ marginLeft: titleLeft ?? 48 }}
              >
                <img src={logo} alt="Then & Now Logo" className="h-7 w-auto" />
                {t("header.location")}:
              </span>
              {/* The "&" stays on the seam between the maps; THEN and NOW hang off
                  it at normal word spacing. w-max: a right:100% box gets zero
                  available width, so it would shrink-wrap and spill over the "&". */}
              <span
                className="absolute -translate-x-1/2 pointer-events-auto text-[#fefefe]"
                style={{ left: `calc((100% - 16px + ${contentInsetLeft}px) / 2)` }}
              >
                <span className="absolute right-full mr-3 w-max text-[#009639]">
                  {t("header.title").split("&")[0].trim()}
                </span>
                &amp;
                <span className="absolute left-full ml-3 w-max text-[#ed3039]">
                  {t("header.title").split("&")[1]?.trim()}
                </span>
              </span>
            </h1>
          </button>
        </div>
      </header>
    </div>
  );
}
