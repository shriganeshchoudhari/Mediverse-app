/**
 * DicSepsisCoagulopathySimulator.test.tsx
 * Component tests for DicSepsisCoagulopathySimulator.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DicSepsisCoagulopathySimulator from '../../components/simulators/DicSepsisCoagulopathySimulator';

describe('DicSepsisCoagulopathySimulator Component', () => {
  it('renders simulator header and clinical title', () => {
    render(<DicSepsisCoagulopathySimulator />);
    expect(
      screen.getByText(/Disseminated Intravascular Coagulation \(DIC\) & SIC Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/ISTH Diagnostic Criteria/i)).toBeInTheDocument();
  });

  it('renders default scenario profile and parameters', () => {
    render(<DicSepsisCoagulopathySimulator />);
    expect(
      screen.getAllByText(/1. Septic Shock & Purpura Fulminans/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Diagnostic Scorecard:/i)).toBeInTheDocument();
    expect(screen.getByText(/OVERT DIC \(SCORE ≥ 5\)/i)).toBeInTheDocument();
  });

  it('switches scenario to placental abruption and updates display', () => {
    render(<DicSepsisCoagulopathySimulator />);
    const abruptionBtn = screen.getByText(/2. Placental Abruption/i);
    fireEvent.click(abruptionBtn);

    expect(screen.getByText(/Severe Concealed Abruptio Placentae/i)).toBeInTheDocument();
  });

  it('renders component dosing calculator and TXA safety advisory', () => {
    render(<DicSepsisCoagulopathySimulator />);
    expect(screen.getByText(/Component Dosing Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Antifibrinolytic \(TXA\) Black Box Safety Advisory:/i)).toBeInTheDocument();
    expect(screen.getByText(/Microvascular Thrombosis Audit/i)).toBeInTheDocument();
  });

  it('toggles active bleeding status and updates UI button', () => {
    render(<DicSepsisCoagulopathySimulator />);
    const bleedBtn = screen.getByText(/🩸 Active Bleeding/i);
    expect(bleedBtn).toBeInTheDocument();

    fireEvent.click(bleedBtn);
    expect(screen.getByRole('button', { name: /No Active Bleed/i })).toBeInTheDocument();
  });
});
