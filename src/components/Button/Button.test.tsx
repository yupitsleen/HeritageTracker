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
      expect(button.className).toContain('w-full');
    });
  });

  describe('Variants', () => {
    it('renders primary variant in light mode', () => {
      renderWithTheme(<Button variant="primary">Primary</Button>, 'light');
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('text-gray-800');
      expect(button.className).toContain('hover:bg-[#009639]');
    });

    it('renders primary variant in dark mode', () => {
      renderWithTheme(<Button variant="primary">Primary</Button>, 'dark');
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('text-gray-300');
      expect(button.className).toContain('hover:bg-[#009639]');
    });

    it('renders secondary variant in light mode', () => {
      renderWithTheme(<Button variant="secondary">Secondary</Button>, 'light');
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('hover:bg-gray-700');
    });

    it('renders secondary variant in dark mode', () => {
      renderWithTheme(<Button variant="secondary">Secondary</Button>, 'dark');
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('hover:bg-gray-600');
    });

    it('renders danger variant in light mode', () => {
      renderWithTheme(<Button variant="danger">Delete</Button>, 'light');
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('hover:bg-[#ed3039]');
    });

    it('renders danger variant in dark mode', () => {
      renderWithTheme(<Button variant="danger">Delete</Button>, 'dark');
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('hover:bg-[#ed3039]');
    });

    it('renders ghost variant', () => {
      renderWithTheme(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
    });
  });

  describe('Sizes', () => {
    it('renders extra small size', () => {
      renderWithTheme(<Button size="xs">Extra Small</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-1.5');
      expect(button.className).toContain('text-xs');
      expect(button.className).toContain('uppercase');
      expect(button.className).toContain('tracking-wide');
    });

    it('renders small size', () => {
      renderWithTheme(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-5');
      expect(button.className).toContain('py-2');
      expect(button.className).toContain('text-xs');
      expect(button.className).toContain('uppercase');
      expect(button.className).toContain('tracking-wide');
    });

    it('renders medium size (default)', () => {
      renderWithTheme(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-2.5');
      expect(button.className).toContain('text-sm');
      expect(button.className).toContain('uppercase');
      expect(button.className).toContain('tracking-wide');
    });

    it('renders large size', () => {
      renderWithTheme(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-8');
      expect(button.className).toContain('py-3');
      expect(button.className).toContain('text-base');
      expect(button.className).toContain('uppercase');
      expect(button.className).toContain('tracking-wide');
    });
  });

  describe('Disabled state', () => {
    it('renders disabled styles', () => {
      renderWithTheme(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.className).toContain('bg-gray-300');
      expect(button.className).toContain('text-gray-500');
      expect(button.className).toContain('cursor-not-allowed');
    });

    it('disabled state overrides variant styles', () => {
      renderWithTheme(<Button variant="primary" disabled>Disabled Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gray-300');
      expect(button.className).not.toContain('bg-[#009639]');
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

  describe('Style consistency', () => {
    it('includes subtle border styling', () => {
      renderWithTheme(<Button variant="primary">Button</Button>);
      const button = screen.getByRole('button');
      // Check that it has border styling (gray-400 or gray-600 depending on theme)
      expect(button.className).toMatch(/border-gray-/);
    });

    it('includes transition classes', () => {
      renderWithTheme(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('transition-all');
      expect(button.className).toContain('duration-200');
    });

    it('includes active:opacity-80 for non-disabled buttons', () => {
      renderWithTheme(<Button variant="primary">Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('active:opacity-80');
    });

    it('does not include active:opacity-80 for disabled buttons', () => {
      renderWithTheme(<Button disabled>Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).not.toContain('active:opacity-80');
    });
  });
});
