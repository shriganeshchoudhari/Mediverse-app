import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PharmacogenomicsSimulator from '@/components/simulators/PharmacogenomicsSimulator';

// Mock Recharts responsive container for jsdom
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container" style={{ width: 500, height: 300 }}>
        {children}
      </div>
    ),
  };
});

describe('PharmacogenomicsSimulator Component', () => {
  it('renders simulator title, CPIC Level 1A badge, and presets', () => {
    render(<PharmacogenomicsSimulator />);

    expect(
      screen.getByRole('heading', { name: /Clinical Pharmacogenomics \(PGx\) Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/CPIC Level 1A/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/High-Yield Clinical Presets/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient Genomic Profile & Diplotype Selector/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Clinical Decision Support \(CDS\) Rules/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders and switches between CDS and Warfarin tabs', () => {
    render(<PharmacogenomicsSimulator />);

    const warfarinTab = screen.getByRole('button', { name: /IWPC Warfarin Dosing & 14-Day INR Kinetics/i });
    fireEvent.click(warfarinTab);

    expect(screen.getByText(/IWPC Clinical Parameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Predicted Maintenance Dose/i)).toBeInTheDocument();
    expect(screen.getByText(/14-Day INR Kinetic Curve/i)).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();

    const cdsTab = screen.getByRole('button', { name: /Clinical Decision Support \(CDS\) Rules/i });
    fireEvent.click(cdsTab);
    expect(screen.getByText(/Candidate Drug Selector/i)).toBeInTheDocument();
  });

  it('triggers CPIC CDS alert when Clopidogrel is selected for CYP2C19 Poor Metabolizer', () => {
    render(<PharmacogenomicsSimulator />);

    // Default preset is post-pci-clopidogrel (*2/*2)
    expect(screen.getByText(/Ineffective bioactivation of clopidogrel prodrug/i)).toBeInTheDocument();
    expect(screen.getByText(/Prescribe Prasugrel/i)).toBeInTheDocument();
    expect(screen.getByText(/ACTION REQUIRED/i)).toBeInTheDocument();
  });

  it('loads pediatric codeine preset and triggers CONTRAINDICATED alert', () => {
    render(<PharmacogenomicsSimulator />);

    const codeinePreset = screen.getByText('Liam T.');
    fireEvent.click(codeinePreset);

    expect(screen.getAllByText(/CONTRAINDICATED/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/FDA Black Box & CPIC Level 1A Warning/i)).toBeInTheDocument();
    expect(screen.getByText(/converted at accelerated rates to toxic morphine levels/i)).toBeInTheDocument();
  });

  it('loads Abacavir preset and displays HLA-B*57:01 hypersensitivity warning', () => {
    render(<PharmacogenomicsSimulator />);

    const abacavirPreset = screen.getByText('Marcus K.');
    fireEvent.click(abacavirPreset);

    expect(screen.getByText(/MANDATORY BLACK BOX WARNING: Patient is HLA-B\*57:01 positive/i)).toBeInTheDocument();
    expect(screen.getByText(/Prescribe Tenofovir Disoproxil\/Alafenamide/i)).toBeInTheDocument();
  });

  it('computes Warfarin IWPC dose adjustments and renders kinetic graph', () => {
    render(<PharmacogenomicsSimulator />);

    const warfarinPreset = screen.getByText('Harold C.');
    fireEvent.click(warfarinPreset);

    // Should switch to Warfarin tab or show predicted daily dose
    expect(screen.getByText(/Predicted Daily Dose/i)).toBeInTheDocument();
    expect(screen.getByText(/HIGH SENSITIVITY/i)).toBeInTheDocument();
  });

  it('dispatches mediverse:open-ai-with-context custom event on Ask AI button click', () => {
    render(<PharmacogenomicsSimulator />);

    const eventListener = jest.fn();
    window.addEventListener('mediverse:open-ai-with-context', eventListener);

    const askAIBtn = screen.getByRole('button', { name: /Consult Socratic AI/i });
    fireEvent.click(askAIBtn);

    expect(eventListener).toHaveBeenCalledTimes(1);
    const eventDetail = eventListener.mock.calls[0][0].detail;
    expect(eventDetail.context).toContain('Clinical Pharmacogenomics (PGx) Workstation Case');
    expect(eventDetail.context).toContain('CPIC Level 1A');

    window.removeEventListener('mediverse:open-ai-with-context', eventListener);
  });
});
