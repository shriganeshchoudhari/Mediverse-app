import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StatusMigrainosusCSFLeakSimulator from '../../components/simulators/StatusMigrainosusCSFLeakSimulator';

describe('StatusMigrainosusCSFLeakSimulator Component', () => {
  it('1. renders workstation title and clinical badge', () => {
    render(<StatusMigrainosusCSFLeakSimulator />);
    expect(screen.getByText(/Status Migrainosus & Intracranial Hypotension Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B45 • Route #246/i)).toBeInTheDocument();
  });

  it('2. displays hero 4-panel grid metrics and initial CSF dynamics', () => {
    render(<StatusMigrainosusCSFLeakSimulator />);
    expect(screen.getByText(/HEADACHE PHENOTYPE/i)).toBeInTheDocument();
    expect(screen.getByText(/MONRO-KELLIE CSF DYNAMICS/i)).toBeInTheDocument();
    expect(screen.getByText(/BRAIN SAGGING & TRACTION/i)).toBeInTheDocument();
    expect(screen.getByText(/SAFETY & SEVERITY/i)).toBeInTheDocument();
  });

  it('3. navigates across all four interactive clinical tabs', () => {
    render(<StatusMigrainosusCSFLeakSimulator />);

    // Tab 2: Monro-Kellie & MRI
    const imgTab = screen.getByRole('button', { name: /2\. Monro-Kellie Dynamics & MRI/i });
    fireEvent.click(imgTab);
    expect(screen.getByText(/Monro-Kellie Biophysics/i)).toBeInTheDocument();
    expect(screen.getByText(/The Monro-Kellie Doctrine in CSF Depletion/i)).toBeInTheDocument();

    // Tab 3: Inpatient Cocktail & Blood Patch
    const txTab = screen.getByRole('button', { name: /3\. Inpatient Cocktail & Blood Patch/i });
    fireEvent.click(txTab);
    expect(screen.getByText(/Inpatient Therapeutics/i)).toBeInTheDocument();
    expect(screen.getByText(/Epidural Blood Patch Mechanics/i)).toBeInTheDocument();

    // Tab 4: Clinical Pearls & Traps
    const pearlsTab = screen.getByRole('button', { name: /4\. Clinical Pearls & Traps/i });
    fireEvent.click(pearlsTab);
    expect(screen.getByText(/Management Pearls/i)).toBeInTheDocument();
    expect(screen.getByText(/Lethal Traps in Headache Care/i)).toBeInTheDocument();
  });

  it('4. activates DHE + Triptan vasospasm trap and displays critical alert', () => {
    render(<StatusMigrainosusCSFLeakSimulator />);
    const trapBtn = screen.getByRole('button', { name: /DHE \+ Triptan Vasospasm \(Trap\)/i });
    fireEvent.click(trapBtn);

    expect(screen.getAllByText(/LETHAL VASOSPASM CATASTROPHE/i).length).toBeGreaterThan(0);
  });

  it('5. triggers alert for burr hole drainage hazard in subdural hygroma preset', () => {
    render(<StatusMigrainosusCSFLeakSimulator />);
    const burrBtn = screen.getByRole('button', { name: /Subdural Hygroma Burr Hole \(Trap\)/i });
    fireEvent.click(burrBtn);

    expect(screen.getAllByText(/SURGICAL EVACUATION DISASTER/i).length).toBeGreaterThan(0);
  });
});
