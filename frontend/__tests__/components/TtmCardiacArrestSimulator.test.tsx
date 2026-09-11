import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TtmCardiacArrestSimulator from '../../components/simulators/TtmCardiacArrestSimulator';

describe('TtmCardiacArrestSimulator Component', () => {
  it('renders the TTM and neuroprognostication workstation title and panels', () => {
    render(<TtmCardiacArrestSimulator />);

    expect(
      screen.getByText(/Targeted Temperature Management \(TTM\) & Neuroprognostication Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Timeline & Thermal Targets/i)).toBeInTheDocument();
    expect(screen.getByText(/Metabolic & Electrolyte Kinetics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Multimodal Neuroprognostication/i).length).toBeGreaterThanOrEqual(1);
  });

  it('correctly models TTM-33°C maintenance with shivering alert', () => {
    render(<TtmCardiacArrestSimulator />);

    const shiveringPresetBtn = screen.getByText(/TTM-33°C Maintenance with Active Shivering/i);
    fireEvent.click(shiveringPresetBtn);

    expect(screen.getAllByText(/MAINTENANCE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/-28%/i).length).toBeGreaterThanOrEqual(1); // CMRO2 reduction
    expect(screen.getAllByText(/SHIVERING ALERT/i).length).toBeGreaterThanOrEqual(1);
  });

  it('detects hazardous rapid rewarming', () => {
    render(<TtmCardiacArrestSimulator />);

    const rapidRewarmPresetBtn = screen.getByText(/Hazardous Rapid Rewarming/i);
    fireEvent.click(rapidRewarmPresetBtn);

    expect(screen.getAllByText(/CONTROLLED REWARMING/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/REWARMING HYPERKALEMIA SURGE/i).length).toBeGreaterThanOrEqual(1);
  });

  it('evaluates devastating multimodal injury at 76h post-ROSC', () => {
    render(<TtmCardiacArrestSimulator />);

    const poorOutcomePresetBtn = screen.getByText(/Day 3 Multimodal Neuroprognostication \(Devastating Injury\)/i);
    fireEvent.click(poorOutcomePresetBtn);

    expect(screen.getAllByText(/≥ 72h TIMING VALID/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(/HIGH LIKELIHOOD POOR NEUROLOGICAL OUTCOME/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('evaluates favorable recovery potential at 74h', () => {
    render(<TtmCardiacArrestSimulator />);

    const favorablePresetBtn = screen.getByText(/Day 3 Favorable Neurological Recovery/i);
    fireEvent.click(favorablePresetBtn);

    expect(
      screen.getAllByText(/FAVORABLE RECOVERY POTENTIAL/i).length
    ).toBeGreaterThanOrEqual(1);
  });
});
