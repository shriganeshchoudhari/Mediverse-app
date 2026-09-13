import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostOpTamponadeSimulator from '../../components/simulators/PostOpTamponadeSimulator';

describe('PostOpTamponadeSimulator Component', () => {
  it('1. renders header, badges, and case presets', () => {
    render(<PostOpTamponadeSimulator />);

    expect(screen.getByText(/Post-Op Cardiac Tamponade vs Restrictive Physiology/i)).toBeInTheDocument();
    expect(screen.getByText(/STS \/ CALS Resternotomy/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B32/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Occult Posterior LA Clot/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Clotted Drain & RA Clot/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Restrictive Stiffness/i)).toBeInTheDocument();
  });

  it('2. switches presets and updates clinical profile', () => {
    render(<PostOpTamponadeSimulator />);

    const cabgBtn = screen.getByText(/2\. Clotted Drain & RA Clot/i);
    fireEvent.click(cabgBtn);

    expect(screen.getByText(/Bicaval and transgastric views demonstrate/i)).toBeInTheDocument();
  });

  it('3. renders hero 4-panel hemodynamic & equalization monitor', () => {
    render(<PostOpTamponadeSimulator />);

    expect(screen.getByText(/Perfusion & Shock/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Diastolic Pressures/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Pulsus & Waveforms/i)).toBeInTheDocument();
    expect(screen.getByText(/Drains & Tissue Oxygen/i)).toBeInTheDocument();
    expect(screen.getAllByText(/EQUALIZATION/i)[0]).toBeInTheDocument();
  });

  it('4. navigates across tabs (Imaging, Resternotomy, Differential, ICU Titration)', () => {
    render(<PostOpTamponadeSimulator />);

    // Tab 2: Resternotomy
    const resternotomyTab = screen.getByText(/2\. Surgical Resternotomy & CALS Protocol/i);
    fireEvent.click(resternotomyTab);
    expect(screen.getByText(/Cardiac Advanced Life Support \(CALS\) Resternotomy Algorithm/i)).toBeInTheDocument();

    // Tab 3: Differential
    const diffTab = screen.getByText(/3\. 5-Phenotype Hemodynamic Matrix/i);
    fireEvent.click(diffTab);
    expect(screen.getAllByText(/5-Phenotype Hemodynamic Matrix/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Restrictive Physiology/i).length).toBeGreaterThan(0);

    // Tab 4: ICU Titration
    const icuTab = screen.getByText(/4\. ICU Titration & Drain Safety/i);
    fireEvent.click(icuTab);
    expect(screen.getByText(/Chest Tube Stripping & Mediastinal Management Hazards/i)).toBeInTheDocument();
  });

  it('5. triggers CALS resternotomy stage escalation to relieve tamponade', () => {
    render(<PostOpTamponadeSimulator />);

    // Go to resternotomy tab
    fireEvent.click(screen.getByText(/2\. Surgical Resternotomy & CALS Protocol/i));

    // Click Stage 2
    const stage2Btn = screen.getByText(/Stage 2: Retractor Placed & Clot Evacuated/i);
    fireEvent.click(stage2Btn);

    expect(screen.getByText(/Resternotomy Completed: Hemodynamics Restored/i)).toBeInTheDocument();
  });
});
