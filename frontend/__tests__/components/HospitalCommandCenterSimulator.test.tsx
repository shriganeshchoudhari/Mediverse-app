import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HospitalCommandCenterSimulator from '@/components/simulators/HospitalCommandCenterSimulator';

describe('HospitalCommandCenterSimulator', () => {
  it('renders hospital command center title and surge level badge', () => {
    render(<HospitalCommandCenterSimulator />);
    expect(screen.getByText(/Mediverse Metropolitan Academic Medical Center/i)).toBeInTheDocument();
    expect(screen.getByText(/SURGE LEVEL/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Occupancy/i)).toBeInTheDocument();
  });

  it('allows filtering beds by clinical unit and inspecting bed details', () => {
    render(<HospitalCommandCenterSimulator />);
    const icuBtn = screen.getByRole('button', { name: /^ICU$/i });
    fireEvent.click(icuBtn);

    const icuBedBtn = screen.getAllByText(/ICU-201/i)[0];
    expect(icuBedBtn).toBeInTheDocument();

    fireEvent.click(icuBedBtn);
    expect(screen.getByText(/Bed & Patient Inspector/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Diagnosis:/i)).toBeInTheDocument();
  });

  it('switches between command center tabs', () => {
    render(<HospitalCommandCenterSimulator />);
    
    // Patient flow tab
    const flowTab = screen.getByRole('button', { name: /Patient Flow & Throughput Dynamics/i });
    fireEvent.click(flowTab);
    expect(screen.getByText(/Emergency Department Boarding Queue/i)).toBeInTheDocument();

    // Staffing tab
    const staffingTab = screen.getByRole('button', { name: /Staffing & Acuity Ratios/i });
    fireEvent.click(staffingTab);
    expect(screen.getByText(/Unit Staffing Levels & Nurse-to-Patient Ratios/i)).toBeInTheDocument();

    // HAC tab
    const hacTab = screen.getByRole('button', { name: /HAC & Safety Surveillance/i });
    fireEvent.click(hacTab);
    expect(screen.getByText(/CAUTI Surveillance/i)).toBeInTheDocument();

    // Surge tab
    const surgeTab = screen.getByRole('button', { name: /Surge Operations Console/i });
    fireEvent.click(surgeTab);
    expect(screen.getByText(/Surge Capacity Mitigation Console/i)).toBeInTheDocument();
  });

  it('toggles surge mitigation actions in the surge tab', () => {
    render(<HospitalCommandCenterSimulator />);
    const surgeTab = screen.getByRole('button', { name: /Surge Operations Console/i });
    fireEvent.click(surgeTab);

    const inactiveButtons = screen.getAllByRole('button', { name: /Inactive/i });
    expect(inactiveButtons.length).toBeGreaterThan(0);

    fireEvent.click(inactiveButtons[0]);
    expect(screen.getByRole('button', { name: /^Active$/i })).toBeInTheDocument();
  });

  it('loads a master clinical scenario preset', () => {
    render(<HospitalCommandCenterSimulator />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'winter-viral-surge' } });
    expect(screen.getByText(/SURGE LEVEL RED/i)).toBeInTheDocument();
  });
});
