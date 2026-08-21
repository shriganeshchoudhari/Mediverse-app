import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GaitCycleAnalyzer from '../../components/physiotherapy/GaitCycleAnalyzer';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('GaitCycleAnalyzer', () => {
  it('renders without crashing', () => {
    render(<GaitCycleAnalyzer />);
    expect(screen.getAllByText(/Gait Cycle/i).length).toBeGreaterThan(0);
  });

  it('displays 8 gait phase scrub buttons', () => {
    render(<GaitCycleAnalyzer />);
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(8);
  });

  it('displays pathological gait selector', () => {
    render(<GaitCycleAnalyzer />);
    expect(screen.getAllByText(/Trendelenburg/i).length).toBeGreaterThan(0);
  });

  it('displays muscle activation information', () => {
    render(<GaitCycleAnalyzer />);
    const text = screen.getAllByText(/Active Muscle|Muscle/i);
    expect(text.length).toBeGreaterThan(0);
  });
});
