import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusAsthmaticusSimulator from '../../components/simulators/StatusAsthmaticusSimulator';

describe('StatusAsthmaticusSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<StatusAsthmaticusSimulator />);

    expect(
      screen.getByText(/Acute Severe Asthma & Status Asthmaticus Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Airway Severity/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/PaCO2 Crossover/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Total PEEP/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Preload Deficit/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Pharmacotherapy/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clinical presets and applies Ventilator PEA Arrest preset', () => {
    render(<StatusAsthmaticusSimulator />);

    const presetButtons = screen.getAllByRole('button', { name: /Ventilator Dynamic/i });
    expect(presetButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(presetButtons[0]);

    // Should trigger emergency disconnect directive
    expect(screen.getAllByText(/CIRCUIT DISCONNECT MANDATORY|EMERGENCY CIRCUIT DISCONNECT/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Airway Phenotype and adjusts dyspnea grade', () => {
    render(<StatusAsthmaticusSimulator />);

    const phenoTab = screen.getByRole('button', { name: /Airway Phenotype/i });
    fireEvent.click(phenoTab);

    expect(screen.getAllByText(/Demographics & Bedside Auscultation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/PEF Spirometry & Arterial Blood Gas/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Auto-PEEP & Ventilation and toggles ventilator controls', () => {
    render(<StatusAsthmaticusSimulator />);

    const ventTab = screen.getByRole('button', { name: /Auto-PEEP & Ventilation/i });
    fireEvent.click(ventTab);

    expect(screen.getAllByText(/Mechanical Ventilation Console/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Dynamic Hyperinflation Emergency Console/i).length).toBeGreaterThanOrEqual(1);

    const ventCheck = screen.getByLabelText(/Intubated & Ventilated/i);
    fireEvent.click(ventCheck);
  });

  it('switches tabs to Pharmacotherapy Escalation and toggles medications', () => {
    render(<StatusAsthmaticusSimulator />);

    const rxTab = screen.getByRole('button', { name: /Pharmacotherapy Escalation/i });
    fireEvent.click(rxTab);

    expect(screen.getAllByText(/First-Line Bronchodilator Escalation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Parenteral & Second-Line Bronchodilators/i).length).toBeGreaterThanOrEqual(1);

    const sabaCheck = screen.getByLabelText(/Continuous Albuterol/i);
    fireEvent.click(sabaCheck);
  });

  it('switches tabs to Permissive Hypercapnia Protocol and views safety targets', () => {
    render(<StatusAsthmaticusSimulator />);

    const hyperTab = screen.getByRole('button', { name: /Permissive Hypercapnia Protocol/i });
    fireEvent.click(hyperTab);

    expect(screen.getAllByText(/Permissive Hypercapnia Safe Targets/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Contraindications to Permissive Hypercapnia/i).length).toBeGreaterThanOrEqual(1);
  });
});
