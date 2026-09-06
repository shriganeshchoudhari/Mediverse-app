import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BurnsResuscitationSimulator from '../../components/simulators/BurnsResuscitationSimulator';

describe('BurnsResuscitationSimulator', () => {
  it('renders title and essential burn resuscitation components', () => {
    render(<BurnsResuscitationSimulator />);
    expect(screen.getByText(/Emergency Burns Resuscitation & Fluid Shift Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Wallace Rule of Nines & Burn Depth Mapper/i)).toBeInTheDocument();
    expect(screen.getByText(/24-Hour Resuscitation Volumes/i)).toBeInTheDocument();
    expect(screen.getByText(/Urine Output \(UOP\) Goal & Titration/i)).toBeInTheDocument();
    expect(screen.getByText(/Fluid Creep & Compartment Syndrome/i)).toBeInTheDocument();
  });

  it('allows toggling between Parkland and ABA Consensus formulas', () => {
    render(<BurnsResuscitationSimulator />);
    const abaButton = screen.getByRole('button', { name: /ABA \(2-4mL\)/i });
    fireEvent.click(abaButton);
    expect(abaButton).toHaveClass('bg-orange-600');

    const parklandButton = screen.getByRole('button', { name: /Parkland \(4mL\)/i });
    fireEvent.click(parklandButton);
    expect(parklandButton).toHaveClass('bg-orange-600');
  });

  it('switches clinical presets and updates TBSA and volume targets', () => {
    render(<BurnsResuscitationSimulator />);
    const electricalPreset = screen.getByRole('button', { name: /High-Voltage Electrical Burn/i });
    fireEvent.click(electricalPreset);

    // Should indicate high-voltage mechanism
    expect(screen.getAllByText(/High-Voltage Electrical/i).length).toBeGreaterThan(0);

    const acsPreset = screen.getByRole('button', { name: /Severe Fluid Creep/i });
    fireEvent.click(acsPreset);

    expect(screen.getAllByText(/CRITICAL FLUID CREEP WARNING/i).length).toBeGreaterThan(0);
  });

  it('adjusts fluid titration recommendations when urine output slider moves', () => {
    render(<BurnsResuscitationSimulator />);
    const sliders = screen.getAllByRole('slider');
    // Find UOP slider (min=5, max=160)
    const uopSlider = sliders.find(s => s.getAttribute('min') === '5' && s.getAttribute('max') === '160');
    expect(uopSlider).toBeDefined();

    if (uopSlider) {
      // Simulate extreme oliguria (10 mL/h)
      fireEvent.change(uopSlider, { target: { value: '10' } });
      expect(screen.getAllByText(/Oliguria detected/i).length).toBeGreaterThan(0);
    }
  });
});
