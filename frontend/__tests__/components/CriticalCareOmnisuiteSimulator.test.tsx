import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CriticalCareOmnisuiteSimulator from '../../components/simulators/CriticalCareOmnisuiteSimulator';

describe('CriticalCareOmnisuiteSimulator Component', () => {
  it('1. renders the main capstone title, subtitle, and multi-organ panels', () => {
    render(<CriticalCareOmnisuiteSimulator />);
    expect(screen.getByText(/Critical Care & Extracorporeal Resuscitation/i)).toBeInTheDocument();
    expect(screen.getByText(/Master clinical cockpit unifying Swan-Ganz thermodilution/i)).toBeInTheDocument();
    expect(screen.getByText(/Hemodynamics & Swan-Ganz/i)).toBeInTheDocument();
    expect(screen.getByText(/ECLS & Harlequin/i)).toBeInTheDocument();
  });

  it('2. applies preset "Harlequin ECMO" and renders Harlequin Active badge & alert', () => {
    render(<CriticalCareOmnisuiteSimulator />);
    const harlequinBtn = screen.getByRole('button', { name: /Harlequin ECMO/i });
    fireEvent.click(harlequinBtn);
    expect(screen.getByText(/Harlequin Active/i)).toBeInTheDocument();
    expect(screen.getByText(/HARLEQUIN \(NORTH-SOUTH\) SYNDROME DETECTED/i)).toBeInTheDocument();
  });

  it('3. applies preset "ECPELLA Rescue" and verifies LV Unloaded status', () => {
    render(<CriticalCareOmnisuiteSimulator />);
    const ecpellaBtn = screen.getByRole('button', { name: /ECPELLA Rescue/i });
    fireEvent.click(ecpellaBtn);
    expect(screen.getByText(/LV Unloaded/i)).toBeInTheDocument();
    expect(screen.getByText(/ECPELLA \(VA-ECMO \+ Impella Unloading\)/i)).toBeInTheDocument();
  });

  it('4. navigates across tabs: ECLS, Monro-Kellie, ARDS, and ACS', () => {
    render(<CriticalCareOmnisuiteSimulator />);

    // Click ECLS tab
    const eclsTab = screen.getByRole('button', { name: /ECLS & ECPELLA Mechanics/i });
    fireEvent.click(eclsTab);
    expect(screen.getByText(/The Harlequin Dual-Circulation Syndrome/i)).toBeInTheDocument();
    expect(screen.getByText(/ECPELLA: Active LV Venting in Peripheral VA-ECMO/i)).toBeInTheDocument();

    // Click Neuro tab
    const neuroTab = screen.getByRole('button', { name: /Monro-Kellie & CPP/i });
    fireEvent.click(neuroTab);
    expect(screen.getByText(/The Monro-Kellie Doctrine & Spatial Compliance/i)).toBeInTheDocument();
    expect(screen.getByText(/Cerebral Perfusion Pressure \(CPP = MAP - ICP\)/i)).toBeInTheDocument();

    // Click ARDS tab
    const ardsTab = screen.getByRole('button', { name: /ARDS Driving Pressure/i });
    fireEvent.click(ardsTab);
    expect(screen.getByText(/The Driving Pressure Concept/i)).toBeInTheDocument();
    expect(screen.getByText(/Ultra-Protective Rest-Lung ECMO/i)).toBeInTheDocument();

    // Click ACS tab
    const acsTab = screen.getByRole('button', { name: /Fluid Creep & ACS/i });
    fireEvent.click(acsTab);
    expect(screen.getByText(/Fluid Creep & Abdominal Compartment Syndrome/i)).toBeInTheDocument();
    expect(screen.getByText(/Intra-Abdominal Hypertension \(IAH\) Staging:/i)).toBeInTheDocument();
  });

  it('5. triggers "Sepsis Fluid Creep ACS" preset and displays ACS alert', () => {
    render(<CriticalCareOmnisuiteSimulator />);
    const sepsisBtn = screen.getByRole('button', { name: /Sepsis Fluid Creep ACS/i });
    fireEvent.click(sepsisBtn);
    expect(screen.getByText(/ABDOMINAL COMPARTMENT SYNDROME \(ACS\)/i)).toBeInTheDocument();
    expect(screen.getByText(/ACS Present/i)).toBeInTheDocument();
  });
});
