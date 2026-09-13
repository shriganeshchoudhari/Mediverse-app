import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpinalCordInjurySimulator from '../../components/simulators/SpinalCordInjurySimulator';

describe('SpinalCordInjurySimulator Component', () => {
  it('1. renders header, badges, and case presets', () => {
    render(<SpinalCordInjurySimulator />);

    expect(screen.getByText(/Acute Spinal Cord Injury & Neurogenic Shock Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/AANS\/CNS MAP 85-90 Target/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B35/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Acute C5 Neurogenic Shock/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Phenylephrine Hazard/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. MAP 85-90 Augmented/i)).toBeInTheDocument();
  });

  it('2. switches to "Phenylephrine Hazard" preset and displays reflex bradycardia pitfall banner', () => {
    render(<SpinalCordInjurySimulator />);

    const phenylephrineBtn = screen.getByText(/2\. Phenylephrine Hazard/i);
    fireEvent.click(phenylephrineBtn);

    expect(screen.getAllByText(/PHENYLEPHRINE HAZARD/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/CRITICAL PHARMACOLOGIC PITFALL:/i)).toBeInTheDocument();
  });

  it('3. renders hero 4-panel grid (Spinal Perfusion, Autonomic Shock, Spinal Shock, ASIA)', () => {
    render(<SpinalCordInjurySimulator />);

    expect(screen.getByText(/Spinal Perfusion/i)).toBeInTheDocument();
    expect(screen.getByText(/Autonomic Shock/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Spinal Shock/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/ASIA Classification/i)).toBeInTheDocument();
    expect(screen.getAllByText(/NEUROGENIC SHOCK/i)[0]).toBeInTheDocument();
  });

  it('4. navigates across tabs (Hemodynamics, Spinal Shock & BCR, Autonomic Dysreflexia, ASIA Exam)', () => {
    render(<SpinalCordInjurySimulator />);

    // Tab 2: Spinal Shock & BCR
    const spinalShockTab = screen.getByText(/2\. Neurogenic vs Spinal Shock & BCR/i);
    fireEvent.click(spinalShockTab);
    expect(screen.getByText(/Bulbocavernosus Reflex \(S2-S4\) Bedside Maneuver/i)).toBeInTheDocument();
    expect(screen.getByText(/Spinal Shock vs Neurogenic Shock Differential/i)).toBeInTheDocument();

    // Tab 3: Autonomic Dysreflexia
    const adTab = screen.getByText(/3\. Autonomic Dysreflexia \(AD\) Crisis/i);
    fireEvent.click(adTab);
    expect(screen.getByText(/Autonomic Dysreflexia \(AD\) Precipitating Triggers/i)).toBeInTheDocument();
    expect(screen.getByText(/Acute AD Emergency Step-by-Step Protocol/i)).toBeInTheDocument();

    // Tab 4: ASIA Exam
    const asiaTab = screen.getByText(/4\. ASIA Examination & Steroid Critiques/i);
    fireEvent.click(asiaTab);
    expect(screen.getByText(/ASIA Impairment Scale \(AIS\) Exam Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Dose Methylprednisolone \(NASCIS Protocol\)/i)).toBeInTheDocument();
  });

  it('5. toggles Bulbocavernosus Reflex to simulate transition out of spinal shock', () => {
    render(<SpinalCordInjurySimulator />);

    // Navigate to Tab 2
    fireEvent.click(screen.getByText(/2\. Neurogenic vs Spinal Shock & BCR/i));

    // Initially in spinal shock (BCR absent)
    expect(screen.getByText(/Spinal Shock is Active/i)).toBeInTheDocument();

    // Click toggle button
    const bcrBtn = screen.getByText(/BCR Absent \(Spinal Shock\)/i);
    fireEvent.click(bcrBtn);

    expect(screen.getByText(/Spinal Shock Has Resolved/i)).toBeInTheDocument();
    expect(screen.getByText(/BCR Present \(Intact\)/i)).toBeInTheDocument();
  });
});
