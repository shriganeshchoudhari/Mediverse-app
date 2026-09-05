import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClinicalCaseSolverStation from '../../components/cases/ClinicalCaseSolverStation';

// Mock speech synthesis
beforeAll(() => {
  window.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    getVoices: jest.fn().mockReturnValue([]),
  } as any;
});

describe('ClinicalCaseSolverStation Component', () => {
  it('renders clinical station with default case presentation and vitals monitor', () => {
    render(<ClinicalCaseSolverStation />);

    expect(screen.getByText(/Clinical Case Solver & Grand Rounds/i)).toBeInTheDocument();
    expect(screen.getAllByText(/58-year-old male/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/88\/54 mmHg/i)).toBeInTheDocument();
    expect(screen.getByText(/112 bpm/i)).toBeInTheDocument();
    expect(screen.getByText(/elephant on chest/i)).toBeInTheDocument();
  });

  it('navigates across the 5 encounter stages using stepper buttons', () => {
    render(<ClinicalCaseSolverStation />);

    // Stage 1: Triage
    expect(screen.getByText(/Primary Emergency Triage Complaint/i)).toBeInTheDocument();

    // Advance to Stage 2: Physical Exam & Labs
    const proceedToExamBtn = screen.getByRole('button', { name: /Proceed to Exam & Labs/i });
    fireEvent.click(proceedToExamBtn);
    expect(screen.getByText(/Bedside Physical Examination Findings/i)).toBeInTheDocument();

    // Advance to Stage 3: Differential
    const rankDiffBtn = screen.getByRole('button', { name: /Rank Differential Diagnoses/i });
    fireEvent.click(rankDiffBtn);
    expect(screen.getByText(/Differential Diagnosis Ranking Board/i)).toBeInTheDocument();

    // Advance to Stage 4: Management
    const executeMgmtBtn = screen.getByRole('button', { name: /Execute Treatment Protocol/i });
    fireEvent.click(executeMgmtBtn);
    expect(screen.getByText(/Guideline-Directed Management Checklist/i)).toBeInTheDocument();

    // Advance to Stage 5: Pearls
    const pearlsBtn = screen.getByRole('button', { name: /5\. Grand Rounds Pearls/i });
    fireEvent.click(pearlsBtn);
    expect(screen.getByText(/Grand Rounds Clinical Takeaways & Pearls/i)).toBeInTheDocument();
  });

  it('allows revealing lab investigations in Stage 2', () => {
    render(<ClinicalCaseSolverStation initialStage="WORKUP" />);

    // Check for reveal button
    const revealAllBtn = screen.getByRole('button', { name: /Order All STAT Panels/i });
    expect(revealAllBtn).toBeInTheDocument();

    fireEvent.click(revealAllBtn);

    // High-Sensitivity Troponin I should be visible
    expect(screen.getByText(/High-Sensitivity Troponin I/i)).toBeInTheDocument();
    expect(screen.getByText(/14.8 ng\/mL/i)).toBeInTheDocument();
  });

  it('allows checking off clinical management orders in Stage 4', () => {
    render(<ClinicalCaseSolverStation initialStage="MANAGEMENT" />);

    expect(screen.getByText(/Guideline-Directed Management Checklist/i)).toBeInTheDocument();
    const order1 = screen.getByText(/Order 1:/i);
    expect(order1).toBeInTheDocument();

    fireEvent.click(order1);
    // The completed counter should update
    expect(screen.getByText(/1 \/ 5 Orders Completed/i)).toBeInTheDocument();
  });

  it('supports domain filtering and selecting an Ayurvedic case', () => {
    render(<ClinicalCaseSolverStation />);

    // Filter by Ayurveda
    const ayurvedaFilter = screen.getByRole('button', { name: /🌿 Ayurveda/i });
    fireEvent.click(ayurvedaFilter);

    // Click on Amavata case card
    const amavataCaseCard = screen.getByText(/Bilateral symmetrical joint pain/i);
    expect(amavataCaseCard).toBeInTheDocument();
    fireEvent.click(amavataCaseCard);

    // Verify Ayurvedic case loaded
    expect(screen.getAllByText(/Vata-Pitta Prakriti/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/morning stiffness/i).length).toBeGreaterThan(0);
  });

  it('fires AI Socratic event bridge when requested in Grand Rounds stage', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<ClinicalCaseSolverStation initialStage="PEARLS" />);

    const askAiBtn = screen.getByRole('button', { name: /Discuss Case with AI Socratic Tutor/i });
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
