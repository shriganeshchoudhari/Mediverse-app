import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OSCECircuitStation from '../../components/exam/OSCECircuitStation';
import { OSCE_STATION_REGISTRY } from '../../lib/exam/osceStationRegistry';

describe('OSCECircuitStation Component', () => {
  const sampleStation = OSCE_STATION_REGISTRY[0]; // CPR station

  it('renders station title, domain, and patient demographics in practice mode', () => {
    render(<OSCECircuitStation station={sampleStation} circuitMode={false} />);

    expect(screen.getByText(/Adult Basic Life Support & High-Quality Resuscitation/i)).toBeInTheDocument();
    expect(screen.getByText(/Allopathic Medicine \(MBBS\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulated Patient Mannequin/i)).toBeInTheDocument();
    expect(screen.getByText(/Hospital Outpatient Lobby/i)).toBeInTheDocument();
    expect(screen.getByText(/Time Left:/i)).toBeInTheDocument();
  });

  it('starts in reading door note mode when circuitMode is true', () => {
    render(<OSCECircuitStation station={sampleStation} circuitMode={true} stationIndex={1} totalCircuitStations={6} />);

    expect(screen.getByText(/Reading:/i)).toBeInTheDocument();
    expect(screen.getByText(/Candidate Reading Interval/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter Room/i })).toBeInTheDocument();
  });

  it('navigates between station tabs (Door Note, Actor Prompts, Checklist, Safety Flags, Debrief)', () => {
    render(<OSCECircuitStation station={sampleStation} circuitMode={false} />);

    // Switch to Actor Prompts
    const actorPromptsTab = screen.getByRole('button', { name: /Standardized Actor Prompts/i });
    fireEvent.click(actorPromptsTab);
    expect(screen.getByText(/Standardized Simulated Actor Dialogue/i)).toBeInTheDocument();
    expect(screen.getByText(/Tap shoulders and shout/i)).toBeInTheDocument();

    // Switch to Safety Flags
    const safetyFlagsTab = screen.getByRole('button', { name: /Critical Safety Triggers/i });
    fireEvent.click(safetyFlagsTab);
    expect(screen.getByText(/Statutory Critical Safety Violations/i)).toBeInTheDocument();
    expect(screen.getByText(/Failure to check carotid pulse/i)).toBeInTheDocument();

    // Switch to Model Debrief
    const debriefTab = screen.getByRole('button', { name: /Model Debrief & Guidance/i });
    fireEvent.click(debriefTab);
    expect(screen.getByText(/Examiner Guidance & Model Benchmark/i)).toBeInTheDocument();
  });

  it('toggling checklist items increments score', () => {
    render(<OSCECircuitStation station={sampleStation} circuitMode={false} />);

    // Default checklist tab
    const firstCheckItem = screen.getByText(/Ensures scene safety and applies appropriate PPE/i);
    expect(firstCheckItem).toBeInTheDocument();

    fireEvent.click(firstCheckItem);

    // Score percentage should now be greater than 0%
    expect(screen.getByText(/Real-Time Examination Score/i)).toBeInTheDocument();
    expect(screen.queryByText(/0% \(0 \//i)).not.toBeInTheDocument();
  });

  it('triggering a critical safety error reflects in evaluation and debrief', () => {
    render(<OSCECircuitStation station={sampleStation} circuitMode={false} />);

    // Switch to Safety Flags tab
    const safetyTab = screen.getByRole('button', { name: /Critical Safety Triggers/i });
    fireEvent.click(safetyTab);

    const safetyViolationCard = screen.getByText(/Failure to check carotid pulse before starting compressions/i);
    fireEvent.click(safetyViolationCard);

    // Submit station
    const submitBtn = screen.getByRole('button', { name: /Submit Station/i });
    fireEvent.click(submitBtn);

    // Debrief should show FAILED due to critical safety error
    expect(screen.getByText(/Station Attempt Concluded —/i)).toBeInTheDocument();
    expect(screen.getByText(/FAILED/i)).toBeInTheDocument();
    expect(screen.getByText(/Immediate Safety Fails:/i)).toBeInTheDocument();
  });

  it('fires AI Socratic event bridge when requested in station debrief', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<OSCECircuitStation station={sampleStation} circuitMode={false} />);

    // Submit station to enter debrief
    const submitBtn = screen.getByRole('button', { name: /Submit Station/i });
    fireEvent.click(submitBtn);

    const askAiBtn = screen.getByRole('button', { name: /Ask AI Examiner/i });
    expect(askAiBtn).toBeInTheDocument();

    fireEvent.click(askAiBtn);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );
    dispatchSpy.mockRestore();
  });
});
