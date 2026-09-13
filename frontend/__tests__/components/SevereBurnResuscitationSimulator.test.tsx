import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SevereBurnResuscitationSimulator from '../../components/simulators/SevereBurnResuscitationSimulator';

describe('SevereBurnResuscitationSimulator Component', () => {
  it('1. renders workstation title and clinical badge', () => {
    render(<SevereBurnResuscitationSimulator />);
    expect(screen.getByText(/Severe Burn Resuscitation & Fluid Creep Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B47 • Route #248/i)).toBeInTheDocument();
  });

  it('2. displays hero 4-panel grid metrics and initial volume calculations', () => {
    render(<SevereBurnResuscitationSimulator />);
    expect(screen.getByText(/24H RESUSCITATION VOLUME/i)).toBeInTheDocument();
    expect(screen.getByText(/FLUID CREEP & BLADDER PRESSURE/i)).toBeInTheDocument();
    expect(screen.getByText(/HOURLY URINE OUTPUT/i)).toBeInTheDocument();
    expect(screen.getByText(/AIRWAY & SAFETY/i)).toBeInTheDocument();
  });

  it('3. navigates across all four interactive clinical tabs', () => {
    render(<SevereBurnResuscitationSimulator />);

    // Tab 2: Fluid Creep & Albumin Rescue
    const creepTab = screen.getByRole('button', { name: /2\. Fluid Creep & Albumin Rescue/i });
    fireEvent.click(creepTab);
    expect(screen.getByText(/Fluid Creep & Colloid Parameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Abdominal Compartment Syndrome \(ACS\)/i)).toBeInTheDocument();

    // Tab 3: Urine Output Titration
    const titrTab = screen.getByRole('button', { name: /3\. Urine Output Titration/i });
    fireEvent.click(titrTab);
    expect(screen.getByText(/Urine Output & Infusion Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Hourly Titration Algorithm/i)).toBeInTheDocument();

    // Tab 4: Inhalation & Escharotomy
    const inhalTab = screen.getByRole('button', { name: /4\. Inhalation & Escharotomy/i });
    fireEvent.click(inhalTab);
    expect(screen.getByText(/Airway & Circumferential Eschar/i)).toBeInTheDocument();
    expect(screen.getByText(/Escharotomy & Airway Principles/i)).toBeInTheDocument();
  });

  it('4. activates fluid creep & ACS preset and displays critical alert', () => {
    render(<SevereBurnResuscitationSimulator />);
    const acsBtn = screen.getByRole('button', { name: /Fluid Creep & ACS \(Trap\)/i });
    fireEvent.click(acsBtn);

    expect(screen.getAllByText(/FLUID CREEP & ABDOMINAL COMPARTMENT SYNDROME/i).length).toBeGreaterThan(0);
  });

  it('5. triggers alert for severe inhalation airway emergency preset', () => {
    render(<SevereBurnResuscitationSimulator />);
    const inhalBtn = screen.getByRole('button', { name: /Inhalation Airway Emergency/i });
    fireEvent.click(inhalBtn);

    expect(screen.getAllByText(/SEVERE INHALATION INJURY AIRWAY EMERGENCY/i).length).toBeGreaterThan(0);
  });
});
