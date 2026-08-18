import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizRunner, { QuizQuestion } from '../../components/exam/QuizRunner';
import { calculateCompetencyScores } from '../../lib/competencies/nmcMapping';

const mockQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    stem: 'Which mechanism primarily accounts for the rapid depolarization phase (Phase 0) of ventricular action potentials?',
    options: [
      'Inflow of Sodium ions via voltage-gated Na+ channels',
      'Efflux of Potassium ions via delayed rectifier channels',
      'Inflow of Calcium ions via L-type Ca2+ channels',
      'Active pumping of 3 Na+ out and 2 K+ in',
    ],
    correctIndex: 0,
    rationale: 'Phase 0 rapid depolarization is mediated by fast voltage-gated Na+ channels opening when threshold is reached.',
    competencyCode: 'PY5.1',
  },
  {
    id: 'q2',
    stem: 'According to the Frank-Starling law of the heart, an increase in end-diastolic volume directly leads to an increase in which parameter?',
    options: [
      'Heart Rate',
      'Stroke Volume',
      'Total Peripheral Resistance',
      'End-Systolic Volume only',
    ],
    correctIndex: 1,
    rationale: 'Increased venous return increases end-diastolic volume, stretching ventricular myocytes toward optimal sarcomere length and increasing stroke volume.',
    competencyCode: 'PY5.2',
  },
];

describe('QuizRunner Component & Competency Engine', () => {
  test('renders first question and options correctly', () => {
    render(<QuizRunner examTitle="Cardiovascular Physiology Mock" questions={mockQuestions} />);
    expect(screen.getByText('Cardiovascular Physiology Mock')).toBeInTheDocument();
    expect(screen.getByText(/rapid depolarization phase/i)).toBeInTheDocument();
    expect(screen.getByText(/Inflow of Sodium ions/i)).toBeInTheDocument();
  });

  test('calculates NMC competency scores accurately', () => {
    const answers = [
      { competencyCode: 'PY5.1', isCorrect: true },
      { competencyCode: 'PY5.2', isCorrect: true },
      { competencyCode: 'PY5.2', isCorrect: false },
    ];

    const breakdown = calculateCompetencyScores(answers);
    expect(breakdown['PY5.1'].total).toBe(1);
    expect(breakdown['PY5.1'].percentage).toBe(100);
    expect(breakdown['PY5.2'].total).toBe(2);
    expect(breakdown['PY5.2'].correct).toBe(1);
    expect(breakdown['PY5.2'].percentage).toBe(50);
  });
});
