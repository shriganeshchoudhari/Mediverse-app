import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HitArgatrobanSimulator from '../../components/simulators/HitArgatrobanSimulator';

describe('HitArgatrobanSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<HitArgatrobanSimulator />);

    expect(
      screen.getByText(/Heparin-Induced Thrombocytopenia \(HIT\) Precision Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/4Ts Probability/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Platelet Drop/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/ELISA & SRA/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/DTI Anticoagulation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Safety Safeguards/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clinical presets and applies Rapid-Onset HIT preset', () => {
    render(<HitArgatrobanSimulator />);

    const rapidPresetButtons = screen.getAllByRole('button', { name: /Rapid-Onset/i });
    expect(rapidPresetButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(rapidPresetButtons[0]);

    // Should reflect 4Ts = 8
    expect(screen.getAllByText(/8 \/ 8/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to 4Ts Scoring Calculator and changes category options', () => {
    render(<HitArgatrobanSimulator />);

    const fourTsTab = screen.getByRole('button', { name: /4Ts Scoring Calculator/i });
    fireEvent.click(fourTsTab);

    expect(screen.getByText(/Warkentin 4Ts Clinical Scoring Bench/i)).toBeInTheDocument();
    expect(screen.getByText(/1. Thrombocytopenia/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Timing of Platelet Fall/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Thrombosis or Sequelae/i)).toBeInTheDocument();
    expect(screen.getByText(/4. oTher Causes for Fall/i)).toBeInTheDocument();
  });

  it('switches tabs to Anti-PF4 ELISA & SRA Bench and validates controls', () => {
    render(<HitArgatrobanSimulator />);

    const serologyTab = screen.getByRole('button', { name: /Anti-PF4 ELISA & SRA Bench/i });
    fireEvent.click(serologyTab);

    expect(screen.getByText(/Anti-PF4\/Heparin Immunoassay \(ELISA\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Serotonin Release Assay \(SRA - Gold Standard\)/i)).toBeInTheDocument();
    expect(screen.getByText(/The "Antigen Excess" Phenomenon:/i)).toBeInTheDocument();
  });

  it('switches tabs to DTI Dosing and selects Bivalirudin', () => {
    render(<HitArgatrobanSimulator />);

    const dtiTab = screen.getByRole('button', { name: /Argatroban vs Bivalirudin Dosing/i });
    fireEvent.click(dtiTab);

    expect(screen.getByText(/Direct Thrombin Inhibitor \(DTI\) Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Pharmacokinetics & aPTT Titration/i)).toBeInTheDocument();

    const bivalirudinBtns = screen.getAllByRole('button', { name: /Bivalirudin/i });
    expect(bivalirudinBtns.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(bivalirudinBtns[0]);
  });

  it('switches tabs to Warfarin Safety and toggles danger interlocks', () => {
    render(<HitArgatrobanSimulator />);

    const warfarinTab = screen.getByRole('button', { name: /The Warfarin Gangrene Trap/i });
    fireEvent.click(warfarinTab);

    expect(screen.getByText(/The "Warfarin Gangrene Trap" & Protein C Dynamics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Venous Limb Gangrene/i).length).toBeGreaterThanOrEqual(1);

    // Toggle platelet transfusion simulation checkbox
    const plateletTransfusionLabel = screen.getByText(/Platelet Transfusion Administered/i);
    fireEvent.click(plateletTransfusionLabel);

    // Toggle warfarin simulation checkbox
    const warfarinLabel = screen.getByText(/Warfarin Given During Acute HIT/i);
    fireEvent.click(warfarinLabel);
  });
});
