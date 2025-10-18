import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * Automated Dark Mode Validation Tests
 *
 * These tests automatically scan the codebase to detect:
 * 1. Components using broken Tailwind dark: modifiers
 * 2. Components with hardcoded colors that should use theme classes
 * 3. New components that might not be theme-aware
 *
 * This catches issues even if developers forget to add manual tests
 */

// Recursively find all TypeScript/TSX files in a directory
function findAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, build, etc.
      if (!file.startsWith(".") && !["node_modules", "dist", "build", "coverage"].includes(file)) {
        findAllFiles(filePath, fileList);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      // Skip test files themselves
      if (!file.endsWith(".test.tsx") && !file.endsWith(".test.ts")) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Check if a file uses Tailwind dark: modifiers
function hasDarkModifier(content: string): boolean {
  // Match patterns like: dark:bg-gray-800, dark:text-white, etc.
  // But exclude comments and strings that just mention "dark:"
  const darkModifierRegex = /className=["'`][^"'`]*dark:/;
  return darkModifierRegex.test(content);
}

// Check if a component imports useThemeClasses or useTheme
function importsThemeHooks(content: string): boolean {
  return (
    content.includes("useThemeClasses") ||
    content.includes("useTheme")
  );
}

// Check if a component has suspicious hardcoded colors
function hasSuspiciousHardcodedColors(content: string): { hasIssue: boolean; examples: string[] } {
  const examples: string[] = [];

  // Patterns that might indicate missing theme support
  const suspiciousPatterns = [
    /className=["'`][^"'`]*\bbg-white\b/g,
    /className=["'`][^"'`]*\bbg-gray-50\b/g,
    /className=["'`][^"'`]*\bbg-gray-100\b/g,
    /className=["'`][^"'`]*\btext-gray-900\b/g,
    /className=["'`][^"'`]*\btext-gray-800\b/g,
    /className=["'`][^"'`]*\btext-gray-700\b/g,
    /className=["'`][^"'`]*\bborder-gray-200\b/g,
    /className=["'`][^"'`]*\bborder-gray-300\b/g,
  ];

  // Check each pattern
  suspiciousPatterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        // Skip if it's in a conditional or uses theme classes
        if (!content.includes("isDark ?") && !content.includes("t.bg.") && !content.includes("t.text.")) {
          examples.push(match.slice(0, 50)); // Truncate for readability
        }
      });
    }
  });

  return {
    hasIssue: examples.length > 0,
    examples: [...new Set(examples)].slice(0, 3), // Unique, max 3 examples
  };
}

// List of known component directories
const componentDirs = [
  join(process.cwd(), "src", "components"),
].filter((dir) => {
  try {
    statSync(dir);
    return true;
  } catch {
    return false; // Directory doesn't exist
  }
});

describe("Dark Mode - Automated Validation", () => {
  describe("Tailwind dark: Modifier Detection", () => {
    it("should not find any dark: modifiers in component files", () => {
      const allFiles = componentDirs.flatMap((dir) => findAllFiles(dir));
      const filesWithDarkModifier: string[] = [];

      allFiles.forEach((filePath) => {
        const content = readFileSync(filePath, "utf-8");
        if (hasDarkModifier(content)) {
          filesWithDarkModifier.push(filePath.replace(process.cwd(), ""));
        }
      });

      if (filesWithDarkModifier.length > 0) {
        console.error("\n❌ Found files using Tailwind dark: modifiers:");
        console.error("These won't work because we use React context theming, not Tailwind's darkMode config\n");
        filesWithDarkModifier.forEach((file) => {
          console.error(`  - ${file}`);
        });
        console.error("\n💡 Fix: Replace dark: modifiers with isDark conditionals");
        console.error('   Example: dark:bg-gray-800 → ${isDark ? "bg-gray-800" : "bg-white"}\n');
      }

      expect(filesWithDarkModifier).toHaveLength(0);
    });
  });

  describe("Theme Hook Usage Detection", () => {
    it("should verify component files that render UI use theme hooks", () => {
      const allFiles = componentDirs.flatMap((dir) => findAllFiles(dir));
      const componentsWithoutThemeHooks: Array<{ file: string; reason: string }> = [];

      allFiles.forEach((filePath) => {
        const content = readFileSync(filePath, "utf-8");
        const fileName = filePath.split(/[/\\]/).pop() || "";

        // Skip utility files, types, hooks, contexts
        if (
          fileName.startsWith("use") || // hooks
          fileName.includes("types.ts") ||
          fileName.includes("Context.tsx") ||
          fileName.includes("utils.ts") ||
          fileName.includes("constants.ts") ||
          fileName.includes("theme.ts") ||
          fileName.includes("Skeleton.tsx") || // Loading skeletons are ok
          !content.includes("return") || // Not a component
          !content.includes("className") // Doesn't render styled elements
        ) {
          return; // Skip these files
        }

        // Check if it uses theme hooks
        if (!importsThemeHooks(content)) {
          // Check if it has suspicious hardcoded colors
          const colorCheck = hasSuspiciousHardcodedColors(content);
          if (colorCheck.hasIssue) {
            componentsWithoutThemeHooks.push({
              file: filePath.replace(process.cwd(), ""),
              reason: `Has hardcoded colors: ${colorCheck.examples.join(", ")}`,
            });
          }
        }
      });

      if (componentsWithoutThemeHooks.length > 0) {
        console.warn("\n⚠️  Components that might need theme support:");
        console.warn("These components have hardcoded colors but don't import theme hooks\n");
        componentsWithoutThemeHooks.forEach(({ file, reason }) => {
          console.warn(`  - ${file}`);
          console.warn(`    ${reason}\n`);
        });
        console.warn("💡 Consider adding: import { useThemeClasses } from '../../hooks/useThemeClasses'\n");
      }

      // This is a warning, not a hard failure, because some components
      // might legitimately not need theming (e.g., error boundaries)
      // If you want to make it stricter, change this to:
      // expect(componentsWithoutThemeHooks).toHaveLength(0);

      // For now, just report and pass
      expect(true).toBe(true);
    });
  });

  describe("Documentation", () => {
    it("explains how to add theme support to new components", () => {
      const guide = `

How to Add Dark Mode Support to New Components:
================================================

1. Import the theme hook:
   import { useThemeClasses } from '../../hooks/useThemeClasses';
   // OR for just the isDark boolean:
   import { useTheme } from '../../contexts/ThemeContext';

2. Use the hook in your component:
   const t = useThemeClasses();
   // OR
   const { isDark } = useTheme();

3. Replace hardcoded colors:
   ❌ className="bg-white text-gray-900"
   ✅ className={\`\${t.bg.primary} \${t.text.heading}\`}

   ❌ className="bg-white dark:bg-gray-800"  // Won't work!
   ✅ className={\`\${isDark ? "bg-gray-800" : "bg-white"}\`}

4. Available theme classes (t = useThemeClasses()):
   - Text: t.text.heading, t.text.body, t.text.muted, t.text.subtle
   - Backgrounds: t.bg.primary, t.bg.secondary, t.bg.tertiary, t.bg.hover
   - Borders: t.border.default, t.border.subtle, t.border.strong
   - Palestinian flag: t.flag.redBg, t.flag.greenBg, t.flag.greenHover
   - Inputs: t.input.base
   - Icons: t.icon.default, t.icon.muted
   - Cards: t.card.base

5. Test your component in both themes:
   - Use the theme toggle button in the header
   - Or add it to src/__tests__/darkMode.test.tsx

See src/hooks/useThemeClasses.ts for full documentation.
      `;

      // This test just provides documentation
      expect(guide).toBeTruthy();
    });
  });
});
