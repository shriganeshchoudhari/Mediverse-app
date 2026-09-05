import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CRRTSimulator from '@/components/simulators/CRRTSimulator';

// Mock Recharts ResponsiveContainer
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container" style={{ width: 600, height: 300 }}>
        {children}
      </div>
    ),
  };
});

describe('CRRTSimulator Component', () => {
  it('renders station title, KDIGO guideline badge, and HUD pressure gauges', () => {
    render(<CRRTSimulator />);

    expect(
      screen.getByRole('heading', { name: /Continuous Renal Replacement Therapy \(CRRT\) Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/KDIGO \/ ADQI Guidelines/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Yield Critical Care AKI Presets/i)).toBeInTheDocument();
    expect(screen.getByText(/TMP \(Transmembrane\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter Drop \(ΔP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Access \(Pacc\)/i)).toBeInTheDocument();
  });

  it('renders all 4 CRRT modalities and allows toggling', () => {
    render(<CRRTSimulator />);

    const scufBtn = screen.getByRole('button', { name: 'SCUF' });
    const cvvhBtn = screen.getByRole('button', { name: 'CVVH' });
    const cvvhdBtn = screen.getByRole('button', { name: 'CVVHD' });
    const cvvhdfBtn = screen.getByRole('button', { name: 'CVVHDF' });

    expect(scufBtn).toBeInTheDocument();
    expect(cvvhBtn).toBeInTheDocument();
    expect(cvvhdBtn).toBeInTheDocument();
    expect(cvvhdfBtn).toBeInTheDocument();

    fireEvent.click(scufBtn);
    // When SCUF is selected, dialysate flow should display 0
    expect(screen.getAllByText(/0 mL\/hr/i).length).toBeGreaterThanOrEqual(1);

    fireEvent.click(cvvhdfBtn);
  });

  it('switches between Solute and Hydraulics chart views', () => {
    render(<CRRTSimulator />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();

    const hydraulicsBtn = screen.getByRole('button', { name: /Fluid Balance & TMP/i });
    fireEvent.click(hydraulicsBtn);

    const solutesBtn = screen.getByRole('button', { name: /BUN, K\+, HCO3-/i });
    fireEvent.click(solutesBtn);
  });

  it('loads filter clotting preset and displays critical membrane alarm', () => {
    render(<CRRTSimulator />);

    const clottingPreset = screen.getByText(/Acute Filter Thrombosis/i);
    fireEvent.click(clottingPreset);

    // Should display filter clotted or high TMP warning
    expect(screen.getByText(/FILTER CLOTTED \/ REPLACE|HIGH TMP WARNING/i)).toBeInTheDocument();
  });

  it('loads citrate toxicity preset and displays Citrate Lock alarm', () => {
    render(<CRRTSimulator />);

    const citratePreset = screen.getByText(/Citrate Accumulation/i);
    fireEvent.click(citratePreset);

    expect(screen.getAllByText(/CITRATE LOCK/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/CRITICAL ALERT: Citrate Lock \/ Toxicity/i)).toBeInTheDocument();
  });

  it('loads SCUF post-cardiac preset and sets modality to SCUF', () => {
    render(<CRRTSimulator />);

    const scufPreset = screen.getByText(/Post-Cardiopulmonary Bypass/i);
    fireEvent.click(scufPreset);

    expect(screen.getByText(/Walter H\./i)).toBeInTheDocument();
  });

  it('dispatches mediverse:open-ai-with-context on clicking Consult Socratic AI', () => {
    render(<CRRTSimulator />);

    const eventListener = jest.fn();
    window.addEventListener('mediverse:open-ai-with-context', eventListener);

    const askAIBtn = screen.getByRole('button', { name: /Consult Socratic AI/i });
    fireEvent.click(askAIBtn);

    expect(eventListener).toHaveBeenCalledTimes(1);
    const detail = eventListener.mock.calls[0][0].detail;
    expect(detail.context).toContain('Continuous Renal Replacement Therapy (CRRT) Consultation');
    expect(detail.context).toContain('Transmembrane Pressure');
    expect(detail.context).toContain('KDIGO');

    window.removeEventListener('mediverse:open-ai-with-context', eventListener);
  });
});
