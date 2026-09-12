import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VirtualOrTeamCrmSimulator from '../../components/simulators/VirtualOrTeamCrmSimulator';

describe('VirtualOrTeamCrmSimulator Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.clearAllTimers();
    });
    jest.useRealTimers();
  });

  it('renders simulator header, telemetry monitors, and team members', () => {
    render(<VirtualOrTeamCrmSimulator />);

    expect(
      screen.getByText('Virtual OR & Surgical Airway Team Dynamics Simulator')
    ).toBeInTheDocument();

    expect(screen.getByText(/SpO2 \(Pulse Ox\)/i)).toBeInTheDocument();
    expect(screen.getByText(/HR \(ECG\)/i)).toBeInTheDocument();
    expect(screen.getByText(/NIBP/i)).toBeInTheDocument();

    // Check team members
    expect(screen.getByText('Dr. Marcus Vance, MD')).toBeInTheDocument();
    expect(screen.getByText('Nurse Jessica Reed, BSN, RN')).toBeInTheDocument();
    expect(screen.getByText('David Chen, CST')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Al-Mansoor, MD, FACS')).toBeInTheDocument();
  });

  it('handles Plan A intubation attempt and updates counter', () => {
    render(<VirtualOrTeamCrmSimulator />);

    const attemptBtn = screen.getByRole('button', { name: /Attempt Video Laryngoscopy/i });
    fireEvent.click(attemptBtn);

    expect(screen.getByText(/Attempts: 1\/3/i)).toBeInTheDocument();
    expect(screen.getByText(/Glottic aperture completely obstructed/i)).toBeInTheDocument();
  });

  it('triggers CICO declaration and activates Plan D', () => {
    render(<VirtualOrTeamCrmSimulator />);

    const cicoBtn = screen.getByRole('button', { name: /DECLARE CICO EMERGENCY/i });
    fireEvent.click(cicoBtn);

    expect(screen.getByText(/CICO DECLARED \(PLAN D ACTIVE\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Cannot Intubate Cannot Oxygenate \(CICO\)/i)).toBeInTheDocument();
  });

  it('executes full surgical scalpel-bougie-tube cricothyroidotomy sequence', () => {
    render(<VirtualOrTeamCrmSimulator />);

    // Step 1: Handshake
    const step1Btn = screen.getByRole('button', { name: /Perform Handshake/i });
    fireEvent.click(step1Btn);
    expect(screen.getByRole('button', { name: /Handshake Completed ✓/i })).toBeInTheDocument();

    // Step 2: Incision
    const step2Btn = screen.getByRole('button', { name: /Make Incision & Rotate/i });
    fireEvent.click(step2Btn);
    expect(screen.getByRole('button', { name: /Incision & Blade Turned ✓/i })).toBeInTheDocument();

    // Step 3: Bougie
    const step3Btn = screen.getByRole('button', { name: /Insert Bougie/i });
    fireEvent.click(step3Btn);
    expect(screen.getByRole('button', { name: /Bougie Railroaded ✓/i })).toBeInTheDocument();

    // Step 4: Railroad ETT
    const step4Btn = screen.getByRole('button', { name: /Railroad 6.0 ETT/i });
    fireEvent.click(step4Btn);
    expect(screen.getByRole('button', { name: /Tube Railroaded ✓/i })).toBeInTheDocument();

    // Step 5: Inflate & Confirm
    const step5Btn = screen.getByRole('button', { name: /Inflate & Confirm/i });
    fireEvent.click(step5Btn);
    expect(screen.getByRole('button', { name: /Airway Restored ✓/i })).toBeInTheDocument();

    // Capnography should now confirm square wave
    expect(screen.getByText(/NORMAL RECTANGULAR WAVE/i)).toBeInTheDocument();
  });

  it('opens CRM Debrief modal and displays rubric breakdown and grade', () => {
    render(<VirtualOrTeamCrmSimulator />);

    const debriefBtn = screen.getByRole('button', { name: /CRM Debrief/i });
    fireEvent.click(debriefBtn);

    expect(
      screen.getByText('Crisis Resource Management (CRM) Debrief Rubric')
    ).toBeInTheDocument();
    expect(screen.getByText('Closed-Loop Communication')).toBeInTheDocument();
    expect(screen.getByText('DAS Algorithm Adherence')).toBeInTheDocument();
    expect(screen.getByText('CICO Declaration Timing')).toBeInTheDocument();
    expect(screen.getByText('Surgical Technical Skill')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close Debrief/i });
    fireEvent.click(closeBtn);
    expect(
      screen.queryByText('Crisis Resource Management (CRM) Debrief Rubric')
    ).not.toBeInTheDocument();
  });
});