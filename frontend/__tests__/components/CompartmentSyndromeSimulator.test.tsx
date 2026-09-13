import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompartmentSyndromeSimulator from '../../components/simulators/CompartmentSyndromeSimulator';

describe('CompartmentSyndromeSimulator Component', () => {
  it('1. renders header, badges, and case presets', () => {
    render(<CompartmentSyndromeSimulator />);

    expect(screen.getByText(/Acute Compartment Syndrome & Fasciotomy Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/McQueen ΔP Criteria/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B34/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Tibial Fracture ACS/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Shock & Delta P ≤ 30/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Incomplete Fasciotomy/i)).toBeInTheDocument();
  });

  it('2. switches to "Shock & Delta P" preset and displays occult ACS in trauma shock', () => {
    render(<CompartmentSyndromeSimulator />);

    const shockBtn = screen.getByText(/2\. Shock & Delta P ≤ 30/i);
    fireEvent.click(shockBtn);

    expect(screen.getAllByText(/48 mmHg/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/FASCIOTOMY INDICATED/i)[0]).toBeInTheDocument();
  });

  it('3. renders hero 4-panel pressure & perfusion grid', () => {
    render(<CompartmentSyndromeSimulator />);

    expect(screen.getAllByText(/Compartment Pressure/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/4-Compartment Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/The "6 P's" Signs/i)).toBeInTheDocument();
    expect(screen.getByText(/Rhabdo & Renal Kinetics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/STRETCH PAIN \+/i)[0]).toBeInTheDocument();
  });

  it('4. navigates across tabs (Transduction, Fasciotomy, Rhabdomyolysis, Exam)', () => {
    render(<CompartmentSyndromeSimulator />);

    // Tab 2: Fasciotomy
    const fasciotomyTab = screen.getByText(/2\. Two-Incision Four-Compartment Fasciotomy/i);
    fireEvent.click(fasciotomyTab);
    expect(screen.getByText(/Surgical Technique Selector/i)).toBeInTheDocument();
    expect(screen.getByText(/Two-Incision Anatomic Pearls/i)).toBeInTheDocument();

    // Tab 3: Rhabdo
    const rhabdoTab = screen.getByText(/3\. Rhabdomyolysis & Crush Nephroprotection/i);
    fireEvent.click(rhabdoTab);
    expect(screen.getByText(/Fluid Resuscitation & Urine Alkalinization/i)).toBeInTheDocument();

    // Tab 4: Exam
    const examTab = screen.getByText(/4\. The 6 P's & Physical Exam Bench/i);
    fireEvent.click(examTab);
    expect(screen.getByText(/The "6 P's" Comprehensive Bedside Examination/i)).toBeInTheDocument();
  });

  it('5. executes two-incision four-compartment fasciotomy to decompress all compartments', () => {
    render(<CompartmentSyndromeSimulator />);

    // Go to Fasciotomy tab
    fireEvent.click(screen.getByText(/2\. Two-Incision Four-Compartment Fasciotomy/i));

    // Click Two-Incision action button inside tab panel
    const completeBtns = screen.getAllByText(/Two-Incision Four-Compartment Fasciotomy/i);
    fireEvent.click(completeBtns[1]);

    expect(screen.getByText(/Complete Two-Incision Four-Compartment Decompression Achieved/i)).toBeInTheDocument();
  });
});
