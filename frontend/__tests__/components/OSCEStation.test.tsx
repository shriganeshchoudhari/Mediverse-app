import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OSCEStation from '@/components/exam/OSCEStation';

describe('OSCEStation Component', () => {
  const mockStation = {
    id: 'osce-cardio-01',
    title: 'Cardiovascular Examination OSCE Station',
    domain: 'Clinical Medicine',
    description: 'A 58-year-old patient presents with exertional dyspnea and atypical chest tightness.',
    scenario_json: {
      instructions: 'Introduce yourself, obtain consent, examine precordium, and report findings.',
    },
    checklist_json: [
      { id: 'item-1', text: 'Performs hand hygiene and introduces self to patient', marks: 2 },
      { id: 'item-2', text: 'Inspects precordium for scars, deformities, and visible pulsations', marks: 3 },
      { id: 'item-3', text: 'Palpates apex beat location, character, and heaves/thrills', marks: 5 },
      { id: 'item-4', text: 'Auscultates mitral, tricuspid, pulmonary, and aortic areas with bell and diaphragm', marks: 10 },
    ],
    time_limit_minutes: 8,
    passing_score_pct: 70,
    difficulty: 'Advanced',
  };

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders station title and metadata badges', () => {
    render(<OSCEStation station={mockStation} />);

    expect(screen.getByText('Cardiovascular Examination OSCE Station')).toBeInTheDocument();
    expect(screen.getByText('Clinical Medicine')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
    expect(screen.getByText(/A 58-year-old patient presents with exertional dyspnea/i)).toBeInTheDocument();
    expect(screen.getByText(/Introduce yourself, obtain consent/i)).toBeInTheDocument();
  });

  test('renders checklist items from checklist_json with item text and points', () => {
    render(<OSCEStation station={mockStation} />);

    expect(screen.getByText('Performs hand hygiene and introduces self to patient')).toBeInTheDocument();
    expect(screen.getByText('(2 pts)')).toBeInTheDocument();

    expect(screen.getByText('Inspects precordium for scars, deformities, and visible pulsations')).toBeInTheDocument();
    expect(screen.getByText('(3 pts)')).toBeInTheDocument();

    expect(screen.getByText('Palpates apex beat location, character, and heaves/thrills')).toBeInTheDocument();
    expect(screen.getByText('(5 pts)')).toBeInTheDocument();

    expect(
      screen.getByText('Auscultates mitral, tricuspid, pulmonary, and aortic areas with bell and diaphragm')
    ).toBeInTheDocument();
    expect(screen.getByText('(10 pts)')).toBeInTheDocument();
  });

  test('checking and unchecking a checkbox updates the score tally', () => {
    render(<OSCEStation station={mockStation} />);

    // Total possible marks = 2 + 3 + 5 + 10 = 20
    expect(screen.getByText('Score: 0 / 20')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);

    // Check item 1 (2 pts)
    fireEvent.click(checkboxes[0]);
    expect(screen.getByText('Score: 2 / 20')).toBeInTheDocument();

    // Check item 3 (5 pts) -> total = 7
    fireEvent.click(checkboxes[2]);
    expect(screen.getByText('Score: 7 / 20')).toBeInTheDocument();

    // Check item 4 (10 pts) -> total = 17
    fireEvent.click(checkboxes[3]);
    expect(screen.getByText('Score: 17 / 20')).toBeInTheDocument();

    // Uncheck item 1 -> total = 15
    fireEvent.click(checkboxes[0]);
    expect(screen.getByText('Score: 15 / 20')).toBeInTheDocument();
  });

  test('submit button is present and clickable', () => {
    render(<OSCEStation station={mockStation} />);

    const submitButton = screen.getByRole('button', { name: /Submit Station/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('shows passing score percentage and result status upon submission', () => {
    const { rerender } = render(<OSCEStation station={mockStation} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // Check item 2 (3 pts), item 3 (5 pts), item 4 (10 pts) -> 18 / 20 = 90.0% (Passing >= 70%)
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    fireEvent.click(checkboxes[3]);

    const submitButton = screen.getByRole('button', { name: /Submit Station/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByText(/Final Score: 90\.0% \(Required: 70%\)/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Submit Station/i })).not.toBeInTheDocument();
  });

  test('shows fail status when score is below passing threshold', () => {
    render(<OSCEStation station={mockStation} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // Check only item 1 (2 pts) -> 2 / 20 = 10.0% (< 70%)
    fireEvent.click(checkboxes[0]);

    const submitButton = screen.getByRole('button', { name: /Submit Station/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Fail')).toBeInTheDocument();
    expect(screen.getByText(/Final Score: 10\.0% \(Required: 70%\)/i)).toBeInTheDocument();
  });
});
