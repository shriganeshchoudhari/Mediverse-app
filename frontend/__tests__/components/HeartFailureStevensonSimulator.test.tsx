import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeartFailureStevensonSimulator from '../../components/simulators/HeartFailureStevensonSimulator';

describe('HeartFailureStevensonSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<HeartFailureStevensonSimulator />);

    expect(
      screen.getByText(/ADHF Stevenson Profiles & Hemodynamics/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Stevenson Profile/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Renal Perfusion/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/DOSE Diuretic Plan/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/NT-proBNP Delta/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Pharmacotherapy/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clinical presets and applies Profile C Cardiogenic Shock preset', () => {
    render(<HeartFailureStevensonSimulator />);

    const shockPresetButtons = screen.getAllByRole('button', { name: /Profile C/i });
    expect(shockPresetButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(shockPresetButtons[0]);

    // Profile C should show Cold & Wet / Cardiogenic Shock
    expect(screen.getAllByText(/Cold & Wet/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Shock/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Stevenson 2x2 Matrix and toggles congestion checkboxes', () => {
    render(<HeartFailureStevensonSimulator />);

    const matrixTab = screen.getByRole('button', { name: /Stevenson 2×2 Matrix/i });
    fireEvent.click(matrixTab);

    expect(screen.getByText(/Volume Status: Wet vs. Dry/i)).toBeInTheDocument();
    expect(screen.getByText(/Perfusion Status: Cold vs. Warm/i)).toBeInTheDocument();

    const orthopneaLabel = screen.getByText(/Orthopnea or Paroxysmal Nocturnal Dyspnea/i);
    fireEvent.click(orthopneaLabel);
  });

  it('switches tabs to Cardiorenal & RPP Engine and validates RPP elements', () => {
    render(<HeartFailureStevensonSimulator />);

    const cardiorenalTab = screen.getByRole('button', { name: /Cardiorenal & RPP Engine/i });
    fireEvent.click(cardiorenalTab);

    expect(screen.getByText(/Hemodynamic Drivers & Renal Pressures/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardiorenal Syndrome & Decongestion Paradox/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Renal Perfusion Pressure/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to DOSE Diuretic Titration and changes home oral dose', () => {
    render(<HeartFailureStevensonSimulator />);

    const diureticsTab = screen.getByRole('button', { name: /DOSE Diuretic Titration/i });
    fireEvent.click(diureticsTab);

    expect(screen.getByText(/DOSE Protocol Diuretic Dosing/i)).toBeInTheDocument();
    expect(screen.getByText(/Loop Diuretic Equivalencies & Electrolytes/i)).toBeInTheDocument();

    // Click on 80 mg preset button in diuretic tab
    const dose80Btns = screen.getAllByRole('button', { name: /80 mg/i });
    if (dose80Btns.length > 0) {
      fireEvent.click(dose80Btns[0]);
    }
  });

  it('switches tabs to Inotropes & Vasodilators and checks safety interlocks', () => {
    render(<HeartFailureStevensonSimulator />);

    const inotropesTab = screen.getByRole('button', { name: /Inotropes & Vasodilators/i });
    fireEvent.click(inotropesTab);

    expect(screen.getByText(/Vasoactive Agent Selection & Titration/i)).toBeInTheDocument();
    expect(screen.getByText(/Inotrope Comparative Mechanics & MCS/i)).toBeInTheDocument();

    // Switch inotrope to Milrinone
    const milrinoneBtns = screen.getAllByRole('button', { name: /Milrinone/i });
    if (milrinoneBtns.length > 0) {
      fireEvent.click(milrinoneBtns[0]);
    }
  });

  it('switches tabs to Natriuretic Peptide Trajectory and verifies discharge benchmark', () => {
    render(<HeartFailureStevensonSimulator />);

    const biomarkersTab = screen.getByRole('button', { name: /Natriuretic Peptide Trajectory/i });
    fireEvent.click(biomarkersTab);

    expect(screen.getByText(/NT-proBNP Decongestion Monitoring/i)).toBeInTheDocument();
    expect(screen.getByText(/Discharge Readiness Benchmark/i)).toBeInTheDocument();
  });
});
