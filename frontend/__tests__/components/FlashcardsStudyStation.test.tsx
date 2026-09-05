import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlashcardsDashboard from '../../app/dashboard/flashcards/page';

// Mock Recharts ResponsiveContainer for headless testing
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="recharts-container">{children}</div>
    ),
  };
});

// Mock SpeechSynthesis if not available in JSDOM
if (typeof window !== 'undefined') {
  window.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    getVoices: jest.fn().mockReturnValue([]),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    onvoiceschanged: null,
    pending: false,
    speaking: false,
    paused: false,
  } as any;

  (window as any).SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
    text,
    rate: 1,
    pitch: 1,
    lang: 'en-US',
  }));
}

describe('Flashcards Study Station & SM-2 Engine Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders station title, study queue badge, and active session analytics', () => {
    render(<FlashcardsDashboard />);

    expect(screen.getByText(/Spaced Repetition Flashcard System/i)).toBeInTheDocument();
    expect(screen.getByText(/Study Queue/i)).toBeInTheDocument();
    expect(screen.getByTestId('due-queue-badge')).toBeInTheDocument();
    expect(screen.getByText(/Active Session Analytics/i)).toBeInTheDocument();
    expect(screen.getByTestId('session-reviewed-count')).toHaveTextContent('0');
    expect(screen.getByTestId('interval-histogram')).toBeInTheDocument();
  });

  it('toggles study queue between All and Due Only modes', () => {
    render(<FlashcardsDashboard />);

    const dueOnlyBtn = screen.getByRole('button', { name: /Due Only/i });
    expect(dueOnlyBtn).toBeInTheDocument();

    fireEvent.click(dueOnlyBtn);
    expect(dueOnlyBtn.className).toContain('bg-amber-600');

    const allBtn = screen.getByRole('button', { name: /^All \(/i });
    expect(allBtn).toBeInTheDocument();

    fireEvent.click(allBtn);
    expect(allBtn.className).toContain('bg-indigo-600');
  });

  it('flips flashcard when clicking Show Answer, revealing 4-tier SM-2 grading options', () => {
    render(<FlashcardsDashboard />);

    // Initially Show Answer button is present
    const showAnswerBtn = screen.getByRole('button', { name: /Show Answer/i });
    expect(showAnswerBtn).toBeInTheDocument();

    // Flip card
    fireEvent.click(showAnswerBtn);

    // 4-tier SM-2 grading buttons should now appear
    expect(screen.getByRole('button', { name: /Again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Good/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Easy/i })).toBeInTheDocument();
  });

  it('grades a flashcard with SM-2 Good rating and updates active session statistics', async () => {
    render(<FlashcardsDashboard />);

    // Flip card
    const showAnswerBtn = screen.getByRole('button', { name: /Show Answer/i });
    fireEvent.click(showAnswerBtn);

    // Grade Good (quality 4)
    const goodBtn = screen.getByRole('button', { name: /Good/i });
    fireEvent.click(goodBtn);

    // Session reviewed count should increment to 1
    await waitFor(() => {
      expect(screen.getByTestId('session-reviewed-count')).toHaveTextContent('1');
    });

    // Retention rate should be 100% since Good is >= 3
    expect(screen.getByTestId('session-retention-rate')).toHaveTextContent('100%');
    expect(screen.getByTestId('session-avg-quality')).toHaveTextContent('4');
  });

  it('records lapse and lower retention when card is graded Again (quality 1)', async () => {
    render(<FlashcardsDashboard />);

    // Flip card
    const showAnswerBtn = screen.getByRole('button', { name: /Show Answer/i });
    fireEvent.click(showAnswerBtn);

    // Grade Again (quality 1)
    const againBtn = screen.getByRole('button', { name: /Again/i });
    fireEvent.click(againBtn);

    // Session reviewed count should increment to 1
    await waitFor(() => {
      expect(screen.getByTestId('session-reviewed-count')).toHaveTextContent('1');
    });

    // Retention rate should be 0% since quality < 3
    expect(screen.getByTestId('session-retention-rate')).toHaveTextContent('0%');
    expect(screen.getByTestId('session-avg-quality')).toHaveTextContent('1');
  });
});
