import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CodeTeamCrmSimulator from '@/components/simulators/CodeTeamCrmSimulator';

describe('CodeTeamCrmSimulator Component', () => {
  it('1. renders hero header and main title', () => {
    render(<CodeTeamCrmSimulator />);
    expect(
      screen.getByText(/Multi-User Code Team & Virtual OR Crisis Resource Management/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Track C5 • Crisis Resource Management \(CRM\) & Code Team/i)
    ).toBeInTheDocument();
  });

  it('2. allows switching resuscitation scenarios', () => {
    render(<CodeTeamCrmSimulator />);
    const peScenarioBtn = screen.getByText(/Medical ICU: Post-Op Massive PE with Sudden PEA Arrest/i);
    fireEvent.click(peScenarioBtn);
    expect(
      screen.getByText(/Acute profound hypoxemia, hypotension, and PEA arrest/i)
    ).toBeInTheDocument();
  });

  it('3. allows swapping compressors and updates action', () => {
    render(<CodeTeamCrmSimulator />);
    const swapBtn = screen.getByRole('button', { name: /Rotate Compressor \(Swap\)/i });
    fireEvent.click(swapBtn);
    expect(
      screen.getByText(/David Miller, RN/i)
    ).toBeInTheDocument();
  });

  it('4. pre-charges defibrillator and delivers shock', () => {
    render(<CodeTeamCrmSimulator />);
    const chargeBtn = screen.getByRole('button', { name: /Pre-Charge 200J/i });
    fireEvent.click(chargeBtn);
    expect(screen.getByText(/CHARGED \(200J\)/i)).toBeInTheDocument();

    const shockBtn = screen.getByRole('button', { name: /Deliver Shock/i });
    fireEvent.click(shockBtn);
  });

  it('5. switches to ACLS Algorithm & CRM Principles tab', () => {
    render(<CodeTeamCrmSimulator />);
    const aclsTab = screen.getByRole('button', { name: /AHA ACLS Algorithm & CRM Principles/i });
    fireEvent.click(aclsTab);
    expect(
      screen.getByText(/Shockable Rhythms \(VF \/ pVT\):/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Non-Shockable \(Asystole \/ PEA\):/i)
    ).toBeInTheDocument();
  });
});
