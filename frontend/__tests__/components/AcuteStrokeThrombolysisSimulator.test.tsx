import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AcuteStrokeThrombolysisSimulator from '../../components/simulators/AcuteStrokeThrombolysisSimulator';

describe('AcuteStrokeThrombolysisSimulator', () => {
  it('renders title and essential stroke triage components', () => {
    render(<AcuteStrokeThrombolysisSimulator />);
    expect(screen.getByText(/Acute Ischemic Stroke & Thrombolysis Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Reperfusion & Dosing Solver/i)).toBeInTheDocument();
    expect(screen.getAllByText(/NIH Stroke Scale/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ASPECTS CT Map/i).length).toBeGreaterThan(0);
  });

  it('allows switching between navigation tabs', () => {
    render(<AcuteStrokeThrombolysisSimulator />);
    // Switch to NIHSS tab
    const nihssTab = screen.getByRole('button', { name: /NIH Stroke Scale/i });
    fireEvent.click(nihssTab);
    expect(screen.getByText(/1a\. Level of Consciousness:/i)).toBeInTheDocument();

    // Switch to ASPECTS tab
    const aspectsTab = screen.getByRole('button', { name: /ASPECTS CT Map/i });
    fireEvent.click(aspectsTab);
    expect(screen.getByText(/Subcortical Ganglionic Structures/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates diagnostic eligibility', () => {
    render(<AcuteStrokeThrombolysisSimulator />);
    const wakeupPreset = screen.getByRole('button', { name: /Wake-Up Stroke Extended Window/i });
    fireEvent.click(wakeupPreset);

    // Should indicate EVT candidate but lysis ineligible due to >4.5h window
    expect(screen.getAllByText(/DIRECT TRANSFER TO ANGIOGRAPHY SUITE/i).length).toBeGreaterThan(0);

    const minorPreset = screen.getByRole('button', { name: /Minor Non-Disabling/i });
    fireEvent.click(minorPreset);
    expect(screen.getAllByText(/MINOR/i).length).toBeGreaterThan(0);
  });

  it('detects severe hypertension contraindication on SBP slider movement', () => {
    render(<AcuteStrokeThrombolysisSimulator />);
    const sbpSlider = screen.getAllByRole('slider').find(s => s.getAttribute('min') === '100' && s.getAttribute('max') === '230');
    expect(sbpSlider).toBeDefined();

    if (sbpSlider) {
      fireEvent.change(sbpSlider, { target: { value: '215' } });
      expect(screen.getAllByText(/Severe hypertension/i).length).toBeGreaterThan(0);
    }
  });
});
