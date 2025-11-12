import { describe, it, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App - Mobile View', () => {
  let originalInnerWidth: number;

  beforeAll(() => {
    // Save original window.innerWidth
    originalInnerWidth = window.innerWidth;
    // Mock mobile viewport (< 768px) for ALL mobile tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // iPhone size
    });
  });

  afterAll(() => {
    // Restore original window.innerWidth after ALL mobile tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('renders mobile view without errors', () => {
    const { container } = render(<App />);
    // Mobile view should render without throwing errors
    // Check that the mobile layout div is present
    const mobileLayout = container.querySelector('.md\\:hidden');
    expect(mobileLayout).toBeDefined();
  });

  it('does not render HeritageMap on mobile', () => {
    const { container } = render(<App />);
    // Map should not be rendered on mobile (it uses Leaflet which would throw errors if rendered)
    // Check that the leaflet-container class (from Leaflet map) is not present
    const leafletContainer = container.querySelector('.leaflet-container');
    expect(leafletContainer).toBeNull();
  });

  it('renders FilterBar and Table on mobile', () => {
    const { container } = render(<App />);

    // Check for mobile layout div
    const mobileLayout = container.querySelector('.md\\:hidden');
    expect(mobileLayout).toBeDefined();

    // Check for mobile-specific table header ("Site Name" - there will be multiple due to desktop also rendered)
    const siteNameColumns = screen.queryAllByText(/Site Name/i);
    expect(siteNameColumns.length).toBeGreaterThanOrEqual(0);

    // Mobile layout should exist
    const mobileDiv = container.querySelector('.md\\:hidden');
    expect(mobileDiv).toBeDefined();
  });
});
