import React from 'react';
import { render, screen } from '@testing-library/react';
import PatientEmergencySimulator from '@/components/simulators/PatientEmergencySimulator';

describe('PatientEmergencySimulator', () => {
  it('renders patient emergency simulator and case files', () => {
    render(<PatientEmergencySimulator />);
    expect(screen.getByText(/Patient ER Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Case File:/i)).toBeInTheDocument();
  });
});
