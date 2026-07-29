import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

/**
 * Dark mode convention guardrail.
 *
 * This app themes via React context (useTheme / useThemeClasses / isDark conditionals), NOT
 * Tailwind's `dark:` variant — `darkMode` is not configured, so a `dark:` class silently does
 * nothing at runtime while looking correct in code. A redesign touches every component, so this
 * scan fails loudly the moment any component or page reintroduces a `dark:` modifier.
 *
 * ponytail: filesystem scan needs recursion to collect files; the assertion itself is a single
 * unconditional check, so this isn't the "conditional test logic" anti-pattern.
 */

const ROOTS = ["components", "pages"].map((dir) => join(process.cwd(), "src", dir));

// A `dark:` used as a Tailwind modifier inside a className string.
const DARK_MODIFIER = /className=["'`][^"'`]*\bdark:/;

function tsxFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      tsxFiles(full, acc);
    } else if (entry.endsWith(".tsx") && !entry.endsWith(".test.tsx")) {
      acc.push(full);
    }
  }
  return acc;
}

describe("dark mode convention", () => {
  it("no component or page uses a Tailwind `dark:` modifier", () => {
    const offenders = ROOTS.flatMap((root) => tsxFiles(root))
      .filter((file) => DARK_MODIFIER.test(readFileSync(file, "utf-8")))
      .map((file) => file.replace(process.cwd(), ""));

    expect(
      offenders,
      `Use isDark/useThemeClasses instead of dark: modifiers in:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
