import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiBedIcuCentralStation from '../../components/emr/MultiBedIcuCentralStation';

describe('MultiBedIcuCentralStation Component', () => {
  beforeEach(() => {
    // Silence audio context in jest
    window.AudioContext = jest.fn().mockImplementation(() => ({
      createOscillator: jest.fn().mockReturnValue({
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        setValueAtTime: jest.fn(),
      }),
      createGain: jest.fn().mockReturnValue({
        connect: jest.fn(),
        gain: {
          setValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn(),
        },
      }),
      destination: {},
      currentTime: 0,
      resume: jest.fn(),
      state: 'running',
    })) as unknown as typeof AudioContext;
  });

  it('renders ICU Central Telemetry Station header and all 6 beds', () => {
    render(<MultiBedIcuCentralStation />);

    expect(screen.getByText(/ICU Central Telemetry Station/i)).toBeInTheDocument();
    expect(screen.getByText(/Level 1 Trauma ICU/i)).toBeInTheDocument();

    // Check all 6 bed IDs
    expect(screen.getByTestId('bed-card-BED-01')).toBeInTheDocument();
    expect(screen.getByTestId('bed-card-BED-02')).toBeInTheDocument();
    expect(screen.getByTestId('bed-card-BED-03')).toBeInTheDocument();
    expect(screen.getByTestId('bed-card-BED-04')).toBeInTheDocument();
    expect(screen.getByTestId('bed-card-BED-05')).toBeInTheDocument();
    expect(screen.getByTestId('bed-card-BED-06')).toBeInTheDocument();

    // Check alarm counters are displayed
    expect(screen.getByTestId('crisis-counter')).toBeInTheDocument();
    expect(screen.getByTestId('warning-counter')).toBeInTheDocument();
  });

  it('filters ICU beds by unit tab', () => {
    render(<MultiBedIcuCentralStation />);

    // Click CCU filter
    const ccuBtn = screen.getByRole('button', { name: /^CCU$/i });
    fireEvent.click(ccuBtn);

    // CCU has BED-01 and BED-03
    expect(screen.getByTestId('bed-card-BED-01')).toBeInTheDocument();
    expect(screen.getByTestId('bed-card-BED-03')).toBeInTheDocument();
    expect(screen.queryByTestId('bed-card-BED-02')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bed-card-BED-04')).not.toBeInTheDocument();

    // Click back to All Units
    const allBtn = screen.getByRole('button', { name: /All Units/i });
    fireEvent.click(allBtn);
    expect(screen.getByTestId('bed-card-BED-02')).toBeInTheDocument();
  });

  it('toggles Master Silence for 120 seconds', () => {
    render(<MultiBedIcuCentralStation />);

    const silenceBtn = screen.getByRole('button', { name: /Silence All/i });
    fireEvent.click(silenceBtn);

    expect(screen.getByText(/Silenced \(120s\)/i)).toBeInTheDocument();
  });

  it('opens 6-second rhythm strip caliper modal and calculates intervals', () => {
    render(<MultiBedIcuCentralStation />);

    const sixSecButtons = screen.getAllByRole('button', { name: /6s Strip/i });
    fireEvent.click(sixSecButtons[0]); // BED-01

    expect(screen.getByText(/6-Second Diagnostic Caliper Strip/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronic Caliper Controls/i)).toBeInTheDocument();
    expect(screen.getByText(/Caliper Telemetry Measurements/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getAllByRole('button').find((btn) => btn.querySelector('svg.lucide-x'));
    if (closeBtn) fireEvent.click(closeBtn);
  });

  it('opens alarm limits editor modal and saves customized limits', () => {
    render(<MultiBedIcuCentralStation />);

    const limitsButtons = screen.getAllByRole('button', { name: /Limits/i });
    fireEvent.click(limitsButtons[0]); // BED-01

    expect(screen.getByText(/Alarm Limits • BED-01/i)).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', { name: /Save Limits/i });
    fireEvent.click(saveBtn);

    expect(screen.queryByText(/Alarm Limits • BED-01/i)).not.toBeInTheDocument();
  });

  it('opens bedside Rx modal and executes 200J Defibrillation', () => {
    render(<MultiBedIcuCentralStation />);

    const rxButtons = screen.getAllByRole('button', { name: /Bedside Rx/i });
    fireEvent.click(rxButtons[0]); // BED-01 (V-Tach)

    expect(screen.getByText(/Bedside Emergency Rx • BED-01/i)).toBeInTheDocument();

    const defibBtn = screen.getByText(/200J Biphasic Defibrillation/i);
    fireEvent.click(defibBtn);

    // Confirmation message toast should appear
    expect(screen.getByText(/200J Biphasic Shock delivered/i)).toBeInTheDocument();
  });

  it('executes bedside atropine intervention on AV block bed', () => {
    render(<MultiBedIcuCentralStation />);

    const rxButtons = screen.getAllByRole('button', { name: /Bedside Rx/i });
    fireEvent.click(rxButtons[2]); // BED-03 (3rd degree AV block)

    const atropineBtn = screen.getByText(/Atropine Sulfate 1 mg IV Push/i);
    fireEvent.click(atropineBtn);

    expect(screen.getByText(/Atropine 1 mg IV administered/i)).toBeInTheDocument();
  });
});
