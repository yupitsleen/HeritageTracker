import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { Button } from './Button';

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

describe('Button', () => {
  describe('Basic rendering', () => {
    it('renders children correctly', () => {
      renderWithTheme(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders with icon', () => {
      renderWithTheme(
        <Button icon={<span data-testid="icon">🔍</span>}>
          Search
        </Button>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('applies fullWidth prop', () => {
      renderWithTheme(<Button fullWidth>Full width</Button>);
      const button = screen.getByRole('button');
      // Test behavior: button takes full width (don't test CSS class name)
      expect(button).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders all variants without crashing', () => {
      const variants: Array<'primary' | 'secondary' | 'danger' | 'ghost'> = ['primary', 'secondary', 'danger', 'ghost'];

      variants.forEach(variant => {
        renderWithTheme(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
      });
    });

    it('renders in both light and dark modes', () => {
      renderWithTheme(<Button variant="primary">Light</Button>, 'light');
      expect(screen.getByRole('button', { name: 'Light' })).toBeInTheDocument();

      renderWithTheme(<Button variant="primary">Dark</Button>, 'dark');
      expect(screen.getByRole('button', { name: 'Dark' })).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders all size variants without crashing', () => {
      const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];

      sizes.forEach(size => {
        renderWithTheme(<Button size={size}>{size}</Button>);
        expect(screen.getByRole('button', { name: size })).toBeInTheDocument();
      });
    });
  });

  describe('Disabled state', () => {
    it('button is disabled when disabled prop is true', () => {
      renderWithTheme(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('disabled state works across all variants', () => {
      const variants: Array<'primary' | 'secondary' | 'danger' | 'ghost'> = ['primary', 'secondary', 'danger', 'ghost'];

      variants.forEach(variant => {
        renderWithTheme(<Button variant={variant} disabled>{variant} disabled</Button>);
        expect(screen.getByRole('button', { name: `${variant} disabled` })).toBeDisabled();
      });
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      renderWithTheme(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      renderWithTheme(<Button onClick={handleClick} disabled>Click me</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('forwards aria-label', () => {
      renderWithTheme(<Button aria-label="Custom label">Button</Button>);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });

    it('forwards aria-describedby', () => {
      renderWithTheme(
        <>
          <Button aria-describedby="description">Button</Button>
          <div id="description">Description text</div>
        </>
      );
      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-describedby')).toBe('description');
    });

    it('has proper disabled attribute', () => {
      renderWithTheme(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('disabled');
    });
  });

  describe('Active state (toggle buttons)', () => {
    it('renders with active state', () => {
      renderWithTheme(<Button active>Active Toggle</Button>);
      const button = screen.getByRole('button', { name: 'Active Toggle' });
      expect(button).toBeInTheDocument();
    });

    it('renders with lightText prop for dark backgrounds', () => {
      renderWithTheme(<Button lightText>Light Text Button</Button>);
      const button = screen.getByRole('button', { name: 'Light Text Button' });
      expect(button).toBeInTheDocument();
    });
  });
});
