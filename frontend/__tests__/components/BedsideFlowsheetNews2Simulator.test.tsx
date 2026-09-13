import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BedsideFlowsheetNews2Simulator from '@/components/simulators/BedsideFlowsheetNews2Simulator';

describe('BedsideFlowsheetNews2Simulator Component', () => {
  it('1. renders hero header and main title', () => {
    render(<BedsideFlowsheetNews2Simulator />);
    expect(
      screen.getByText(/Advanced Bedside Flowsheet, Fluid Balance & Early Warning Deterioration/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Track C7 • Inpatient Nursing & Critical Care Medicine/i)
    ).toBeInTheDocument();
  });

  it('2. displays patient demographic and case summary', () => {
    render(<BedsideFlowsheetNews2Simulator />);
    expect(screen.getByText(/Arthur P./i)).toBeInTheDocument();
    expect(screen.getByText(/MRN-789042/i)).toBeInTheDocument();
    expect(screen.getByText(/Post-Op Low Anterior Resection & Peritonitis/i)).toBeInTheDocument();
  });

  it('3. displays KPI bar metrics and escalation response', () => {
    render(<BedsideFlowsheetNews2Simulator />);
    expect(screen.getByText(/NEWS2 Score & Tier/i)).toBeInTheDocument();
    expect(screen.getByText(/Cumulative Net Fluid/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Fluid Overload \(%FO\)/i)[0]).toBeInTheDocument();
  });

  it('4. switches to hourly flowsheet tab and renders table columns', () => {
    render(<BedsideFlowsheetNews2Simulator />);
    const sheetTab = screen.getByRole('button', { name: /24-Hour Intensive Care Hourly Flowsheet/i });
    fireEvent.click(sheetTab);
    expect(
      screen.getByText(/Intensive Care Hourly Flowsheet Matrix/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/19:00/i)[0]).toBeInTheDocument();
  });

  it('5. switches to protocols tab and displays clinical triggers', () => {
    render(<BedsideFlowsheetNews2Simulator />);
    const protoTab = screen.getByRole('button', { name: /NEWS2 Protocols & Escalation Pathways/i });
    fireEvent.click(protoTab);
    expect(
      screen.getByText(/Royal College of Physicians \(RCP\) NEWS2 Trigger Tiers/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Scale 2 SpO2 \(Hypercapnic Respiratory Failure\):/i)
    ).toBeInTheDocument();
  });
});
