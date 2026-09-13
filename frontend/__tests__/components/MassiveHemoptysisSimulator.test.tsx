import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MassiveHemoptysisSimulator from '../../components/simulators/MassiveHemoptysisSimulator';

describe('MassiveHemoptysisSimulator Component', () => {
  it('1. renders header, badges, and case presets', () => {
    render(<MassiveHemoptysisSimulator />);

    expect(screen.getByText(/Massive Hemoptysis & Endobronchial Isolation Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/CHEST \/ ATS Guidelines/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B33/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. TB Mycetoma Supine/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. CF Blocker & Down/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. "Bad Lung Up" Error/i)).toBeInTheDocument();
  });

  it('2. switches to "Bad Lung Up" preset and displays lethal positioning warning', () => {
    render(<MassiveHemoptysisSimulator />);

    const badUpBtn = screen.getByText(/3\. "Bad Lung Up" Error/i);
    fireEvent.click(badUpBtn);

    expect(screen.getByText(/LETHAL POSITIONING ERROR: "Bad Lung Up"/i)).toBeInTheDocument();
  });

  it('3. renders hero 4-panel gas exchange & bleeding kinetics grid', () => {
    render(<MassiveHemoptysisSimulator />);

    expect(screen.getByText(/Gas Exchange & Drive/i)).toBeInTheDocument();
    expect(screen.getByText(/Airway Spillover/i)).toBeInTheDocument();
    expect(screen.getByText(/Circulatory Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Bleeding Kinetics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SPILLOVER ACTIVE/i)[0]).toBeInTheDocument();
  });

  it('4. navigates across tabs (Airway, Bronchoscopy, Interventional BAE, Thoracotomy)', () => {
    render(<MassiveHemoptysisSimulator />);

    // Tab 2: Bronchoscopy
    const bronchoTab = screen.getByText(/2\. Bronchoscopic Hemostasis/i);
    fireEvent.click(bronchoTab);
    expect(screen.getByText(/Endoscopic Hemostatic Interventions/i)).toBeInTheDocument();

    // Tab 3: Interventional BAE
    const baeTab = screen.getByText(/3\. Interventional Radiology \(BAE\) & Spinal Safety/i);
    fireEvent.click(baeTab);
    expect(screen.getByText(/Bronchial Artery Embolization \(BAE\) Console/i)).toBeInTheDocument();
    expect(screen.getByText(/Artery of Adamkiewicz Spinal Cord Safety/i)).toBeInTheDocument();

    // Tab 4: Thoracotomy
    const thoracotomyTab = screen.getByText(/4\. Emergency Thoracotomy & Resection/i);
    fireEvent.click(thoracotomyTab);
    expect(screen.getByText(/Surgical Indications & Resection/i)).toBeInTheDocument();
  });

  it('5. models Artery of Adamkiewicz catastrophe in BAE tab', () => {
    render(<MassiveHemoptysisSimulator />);

    // Click Adamkiewicz preset
    const adamBtn = screen.getByText(/4\. Adamkiewicz Hazard/i);
    fireEvent.click(adamBtn);

    // Switch to BAE tab
    const baeTab = screen.getByText(/3\. Interventional Radiology \(BAE\) & Spinal Safety/i);
    fireEvent.click(baeTab);

    expect(screen.getByText(/CATASTROPHIC COMPLICATION: Anterior Spinal Cord Infarction/i)).toBeInTheDocument();
    expect(screen.getByText(/HAIRPIN LOOP IDENTIFIED/i)).toBeInTheDocument();
  });
});
