import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpatialAuscultationSimulator from '@/components/simulators/SpatialAuscultationSimulator';

// Mock Web Audio API
beforeAll(() => {
  window.AudioContext = jest.fn().mockImplementation(() => ({
    state: 'running',
    resume: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    createOscillator: jest.fn().mockReturnValue({
      type: 'sine',
      frequency: { setValueAtTime: jest.fn() },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn()
    }),
    createGain: jest.fn().mockReturnValue({
      gain: {
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn()
      },
      connect: jest.fn()
    }),
    createBiquadFilter: jest.fn().mockReturnValue({
      type: 'lowpass',
      frequency: { setValueAtTime: jest.fn() },
      connect: jest.fn()
    }),
    destination: {}
  })) as any;
  (window as any).webkitAudioContext = window.AudioContext;
});

describe('SpatialAuscultationSimulator Component', () => {
  it('1. renders hero header and main title', () => {
    render(<SpatialAuscultationSimulator />);
    expect(
      screen.getByText(/3D Spatial Auscultation & Directional Phonocardiogram Workstation/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Track C3 • Cardiology, Pulmonology & Physical Diagnosis/i)
    ).toBeInTheDocument();
  });

  it('2. allows switching between auscultation presets', () => {
    render(<SpatialAuscultationSimulator />);
    const mrPresetBtn = screen.getByText(/Severe Mitral Regurgitation with S3 Gallop/i);
    fireEvent.click(mrPresetBtn);
    expect(
      screen.getByText(/Severe Chronic Mitral Regurgitation/i)
    ).toBeInTheDocument();
  });

  it('3. allows switching between stethoscope bell and diaphragm', () => {
    render(<SpatialAuscultationSimulator />);
    const bellBtn = screen.getByRole('button', { name: /Bell/i });
    fireEvent.click(bellBtn);
    expect(bellBtn).toBeInTheDocument();
  });

  it('4. switches to acoustic notes tab and displays clinical pearls', () => {
    render(<SpatialAuscultationSimulator />);
    const notesTab = screen.getByRole('button', { name: /Phonocardiogram Timing & Radiation/i });
    fireEvent.click(notesTab);
    expect(screen.getByText(/Acoustic Physics & Clinical Correlation/i)).toBeInTheDocument();
    expect(screen.getByText(/Auscultation Diagnostic Pearls:/i)).toBeInTheDocument();
  });

  it('5. switches to dynamic maneuvers matrix tab', () => {
    render(<SpatialAuscultationSimulator />);
    const matrixTab = screen.getByRole('button', { name: /Dynamic Maneuver Matrix/i });
    fireEvent.click(matrixTab);
    expect(screen.getByText(/Dynamic Auscultation Clinical Maneuvers Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Tricuspid Regurgitation \(TR\)/i)).toBeInTheDocument();
  });
});
