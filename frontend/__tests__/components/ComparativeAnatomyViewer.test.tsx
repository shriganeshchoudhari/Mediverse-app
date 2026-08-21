import React from 'react';
import { render, screen } from '@testing-library/react';
import ComparativeAnatomyViewer from '../../components/veterinary/ComparativeAnatomyViewer';

describe('ComparativeAnatomyViewer', () => {
  it('renders without crashing', () => {
    render(<ComparativeAnatomyViewer />);
  });

  it('displays species selector buttons', () => {
    render(<ComparativeAnatomyViewer />);
    // Just an example check, you might need to adjust based on actual component structure
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
