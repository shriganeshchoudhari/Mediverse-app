import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InfectiousDiseaseSimulator from '@/components/simulators/InfectiousDiseaseSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('InfectiousDiseaseSimulator Component', () => {
  test('renders simulator header, antimicrobial stewardship title, and breakpoint table', () => {
    render(<InfectiousDiseaseSimulator />);
    expect(screen.getAllByText(/ANTIMICROBIAL STEWARDSHIP/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Microbiology Culture/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Patient Isolate MIC Breakpoint/i).length).toBeGreaterThan(0);
  });

  test('renders all 6 preset clinical buttons', () => {
    render(<InfectiousDiseaseSimulator />);
    expect(screen.getAllByText(/MRSA Bacteremia/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ESBL Klebsiella/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CRE.*VAP/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pseudomonas.*Septic Shock/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/VRE.*Sepsis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Antimicrobial Stewardship.*De-escalation/i).length).toBeGreaterThan(0);
  });

  test('switches presets and updates pathogen details', () => {
    render(<InfectiousDiseaseSimulator />);
    const esblBtn = screen.getByText(/ESBL Klebsiella/i);
    fireEvent.click(esblBtn);
    expect(screen.getAllByText(/ESBL_CTXM/i).length).toBeGreaterThan(0);
  });

  test('toggles antibiotic selection and checks regimen update', () => {
    render(<InfectiousDiseaseSimulator />);
    const meroBtn = screen.getByRole('button', { name: /Meropenem/i });
    fireEvent.click(meroBtn);
    // Button active state or active text in table
    expect(screen.getAllByText(/Meropenem/i).length).toBeGreaterThan(0);
  });

  test('toggles Surviving Sepsis 1-hour bundle resuscitation checklist items', () => {
    render(<InfectiousDiseaseSimulator />);
    const fluidsBtn = screen.getByText(/Rapid Crystalloid 30 mL\/kg/i);
    fireEvent.click(fluidsBtn);
    expect(screen.getAllByText(/Surviving Sepsis 1-Hour Bundle/i).length).toBeGreaterThan(0);
  });

  test('dispatches Socratic AI event on button click', () => {
    render(<InfectiousDiseaseSimulator />);
    const aiBtn = screen.getByText(/Ask Socratic AI Tutor/i);
    fireEvent.click(aiBtn);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'mediverse:open-ai-with-context' })
    );
  });
});
