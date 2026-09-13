import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VentilatorWeaningSimulator from '../../components/simulators/VentilatorWeaningSimulator';

describe('VentilatorWeaningSimulator Component', () => {
  it('renders the workstation header and default scenario', () => {
    render(<VentilatorWeaningSimulator />);

    expect(screen.getByText(/Difficult Ventilator Weaning & SBT Workstation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Yang-Tobin RSBI/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Diaphragm POCUS/i)).toBeInTheDocument();
    expect(screen.getByText(/Airway Occlusion P0.1/i)).toBeInTheDocument();
    expect(screen.getByText(/Cuff Leak & Stridor Risk/i)).toBeInTheDocument();
  });

  it('shows extubation ready for default smooth PSV wean case', () => {
    render(<VentilatorWeaningSimulator />);

    expect(screen.getByText(/PATIENT CLEARED FOR IMMEDIATE EXTUBATION/i)).toBeInTheDocument();
    expect(screen.getByText(/EXTUBATION READY/i)).toBeInTheDocument();
  });

  it('switches to VIDD scenario and indicates weaning failure and diaphragmatic atrophy', () => {
    render(<VentilatorWeaningSimulator />);

    const viddButton = screen.getByText(/2. Difficult Wean: Ventilator-Induced Diaphragmatic Dysfunction/i);
    fireEvent.click(viddButton);

    expect(screen.getByText(/VIDD Detected/i)).toBeInTheDocument();
    expect(screen.getByText(/ABORT WEANING TRIAL/i)).toBeInTheDocument();
  });

  it('switches to failed cuff leak scenario and alerts regarding laryngeal edema hazard', () => {
    render(<VentilatorWeaningSimulator />);

    const cuffButton = screen.getByText(/3. Failed Cuff Leak: Post-Extubation Stridor & Glottic Edema Hazard/i);
    fireEvent.click(cuffButton);

    expect(screen.getByText(/High \(> 35% - Laryngeal Edema\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Glottic edema \/ high re-intubation risk/i)).toBeInTheDocument();
  });

  it('switches to cardiovascular weaning failure and alerts regarding flash edema', () => {
    render(<VentilatorWeaningSimulator />);

    const cardioButton = screen.getByText(/4. Occult Cardiovascular Weaning Failure/i);
    fireEvent.click(cardioButton);

    expect(screen.getByText(/WEANING FAILED/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardiac Weaning Failure:/i)).toBeInTheDocument();
  });
});
