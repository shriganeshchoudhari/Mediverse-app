import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoboticSurgerySimulator from '@/components/simulators/RoboticSurgerySimulator';

describe('RoboticSurgerySimulator Component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      return setTimeout(() => cb(1000), 16) as unknown as number;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
      clearTimeout(id as unknown as NodeJS.Timeout);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders surgical console, insufflator panel, table tilt gantry, and telemetry bar', () => {
    render(<RoboticSurgerySimulator />);

    expect(
      screen.getByRole('heading', { name: /Surgical Scenarios & Laparoscopic Crisis Simulation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/da Vinci Surgical Console & Laparoscopic Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/CO2 Insufflation Hydraulics/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient Table Gantry & Tilt/i)).toBeInTheDocument();
    expect(screen.getByText(/Electrosurgery & Energy Biophysics/i)).toBeInTheDocument();
    expect(screen.getByText(/3D HD Laparoscopic Surgical Viewport/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates surgical procedure and alarms', () => {
    render(<RoboticSurgerySimulator />);

    // Switch to Acute CO2 Gas Embolism preset
    const gasEmbolismBtn = screen.getByText(/Acute CO2 Venous Gas Embolism Emergency/i);
    fireEvent.click(gasEmbolismBtn);

    expect(screen.getByText(/SURGICAL COMPLICATION DETECTED/i)).toBeInTheDocument();
    expect(screen.getAllByText(/CO2_GAS_EMBOLISM/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/CO2 Venous Ingress \(Gas Embolism\)/i)).toBeInTheDocument();
  });

  it('allows IAP adjustment and table tilt manipulation', () => {
    render(<RoboticSurgerySimulator />);

    // Click Level (0°) table tilt button
    const levelBtn = screen.getByRole('button', { name: /Level \(0°\)/i });
    fireEvent.click(levelBtn);

    expect(screen.getByText(/Neutral 0°/i)).toBeInTheDocument();
  });

  it('handles emergency Durant maneuver rescue during gas embolism', () => {
    render(<RoboticSurgerySimulator />);

    // Switch to gas embolism preset
    const gasEmbolismBtn = screen.getByText(/Acute CO2 Venous Gas Embolism Emergency/i);
    fireEvent.click(gasEmbolismBtn);

    // Click Durant's maneuver rescue button
    const durantBtn = screen.getByRole('button', { name: /Execute Durant's Maneuver/i });
    fireEvent.click(durantBtn);

    expect(screen.getByText(/Durant's Maneuver executed/i)).toBeInTheDocument();
  });

  it('supports Critical View of Safety verification in Lap Cholecystectomy', () => {
    render(<RoboticSurgerySimulator />);

    // Switch to Lap Chole preset
    const choleBtn = screen.getByText(/Laparoscopic Cholecystectomy: Critical View of Safety/i);
    fireEvent.click(choleBtn);

    const cvsBtn = screen.getByRole('button', { name: /Critical View Confirmed/i });
    expect(cvsBtn).toBeInTheDocument();
    expect(screen.getByText(/CVS Verified \(2 Structures Only\)/i)).toBeInTheDocument();
  });

  it('tracks warm ischemia time and toggles bulldog clamps in Partial Nephrectomy', () => {
    render(<RoboticSurgerySimulator />);

    // Switch to Partial Nephrectomy preset
    const rpnBtn = screen.getByText(/Robotic Partial Nephrectomy: Warm Ischemia Tracking/i);
    fireEvent.click(rpnBtn);

    expect(screen.getByText(/WIT:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Bulldog/i).length).toBeGreaterThan(0);

    const releaseClampBtn = screen.getByRole('button', { name: /Release Renal Clamps/i });
    fireEvent.click(releaseClampBtn);

    expect(screen.getByText(/Renal bulldog clamps released/i)).toBeInTheDocument();
  });

  it('dispatches Socratic AI custom event with full operative context', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<RoboticSurgerySimulator />);

    const aiBtn = screen.getByRole('button', { name: /Ask Socratic AI/i });
    fireEvent.click(aiBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context'
      })
    );
  });
});
