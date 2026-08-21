import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NEWS2Simulator from '../../components/nursing/NEWS2Simulator';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('NEWS2Simulator Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<NEWS2Simulator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays case preset buttons', () => {
    render(<NEWS2Simulator />);
    expect(screen.getByText(/Severe Sepsis Shock/i)).toBeInTheDocument();
    expect(screen.getByText(/Acute Severe Asthma/i)).toBeInTheDocument();
  });

  it('clicking Sepsis preset updates NEWS2 score to High Risk and updates SBAR', () => {
    render(<NEWS2Simulator />);
    const sepsisBtn = screen.getByText(/Severe Sepsis Shock/i);
    fireEvent.click(sepsisBtn);
    expect(screen.getAllByText(/HIGH CLINICAL RISK/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/S \(Situation\)/i)).toBeInTheDocument();
  });

  it('contains vital parameter controls (Respiration, SpO2, SBP, Heart Rate)', () => {
    render(<NEWS2Simulator />);
    expect(screen.getByText(/Respiration Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Oxygen Saturation/i)).toBeInTheDocument();
    expect(screen.getByText(/Systolic Blood Pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/Heart Rate/i)).toBeInTheDocument();
  });
});
