import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostpartumHemorrhageSimulator } from '../../components/simulators/PostpartumHemorrhageSimulator';

describe('PostpartumHemorrhageSimulator', () => {
  it('renders the PPH simulator banner and CMQCC staging tracker', () => {
    render(<PostpartumHemorrhageSimulator />);

    expect(
      screen.getByText(/Obstetric Postpartum Hemorrhage \(PPH\) Workstation/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/CMQCC \/ ACOG 4-Stage Protocol/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Stage 1 \(Alert\)/i)
    ).toBeInTheDocument();
  });

  it('renders maternal hemodynamic telemetry and QBL gauge', () => {
    render(<PostpartumHemorrhageSimulator />);

    expect(screen.getByText(/Maternal Hemodynamic Telemetry/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Maternal Shock Index/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Quantitative Blood Loss \(QBL\)/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches scenario to Severe Preeclampsia and displays contraindication notice', () => {
    render(<PostpartumHemorrhageSimulator />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, {
      target: { value: 'PPH_SEVERE_PREECLAMPSIA_METHERGINE_CONTRAINDICATION' },
    });

    expect(
      screen.getByText(/PPH in Severe Preeclampsia \(Methergine Absolute Contraindication\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/CONTRAINDICATED in Severe Preeclampsia \/ HTN!/i)
    ).toBeInTheDocument();
  });

  it('navigates through tabs: Uterotonics, Bakri Balloon, Resuscitation, and 4Ts Bench', () => {
    render(<PostpartumHemorrhageSimulator />);

    // Click Bakri tab
    const bakriTab = screen.getByText(/Bakri Balloon Tamponade/i);
    fireEvent.click(bakriTab);
    expect(
      screen.getByText(/Bakri Intrauterine Tamponade Balloon Console/i)
    ).toBeInTheDocument();

    // Click Resuscitation tab
    const resusTab = screen.getByText(/MTP & Coagulation Resuscitation/i);
    fireEvent.click(resusTab);
    expect(
      screen.getByText(/Obstetric Massive Transfusion Protocol \(MTP 1:1:1\)/i)
    ).toBeInTheDocument();

    // Click 4Ts tab
    const fourTTab = screen.getByText(/4 T's Diagnostic Bench/i);
    fireEvent.click(fourTTab);
    expect(
      screen.getByText(/1\. Tone \(70-80%\)/i)
    ).toBeInTheDocument();
  });

  it('opens ACOG / CMQCC debrief modal when Debrief button is clicked', () => {
    render(<PostpartumHemorrhageSimulator />);

    const debriefBtn = screen.getByRole('button', { name: /Debrief Report/i });
    fireEvent.click(debriefBtn);

    expect(
      screen.getByText(/ACOG \/ CMQCC Obstetric Hemorrhage Debrief/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Resuscitation Competency/i)
    ).toBeInTheDocument();
  });
});
