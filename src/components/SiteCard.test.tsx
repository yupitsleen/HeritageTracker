import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { SiteCard } from './SiteCard';
import { mockSites } from '../data/mockSites';

describe('SiteCard', () => {
  it('renders without crashing', () => {
    render(<SiteCard site={mockSites[0]} />);
  });

  it('renders with all site types', () => {
    mockSites.forEach((site) => {
      render(<SiteCard site={site} />);
    });
  });
});
