import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OSCENursingStation from '../../components/nursing/OSCENursingStation';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('OSCENursingStation Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<OSCENursingStation />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays station tab buttons for all 4 OSCE stations', () => {
    render(<OSCENursingStation />);
    expect(screen.getByText(/Station 1:/i)).toBeInTheDocument();
    expect(screen.getByText(/Station 2:/i)).toBeInTheDocument();
    expect(screen.getByText(/Station 3:/i)).toBeInTheDocument();
    expect(screen.getByText(/Station 4:/i)).toBeInTheDocument();
  });

  it('displays station countdown timer and checklist items', () => {
    render(<OSCENursingStation />);
    expect(screen.getByText(/7:00/i)).toBeInTheDocument();
    expect(screen.getAllByText(/CRITICAL SAFETY STEP/i).length).toBeGreaterThan(0);
  });

  it('switching stations updates scenario text', () => {
    render(<OSCENursingStation />);
    const station2Btn = screen.getByText(/Station 2:/i);
    fireEvent.click(station2Btn);
    expect(screen.getByText(/Tracheostomy Care/i)).toBeInTheDocument();
  });
});
