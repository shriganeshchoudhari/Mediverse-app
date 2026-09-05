import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PocusUltrasoundSimulator from '../../components/simulators/PocusUltrasoundSimulator';

// Mock requestAnimationFrame
beforeAll(() => {
  window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
    return setTimeout(() => callback(Date.now()), 16) as unknown as number;
  };
  window.cancelAnimationFrame = (id: number): void => {
    clearTimeout(id);
  };

  // Mock HTMLCanvasElement.getContext
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    ellipse: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    rect: jest.fn(),
    strokeRect: jest.fn(),
    clip: jest.fn(),
    fillText: jest.fn(),
    setLineDash: jest.fn(),
    createLinearGradient: jest.fn().mockReturnValue({
      addColorStop: jest.fn()
    }),
    createRadialGradient: jest.fn().mockReturnValue({
      addColorStop: jest.fn()
    })
  }) as any;
});

describe('PocusUltrasoundSimulator Component', () => {
  it('renders simulator station with patient case, torso phantom, and console controls', () => {
    render(<PocusUltrasoundSimulator />);

    expect(screen.getByText(/Point-of-Care Ultrasound \(POCUS\) Station/i)).toBeInTheDocument();
    expect(screen.getByText(/Polytrauma: Blunt Abdominal Injury/i)).toBeInTheDocument();
    expect(screen.getByText(/Ultrasound Console Controls/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /FREEZE/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /M-MODE/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CALIPER/i })).toBeInTheDocument();
  });

  it('allows switching between emergency acoustic windows', () => {
    render(<PocusUltrasoundSimulator />);

    // Click Cardiac Subxiphoid in checklist
    const sxBtn = screen.getByRole('button', { name: /2\. Subxiphoid 4-Chamber View/i });
    fireEvent.click(sxBtn);

    // Verify window pearl updates
    expect(screen.getByText(/Cardiac Subxiphoid 4-Chamber \(Subcostal\)/i)).toBeInTheDocument();

    // Click Lung Pleura
    const lungBtn = screen.getByRole('button', { name: /5\. Anterior Lung \/ Thoracic Apex/i });
    fireEvent.click(lungBtn);

    expect(screen.getByText(/Anterior Thoracic \/ Pleural Zone/i)).toBeInTheDocument();
  });

  it('allows user to change clinical trauma case scenarios', () => {
    render(<PocusUltrasoundSimulator />);

    const select = screen.getByLabelText(/Patient Case:/i);
    fireEvent.change(select, { target: { value: 'trauma_tamponade' } });

    expect(screen.getByText(/Penetrating Precordial Stab Wound/i)).toBeInTheDocument();
    expect(screen.getByText(/Beck's Triad/i)).toBeInTheDocument();
  });

  it('toggles freeze mode and updates button label', () => {
    render(<PocusUltrasoundSimulator />);

    const freezeBtn = screen.getByRole('button', { name: /FREEZE/i });
    fireEvent.click(freezeBtn);

    expect(screen.getByRole('button', { name: /UNFREEZE/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /UNFREEZE/i }));
    expect(screen.getByRole('button', { name: /FREEZE/i })).toBeInTheDocument();
  });

  it('toggles M-Mode sweep and B-Mode imaging', () => {
    render(<PocusUltrasoundSimulator />);

    const mModeBtn = screen.getByRole('button', { name: /M-MODE/i });
    fireEvent.click(mModeBtn);

    expect(screen.getByRole('button', { name: /2D B-MODE/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /2D B-MODE/i }));
    expect(screen.getByRole('button', { name: /M-MODE/i })).toBeInTheDocument();
  });

  it('toggles caliper measurement tool', () => {
    render(<PocusUltrasoundSimulator />);

    const caliperBtn = screen.getByRole('button', { name: /CALIPER/i });
    fireEvent.click(caliperBtn);

    // Expect caliper to be activated (button has active styling)
    expect(caliperBtn).toHaveClass('bg-yellow-500');
  });

  it('submits official eFAST finding and displays debrief modal', () => {
    render(<PocusUltrasoundSimulator />);

    const input = screen.getByPlaceholderText(/e\.g\. Positive hemoperitoneum RUQ/i);
    fireEvent.change(input, { target: { value: 'Positive hemoperitoneum Morison pouch' } });

    const submitBtn = screen.getByRole('button', { name: /Submit Official Sonologist Finding/i });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    // Debrief modal displays
    expect(screen.getByText(/eFAST Competency Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Attending Faculty Summary:/i)).toBeInTheDocument();
    expect(screen.getByText(/Key Learning Points:/i)).toBeInTheDocument();

    // Close debrief modal
    const closeBtn = screen.getByRole('button', { name: /✕/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/eFAST Competency Assessment/i)).not.toBeInTheDocument();
  });
});
