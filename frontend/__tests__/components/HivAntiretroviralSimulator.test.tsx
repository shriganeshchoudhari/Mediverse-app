import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HivAntiretroviralSimulator from '@/components/simulators/HivAntiretroviralSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('HivAntiretroviralSimulator Component', () => {
  test('renders simulator title, CD4 badge, viral load badge, and safety rating', () => {
    render(<HivAntiretroviralSimulator />);
    expect(
      screen.getAllByText(/HIV Antiretroviral Therapy \(ART\) & CD4 OI Prophylaxis Workstation/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/CD4 T-Cell Count/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/HIV RNA Viral Load/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Regimen Safety/i).length).toBeGreaterThan(0);
  });

  test('renders all 8 clinical preset buttons', () => {
    render(<HivAntiretroviralSimulator />);
    expect(screen.getByRole('button', { name: /Asymptomatic CD4 520/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /PCP Prophylaxis/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CD4 < 50 Multi-OI/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cryptococcal Defer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /TB \/ Rifampin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /HLA-B\*5701 Pos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /HBV Co-Infection/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /M184V Resistance/i })).toBeInTheDocument();
  });

  test('switches to PCP Prophylaxis preset and shows PCP alert', () => {
    render(<HivAntiretroviralSimulator />);
    const pcpBtn = screen.getByRole('button', { name: /PCP Prophylaxis/i });
    fireEvent.click(pcpBtn);

    expect(
      screen.getAllByText(/CD4 LESS THAN 200 PCP PROPHYLAXIS REQUIRED/i).length
    ).toBeGreaterThan(0);
  });

  test('switches to Cryptococcal Defer preset and shows CNS IRIS deferral alarm', () => {
    render(<HivAntiretroviralSimulator />);
    const cryptoBtn = screen.getByRole('button', { name: /Cryptococcal Defer/i });
    fireEvent.click(cryptoBtn);

    expect(
      screen.getAllByText(/CRYPTOCOCCAL MENINGITIS LETHAL CNS IRIS DEFER ART/i).length
    ).toBeGreaterThan(0);
  });

  test('switches to HLA-B*5701 preset and shows fatal Abacavir warning', () => {
    render(<HivAntiretroviralSimulator />);
    const hlaBtn = screen.getByRole('button', { name: /HLA-B\*5701 Pos/i });
    fireEvent.click(hlaBtn);

    expect(
      screen.getAllByText(/HLA B5701 POSITIVE FATAL ABACAVIR HYPERSENSITIVITY/i).length
    ).toBeGreaterThan(0);
  });

  test('switches to HBV Co-infection preset and shows monotherapy resistance alarm', () => {
    render(<HivAntiretroviralSimulator />);
    const hbvBtn = screen.getByRole('button', { name: /HBV Co-Infection/i });
    fireEvent.click(hbvBtn);

    expect(
      screen.getAllByText(/HEPATITIS B COINFECTION MONOTHERAPY RESISTANCE RISK/i).length
    ).toBeGreaterThan(0);
  });

  test('navigates through all 4 interactive tabs', () => {
    render(<HivAntiretroviralSimulator />);

    // Tab 2: CD4 Staging & OI Prophylaxis Deck
    const oiTab = screen.getByRole('button', { name: /CD4 Staging & OI Prophylaxis Deck/i });
    fireEvent.click(oiTab);
    expect(screen.getByText(/CD4 T-Lymphocyte Stratification/i)).toBeInTheDocument();
    expect(screen.getByText(/Opportunistic Infection \(OI\) Prophylaxis Checklist/i)).toBeInTheDocument();

    // Tab 3: IRIS Risk & Acute Infection ART Timing
    const irisTab = screen.getByRole('button', { name: /IRIS Risk & Acute Infection ART Timing/i });
    fireEvent.click(irisTab);
    expect(screen.getByText(/Acute Opportunistic Infection & ART Timing/i)).toBeInTheDocument();
    expect(screen.getByText(/Immune Reconstitution \(IRIS\) Risk Protocol/i)).toBeInTheDocument();

    // Tab 4: Viral Suppression & CD4 Rebound
    const viralTab = screen.getByRole('button', { name: /Viral Suppression & CD4 Rebound/i });
    fireEvent.click(viralTab);
    expect(screen.getByText(/Projected 6-Month Virological & Immunological Response/i)).toBeInTheDocument();
    expect(screen.getByText(/Undetectable = Untransmittable \(U=U\) Principle/i)).toBeInTheDocument();
  });

  test('exports management plan and resets to baseline', () => {
    render(<HivAntiretroviralSimulator />);
    const exportBtn = screen.getByTitle(/Export HIV Clinical Management Record/i);
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Plan Logged!/i)).toBeInTheDocument();

    const resetBtn = screen.getByTitle(/Reset to Asymptomatic CD4 520 Baseline/i);
    fireEvent.click(resetBtn);
    expect(screen.getByRole('button', { name: /Asymptomatic CD4 520/i })).toBeInTheDocument();
  });
});
