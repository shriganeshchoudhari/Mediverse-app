import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TmaTtpAhusSimulator from '../../components/simulators/TmaTtpAhusSimulator';

// Mock Recharts components if needed
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

describe('TmaTtpAhusSimulator Component', () => {
  it('renders the header title, badges, and all 5 preset buttons', () => {
    render(<TmaTtpAhusSimulator />);
    expect(screen.getByText(/Thrombotic Microangiopathies \(TMA\): TTP vs aHUS Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B38 \(Route #239\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PLASMIC Score \(0-7\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ADAMTS13/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/1\. Acute Immune TTP \(High Risk\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Atypical HUS \(aHUS\)/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. The Pentad Myth \(Dyad Only\)/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Platelet "Fuel to Fire"/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. STEC-HUS \(Shiga Toxin\)/i)).toBeInTheDocument();
  });

  it('renders Hero 4-panel diagnostic metrics grid correctly', () => {
    render(<TmaTtpAhusSimulator />);
    expect(screen.getByText(/PLASMIC Prediction Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Hematology & MAHA/i)).toBeInTheDocument();
    expect(screen.getByText(/ADAMTS13 & Complement/i)).toBeInTheDocument();
    expect(screen.getByText(/Organ Injury & Coagulation/i)).toBeInTheDocument();
    expect(screen.getByText(/MAHA CONFIRMED/i)).toBeInTheDocument();
    expect(screen.getByText(/DIC EXCLUDED/i)).toBeInTheDocument();
  });

  it('triggers lethal warning alert when selecting Platelet "Fuel to Fire" preset', () => {
    render(<TmaTtpAhusSimulator />);
    const fuelPresetBtn = screen.getByText(/4\. Platelet "Fuel to Fire"/i);
    fireEvent.click(fuelPresetBtn);

    // Verify alert appears in clinical alerts strip
    expect(screen.getAllByText(/FUEL TO THE FIRE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Platelet transfusion in TTP is strictly CONTRAINDICATED/i).length).toBeGreaterThan(0);
  });

  it('supports navigation across all four clinical sub-tabs', () => {
    render(<TmaTtpAhusSimulator />);

    // Click Tab 2: Peripheral Smear & Hemolysis Profiling
    const tab2 = screen.getByText(/2\. Peripheral Smear & Hemolysis Profiling/i);
    fireEvent.click(tab2);
    expect(screen.getByText(/Peripheral Blood Film & Schistocyte Quantification/i)).toBeInTheDocument();
    expect(screen.getByText(/Intravascular Hemolysis Biomarker Panel/i)).toBeInTheDocument();

    // Click Tab 3: TTP Triple Therapy & Transfusion Hazard
    const tab3 = screen.getByText(/3\. TTP Triple Therapy & Transfusion Hazard/i);
    fireEvent.click(tab3);
    expect(screen.getByText(/TTP Triple Therapy Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/The Platelet Transfusion Pitfall/i)).toBeInTheDocument();

    // Click Tab 4: aHUS Complement Blockade & STEC-HUS
    const tab4 = screen.getByText(/4\. aHUS Complement Blockade & STEC-HUS/i);
    fireEvent.click(tab4);
    expect(screen.getByText(/Atypical HUS \(aHUS\): Complement C5 Blockade/i)).toBeInTheDocument();
    expect(screen.getByText(/STEC-HUS \(Shiga Toxin-Producing E\. coli\)/i)).toBeInTheDocument();

    // Click Tab 1 back
    const tab1 = screen.getByText(/1\. PLASMIC Score & Dyad vs Pentad/i);
    fireEvent.click(tab1);
    expect(screen.getByText(/The 7 PLASMIC Predictors/i)).toBeInTheDocument();
    expect(screen.getByText(/The Pentad Myth vs Bedside Dyad Rule/i)).toBeInTheDocument();
  });

  it('displays lethal warning when toggling Platelet Transfusion order button in Tab 3', () => {
    render(<TmaTtpAhusSimulator />);

    // Switch to Tab 3: TTP Therapy
    const tab3 = screen.getByText(/3\. TTP Triple Therapy & Transfusion Hazard/i);
    fireEvent.click(tab3);

    // Click Withheld (Safe) to trigger transfusion
    const toggleTransfusionBtn = screen.getByText(/Withheld \(Safe\)/i);
    fireEvent.click(toggleTransfusionBtn);

    // Expect TRANSFUSED (PITFALL!) state
    expect(screen.getByText(/TRANSFUSED \(PITFALL!\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/FUEL TO THE FIRE/i).length).toBeGreaterThan(0);
  });
});
