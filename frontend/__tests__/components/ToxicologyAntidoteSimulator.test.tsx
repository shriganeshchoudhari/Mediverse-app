import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToxicologyAntidoteSimulator from '@/components/simulators/ToxicologyAntidoteSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('ToxicologyAntidoteSimulator Component', () => {
  test('renders simulator title, primary toxidrome banner, and physical exam matrix', () => {
    render(<ToxicologyAntidoteSimulator />);
    expect(screen.getAllByText(/Clinical Toxicology, Toxidromes & Antidote Precision Solver/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Primary Toxidrome:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Toxidrome Physical Exam Matrix/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Physical Exam & Vital Signs Matrix/i)).toBeInTheDocument();
  });

  test('renders all 8 clinical toxicology overdose scenarios', () => {
    render(<ToxicologyAntidoteSimulator />);
    expect(screen.getByText(/Acute Acetaminophen Toxicity \(Rumack-Matthew\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Organophosphate Cholinergic Crisis \(Sarin\/Insecticide\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Anticholinergic Delirium \(Diphenhydramine OD\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Synthetic Opioid Toxicity \(Fentanyl Hypoventilation\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Acute Salicylate Poisoning \(Aspirin Alkalinization\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Ethylene Glycol Ingestion \(Fomepizole & Dialysis\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Serotonin Syndrome \(Hunter Criteria Met\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Refractory CCB Poisoning \(High-Dose Insulin \/ HIET\)/i)).toBeInTheDocument();
  });

  test('switches to Organophosphate Cholinergic Crisis and displays Cholinergic Killer Bs alert', () => {
    render(<ToxicologyAntidoteSimulator />);
    const opBtn = screen.getByRole('button', { name: /Organophosphate Cholinergic Crisis/i });
    fireEvent.click(opBtn);
    expect(screen.getAllByText(/CHOLINERGIC KILLER BS BRONCHORRHEA/i).length).toBeGreaterThan(0);
  });

  test('switches to Synthetic Opioid Toxicity and verifies opioid respiratory arrest alarm', () => {
    render(<ToxicologyAntidoteSimulator />);
    const fentanylBtn = screen.getByRole('button', { name: /Synthetic Opioid Toxicity/i });
    fireEvent.click(fentanylBtn);
    expect(screen.getAllByText(/OPIOID RESPIRATORY ARREST/i).length).toBeGreaterThan(0);
  });

  test('navigates to Rumack-Matthew APAP Nomogram tab and displays nomogram parameters', () => {
    render(<ToxicologyAntidoteSimulator />);
    const rumackTab = screen.getByRole('button', { name: /Rumack-Matthew APAP Nomogram & NAC/i });
    fireEvent.click(rumackTab);
    expect(screen.getAllByText(/Rumack-Matthew Acetaminophen Nomogram/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Serum APAP Level:/i)).toBeInTheDocument();
    expect(screen.getByText(/Time Since Ingestion:/i)).toBeInTheDocument();
    expect(screen.getByText(/N-Acetylcysteine \(NAC\) Protocol/i)).toBeInTheDocument();
  });

  test('navigates to Toxic Alcohols & Salicylate Alkalinization tab and displays osmolar & anion gap', () => {
    render(<ToxicologyAntidoteSimulator />);
    const alcoholTab = screen.getByRole('button', { name: /Toxic Alcohols & Salicylate Alkalinization/i });
    fireEvent.click(alcoholTab);
    expect(screen.getAllByText(/Toxic Alcohols & Osmolar Gap Solver/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Salicylate \(Aspirin\) Alkalinization/i)).toBeInTheDocument();
    expect(screen.getByText(/Measured Serum Osmolality:/i)).toBeInTheDocument();
  });

  test('navigates to Antidote Dosing & Critical Care Protocols tab and administers Naloxone', () => {
    render(<ToxicologyAntidoteSimulator />);
    const antidoteTab = screen.getByRole('button', { name: /Antidote Dosing & Critical Care Protocols/i });
    fireEvent.click(antidoteTab);
    expect(screen.getAllByText(/Emergency Antidote Administration Deck/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Naloxone \(Narcan\) Titration/i)).toBeInTheDocument();
    expect(screen.getByText(/Atropine 2-5mg IV \+ Pralidoxime 2g/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Dose Insulin Euglycemia \(HIET\)/i)).toBeInTheDocument();

    const giveNaloxoneBtn = screen.getByRole('button', { name: /Give Naloxone 0.4mg/i });
    fireEvent.click(giveNaloxoneBtn);
    expect(giveNaloxoneBtn).toBeInTheDocument();
  });

  test('resets simulator and exports toxicology consultation report', () => {
    render(<ToxicologyAntidoteSimulator />);
    const exportBtn = screen.getByRole('button', { name: /Export Tox Consultation/i });
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Report Generated!/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetBtn);
    expect(screen.getByText(/Export Tox Consultation/i)).toBeInTheDocument();
  });
});
