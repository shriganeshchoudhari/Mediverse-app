/**
 * MalignantHyperthermiaSimulator.test.tsx
 * Integration & Rendering Tests for Malignant Hyperthermia & Hypermetabolic Crisis Simulator Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MalignantHyperthermiaSimulator from '../../components/simulators/MalignantHyperthermiaSimulator';

describe('MalignantHyperthermiaSimulator Component', () => {
  it('renders executive hero header and title', () => {
    render(<MalignantHyperthermiaSimulator />);

    expect(screen.getAllByText(/Malignant Hyperthermia & Hypermetabolic Crisis Workstation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Track A69/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/MHAUS/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 5 executive KPI metric cards', () => {
    render(<MalignantHyperthermiaSimulator />);

    expect(screen.getAllByText(/Primary Diagnosis/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/End-Tidal CO2/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Core Temperature/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Serum Potassium/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Dantrolene Plan/i).length).toBeGreaterThanOrEqual(1);
  });

  it('allows switching between all 5 interactive tabs', () => {
    render(<MalignantHyperthermiaSimulator />);

    // Tab 2: Dantrolene Bench
    const tab2 = screen.getByText(/2. Dantrolene Reconstitution Bench/i);
    fireEvent.click(tab2);
    expect(screen.getAllByText(/Dantrolene Formulation Stoichiometry/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Calculated Preparation & Administration Bench/i).length).toBeGreaterThanOrEqual(1);

    // Tab 3: MHAUS Rescue
    const tab3 = screen.getByText(/3. MHAUS Emergency Rescue Suite/i);
    fireEvent.click(tab3);
    expect(screen.getAllByText(/MHAUS Life-Saving Action Checklist/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Direct Clinical Interventions Bench/i).length).toBeGreaterThanOrEqual(1);

    // Tab 4: Acid-Base & Labs
    const tab4 = screen.getByText(/4. Acid-Base & Rhabdomyolysis/i);
    fireEvent.click(tab4);
    expect(screen.getAllByText(/Severe Mixed Acid-Base Kinetics/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Rhabdomyolysis & Renal Protection/i).length).toBeGreaterThanOrEqual(1);

    // Tab 5: Clinical Knowledge
    const tab5 = screen.getByText(/5. Clinical Knowledge & Guidelines/i);
    fireEvent.click(tab5);
    expect(screen.getAllByText(/Lethal Pitfalls & Contraindications/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/MHAUS Resources & Definitive Diagnostics/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches clinical presets correctly', () => {
    render(<MalignantHyperthermiaSimulator />);

    const nmsPresetBtn = screen.getByText(/Neuroleptic Malignant Syndrome/i);
    fireEvent.click(nmsPresetBtn);

    expect(screen.getAllByText(/NMS \(Dopamine Block\)/i).length).toBeGreaterThanOrEqual(1);
  });

  it('allows toggling between Ryanodex and Traditional Dantrium formulations', () => {
    render(<MalignantHyperthermiaSimulator />);

    const tab2 = screen.getByText(/2. Dantrolene Reconstitution Bench/i);
    fireEvent.click(tab2);

    const traditionalBtn = screen.getByText(/Traditional Dantrium \/ Revonto/i);
    fireEvent.click(traditionalBtn);

    expect(screen.getAllByText(/Heavy labor/i).length).toBeGreaterThanOrEqual(1);
  });
});
