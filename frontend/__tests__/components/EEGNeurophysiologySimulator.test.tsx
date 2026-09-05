import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EEGNeurophysiologySimulator from '@/components/simulators/EEGNeurophysiologySimulator';

describe('EEGNeurophysiologySimulator Component', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame and cancelAnimationFrame
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(() => cb(1000), 16) as unknown as number;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id as unknown as NodeJS.Timeout);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders simulator header, 10-20 system badge, and controls', () => {
    render(<EEGNeurophysiologySimulator />);

    expect(
      screen.getByRole('heading', { name: /Clinical Neurophysiology & Quantitative EEG \(qEEG\) Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/10-20 System/i)).toBeInTheDocument();
    expect(screen.getByText(/qEEG Spectral Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Frequency Band Power Distribution/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates diagnostic criteria and qEEG metrics', () => {
    render(<EEGNeurophysiologySimulator />);

    // Click on Childhood Absence preset
    const absenceBtn = screen.getAllByText(/Childhood Absence/i)[0];
    fireEvent.click(absenceBtn);

    expect(screen.getByText(/Hyperexcitable burst-firing in thalamocortical circuit/i)).toBeInTheDocument();
    expect(screen.getByText(/Ethosuximide/i)).toBeInTheDocument();
  });

  it('allows montage switching between Longitudinal, Transverse, and Referential', () => {
    render(<EEGNeurophysiologySimulator />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'TRANSVERSE' } });

    expect(select).toHaveValue('TRANSVERSE');
  });

  it('toggles provocative maneuvers (Eye Opening / Closing, Hyperventilation)', () => {
    render(<EEGNeurophysiologySimulator />);

    const eyeBtn = screen.getByRole('button', { name: /Eyes CLOSED/i });
    fireEvent.click(eyeBtn);

    expect(screen.getByRole('button', { name: /Eyes OPEN/i })).toBeInTheDocument();

    const hvBtn = screen.getByRole('button', { name: /Hyperventilate/i });
    fireEvent.click(hvBtn);

    expect(screen.getByRole('button', { name: /HV: Active/i })).toBeInTheDocument();
  });

  it('dispatches mediverse:open-ai-with-context when Ask Socratic AI is clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<EEGNeurophysiologySimulator />);

    const askAiBtn = screen.getByRole('button', { name: /Ask Socratic AI/i });
    fireEvent.click(askAiBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
        detail: expect.objectContaining({
          context: expect.stringContaining('Clinical Neurophysiology (EEG / qEEG) Case:')
        })
      })
    );
  });
});
