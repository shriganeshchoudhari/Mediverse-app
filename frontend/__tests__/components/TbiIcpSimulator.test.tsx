/**
 * TbiIcpSimulator.test.tsx
 * Integration & Rendering Tests for Traumatic Brain Injury & ICP Dynamics Simulator Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TbiIcpSimulator from '../../components/simulators/TbiIcpSimulator';

// Mock Recharts responsive container & charts to prevent JSDOM dimension errors
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container"><svg>{children}</svg></div>,
    AreaChart: ({ children }: any) => <g data-testid="area-chart">{children}</g>,
    LineChart: ({ children }: any) => <g data-testid="line-chart">{children}</g>,
    Area: () => <div data-testid="area-mock" />,
    Line: () => <div data-testid="line-mock" />,
    XAxis: () => <div data-testid="xaxis-mock" />,
    YAxis: () => <div data-testid="yaxis-mock" />,
    CartesianGrid: () => <div data-testid="grid-mock" />,
    Tooltip: () => <div data-testid="tooltip-mock" />,
    ReferenceLine: () => <div data-testid="refline-mock" />
  };
});

describe('TbiIcpSimulator Component', () => {
  it('renders executive hero header and title', () => {
    render(<TbiIcpSimulator />);

    expect(screen.getByText(/Traumatic Brain Injury & ICP Dynamics Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track A68/i)).toBeInTheDocument();
    expect(screen.getByText(/BTF 4th Ed/i)).toBeInTheDocument();
  });

  it('renders all 5 executive KPI metric cards', () => {
    render(<TbiIcpSimulator />);

    expect(screen.getAllByText(/Intracranial Pressure/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Cerebral Perfusion/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Lundberg Rhythm/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Herniation Risk/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/BTF Protocol Tier/i).length).toBeGreaterThanOrEqual(1);
  });

  it('allows switching between all 5 interactive tabs', () => {
    render(<TbiIcpSimulator />);

    // Tab 2: Waveforms
    const tab2 = screen.getByText(/2. Waveforms & Lundberg Monitor/i);
    fireEvent.click(tab2);
    expect(screen.getByText(/Cardiac Pulse Wave Anatomy/i)).toBeInTheDocument();
    expect(screen.getByText(/30-Minute Continuous Lundberg Trend Monitor/i)).toBeInTheDocument();

    // Tab 3: Osmotherapy & Ventilation
    const tab3 = screen.getByText(/3. Hyperosmolar & Ventilation Bench/i);
    fireEvent.click(tab3);
    expect(screen.getAllByText(/Hyperosmolar Therapy Titration/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Ventilation & Cerebral Vasoreactivity Bench/i).length).toBeGreaterThanOrEqual(1);

    // Tab 4: Protocol & Surgery
    const tab4 = screen.getByText(/4. BTF Tiered Escalation & Surgery/i);
    fireEvent.click(tab4);
    expect(screen.getAllByText(/Surgical Decompressive Craniectomy Decision Suite/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/RESCUEicp Trial Evidence/i).length).toBeGreaterThanOrEqual(1);

    // Tab 5: Clinical Knowledge
    const tab5 = screen.getByText(/5. Clinical Knowledge & Pitfalls/i);
    fireEvent.click(tab5);
    expect(screen.getAllByText(/Critical Herniation Syndromes & Hallmarks/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Lethal Pitfalls & Practice Guidelines/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches clinical presets correctly', () => {
    render(<TbiIcpSimulator />);

    const daiPresetBtn = screen.getByText(/Severe Diffuse Axonal Injury/i);
    fireEvent.click(daiPresetBtn);

    expect(screen.getAllByText(/Lundberg A Waves/i).length).toBeGreaterThanOrEqual(1);
  });

  it('allows toggling surgical decompressive craniectomy in the protocol tab', () => {
    render(<TbiIcpSimulator />);

    const tab4 = screen.getByText(/4. BTF Tiered Escalation & Surgery/i);
    fireEvent.click(tab4);

    const craniectomyBtn = screen.getByText(/Perform Decompressive Craniectomy/i);
    fireEvent.click(craniectomyBtn);

    expect(screen.getByText(/Craniectomy Performed/i)).toBeInTheDocument();
  });
});
