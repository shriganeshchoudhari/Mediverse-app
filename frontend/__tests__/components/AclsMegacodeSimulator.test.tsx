import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AclsMegacodeSimulator from '../../components/simulators/AclsMegacodeSimulator';

describe('AclsMegacodeSimulator Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.clearAllTimers();
    });
    jest.useRealTimers();
  });

  it('renders megacode header, defibrillator console, and CPR telemetry', () => {
    render(<AclsMegacodeSimulator />);

    expect(
      screen.getByText('Advanced Cardiovascular Life Support (ACLS) Megacode Simulator')
    ).toBeInTheDocument();

    expect(screen.getByText(/LIFEPAK \/ ZOLL Biphasic Defibrillator/i)).toBeInTheDocument();
    expect(screen.getByText(/Ventricular Fibrillation \(VF\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2-Minute CPR Cycle Timer/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time CPR Metrics/i)).toBeInTheDocument();
  });

  it('charges capacitor and delivers 200J biphasic shock', () => {
    render(<AclsMegacodeSimulator />);

    // Click Charge
    const chargeBtn = screen.getByRole('button', { name: /CHARGE \(200J\)/i });
    fireEvent.click(chargeBtn);

    expect(screen.getByText(/Defibrillator capacitor charged to 200J biphasic/i)).toBeInTheDocument();

    // Deliver Shock
    const shockBtn = screen.getByRole('button', { name: /⚡ DELIVER SHOCK/i });
    fireEvent.click(shockBtn);

    expect(screen.getByText(/Shock #1 \(200J\) delivered/i)).toBeInTheDocument();
  });

  it('administers Epinephrine 1 mg IV push', () => {
    render(<AclsMegacodeSimulator />);

    const epiBtn = screen.getByRole('button', { name: /Give Epinephrine 1 mg IV Push/i });
    fireEvent.click(epiBtn);

    expect(screen.getByText(/Epinephrine 1 mg IV administered/i)).toBeInTheDocument();
    expect(screen.getByText(/Total: 1 doses/i)).toBeInTheDocument();
  });

  it('toggles H\'s and T\'s tabs and treats tension pneumothorax', () => {
    render(<AclsMegacodeSimulator />);

    // Click The 5 T's tab
    const tTabBtn = screen.getByRole('button', { name: /The 5 T's/i });
    fireEvent.click(tTabBtn);

    expect(screen.getByText('Tension Pneumothorax')).toBeInTheDocument();
    expect(screen.getByText('Tamponade (Cardiac)')).toBeInTheDocument();

    const decompressBtn = screen.getByRole('button', { name: /Needle Decompress/i });
    fireEvent.click(decompressBtn);

    expect(screen.getByText(/Intervention completed/i)).toBeInTheDocument();
  });

  it('opens AHA ACLS debrief modal and displays score breakdown', () => {
    render(<AclsMegacodeSimulator />);

    const debriefBtn = screen.getByRole('button', { name: /AHA Debrief/i });
    fireEvent.click(debriefBtn);

    expect(screen.getByText('AHA ACLS Megacode Resuscitation Debrief')).toBeInTheDocument();
    expect(screen.getByText('Overall Megacode Score')).toBeInTheDocument();
    expect(screen.getByText('Rhythm Recognition')).toBeInTheDocument();
    expect(screen.getByText('Shock Timing')).toBeInTheDocument();
    expect(screen.getByText('Medication Intervals')).toBeInTheDocument();
    expect(screen.getByText('CPR Quality')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close Debrief/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText('AHA ACLS Megacode Resuscitation Debrief')).not.toBeInTheDocument();
  });
});