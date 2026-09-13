import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HepatorenalSyndromeSimulator from '../../components/simulators/HepatorenalSyndromeSimulator';

describe('HepatorenalSyndromeSimulator Component', () => {
  it('1. renders workstation title and clinical badge', () => {
    render(<HepatorenalSyndromeSimulator />);
    expect(screen.getByText(/Hepatorenal Syndrome \(HRS-AKI\), SBP & Terlipressin Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B41 • Route #242/i)).toBeInTheDocument();
  });

  it('2. displays hero 4-panel grid metrics and initial ICA-AKI Stage', () => {
    render(<HepatorenalSyndromeSimulator />);
    expect(screen.getByText(/ICA-AKI STAGE & PHENOTYPE/i)).toBeInTheDocument();
    expect(screen.getByText(/MELD-Na & TRANSPLANT TRIAGE/i)).toBeInTheDocument();
    expect(screen.getByText(/HEMODYNAMICS & PERFUSION/i)).toBeInTheDocument();
    expect(screen.getByText(/OUTCOMES & REVERSAL/i)).toBeInTheDocument();
  });

  it('3. navigates across all four interactive clinical tabs', () => {
    render(<HepatorenalSyndromeSimulator />);

    // Tab 2
    const bioTab = screen.getByRole('button', { name: /2\. Diagnostic Workup & HRS vs ATN/i });
    fireEvent.click(bioTab);
    expect(screen.getByText(/48-Hour Diagnostic Albumin Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Urine Chemistry & Structural Damage Markers/i)).toBeInTheDocument();

    // Tab 3
    const vasoTab = screen.getByRole('button', { name: /3\. Vasoactives, Terlipressin & SBP/i });
    fireEvent.click(vasoTab);
    expect(screen.getByText(/Splanchnic Vasoconstrictor Pharmacotherapy/i)).toBeInTheDocument();
    expect(screen.getByText(/Spontaneous Bacterial Peritonitis \(SBP\)/i)).toBeInTheDocument();

    // Tab 4
    const pearlsTab = screen.getByRole('button', { name: /4\. Clinical Pearls & Guidelines/i });
    fireEvent.click(pearlsTab);
    expect(screen.getByText(/Step-by-Step Resuscitation Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/CONFIRM Trial Black Box Warning: Terlipressin Hypoxemic Failure/i)).toBeInTheDocument();
  });

  it('4. activates presets and triggers critical alert for Terlipressin respiratory hazard', () => {
    render(<HepatorenalSyndromeSimulator />);
    const hazardBtn = screen.getByRole('button', { name: /Terlipressin Respiratory Hazard \(Trap\)/i });
    fireEvent.click(hazardBtn);

    expect(screen.getAllByText(/CONFIRM TRIAL BLACK BOX WARNING/i).length).toBeGreaterThan(0);
  });

  it('5. triggers Post-Paracentesis Circulatory Dysfunction (PPCD) hazard on high volume without albumin', () => {
    render(<HepatorenalSyndromeSimulator />);
    const ppcdBtn = screen.getByRole('button', { name: /Post-Paracentesis PPCD \(Albumin Deficit\)/i });
    fireEvent.click(ppcdBtn);

    expect(screen.getAllByText(/POST-PARACENTESIS CIRCULATORY DYSFUNCTION/i).length).toBeGreaterThan(0);
  });
});
