import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MassiveTransfusionDcrSimulator from '@/components/simulators/MassiveTransfusionDcrSimulator';

describe('MassiveTransfusionDcrSimulator Component', () => {
  it('renders main header and primary resuscitation panels', () => {
    render(<MassiveTransfusionDcrSimulator />);
    expect(
      screen.getByText(/Massive Transfusion Protocol \(MTP\) & Damage Control Resuscitation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Trauma Vitals & Shock Index/i)).toBeInTheDocument();
    expect(screen.getByText(/MTP Cooler & Product Infusion/i)).toBeInTheDocument();
    expect(screen.getByText(/Viscoelastic \(TEG\) Clot Tracing/i)).toBeInTheDocument();
  });

  it('displays MTP activation banner for severe trauma case', () => {
    render(<MassiveTransfusionDcrSimulator />);
    expect(
      screen.getByText(/CRITICAL ALERT: Massive Transfusion Protocol \(MTP\) Triggered/i)
    ).toBeInTheDocument();
  });

  it('handles TBI contraindication to permissive hypotension', () => {
    render(<MassiveTransfusionDcrSimulator />);
    const tbiPresetBtn = screen.getByRole('button', { name: /TBI Permissive Warning/i });
    fireEvent.click(tbiPresetBtn);

    expect(screen.getByText(/Severe Traumatic Brain Injury \(TBI\) Present/i)).toBeInTheDocument();
    expect(
      screen.getByText(/TBI HYPOTENSION CONTRAINDICATED/i)
    ).toBeInTheDocument();
  });

  it('detects crystalloid overload dilution hazard when selecting crystalloid preset', () => {
    render(<MassiveTransfusionDcrSimulator />);
    const dilutionPresetBtn = screen.getByRole('button', { name: /Iatrogenic Dilution/i });
    fireEvent.click(dilutionPresetBtn);

    expect(screen.getAllByText(/Crystalloid Overload/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/4.0 Liters/i)).toBeInTheDocument();
  });

  it('updates calcium dose when clicking calcium chloride gram buttons', () => {
    render(<MassiveTransfusionDcrSimulator />);
    const ca2gBtn = screen.getByRole('button', { name: '2g' });
    fireEvent.click(ca2gBtn);

    expect(ca2gBtn.className).toContain('bg-rose-500/20');
  });
});
