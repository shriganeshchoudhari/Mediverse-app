import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TEENavigationSimulator } from '@/components/simulators/TEENavigationSimulator';

describe('TEENavigationSimulator Component', () => {
  it('renders simulator header, ASE/SCA standard badge, and probe controls', () => {
    render(<TEENavigationSimulator />);

    expect(
      screen.getByRole('heading', { name: /Transesophageal Echocardiography \(TEE\) Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/ASE \/ SCA 28-View Standard/i)).toBeInTheDocument();
    expect(screen.getByText(/Probe Shaft & Omniplane/i)).toBeInTheDocument();
    expect(screen.getByText(/Acoustic Alignment Guidance/i)).toBeInTheDocument();
    expect(screen.getByText(/TEE B-Mode Real-Time Sector/i)).toBeInTheDocument();
  });

  it('updates omniplane angle when quick angle buttons are clicked', () => {
    render(<TEENavigationSimulator />);

    const buttons90 = screen.getAllByRole('button', { name: '90°' });
    fireEvent.click(buttons90[0]);

    // Omniplane angle should now display 90° in the gauge
    expect(screen.getByText('90°', { selector: 'span' })).toBeInTheDocument();
  });

  it('switches between clinical pathology presets', () => {
    render(<TEENavigationSimulator />);

    // Click Severe Calcific AS preset
    const asPreset = screen.getAllByText(/Severe Calcific Aortic Stenosis/i)[0];
    fireEvent.click(asPreset);

    // Should display Deep TG LAX as initial probe target and severe AS findings
    expect(screen.getAllByText(/DEEP TRANSGASTRIC/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches between Doppler, Valvular AS solver, and Diastology tabs', () => {
    render(<TEENavigationSimulator />);

    // Click AS Solver tab with exact name
    const asTabBtn = screen.getByRole('button', { name: /AS Solver/i });
    fireEvent.click(asTabBtn);
    expect(screen.getByText(/Continuity Equation Solver/i)).toBeInTheDocument();
    expect(screen.getByText(/Aortic Valve Area \(AVA\):/i)).toBeInTheDocument();

    // Click Diastology tab
    const diastologyButtons = screen.getAllByRole('button', { name: /Diastology/i });
    const diastologyTabBtn = diastologyButtons.find(b => b.textContent?.trim() === 'Diastology') || diastologyButtons[diastologyButtons.length - 1];
    fireEvent.click(diastologyTabBtn);
    expect(screen.getByText(/Diastolic & Chamber Pressures/i)).toBeInTheDocument();
    expect(screen.getByText(/E \/ A Ratio:/i)).toBeInTheDocument();
  });

  it('snaps to standard view when selected from dropdown', () => {
    render(<TEENavigationSimulator />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'TG_MID_SAX' } });

    expect(screen.getAllByText(/TG Mid-Papillary Short-Axis View/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/VIEW LOCKED/i).length).toBeGreaterThanOrEqual(1);
  });

  it('dispatches mediverse:open-ai-with-context when Ask Socratic AI is clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<TEENavigationSimulator />);

    const askAiBtn = screen.getByRole('button', { name: /Ask Socratic AI/i });
    fireEvent.click(askAiBtn);

    expect(dispatchSpy).toHaveBeenCalled();
    const eventCall = dispatchSpy.mock.calls.find(call => (call[0] as CustomEvent).type === 'mediverse:open-ai-with-context');
    expect(eventCall).toBeDefined();

    dispatchSpy.mockRestore();
  });
});
