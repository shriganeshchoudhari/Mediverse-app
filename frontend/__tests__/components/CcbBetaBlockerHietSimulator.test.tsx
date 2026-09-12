import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CcbBetaBlockerHietSimulator from '../../components/simulators/CcbBetaBlockerHietSimulator';

describe('CcbBetaBlockerHietSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<CcbBetaBlockerHietSimulator />);

    expect(
      screen.getByText(/Calcium Channel Blocker & Beta-Blocker Toxicity Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Hemodynamics/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/HIET Rate/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Blood Glucose/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Serum Potassium/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/IV Calcium/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clinical presets and applies Propranolol Seizure preset', () => {
    render(<CcbBetaBlockerHietSimulator />);

    const presetButtons = screen.getAllByRole('button', { name: /Propranolol/i });
    expect(presetButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(presetButtons[0]);

    // Propranolol preset triggers QRS widening and sodium bicarbonate alert in Synthesis tab
    expect(screen.getAllByText(/Sodium-Channel Blockade|Sodium Bicarbonate/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Toxicology Phenotype and adjusts hemodynamic values', () => {
    render(<CcbBetaBlockerHietSimulator />);

    const phenoTab = screen.getByRole('button', { name: /Toxicology Phenotype/i });
    fireEvent.click(phenoTab);

    expect(screen.getAllByText(/Ingestion Details & Agent Phenotype/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Cardiovascular Hemodynamics & Biomarkers/i).length).toBeGreaterThanOrEqual(1);

    // Toggle central access
    const centralCheck = screen.getByLabelText(/Central Venous Access Established/i);
    expect(centralCheck).toBeInTheDocument();
    fireEvent.click(centralCheck);
  });

  it('switches tabs to HIET Titration Engine and toggles HIET state', () => {
    render(<CcbBetaBlockerHietSimulator />);

    const hietTab = screen.getByRole('button', { name: /HIET Titration Engine/i });
    fireEvent.click(hietTab);

    expect(screen.getAllByText(/High-Dose Insulin Euglycemia Therapy/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Calculated HIET Infusion Order/i).length).toBeGreaterThanOrEqual(1);

    const hietBtn = screen.getByRole('button', { name: /HIET ACTIVE|HIET STOPPED/i });
    fireEvent.click(hietBtn);
  });

  it('switches tabs to Calcium & Adjuvants and toggles salt type', () => {
    render(<CcbBetaBlockerHietSimulator />);

    const caTab = screen.getByRole('button', { name: /Calcium & Adjuvants/i });
    fireEvent.click(caTab);

    expect(screen.getAllByText(/IV Calcium Salt Administration/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Glucagon & Vasopressor Therapeutics/i).length).toBeGreaterThanOrEqual(1);

    const caGluconateBtn = screen.getByRole('button', { name: /Calcium Gluconate 10%/i });
    fireEvent.click(caGluconateBtn);
  });

  it('switches tabs to Refractory Rescue and views ILE and ECMO sections', () => {
    render(<CcbBetaBlockerHietSimulator />);

    const rescueTab = screen.getByRole('button', { name: /Refractory Rescue/i });
    fireEvent.click(rescueTab);

    expect(screen.getAllByText(/20% Intravenous Lipid Emulsion/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Extracorporeal Life Support/i).length).toBeGreaterThanOrEqual(1);
  });
});
