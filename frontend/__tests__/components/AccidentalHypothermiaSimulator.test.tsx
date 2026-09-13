import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccidentalHypothermiaSimulator from '../../components/simulators/AccidentalHypothermiaSimulator';

// Mock Recharts components
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

describe('AccidentalHypothermiaSimulator Component', () => {
  it('renders the header title, badges, and preset buttons', () => {
    render(<AccidentalHypothermiaSimulator />);
    expect(screen.getByText(/Severe Accidental Hypothermia & ECLS Rewarming Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B37 \(Route #238\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Swiss Staging \(HT I-IV\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Warm & Dead Rule \(32-35°C\)/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Stage III Severe \(26\.5°C\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. The Afterdrop Pitfall/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Arrest & ECLS Rewarming/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Rewarming Shock/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Irreversible Death/i)).toBeInTheDocument();
  });

  it('renders Hero 4-panel metrics grid correctly', () => {
    render(<AccidentalHypothermiaSimulator />);
    expect(screen.getAllByText(/Core Temperature/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/CEREBRAL METABOLISM/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cardiac Rhythm/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/OSBORN \(J\) WAVE/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Rewarming Kinetics/i)).toBeInTheDocument();
    expect(screen.getByText(/AFTERDROP DEFICIT/i)).toBeInTheDocument();
    expect(screen.getByText(/HOPE Survival Score/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SERUM POTASSIUM/i).length).toBeGreaterThan(0);
  });

  it('triggers Afterdrop warning and physiological state on selecting Afterdrop preset', () => {
    render(<AccidentalHypothermiaSimulator />);
    const afterdropBtn = screen.getByText(/2\. The Afterdrop Pitfall/i);
    fireEvent.click(afterdropBtn);

    // Check that Afterdrop alert text is displayed in clinical alerts strip
    expect(screen.getAllByText(/CRITICAL BIOPHYSICAL PITFALL \(AFTERDROP\)/i).length).toBeGreaterThan(0);
  });

  it('supports navigation across all four clinical sub-tabs', () => {
    render(<AccidentalHypothermiaSimulator />);

    // Click Tab 2: Biophysics of Afterdrop & Rewarming Shock
    const tab2 = screen.getByText(/2\. Biophysics of Afterdrop & Rewarming Shock/i);
    fireEvent.click(tab2);
    expect(screen.getByText(/Rewarming Method & Afterdrop Mechanics/i)).toBeInTheDocument();
    expect(screen.getByText(/Rewarming Shock & Cold Diuresis/i)).toBeInTheDocument();

    // Click Tab 3: Modified ACLS & Osborn (J) Waves
    const tab3 = screen.getByText(/3\. Modified ACLS & Osborn \(J\) Waves/i);
    fireEvent.click(tab3);
    expect(screen.getByText(/Modified ACLS Guidelines in Hypothermia/i)).toBeInTheDocument();
    expect(screen.getByText(/Osborn \(J\) Wave Morphology/i)).toBeInTheDocument();

    // Click Tab 4: ECLS / VA-ECMO & HOPE Score
    const tab4 = screen.getByText(/4\. ECLS \/ VA-ECMO & HOPE Score/i);
    fireEvent.click(tab4);
    expect(screen.getByText(/Extracorporeal VA-ECMO Rewarming/i)).toBeInTheDocument();
    expect(screen.getByText(/HOPE Survival Calculator/i)).toBeInTheDocument();

    // Click Tab 1 back
    const tab1 = screen.getByText(/1\. Swiss Staging & "Warm and Dead" Protocol/i);
    fireEvent.click(tab1);
    expect(screen.getByText(/Core Temperature & Clinical Status/i)).toBeInTheDocument();
  });

  it('displays modified ACLS warnings when Epinephrine is given below 30°C', () => {
    render(<AccidentalHypothermiaSimulator />);

    // Switch to Tab 3: ACLS
    const aclsTab = screen.getByText(/3\. Modified ACLS & Osborn \(J\) Waves/i);
    fireEvent.click(aclsTab);

    // Click Withheld (Safe) button to toggle Epi to Given (PITFALL)
    const toggleEpiBtn = screen.getByText(/Withheld \(Safe\)/i);
    fireEvent.click(toggleEpiBtn);

    // Verify ACLS warning alert is triggered
    expect(screen.getAllByText(/ACLS PITFALL: Epinephrine and antiarrhythmics are CONTRAINDICATED below 30°C/i).length).toBeGreaterThan(0);
  });
});
