import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CirrhosisPortalHypertensionSimulator from '@/components/simulators/CirrhosisPortalHypertensionSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('CirrhosisPortalHypertensionSimulator Component', () => {
  test('renders simulator title, MELD-Na badge, Child-Pugh badge, and baseline parameters', () => {
    render(<CirrhosisPortalHypertensionSimulator />);
    expect(
      screen.getAllByText(/Hepatology, Cirrhosis Decompensation & Portal Hemodynamics/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/MELD-Na/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Child-Pugh/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/CSPH:/i)).toBeInTheDocument();
  });

  test('renders all 8 clinical preset buttons', () => {
    render(<CirrhosisPortalHypertensionSimulator />);
    expect(screen.getAllByText(/Compensated Child A/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Variceal Bleed/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SBP Peritonitis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Severe Alc Hepatitis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/HRS-AKI Type 1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hepatic Enceph/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TIPS Dysfunction/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Transplant Priority/i).length).toBeGreaterThan(0);
  });

  test('switches to Acute Variceal Hemorrhage preset and displays hemorrhage alerts', () => {
    render(<CirrhosisPortalHypertensionSimulator />);
    const varicealBtn = screen.getAllByText(/Variceal Bleed/i)[0];
    fireEvent.click(varicealBtn);

    expect(
      screen.getAllByText(/HIGH RISK VARICEAL HEMORRHAGE CRITICAL HVPG/i).length
    ).toBeGreaterThan(0);
  });

  test('switches to SBP Peritonitis preset and displays SBP emergency alert', () => {
    render(<CirrhosisPortalHypertensionSimulator />);
    const sbpBtn = screen.getAllByText(/SBP Peritonitis/i)[0];
    fireEvent.click(sbpBtn);

    expect(
      screen.getAllByText(/SPONTANEOUS BACTERIAL PERITONITIS EMERGENCY/i).length
    ).toBeGreaterThan(0);
  });

  test('switches to Severe Alcoholic Hepatitis preset and shows Maddrey alert', () => {
    render(<CirrhosisPortalHypertensionSimulator />);
    const alcBtn = screen.getAllByText(/Severe Alc Hepatitis/i)[0];
    fireEvent.click(alcBtn);

    expect(
      screen.getAllByText(/SEVERE ALCOHOLIC HEPATITIS MADDREY GE 32/i).length
    ).toBeGreaterThan(0);
  });

  test('navigates through all 4 interactive tabs', () => {
    render(<CirrhosisPortalHypertensionSimulator />);

    // Tab 2: HVPG & Variceal Hemodynamics
    const hvpgTab = screen.getByRole('button', { name: /HVPG & Variceal Hemodynamics/i });
    fireEvent.click(hvpgTab);
    expect(screen.getByText(/Hepatic Venous Pressure Measurements/i)).toBeInTheDocument();
    expect(screen.getByText(/Wedged Hepatic Venous Pressure \(WHVP\)/i)).toBeInTheDocument();

    // Tab 3: Diagnostic Paracentesis, SAAG & SBP
    const saagTab = screen.getByRole('button', { name: /Diagnostic Paracentesis, SAAG & SBP/i });
    fireEvent.click(saagTab);
    expect(screen.getByText(/Diagnostic Paracentesis Laboratory Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Serum-Ascites Albumin Gradient \(SAAG\)/i)).toBeInTheDocument();

    // Tab 4: Severe Alcoholic Hepatitis & HRS-AKI
    const alcTab = screen.getByRole('button', { name: /Severe Alcoholic Hepatitis & HRS-AKI/i });
    fireEvent.click(alcTab);
    expect(screen.getByText(/Discriminant Function \(Alcoholic Hepatitis\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Hepatorenal Syndrome \(HRS-AKI\) Protocol/i)).toBeInTheDocument();
  });

  test('exports clinical summary and resets to compensated baseline', () => {
    render(<CirrhosisPortalHypertensionSimulator />);
    const exportBtn = screen.getByTitle(/Export Hepatology Consultation Record/i);
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Consult Logged!/i)).toBeInTheDocument();

    const resetBtn = screen.getByTitle(/Reset to Compensated Cirrhosis Baseline/i);
    fireEvent.click(resetBtn);
    expect(screen.getAllByText(/Compensated Child A/i).length).toBeGreaterThan(0);
  });
});
