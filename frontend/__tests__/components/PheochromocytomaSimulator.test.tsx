import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PheochromocytomaSimulator from '../../components/simulators/PheochromocytomaSimulator';

describe('PheochromocytomaSimulator Component', () => {
  it('1. renders workstation title and clinical badge', () => {
    render(<PheochromocytomaSimulator />);
    expect(screen.getByText(/Pheochromocytoma & Paraganglioma \(PPGL\) Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B43 • Route #244/i)).toBeInTheDocument();
  });

  it('2. displays hero 4-panel grid metrics and Roizen criteria status', () => {
    render(<PheochromocytomaSimulator />);
    expect(screen.getByText(/ROIZEN PREOP CRITERIA/i)).toBeInTheDocument();
    expect(screen.getByText(/SYSTEMIC VASCULAR RESISTANCE/i)).toBeInTheDocument();
    expect(screen.getByText(/HEMODYNAMICS & PHASE/i)).toBeInTheDocument();
    expect(screen.getByText(/COMPLICATIONS & SAFETY/i)).toBeInTheDocument();
  });

  it('3. navigates across all four interactive clinical tabs', () => {
    render(<PheochromocytomaSimulator />);

    // Tab 2: Biochemical Profile & Genetics
    const bioTab = screen.getByRole('button', { name: /2\. Biochemical Profile & Genetics/i });
    fireEvent.click(bioTab);
    expect(screen.getByText(/Fractionated Metanephrines Profile/i)).toBeInTheDocument();

    // Tab 3: Intraoperative Biphasic Hemodynamics
    const intraTab = screen.getByRole('button', { name: /3\. Intraoperative Biphasic Hemodynamics/i });
    fireEvent.click(intraTab);
    expect(screen.getByText(/Intraoperative Biphasic Crisis/i)).toBeInTheDocument();

    // Tab 4: Clinical Pearls & Roizen Guidelines
    const pearlsTab = screen.getByRole('button', { name: /4\. Clinical Pearls & Roizen Guidelines/i });
    fireEvent.click(pearlsTab);
    expect(screen.getByText(/Step-by-Step Management Protocol/i)).toBeInTheDocument();
  });

  it('4. activates presets and triggers critical alert for The Unopposed Alpha Disaster', () => {
    render(<PheochromocytomaSimulator />);
    const disasterBtn = screen.getByRole('button', { name: /The Unopposed Alpha Disaster \(Trap\)/i });
    fireEvent.click(disasterBtn);

    expect(screen.getAllByText(/THE UNOPPOSED ALPHA DISASTER/i).length).toBeGreaterThan(0);
  });

  it('5. triggers intraoperative storm alert on storm preset', () => {
    render(<PheochromocytomaSimulator />);
    const stormBtn = screen.getByRole('button', { name: /Intraoperative Storm \(Tumor Handling\)/i });
    fireEvent.click(stormBtn);

    expect(screen.getAllByText(/INTRAOPERATIVE CATECHOLAMINE STORM/i).length).toBeGreaterThan(0);
  });
});
