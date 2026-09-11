import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HdfnRhogamSimulator from '../../components/simulators/HdfnRhogamSimulator';

describe('HdfnRhogamSimulator Component', () => {
  it('renders the HDFN and RhIg workstation title and key sections', () => {
    render(<HdfnRhogamSimulator />);

    expect(
      screen.getByText(/Hemolytic Disease of the Fetus & Newborn \(HDFN\) & RhIg Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Maternal-Fetal Serology Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Kleihauer-Betke Acid-Elution Smear/i)).toBeInTheDocument();
    expect(screen.getByText(/Fetal MCA Doppler Peak Velocity/i)).toBeInTheDocument();
    expect(screen.getByText(/AABB Precision Dosing/i)).toBeInTheDocument();
  });

  it('switches between Routine Antenatal and Massive FMH presets and recalculates dosing', () => {
    render(<HdfnRhogamSimulator />);

    // Click Routine 28-Week Antenatal Prophylaxis preset
    const routinePresetBtn = screen.getByText(/Routine 28-Week Antenatal Prophylaxis/i);
    fireEvent.click(routinePresetBtn);

    // Dosing for routine should be 1 Vial (300 µg)
    expect(screen.getAllByText(/1 Vial/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/300 µg/i).length).toBeGreaterThanOrEqual(1);

    // Click Massive FMH preset
    const massivePresetBtn = screen.getByText(/Massive Fetomaternal Hemorrhage/i);
    fireEvent.click(massivePresetBtn);

    // FMH Volume should reflect 90 mL whole blood and 4 Vials (1200 µg)
    expect(screen.getByText(/90 mL whole blood/i)).toBeInTheDocument();
    expect(screen.getAllByText(/4 Vials/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/1200 µg/i).length).toBeGreaterThanOrEqual(1);
  });

  it('handles maternal Rh-positive selection (not indicated)', () => {
    render(<HdfnRhogamSimulator />);

    const rhPosBtn = screen.getByRole('button', { name: /RhD-Positive \(D\+\)/i });
    fireEvent.click(rhPosBtn);

    // RhIg should not be indicated
    expect(screen.getByText(/NOT INDICATED/i)).toBeInTheDocument();
  });

  it('triggers critical titer warning and IUT indication on sensitized preset', () => {
    render(<HdfnRhogamSimulator />);

    const sensitizedPresetBtn = screen.getByText(/Severe Rh Alloimmunization/i);
    fireEvent.click(sensitizedPresetBtn);

    // Critical titer warning should appear
    expect(screen.getByText(/CRITICAL TITER/i)).toBeInTheDocument();

    // Intrauterine transfusion should be indicated
    expect(screen.getByText(/STAT IUT INDICATED/i)).toBeInTheDocument();
  });
});
