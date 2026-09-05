import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CPBPerfusionSimulator } from '@/components/simulators/CPBPerfusionSimulator';

describe('CPBPerfusionSimulator Component', () => {
  it('renders simulator header, AmSECT/STS standard badge, and pump controls', () => {
    render(<CPBPerfusionSimulator />);

    expect(
      screen.getByRole('heading', { name: /Cardiopulmonary Bypass \(CPB\) Perfusion Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/AmSECT \/ STS Standard/i)).toBeInTheDocument();
    expect(screen.getByText(/Arterial Pump & Gas/i)).toBeInTheDocument();
    expect(screen.getByText(/Extracorporeal Circuit Flow Map/i)).toBeInTheDocument();
    expect(screen.getByText(/Perfusion Adequacy HUD/i)).toBeInTheDocument();
  });

  it('switches between roller and centrifugal arterial pump types', () => {
    render(<CPBPerfusionSimulator />);

    const centrifugalBtn = screen.getByRole('button', { name: 'Centrifugal' });
    fireEvent.click(centrifugalBtn);

    expect(screen.getByText(/Centrifugal Constrained Vortex Head/i)).toBeInTheDocument();

    const rollerBtn = screen.getByRole('button', { name: 'Roller' });
    fireEvent.click(rollerBtn);

    expect(screen.getByText(/Double-Roller Occlusive Head/i)).toBeInTheDocument();
  });

  it('loads Aortic Arch DHCA preset and activates hypothermia and ACP controls', () => {
    render(<CPBPerfusionSimulator />);

    const dhcaPreset = screen.getAllByText(/Aortic Arch Aneurysm with DHCA/i)[0];
    fireEvent.click(dhcaPreset);

    expect(screen.getByText(/18.0°C/i)).toBeInTheDocument();
    expect(screen.getByText(/DHCA Arrest: ON/i)).toBeInTheDocument();
    expect(screen.getByText(/ACP ACTIVE/i)).toBeInTheDocument();
  });

  it('displays critical reservoir alarm when venous airlock preset is selected', () => {
    render(<CPBPerfusionSimulator />);

    const airlockPreset = screen.getAllByText(/Venous Airlock & Critical Reservoir Depletion/i)[0];
    fireEvent.click(airlockPreset);

    expect(screen.getAllByText(/RESERVOIR CRITICAL LOW/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/650 mL/i).length).toBeGreaterThanOrEqual(1);
  });

  it('provides rescue button for AT-III administration when heparin resistance is present', () => {
    render(<CPBPerfusionSimulator />);

    const resistancePreset = screen.getAllByText(/Antithrombin III Deficiency & Heparin Resistance/i)[0];
    fireEvent.click(resistancePreset);

    const rescueBtn = screen.getByRole('button', { name: /Administer 1000 IU AT-III \/ FFP/i });
    expect(rescueBtn).toBeInTheDocument();

    fireEvent.click(rescueBtn);
    // After administration, AT-III should restore to 100% and rescue button disappears
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('dispatches mediverse:open-ai-with-context when Ask Socratic AI is clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<CPBPerfusionSimulator />);

    const askAiBtn = screen.getByRole('button', { name: /Ask Socratic AI/i });
    fireEvent.click(askAiBtn);

    expect(dispatchSpy).toHaveBeenCalled();
    const eventCall = dispatchSpy.mock.calls.find(call => (call[0] as CustomEvent).type === 'mediverse:open-ai-with-context');
    expect(eventCall).toBeDefined();

    dispatchSpy.mockRestore();
  });
});
