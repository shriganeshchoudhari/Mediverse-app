import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NeurorehabSimulator from '../../components/physiotherapy/NeurorehabSimulator';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('NeurorehabSimulator Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<NeurorehabSimulator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays Brunnstrom 6-stage ladder buttons', () => {
    render(<NeurorehabSimulator />);
    expect(screen.getByText(/Stage 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 6/i)).toBeInTheDocument();
  });

  it('clicking a Brunnstrom stage updates details and physical therapy goals', () => {
    render(<NeurorehabSimulator />);
    const stage4Btn = screen.getByText(/Stage 4/i);
    fireEvent.click(stage4Btn);
    expect(screen.getAllByText(/Stage 4/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Target Physical Therapy Goals/i)).toBeInTheDocument();
  });

  it('displays PNF diagonal patterns and Modified Ashworth scale', () => {
    render(<NeurorehabSimulator />);
    expect(screen.getAllByText(/D1 Flexion/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Modified Ashworth/i).length).toBeGreaterThan(0);
  });
});
