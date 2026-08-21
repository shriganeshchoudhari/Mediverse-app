import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CTSliceWindowViewer from '../../components/allied/CTSliceWindowViewer';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('CTSliceWindowViewer', () => {
  it('renders without crashing', () => {
    render(<CTSliceWindowViewer />);
    expect(screen.getAllByText(/Windowing/i).length).toBeGreaterThan(0);
  });

  it('displays slice selector buttons', () => {
    render(<CTSliceWindowViewer />);
    expect(screen.getAllByText(/Brain Window/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bone Window/i).length).toBeGreaterThan(0);
  });

  it('displays Window Width and Window Level controls', () => {
    render(<CTSliceWindowViewer />);
    expect(screen.getAllByRole('slider').length).toBe(2);
    expect(screen.getAllByText(/Hounsfield Unit/i).length).toBeGreaterThan(0);
  });
});
