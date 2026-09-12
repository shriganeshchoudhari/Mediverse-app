import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BrainDeathApneaSimulator from '../../components/simulators/BrainDeathApneaSimulator';

describe('BrainDeathApneaSimulator Component', () => {
  it('renders the header title and clinical scenario selector', () => {
    render(<BrainDeathApneaSimulator />);
    expect(
      screen.getByText(/Brain Death Determination & Apnea Testing Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/1. Classic Trauma DNC/i)).toBeInTheDocument();
  });

  it('renders the 5 navigation tabs', () => {
    render(<BrainDeathApneaSimulator />);
    expect(screen.getByRole('button', { name: /1\. Prerequisites/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2\. Brainstem Reflexes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /3\. Apnea Testing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /4\. Ancillary Testing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /5\. Donor Resuscitation/i })).toBeInTheDocument();
  });

  it('switches to Brainstem Reflexes tab and displays reflex controls', () => {
    render(<BrainDeathApneaSimulator />);
    const tabBtn = screen.getByRole('button', { name: /2\. Brainstem Reflexes/i });
    fireEvent.click(tabBtn);

    expect(screen.getByText(/Cranial Nerve Brainstem Reflex Examination/i)).toBeInTheDocument();
    expect(screen.getByText(/Right Pupil Light Reflex/i)).toBeInTheDocument();
    expect(screen.getByText(/Oculovestibular \(Cold Calorics\)/i)).toBeInTheDocument();
  });

  it('switches to Apnea Testing tab and advances apnea duration', () => {
    render(<BrainDeathApneaSimulator />);
    const tabBtn = screen.getByRole('button', { name: /3\. Apnea Testing/i });
    fireEvent.click(tabBtn);

    expect(screen.getByText(/Real-Time Apnea Testing Console/i)).toBeInTheDocument();
    const advanceBtn = screen.getByRole('button', { name: /Advance Apnea \+1\.0 min/i });
    expect(advanceBtn).toBeInTheDocument();
    fireEvent.click(advanceBtn);

    // PaCO2 rises from baseline 40 to ~43
    expect(screen.getByText(/43\.0/i)).toBeInTheDocument();
  });

  it('switches to Ancillary Testing tab and renders modality selections', () => {
    render(<BrainDeathApneaSimulator />);
    const tabBtn = screen.getByRole('button', { name: /4\. Ancillary Testing/i });
    fireEvent.click(tabBtn);

    expect(screen.getByText(/AAN-Approved Ancillary Diagnostic Modalities/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /4-Vessel Angiography/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SPECT Radionuclide/i })).toBeInTheDocument();
  });

  it('switches to Donor Resuscitation tab and displays Rule of 100s yield', () => {
    render(<BrainDeathApneaSimulator />);
    const tabBtn = screen.getByRole('button', { name: /5\. Donor Resuscitation/i });
    fireEvent.click(tabBtn);

    expect(screen.getByText(/Deceased Donor Resuscitation & "Rule of 100s"/i)).toBeInTheDocument();
    expect(screen.getByText(/Heart Graft/i)).toBeInTheDocument();
    expect(screen.getByText(/Kidneys Graft/i)).toBeInTheDocument();
  });
});
