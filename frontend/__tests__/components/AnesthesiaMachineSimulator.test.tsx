import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnesthesiaMachineSimulator from '@/components/simulators/AnesthesiaMachineSimulator';

// Mock Recharts responsive container and charts for jsdom
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container" style={{ width: 400, height: 200 }}>
        {children}
      </div>
    ),
  };
});

describe('AnesthesiaMachineSimulator', () => {
  it('renders simulator title, flowmeters, and capnogram display', () => {
    render(<AnesthesiaMachineSimulator />);

    expect(screen.getByText(/Anesthesia Delivery & Vaporizer Workstation/i)).toBeInTheDocument();
    expect(screen.getByText('Circle System & Low Flow')).toBeInTheDocument();
    expect(screen.getByText(/Gas Flowmeters/i)).toBeInTheDocument();
    expect(screen.getByText(/Vaporizer Interlock/i)).toBeInTheDocument();
    expect(screen.getByText(/Circle System & CO₂ Absorber/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Capnogram Waveform/i)).toBeInTheDocument();
  });

  it('renders all 6 clinical anesthesia presets', () => {
    render(<AnesthesiaMachineSimulator />);

    expect(screen.getByText('Routine Low-Flow Balanced Anesthesia')).toBeInTheDocument();
    expect(screen.getByText('Malignant Hyperthermia (MH) Crisis')).toBeInTheDocument();
    expect(screen.getByText('Hospital Pipeline Oxygen Failure')).toBeInTheDocument();
    expect(screen.getByText('Y-Piece Circuit Disconnect')).toBeInTheDocument();
    expect(screen.getByText('Incompetent Expiratory Unidirectional Valve')).toBeInTheDocument();
    expect(screen.getByText('Desflurane Rapid Wash-Out & Emergence')).toBeInTheDocument();
  });

  it('activates Malignant Hyperthermia crisis management and allows Dantrolene administration', () => {
    render(<AnesthesiaMachineSimulator />);

    const mhBtn = screen.getByText('Malignant Hyperthermia (MH) Crisis').closest('button');
    expect(mhBtn).toBeInTheDocument();
    fireEvent.click(mhBtn!);

    // Should display MH crisis alert and management panel
    expect(screen.getAllByText(/MALIGNANT HYPERTHERMIA/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Initial Dose \(2\.5 mg\/kg\):/i)).toBeInTheDocument();

    const dantroleneBtn = screen.getByRole('button', { name: /Administer Dantrolene/i });
    expect(dantroleneBtn).toBeInTheDocument();
    fireEvent.click(dantroleneBtn);

    // Dantrolene administered dose should increase
    expect(screen.getByText(/Dantrolene given: 188 mg/i)).toBeInTheDocument();
  });

  it('executes 100% O2 Flush action', () => {
    render(<AnesthesiaMachineSimulator />);

    const flushBtn = screen.getByRole('button', { name: /100% O₂ Flush/i });
    expect(flushBtn).toBeInTheDocument();
    fireEvent.click(flushBtn);

    // O2 flow should be 10 L/min
    expect(screen.getByText(/Total FGF: 10 L\/min/i)).toBeInTheDocument();
  });

  it('displays heated Tec 6 vaporizer badge when Desflurane is selected', () => {
    render(<AnesthesiaMachineSimulator />);

    const desBtn = screen.getByRole('button', { name: 'Desflurane' });
    fireEvent.click(desBtn);

    expect(screen.getByText(/Tec 6 Heated Vaporizer:/i)).toBeInTheDocument();
    expect(screen.getByText(/39°C \(2\.0 atm \/ 1500 mmHg\)/i)).toBeInTheDocument();
  });

  it('dispatches Socratic AI custom event when Ask Socratic AI is clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<AnesthesiaMachineSimulator />);

    const aiBtn = screen.getByRole('button', { name: /Ask Socratic AI/i });
    fireEvent.click(aiBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );
    dispatchSpy.mockRestore();
  });
});
