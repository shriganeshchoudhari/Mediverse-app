import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AorticStenosisSimulator from '../../components/simulators/AorticStenosisSimulator';

describe('AorticStenosisSimulator', () => {
  it('renders title and essential AS sections', () => {
    render(<AorticStenosisSimulator />);
    expect(screen.getByText(/Aortic Stenosis & Valve Hemodynamics Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Gorlin & Continuity Solver/i)).toBeInTheDocument();
    expect(screen.getByText(/Doppler Echocardiography/i)).toBeInTheDocument();
    expect(screen.getByText(/Invasive Cath Parameters \(Gorlin\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Heart Team Intervention Recommendation/i)).toBeInTheDocument();
  });

  it('switches clinical presets correctly', () => {
    render(<AorticStenosisSimulator />);
    const normalPreset = screen.getByRole('button', { name: /Normal Tricuspid Aortic Valve/i });
    fireEvent.click(normalPreset);

    // Normal valve should show Grade: NORMAL
    expect(screen.getAllByText(/NORMAL/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SURVEILLANCE/i).length).toBeGreaterThan(0);

    const severeD1Preset = screen.getByRole('button', { name: /Classic Severe High-Gradient AS \(Stage D1\)/i });
    fireEvent.click(severeD1Preset);
    expect(screen.getAllByText(/SEVERE/i).length).toBeGreaterThan(0);
  });

  it('allows adjusting LVOT and AV hemodynamic sliders', () => {
    render(<AorticStenosisSimulator />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThan(5);

    // Find the mean gradient slider and change value
    const meanGradSlider = sliders.find(
      s => s.getAttribute('min') === '4' && s.getAttribute('max') === '90'
    );
    expect(meanGradSlider).toBeDefined();

    if (meanGradSlider) {
      fireEvent.change(meanGradSlider, { target: { value: '65' } });
      expect(screen.getAllByText(/65 mmHg/i).length).toBeGreaterThan(0);
    }
  });

  it('toggles risk factor checkboxes', () => {
    render(<AorticStenosisSimulator />);
    const bicuspidCheck = screen.getByRole('checkbox', { name: /Bicuspid Aortic Valve/i });
    expect(bicuspidCheck).not.toBeChecked();

    fireEvent.click(bicuspidCheck);
    expect(bicuspidCheck).toBeChecked();
  });

  it('displays multi-modality hemodynamic metrics', () => {
    render(<AorticStenosisSimulator />);
    expect(screen.getByText(/Continuity AVA/i)).toBeInTheDocument();
    expect(screen.getByText(/Velocity Index \(DVI\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Invasive Gorlin AVA/i)).toBeInTheDocument();
    expect(screen.getByText(/Energy Loss Index \(ELI\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Valvuloarterial Impedance \(Zva\):/i)).toBeInTheDocument();
  });
});
