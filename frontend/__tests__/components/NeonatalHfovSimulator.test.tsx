import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NeonatalHfovSimulator from '../../components/simulators/NeonatalHfovSimulator';

describe('NeonatalHfovSimulator Component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders simulator header, scoreboard, and tabs correctly', () => {
    render(<NeonatalHfovSimulator />);

    expect(
      screen.getByText(/Neonatal HFOV & Surfactant Kinematics Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/High-Frequency Oscillatory Ventilation/i)).toBeInTheDocument();
    expect(screen.getByText(/Predicted Arterial Blood Gas/i)).toBeInTheDocument();
    expect(screen.getByText(/Oxygenation Index \(OI\)/i)).toBeInTheDocument();

    // Verify 4 tab buttons
    expect(screen.getByText(/1\. HFOV Ventilator Controls & ABG/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Surfactant Therapy & Laplace \(LISA\)/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Open-Lung Hysteresis Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Gas Transport Physics \(Pendelluft\)/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates blood gas', () => {
    render(<NeonatalHfovSimulator />);

    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    expect(presetSelect).toBeInTheDocument();

    // Switch to Meconium Aspiration preset
    fireEvent.change(presetSelect, { target: { value: 'MECONIUM_ASPIRATION_HYPERCAPNIA' } });

    expect(screen.getAllByText(/MAS/i).length).toBeGreaterThan(0);
  });

  it('switches to Surfactant tab and administers LISA surfactant', () => {
    render(<NeonatalHfovSimulator />);

    // Switch to tab 2 (Surfactant)
    fireEvent.click(screen.getByText(/2\. Surfactant Therapy & Laplace \(LISA\)/i));

    expect(
      screen.getByText(/Laplace Alveolar Collapsing Pressure Solver/i)
    ).toBeInTheDocument();

    const lisaButton = screen.getByText(/Administer LISA Surfactant/i);
    expect(lisaButton).toBeInTheDocument();

    fireEvent.click(lisaButton);
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('SURFACTANT ADMINISTERED')
    );
  });

  it('switches to Open-Lung and Physics tabs and interacts with controls', () => {
    render(<NeonatalHfovSimulator />);

    // Switch to tab 3 (Open-Lung)
    fireEvent.click(screen.getByText(/3\. Open-Lung Hysteresis Strategy/i));
    expect(screen.getByText(/Step Up mPaw \(\+2 cmH2O\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Set Optimal \(Pclose \+ 2\)/i)).toBeInTheDocument();

    // Switch to tab 4 (Physics)
    fireEvent.click(screen.getByText(/4\. Gas Transport Physics \(Pendelluft\)/i));
    expect(screen.getByText(/1\. Taylor Dispersion/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Pendelluft/i)).toBeInTheDocument();
  });
});
