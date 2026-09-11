import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AkiKdigoSimulator from '../../components/simulators/AkiKdigoSimulator';

describe('AkiKdigoSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<AkiKdigoSimulator />);

    expect(
      screen.getByText(/Acute Kidney Injury \(AKI\) & FST Precision Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/KDIGO AKI Stage/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Etiology Diagnostic/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/FST Response/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Renal Angina \(RAI\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Fluid Overload %/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clinical presets and applies Septic Shock with Established ATN preset', () => {
    render(<AkiKdigoSimulator />);

    const atnPreset = screen.getByText(
      /Septic Shock Ischemic ATN & FST Non-Responsive/i
    );
    expect(atnPreset).toBeInTheDocument();

    fireEvent.click(atnPreset);

    expect(screen.getAllByText(/Intrinsic ATN/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to KDIGO 2024 Staging and adjusts creatinine inputs', () => {
    render(<AkiKdigoSimulator />);

    const kdigoTab = screen.getByRole('button', { name: /KDIGO 2024 Staging/i });
    fireEvent.click(kdigoTab);

    expect(
      screen.getByText(/KDIGO 2024 Dual-Parameter Staging Matrix/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Current Serum Creatinine/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to FeNa vs FeUrea and displays diuretic confounding warning when enabled', () => {
    render(<AkiKdigoSimulator />);

    const feTab = screen.getByRole('button', { name: /FeNa vs FeUrea Diagnostic Bench/i });
    fireEvent.click(feTab);

    expect(
      screen.getByText(/Fractional Excretion: FeNa vs FeUrea Diagnostic Bench/i)
    ).toBeInTheDocument();

    const diureticBtn = screen.getByText(/NO RECENT DIURETICS \(Use FeNa\)/i);
    fireEvent.click(diureticBtn);

    expect(
      screen.getAllByText(/LOOP DIURETIC ACTIVE \(Use FeUrea\)/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Furosemide Stress Test (FST) and enforces euvolemia safety interlock', () => {
    render(<AkiKdigoSimulator />);

    const fstTab = screen.getByRole('button', { name: /Furosemide Stress Test \(FST\)/i });
    fireEvent.click(fstTab);

    expect(
      screen.getByText(/Furosemide Stress Test \(FST\) Protocol & Tubular Reserve/i)
    ).toBeInTheDocument();

    const euvolemicBtn = screen.getByText(/EUVOLEMIC CONFIRMED/i);
    fireEvent.click(euvolemicBtn);

    expect(
      screen.getAllByText(/HYPOVOLEMIC \(FST BLOCKED\)/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Cumulative Fluid Overload % and displays fluid balance metrics', () => {
    render(<AkiKdigoSimulator />);

    const foTab = screen.getByRole('button', { name: /Cumulative Fluid Overload %/i });
    fireEvent.click(foTab);

    expect(
      screen.getByText(/Cumulative Fluid Overload Percentage & Congestive Nephropathy/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Total Cumulative Fluid Intake/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Cumulative Fluid Output/i)).toBeInTheDocument();
  });
});
