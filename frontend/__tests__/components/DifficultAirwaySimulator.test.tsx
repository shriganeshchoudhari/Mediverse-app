import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DifficultAirwaySimulator from '../../components/simulators/DifficultAirwaySimulator';

describe('DifficultAirwaySimulator Component', () => {
  beforeEach(() => {
    // Mock window.alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders simulator header, scoreboard, and tabs correctly', () => {
    render(<DifficultAirwaySimulator />);

    expect(
      screen.getByText(/Difficult Airway & Awake Fiberoptic Intubation Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/DAS 2015 Verified/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Airway Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/STOP-BANG OSA Score/i)).toBeInTheDocument();

    // Verify 4 tab buttons
    expect(screen.getByText(/1\. Bedside Airway Exam & Predictors/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. STOP-BANG & Risk Matrices/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. DAS 2015 Algorithm & CICO Sim/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Awake Tracheal Intubation \(ATI\)/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates primary strategy', () => {
    render(<DifficultAirwaySimulator />);

    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    expect(presetSelect).toBeInTheDocument();

    // Default is normal airway -> ROUTINE PLAN A
    expect(screen.getAllByText(/ROUTINE PLAN A/i).length).toBeGreaterThan(0);

    // Change to Ludwig's Angina preset
    fireEvent.change(presetSelect, { target: { value: 'LUDWIG_ANGINA_AWAKE_FIBEROPTIC' } });

    // Should now recommend AWAKE TRACHEAL INTUBATION
    expect(screen.getAllByText(/AWAKE TRACHEAL INTUBATION/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CRITICAL/i).length).toBeGreaterThan(0);
  });

  it('switches tabs and displays STOP-BANG questions', () => {
    render(<DifficultAirwaySimulator />);

    // Click tab 2
    fireEvent.click(screen.getByText(/2\. STOP-BANG & Risk Matrices/i));

    expect(screen.getByText(/S: Snoring Loudly/i)).toBeInTheDocument();
    expect(screen.getByText(/Ramped Positioning \(HELP\)/i)).toBeInTheDocument();
  });

  it('navigates to DAS Algorithm tab and triggers CICO emergency', () => {
    render(<DifficultAirwaySimulator />);

    // Click tab 3
    fireEvent.click(screen.getByText(/3\. DAS 2015 Algorithm & CICO Sim/i));

    expect(screen.getByText(/Plan A: Facemask & ETT/i)).toBeInTheDocument();
    expect(screen.getByText(/Fail Laryngoscopy Attempt/i)).toBeInTheDocument();

    // Trigger emergency eFONA button
    const cicoButtons = screen.getAllByText(/Trigger Emergency eFONA/i);
    expect(cicoButtons.length).toBeGreaterThan(0);
    fireEvent.click(cicoButtons[0]);

    // Check that CICO Emergency banner appears
    expect(
      screen.getByText(/CANNOT INTUBATE • CANNOT OXYGENATE \(CICO\) EMERGENCY/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/PLAN D ACTIVE/i)).toBeInTheDocument();
  });
});
