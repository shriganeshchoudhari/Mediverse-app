import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ECMODynamicsSimulator from '@/components/simulators/ECMODynamicsSimulator';

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

describe('ECMODynamicsSimulator Component', () => {
  it('renders station title, ELSO guidelines badge, and primary clinical HUD', () => {
    render(<ECMODynamicsSimulator />);

    expect(
      screen.getByRole('heading', { name: /Extracorporeal Membrane Oxygenation \(ECMO\) Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/ELSO Guidelines Console/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Yield Clinical ECMO Presets/i)).toBeInTheDocument();
    expect(screen.getByText(/Systemic SaO2/i)).toBeInTheDocument();
    expect(screen.getByText(/PaCO2 & Arterial pH/i)).toBeInTheDocument();
    expect(screen.getByText(/Circuit Blood Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Drainage Pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/Transmembrane ΔP/i)).toBeInTheDocument();
  });

  it('switches between ECMO cannulation modalities', () => {
    render(<ECMODynamicsSimulator />);

    const vaFemoralBtn = screen.getByRole('button', { name: /VA Femoral \(Peripheral\)/i });
    fireEvent.click(vaFemoralBtn);
    expect(screen.getByText(/Dual Circulation Assessment/i)).toBeInTheDocument();

    const vaCentralBtn = screen.getByRole('button', { name: /VA Central \(Post-Cardiotomy\)/i });
    fireEvent.click(vaCentralBtn);

    const vvBtn = screen.getByRole('button', { name: /VV ECMO \(Respiratory\)/i });
    fireEvent.click(vvBtn);
  });

  it('loads High Recirculation preset and displays HIGH RECIRCULATION alert', () => {
    render(<ECMODynamicsSimulator />);

    const recalcPreset = screen.getAllByText(/High Recirculation/i)[0];
    fireEvent.click(recalcPreset);

    expect(screen.getAllByText(/HIGH RECIRCULATION/i).length).toBeGreaterThanOrEqual(1);
  });

  it('loads Harlequin syndrome preset and displays HARLEQUIN SYNDROME ACTIVE alert', () => {
    render(<ECMODynamicsSimulator />);

    const harlequinPreset = screen.getAllByText(/Harlequin Syndrome/i)[0];
    fireEvent.click(harlequinPreset);

    expect(screen.getAllByText(/HARLEQUIN SYNDROME ACTIVE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Differential Hypoxemia Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Upper Body \(Right Radial Art Line\)/i)).toBeInTheDocument();
  });

  it('loads Membrane Lung Thrombosis preset and displays OXYGENATOR THROMBOSIS alert', () => {
    render(<ECMODynamicsSimulator />);

    const clottedPreset = screen.getAllByText(/Oxygenator Failure/i)[0];
    fireEvent.click(clottedPreset);

    expect(screen.getAllByText(/OXYGENATOR THROMBOSIS/i).length).toBeGreaterThanOrEqual(1);
  });

  it('dispatches mediverse:open-ai-with-context on clicking Consult Socratic AI', () => {
    render(<ECMODynamicsSimulator />);

    const eventListener = jest.fn();
    window.addEventListener('mediverse:open-ai-with-context', eventListener);

    const askAIBtn = screen.getByRole('button', { name: /Consult Socratic AI/i });
    fireEvent.click(askAIBtn);

    expect(eventListener).toHaveBeenCalledTimes(1);
    const detail = eventListener.mock.calls[0][0].detail;
    expect(detail.context).toContain('Extracorporeal Membrane Oxygenation (ECMO) Workstation');
    expect(detail.context).toContain('Blood Flow');
    expect(detail.context).toContain('Sweep Gas');

    window.removeEventListener('mediverse:open-ai-with-context', eventListener);
  });
});
