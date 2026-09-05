import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimulatedPatientVoiceStation from '../../components/cases/SimulatedPatientVoiceStation';

// Mock Web Speech API SpeechSynthesis
beforeAll(() => {
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
    paused: false,
    pending: false,
    speaking: false
  } as any;

  (window as any).SpeechSynthesisUtterance = jest.fn().mockImplementation((text: string) => ({
    text,
    pitch: 1,
    rate: 1,
    volume: 1,
    voice: null,
    onstart: null,
    onend: null,
    onerror: null
  }));

  // Mock scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe('SimulatedPatientVoiceStation Component', () => {
  it('renders patient card with name, age, affect badge, and initial greeting', () => {
    render(<SimulatedPatientVoiceStation caseId="case-mbbs-01" />);

    expect(screen.getAllByText(/Ramesh Sundaram/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/\(58y, Male\)/i)).toBeInTheDocument();
    expect(screen.getByText(/ANXIOUS PAIN/i)).toBeInTheDocument();
    expect(screen.getByText(/History-Taking Coverage \(SOCRATES\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello doctor\.\.\./i)).toBeInTheDocument();
  });

  it('renders suggested clinical prompt chips for quick questioning', () => {
    render(<SimulatedPatientVoiceStation caseId="case-mbbs-01" />);

    expect(screen.getByText(/When exactly did this chest pain start\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Can you describe what the pain feels like\?/i)).toBeInTheDocument();
  });

  it('allows candidate to type a question and receive in-character response', () => {
    render(<SimulatedPatientVoiceStation caseId="case-mbbs-01" />);

    const input = screen.getByPlaceholderText(/Ask the patient a question or explore symptoms\.\.\./i);
    fireEvent.change(input, { target: { value: 'When did the chest pain start?' } });

    const sendBtn = screen.getByRole('button', { name: /Send question/i });
    fireEvent.click(sendBtn);

    // Candidate message appears
    expect(screen.getByText('When did the chest pain start?')).toBeInTheDocument();

    // Dimension badge appears
    expect(screen.getByText(/\+ONSET TIMING/i)).toBeInTheDocument();
  });

  it('allows clicking a suggested prompt chip to immediately ask question', () => {
    render(<SimulatedPatientVoiceStation caseId="case-mbbs-01" />);

    const chip = screen.getByText(/When exactly did this chest pain start\?/i);
    fireEvent.click(chip);

    // Question appears in message bubbles as well as the chip
    const occurrences = screen.getAllByText(/When exactly did this chest pain start\?/i);
    expect(occurrences.length).toBeGreaterThanOrEqual(2);
  });

  it('toggles patient voice mute and unmute', () => {
    render(<SimulatedPatientVoiceStation caseId="case-mbbs-01" />);

    const voiceBtn = screen.getByTitle(/Mute Patient Speech/i);
    expect(voiceBtn).toBeInTheDocument();
    fireEvent.click(voiceBtn);

    expect(screen.getByTitle(/Unmute Patient Speech/i)).toBeInTheDocument();
  });

  it('displays medical jargon warning if technical terms are used', () => {
    render(<SimulatedPatientVoiceStation caseId="case-mbbs-01" />);

    const input = screen.getByPlaceholderText(/Ask the patient a question or explore symptoms\.\.\./i);
    fireEvent.change(input, { target: { value: 'Do you have acute myocardial infarction?' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText(/Avoid complex medical jargon with patients/i)).toBeInTheDocument();
  });

  it('resets the conversation on reset button click', () => {
    render(<SimulatedPatientVoiceStation caseId="case-mbbs-01" />);

    const input = screen.getByPlaceholderText(/Ask the patient a question or explore symptoms\.\.\./i);
    fireEvent.change(input, { target: { value: 'Is the pain spreading into your left arm?' } });

    const sendBtn = screen.getByRole('button', { name: /Send question/i });
    fireEvent.click(sendBtn);

    expect(screen.getByText('Is the pain spreading into your left arm?')).toBeInTheDocument();

    const resetBtn = screen.getByTitle(/Restart Patient Encounter/i);
    fireEvent.click(resetBtn);

    // Question should be gone after reset
    expect(screen.queryByText('Is the pain spreading into your left arm?')).not.toBeInTheDocument();
  });
});
