import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Filters } from './Filters';

describe('Filters', () => {
  const mockProps = {
    onTypeChange: vi.fn(),
    onStatusChange: vi.fn(),
    selectedType: 'all' as const,
    selectedStatus: 'all' as const,
  };

  it('renders without crashing', () => {
    render(<Filters {...mockProps} />);
  });

  it('renders with different selected values', () => {
    render(
      <Filters
        {...mockProps}
        selectedType="mosque"
        selectedStatus="destroyed"
      />
    );
  });
});
