import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusEpilepticusSimulator from '../../components/simulators/StatusEpilepticusSimulator';

describe('StatusEpilepticusSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<StatusEpilepticusSimulator />);

    expect(
      screen.getByText(/Status Epilepticus \(AES \/ NCS\) Emergency Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Current Status Phase/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/First-Line Benzodiazepine/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Second-Line ESETT ASM/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Receptor Remodeling/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Refractory Burst Target/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clinical presets and applies Underdosed Benzodiazepine preset', () => {
    render(<StatusEpilepticusSimulator />);

    const underdosedPreset = screen.getByText(
      /Underdosed Benzodiazepine Established SE \(ESETT Scenario\)/i
    );
    expect(underdosedPreset).toBeInTheDocument();

    fireEvent.click(underdosedPreset);

    // Verify underdosing banner
    expect(screen.getAllByText(/UNDERDOSE/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Phase 1 Benzodiazepines and toggles IV access', () => {
    render(<StatusEpilepticusSimulator />);

    const phase1Tab = screen.getByRole('button', { name: /Phase 1: First-Line Benzodiazepines/i });
    fireEvent.click(phase1Tab);

    expect(
      screen.getByText(/Phase 1: First-Line Benzodiazepine Precision Dosing & Underdosing Safeguard/i)
    ).toBeInTheDocument();

    // Toggle IV access to false
    const ivBtn = screen.getByText(/IV ACCESS PRESENT/i);
    fireEvent.click(ivBtn);

    expect(screen.getByText(/NO IV \(USE IM\)/i)).toBeInTheDocument();
  });

  it('switches tabs to Phase 2 ESETT ASMs and triggers contraindication alert', () => {
    render(<StatusEpilepticusSimulator />);

    const phase2Tab = screen.getByRole('button', { name: /Phase 2: ESETT Antiseizure Drugs/i });
    fireEvent.click(phase2Tab);

    expect(
      screen.getByText(/Phase 2: Established SE \(ESETT Second-Line Non-Sedating ASMs\)/i)
    ).toBeInTheDocument();

    // Select Fosphenytoin
    const fosphenytoinBtns = screen.getAllByRole('button', { name: /Fosphenytoin/i });
    fireEvent.click(fosphenytoinBtns[0]);

    // Toggle heart block
    const heartBlockCheckbox = screen.getByLabelText(/Sinus Bradycardia \/ Heart Block/i);
    fireEvent.click(heartBlockCheckbox);

    expect(
      screen.getAllByText(/CONTRAINDICATION DETECTED FOR SELECTED ASM/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Phase 3 RSE and checks continuous anesthetic controls', () => {
    render(<StatusEpilepticusSimulator />);

    const phase3Tab = screen.getByRole('button', { name: /Phase 3: Refractory SE & Burst Suppression/i });
    fireEvent.click(phase3Tab);

    expect(
      screen.getByText(/Phase 3: Refractory Status Epilepticus \(RSE\) & Anesthetic Titration/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Continuous Anesthetic Selection/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Continuous EEG Burst Suppression Titration/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Salzburg NCSE Criteria and checks diagnostic output', () => {
    render(<StatusEpilepticusSimulator />);

    const salzburgTab = screen.getByRole('button', { name: /Salzburg NCSE Criteria/i });
    fireEvent.click(salzburgTab);

    expect(
      screen.getByText(/Salzburg Consensus Criteria \(2015\) for Non-Convulsive Status Epilepticus/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/EEG Waveform Characteristics/i)).toBeInTheDocument();
  });
});
