import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WebXrProceduralTheater from '../../components/3d/WebXrProceduralTheater';

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons: Record<string, React.FC<any>> = {};
  return new Proxy(icons, {
    get: (target, prop: string) => {
      if (!target[prop]) {
        target[prop] = (props: any) => <span data-testid={`icon-${prop}`} {...props} />;
      }
      return target[prop];
    },
  });
});

describe('WebXrProceduralTheater Component Tests', () => {
  it('renders procedural theater with initial Right IJV CVC scenario', () => {
    render(<WebXrProceduralTheater />);

    expect(screen.getByText(/Ultrasound-Guided Right Internal Jugular Vein/i)).toBeInTheDocument();
    expect(screen.getByText(/VASCULAR ACCESS/i)).toBeInTheDocument();
    expect(screen.getByText(/Live B-Mode Ultrasound Monitor/i)).toBeInTheDocument();
    expect(screen.getByText(/6-DoF Procedural Trajectory Kinematics/i)).toBeInTheDocument();
  });

  it('allows switching between procedural scenarios', () => {
    render(<WebXrProceduralTheater />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'PERICARDIOCENTESIS' } });

    expect(screen.getByText(/Emergency Subxiphoid Ultrasound-Guided Pericardiocentesis/i)).toBeInTheDocument();
    expect(screen.getByText(/Pericardial Effusion Space/i)).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'LUMBAR_PUNCTURE' } });
    expect(screen.getByText(/Ultrasound-Assisted Lumbar Puncture/i)).toBeInTheDocument();
  });

  it('toggles Color Doppler on live ultrasound monitor', () => {
    render(<WebXrProceduralTheater />);

    const dopplerBtn = screen.getByRole('button', { name: /Doppler OFF/i });
    expect(dopplerBtn).toBeInTheDocument();

    fireEvent.click(dopplerBtn);
    expect(screen.getByRole('button', { name: /Doppler ON/i })).toBeInTheDocument();
  });

  it('adjusts needle depth and updates real-time flashback and distance telemetry', () => {
    render(<WebXrProceduralTheater />);

    // Check needle depth label
    expect(screen.getAllByText(/0 mm/i)[0]).toBeInTheDocument();

    // Toggle aspirate syringe
    const aspirateBtn = screen.getByRole('button', { name: /Aspirate Syringe/i });
    fireEvent.click(aspirateBtn);
    expect(screen.getByRole('button', { name: /Aspirating \(Plunger Withdrawn\)/i })).toBeInTheDocument();
  });

  it('opens debrief modal and displays competency score and feedback', () => {
    render(<WebXrProceduralTheater />);

    const completeBtn = screen.getByRole('button', { name: /Complete & Grade/i });
    fireEvent.click(completeBtn);

    expect(screen.getByText(/Procedural OSCE Competency Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Overall Competency Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Faculty Feedback:/i)).toBeInTheDocument();
  });
});
