import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClinicalLabInterpretationSimulator from '../../components/simulators/ClinicalLabInterpretationSimulator';

describe('ClinicalLabInterpretationSimulator Component', () => {
  it('renders simulator station with title, tabs, and active preset', () => {
    render(<ClinicalLabInterpretationSimulator />);

    expect(
      screen.getByRole('heading', { name: /Clinical Diagnostic Laboratory & Blood Gas Solver/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ABG \/ VBG Blood Gas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CBC & Anemia/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CMP & Electrolytes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Coagulation & Liver/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Primary Metabolic Acidosis/i })).toBeInTheDocument();
  });

  it('switches between lab panels and displays corresponding parameters and diagnostics', () => {
    render(<ClinicalLabInterpretationSimulator />);

    // Switch to CBC panel
    const cbcTab = screen.getByRole('button', { name: /CBC & Anemia/i });
    fireEvent.click(cbcTab);
    expect(screen.getByText(/Complete Blood Count Parameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Hemoglobin \(Hb\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Mentzer Index/i)[0]).toBeInTheDocument();

    // Switch to CMP panel
    const cmpTab = screen.getByRole('button', { name: /CMP & Electrolytes/i });
    fireEvent.click(cmpTab);
    expect(screen.getByText(/Metabolic Panel & Electrolytes/i)).toBeInTheDocument();
    expect(screen.getByText(/Serum Glucose \(mg\/dL\)/i)).toBeInTheDocument();
    expect(screen.getByText(/BUN \/ Cr Ratio/i)).toBeInTheDocument();

    // Switch to COAG panel
    const coagTab = screen.getByRole('button', { name: /Coagulation & Liver/i });
    fireEvent.click(coagTab);
    expect(screen.getByText(/Coagulation Cascade & Liver Tests/i)).toBeInTheDocument();
    expect(screen.getByText(/PT \(sec\) \/ INR/i)).toBeInTheDocument();
    expect(screen.getByText(/1:1 Mixing Study aPTT/i)).toBeInTheDocument();
  });

  it('updates calculations when sliders/inputs change', () => {
    render(<ClinicalLabInterpretationSimulator />);

    // In ABG panel, change pH from 7.15 to 7.50 with PaCO2=20 -> Primary Respiratory Alkalosis
    const pHInput = screen.getByDisplayValue('7.15');
    fireEvent.change(pHInput, { target: { value: '7.50' } });

    expect(screen.getByRole('heading', { name: /Primary Respiratory Alkalosis/i })).toBeInTheDocument();
  });

  it('loads clinical case presets and toggles expected diagnosis', () => {
    render(<ClinicalLabInterpretationSimulator />);

    // Click on Beta-Thalassemia Minor preset
    const thalBtn = screen.getByRole('button', { name: /Beta-Thalassemia Minor/i });
    fireEvent.click(thalBtn);

    // Active panel should switch to CBC
    expect(screen.getByText(/Case: Beta-Thalassemia Minor/i)).toBeInTheDocument();

    // Toggle reveal diagnosis
    const revealBtn = screen.getByRole('button', { name: /Reveal Expected Diagnosis/i });
    fireEvent.click(revealBtn);

    expect(screen.getByText(/Expected Board Diagnosis:/i)).toBeInTheDocument();
    expect(screen.getByText(/Mentzer Index = 62 \/ 6.2 = 10.0/i)).toBeInTheDocument();
  });

  it('dispatches mediverse:open-ai-with-context custom event on Consult AI click', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<ClinicalLabInterpretationSimulator />);

    const aiBtn = screen.getByRole('button', { name: /Consult Socratic AI/i });
    fireEvent.click(aiBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );

    dispatchSpy.mockRestore();
  });

  it('resets current panel values to standard baseline upon clicking Reset', () => {
    render(<ClinicalLabInterpretationSimulator />);

    // In ABG, currently pH is 7.15 (DKA). Click Reset.
    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetBtn);

    // Baseline pH should now be 7.40
    expect(screen.getByRole('heading', { name: /Normal Acid-Base Homeostasis/i })).toBeInTheDocument();
  });
});
