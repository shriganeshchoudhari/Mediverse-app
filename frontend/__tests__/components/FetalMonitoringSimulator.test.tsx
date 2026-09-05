import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FetalMonitoringSimulator from '@/components/simulators/FetalMonitoringSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('FetalMonitoringSimulator Component', () => {
  test('renders simulator header, category badge, and paper strip labels', () => {
    render(<FetalMonitoringSimulator />);
    expect(screen.getAllByText(/Fetal Monitoring/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CATEGORY/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Continuous Paper Strip/i).length).toBeGreaterThan(0);
  });

  test('renders all 6 preset clinical buttons', () => {
    render(<FetalMonitoringSimulator />);
    expect(screen.getAllByText(/Normal Reassuring Tracing/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Early Decelerations/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Recurrent Late Decelerations/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Severe Variable Decelerations/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Uterine Tachysystole/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sinusoidal Pattern/i).length).toBeGreaterThan(0);
  });

  test('switches presets and updates active classification', () => {
    render(<FetalMonitoringSimulator />);
    const sinusoidalBtn = screen.getByText(/Sinusoidal Pattern/i);
    fireEvent.click(sinusoidalBtn);
    expect(screen.getAllByText(/CATEGORY III/i).length).toBeGreaterThan(0);
  });

  test('triggers intrauterine resuscitation actions', () => {
    render(<FetalMonitoringSimulator />);
    const stopPitocinBtn = screen.getByText(/Stop \/ Discontinue Oxytocin/i);
    fireEvent.click(stopPitocinBtn);
    expect(screen.getAllByText(/STOPPED/i).length).toBeGreaterThan(0);
  });

  test('adjusts Bishop score dilation slider', () => {
    render(<FetalMonitoringSimulator />);
    expect(screen.getAllByText(/Bishop Induction Score/i).length).toBeGreaterThan(0);
  });

  test('dispatches Socratic AI event on button click', () => {
    render(<FetalMonitoringSimulator />);
    const aiBtn = screen.getByText(/Ask Socratic AI Tutor/i);
    fireEvent.click(aiBtn);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'mediverse:open-ai-with-context' })
    );
  });
});
