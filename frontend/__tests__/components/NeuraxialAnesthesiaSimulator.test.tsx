import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NeuraxialAnesthesiaSimulator from '../../components/simulators/NeuraxialAnesthesiaSimulator';

describe('NeuraxialAnesthesiaSimulator Component', () => {
  beforeEach(() => {
    // Mock window.alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders simulator header, scoreboard, and all 5 tabs correctly', () => {
    render(<NeuraxialAnesthesiaSimulator />);

    expect(
      screen.getByText(/Neuraxial Anesthesia, Spinal\/Epidural Level & LAST Rescue Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/ASRA & SOAP Protocols/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sensory Dermatome Level/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Modified Bromage Motor Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Hemodynamics \(MAP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Block Clinical Status/i)).toBeInTheDocument();

    // Verify 5 tab buttons
    expect(screen.getByText(/1\. Dermatome Sensory & Bromage Block/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Epidural Test Dose Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. High & Total Spinal Crisis/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. ASRA LAST 20% Lipid Rescue/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. PDPH & Epidural Blood Patch/i)).toBeInTheDocument();
  });

  it('switches clinical presets and renders high spinal emergency banner', () => {
    render(<NeuraxialAnesthesiaSimulator />);

    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    expect(presetSelect).toBeInTheDocument();

    // Switch to High Spinal T1 preset
    fireEvent.change(presetSelect, { target: { value: 'HIGH_SPINAL_T1_BRADYCARDIA' } });

    // High spinal alert banner should now be visible
    expect(screen.getAllByText(/CRITICAL NEURAXIAL EMERGENCY/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/HIGH SPINAL/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Resuscitate & Regress Level/i)).toBeInTheDocument();
  });

  it('interacts with test dose tab and displays intravascular warning on tachycardia', () => {
    render(<NeuraxialAnesthesiaSimulator />);

    // Click Tab 2: Test Dose
    fireEvent.click(screen.getByText(/2\. Epidural Test Dose Simulator/i));

    expect(screen.getAllByText(/Epidural Test Dose Simulator/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Heart Rate Increase/i)).toBeInTheDocument();

    // Switch to POSITIVE_TEST_DOSE_INTRAVASCULAR preset
    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'POSITIVE_TEST_DOSE_INTRAVASCULAR' } });

    // Should indicate intravascular injection warning
    expect(screen.getAllByText(/POSITIVE INTRAVASCULAR/i).length).toBeGreaterThan(0);
  });

  it('navigates to LAST rescue and triggers 20% lipid emulsion bolus', () => {
    render(<NeuraxialAnesthesiaSimulator />);

    // Switch to Bupivacaine LAST preset
    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'LAST_BUPIVACAINE_TOXICITY' } });

    // LAST banner should appear
    expect(screen.getAllByText(/LOCAL ANESTHETIC SYSTEMIC TOXICITY/i).length).toBeGreaterThan(0);

    // Switch to LAST tab
    fireEvent.click(screen.getByText(/4\. ASRA LAST 20% Lipid Rescue/i));

    // Administer lipid emulsion button
    const bolusButtons = screen.getAllByRole('button', { name: /Push 20% Lipid Emulsion Bolus/i });
    expect(bolusButtons.length).toBeGreaterThan(0);
    fireEvent.click(bolusButtons[0]);

    // Check alert was called
    expect(window.alert).toHaveBeenCalled();
  });

  it('navigates to PDPH tab and triggers epidural blood patch', () => {
    render(<NeuraxialAnesthesiaSimulator />);

    // Switch to PDPH preset
    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'SEVERE_PDPH_BLOOD_PATCH' } });

    // Switch to PDPH tab
    fireEvent.click(screen.getByText(/5\. PDPH & Epidural Blood Patch/i));

    expect(screen.getAllByText(/Post-Dural Puncture Headache/i).length).toBeGreaterThan(0);
    const patchButton = screen.getByRole('button', { name: /Perform Epidural Blood Patch/i });
    expect(patchButton).toBeInTheDocument();

    fireEvent.click(patchButton);
    expect(window.alert).toHaveBeenCalled();
  });
});
