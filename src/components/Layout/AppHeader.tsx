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
        isDark ? "bg-gray-900" : "bg-[#000000]"
      }`}
      style={{ zIndex: Z_INDEX.STICKY }}
      dir="ltr"
    >
      <header className="relative bg-[#000000] text-[#fefefe] shadow-lg border-b-2 border-[#009639]">
        {/* Top-left square slot — absolute so it never shifts the centered title. */}
        {leading && <div className="absolute inset-y-0 left-0">{leading}</div>}
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-center">
          {/* Logo + Title - clickable to return home */}
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-3"
            aria-label="Go to home page"
            title={TOOLTIPS.HEADER.HOME}
          >
            {/* ponytail: h-7 matches the title's line-height at both text sizes */}
            <img src={logo} alt="Now & Then Logo" className="h-7 w-auto" />
            <h1 className="text-lg md:text-xl font-bold text-[#fefefe] uppercase tracking-wide">
              {/* ponytail: split on "&" — every locale keeps the latin "Now & Then" */}
              {t("header.title")
                .split("&")
                .flatMap((part, i) =>
                  i === 0
                    ? [part]
                    : [
                        <span key={i} className="text-[#009639]">
                          &amp;
                        </span>,
                        part,
                      ]
                )}
              : <span className="text-[#ed3039]">{t("header.location")}</span>
            </h1>
          </button>
        </div>
      </header>

      {/* Flag-colored horizontal line - RED, BLACK, RED, GREEN (4px high, 4 bars) */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#ed3039]"></div>
        <div className="flex-1 bg-[#000000]"></div>
        <div className="flex-1 bg-[#ed3039]"></div>
        <div className="flex-1 bg-[#009639]"></div>
      </div>
    </div>
  );
}
