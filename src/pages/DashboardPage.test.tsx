import { describe, it, expect } from 'vitest';
import { renderWithTheme, screen } from '../test-utils/renderWithTheme';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';
import { AnimationProvider } from '../contexts/AnimationContext';

/**
 * DashboardPage Unit Tests
 *
 * Purpose: Verify DashboardPage component structure and accessibility
 * Replaces E2E tests: "Page has proper heading structure" and page load checks
 */
describe('DashboardPage', () => {
  it('renders without crashing', () => {
    const { container } = renderWithTheme(
      <BrowserRouter>
        <AnimationProvider>
          <DashboardPage />
        </AnimationProvider>
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('has h1 heading for accessibility', () => {
    renderWithTheme(
      <BrowserRouter>
        <AnimationProvider>
          <DashboardPage />
        </AnimationProvider>
      </BrowserRouter>
    );

    // Should have at least one h1 heading
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });
});
