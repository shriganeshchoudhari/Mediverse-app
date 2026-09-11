import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PupilAnisocoriaHornerSimulator from '@/components/simulators/PupilAnisocoriaHornerSimulator';

describe('PupilAnisocoriaHornerSimulator Component', () => {
  it('renders main header, ocular stage, and diagnostic panels', () => {
    render(<PupilAnisocoriaHornerSimulator />);
    expect(
      screen.getByText(/Anisocoria, Pupillary Light Reflex & Horner Syndrome Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Anterior Segment & Pupillary Ocular Stage/i)).toBeInTheDocument();
    expect(screen.getByText(/RIGHT EYE \(OD\)/i)).toBeInTheDocument();
    expect(screen.getByText(/LEFT EYE \(OS\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic Eyedrop Challenge Shelf/i)).toBeInTheDocument();
    expect(screen.getByText(/Leading Differential Diagnoses/i)).toBeInTheDocument();
  });

  it('switches to Compressive CN III Palsy preset and displays parasympathetic deficit and blown pupil', () => {
    render(<PupilAnisocoriaHornerSimulator />);
    const cn3Btn = screen.getByRole('button', { name: /Right Compressive CN III Palsy/i });
    fireEvent.click(cn3Btn);

    expect(screen.getAllByText(/PARASYMPATHETIC DEFICIT/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/GREATER IN LIGHT/i).length).toBeGreaterThan(0);
  });

  it('instills Apraclonidine drops on Horner syndrome and demonstrates reversal of anisocoria', () => {
    render(<PupilAnisocoriaHornerSimulator />);
    // Select Horner preset first
    const hornerBtn = screen.getByRole('button', { name: /Right Postganglionic 3rd-Order Horner/i });
    fireEvent.click(hornerBtn);

    // Click Apraclonidine eyedrop button
    const apraclonidineBtn = screen.getByRole('button', { name: /0.5% Apraclonidine/i });
    fireEvent.click(apraclonidineBtn);

    expect(screen.getAllByText(/REVERSAL OF ANISOCORIA/i).length).toBeGreaterThan(0);
  });

  it('switches to Adie Tonic Pupil and demonstrates dilute pilocarpine supersensitivity', () => {
    render(<PupilAnisocoriaHornerSimulator />);
    const adieBtn = screen.getByRole('button', { name: /Left Adie Tonic Pupil/i });
    fireEvent.click(adieBtn);

    const dilutePiloBtn = screen.getByRole('button', { name: /0.125% Dilute Pilocarpine/i });
    fireEvent.click(dilutePiloBtn);

    expect(screen.getAllByText(/POSITIVE DILUTE PILOCARPINE/i).length).toBeGreaterThan(0);
  });
});
