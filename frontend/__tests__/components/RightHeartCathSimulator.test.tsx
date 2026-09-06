import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RightHeartCathSimulator from '../../components/simulators/RightHeartCathSimulator';

describe('RightHeartCathSimulator', () => {
  it('renders title and essential RHC workstation sections', () => {
    render(<RightHeartCathSimulator />);
    expect(screen.getByText(/Right Heart Catheterization \(RHC\) Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Fick & PVR Solver/i)).toBeInTheDocument();
    expect(screen.getByText(/Swan-Ganz Intracardiac Pressures/i)).toBeInTheDocument();
    expect(screen.getByText(/Fick Oximetry & Metabolism/i)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive Hemodynamic Panel/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates phenotype classification', () => {
    render(<RightHeartCathSimulator />);
    const normalPreset = screen.getByRole('button', { name: /Normal Baseline Pulmonary Hemodynamics/i });
    fireEvent.click(normalPreset);

    expect(screen.getByText(/Normal Pulmonary Hemodynamics/i)).toBeInTheDocument();

    const ipahPreset = screen.getByRole('button', { name: /Severe Idiopathic PAH \(Pre-Capillary Group 1\)/i });
    fireEvent.click(ipahPreset);

    expect(screen.getByText(/Pre-Capillary Pulmonary Hypertension/i)).toBeInTheDocument();
  });

  it('allows adjusting intracardiac pressure sliders', () => {
    render(<RightHeartCathSimulator />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThan(5);

    // Find mPAP slider
    const mpapSlider = sliders.find(
      s => s.getAttribute('min') === '8' && s.getAttribute('max') === '80'
    );
    expect(mpapSlider).toBeDefined();

    if (mpapSlider) {
      fireEvent.change(mpapSlider, { target: { value: '45' } });
      expect(screen.getAllByText(/45 mmHg/i).length).toBeGreaterThan(0);
    }
  });

  it('toggles vasoreactivity challenge testing', () => {
    render(<RightHeartCathSimulator />);
    const vasoCheck = screen.getByRole('checkbox', { name: /Test Performed/i });
    expect(vasoCheck).not.toBeChecked();

    fireEvent.click(vasoCheck);
    expect(vasoCheck).toBeChecked();
    expect(screen.getByText(/Post-Challenge mPAP:/i)).toBeInTheDocument();
  });

  it('displays comprehensive hemodynamic resistance and compliance metrics', () => {
    render(<RightHeartCathSimulator />);
    expect(screen.getAllByText(/Fick Cardiac Output/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Pulmonary Resistance \(PVR\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Systemic Resistance \(SVR\)/i)).toBeInTheDocument();
    expect(screen.getByText(/PA Capacitance \(PAC\):/i)).toBeInTheDocument();
    expect(screen.getByText(/RV PAPi Index:/i)).toBeInTheDocument();
  });
});
