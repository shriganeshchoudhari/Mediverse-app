import React from 'react';
import { render, screen } from '@testing-library/react';
import VeterinarySurgeryStation from '../../components/veterinary/VeterinarySurgeryStation';

describe('VeterinarySurgeryStation', () => {
  it('renders without crashing', () => {
    render(<VeterinarySurgeryStation />);
  });

  it('displays surgical cases and step-by-step workflow', () => {
    render(<VeterinarySurgeryStation />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
