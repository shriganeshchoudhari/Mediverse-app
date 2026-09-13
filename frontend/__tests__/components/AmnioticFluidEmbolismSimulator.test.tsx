import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AmnioticFluidEmbolismSimulator from '../../components/simulators/AmnioticFluidEmbolismSimulator';

describe('AmnioticFluidEmbolismSimulator Component', () => {
  it('renders the workstation header and default scenario', () => {
    render(<AmnioticFluidEmbolismSimulator />);

    expect(screen.getByText(/Amniotic Fluid Embolism \(AFE\) & Collapse Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Clark Diagnostic Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Consumptive DIC Severity/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Acute Cor Pulmonale/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays Clark criteria confirmed for default Phase 1 collapse case', () => {
    render(<AmnioticFluidEmbolismSimulator />);

    expect(screen.getByText(/CLARK CRITERIA MET/i)).toBeInTheDocument();
    expect(screen.getByText(/Definite AFE \(Clark Criteria Confirmed\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/DO NOT FLUID OVERLOAD/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches to Phase 2 case and displays severe consumptive DIC and TXA directives', () => {
    render(<AmnioticFluidEmbolismSimulator />);

    const phase2Buttons = screen.getAllByText(/2. Phase 2 Crisis: Postpartum Uterine Atony/i);
    fireEvent.click(phase2Buttons[0]);

    expect(screen.getByText(/Severe Overt Hyperfibrinolytic DIC/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Tranexamic Acid/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches to chorioamnionitis septic mimic and excludes AFE due to fever', () => {
    render(<AmnioticFluidEmbolismSimulator />);

    const septicButtons = screen.getAllByText(/4. Diagnostic Mimic: Intrapartum Septic Shock/i);
    fireEvent.click(septicButtons[0]);

    expect(screen.getByText(/AFE Excluded \/ Alternative Etiology Likely/i)).toBeInTheDocument();
    expect(screen.getByText(/Fever >= 38.0 C detected/i)).toBeInTheDocument();
  });

  it('toggles A-OK protocol and updates receptor antagonism status', () => {
    render(<AmnioticFluidEmbolismSimulator />);

    const aokCheckbox = screen.getByLabelText(/A-OK Triple Therapy/i);
    fireEvent.click(aokCheckbox);

    expect(screen.getByText(/Administered/i)).toBeInTheDocument();
    expect(screen.getByText(/5-HT3 blockade/i)).toBeInTheDocument();
  });
});
