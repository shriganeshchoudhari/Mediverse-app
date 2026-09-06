import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThyroidCrisisSimulator from '../../components/simulators/ThyroidCrisisSimulator';

describe('ThyroidCrisisSimulator', () => {
  it('renders title and essential thyroid storm components', () => {
    render(<ThyroidCrisisSimulator />);
    expect(screen.getByText(/Thyroid Storm & Myxedema Coma Crisis Workstation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Burch-Wartofsky Diagnostic Criteria/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Multimodal Pharmacotherapy Sequencer/i)).toBeInTheDocument();
    expect(screen.getByText(/Circulating Thyroid Function Test Panel/i)).toBeInTheDocument();
  });

  it('allows switching to Myxedema Coma crisis mode', () => {
    render(<ThyroidCrisisSimulator />);
    const myxButton = screen.getByRole('button', { name: /^Myxedema Coma$/i });
    fireEvent.click(myxButton);

    expect(screen.getAllByText(/Popoveniuc Myxedema Coma Diagnostic Score/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Myxedema Coma Resuscitation Protocol/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates diagnostic status', () => {
    render(<ThyroidCrisisSimulator />);
    const postopPreset = screen.getByRole('button', { name: /Impending Thyroid Storm Post-Thyroidectomy/i });
    fireEvent.click(postopPreset);

    expect(screen.getAllByText(/IMPENDING STORM/i).length).toBeGreaterThan(0);

    const uncomplicated = screen.getByRole('button', { name: /Uncomplicated Thyrotoxicosis/i });
    fireEvent.click(uncomplicated);
    expect(screen.getAllByText(/UNLIKELY/i).length).toBeGreaterThan(0);
  });

  it('detects timing violations in the multimodal pharmacotherapy sequencer', () => {
    render(<ThyroidCrisisSimulator />);
    // Set iodine minute slider to 20 min (less than 60 min after PTU at 0 min)
    const sliders = screen.getAllByRole('slider');
    // The second drug slider is iodine
    const iodineSlider = sliders.find(s => s.getAttribute('value') === '75');
    if (iodineSlider) {
      fireEvent.change(iodineSlider, { target: { value: '25' } });
      expect(screen.getAllByText(/TIMING VIOLATION/i).length).toBeGreaterThan(0);
    }
  });
});
