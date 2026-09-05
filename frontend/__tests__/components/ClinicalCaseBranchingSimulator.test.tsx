import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClinicalCaseBranchingSimulator from '../../components/osce/ClinicalCaseBranchingSimulator';

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div data-testid="recharts-container">{children}</div>,
  };
});

describe('ClinicalCaseBranchingSimulator Component', () => {
  it('renders simulator with patient demographics, vitals, and initial narrative', () => {
    render(<ClinicalCaseBranchingSimulator />);

    expect(screen.getByText(/Interactive Clinical Case Branching & AI OSCE Evaluator/i)).toBeInTheDocument();
    expect(screen.getByText(/Ramesh Sundaram/i)).toBeInTheDocument();
    expect(screen.getByText(/TRIAGE RED/i)).toBeInTheDocument();
    expect(screen.getAllByText(/54/i).length).toBeGreaterThan(0); // HR
    expect(screen.getAllByText(/96\/64/i).length).toBeGreaterThan(0); // BP
    expect(screen.getAllByText(/95/i).length).toBeGreaterThan(0); // SpO2
    expect(screen.getByText(/Initial Emergency Triage/i)).toBeInTheDocument();
  });

  it('executes a diagnostic action and reveals the bedside clinical consequence', () => {
    render(<ClinicalCaseBranchingSimulator />);

    const ecgActionBtn = screen.getByRole('button', { name: /STAT 12-Lead Standard ECG/i });
    fireEvent.click(ecgActionBtn);

    expect(screen.getByText(/Consequence of Last Action: STAT 12-Lead Standard ECG/i)).toBeInTheDocument();
    expect(screen.getByText(/ST elevation in inferior leads II, III, aVF/i)).toBeInTheDocument();
  });

  it('allows user to switch case scenarios', () => {
    render(<ClinicalCaseBranchingSimulator />);

    const select = screen.getByLabelText(/Case Scenario:/i);
    fireEvent.change(select, { target: { value: 'case-neutropenic-sepsis' } });

    expect(screen.getByText(/Sunita Mehra/i)).toBeInTheDocument();
    expect(screen.getByText(/132/i)).toBeInTheDocument(); // HR
    expect(screen.getByText(/82\/46/i)).toBeInTheDocument(); // BP
  });

  it('allows candidate to set differential diagnosis rank', () => {
    render(<ClinicalCaseBranchingSimulator />);

    const rankButtons = screen.getAllByRole('button', { name: /RANK #1|Set #1/i });
    expect(rankButtons.length).toBeGreaterThan(1);
    fireEvent.click(rankButtons[1]);
  });

  it('concludes encounter, calculates 5-dimension rubric, and displays attending viva', () => {
    render(<ClinicalCaseBranchingSimulator />);

    // Execute 2 actions
    const ecgBtn = screen.getByRole('button', { name: /STAT 12-Lead Standard ECG/i });
    fireEvent.click(ecgBtn);

    // Conclude encounter
    const concludeBtn = screen.getByRole('button', { name: /Conclude Encounter & Submit/i });
    fireEvent.click(concludeBtn);

    // Score report is displayed
    expect(screen.getByText(/Attending Evaluation & Competency Score Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic Accuracy:/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient Safety:/i)).toBeInTheDocument();
    expect(screen.getByText(/Resource Stewardship:/i)).toBeInTheDocument();
    expect(screen.getByText(/Attending Clinical Debrief:/i)).toBeInTheDocument();
    expect(screen.getByText(/Socratic Attending Oral Examination/i)).toBeInTheDocument();

    // Answer viva question
    const vivaOption = screen.getByText(/The ischemic RV is exquisitely preload-dependent/i);
    fireEvent.click(vivaOption);

    expect(screen.getByText(/Correct/i)).toBeInTheDocument();
    expect(screen.getByText(/Attending Rationale:/i)).toBeInTheDocument();
  });
});
