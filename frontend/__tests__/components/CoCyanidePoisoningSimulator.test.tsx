import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CoCyanidePoisoningSimulator from '../../components/simulators/CoCyanidePoisoningSimulator';

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = [
    'Flame',
    'Activity',
    'Droplets',
    'AlertTriangle',
    'ShieldAlert',
    'CheckCircle2',
    'RotateCcw',
    'FileText',
    'Sparkles',
    'Stethoscope',
    'Zap',
    'Wind',
    'X',
    'Gauge',
    'Compass',
    'Pill',
    'RefreshCw',
    'Clock',
    'Radio',
  ];
  const mockIcons: Record<string, React.FC<any>> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={'icon-' + name.toLowerCase()} {...props} />;
  });
  return mockIcons;
});

describe('CoCyanidePoisoningSimulator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders simulator header and Co-Oximetry console', () => {
    render(<CoCyanidePoisoningSimulator />);
    expect(
      screen.getByText(/Smoke Inhalation Dual-Toxin: CO & Cyanide Poisoning Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Arterial Co-Oximetry vs Pulse Oximeter/i)).toBeInTheDocument();
  });

  it('renders pulse oximetry pitfall warning and co-oximetry parameters', () => {
    render(<CoCyanidePoisoningSimulator />);
    expect(screen.getByText(/Standard Bedside SpO2/i)).toBeInTheDocument();
    expect(screen.getByText(/Carboxyhemoglobin \(COHb\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Methemoglobin \(MetHb\)/i)).toBeInTheDocument();
    expect(screen.getByText(/True Oxyhemoglobin/i)).toBeInTheDocument();
  });

  it('switches oxygen therapy to 100% O2 via NRB mask', () => {
    render(<CoCyanidePoisoningSimulator />);
    const nrbBtn = screen.getByText(/100% O2 via NRB Mask/i);
    fireEvent.click(nrbBtn);
    expect(screen.getByText(/t½ = 78 minutes/i)).toBeInTheDocument();
  });

  it('infuses Hydroxocobalamin (Cyanokit) and changes urine status', () => {
    render(<CoCyanidePoisoningSimulator />);
    const cyanokitBtn = screen.getByText(/Hydroxocobalamin 5.0 g IV/i);
    fireEvent.click(cyanokitBtn);
    expect(screen.getByText(/Cyanokit Given: 5 g/i)).toBeInTheDocument();
    expect(screen.getByText(/BURGUNDY RED CHROMATURIA/i)).toBeInTheDocument();
  });

  it('initiates hyperbaric oxygen session at 3.0 ATA', () => {
    render(<CoCyanidePoisoningSimulator />);
    const hboBtn = screen.getByText(/Hyperbaric O2 \(3.0 ATA\)/i);
    fireEvent.click(hboBtn);
    expect(screen.getByText(/t½ = 23 minutes/i)).toBeInTheDocument();
  });

  it('opens and closes toxicology debrief modal', () => {
    render(<CoCyanidePoisoningSimulator />);
    const debriefBtn = screen.getByRole('button', { name: /Toxicology Debrief/i });
    fireEvent.click(debriefBtn);
    expect(
      screen.getByText(/Carbon Monoxide & Cyanide Toxicology Debrief/i)
    ).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close Debrief/i });
    fireEvent.click(closeBtn);
    expect(
      screen.queryByText(/Carbon Monoxide & Cyanide Toxicology Debrief/i)
    ).not.toBeInTheDocument();
  });
});
