import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BradenWoundSimulator from '../../components/nursing/BradenWoundSimulator';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('BradenWoundSimulator', () => {
  it('renders without crashing', () => {
    render(<BradenWoundSimulator />);
    expect(screen.getAllByText(/Braden/i).length).toBeGreaterThan(0);
  });

  it('displays all 6 Braden subscale options', () => {
    render(<BradenWoundSimulator />);
    expect(screen.getAllByText(/Sensory/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Moisture/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Activity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mobility/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nutrition/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Friction/i).length).toBeGreaterThan(0);
  });

  it('displays computed Braden score gauge', () => {
    render(<BradenWoundSimulator />);
    expect(screen.getAllByText(/Score/i).length).toBeGreaterThan(0);
  });

  it('displays wound stage selector or dressing guidance', () => {
    render(<BradenWoundSimulator />);
    expect(screen.getAllByText(/Wound/i).length).toBeGreaterThan(0);
  });
});
