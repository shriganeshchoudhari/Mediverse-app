import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PeritonealDialysisSimulator from '../../components/simulators/PeritonealDialysisSimulator';

describe('PeritonealDialysisSimulator Component', () => {
  it('renders title, scoreboard cards, and modality recommendations', () => {
    render(<PeritonealDialysisSimulator />);

    expect(screen.getByText(/Peritoneal Dialysis \(PD\), Adequacy & PET Membrane Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/4h D\/P Creatinine/i)).toBeInTheDocument();
    expect(screen.getByText(/4h Net Ultrafiltration/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Total Weekly Kt\/V/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/ISPD 2022 Peritonitis/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Prescription Recommendation:/i)).toBeInTheDocument();
  });

  it('switches tabs and displays tab-specific biophysical panels', () => {
    render(<PeritonealDialysisSimulator />);

    // Default tab: PET & Transport Dynamics
    expect(screen.getByText(/PET Dextrose & Serum Chemistry/i)).toBeInTheDocument();
    expect(screen.getByText(/Timed Dialysate Effluent Samples/i)).toBeInTheDocument();

    // Tab 2: Three-Pore Model & UFF
    const tab2 = screen.getByRole('button', { name: /Three-Pore Model & UFF/i });
    fireEvent.click(tab2);
    expect(screen.getByText(/Three-Pore Membrane Model Biophysics/i)).toBeInTheDocument();
    expect(screen.getByText(/Sodium Sieving & Ultrafiltration Failure \(UFF\) Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Ultra-Small Pores \(Aquaporin-1\)/i)).toBeInTheDocument();

    // Tab 3: Weekly Kt/V & Adequacy
    const tab3 = screen.getByRole('button', { name: /Weekly Kt\/V & Adequacy/i });
    fireEvent.click(tab3);
    expect(screen.getAllByText(/Watson Total Body Water/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Residual Kidney Function/i)).toBeInTheDocument();

    // Tab 4: ISPD Peritonitis Protocol
    const tab4 = screen.getByRole('button', { name: /ISPD Peritonitis Protocol/i });
    fireEvent.click(tab4);
    expect(screen.getByText(/ISPD 2022 Diagnostic Triad/i)).toBeInTheDocument();
    expect(screen.getByText(/Intraperitoneal \(IP\) Regimen Recommendations/i)).toBeInTheDocument();
  });

  it('changes clinical presets and dynamically updates transport and UFF status', () => {
    render(<PeritonealDialysisSimulator />);

    // Switch to Type I UFF preset
    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'TYPE_1_UFF_HIGH_TRANSPORTER' } });

    expect(screen.getAllByText(/High Transporter/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Type I UFF/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Automated Peritoneal Dialysis \(APD \/ CCPD\)/i).length).toBeGreaterThan(0);
  });

  it('switches to ISPD Acute Peritonitis preset and renders empiric antibiotic protocol', () => {
    render(<PeritonealDialysisSimulator />);

    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'ISPD_ACUTE_PERITONITIS' } });

    // Peritonitis scoreboard should display POSITIVE
    expect(screen.getAllByText(/POSITIVE/i).length).toBeGreaterThan(0);

    // Switch to tab 4 to view antibiotics
    const tab4 = screen.getByRole('button', { name: /ISPD Peritonitis Protocol/i });
    fireEvent.click(tab4);

    expect(screen.getByText(/CONFIRMED PERITONITIS:/i)).toBeInTheDocument();
    expect(screen.getByText(/IP Cefazolin/i)).toBeInTheDocument();
    expect(screen.getByText(/IP Ceftazidime/i)).toBeInTheDocument();
  });
});
