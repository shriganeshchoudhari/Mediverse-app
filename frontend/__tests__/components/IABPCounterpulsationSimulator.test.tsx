import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IABPCounterpulsationSimulator from '@/components/simulators/IABPCounterpulsationSimulator';

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

describe('IABPCounterpulsationSimulator Component', () => {
  it('renders station title, mechanical support badge, and hemodynamic HUD', () => {
    render(<IABPCounterpulsationSimulator />);

    expect(
      screen.getByRole('heading', { name: /Intra-Aortic Balloon Pump \(IABP\) Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Mechanical Circulatory Support/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Yield Clinical Presets/i)).toBeInTheDocument();
    expect(screen.getByText(/Unassisted Systolic \(PSP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Augmented Peak \(PDP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Balloon End-Diastolic \(BAEDP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Assisted Systolic \(APSP\)/i)).toBeInTheDocument();
  });

  it('switches assist ratio between 1:1, 1:2, and 1:3', () => {
    render(<IABPCounterpulsationSimulator />);

    const fullBtn = screen.getByRole('button', { name: /1:1 \(Full\)/i });
    fireEvent.click(fullBtn);
    expect(fullBtn).toHaveClass('bg-rose-600');

    const weanBtn = screen.getByRole('button', { name: /1:3 \(Wean\)/i });
    fireEvent.click(weanBtn);
    expect(weanBtn).toHaveClass('bg-rose-600');

    const diagBtn = screen.getByRole('button', { name: /1:2 \(Diag\)/i });
    fireEvent.click(diagBtn);
    expect(diagBtn).toHaveClass('bg-rose-600');
  });

  it('toggles balloon volume between 30cc, 40cc, and 50cc', () => {
    render(<IABPCounterpulsationSimulator />);

    const vol50Btn = screen.getByRole('button', { name: /50 cc/i });
    fireEvent.click(vol50Btn);
    expect(vol50Btn).toHaveClass('bg-rose-950');

    const vol30Btn = screen.getByRole('button', { name: /30 cc/i });
    fireEvent.click(vol30Btn);
    expect(vol30Btn).toHaveClass('bg-rose-950');
  });

  it('loads Early Inflation preset and displays EARLY INFLATION ERROR alert', () => {
    render(<IABPCounterpulsationSimulator />);

    const earlyPreset = screen.getAllByText(/Early Inflation/i)[0];
    fireEvent.click(earlyPreset);

    expect(screen.getAllByText(/EARLY INFLATION ERROR/i).length).toBeGreaterThanOrEqual(1);
  });

  it('loads Late Deflation preset and displays LATE DEFLATION ERROR alert', () => {
    render(<IABPCounterpulsationSimulator />);

    const lateDeflPreset = screen.getAllByText(/Late Deflation/i)[0];
    fireEvent.click(lateDeflPreset);

    expect(screen.getAllByText(/LATE DEFLATION ERROR/i).length).toBeGreaterThanOrEqual(1);
  });

  it('loads Aortic Regurgitation preset and triggers AORTIC REGURGITATION HAZARD alert', () => {
    render(<IABPCounterpulsationSimulator />);

    const arPreset = screen.getAllByText(/Aortic Regurgitation/i)[0];
    fireEvent.click(arPreset);

    expect(screen.getAllByText(/AORTIC REGURGITATION HAZARD/i).length).toBeGreaterThanOrEqual(1);
  });

  it('resets timing to optimal with Auto-Align Timing button', () => {
    render(<IABPCounterpulsationSimulator />);

    const autoBtn = screen.getByRole('button', { name: /Auto-Align Timing/i });
    fireEvent.click(autoBtn);

    expect(screen.getByText(/OPTIMAL COUNTERPULSATION/i)).toBeInTheDocument();
  });

  it('dispatches mediverse:open-ai-with-context on clicking Consult Socratic AI', () => {
    render(<IABPCounterpulsationSimulator />);

    const eventListener = jest.fn();
    window.addEventListener('mediverse:open-ai-with-context', eventListener);

    const askAIBtn = screen.getByRole('button', { name: /Consult Socratic AI/i });
    fireEvent.click(askAIBtn);

    expect(eventListener).toHaveBeenCalledTimes(1);
    const detail = eventListener.mock.calls[0][0].detail;
    expect(detail.context).toContain('Intra-Aortic Balloon Pump (IABP) Counterpulsation Workstation');
    expect(detail.context).toContain('Assist Ratio');
    expect(detail.context).toContain('Augmented Peak Diastolic (PDP)');

    window.removeEventListener('mediverse:open-ai-with-context', eventListener);
  });
});
