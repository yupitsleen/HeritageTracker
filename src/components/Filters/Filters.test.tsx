import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Filters } from './Filters';

describe('Filters', () => {
  const mockProps = {
    onTypeChange: vi.fn(),
    onStatusChange: vi.fn(),
    selectedTypes: [] as const,
    selectedStatuses: [] as const,
  };

  it('renders without crashing', () => {
    render(<Filters {...mockProps} />);
  });

  it('renders with selected filters', () => {
    render(
      <Filters
        {...mockProps}
        selectedTypes={['mosque', 'church']}
        selectedStatuses={['destroyed']}
      />
    );
  });
});
