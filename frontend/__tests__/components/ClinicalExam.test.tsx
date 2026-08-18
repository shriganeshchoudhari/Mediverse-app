import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClinicalExamPage from '../../app/exam/page';
import ExamSummaryView from '../../components/exam/ExamSummaryView';
import { CLINICAL_EXAM_QUESTIONS } from '../../lib/competencies/clinicalExamQuestions';

// Mock Recharts
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div data-testid="recharts-container">{children}</div>,
    RadarChart: ({ children }: any) => <div data-testid="radar-chart">{children}</div>,
    PolarGrid: () => <div />,
    PolarAngleAxis: () => <div />,
    PolarRadiusAxis: () => <div />,
    Radar: () => <div />,
    Tooltip: () => <div />,
  };
});

describe('Clinical Examination Page & CBME Assessment Suite', () => {
  test('renders exam setup page with presets and NMC CBME competencies', () => {
    render(<ClinicalExamPage />);
    expect(screen.getByText(/Clinical Physiology Examination/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Comprehensive USMLE Step 1/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Rapid High-Yield Vignette Drill/i)).toBeInTheDocument();
    expect(screen.getByText(/Target NMC CBME Competencies/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PY1.1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PY7.1/i).length).toBeGreaterThan(0);
  });

  test('starts exam when launch button is clicked', () => {
    render(<ClinicalExamPage />);
    const launchButton = screen.getByRole('button', { name: /Launch/i });
    fireEvent.click(launchButton);

    // Should now show QuizRunner with Question 1 and options
    expect(screen.getByText(/Flag for Review/i)).toBeInTheDocument();
    expect(screen.getByText(/Defective phosphorylation of mannose residues/i)).toBeInTheDocument();
    expect(screen.getByText(/A 6-month-old male infant/i)).toBeInTheDocument();
  });

  test('clinical question bank has all required competencies', () => {
    const competenciesInBank = new Set(CLINICAL_EXAM_QUESTIONS.map((q) => q.competencyCode));
    const requiredCodes = ['PY1.1', 'PY1.3', 'PY3.1', 'PY5.1', 'PY5.2', 'PY6.1', 'PY6.2', 'PY7.1'];

    requiredCodes.forEach((code) => {
      expect(competenciesInBank.has(code)).toBe(true);
    });
  });

  test('renders ExamSummaryView correctly with score and CBME mastery breakdown', () => {
    const mockSummaryData = {
      score: 14,
      total: 16,
      percentage: 88,
      timeElapsed: 850,
      durationSeconds: 1500,
      competencyBreakdown: {
        'PY1.1': { total: 2, correct: 2, percentage: 100 },
        'PY1.3': { total: 2, correct: 2, percentage: 100 },
        'PY3.1': { total: 2, correct: 2, percentage: 100 },
        'PY5.1': { total: 2, correct: 2, percentage: 100 },
        'PY5.2': { total: 2, correct: 2, percentage: 100 },
        'PY6.1': { total: 2, correct: 1, percentage: 50 },
        'PY6.2': { total: 2, correct: 2, percentage: 100 },
        'PY7.1': { total: 2, correct: 1, percentage: 50 },
      },
      userAnswers: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 1, 11: 0, 12: 0, 13: 0, 14: 1, 15: 0 },
      flaggedQuestions: { 2: true },
      questions: CLINICAL_EXAM_QUESTIONS,
    };

    render(
      <ExamSummaryView
        summaryData={mockSummaryData}
        onRetakeExam={jest.fn()}
        onChoosePreset={jest.fn()}
      />
    );

    expect(screen.getByText(/Clinical Examination Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/88% Accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/NMC CBME Competency Mastery Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Detailed Clinical Vignette Review/i)).toBeInTheDocument();
    expect(screen.getByText(/14 Correct/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Incorrect/i)).toBeInTheDocument();
  });
});
