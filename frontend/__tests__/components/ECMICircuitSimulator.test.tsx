import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ECMICircuitSimulator from '../../components/allied/ECMICircuitSimulator';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('ECMICircuitSimulator', () => {
  it('renders without crashing', () => {
    render(<ECMICircuitSimulator />);
    expect(screen.getAllByText(/ECMO/i).length).toBeGreaterThan(0);
  });

  it('displays circuit type toggle (CPB, VA-ECMO, VV-ECMO)', () => {
    render(<ECMICircuitSimulator />);
    expect(screen.getAllByText(/Cardiopulmonary Bypass/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/VA-ECMO|Veno-Arterial/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/VV-ECMO|Veno-Venous/i).length).toBeGreaterThan(0);
  });

  it('displays flow sliders and blood gas outputs', () => {
    render(<ECMICircuitSimulator />);
    expect(screen.getAllByRole('slider').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText(/PaO₂/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PaCO₂/i).length).toBeGreaterThan(0);
  });
});
