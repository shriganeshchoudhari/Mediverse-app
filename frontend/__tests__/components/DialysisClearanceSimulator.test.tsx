import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DialysisClearanceSimulator from '../../components/allied/DialysisClearanceSimulator';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('DialysisClearanceSimulator', () => {
  it('renders without crashing', () => {
    render(<DialysisClearanceSimulator />);
    expect(screen.getAllByText(/Dialysis/i).length).toBeGreaterThan(0);
  });

  it('displays blood flow and dialysate flow controls', () => {
    render(<DialysisClearanceSimulator />);
    expect(screen.getAllByRole('slider').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Blood Flow/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dialysate Flow/i).length).toBeGreaterThan(0);
  });

  it('displays Kt/V adequacy gauge', () => {
    render(<DialysisClearanceSimulator />);
    expect(screen.getAllByText(/Kt\/V/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Urea Reduction Ratio/i).length).toBeGreaterThan(0);
  });
});
