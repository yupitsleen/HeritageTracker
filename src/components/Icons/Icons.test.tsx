import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { InfoIcon, CloseIcon, ChevronIcon } from "./index";

describe("Icon Components", () => {
  describe("InfoIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<InfoIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<InfoIcon className="w-8 h-8 text-blue-500" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-8", "h-8", "text-blue-500");
    });

    it("applies default className when not provided", () => {
      const { container } = render(<InfoIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-4", "h-4");
    });

    it("renders with aria-label for accessibility", () => {
      const { container } = render(<InfoIcon aria-label="Information" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-label", "Information");
    });

    it("has role=img for accessibility", () => {
      const { container } = render(<InfoIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("role", "img");
    });
  });

  describe("CloseIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<CloseIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<CloseIcon className="w-8 h-8 text-red-500" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-8", "h-8", "text-red-500");
    });

    it("applies default className when not provided", () => {
      const { container } = render(<CloseIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-6", "h-6");
    });

    it("renders with aria-label for accessibility", () => {
      const { container } = render(<CloseIcon aria-label="Close" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-label", "Close");
    });

    it("has role=img for accessibility", () => {
      const { container } = render(<CloseIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("role", "img");
    });
  });

  describe("ChevronIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<ChevronIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<ChevronIcon className="w-5 h-5 text-gray-600" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-5", "h-5", "text-gray-600");
    });

    it("applies default className when not provided", () => {
      const { container } = render(<ChevronIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-4", "h-4");
    });

    it("renders with aria-label for accessibility", () => {
      const { container } = render(<ChevronIcon aria-label="Expand" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-label", "Expand");
    });

    it("has role=img for accessibility", () => {
      const { container } = render(<ChevronIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("role", "img");
    });

    describe("directions", () => {
      it("renders pointing down by default (no rotation)", () => {
        const { container } = render(<ChevronIcon />);
        const svg = container.querySelector("svg");
        expect(svg).not.toHaveClass("rotate-180", "rotate-90", "-rotate-90");
      });

      it("renders pointing up with rotate-180", () => {
        const { container } = render(<ChevronIcon direction="up" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("rotate-180");
      });

      it("renders pointing left with rotate-90", () => {
        const { container} = render(<ChevronIcon direction="left" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("rotate-90");
      });

      it("renders pointing right with -rotate-90", () => {
        const { container } = render(<ChevronIcon direction="right" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("-rotate-90");
      });
    });
  });

  describe("Icon Consistency", () => {
    it("all icons accept className prop", () => {
      const testClass = "custom-class";

      const { container: info } = render(<InfoIcon className={testClass} />);
      expect(info.querySelector("svg")).toHaveClass(testClass);

      const { container: close } = render(<CloseIcon className={testClass} />);
      expect(close.querySelector("svg")).toHaveClass(testClass);

      const { container: chevron } = render(<ChevronIcon className={testClass} />);
      expect(chevron.querySelector("svg")).toHaveClass(testClass);
    });

    it("all icons accept aria-label prop", () => {
      const testLabel = "Test Icon";

      const { container: info } = render(<InfoIcon aria-label={testLabel} />);
      expect(info.querySelector("svg")).toHaveAttribute("aria-label", testLabel);

      const { container: close } = render(<CloseIcon aria-label={testLabel} />);
      expect(close.querySelector("svg")).toHaveAttribute("aria-label", testLabel);

      const { container: chevron } = render(<ChevronIcon aria-label={testLabel} />);
      expect(chevron.querySelector("svg")).toHaveAttribute("aria-label", testLabel);
    });

    it("all icons have role=img for accessibility", () => {
      const { container: info } = render(<InfoIcon />);
      expect(info.querySelector("svg")).toHaveAttribute("role", "img");

      const { container: close } = render(<CloseIcon />);
      expect(close.querySelector("svg")).toHaveAttribute("role", "img");

      const { container: chevron } = render(<ChevronIcon />);
      expect(chevron.querySelector("svg")).toHaveAttribute("role", "img");
    });
  });
});
