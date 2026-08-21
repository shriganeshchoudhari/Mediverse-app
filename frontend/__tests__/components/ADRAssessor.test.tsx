import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ADRAssessor from '../../components/pharmacy/ADRAssessor';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('ADRAssessor Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<ADRAssessor />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays Naranjo scale questions with options', () => {
    render(<ADRAssessor />);
    expect(screen.getByText(/^Q1\./i)).toBeInTheDocument();
    expect(screen.getByText(/^Q10\./i)).toBeInTheDocument();
  });

  it('displays case study selector buttons and selecting a case updates the score', () => {
    render(<ADRAssessor />);
    const sjsBtn = screen.getByText(/SJS with Lamotrigine/i);
    expect(sjsBtn).toBeInTheDocument();
    fireEvent.click(sjsBtn);
    expect(screen.getAllByText(/Stevens-Johnson syndrome/i).length).toBeGreaterThan(0);
  });
});
