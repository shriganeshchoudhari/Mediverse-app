import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MassivePulmonaryEmbolismSimulator from '../../components/simulators/MassivePulmonaryEmbolismSimulator';

describe('MassivePulmonaryEmbolismSimulator Component', () => {
  it('1. renders workstation title and clinical badge', () => {
    render(<MassivePulmonaryEmbolismSimulator />);
    expect(screen.getByText(/Massive Pulmonary Embolism & RV Resuscitation Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B40 • Route #241/i)).toBeInTheDocument();
  });

  it('2. displays hero 4-panel grid metrics and initial ESC risk category', () => {
    render(<MassivePulmonaryEmbolismSimulator />);
    expect(screen.getByText(/ESC \/ AHA RISK CATEGORY/i)).toBeInTheDocument();
    expect(screen.getByText(/RV STRAIN BIOMECHANICS/i)).toBeInTheDocument();
    expect(screen.getByText(/HEMODYNAMICS & RCA PERFUSION/i)).toBeInTheDocument();
    expect(screen.getByText(/PROGNOSIS & SAFETY/i)).toBeInTheDocument();
  });

  it('3. navigates across all four interactive clinical tabs', () => {
    render(<MassivePulmonaryEmbolismSimulator />);
    
    // Tab 2
    const fluidsTab = screen.getByRole('button', { name: /2\. Fluid & Vasopressor Guardrails/i });
    fireEvent.click(fluidsTab);
    expect(screen.getByText(/Cumulative IV Fluid Administered/i)).toBeInTheDocument();
    expect(screen.getByText(/The Biophysical Paradox: RV Volume Loading/i)).toBeInTheDocument();

    // Tab 3
    const reperfusionTab = screen.getByRole('button', { name: /3\. Reperfusion & Lytics Decision/i });
    fireEvent.click(reperfusionTab);
    expect(screen.getByText(/Revascularization & Reperfusion Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Reperfusion Decision Matrix/i)).toBeInTheDocument();

    // Tab 4
    const pearlsTab = screen.getByRole('button', { name: /4\. Clinical Pearls & Guidelines/i });
    fireEvent.click(pearlsTab);
    expect(screen.getByText(/Step-by-Step Resuscitation Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/The Perils of Endotracheal Intubation in Massive PE/i)).toBeInTheDocument();
  });

  it('4. activates presets and triggers critical alert for fluid overload trap', () => {
    render(<MassivePulmonaryEmbolismSimulator />);
    const overloadPresetBtn = screen.getByRole('button', { name: /Fluid Overload Disaster \(Trap\)/i });
    fireEvent.click(overloadPresetBtn);

    // Expect critical alert banner
    expect(screen.getAllByText(/RV VOLUME OVERLOAD DISASTER/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/LETHAL VASOPRESSOR SELECTION/i).length).toBeGreaterThan(0);
  });

  it('5. allows toggling lytic contraindications in the reperfusion tab', () => {
    render(<MassivePulmonaryEmbolismSimulator />);
    const reperfusionTab = screen.getByRole('button', { name: /3\. Reperfusion & Lytics Decision/i });
    fireEvent.click(reperfusionTab);

    const bleedCheckbox = screen.getByLabelText(/Active Internal Bleeding/i);
    expect(bleedCheckbox).not.toBeChecked();
    fireEvent.click(bleedCheckbox);
    expect(bleedCheckbox).toBeChecked();
  });
});
