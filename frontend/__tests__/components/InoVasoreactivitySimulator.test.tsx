import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InoVasoreactivitySimulator from '../../components/simulators/InoVasoreactivitySimulator';

describe('InoVasoreactivitySimulator Component', () => {
  it('renders the iNO and acute vasoreactivity workstation title and key panels', () => {
    render(<InoVasoreactivitySimulator />);

    expect(
      screen.getByText(/Inhaled Nitric Oxide \(iNO\) & Acute Vasoreactivity Testing Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Baseline Right Heart Catheterization/i)).toBeInTheDocument();
    expect(screen.getByText(/Vasoreactivity Challenge & Circuit/i)).toBeInTheDocument();
    expect(screen.getByText(/ESC\/ERS Positive AVT Criteria \(Sitbon\)/i)).toBeInTheDocument();
  });

  it('correctly assesses positive responder on default IPAH responder preset', () => {
    render(<InoVasoreactivitySimulator />);

    // Default preset or clicking responder preset
    const responderPresetBtn = screen.getByText(/IPAH Vasoreactive Responder/i);
    fireEvent.click(responderPresetBtn);

    // Meets Sitbon criteria -> POSITIVE RESPONDER
    expect(screen.getAllByText(/POSITIVE RESPONDER/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(/High-Dose Oral Calcium Channel Blocker Trial/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('correctly assesses non-responder on fixed PAH preset', () => {
    render(<InoVasoreactivitySimulator />);

    const nonResponderBtn = screen.getByText(/Severe Fixed PAH Non-Responder/i);
    fireEvent.click(nonResponderBtn);

    // Fails criteria -> NON-RESPONDER
    expect(screen.getAllByText(/NON-RESPONDER/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/STRICTLY CONTRAINDICATED/i)).toBeInTheDocument();
  });

  it('triggers rebound pulmonary hypertension alert on abrupt cessation', () => {
    render(<InoVasoreactivitySimulator />);

    const reboundPresetBtn = screen.getByText(/Abrupt iNO Cessation & Rebound Crisis/i);
    fireEvent.click(reboundPresetBtn);

    expect(screen.getByText(/CRITICAL REBOUND HYPERTENSION/i)).toBeInTheDocument();
  });

  it('triggers toxic methemoglobinemia and NO2 alerts on high dose', () => {
    render(<InoVasoreactivitySimulator />);

    const toxicPresetBtn = screen.getByText(/Prolonged High-Dose iNO \(MetHb & NO2 Toxicity\)/i);
    fireEvent.click(toxicPresetBtn);

    expect(screen.getByText(/TOXIC METHEMOGLOBINEMIA/i)).toBeInTheDocument();
    expect(screen.getByText(/Methylene Blue/i)).toBeInTheDocument();
  });
});
