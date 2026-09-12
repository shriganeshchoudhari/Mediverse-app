import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LvadHemodynamicRampSimulator from '../../components/simulators/LvadHemodynamicRampSimulator';

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = [
    'Activity',
    'Heart',
    'Cpu',
    'AlertTriangle',
    'ShieldAlert',
    'CheckCircle2',
    'RotateCcw',
    'FileText',
    'Sparkles',
    'Stethoscope',
    'Zap',
    'Droplets',
    'ArrowUpRight',
    'ArrowDownRight',
    'X',
    'Gauge',
    'Compass',
    'Pill',
    'RefreshCw',
    'Wind',
  ];
  const mockIcons: Record<string, React.FC<any>> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={'icon-' + name.toLowerCase()} {...props} />;
  });
  return mockIcons;
});

describe('LvadHemodynamicRampSimulator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders simulator header and HeartMate 3 controller title', () => {
    render(<LvadHemodynamicRampSimulator />);
    expect(
      screen.getByText(/Left Ventricular Assist Device \(LVAD \/ HM3\) Speed Optimization & RAMP Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/HeartMate 3 Controller/i)).toBeInTheDocument();
  });

  it('renders core HM3 controller metrics (Speed, Flow, Power, PI)', () => {
    render(<LvadHemodynamicRampSimulator />);
    expect(screen.getAllByText(/^Speed$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Estimated Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Pump Power/i)).toBeInTheDocument();
    expect(screen.getByText(/Pulsatility \(PI\)/i)).toBeInTheDocument();
  });

  it('allows stepping speed up and down by 100 rpm', () => {
    render(<LvadHemodynamicRampSimulator />);
    const stepUpBtn = screen.getByText(/\+100 rpm/i);
    fireEvent.click(stepUpBtn);
    expect(screen.getAllByText(/5100/i).length).toBeGreaterThan(0);
  });

  it('delivers 500 mL IV crystalloid bolus', () => {
    render(<LvadHemodynamicRampSimulator />);
    const bolusBtn = screen.getByText(/Deliver 500 mL IV Crystalloid Bolus/i);
    fireEvent.click(bolusBtn);
    expect(screen.getByText(/Fluids Given: 500 mL/i)).toBeInTheDocument();
  });

  it('opens and closes LVAD debrief modal', () => {
    render(<LvadHemodynamicRampSimulator />);
    const debriefBtn = screen.getByRole('button', { name: /LVAD Debrief/i });
    fireEvent.click(debriefBtn);
    expect(
      screen.getByText(/LVAD & RAMP Protocol Clinical Debrief & Competency Report/i)
    ).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close Debrief/i });
    fireEvent.click(closeBtn);
    expect(
      screen.queryByText(/LVAD & RAMP Protocol Clinical Debrief & Competency Report/i)
    ).not.toBeInTheDocument();
  });
});
