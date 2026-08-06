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
export function AppHeader({ leading }: { leading?: ReactNode }) {
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
              ponytail: split on "&" — every locale keeps the latin "Now & Then".
              The "&" anchors on page center, which is also the seam between the two
              comparison maps. Fixed, so opening the side panel doesn't drag the title. */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-1.5 left-1/2 -translate-x-1/2 cursor-pointer text-lg md:text-xl font-bold uppercase tracking-wide leading-7"
            aria-label="Go to home page"
            title={TOOLTIPS.HEADER.HOME}
          >
            <h1>
              {/* w-max: a right:100% box gets zero available width, so it would
                  shrink-wrap to nothing and let the glyphs spill over the "&". */}
              <span className="absolute right-full mr-2 w-max flex items-center gap-3 text-[#ed3039]">
                {/* ponytail: h-7 matches the title's line-height at both text sizes */}
                <img src={logo} alt="Now & Then Logo" className="h-7 w-auto" />
                {t("header.title").split("&")[0].trim()}
              </span>
              <span className="text-[#fefefe]">&amp;</span>
              <span className="absolute left-full ml-2 w-max text-[#009639]">
                {t("header.title").split("&")[1]?.trim()}
                <span className="text-[#fefefe]">: {t("header.location")}</span>
              </span>
            </h1>
          </button>
        </div>
      </header>
    </div>
  );
}
