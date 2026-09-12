import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisasterTriageMciSimulator from '../../components/simulators/DisasterTriageMciSimulator';

describe('DisasterTriageMciSimulator Component', () => {
  it('renders simulator header, census boxes, and casualty manifest', () => {
    render(<DisasterTriageMciSimulator />);

    expect(
      screen.getByText('Disaster Triage & Mass Casualty Incident (MCI) Command Station')
    ).toBeInTheDocument();

    expect(screen.getByText('Immediate (Red)')).toBeInTheDocument();
    expect(screen.getByText('Delayed (Yellow)')).toBeInTheDocument();
    expect(screen.getByText('Minor (Green)')).toBeInTheDocument();
    expect(screen.getByText('Expectant (Black)')).toBeInTheDocument();

    // Check first patient in roster
    expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
    expect(screen.getByText('#01')).toBeInTheDocument();
  });

  it('displays active patient RPM matrix and mechanisms', () => {
    render(<DisasterTriageMciSimulator />);

    expect(screen.getByText('Step 1: Ambulation')).toBeInTheDocument();
    expect(screen.getByText('Step 2: Respirations')).toBeInTheDocument();
    expect(screen.getByText('Step 3: Perfusion')).toBeInTheDocument();
    expect(screen.getByText('Step 4: Mental Status')).toBeInTheDocument();
    expect(screen.getByText(/Mechanism: Ejected through tour bus windshield/i)).toBeInTheDocument();
  });

  it('assigns METTAG disaster triage category to casualty', () => {
    render(<DisasterTriageMciSimulator />);

    // Click EXPECTANT for Sarah Jenkins (she is apneic with brain matter extrusion)
    const expectantBtn = screen.getByRole('button', { name: /⚫ EXPECTANT/i });
    fireEvent.click(expectantBtn);

    expect(screen.getByText(/Assigned #01 \(Sarah Jenkins\) to EXPECTANT BLACK/i)).toBeInTheDocument();
  });

  it('applies lifesaving interventions to trauma casualties', () => {
    render(<DisasterTriageMciSimulator />);

    // Select Carlos Mendez (#02) who has tension pneumothorax
    const carlosCard = screen.getByText('Carlos Mendez');
    fireEvent.click(carlosCard);

    expect(screen.getByText(/Patient #02: Carlos Mendez/i)).toBeInTheDocument();

    // Click 14G Needle Thoracostomy
    const needleBtn = screen.getByRole('button', { name: /14G Needle Thoracostomy/i });
    fireEvent.click(needleBtn);

    expect(screen.getByText(/Immediate rush of air, hemodynamic shock relieved/i)).toBeInTheDocument();
  });

  it('opens AAR debrief modal and displays audit breakdown', () => {
    render(<DisasterTriageMciSimulator />);

    const debriefBtn = screen.getByRole('button', { name: /AAR Debrief/i });
    fireEvent.click(debriefBtn);

    expect(screen.getByText('MCI Incident Command After-Action Report (AAR)')).toBeInTheDocument();
    expect(screen.getByText('Triage Accuracy')).toBeInTheDocument();
    expect(screen.getByText('Under-Triage')).toBeInTheDocument();
    expect(screen.getByText('Over-Triage')).toBeInTheDocument();
    expect(screen.getByText('Preventable Mortality')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close Report/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText('MCI Incident Command After-Action Report (AAR)')).not.toBeInTheDocument();
  });
});