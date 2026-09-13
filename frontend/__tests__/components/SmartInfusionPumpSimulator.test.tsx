import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SmartInfusionPumpSimulator from '@/components/simulators/SmartInfusionPumpSimulator';

describe('SmartInfusionPumpSimulator Component', () => {
  it('1. renders hero header and main title', () => {
    render(<SmartInfusionPumpSimulator />);
    expect(
      screen.getByText(/Smart Infusion Pump Guardrails & Dose Error Reduction System/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Track C6 • Biomedical Engineering & Patient Safety/i)
    ).toBeInTheDocument();
  });

  it('2. allows switching medications to Regular Insulin', () => {
    render(<SmartInfusionPumpSimulator />);
    const drugSelect = screen.getByRole('combobox');
    fireEvent.change(drugSelect, { target: { value: 'regular_insulin' } });
    expect(
      screen.getAllByText(/Regular Insulin/i)[0]
    ).toBeInTheDocument();
  });

  it('3. triggers soft alert when 10x decimal error button is clicked', () => {
    render(<SmartInfusionPumpSimulator />);
    const errorBtn = screen.getByRole('button', { name: /10x Decimal Error/i });
    fireEvent.click(errorBtn);
    expect(
      screen.getByText(/DERS Safety Guardrail Status: SOFT_HIGH/i)
    ).toBeInTheDocument();
  });

  it('4. reports secondary piggyback hydrostatic status', () => {
    render(<SmartInfusionPumpSimulator />);
    expect(
      screen.getByText(/Secondary Piggyback Hydrostatic Mechanics/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Effective Delivery Source: Secondary/i)
    ).toBeInTheDocument();
  });

  it('5. switches to master DERS drug library tab', () => {
    render(<SmartInfusionPumpSimulator />);
    const libTab = screen.getByRole('button', { name: /Master DERS Drug Library/i });
    fireEvent.click(libTab);
    expect(
      screen.getByText(/Master Hospital DERS Drug Library & Guardrail Limits/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Potassium Chloride \(KCl\)/i)).toBeInTheDocument();
  });
});
