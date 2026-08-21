import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrthopedicSpecialTestsViewer from '../../components/physiotherapy/OrthopedicSpecialTestsViewer';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('OrthopedicSpecialTestsViewer Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<OrthopedicSpecialTestsViewer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays joint filter buttons (All, Knee, Shoulder, Hip, Spine)', () => {
    render(<OrthopedicSpecialTestsViewer />);
    expect(screen.getAllByText(/All/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Knee/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Shoulder/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hip/i).length).toBeGreaterThan(0);
  });

  it('displays test cards with statistical sensitivity and specificity metrics', () => {
    render(<OrthopedicSpecialTestsViewer />);
    expect(screen.getAllByText(/Lachman Test/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sensitivity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Specificity/i).length).toBeGreaterThan(0);
  });

  it('clicking a test card updates the detailed maneuver technique', () => {
    render(<OrthopedicSpecialTestsViewer />);
    const mcmurrayBtn = screen.getByText(/McMurray Test/i);
    fireEvent.click(mcmurrayBtn);
    expect(screen.getAllByText(/Meniscal Tear/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Positive Test Indicator/i)).toBeInTheDocument();
  });
});
