import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ElbwNicuSimulator from '../../components/simulators/ElbwNicuSimulator';

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = [
    'Baby',
    'Activity',
    'Heart',
    'Droplets',
    'Thermometer',
    'Wind',
    'Zap',
    'AlertTriangle',
    'ShieldAlert',
    'CheckCircle2',
    'RotateCcw',
    'FileText',
    'Sparkles',
    'Clock',
    'Stethoscope',
    'Pill',
    'X',
    'Gauge',
    'Compass',
  ];
  const mockIcons: Record<string, React.FC<any>> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('ElbwNicuSimulator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders simulator title and clinical subtitle', () => {
    render(<ElbwNicuSimulator />);
    expect(
      screen.getByText('ELBW NICU Resuscitation Workstation')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Micropremie/i)
    ).toBeInTheDocument();
  });

  it('displays Micro-Premie Telemetry and infant profile', () => {
    render(<ElbwNicuSimulator />);
    expect(screen.getByText('Micro-Premie Telemetry')).toBeInTheDocument();
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByText('BP (SBP/DBP)')).toBeInTheDocument();
  });

  it('displays TPN and GIR Precision Calculator with live GIR', () => {
    render(<ElbwNicuSimulator />);
    expect(screen.getByText('TPN & Glucose Infusion Rate (GIR) Precision Calculator')).toBeInTheDocument();
    expect(screen.getByText('Dextrose Concentration')).toBeInTheDocument();
    expect(screen.getByText('Total Fluid Rate')).toBeInTheDocument();
    expect(screen.getAllByText(/GIR/i).length).toBeGreaterThanOrEqual(1);
  });

  it('administers surfactant when button is clicked', () => {
    render(<ElbwNicuSimulator />);
    const surfactantBtn = screen.getByText(/Administer Poractant alfa/i);
    expect(surfactantBtn).toBeInTheDocument();

    fireEvent.click(surfactantBtn);
    expect(screen.getByText('Surfactant Administered')).toBeInTheDocument();
  });

  it('opens NICU debrief modal when debrief button is clicked', () => {
    render(<ElbwNicuSimulator />);
    const debriefBtn = screen.getByText('NICU Debrief');
    fireEvent.click(debriefBtn);

    expect(
      screen.getByText('ELBW NICU Resuscitation Clinical Debrief & Competency Report')
    ).toBeInTheDocument();
    expect(screen.getByText('Overall Competency Score')).toBeInTheDocument();
  });
});
