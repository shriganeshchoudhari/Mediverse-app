import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LaborPartogramSimulator from '@/components/simulators/LaborPartogramSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('LaborPartogramSimulator Component', () => {
  test('renders simulator title, Bishop badge, dilatation badge, and MVU badge', () => {
    render(<LaborPartogramSimulator />);
    expect(
      screen.getAllByText(/Obstetrics Labor Care Guide, Partogram & Bishop Score Workstation/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bishop Score/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Dilatation \/ Station/i)).toBeInTheDocument();
    expect(screen.getByText(/Uterine Work \(MVU\)/i)).toBeInTheDocument();
  });

  test('renders all 8 clinical preset buttons', () => {
    render(<LaborPartogramSimulator />);
    expect(screen.getByRole('button', { name: /Normal Active/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bishop 3 Ripening/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Alert Line Crossed/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Action Line Arrest/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CPD & Molding/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tachysystole/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Chorioamnionitis/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Precipitous Labor/i })).toBeInTheDocument();
  });

  test('switches to Unfavorable Cervix preset and shows ripening requirement', () => {
    render(<LaborPartogramSimulator />);
    const bishopBtn = screen.getByRole('button', { name: /Bishop 3 Ripening/i });
    fireEvent.click(bishopBtn);

    expect(screen.getAllByText(/Unfavorable/i).length).toBeGreaterThan(0);
  });

  test('switches to Tachysystole preset and displays resuscitation alert', () => {
    render(<LaborPartogramSimulator />);
    const tachyBtn = screen.getByRole('button', { name: /Tachysystole/i });
    fireEvent.click(tachyBtn);

    expect(
      screen.getAllByText(/UTERINE TACHYSYSTOLE HYPERSTIMULATION HAZARD/i).length
    ).toBeGreaterThan(0);
  });

  test('switches to CPD preset and displays severe molding alert', () => {
    render(<LaborPartogramSimulator />);
    const cpdBtn = screen.getByRole('button', { name: /CPD & Molding/i });
    fireEvent.click(cpdBtn);

    expect(
      screen.getAllByText(/CEPHALOPELVIC DISPROPORTION CPD SEVERE MOLDING/i).length
    ).toBeGreaterThan(0);
  });

  test('navigates through all 4 interactive tabs', () => {
    render(<LaborPartogramSimulator />);

    // Tab 2: Bishop Score & Pre-Induction Ripening
    const bishopTab = screen.getByRole('button', { name: /Bishop Score & Pre-Induction Ripening/i });
    fireEvent.click(bishopTab);
    expect(screen.getAllByText(/Calder Modified Bishop Score/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Pre-Induction Cervical Ripening Guidance/i)).toBeInTheDocument();

    // Tab 3: Uterine Dynamics & Oxytocin Titration
    const uterineTab = screen.getByRole('button', { name: /Uterine Dynamics & Oxytocin Titration/i });
    fireEvent.click(uterineTab);
    expect(screen.getByText(/Uterine Contraction Dynamics & IUPC Parameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Montevideo Units \(MVU\) Adequacy & Safety/i)).toBeInTheDocument();

    // Tab 4: Cranial Molding & CPD Diagnostics
    const moldingTab = screen.getByRole('button', { name: /Cranial Molding & CPD Diagnostics/i });
    fireEvent.click(moldingTab);
    expect(screen.getByText(/Fetal Head Molding & Soft Tissue Caput/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cephalopelvic Disproportion \(CPD\) Evaluation/i).length).toBeGreaterThan(0);
  });

  test('exports flowsheet and resets to baseline', () => {
    render(<LaborPartogramSimulator />);
    const exportBtn = screen.getByTitle(/Export Delivery Labor Flowsheet Record/i);
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Flowsheet Logged!/i)).toBeInTheDocument();

    const resetBtn = screen.getByTitle(/Reset to Normal Active Labor Baseline/i);
    fireEvent.click(resetBtn);
    expect(screen.getByRole('button', { name: /Normal Active/i })).toBeInTheDocument();
  });
});
