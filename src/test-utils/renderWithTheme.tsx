import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "../contexts/ThemeContext";

/**
 * Custom render function that wraps components with ThemeProvider
 *
 * This utility eliminates the need to manually wrap components with
 * ThemeProvider in every test file that uses useTheme() hook.
 *
 * @example
 * ```tsx
 * import { renderWithTheme } from '../../test-utils/renderWithTheme';
 *
 * test('renders component', () => {
 *   renderWithTheme(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 *
 * @param ui - React element to render
 * @param options - Optional render options from React Testing Library
 * @returns Render result from React Testing Library
 */
export function renderWithTheme(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  });
}

/**
 * Re-export everything from React Testing Library for convenience
 * This allows tests to import { screen, waitFor } from test-utils
 */
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
