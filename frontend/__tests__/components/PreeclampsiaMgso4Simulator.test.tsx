import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PreeclampsiaMgso4Simulator from '../../components/simulators/PreeclampsiaMgso4Simulator';

describe('PreeclampsiaMgso4Simulator Component', () => {
  beforeEach(() => {
    // Mock window.alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders simulator header, scoreboard, and all 5 tabs correctly', () => {
    render(<PreeclampsiaMgso4Simulator />);

    expect(
      screen.getByText(/Preeclampsia with Severe Features, Eclampsia & MgSO4 Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/ACOG & SOAP Guidelines/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Diagnostic Classification/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Circulating Serum Mg2\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Maternal Blood Pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/Reflexes & Respiration/i)).toBeInTheDocument();

    // Verify 5 tab buttons
    expect(screen.getByText(/1\. Diagnostic Criteria & Severe Features/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Zuspan MgSO4 Loading & Infusion/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Toxicity Cascades & Calcium Antidote/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Emergent Antihypertensive Cascade/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Obstetric Delivery & HELLP Planning/i)).toBeInTheDocument();
  });

  it('switches clinical presets and displays active eclamptic seizure banner', () => {
    render(<PreeclampsiaMgso4Simulator />);

    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'ACTIVE_ECLAMPTIC_SEIZURE_ACUTE' } });

    expect(
      screen.getAllByText(/CRITICAL OBSTETRIC EMERGENCY: ACTIVE ECLAMPTIC SEIZURE/i).length
    ).toBeGreaterThan(0);
    const bolusBtn = screen.getByRole('button', { name: /Push 6g IV MgSO4 Bolus/i });
    expect(bolusBtn).toBeInTheDocument();

    fireEvent.click(bolusBtn);
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/EMERGENCY MAGNESIUM SULFATE BOLUS GIVEN/i)
    );
  });

  it('switches to magnesium toxicity preset and administers 10% Calcium Gluconate', () => {
    render(<PreeclampsiaMgso4Simulator />);

    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'MAGNESIUM_TOXICITY_RESPIRATORY_ARREST' } });

    expect(screen.getAllByText(/MAGNESIUM TOXICITY DETECTED/i).length).toBeGreaterThan(0);

    // Switch to Tab 3: Toxicity
    fireEvent.click(screen.getByText(/3\. Toxicity Cascades & Calcium Antidote/i));

    const calciumBtns = screen.getAllByRole('button', { name: /Push 10% Calcium Gluconate|Administer 10% Calcium Gluconate/i });
    expect(calciumBtns.length).toBeGreaterThan(0);

    fireEvent.click(calciumBtns[0]);
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/10% CALCIUM GLUCONATE ADMINISTERED/i)
    );
  });

  it('navigates to Antihypertensive tab and administers IV Labetalol', () => {
    render(<PreeclampsiaMgso4Simulator />);

    // Click Tab 4: Antihypertensives
    fireEvent.click(screen.getByText(/4\. Emergent Antihypertensive Cascade/i));

    expect(screen.getByText(/ACOG Emergent Antihypertensive Algorithms/i)).toBeInTheDocument();
    const labetalolBtn = screen.getByRole('button', { name: /IV Labetalol \(1st Line\)/i });
    expect(labetalolBtn).toBeInTheDocument();

    fireEvent.click(labetalolBtn);
    // Maternal BP reduced from 172/114 to 150/98
    expect(screen.getByText(/150 \/ 98/i)).toBeInTheDocument();
  });

  it('navigates to Obstetric Delivery tab and displays HELLP guidelines', () => {
    render(<PreeclampsiaMgso4Simulator />);

    // Click Tab 5: Delivery
    fireEvent.click(screen.getByText(/5\. Obstetric Delivery & HELLP Planning/i));

    expect(
      screen.getByText(/Delivery Timing & HELLP Syndrome Management/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/HELLP Syndrome Triad/i)).toBeInTheDocument();
    expect(screen.getByText(/Gestational Age Thresholds/i)).toBeInTheDocument();
  });
});
