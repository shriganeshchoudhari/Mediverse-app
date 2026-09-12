import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PediatricSepticShockSimulator from '../../components/simulators/PediatricSepticShockSimulator';

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = [
    'Activity',
    'Baby',
    'AlertTriangle',
    'Heart',
    'ShieldAlert',
    'CheckCircle2',
    'Droplet',
    'Syringe',
    'Sparkles',
    'RotateCcw',
    'FileText',
    'Clock',
    'Stethoscope',
    'Zap',
    'Thermometer',
    'Pill',
    'Wind',
    'HelpCircle',
    'X',
  ];
  const mockIcons: Record<string, React.FC<any>> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('PediatricSepticShockSimulator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders simulator title and clinical subtitle', () => {
    render(<PediatricSepticShockSimulator />);
    expect(
      screen.getByText('Pediatric Septic Shock & Resuscitation Workstation')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Surviving Sepsis Campaign Pediatric/i)
    ).toBeInTheDocument();
  });

  it('displays PALS Telemetry Monitor with vital signs', () => {
    render(<PediatricSepticShockSimulator />);
    expect(screen.getByText('PALS Telemetry Monitor')).toBeInTheDocument();
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByText('BP (SBP/DBP)')).toBeInTheDocument();
    expect(screen.getByText('Microvascular Perfusion Exam')).toBeInTheDocument();
  });

  it('delivers fluid boluses and updates cumulative volume display', () => {
    render(<PediatricSepticShockSimulator />);
    const bolus20Btn = screen.getByText(/Bolus 20 mL\/kg/i);
    expect(bolus20Btn).toBeInTheDocument();

    fireEvent.click(bolus20Btn);
    expect(screen.getByText('20 mL/kg')).toBeInTheDocument();
  });

  it('executes blood cultures bundle item', () => {
    render(<PediatricSepticShockSimulator />);
    const culturesBtn = screen.getByText('STAT Blood Cultures');
    fireEvent.click(culturesBtn);

    // Feedback should reflect cultures drawn
    expect(screen.getByText(/STAT Peripheral & Central Line Blood Cultures drawn/i)).toBeInTheDocument();
  });

  it('opens PALS debrief modal when debrief button is clicked', () => {
    render(<PediatricSepticShockSimulator />);
    const debriefBtn = screen.getByText('PALS Debrief');
    fireEvent.click(debriefBtn);

    expect(
      screen.getByText('Pediatric Septic Shock Clinical Debrief & Competency Report')
    ).toBeInTheDocument();
    expect(screen.getByText('Overall Competency Score')).toBeInTheDocument();
  });
});
