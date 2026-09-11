import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AcsRiskSimulator from '../../components/simulators/AcsRiskSimulator';

describe('AcsRiskSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<AcsRiskSimulator />);

    expect(
      screen.getByText(/ACS Risk Stratification & hs-cTn Delta Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/HEART Score/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/ESC Troponin Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/TIMI Risk Score/i)).toBeInTheDocument();
    expect(screen.getByText(/GRACE 2.0 Score/i)).toBeInTheDocument();
  });

  it('renders clinical presets and applies High-Risk NSTEMI preset', () => {
    render(<AcsRiskSimulator />);

    const nstemiPreset = screen.getByText(
      /High-Risk NSTEMI \(Early Invasive <24 Hours\)/i
    );
    expect(nstemiPreset).toBeInTheDocument();

    fireEvent.click(nstemiPreset);

    // Verify Rule-in pathway and high-risk status
    expect(screen.getAllByText(/RULE-IN/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/HIGH RISK/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to HEART Score Calculator and allows changing inputs', () => {
    render(<AcsRiskSimulator />);

    const heartTab = screen.getByRole('button', { name: /HEART Score Calculator/i });
    fireEvent.click(heartTab);

    expect(
      screen.getByText(/HEART Score Calculator for Emergency Room Chest Pain/i)
    ).toBeInTheDocument();

    // Select highly suspicious history
    const highlySuspiciousBtn = screen.getByText(/Highly Suspicious \(2 pts\)/i);
    fireEvent.click(highlySuspiciousBtn);

    expect(screen.getByText(/Total HEART Score/i)).toBeInTheDocument();
  });

  it('switches tabs to hs-cTn Kinetics and toggles assay type', () => {
    render(<AcsRiskSimulator />);

    const troponinTab = screen.getByRole('button', { name: /hs-cTn Kinetics & ESC Algorithm/i });
    fireEvent.click(troponinTab);

    expect(
      screen.getByText(/ESC High-Sensitivity Cardiac Troponin \(hs-cTn\) 0\/1h & 0\/2h Protocol/i)
    ).toBeInTheDocument();

    const rocheBtn = screen.getByRole('button', { name: /hs-cTnT \(Roche Elecsys\)/i });
    fireEvent.click(rocheBtn);

    expect(rocheBtn).toBeInTheDocument();
  });

  it('switches tabs to DAPT & Safety Interlocks and enforces safety warnings', () => {
    render(<AcsRiskSimulator />);

    const pharmaTab = screen.getByRole('button', { name: /DAPT & Safety Interlocks/i });
    fireEvent.click(pharmaTab);

    expect(
      screen.getByText(/Evidence-Based Pharmacotherapy & Clinical Safety Interlocks/i)
    ).toBeInTheDocument();

    // Activate Right Ventricular Infarction toggle
    const rvInfarctBtn = screen.getByText(/Right Ventricular Infarction \(Nitrates Contraindicated\)/i);
    fireEvent.click(rvInfarctBtn);

    expect(screen.getAllByText(/NITRATES STRICTLY CONTRAINDICATED/i).length).toBeGreaterThanOrEqual(1);
  });

  it('applies Cardiogenic Shock preset and triggers immediate invasive catheterization recommendation', () => {
    render(<AcsRiskSimulator />);

    const shockPreset = screen.getByText(
      /Very High-Risk ACS in Cardiogenic Shock \(Immediate Invasive <2 Hours\)/i
    );
    fireEvent.click(shockPreset);

    // Switch to Unified Synthesis tab
    const evalTab = screen.getByRole('button', { name: /Unified Clinical Synthesis/i });
    fireEvent.click(evalTab);

    expect(
      screen.getAllByText(/IMMEDIATE INVASIVE STRATEGY \(< 2 HOURS\)/i).length
    ).toBeGreaterThanOrEqual(1);
  });
});
