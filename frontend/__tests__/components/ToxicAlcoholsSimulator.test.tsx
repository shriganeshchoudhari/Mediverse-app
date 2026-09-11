import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToxicAlcoholsSimulator from '@/components/simulators/ToxicAlcoholsSimulator';

describe('ToxicAlcoholsSimulator Component', () => {
  it('renders header, ingestion controls, and biochemical solver columns', () => {
    render(<ToxicAlcoholsSimulator />);
    expect(
      screen.getByText(/Toxic Alcohols, Osmolal Gap & Fomepizole Precision Solver/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Ingestion Profile & Timing/i)).toBeInTheDocument();
    expect(screen.getByText(/Gap Dynamics & Crossover/i)).toBeInTheDocument();
    expect(screen.getByText(/Biochemical Solvers/i)).toBeInTheDocument();
  });

  it('switches to Ethylene Glycol preset and displays calcium oxalate crystals & AKI stage', () => {
    render(<ToxicAlcoholsSimulator />);
    const egPresetBtn = screen.getByRole('button', {
      name: /Ethylene Glycol Antifreeze Poisoning/i,
    });
    fireEvent.click(egPresetBtn);

    expect(screen.getAllByText(/Calcium Oxalate Crystals/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Present \(Envelope \/ Needles\)/i).length).toBeGreaterThan(0);
  });

  it('switches to Late Methanol preset and displays snowstorm blindness and hemodialysis recommendation', () => {
    render(<ToxicAlcoholsSimulator />);
    const lateMethanolBtn = screen.getByRole('button', {
      name: /Late Methanol Toxicity/i,
    });
    fireEvent.click(lateMethanolBtn);

    expect(screen.getAllByText(/SNOWSTORM BLINDNESS/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Urgent Intermittent Hemodialysis/i).length).toBeGreaterThan(0);
  });

  it('switches to Isopropanol preset and shows ketonemia with absence of acidosis', () => {
    render(<ToxicAlcoholsSimulator />);
    const isopropanolBtn = screen.getByRole('button', {
      name: /Isopropanol \(Rubbing Alcohol\) Ingestion/i,
    });
    fireEvent.click(isopropanolBtn);

    expect(screen.getAllByText(/LARGE \(Acetone\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ABSENT \(Normal pH\)/i).length).toBeGreaterThan(0);
  });
});
