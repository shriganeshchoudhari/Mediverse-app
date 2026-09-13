import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BronchopleuralFistulaSimulator from '../../components/simulators/BronchopleuralFistulaSimulator';

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

describe('BronchopleuralFistulaSimulator Component', () => {
  it('renders the header title, badges, and all 5 preset buttons', () => {
    render(<BronchopleuralFistulaSimulator />);
    expect(screen.getByText(/Bronchopleural Fistula \(BPF\) & Persistent Air Leak Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B39 \(Route #240\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cerfolio Class/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dual-Ventilator ILV/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/1\. Central Stump Dehiscence/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Dual-Ventilator ILV/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Peripheral PAL & Blood Patch/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. One-Way Valves \(EBV\)/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Clamped Tube Catastrophe/i)).toBeInTheDocument();
  });

  it('renders Hero 4-panel clinical metrics grid correctly', () => {
    render(<BronchopleuralFistulaSimulator />);
    expect(screen.getAllByText(/Ventilatory Steal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cerfolio Air Leak/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Transpulmonary Shear/i)).toBeInTheDocument();
    expect(screen.getByText(/Tension Risk & Healing/i)).toBeInTheDocument();
    expect(screen.getByText(/EFFECTIVE MINUTE VENT/i)).toBeInTheDocument();
    expect(screen.getByText(/LEAK TIMING/i)).toBeInTheDocument();
  });

  it('triggers lethal tension pneumothorax alert on selecting Clamped Tube preset', () => {
    render(<BronchopleuralFistulaSimulator />);
    const clampedBtn = screen.getByText(/5\. Clamped Tube Catastrophe/i);
    fireEvent.click(clampedBtn);

    // Verify catastrophic tension pneumothorax alert
    expect(screen.getAllByText(/LETHAL DISASTER: CHEST TUBE MUST NEVER BE CLAMPED/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TENSION ARREST/i).length).toBeGreaterThan(0);
  });

  it('supports navigation across all four clinical sub-tabs', () => {
    render(<BronchopleuralFistulaSimulator />);

    // Click Tab 2: Dual-Ventilator Independent Lung Ventilation (ILV)
    const tab2 = screen.getByText(/2\. Dual-Ventilator Independent Lung Ventilation \(ILV\)/i);
    fireEvent.click(tab2);
    expect(screen.getByText(/Independent Lung Ventilation \(ILV\) Setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Asymmetric Lung Vent Titration/i)).toBeInTheDocument();

    // Click Tab 3: Pleural Suction vs Water Seal Dilemma
    const tab3 = screen.getByText(/3\. Pleural Suction vs Water Seal Dilemma & Clamping Hazard/i);
    fireEvent.click(tab3);
    expect(screen.getByText(/Pleural Drainage Mode & Suction Dilemma/i)).toBeInTheDocument();
    expect(screen.getByText(/The Chest Tube Clamping Catastrophe/i)).toBeInTheDocument();

    // Click Tab 4: Interventional EBV Valves & Surgical Flap
    const tab4 = screen.getByText(/4\. Interventional EBV Valves & Surgical Flap Coverage/i);
    fireEvent.click(tab4);
    expect(screen.getByText(/Interventional Bronchoscopy \(EBV & Blood Patch\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Surgical Muscle Flap Re-Exploration/i)).toBeInTheDocument();

    // Click Tab 1 back
    const tab1 = screen.getByText(/1\. Ventilatory Steal & Cerfolio Classification/i);
    fireEvent.click(tab1);
    expect(screen.getByText(/Cerfolio Air Leak Classification System/i)).toBeInTheDocument();
  });

  it('displays tension alert when switching Pleural Drainage to Clamped in Tab 3', () => {
    render(<BronchopleuralFistulaSimulator />);

    // Switch to Tab 3: Suction & Clamping
    const tab3 = screen.getByText(/3\. Pleural Suction vs Water Seal Dilemma & Clamping Hazard/i);
    fireEvent.click(tab3);

    // Click Clamped Chest Tube option
    const clampBtn = screen.getByText(/Clamped Chest Tube \(CATASTROPHIC HAZARD\)/i);
    fireEvent.click(clampBtn);

    // Verify tension alert is fired
    expect(screen.getAllByText(/LETHAL DISASTER: CHEST TUBE MUST NEVER BE CLAMPED/i).length).toBeGreaterThan(0);
  });
});
