import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { Timeline } from './Timeline';
import { mockSites } from '../../data/mockSites';

describe('Timeline', () => {
  it('renders without crashing', () => {
    render(<Timeline sites={mockSites} />);
  });

  it('renders with empty sites array', () => {
    render(<Timeline sites={[]} />);
  });
});
