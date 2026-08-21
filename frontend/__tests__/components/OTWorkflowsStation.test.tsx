import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OTWorkflowsStation from '../../components/allied/OTWorkflowsStation';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('OTWorkflowsStation', () => {
  it('renders without crashing', () => {
    render(<OTWorkflowsStation />);
    expect(screen.getAllByText(/Operation Theatre/i).length).toBeGreaterThan(0);
  });

  it('displays WHO checklist phases', () => {
    render(<OTWorkflowsStation />);
    expect(screen.getAllByText(/Sign In/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Time Out/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sign Out/i).length).toBeGreaterThan(0);
  });

  it('displays sterilization protocol selector', () => {
    render(<OTWorkflowsStation />);
    expect(screen.getAllByText(/Sterilization/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Steam Autoclave/i).length).toBeGreaterThan(0);
  });
});
