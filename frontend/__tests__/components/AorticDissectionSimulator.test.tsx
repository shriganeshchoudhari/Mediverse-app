import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AorticDissectionSimulator from '../../components/simulators/AorticDissectionSimulator';

describe('AorticDissectionSimulator Component', () => {
  it('1. renders workstation title and clinical badge', () => {
    render(<AorticDissectionSimulator />);
    expect(screen.getByText(/Acute Aortic Syndromes & Aortic Dissection Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B42 • Route #243/i)).toBeInTheDocument();
  });

  it('2. displays hero 4-panel grid metrics and initial Stanford classification', () => {
    render(<AorticDissectionSimulator />);
    expect(screen.getByText(/STANFORD CLASSIFICATION/i)).toBeInTheDocument();
    expect(screen.getByText(/ANTI-IMPULSE METRICS \(dP\/dt\)/i)).toBeInTheDocument();
    expect(screen.getByText(/HEMODYNAMICS & PRESSURE/i)).toBeInTheDocument();
    expect(screen.getByText(/MORTALITY & MALPERFUSION/i)).toBeInTheDocument();
  });

  it('3. navigates across all four interactive clinical tabs', () => {
    render(<AorticDissectionSimulator />);

    // Tab 2: Classification & Anatomy
    const anatTab = screen.getByRole('button', { name: /2\. Classification & Anatomy/i });
    fireEvent.click(anatTab);
    expect(screen.getByText(/Anatomical Classification & Aortic Caliber/i)).toBeInTheDocument();
    expect(screen.getByText(/Valvular & Pericardial Extension/i)).toBeInTheDocument();

    // Tab 3: Branch Malperfusion
    const malTab = screen.getByRole('button', { name: /3\. Branch Malperfusion Syndromes/i });
    fireEvent.click(malTab);
    expect(screen.getByText(/End-Organ Malperfusion Syndromes \(30% Incidence\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Dynamic vs\. Static Obstruction/i)).toBeInTheDocument();

    // Tab 4: Surgery & TEVAR
    const surgTab = screen.getByRole('button', { name: /4\. Surgical Repair & TEVAR/i });
    fireEvent.click(surgTab);
    expect(screen.getByText(/Surgical & Endovascular Interventions/i)).toBeInTheDocument();
    expect(screen.getByText(/The Pericardiocentesis Dilemma in Type A Dissection:/i)).toBeInTheDocument();
  });

  it('4. activates presets and triggers critical alert for The Vasodilator Catastrophe', () => {
    render(<AorticDissectionSimulator />);
    const disasterBtn = screen.getByRole('button', { name: /The Vasodilator Catastrophe \(Trap\)/i });
    fireEvent.click(disasterBtn);

    expect(screen.getAllByText(/THE VASODILATOR CATASTROPHE/i).length).toBeGreaterThan(0);
  });

  it('5. triggers critical blowout alert for pericardiocentesis hazard preset', () => {
    render(<AorticDissectionSimulator />);
    const blowoutBtn = screen.getByRole('button', { name: /Tamponade Pericardiocentesis Blowout \(Hazard\)/i });
    fireEvent.click(blowoutBtn);

    expect(screen.getAllByText(/LETHAL PERICARDIOCENTESIS BLOWOUT/i).length).toBeGreaterThan(0);
  });
});
