import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AcuteLimbIschemiaSimulator from '../../components/simulators/AcuteLimbIschemiaSimulator';

describe('AcuteLimbIschemiaSimulator Component', () => {
  it('1. renders workstation title and clinical badge', () => {
    render(<AcuteLimbIschemiaSimulator />);
    expect(screen.getByText(/Acute Limb Ischemia \(ALI\) & Revascularization Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B44 • Route #245/i)).toBeInTheDocument();
  });

  it('2. displays hero 4-panel grid metrics and Rutherford staging', () => {
    render(<AcuteLimbIschemiaSimulator />);
    expect(screen.getAllByText(/RUTHERFORD CLASSIFICATION/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/DELTA PERFUSION PRESSURE/i)).toBeInTheDocument();
    expect(screen.getByText(/REPERFUSION WASHOUT RISK/i)).toBeInTheDocument();
    expect(screen.getByText(/SURGICAL SAFETY & SALVAGE/i)).toBeInTheDocument();
  });

  it('3. navigates across all four interactive clinical tabs', () => {
    render(<AcuteLimbIschemiaSimulator />);

    // Tab 2: Revascularization
    const revascTab = screen.getByRole('button', { name: /2\. Revascularization: Fogarty vs CDT/i });
    fireEvent.click(revascTab);
    expect(screen.getByText(/The Golden Rules of ALI Revascularization/i)).toBeInTheDocument();

    // Tab 3: Reperfusion & Compartment Syndrome
    const compTab = screen.getByRole('button', { name: /3\. Reperfusion Injury & Compartment Syndrome/i });
    fireEvent.click(compTab);
    expect(screen.getByText(/The Delta Perfusion Formula:/i)).toBeInTheDocument();
    expect(screen.getByText(/The 4 Calf Compartments/i)).toBeInTheDocument();

    // Tab 4: Clinical Pearls & Guidelines
    const pearlsTab = screen.getByRole('button', { name: /4\. Clinical Pearls & Guidelines/i });
    fireEvent.click(pearlsTab);
    expect(screen.getByText(/Step-by-Step Clinical Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/The Reperfusion Catastrophe/i)).toBeInTheDocument();
  });

  it('4. activates CDT trap preset and triggers critical alert for contraindicated CDT', () => {
    render(<AcuteLimbIschemiaSimulator />);
    const cdtTrapBtn = screen.getByRole('button', { name: /CDT in Class IIb \(Lethal Delay Trap\)/i });
    fireEvent.click(cdtTrapBtn);

    expect(screen.getAllByText(/CONTRAINDICATED CDT HAZARD/i).length).toBeGreaterThan(0);
  });

  it('5. triggers alert for lethal reperfusion catastrophe on Class III preset', () => {
    render(<AcuteLimbIschemiaSimulator />);
    const lethalBtn = screen.getByRole('button', { name: /Reperfusion of Class III \(Washout Catastrophe\)/i });
    fireEvent.click(lethalBtn);

    expect(screen.getAllByText(/LETHAL REPERFUSION RESUSCITATION CATASTROPHE/i).length).toBeGreaterThan(0);
  });
});
