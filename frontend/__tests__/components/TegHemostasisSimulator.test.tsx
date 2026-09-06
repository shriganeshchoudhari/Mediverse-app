import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TegHemostasisSimulator from '@/components/simulators/TegHemostasisSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('TegHemostasisSimulator Component', () => {
  test('renders simulator title, phenotype banner, and viscoelastic waveform', () => {
    render(<TegHemostasisSimulator />);
    expect(screen.getAllByText(/Thromboelastography \(TEG \/ ROTEM\) & Transfusion Solver/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Coagulation Phenotype:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Live TEG Viscoelastic Clot Trace/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Continuous Viscoelastic TEG Waveform Tracing/i)).toBeInTheDocument();
  });

  test('renders all 8 clinical coagulopathy scenarios', () => {
    render(<TegHemostasisSimulator />);
    expect(screen.getByText(/Normal Physiological Hemostasis \(Baseline Control\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Severe Hypofibrinogenemia \(Massive Obstetric \/ Trauma Bleed\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Thrombocytopenia & Platelet Defect \(Isolated Low MA\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Hyperfibrinolysis \(Trauma Induced Coagulopathy\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Post-Cardiopulmonary Bypass Unfractionated Heparin Rebound/i)).toBeInTheDocument();
    expect(screen.getByText(/Coagulation Factor Depletion \(End-Stage Liver Disease\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Prothrombotic Hypercoagulability \(COVID-19 \/ Malignancy DIC\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Lethal Triad of Trauma \(Hypothermia, Acidosis, Dilution\)/i)).toBeInTheDocument();
  });

  test('switches to Primary Hyperfibrinolysis preset and displays hyperfibrinolysis alert', () => {
    render(<TegHemostasisSimulator />);
    const hyperBtn = screen.getByRole('button', { name: /Primary Hyperfibrinolysis/i });
    fireEvent.click(hyperBtn);
    expect(screen.getAllByText(/FULMINANT HYPERFIBRINOLYSIS TXA EMERGENCY/i).length).toBeGreaterThan(0);
  });

  test('switches to Severe Hypofibrinogenemia preset and administers Cryoprecipitate', () => {
    render(<TegHemostasisSimulator />);
    const hypoBtn = screen.getByRole('button', { name: /Severe Hypofibrinogenemia/i });
    fireEvent.click(hypoBtn);
    expect(screen.getAllByText(/CRITICAL HYPOFIBRINOGENEMIA CRYOPRECIPITATE NEEDED/i).length).toBeGreaterThan(0);

    const transfuseTab = screen.getByRole('button', { name: /Targeted Transfusion Deck & Interventions/i });
    fireEvent.click(transfuseTab);

    const giveCryoBtn = screen.getByRole('button', { name: /Give 2 Pools Cryoprecipitate/i });
    fireEvent.click(giveCryoBtn);
    expect(giveCryoBtn).toBeInTheDocument();
  });

  test('switches to Systemic Heparin Rebound preset and administers Protamine', () => {
    render(<TegHemostasisSimulator />);
    const heparinBtn = screen.getByRole('button', { name: /Post-Cardiopulmonary Bypass Unfractionated Heparin/i });
    fireEvent.click(heparinBtn);
    expect(screen.getAllByText(/CIRCULATING HEPARIN PROTAMINE REVERSAL REQUIRED/i).length).toBeGreaterThan(0);

    const transfuseTab = screen.getByRole('button', { name: /Targeted Transfusion Deck & Interventions/i });
    fireEvent.click(transfuseTab);

    const giveProtamineBtn = screen.getByRole('button', { name: /Give Protamine 30mg/i });
    fireEvent.click(giveProtamineBtn);
    expect(giveProtamineBtn).toBeInTheDocument();
  });

  test('navigates to ROTEM 5-Assay Differential Panel tab', () => {
    render(<TegHemostasisSimulator />);
    const rotemTab = screen.getByRole('button', { name: /ROTEM 5-Assay Differential Panel/i });
    fireEvent.click(rotemTab);
    expect(screen.getAllByText(/Rotational Thromboelastometry \(ROTEM\) 5-Channel Assays/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/EXTEM \(Tissue Factor\)/i)).toBeInTheDocument();
    expect(screen.getByText(/INTEM \(Ellagic Acid\)/i)).toBeInTheDocument();
    expect(screen.getByText(/FIBTEM \(\+ Cytochalasin D\)/i)).toBeInTheDocument();
    expect(screen.getByText(/HEPTEM \(\+ Heparinase\)/i)).toBeInTheDocument();
  });

  test('navigates to Lethal Triad & Evidence tab', () => {
    render(<TegHemostasisSimulator />);
    const guideTab = screen.getByRole('button', { name: /Lethal Triad & CRASH-2 \/ PROPPR Evidence/i });
    fireEvent.click(guideTab);
    expect(screen.getAllByText(/The Lethal Triad of Trauma \(Diamond of Death\)/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/CRASH-2 & PROPPR Clinical Evidence/i)).toBeInTheDocument();
  });

  test('resets simulator and exports consultation report', () => {
    render(<TegHemostasisSimulator />);
    const exportBtn = screen.getByRole('button', { name: /Export Coag Consultation/i });
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Report Generated!/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetBtn);
    expect(screen.getByText(/Export Coag Consultation/i)).toBeInTheDocument();
  });
});
