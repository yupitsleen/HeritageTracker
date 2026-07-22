import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { InfoIcon, CloseIcon, ChevronIcon } from "./index";

// ponytail: no default-class assertions — Tailwind values are styling, not contract.
// Contract tested: renders an svg, className/aria-label passthrough, role=img.
const icons = [
  ["InfoIcon", InfoIcon],
  ["CloseIcon", CloseIcon],
  ["ChevronIcon", ChevronIcon],
] as const;

describe("Icon Components", () => {
  icons.forEach(([name, Icon]) => {
    describe(name, () => {
      it("renders an svg with role=img", () => {
        const { container } = render(<Icon />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("role", "img");
      });

      it("applies custom className", () => {
        const { container } = render(<Icon className="custom-class" />);
        expect(container.querySelector("svg")).toHaveClass("custom-class");
      });

      it("applies aria-label", () => {
        const { container } = render(<Icon aria-label="Label" />);
        expect(container.querySelector("svg")).toHaveAttribute("aria-label", "Label");
      });
    });
  });

  describe("ChevronIcon directions", () => {
    it("each direction renders distinctly", () => {
      const classFor = (direction?: "up" | "down" | "left" | "right"): string => {
        const { container } = render(<ChevronIcon direction={direction} />);
        return container.querySelector("svg")?.getAttribute("class") ?? "";
      };

      const rendered = [classFor(undefined), classFor("up"), classFor("left"), classFor("right")];
      expect(new Set(rendered).size).toBe(rendered.length);
    });
  });
});
