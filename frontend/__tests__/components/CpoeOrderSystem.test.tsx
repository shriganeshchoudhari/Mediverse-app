import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CpoeOrderSystem from '../../components/emr/CpoeOrderSystem';

describe('CpoeOrderSystem Component', () => {
  it('renders CPOE dashboard with patient info and CDS vitals matrix', () => {
    render(<CpoeOrderSystem patientName="Priya Sharma (MRN: MED-55410)" systolicBp={88} heartRate={104} eGfr={28} />);

    expect(screen.getByText(/Priya Sharma/i)).toBeInTheDocument();
    expect(screen.getByText(/CDS Pharmacovigilance Active/i)).toBeInTheDocument();
    expect(screen.getByText(/88 mmHg/i)).toBeInTheDocument();
    expect(screen.getByText(/104 bpm/i)).toBeInTheDocument();
    expect(screen.getByText(/28 mL\/min/i)).toBeInTheDocument();
  });

  it('navigates to Clinical Protocols tab and displays Sepsis, STEMI, and PE protocols', () => {
    render(<CpoeOrderSystem />);

    const protocolsTabBtn = screen.getByRole('button', { name: /Clinical Protocols & Bundles/i });
    fireEvent.click(protocolsTabBtn);

    expect(screen.getByText(/Surviving Sepsis Campaign 1-Hour Care Bundle/i)).toBeInTheDocument();
    expect(screen.getByText(/AHA\/ACC STEMI & Acute Coronary Syndrome Clinical Pathway/i)).toBeInTheDocument();
    expect(screen.getByText(/Pulmonary Embolism \(PE\) Wells Score & Diagnostic Pathway/i)).toBeInTheDocument();
  });

  it('updates Wells PE score dynamically when criteria checkboxes are clicked', () => {
    render(<CpoeOrderSystem />);

    const protocolsTabBtn = screen.getByRole('button', { name: /Clinical Protocols & Bundles/i });
    fireEvent.click(protocolsTabBtn);

    // Initial score should be 7.5 (dvtSigns 3 + peMostLikely 3 + tachycardia 1.5)
    expect(screen.getByText(/Wells Score: 7.5/i)).toBeInTheDocument();

    // Toggle malignancy checkbox (+1.0)
    const malignancyCheckbox = screen.getByLabelText(/Active cancer/i);
    fireEvent.click(malignancyCheckbox);

    expect(screen.getByText(/Wells Score: 8.5/i)).toBeInTheDocument();
  });

  it('deploys Surviving Sepsis 1-Hour Bundle orders successfully', () => {
    const handleOrderPlaced = jest.fn();
    render(<CpoeOrderSystem onOrderPlaced={handleOrderPlaced} />);

    const protocolsTabBtn = screen.getByRole('button', { name: /Clinical Protocols & Bundles/i });
    fireEvent.click(protocolsTabBtn);

    const deploySepsisBtn = screen.getByRole('button', { name: /Deploy Full Sepsis 1-Hour Care Bundle/i });
    fireEvent.click(deploySepsisBtn);

    expect(screen.getByText(/5 \/ 5 Interventions Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Sepsis Bundle Orders Dispatched/i)).toBeInTheDocument();

    // Switch back to Meds tab to check eMAR additions
    const medsTabBtn = screen.getByRole('button', { name: /Medication eMAR & Safety/i });
    fireEvent.click(medsTabBtn);

    expect(screen.getAllByText(/Piperacillin-Tazobactam/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vancomycin/i).length).toBeGreaterThan(0);
  });

  it('triggers hard block modal for fatal contraindication', () => {
    // Hypotensive patient (SBP 88) ordering Nitroglycerin (requires SBP >= 90)
    render(<CpoeOrderSystem systolicBp={88} />);

    // Select Nitroglycerin
    const select = screen.getByLabelText(/Medication Form & Class/i);
    fireEvent.change(select, { target: { value: 'nitroglycerin' } });

    // Click Sign & Transmit Prescription
    const signBtn = screen.getByRole('button', { name: /Sign & Transmit Prescription/i });
    fireEvent.click(signBtn);

    // Fatal Intercept modal should be displayed
    expect(screen.getByText(/CRITICAL SAFETY INTERCEPT — ORDER TRANSMISSION HARD BLOCKED/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Severe Hypotension/i).length).toBeGreaterThan(0);

    // Dismiss modal
    const dismissBtn = screen.getByRole('button', { name: /Acknowledge & Close Intercept/i });
    fireEvent.click(dismissBtn);

    expect(screen.queryByText(/ORDER TRANSMISSION HARD BLOCKED/i)).not.toBeInTheDocument();
  });

  it('triggers clinical override modal for major warning and allows signed transmission', () => {
    // Patient has normotensive BP (120), active Aspirin, ordering Methotrexate (DDI-012 Major Warning)
    render(<CpoeOrderSystem systolicBp={120} eGfr={90} />);

    // Select Methotrexate
    const select = screen.getByLabelText(/Medication Form & Class/i);
    fireEvent.change(select, { target: { value: 'methotrexate' } });

    // Click Sign & Transmit Prescription
    const signBtn = screen.getByRole('button', { name: /Sign & Transmit Prescription/i });
    fireEvent.click(signBtn);

    // Clinical Override Modal should open
    expect(screen.getByText(/CLINICAL OVERRIDE REQUIRED — MAJOR PHARMACOVIGILANCE INTERCEPT/i)).toBeInTheDocument();

    // Check the certification checkbox
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Click Authorize Override
    const authBtn = screen.getByRole('button', { name: /Authorize Override & Sign Order/i });
    fireEvent.click(authBtn);

    // Modal closes and order is on eMAR with override note
    expect(screen.queryByText(/CLINICAL OVERRIDE REQUIRED/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Clinician Override Authorized:/i)).toBeInTheDocument();
  });
});
