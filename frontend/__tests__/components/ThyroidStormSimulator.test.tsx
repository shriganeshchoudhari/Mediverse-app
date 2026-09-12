import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThyroidStormSimulator from '../../components/simulators/ThyroidStormSimulator';

describe('ThyroidStormSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<ThyroidStormSimulator />);

    expect(
      screen.getByText(/Thyroid Storm & Burch-Wartofsky Crisis Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/BWPS Score/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Akamizu \(JTA\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Iodine Timing/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/5-Stage Blockade/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Antipyretic Safeguard/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clinical presets and applies Premature Iodine Trap preset', () => {
    render(<ThyroidStormSimulator />);

    const presetButtons = screen.getAllByRole('button', { name: /Premature Iodine/i });
    expect(presetButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(presetButtons[0]);

    // Should reflect premature iodine warning in summary
    expect(screen.getAllByText(/Jod-Basedow Trap/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Burch-Wartofsky Scoring Bench and adjusts severity', () => {
    render(<ThyroidStormSimulator />);

    const bwpsTab = screen.getByRole('button', { name: /Burch-Wartofsky Scoring Bench/i });
    fireEvent.click(bwpsTab);

    expect(screen.getAllByText(/Burch-Wartofsky Point Scale \(BWPS\) Bench/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/CNS Effects/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/GI-Hepatic Dysfunction/i).length).toBeGreaterThanOrEqual(1);

    const mildAgitationBtn = screen.getByRole('button', { name: /Mild Agitation/i });
    fireEvent.click(mildAgitationBtn);
  });

  it('switches tabs to Japan Thyroid Association and views criteria', () => {
    render(<ThyroidStormSimulator />);

    const jtaTab = screen.getByRole('button', { name: /Japan Thyroid Association \(Akamizu\)/i });
    fireEvent.click(jtaTab);

    expect(screen.getAllByText(/Japan Thyroid Association \(Akamizu 2012\) Diagnostic Bench/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Biochemical Confirmation:/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/JTA Diagnostic Algorithm Requirements/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to 5-Stage Multimodal Blockade and selects Methimazole', () => {
    render(<ThyroidStormSimulator />);

    const pharmaTab = screen.getByRole('button', { name: /5-Stage Multimodal Blockade/i });
    fireEvent.click(pharmaTab);

    expect(screen.getAllByText(/Thionamide Selection & Wolff-Chaikoff Iodine Timing/i).length).toBeGreaterThanOrEqual(1);

    const mmiButton = screen.getByRole('button', { name: /Methimazole/i });
    fireEvent.click(mmiButton);

    const esmololBtn = screen.getByRole('button', { name: /Esmolol \(ICU\)/i });
    fireEvent.click(esmololBtn);
  });

  it('switches tabs to Critical Pitfalls and toggles Aspirin TBG displacement hazard', () => {
    render(<ThyroidStormSimulator />);

    const pitfallsTab = screen.getByRole('button', { name: /Aspirin Hazard & Cardiac Guardrails/i });
    fireEvent.click(pitfallsTab);

    expect(screen.getAllByText(/The Aspirin TBG Displacement Trap/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Approved Antipyretic Protocol:/i).length).toBeGreaterThanOrEqual(1);

    // Toggle Aspirin simulation checkbox
    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[0]);
    }

    expect(screen.getAllByText(/Lethal Free Hormone Spike Triggered/i).length).toBeGreaterThanOrEqual(1);
  });
});
