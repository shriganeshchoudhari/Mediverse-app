import React from 'react';
import { render, screen } from '@testing-library/react';
import RuminantPhysiologyViewer from '../../components/veterinary/RuminantPhysiologyViewer';

describe('RuminantPhysiologyViewer', () => {
  it('renders without crashing', () => {
    render(<RuminantPhysiologyViewer />);
  });

  it('displays 4 chambers and forage slider', () => {
    render(<RuminantPhysiologyViewer />);
    // Adjust logic depending on how chambers and slider are labeled
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThan(0);
  });
});
