import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { IconButton } from './IconButton';

// Helper to render with theme context
function renderWithTheme(ui: React.ReactElement, theme: 'light' | 'dark' = 'light') {
  // Mock localStorage for theme
  const localStorageMock = {
    getItem: vi.fn(() => theme),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('IconButton', () => {
  describe('Basic rendering', () => {
    it('renders icon correctly', () => {
      renderWithTheme(
        <IconButton
          icon={<span data-testid="test-icon">★</span>}
          ariaLabel="Test button"
          title="Test tooltip"
        />
      );
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders with accessible label', () => {
      renderWithTheme(
        <IconButton
          icon={<span>★</span>}
          ariaLabel="Help button"
          title="Get help"
        />
      );
      expect(screen.getByLabelText('Help button')).toBeInTheDocument();
    });

    it('renders with title attribute for tooltip', () => {
      renderWithTheme(
        <IconButton
          icon={<span>★</span>}
          ariaLabel="Help"
          title="Click for help"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Click for help');
    });
  });

  describe('Theme support', () => {
    it('renders in light mode', () => {
      renderWithTheme(
        <IconButton
          icon={<span>☀️</span>}
          ariaLabel="Light mode button"
          title="Light mode"
        />,
        'light'
      );
      expect(screen.getByLabelText('Light mode button')).toBeInTheDocument();
    });

    it('renders in dark mode', () => {
      renderWithTheme(
        <IconButton
          icon={<span>🌙</span>}
          ariaLabel="Dark mode button"
          title="Dark mode"
        />,
        'dark'
      );
      expect(screen.getByLabelText('Dark mode button')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      renderWithTheme(
        <IconButton
          icon={<span>🔍</span>}
          ariaLabel="Search"
          title="Search"
          onClick={handleClick}
        />
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      renderWithTheme(
        <IconButton
          icon={<span>🔍</span>}
          ariaLabel="Search"
          title="Search"
          onClick={handleClick}
          disabled
        />
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('is disabled when disabled prop is true', () => {
      renderWithTheme(
        <IconButton
          icon={<span>🔍</span>}
          ariaLabel="Search"
          title="Search"
          disabled
        />
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has button role', () => {
      renderWithTheme(
        <IconButton
          icon={<span>★</span>}
          ariaLabel="Favorite"
          title="Add to favorites"
        />
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('requires ariaLabel for screen readers', () => {
      renderWithTheme(
        <IconButton
          icon={<span>★</span>}
          ariaLabel="Required label"
          title="Tooltip"
        />
      );
      expect(screen.getByLabelText('Required label')).toBeInTheDocument();
    });

    it('supports additional HTML button attributes', () => {
      renderWithTheme(
        <IconButton
          icon={<span>★</span>}
          ariaLabel="Test"
          title="Test"
          type="submit"
          name="test-button"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'test-button');
    });
  });

  describe('Custom styling', () => {
    it('accepts custom className', () => {
      renderWithTheme(
        <IconButton
          icon={<span>★</span>}
          ariaLabel="Custom"
          title="Custom"
          className="custom-class"
        />
      );
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });
  });
});
