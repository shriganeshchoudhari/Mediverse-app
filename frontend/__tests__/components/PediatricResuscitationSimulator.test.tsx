import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PediatricResuscitationSimulator from '../../components/simulators/PediatricResuscitationSimulator';

describe('PediatricResuscitationSimulator Component', () => {
  it('renders simulator station with title, PALS tab, and Broselow zone indicator', () => {
    render(<PediatricResuscitationSimulator />);

    expect(
      screen.getByRole('heading', { name: /Pediatric & Neonatal Resuscitation Workstation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /PALS Resuscitation & Weight-Based Drug Calculator/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /NRP Neonatal Golden-Minute & APGAR Suite/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Airway & Endotracheal Equipment Sizing/i)).toBeInTheDocument();
    expect(screen.getByText(/Electrical Therapy & Vital Sign Targets/i)).toBeInTheDocument();
    expect(screen.getByText(/Broselow Zone/i)).toBeInTheDocument();
  });

  it('switches to the NRP tab and displays APGAR scoring, SpO2 targets, and MR. SOPA', () => {
    render(<PediatricResuscitationSimulator />);

    const nrpTab = screen.getByRole('button', { name: /NRP Neonatal Golden-Minute & APGAR Suite/i });
    fireEvent.click(nrpTab);

    expect(screen.getByText(/APGAR Scoring Engine \(0 - 10 Scale\)/i)).toBeInTheDocument();
    expect(screen.getByText(/NRP Pre-Ductal SpO2 Targets \(Right Wrist\)/i)).toBeInTheDocument();
    expect(screen.getByText(/MR\. SOPA Ventilation Troubleshooter/i)).toBeInTheDocument();
  });

  it('interactively updates APGAR score and clinical category', () => {
    render(<PediatricResuscitationSimulator />);

    const nrpTab = screen.getByRole('button', { name: /NRP Neonatal Golden-Minute & APGAR Suite/i });
    fireEvent.click(nrpTab);

    // Initial APGAR is 10/10
    expect(screen.getByText(/Score: 10 \/ 10/i)).toBeInTheDocument();

    // Change Appearance to 0 (Blue / Pale all over)
    const paleBtn = screen.getByRole('button', { name: /0: Blue \/ Pale all over/i });
    fireEvent.click(paleBtn);

    // Change Pulse to 1 (< 100 bpm)
    const lowPulseBtn = screen.getByRole('button', { name: /1: < 100 bpm/i });
    fireEvent.click(lowPulseBtn);

    // Score should now be 7 (or lower depending on other fields)
    expect(screen.getByText(/Score: 7 \/ 10/i)).toBeInTheDocument();
  });

  it('loads emergency case scenarios and toggles clinical teaching pearls', () => {
    render(<PediatricResuscitationSimulator />);

    // Click on Meconium Apnea preset
    const meconiumBtn = screen.getByRole('button', { name: /NRP: Meconium Delivery/i });
    fireEvent.click(meconiumBtn);

    // Should switch to NRP tab and display meconium case title
    expect(screen.getByText(/Case: NRP: Meconium Delivery & Non-Vigorous Apneic Neonate/i)).toBeInTheDocument();

    // Toggle teaching pearls
    const revealBtn = screen.getByRole('button', { name: /Reveal Expected Management/i });
    fireEvent.click(revealBtn);

    expect(screen.getByText(/PALS \/ NRP Management & Board Pearls:/i)).toBeInTheDocument();
    expect(screen.getByText(/Routine routine endotracheal suctioning is NO LONGER recommended/i)).toBeInTheDocument();
  });

  it('dispatches mediverse:open-ai-with-context event when Consult Socratic AI is clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<PediatricResuscitationSimulator />);

    const aiBtn = screen.getByRole('button', { name: /Consult Socratic AI/i });
    fireEvent.click(aiBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );

    dispatchSpy.mockRestore();
  });

  it('resets patient profile and parameters to 3-year-old baseline when Reset is clicked', () => {
    render(<PediatricResuscitationSimulator />);

    // Load meconium preset (0 months)
    const meconiumBtn = screen.getByRole('button', { name: /NRP: Meconium Delivery/i });
    fireEvent.click(meconiumBtn);

    // Click Reset
    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetBtn);

    // Should return to 3.0 years / 36 months baseline
    expect(screen.getByText(/3\.0 years/i)).toBeInTheDocument();
  });
});
