import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TcaToxicityBicarbonateSimulator from '../../components/simulators/TcaToxicityBicarbonateSimulator';

describe('TcaToxicityBicarbonateSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<TcaToxicityBicarbonateSimulator />);

    expect(
      screen.getByText(/Tricyclic Antidepressant \(TCA\) Overdose Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/QRS Duration/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Terminal R \(aVR\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Serum Alkalinization/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Hemodynamics/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Antidote Safety/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clinical presets and applies Physostigmine Trap preset', () => {
    render(<TcaToxicityBicarbonateSimulator />);

    const presetButtons = screen.getAllByRole('button', { name: /Physostigmine/i });
    expect(presetButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(presetButtons[0]);

    // Should trigger lethal antidote trap warning
    expect(screen.getAllByText(/LETHAL ANTIDOTE TRAP TRIPPED|ASYSTOLE/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to 12-Lead ECG Biomarkers and views electrophysiology', () => {
    render(<TcaToxicityBicarbonateSimulator />);

    const ecgTab = screen.getByRole('button', { name: /12-Lead ECG Biomarkers/i });
    fireEvent.click(ecgTab);

    expect(screen.getAllByText(/12-Lead ECG Conduction Biomarkers/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Electrophysiologic Risk Stratification/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Sodium Bicarbonate Titration and toggles bolus status', () => {
    render(<TcaToxicityBicarbonateSimulator />);

    const bicarbTab = screen.getByRole('button', { name: /Sodium Bicarbonate Titration/i });
    fireEvent.click(bicarbTab);

    expect(screen.getAllByText(/Hypertonic Sodium Bicarbonate/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Calculated Antidote Order/i).length).toBeGreaterThanOrEqual(1);

    const bolusBtn = screen.getByRole('button', { name: /BOLUS PENDING|BOLUS GIVEN/i });
    fireEvent.click(bolusBtn);
  });

  it('switches tabs to Toxicodynamics & Resuscitation and views vasopressors', () => {
    render(<TcaToxicityBicarbonateSimulator />);

    const toxTab = screen.getByRole('button', { name: /Toxicodynamics & Resuscitation/i });
    fireEvent.click(toxTab);

    expect(screen.getAllByText(/Ingestion Details & Anticholinergic Exam/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Vasopressors & Antiarrhythmic Selection/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Refractory Rescue and views ILE and ECMO sections', () => {
    render(<TcaToxicityBicarbonateSimulator />);

    const rescueTab = screen.getByRole('button', { name: /Refractory Rescue/i });
    fireEvent.click(rescueTab);

    expect(screen.getAllByText(/20% Intravenous Lipid Emulsion \(ILE\) Rescue/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Venoarterial ECMO & Refractory Cardiotoxicity/i).length).toBeGreaterThanOrEqual(1);
  });
});
