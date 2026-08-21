import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DrugInteractionChecker from '../../components/pharmacy/DrugInteractionChecker';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('DrugInteractionChecker Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<DrugInteractionChecker />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays quick preset buttons', () => {
    render(<DrugInteractionChecker />);
    expect(screen.getByText(/Bleeding Triple Risk/i)).toBeInTheDocument();
    expect(screen.getByText(/Statin Toxicity/i)).toBeInTheDocument();
    expect(screen.getByText(/Hyperkalemia Risk/i)).toBeInTheDocument();
  });

  it('clicking a preset loads the interactions and updates count', () => {
    render(<DrugInteractionChecker />);
    const statinBtn = screen.getByText(/Statin Toxicity/i);
    fireEvent.click(statinBtn);
    expect(screen.getAllByText(/MAJOR/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SIMVASTATIN/i).length).toBeGreaterThan(0);
  });

  it('displays search input for adding drugs', () => {
    render(<DrugInteractionChecker />);
    const searchInput = screen.getByPlaceholderText(/Search drug to add/i);
    expect(searchInput).toBeInTheDocument();
  });
});
