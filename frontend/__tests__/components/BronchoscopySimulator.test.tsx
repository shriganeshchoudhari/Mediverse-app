import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BronchoscopySimulator } from '@/components/simulators/BronchoscopySimulator';

describe('BronchoscopySimulator Component', () => {
  it('renders simulator header, AABIP/CHEST standard badge, and scope controls', () => {
    render(<BronchoscopySimulator />);

    expect(
      screen.getByRole('heading', { name: /Flexible Bronchoscopy & EBUS Staging Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/AABIP \/ CHEST \/ IASLC Standard/i)).toBeInTheDocument();
    expect(screen.getByText(/Bronchoscope Kinematics/i)).toBeInTheDocument();
    expect(screen.getByText(/HD Video Bronchoscopy Viewport/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates initial scope position and tools', () => {
    render(<BronchoscopySimulator />);

    const ebusPreset = screen.getAllByText(/EBUS-TBNA Subcarinal/i)[0];
    fireEvent.click(ebusPreset);

    expect(screen.getByText(/EBUS: ON/i)).toBeInTheDocument();
    expect(screen.getByText(/EBUS-TBNA Staging Tools/i)).toBeInTheDocument();
  });

  it('performs EBUS-TBNA aspiration and displays ROSE cytology report', () => {
    render(<BronchoscopySimulator />);

    const ebusPreset = screen.getAllByText(/EBUS-TBNA Subcarinal/i)[0];
    fireEvent.click(ebusPreset);

    const tbnaBtn = screen.getByRole('button', { name: /Perform TBNA Aspiration/i });
    fireEvent.click(tbnaBtn);

    expect(screen.getByText(/Rapid On-Site Evaluation \(ROSE\) Cytology/i)).toBeInTheDocument();
    expect(screen.getByText(/POSITIVE FOR MALIGNANCY/i)).toBeInTheDocument();
  });

  it('executes hemoptysis control actions with cold saline and balloon tamponade', () => {
    render(<BronchoscopySimulator />);

    const hemoPreset = screen.getAllByText(/Massive Endobronchial Hemoptysis/i)[0];
    fireEvent.click(hemoPreset);

    expect(screen.getByText(/Hemoptysis Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/ACTIVE BLEED/i)).toBeInTheDocument();

    const balloonBtn = screen.getByRole('button', { name: /Inflate Tamponade Balloon/i });
    fireEvent.click(balloonBtn);

    expect(screen.getByText(/CONTROLLED/i)).toBeInTheDocument();
  });

  it('dispatches mediverse:open-ai-with-context when Ask Socratic AI is clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<BronchoscopySimulator />);

    const askAiBtn = screen.getByRole('button', { name: /Ask Socratic AI/i });
    fireEvent.click(askAiBtn);

    expect(dispatchSpy).toHaveBeenCalled();
    const eventCall = dispatchSpy.mock.calls.find(call => (call[0] as CustomEvent).type === 'mediverse:open-ai-with-context');
    expect(eventCall).toBeDefined();

    dispatchSpy.mockRestore();
  });
});
