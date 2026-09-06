import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UreaKineticDialysisSimulator from '@/components/simulators/UreaKineticDialysisSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('UreaKineticDialysisSimulator Component', () => {
  test('renders simulator title, spKt/V badge, URR badge, and monitor alarms', () => {
    render(<UreaKineticDialysisSimulator />);
    expect(
      screen.getAllByText(/Hemodialysis Urea Kinetic Modeling \(UKM\) & Adequacy Workstation/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Delivered spKt\/V/i)).toBeInTheDocument();
    expect(screen.getByText(/URR Ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Monitor Alarms/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Dynamic Urea Kinetics & Rebound/i).length).toBeGreaterThan(0);
  });

  test('renders all 8 clinical preset buttons', () => {
    render(<UreaKineticDialysisSimulator />);
    expect(screen.getAllByText(/Standard High-Flux Hemodialysis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Underdialysis from Fistula Stenosis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dialysis Disequilibrium Syndrome Hazard/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vascular Access Recirculation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Protein-Energy Wasting/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hypercatabolic Septic ICU Patient/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Excessive Ultrafiltration Rate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Extended Nocturnal Home Hemodialysis/i).length).toBeGreaterThan(0);
  });

  test('switches to Underdialysis preset and shows inadequate spKt/V alarm', () => {
    render(<UreaKineticDialysisSimulator />);
    const underBtn = screen.getAllByText(/Underdialysis from Fistula Stenosis/i)[0];
    fireEvent.click(underBtn);

    expect(
      screen.getAllByText(/SEVERE UNDERDIALYSIS BELOW KDOQI ADEQUACY/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Inadequate/i)).toBeInTheDocument();
  });

  test('switches to Needle Reversal preset and displays elevated recirculation', () => {
    render(<UreaKineticDialysisSimulator />);
    const needleBtn = screen.getAllByText(/Vascular Access Recirculation/i)[0];
    fireEvent.click(needleBtn);

    expect(
      screen.getAllByText(/PATHOLOGICAL VASCULAR ACCESS RECIRCULATION STENOSIS/i).length
    ).toBeGreaterThan(0);
  });

  test('switches to Excessive Ultrafiltration preset and shows stunning alert', () => {
    render(<UreaKineticDialysisSimulator />);
    const ufrBtn = screen.getAllByText(/Excessive Ultrafiltration Rate/i)[0];
    fireEvent.click(ufrBtn);

    expect(
      screen.getAllByText(/EXCESSIVE ULTRAFILTRATION RATE MYOCARDIAL STUNNING RISK/i).length
    ).toBeGreaterThan(0);
  });

  test('navigates through all 4 interactive tabs', () => {
    render(<UreaKineticDialysisSimulator />);

    // Tab 2: Ultrafiltration Rate & Stunning
    const ufrTab = screen.getByRole('button', { name: /Ultrafiltration Rate & Stunning/i });
    fireEvent.click(ufrTab);
    expect(screen.getByText(/Fluid Removal & Weight Parameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Ultrafiltration Rate \(UFR\) & Cardiovascular Risk Matrix/i)).toBeInTheDocument();

    // Tab 3: Vascular Access Recirculation
    const arTab = screen.getByRole('button', { name: /Vascular Access Recirculation \(AR%\)/i });
    fireEvent.click(arTab);
    expect(screen.getByText(/Two-Needle Urea Recirculation Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Systemic Peripheral BUN \(S\)/i)).toBeInTheDocument();

    // Tab 4: KDOQI Adequacy & Nutrition
    const kdoqiTab = screen.getByRole('button', { name: /KDOQI Adequacy & Nutrition/i });
    fireEvent.click(kdoqiTab);
    expect(screen.getByText(/KDOQI Clinical Practice Guidelines for Hemodialysis Adequacy/i)).toBeInTheDocument();
    expect(screen.getByText(/Dialysis Disequilibrium Syndrome \(DDS\) Prevention Protocol/i)).toBeInTheDocument();
  });

  test('exports flowsheet and resets to baseline', () => {
    render(<UreaKineticDialysisSimulator />);
    const exportBtn = screen.getByTitle(/Export Dialysis Flowsheet Record/i);
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Flowsheet Logged!/i)).toBeInTheDocument();

    const resetBtn = screen.getByTitle(/Reset to KDOQI Adequate Baseline/i);
    fireEvent.click(resetBtn);
    expect(screen.getAllByText(/Standard High-Flux Hemodialysis/i).length).toBeGreaterThan(0);
  });
});
