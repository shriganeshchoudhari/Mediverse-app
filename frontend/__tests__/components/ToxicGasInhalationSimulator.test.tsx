import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToxicGasInhalationSimulator from '../../components/simulators/ToxicGasInhalationSimulator';

describe('ToxicGasInhalationSimulator Component', () => {
  it('renders the workstation header and default scenario', () => {
    render(<ToxicGasInhalationSimulator />);

    expect(screen.getByText(/Toxic Gas & Chemical Inhalation Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Complex IV Inhibition/i)).toBeInTheDocument();
    expect(screen.getByText(/Oxygen Extraction Paradox/i)).toBeInTheDocument();
    expect(screen.getByText(/Projected ARDS Risk/i)).toBeInTheDocument();
  });

  it('displays cyanide histotoxic hypoxia and flags nitrite contraindication in smoke/CO', () => {
    render(<ToxicGasInhalationSimulator />);

    expect(screen.getAllByText(/Histotoxic Uncoupling/i).length).toBeGreaterThanOrEqual(1);

    // Toggle nitrite checkbox
    const nitriteCheckbox = screen.getByLabelText(/Sodium Nitrite \(300mg\)/i);
    fireEvent.click(nitriteCheckbox);

    expect(screen.getByText(/LETHAL ANTIDOTAL CONTRAINDICATION/i)).toBeInTheDocument();
    expect(screen.getAllByText(/STRICT CONTRAINDICATION: Sodium Nitrite/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches to H2S sewer knockdown case and recommends sodium nitrite', () => {
    render(<ToxicGasInhalationSimulator />);

    const h2sButtons = screen.getAllByText(/2. Sewer Gas: Hydrogen Sulfide \(H2S\)/i);
    fireEvent.click(h2sButtons[0]);

    expect(screen.getAllByText(/knockdown/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Sodium Nitrite 300mg IV/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches to chlorine tanker leak and directs nebulized sodium bicarbonate', () => {
    render(<ToxicGasInhalationSimulator />);

    const chlorineButtons = screen.getAllByText(/3. Chlorine Tanker Rupture/i);
    fireEvent.click(chlorineButtons[0]);

    expect(screen.getAllByText(/Nebulized Sodium Bicarbonate/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/HCl\/HOCl Acid Burn/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches to phosgene case and displays alveolar flooding and strict bedrest', () => {
    render(<ToxicGasInhalationSimulator />);

    const phosgeneButtons = screen.getAllByText(/4. Phosgene Exposure/i);
    fireEvent.click(phosgeneButtons[0]);

    expect(screen.getAllByText(/phosgene alveolar flooding/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/STRICT ABSOLUTE BEDREST/i).length).toBeGreaterThanOrEqual(1);
  });
});
