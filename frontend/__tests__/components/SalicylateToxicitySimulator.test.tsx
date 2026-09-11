import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SalicylateToxicitySimulator from '../../components/simulators/SalicylateToxicitySimulator';

describe('SalicylateToxicitySimulator Component', () => {
  it('renders the Salicylate toxicity workstation title and key panels', () => {
    render(<SalicylateToxicitySimulator />);

    expect(
      screen.getByText(/Salicylate Toxicity, Ion Trapping & EXTRIP Hemodialysis Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Exposure & Blood Gas Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Ion Trapping & Renal Clearance/i)).toBeInTheDocument();
    expect(screen.getByText(/EXTRIP Dialysis Solver/i)).toBeInTheDocument();
  });

  it('correctly calculates mixed disorder and urinary alkalinization on acute overdose preset', () => {
    render(<SalicylateToxicitySimulator />);

    const acutePresetBtn = screen.getByText(/Acute Severe Aspirin Overdose \(Mixed Resp Alk \+ HAGMA\)/i);
    fireEvent.click(acutePresetBtn);

    expect(screen.getAllByText(/Primary Respiratory Alkalosis/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/High Anion Gap Metabolic Acidosis/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/IV SODIUM BICARBONATE PROTOCOL/i)).toBeInTheDocument();
  });

  it('detects and alerts for hypokalemic paradoxical aciduria', () => {
    render(<SalicylateToxicitySimulator />);

    const hypokalemiaPresetBtn = screen.getByText(/Alkalinization Failure \(Hypokalemic Paradoxical Aciduria\)/i);
    fireEvent.click(hypokalemiaPresetBtn);

    expect(screen.getAllByText(/PARADOXICAL ACIDURIA DETECTED/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/potassium repletion/i).length).toBeGreaterThanOrEqual(1);
  });

  it('mandates emergent hemodialysis on catastrophic acute salicylism preset', () => {
    render(<SalicylateToxicitySimulator />);

    const catastrophicPresetBtn = screen.getByText(/Catastrophic Salicylism with Acidemia & Coma/i);
    fireEvent.click(catastrophicPresetBtn);

    expect(screen.getAllByText(/DIALYSIS MANDATORY/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/EMERGENT INTERMITTENT HEMODIALYSIS/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Altered mental status/i).length).toBeGreaterThanOrEqual(1);
  });

  it('evaluates chronic geriatric salicylism with delirium', () => {
    render(<SalicylateToxicitySimulator />);

    const chronicPresetBtn = screen.getByText(/Chronic Geriatric Salicylism with Delirium/i);
    fireEvent.click(chronicPresetBtn);

    expect(screen.getAllByText(/DIALYSIS MANDATORY/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/EMERGENT INTERMITTENT HEMODIALYSIS/i)).toBeInTheDocument();
  });
});
