import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StandardizedPatientWorkstation from '../../components/simulators/StandardizedPatientWorkstation';

describe('StandardizedPatientWorkstation Component', () => {
  it('renders Telehealth console, video feed, and telemetry properly', () => {
    render(<StandardizedPatientWorkstation />);

    expect(screen.getAllByText(/Standardized Patient & Voice AI Telehealth Workstation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Live Bedside Telemetry/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/John Miller/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches between standardized patient personas', () => {
    render(<StandardizedPatientWorkstation />);

    const stemiButton = screen.getAllByText(/Robert Davis/i)[0];
    fireEvent.click(stemiButton);

    expect(screen.getAllByText(/Robert Davis/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Acute Anterior STEMI/i).length).toBeGreaterThanOrEqual(1);
  });

  it('navigates through interactive clinical tabs', () => {
    render(<StandardizedPatientWorkstation />);

    // Tab 2: Physical Exam
    const examTabButton = screen.getByText(/2\. Physical Exam/i);
    fireEvent.click(examTabButton);
    expect(screen.getAllByText(/Bedside Physical Examination/i).length).toBeGreaterThanOrEqual(1);

    // Tab 3: Diagnostics
    const diagTabButton = screen.getByText(/3\. Diagnostics/i);
    fireEvent.click(diagTabButton);
    expect(screen.getAllByText(/STAT Diagnostic Investigations/i).length).toBeGreaterThanOrEqual(1);

    // Tab 4: SOAP Note
    const soapTabButton = screen.getByText(/4\. SOAP Note/i);
    fireEvent.click(soapTabButton);
    expect(screen.getAllByText(/Clinical SOAP Note Documentation/i).length).toBeGreaterThanOrEqual(1);

    // Tab 5: Debrief
    const debriefTabButton = screen.getByText(/5\. Case Debrief/i);
    fireEvent.click(debriefTabButton);
    expect(screen.getAllByText(/Hidden Gold Standard Guide/i).length).toBeGreaterThanOrEqual(1);
  });

  it('interacts with patient dialogue and performs physical examination', () => {
    render(<StandardizedPatientWorkstation />);

    // Click suggested question chip
    const questionChip = screen.getByText(/Where exactly does it hurt\?/i);
    fireEvent.click(questionChip);

    // Navigate to physical exam tab and perform McBurney maneuver
    const examTabButton = screen.getByText(/2\. Physical Exam/i);
    fireEvent.click(examTabButton);

    const mcburneyButton = screen.getByText(/McBurney's Point/i);
    fireEvent.click(mcburneyButton);

    expect(screen.getAllByText(/Exquisite tenderness/i).length).toBeGreaterThanOrEqual(1);
  });

  it('grades SOAP note and displays OSCE report', () => {
    render(<StandardizedPatientWorkstation />);

    // Go to SOAP tab
    const soapTabButton = screen.getByText(/4\. SOAP Note/i);
    fireEvent.click(soapTabButton);

    // Fill primary diagnosis
    const diagInput = screen.getByPlaceholderText(/e\.g\. Acute Appendicitis/i);
    fireEvent.change(diagInput, { target: { value: 'Acute Appendicitis' } });

    // Click Grade button
    const gradeButton = screen.getByText(/Grade OSCE Note/i);
    fireEvent.click(gradeButton);

    expect(screen.getAllByText(/OSCE Competency Evaluation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Score:/i).length).toBeGreaterThanOrEqual(1);
  });
});