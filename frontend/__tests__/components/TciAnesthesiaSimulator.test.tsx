import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TciAnesthesiaSimulator from '@/components/simulators/TciAnesthesiaSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('TciAnesthesiaSimulator Component', () => {
  test('renders simulator title, BIS depth badge, and monitor alarms', () => {
    render(<TciAnesthesiaSimulator />);
    expect(
      screen.getAllByText(/Target-Controlled Infusion \(TCI\) & Volatile MAC Workstation/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Depth \/ BIS Index/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Monitor Alarms/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Live TCI Infusion Curves & BIS/i).length).toBeGreaterThan(0);
  });

  test('renders all 8 clinical scenario preset buttons', () => {
    render(<TciAnesthesiaSimulator />);
    expect(screen.getAllByText(/Standard Adult TIVA/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Elderly Fragile Patient/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Neuroanesthesia Cerebral Protection/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Balanced Inhalational Anesthesia/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pediatric TCI High-Clearance Kinetics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Impending Intraoperative Awareness/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Context-Sensitive Accumulation in Prolonged Obesity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Malignant Hyperthermia Trigger-Free TIVA Emergency/i).length).toBeGreaterThan(0);
  });

  test('switches to Neuroanesthesia Burst Suppression preset and shows low BIS and suppression', () => {
    render(<TciAnesthesiaSimulator />);
    const neuroBtn = screen.getAllByText(/Neuroanesthesia Cerebral Protection/i)[0];
    fireEvent.click(neuroBtn);

    expect(
      screen.getAllByText(/DEEP BURST SUPPRESSION ELECTROCORTICAL SILENCE/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/Burst Suppression/i).length).toBeGreaterThan(0);
  });

  test('switches to Impending Awareness preset and displays awareness hazard', () => {
    render(<TciAnesthesiaSimulator />);
    const awareBtn = screen.getAllByText(/Impending Intraoperative Awareness/i)[0];
    fireEvent.click(awareBtn);

    expect(
      screen.getAllByText(/AWARENESS RISK INSUFFICIENT HYPNOTIC DEPTH/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/Awareness Hazard/i).length).toBeGreaterThan(0);
  });

  test('navigates through all 4 interactive tabs', () => {
    render(<TciAnesthesiaSimulator />);

    // Tab 2: Volatile Agents & MAC
    const macTab = screen.getByRole('button', { name: /Volatile Agents & Age-Corrected MAC/i });
    fireEvent.click(macTab);
    expect(screen.getByText(/Additive Inhalational Minimum Alveolar Concentration/i)).toBeInTheDocument();
    expect(screen.getByText(/Sevoflurane \(Yellow\)/i)).toBeInTheDocument();

    // Emergency TIVA switch button inside Volatile Tab
    const tivaSwitchBtn = screen.getByRole('button', { name: /Emergency TIVA Switch/i });
    fireEvent.click(tivaSwitchBtn);
    expect(tivaSwitchBtn).toBeInTheDocument();

    // Tab 3: Synergy Surface & Isobologram
    const synergyTab = screen.getByRole('button', { name: /Hypnotic-Opioid Synergy Isobologram/i });
    fireEvent.click(synergyTab);
    expect(screen.getByText(/2D Pharmacodynamic Isobologram/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Operating Point Coordinates/i)).toBeInTheDocument();

    // Tab 4: Context-Sensitive Emergence & Protocols
    const emergenceTab = screen.getByRole('button', { name: /Context-Sensitive Emergence & Protocols/i });
    fireEvent.click(emergenceTab);
    expect(screen.getByText(/Context-Sensitive Half-Time \(CSHT\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Intraoperative Awareness Prevention Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/Malignant Hyperthermia \(MHAUS\) Immediate Action Plan/i)).toBeInTheDocument();
  });

  test('exports anesthesia record and resets to baseline', () => {
    render(<TciAnesthesiaSimulator />);
    const exportBtn = screen.getByTitle(/Export Anesthesia Simulation Record/i);
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Record Logged!/i)).toBeInTheDocument();

    const resetBtn = screen.getByTitle(/Reset to Standard Adult TIVA Baseline/i);
    fireEvent.click(resetBtn);
    expect(screen.getAllByText(/Standard Adult TIVA/i).length).toBeGreaterThan(0);
  });
});
