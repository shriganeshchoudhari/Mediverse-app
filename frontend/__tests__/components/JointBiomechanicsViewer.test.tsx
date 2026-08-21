import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JointBiomechanicsViewer from '../../components/physiotherapy/JointBiomechanicsViewer';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('JointBiomechanicsViewer', () => {
  it('renders without crashing', () => {
    render(<JointBiomechanicsViewer />);
    expect(screen.getByText(/Goniometry/i)).toBeInTheDocument();
  });

  it('displays joint selector buttons', () => {
    render(<JointBiomechanicsViewer />);
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('contains angle slider and goniometer metrics', () => {
    render(<JointBiomechanicsViewer />);
    expect(screen.getAllByRole('slider').length).toBeGreaterThan(0);
  });

  it('displays mobility assessment status', () => {
    render(<JointBiomechanicsViewer />);
    const statuses = screen.getAllByText(/Normal|Hypomobile|Hypermobile|Mobility/i);
    expect(statuses.length).toBeGreaterThan(0);
  });
});
