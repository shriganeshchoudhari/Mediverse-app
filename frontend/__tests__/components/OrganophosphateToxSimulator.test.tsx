/**
 * OrganophosphateToxSimulator.test.tsx
 * Component tests for OrganophosphateToxSimulator.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrganophosphateToxSimulator from '../../components/simulators/OrganophosphateToxSimulator';

describe('OrganophosphateToxSimulator Component', () => {
  it('renders simulator header and clinical title', () => {
    render(<OrganophosphateToxSimulator />);
    expect(
      screen.getByText(/Organophosphate & Carbamate Toxicology Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Medical Toxicology & Resuscitation Suite/i)).toBeInTheDocument();
  });

  it('renders default scenario profile and under-atropinized status', () => {
    render(<OrganophosphateToxSimulator />);
    expect(
      screen.getAllByText(/1. Agricultural Organophosphate Ingestion/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/Killer B's Active/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Atropine Doubling Protocol & Endpoints/i)).toBeInTheDocument();
  });

  it('administers doubled atropine doses and progresses toward atropinization', () => {
    render(<OrganophosphateToxSimulator />);
    const adminBtn = screen.getByRole('button', { name: /Administer Next Doubled Dose/i });
    expect(adminBtn).toBeInTheDocument();

    // Click to administer 2 mg
    fireEvent.click(adminBtn);
    expect(screen.getAllByText(/2 mg/i).length).toBeGreaterThan(0);

    // Administer subsequent doses until fully atropinized
    for (let i = 0; i < 5; i++) {
      const btn = screen.queryByRole('button', { name: /Administer Next Doubled Dose/i });
      if (btn) fireEvent.click(btn);
    }

    // Check that fully atropinized badge appears
    expect(screen.getAllByText(/Fully Atropinized/i).length).toBeGreaterThan(0);
  });

  it('switches to Carbamate scenario and updates 2-PAM indication to not indicated', () => {
    render(<OrganophosphateToxSimulator />);
    const carbamateBtn = screen.getByText(/3. Carbamate Insecticide Ingestion/i);
    fireEvent.click(carbamateBtn);

    expect(screen.getByText(/Carbaryl \(Sevin Insecticide\)/i)).toBeInTheDocument();
    expect(screen.getByText(/NOT INDICATED/i)).toBeInTheDocument();
  });

  it('renders Intermediate Syndrome surveillance card and warning against mydriasis', () => {
    render(<OrganophosphateToxSimulator />);
    expect(screen.getByText(/Intermediate Syndrome \(IMS\) Surveillance/i)).toBeInTheDocument();
    expect(screen.getByText(/endpoint for atropinization/i)).toBeInTheDocument();
  });
});
