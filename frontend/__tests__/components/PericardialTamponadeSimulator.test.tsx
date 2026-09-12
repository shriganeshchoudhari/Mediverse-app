import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PericardialTamponadeSimulator from '../../components/simulators/PericardialTamponadeSimulator';

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = [
    'Heart',
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
    'ArrowDownRight',
    'X',
    'Gauge',
    'Compass',
    'Syringe',
    'Wind',
    'RefreshCw',
    'Waves',
    'Radio',
  ];
  const mockIcons: Record<string, React.FC<any>> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={'icon-' + name.toLowerCase()} {...props} />;
  });
  return mockIcons;
});

describe('PericardialTamponadeSimulator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders simulator header and Beck\'s triad console', () => {
    render(<PericardialTamponadeSimulator />);
    expect(
      screen.getByText(/Acute Cardiac Tamponade, Pulsus Paradoxus & Pericardiocentesis Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Beck's Triad & Physical Signs/i)).toBeInTheDocument();
  });

  it('renders Beck\'s triad components (BP, JVD/CVP, auscultation, pulsus paradoxus)', () => {
    render(<PericardialTamponadeSimulator />);
    expect(screen.getByText(/1\. Arterial BP/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Jugular Venous Distension/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Cardiac Auscultation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pulsus Paradoxus/i).length).toBeGreaterThan(0);
  });

  it('delivers 500 mL IV crystalloid bolus to augment venous return', () => {
    render(<PericardialTamponadeSimulator />);
    const bolusBtn = screen.getByText(/Deliver 500 mL IV Crystalloid Bolus/i);
    fireEvent.click(bolusBtn);
    expect(screen.getByText(/Fluids Given: 500 mL/i)).toBeInTheDocument();
  });

  it('positions subxiphoid needle and performs agitated saline test', () => {
    render(<PericardialTamponadeSimulator />);
    const needleBtn = screen.getByText(/Subxiphoid Approach/i);
    fireEvent.click(needleBtn);

    const salineBtn = screen.getByText(/Agitated Saline Bubble Test/i);
    fireEvent.click(salineBtn);
    expect(screen.getByText(/Cardiology Attending:/i)).toBeInTheDocument();
  });

  it('aspirates 50 mL pericardial fluid and relieves pressure', () => {
    render(<PericardialTamponadeSimulator />);
    const needleBtn = screen.getByText(/Subxiphoid Approach/i);
    fireEvent.click(needleBtn);

    const aspirateBtn = screen.getByText(/Aspirate 50 mL/i);
    fireEvent.click(aspirateBtn);
    expect(screen.getByText(/Aspirated:\s*50\s*mL/i)).toBeInTheDocument();
  });

  it('opens and closes pericardial debrief modal', () => {
    render(<PericardialTamponadeSimulator />);
    const debriefBtn = screen.getByRole('button', { name: /Pericardial Debrief/i });
    fireEvent.click(debriefBtn);
    expect(
      screen.getByText(/Cardiac Tamponade & Pericardiocentesis Clinical Debrief/i)
    ).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close Debrief/i });
    fireEvent.click(closeBtn);
    expect(
      screen.queryByText(/Cardiac Tamponade & Pericardiocentesis Clinical Debrief/i)
    ).not.toBeInTheDocument();
  });
});
