import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReboaSimulator from '../../components/simulators/ReboaSimulator';

describe('ReboaSimulator Component', () => {
  it('renders the workstation header and default scenario', () => {
    render(<ReboaSimulator />);

    expect(screen.getByText(/REBOA & Aortic Occlusion Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Transverse Gradient/i)).toBeInTheDocument();
    expect(screen.getByText(/Post-Deflation Serum/i)).toBeInTheDocument();
    expect(screen.getByText(/Reperfusion Shock Score/i)).toBeInTheDocument();
  });

  it('displays physiologically stable status for default Zone 3 pREBOA case', () => {
    render(<ReboaSimulator />);

    expect(screen.getByText(/REBOA OCCLUSION PHYSIOLOGICALLY STABLE/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SAFE/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches to hepatic laceration case and displays Zone 1 alerts', () => {
    render(<ReboaSimulator />);

    const liverButtons = screen.getAllByText(/2. Exsanguinating Hepatic Laceration/i);
    fireEvent.click(liverButtons[0]);

    expect(screen.getAllByText(/Grade V liver shattering/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/CAUTION/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches to thoracic aortic tear case and triggers procedural contraindication alert', () => {
    render(<ReboaSimulator />);

    const tearButton = screen.getByText(/4. Lethal Contraindication: Suspected Thoracic Aortic Transection/i);
    fireEvent.click(tearButton);

    expect(screen.getByText(/PROCEDURAL CONTRAINDICATION ALERT/i)).toBeInTheDocument();
    expect(screen.getByText(/Suspected or confirmed thoracic aortic rupture/i)).toBeInTheDocument();
  });

  it('triggers Zone 2 No-Fly Zone alert when Zone 2 button is clicked', () => {
    render(<ReboaSimulator />);

    const zone2Button = screen.getByText(/Visceral \(NO-FLY\)/i);
    fireEvent.click(zone2Button);

    expect(screen.getByText(/PROCEDURAL CONTRAINDICATION ALERT/i)).toBeInTheDocument();
    expect(screen.getByText(/CONTRAINDICATED ZONE \(ZONE 2 NO-FLY\)/i)).toBeInTheDocument();
  });
});
