import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CoronaryAngiographySimulator from '@/components/simulators/CoronaryAngiographySimulator';

describe('CoronaryAngiographySimulator Component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(() => cb(1000), 16) as unknown as number;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id as unknown as NodeJS.Timeout);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders simulator header, SCAI badge, C-arm gantry controls, and pressure oscilloscope', () => {
    render(<CoronaryAngiographySimulator />);

    expect(
      screen.getByRole('heading', { name: /Diagnostic Cardiac Catheterization & Coronary Angiography/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/SCAI \/ ACC \/ AHA Standard/i)).toBeInTheDocument();
    expect(screen.getByText(/FLUOROSCOPY C-ARM/i)).toBeInTheDocument();
    expect(screen.getByText(/Invasive Pressure Oscilloscope/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates hemodynamics and revascularization plan', () => {
    render(<CoronaryAngiographySimulator />);

    // Click on Acute Anterior STEMI preset
    const stemiBtn = screen.getAllByText(/Acute Anterior STEMI/i)[0];
    fireEvent.click(stemiBtn);

    expect(screen.getByText(/TIMI 0 Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary PCI with aspiration thrombectomy/i)).toBeInTheDocument();
  });

  it('allows projection switching across standard C-arm views', () => {
    render(<CoronaryAngiographySimulator />);

    const raoCaudalBtn = screen.getByRole('button', { name: /RAO Caudal/i });
    fireEvent.click(raoCaudalBtn);

    expect(screen.getByText(/RAO 30°/i)).toBeInTheDocument();
    expect(screen.getByText(/Caud 25°/i)).toBeInTheDocument();
  });

  it('triggers contrast injection cine run', () => {
    render(<CoronaryAngiographySimulator />);

    const injectBtn = screen.getByRole('button', { name: /Inject Contrast \(Pedal\)/i });
    fireEvent.click(injectBtn);

    expect(screen.getByText(/CINE RECORDING/i)).toBeInTheDocument();
  });

  it('toggles IV Adenosine hyperemia and dispatches Socratic AI context', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<CoronaryAngiographySimulator />);

    const adenoBtn = screen.getByRole('button', { name: /IV Adenosine Hyperemia/i });
    fireEvent.click(adenoBtn);

    expect(screen.getByRole('button', { name: /Adenosine Hyperemia: ON/i })).toBeInTheDocument();

    const askAiBtn = screen.getByRole('button', { name: /Ask Socratic AI/i });
    fireEvent.click(askAiBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
        detail: expect.objectContaining({
          context: expect.stringContaining('Diagnostic Cardiac Catheterization & Coronary Angiography Case:')
        })
      })
    );
  });
});
