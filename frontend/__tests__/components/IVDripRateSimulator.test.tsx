import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IVDripRateSimulator from '../../components/nursing/IVDripRateSimulator';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('IVDripRateSimulator', () => {
  it('renders without crashing', () => {
    render(<IVDripRateSimulator />);
    expect(screen.getAllByText(/IV Drip Rate/i).length).toBeGreaterThan(0);
  });

  it('contains drop factor selector', () => {
    render(<IVDripRateSimulator />);
    expect(screen.getAllByText(/gtt\/mL/i).length).toBeGreaterThanOrEqual(4);
  });

  it('displays animated SVG drip chamber or drip rate outputs', () => {
    render(<IVDripRateSimulator />);
    const gttMin = screen.getAllByText(/gtt\/min/i);
    expect(gttMin.length).toBeGreaterThan(0);
  });

  it('contains vasoactive infusion calculator section', () => {
    render(<IVDripRateSimulator />);
    expect(screen.getAllByText(/Vasoactive/i).length).toBeGreaterThan(0);
  });
});
