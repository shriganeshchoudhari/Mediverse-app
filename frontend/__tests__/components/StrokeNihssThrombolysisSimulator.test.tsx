import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StrokeNihssThrombolysisSimulator } from '../../components/simulators/StrokeNihssThrombolysisSimulator';

describe('StrokeNihssThrombolysisSimulator Component', () => {
  it('renders header, title, and initial executive cards', () => {
    render(<StrokeNihssThrombolysisSimulator />);
    expect(
      screen.getByText(/Acute Ischemic Stroke \(AIS\), NIHSS, ASPECTS & Thrombolysis Protocol Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Total NIHSS Score/i)).toBeInTheDocument();
    expect(screen.getByText(/ASPECTS Score/i)).toBeInTheDocument();
    expect(screen.getAllByText(/IV Thrombolysis/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/EVT \/ Thrombectomy/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Hemodynamic Guardrail/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches between interactive workbench tabs', () => {
    render(<StrokeNihssThrombolysisSimulator />);

    // Tab 2: NIHSS
    const nihssTab = screen.getByRole('button', { name: /2\. NIHSS 11-Item Exam/i });
    fireEvent.click(nihssTab);
    expect(screen.getByText(/National Institutes of Health Stroke Scale \(NIHSS\)/i)).toBeInTheDocument();
    expect(screen.getByText(/1a\. Level of Consciousness/i)).toBeInTheDocument();

    // Tab 3: ASPECTS
    const aspectsTab = screen.getByRole('button', { name: /3\. ASPECTS CT Map/i });
    fireEvent.click(aspectsTab);
    expect(screen.getByText(/ASPECTS \(Alberta Stroke Program Early CT Score\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Subcortical Ganglionic Structures/i)).toBeInTheDocument();

    // Tab 4: Protocol
    const protocolTab = screen.getByRole('button', { name: /4\. Thrombolytic & EVT Bench/i });
    fireEvent.click(protocolTab);
    expect(screen.getByText(/Parenteral Thrombolytic Dosing & EVT Decision Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Thrombolytic Agent Selection/i)).toBeInTheDocument();

    // Tab 5: Guardrails
    const guardrailsTab = screen.getByRole('button', { name: /5\. Hemodynamics & Complications/i });
    fireEvent.click(guardrailsTab);
    expect(screen.getByText(/Post-Reperfusion Hemodynamics & Complication Protocols/i)).toBeInTheDocument();
    expect(screen.getByText(/Thrombolysis Blood Pressure Targets/i)).toBeInTheDocument();
  });

  it('updates ASPECTS score when regions are clicked', () => {
    render(<StrokeNihssThrombolysisSimulator />);
    const aspectsTab = screen.getByRole('button', { name: /3\. ASPECTS CT Map/i });
    fireEvent.click(aspectsTab);

    // Initial has insularRibbon affected -> 9/10
    expect(screen.getByText(/9 \/ 10/i)).toBeInTheDocument();

    // Clear all button -> 10/10
    const clearBtn = screen.getByRole('button', { name: /Clear All/i });
    fireEvent.click(clearBtn);
    expect(screen.getByText(/10 \/ 10/i)).toBeInTheDocument();
  });

  it('allows loading clinical presets', () => {
    render(<StrokeNihssThrombolysisSimulator />);
    const wakeUpBtn = screen.getByRole('button', { name: /Wake-Up Stroke with DWI-FLAIR Mismatch/i });
    fireEvent.click(wakeUpBtn);

    expect(screen.getByText(/Hours from Last Known Well \(LKW\): Unknown \(Wake-up\)/i)).toBeInTheDocument();
  });

  it('detects contraindication when CT bleed checkbox is checked', () => {
    render(<StrokeNihssThrombolysisSimulator />);
    const bleedChk = screen.getByLabelText(/Evidence of Intracranial Hemorrhage on CT/i);
    expect(bleedChk).not.toBeChecked();

    fireEvent.click(bleedChk);
    expect(bleedChk).toBeChecked();

    // Go to Protocol tab and verify Ineligible
    const protocolTab = screen.getByRole('button', { name: /4\. Thrombolytic & EVT Bench/i });
    fireEvent.click(protocolTab);
    expect(screen.getByText(/IV Thrombolysis is CONTRAINDICATED/i)).toBeInTheDocument();
  });

  it('updates NIHSS item selection', () => {
    render(<StrokeNihssThrombolysisSimulator />);
    const nihssTab = screen.getByRole('button', { name: /2\. NIHSS 11-Item Exam/i });
    fireEvent.click(nihssTab);

    const locSelect = screen.getByLabelText(/1a\. Level of Consciousness/i);
    fireEvent.change(locSelect, { target: { value: '3' } });
    expect(locSelect).toHaveValue('3');
  });
});
