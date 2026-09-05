import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ICPDynamicsSimulator from '@/components/simulators/ICPDynamicsSimulator';

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

describe('ICPDynamicsSimulator Component', () => {
  it('renders station title, BTF guidelines badge, and HUD pressure gauges', () => {
    render(<ICPDynamicsSimulator />);

    expect(
      screen.getByRole('heading', { name: /Neurocritical Care & Intracranial Pressure \(ICP\) Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/BTF Guidelines/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Yield Neurocritical Presets/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Intracranial Pressure \(ICP\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Mean Arterial \(MAP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Cerebral Perfusion \(CPP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Pupils \(R \/ L\)/i)).toBeInTheDocument();
  });

  it('switches between Pulse Waveform, Monro-Kellie curve, and Lundberg monitoring views', () => {
    render(<ICPDynamicsSimulator />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();

    const monroKellieBtn = screen.getByRole('button', { name: /Monro-Kellie Elastance Curve/i });
    fireEvent.click(monroKellieBtn);
    expect(screen.getAllByText(/Monro-Kellie/i).length).toBeGreaterThanOrEqual(1);

    const lundbergBtn = screen.getByRole('button', { name: /30-Min Lundberg Wave Monitoring/i });
    fireEvent.click(lundbergBtn);
    expect(screen.getAllByText(/Lundberg/i).length).toBeGreaterThanOrEqual(1);

    const pulseBtn = screen.getByRole('button', { name: /ICP Pulse Waveform/i });
    fireEvent.click(pulseBtn);
  });

  it('loads uncal herniation preset and displays UNCAL HERNIATION alert with blown pupil', () => {
    render(<ICPDynamicsSimulator />);

    const uncalPreset = screen.getAllByText(/Severe TBI/i)[0];
    fireEvent.click(uncalPreset);

    expect(screen.getAllByText(/UNCAL HERNIATION ACTIVE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/R: 7mm/i)).toBeInTheDocument();
  });

  it('loads Cushing Triad preset and verifies CUSHING TRIAD status alarm', () => {
    render(<ICPDynamicsSimulator />);

    const cushingPreset = screen.getAllByText(/Tonsillar Herniation/i)[0];
    fireEvent.click(cushingPreset);

    expect(screen.getAllByText(/CUSHING TRIAD/i).length).toBeGreaterThanOrEqual(1);
  });

  it('toggles Tier 1 hypertonic saline and mannitol interventions', () => {
    render(<ICPDynamicsSimulator />);

    const salineBtn = screen.getByRole('button', { name: /3% NaCl Bolus/i });
    fireEvent.click(salineBtn);

    const mannitolBtn = screen.getByRole('button', { name: /Mannitol 20%/i });
    fireEvent.click(mannitolBtn);
  });

  it('dispatches mediverse:open-ai-with-context on clicking Consult Socratic AI', () => {
    render(<ICPDynamicsSimulator />);

    const eventListener = jest.fn();
    window.addEventListener('mediverse:open-ai-with-context', eventListener);

    const askAIBtn = screen.getByRole('button', { name: /Consult Socratic AI/i });
    fireEvent.click(askAIBtn);

    expect(eventListener).toHaveBeenCalledTimes(1);
    const detail = eventListener.mock.calls[0][0].detail;
    expect(detail.context).toContain('Neurocritical Care & Intracranial Pressure (ICP / TBI) Workstation');
    expect(detail.context).toContain('Monro-Kellie');
    expect(detail.context).toContain('Cerebral Perfusion Pressure (CPP)');

    window.removeEventListener('mediverse:open-ai-with-context', eventListener);
  });
});
