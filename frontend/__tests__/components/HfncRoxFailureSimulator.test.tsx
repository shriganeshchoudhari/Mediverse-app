/**
 * HfncRoxFailureSimulator.test.tsx
 * Component tests for HfncRoxFailureSimulator.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HfncRoxFailureSimulator from '../../components/simulators/HfncRoxFailureSimulator';

// Mock Recharts ResponsiveContainer and LineChart for test environment
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    ReferenceLine: () => <div data-testid="reference-line" />,
  };
});

describe('HfncRoxFailureSimulator Component', () => {
  it('renders simulator header and clinical title', () => {
    render(<HfncRoxFailureSimulator />);
    expect(
      screen.getByText(/High-Flow Nasal Cannula \(HFNC\) & ROX Trajectory Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Roca Criteria & P-SILI/i)).toBeInTheDocument();
  });

  it('renders default scenario profile and parameters', () => {
    render(<HfncRoxFailureSimulator />);
    expect(screen.getAllByText(/1. Viral ARDS \/ COVID-19/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Real-Time Oxygenation Index/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard ROX/i)).toBeInTheDocument();
    expect(screen.getByText(/ROX-HR \(Modified\)/i)).toBeInTheDocument();
  });

  it('switches scenario to bacterial non-responder and updates profile', () => {
    render(<HfncRoxFailureSimulator />);
    const nonResponderBtn = screen.getByText(/2. Severe Bacterial Pneumonia/i);
    fireEvent.click(nonResponderBtn);

    expect(screen.getByText(/Community-Acquired Pneumonia \/ Sepsis/i)).toBeInTheDocument();
  });

  it('renders biophysical aerodynamics panel with dead space washout and PEEP', () => {
    render(<HfncRoxFailureSimulator />);
    expect(screen.getByText(/Aerodynamics & Washout/i)).toBeInTheDocument();
    expect(screen.getByText(/Pharyngeal Dead Space Washout:/i)).toBeInTheDocument();
    expect(screen.getByText(/Generated PEEP:/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivered FiO₂:/i)).toBeInTheDocument();
  });

  it('toggles mouth open/closed and updates PEEP label', () => {
    render(<HfncRoxFailureSimulator />);
    const mouthBtn = screen.getByText(/Mouth CLOSED \(Max PEEP\)/i);
    expect(mouthBtn).toBeInTheDocument();

    fireEvent.click(mouthBtn);
    expect(screen.getByText(/Mouth OPEN \(-50% PEEP\)/i)).toBeInTheDocument();
  });

  it('renders P-SILI audit and Kang et al. warning', () => {
    render(<HfncRoxFailureSimulator />);
    expect(screen.getByText(/P-SILI & Lung Strain Audit/i)).toBeInTheDocument();
    expect(screen.getByText(/Kang et al. Clinical Pearl:/i)).toBeInTheDocument();
  });
});
