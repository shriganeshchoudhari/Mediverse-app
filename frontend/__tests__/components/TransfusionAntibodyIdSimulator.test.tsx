import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransfusionAntibodyIdSimulator } from '../../components/simulators/TransfusionAntibodyIdSimulator';

describe('TransfusionAntibodyIdSimulator', () => {
  it('renders the immunohematology simulator banner and 11-cell panel table', () => {
    render(<TransfusionAntibodyIdSimulator />);

    expect(
      screen.getByText(/Immunohematology & Antibody Identification Panel/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/11-Cell Reagent RBC Engine/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Commercial 11-Cell Identification Panel Sheet/i)
    ).toBeInTheDocument();
  });

  it('renders all 11 panel cell rows and donor phenotypes', () => {
    render(<TransfusionAntibodyIdSimulator />);

    // Cell numbers 1 to 11
    for (let i = 1; i <= 11; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('allows switching clinical scenarios and updates patient context', () => {
    render(<TransfusionAntibodyIdSimulator />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    // Switch to Scenario 2 (Anti-Jka with dosage)
    fireEvent.change(select, { target: { value: 'ANTI_JKA_DOSAGE_DELAYED' } });

    expect(
      screen.getByText(/Delayed Hemolytic Transfusion Reaction/i)
    ).toBeInTheDocument();
  });

  it('navigates through tabs: Panel, Ficin Enzymes, and Crossmatch', () => {
    render(<TransfusionAntibodyIdSimulator />);

    // Click Ficin Enzyme tab
    const enzymeTab = screen.getByText(/Ficin Enzyme Treatment Differential/i);
    fireEvent.click(enzymeTab);
    expect(
      screen.getByText(/Proteolytic Enzyme \(Ficin \/ Papain\) Digestion Reference/i)
    ).toBeInTheDocument();

    // Click Crossmatch tab
    const crossmatchTab = screen.getByText(/Antigen-Negative Screening & Crossmatch/i);
    fireEvent.click(crossmatchTab);
    expect(
      screen.getByText(/Antigen-Negative Unit Screening Formula/i)
    ).toBeInTheDocument();
  });

  it('opens debrief report modal when submit button is clicked', () => {
    render(<TransfusionAntibodyIdSimulator />);

    const submitBtn = screen.getByText(/Submit Case & View Debrief Report/i);
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Transfusion Medicine Faculty Debrief/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Competency Evaluation/i)
    ).toBeInTheDocument();
  });
});
