import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AcutePancreatitisSimulator from '../../components/simulators/AcutePancreatitisSimulator';

describe('AcutePancreatitisSimulator Component', () => {
  it('renders simulator title and initial default state', () => {
    render(<AcutePancreatitisSimulator />);

    expect(
      screen.getByText(/Acute Pancreatitis, Revised Atlanta & WATERFALL Resuscitation Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Diagnostic Triad/i)).toBeInTheDocument();
    expect(screen.getByText(/Modified Marshall Scoring Inputs/i)).toBeInTheDocument();
    expect(screen.getByText(/WATERFALL Goal-Directed Resuscitation Plan/i)).toBeInTheDocument();
  });

  it('renders all 4 standard clinical presets', () => {
    render(<AcutePancreatitisSimulator />);

    expect(screen.getByText(/Mild Interstitial Edematous Pancreatitis/i)).toBeInTheDocument();
    expect(screen.getByText(/Severe Necrotizing Pancreatitis with Persistent Failure/i)).toBeInTheDocument();
    expect(screen.getByText(/Iatrogenic Fluid Overload \(WATERFALL Trial Caution\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Infected Pancreatic Necrosis with Sepsis/i)).toBeInTheDocument();
  });

  it('correctly classifies Severe Acute Pancreatitis upon selecting severe necrotizing preset', () => {
    render(<AcutePancreatitisSimulator />);

    const severeButton = screen.getByText(
      /Severe Necrotizing Pancreatitis with Persistent Failure/i
    );
    fireEvent.click(severeButton);

    const severeBadges = screen.getAllByText(/SEVERE/i);
    expect(severeBadges.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/ORGAN FAILURE \(Score ≥ 2\)/i)).toBeInTheDocument();
  });

  it('triggers fluid overload warning when iatrogenic overload preset is clicked', () => {
    render(<AcutePancreatitisSimulator />);

    const overloadButton = screen.getByText(
      /Iatrogenic Fluid Overload \(WATERFALL Trial Caution\)/i
    );
    fireEvent.click(overloadButton);

    expect(screen.getAllByText(/FLUID OVERLOAD/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/CRITICAL FLUID OVERLOAD DETECTED/i)).toBeInTheDocument();
  });

  it('activates targeted antibiotic treatment directive when infected necrosis preset is clicked', () => {
    render(<AcutePancreatitisSimulator />);

    const infectedButton = screen.getByText(
      /Infected Pancreatic Necrosis with Sepsis/i
    );
    fireEvent.click(infectedButton);

    expect(screen.getByText(/TREATMENT INDICATED/i)).toBeInTheDocument();
    expect(screen.getByText(/INDICATED FOR INFECTED NECROSIS/i)).toBeInTheDocument();
  });
});
