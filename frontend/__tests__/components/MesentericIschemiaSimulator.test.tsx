import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MesentericIschemiaSimulator from '../../components/simulators/MesentericIschemiaSimulator';

describe('MesentericIschemiaSimulator Component', () => {
  it('1. renders header, badges, and case presets', () => {
    render(<MesentericIschemiaSimulator />);

    expect(screen.getByText(/Acute Mesenteric Ischemia \(AMI\) & Revascularization Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B36/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. SMA Embolism \(Afib\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Normal Lactate Trap/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. NOMI in ICU Shock/i)).toBeInTheDocument();
  });

  it('2. switches to "Normal Lactate Trap" preset and displays false-negative alert', () => {
    render(<MesentericIschemiaSimulator />);

    const trapBtn = screen.getByText(/2\. Normal Lactate Trap/i);
    fireEvent.click(trapBtn);

    expect(screen.getAllByText(/FALSE-NEGATIVE TRAP/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/SERUM LACTATE PITFALL/i)[0]).toBeInTheDocument();
  });

  it('3. renders hero 4-panel grid (Viability Stage, Serum Lactate, Bowel Preservation, Surgical Strategy)', () => {
    render(<MesentericIschemiaSimulator />);

    expect(screen.getByText(/Viability Stage/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Serum Lactate/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Bowel Preservation/i)).toBeInTheDocument();
    expect(screen.getByText(/Surgical Strategy/i)).toBeInTheDocument();
  });

  it('4. navigates across tabs (Diagnostics, Subtypes, Revascularization, Second-Look)', () => {
    render(<MesentericIschemiaSimulator />);

    // Tab 2: Subtypes
    const subtypesTab = screen.getByText(/2\. 4-Subtype Differential Bench/i);
    fireEvent.click(subtypesTab);
    expect(screen.getByText(/1\. SMA Embolism \(40-50%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. NOMI \(20%\)/i)).toBeInTheDocument();

    // Tab 3: Revascularization
    const revascTab = screen.getByText(/3\. Revascularization & Papaverine/i);
    fireEvent.click(revascTab);
    expect(screen.getByText(/Papaverine Infusion Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Surgical Embolectomy & Patch/i)).toBeInTheDocument();

    // Tab 4: Second-Look
    const secondLookTab = screen.getByText(/4\. Damage Control & Second-Look/i);
    fireEvent.click(secondLookTab);
    expect(screen.getByText(/Damage Control Resection Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Short Bowel Syndrome \(SBS\) Prevention/i)).toBeInTheDocument();
  });

  it('5. toggles Second-Look Laparotomy scheduling to ensure damage control adherence', () => {
    render(<MesentericIschemiaSimulator />);

    // Go to Second-Look Tab
    fireEvent.click(screen.getByText(/4\. Damage Control & Second-Look/i));

    // Initially Not Scheduled
    expect(screen.getByText(/Not Scheduled \(Risk!\)/i)).toBeInTheDocument();

    // Click toggle button
    fireEvent.click(screen.getByText(/Not Scheduled \(Risk!\)/i));

    expect(screen.getByText(/Second-Look Scheduled/i)).toBeInTheDocument();
  });
});
