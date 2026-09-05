import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardiacPacingSimulator from '@/components/simulators/CardiacPacingSimulator';

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

describe('CardiacPacingSimulator Component', () => {
  it('renders station title, dual-chamber badge, and telemetry HUD gauges', () => {
    render(<CardiacPacingSimulator />);

    expect(
      screen.getByRole('heading', { name: /Cardiac Electrophysiology & Temporary Pacemaker Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Dual-Chamber EPG/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Yield Clinical Presets/i)).toBeInTheDocument();
    expect(screen.getByText(/Effective Heart Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardiac Output/i)).toBeInTheDocument();
    expect(screen.getByText(/Mean Arterial \(MAP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Output Safety Margin/i)).toBeInTheDocument();
  });

  it('switches between pacing modes (VVI, DDD, VOO)', () => {
    render(<CardiacPacingSimulator />);

    const dddBtn = screen.getByRole('button', { name: /^DDD$/i });
    fireEvent.click(dddBtn);
    expect(screen.getByText(/Atrial Channel Settings/i)).toBeInTheDocument();

    const vooBtn = screen.getByRole('button', { name: /^VOO$/i });
    fireEvent.click(vooBtn);
    expect(screen.getAllByText(/VOO/i).length).toBeGreaterThanOrEqual(1);

    const vviBtn = screen.getByRole('button', { name: /^VVI$/i });
    fireEvent.click(vviBtn);
  });

  it('loads Failure to Capture preset and displays FAILURE TO CAPTURE alarm', () => {
    render(<CardiacPacingSimulator />);

    const ftcPreset = screen.getAllByText(/Failure to Capture/i)[0];
    fireEvent.click(ftcPreset);

    expect(screen.getAllByText(/FAILURE TO CAPTURE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Dislodged/i)).toBeInTheDocument();
  });

  it('loads Undersensing preset and displays R-ON-T POLYMORPHIC VF ACTIVE alarm', () => {
    render(<CardiacPacingSimulator />);

    const undersensingPreset = screen.getAllByText(/Undersensing/i)[0];
    fireEvent.click(undersensingPreset);

    expect(screen.getAllByText(/R-ON-T POLYMORPHIC VF ACTIVE/i).length).toBeGreaterThanOrEqual(1);
  });

  it('loads Oversensing preset and displays OVERSENSING ASYSTOLE alarm', () => {
    render(<CardiacPacingSimulator />);

    const oversensingPreset = screen.getAllByText(/Oversensing/i)[0];
    fireEvent.click(oversensingPreset);

    expect(screen.getAllByText(/OVERSENSING ASYSTOLE/i).length).toBeGreaterThanOrEqual(1);
  });

  it('dispatches mediverse:open-ai-with-context on clicking Consult Socratic AI', () => {
    render(<CardiacPacingSimulator />);

    const eventListener = jest.fn();
    window.addEventListener('mediverse:open-ai-with-context', eventListener);

    const askAIBtn = screen.getByRole('button', { name: /Consult Socratic AI/i });
    fireEvent.click(askAIBtn);

    expect(eventListener).toHaveBeenCalledTimes(1);
    const detail = eventListener.mock.calls[0][0].detail;
    expect(detail.context).toContain('Cardiac Electrophysiology & Temporary Pacemaker Workstation');
    expect(detail.context).toContain('Capture Status');
    expect(detail.context).toContain('Safety Margin');

    window.removeEventListener('mediverse:open-ai-with-context', eventListener);
  });
});
