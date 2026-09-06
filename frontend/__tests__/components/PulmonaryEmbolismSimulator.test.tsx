import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PulmonaryEmbolismSimulator from '../../components/simulators/PulmonaryEmbolismSimulator';

describe('PulmonaryEmbolismSimulator Component', () => {
  beforeEach(() => {
    // Mock window.alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders simulator header, scoreboard, and all 5 tabs correctly', () => {
    render(<PulmonaryEmbolismSimulator />);

    expect(
      screen.getByText(/Pulmonary Embolism Severity, RV Strain & Thrombolysis \(CDT\) Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/ESC & AHA Guidelines/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ESC Risk Stratification/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/sPESI Prognostic Score/i)).toBeInTheDocument();
    expect(screen.getByText(/RV Strain Fingerprint/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardiac Biomarkers/i)).toBeInTheDocument();

    // Verify 5 tab buttons
    expect(screen.getByText(/1\. Hemodynamics & sPESI Scoring/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. RV Strain & Echocardiography/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Systemic Thrombolysis \(Alteplase\)/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Catheter Interventions \(EKOS & FlowTriever\)/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Anticoagulation & DOAC Pathways/i)).toBeInTheDocument();
  });

  it('switches clinical presets and triggers systemic full-dose tPA infusion', () => {
    render(<PulmonaryEmbolismSimulator />);

    // Default preset is MASSIVE_PE_CARDIOGENIC_SHOCK
    expect(
      screen.getAllByText(/CRITICAL EMERGENCY: HIGH-RISK MASSIVE PULMONARY EMBOLISM/i).length
    ).toBeGreaterThan(0);
    const tpaBtn = screen.getByRole('button', { name: /Infuse Full-Dose tPA \(100 mg \/ 2h\)/i });
    expect(tpaBtn).toBeInTheDocument();

    fireEvent.click(tpaBtn);
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/SYSTEMIC THROMBOLYSIS INITIATED/i)
    );
  });

  it('handles post-op contraindication and triggers mechanical thrombectomy', () => {
    render(<PulmonaryEmbolismSimulator />);

    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'MASSIVE_PE_POST_OPERATIVE_CONTRAINDICATED' } });

    expect(screen.getAllByText(/Absolute Thrombolytic Contraindication Present/i).length).toBeGreaterThan(0);

    const mechBtn = screen.getByRole('button', { name: /Mobilize Inari FlowTriever Thrombectomy/i });
    expect(mechBtn).toBeInTheDocument();

    fireEvent.click(mechBtn);
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/PERCUTANEOUS MECHANICAL THROMBECTOMY PERFORMED/i)
    );
  });

  it('navigates to Catheter Interventions tab and deploys EKOS ultrasound CDT', () => {
    render(<PulmonaryEmbolismSimulator />);

    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'SUBMASSIVE_INTERMEDIATE_HIGH_RISK_EKOS' } });

    // Click Tab 4: Catheter Interventions
    fireEvent.click(screen.getByText(/4\. Catheter Interventions \(EKOS & FlowTriever\)/i));

    expect(screen.getByText(/EKOS Ultrasound-Accelerated Thrombolysis/i)).toBeInTheDocument();

    const ekosCard = screen.getByText(/EKOS Ultrasound-Accelerated Thrombolysis/i).closest('div');
    expect(ekosCard).toBeTruthy();
    if (ekosCard) fireEvent.click(ekosCard);

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/EKOS CATHETER-DIRECTED THROMBOLYSIS DEPLOYED/i)
    );
  });

  it('navigates to Anticoagulation tab and displays DOAC outpatient protocols', () => {
    render(<PulmonaryEmbolismSimulator />);

    // Click Tab 5: Anticoagulation
    fireEvent.click(screen.getByText(/5\. Anticoagulation & DOAC Pathways/i));

    expect(
      screen.getByText(/Anticoagulation Regimens & Outpatient Pathways/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Apixaban \(Eliquis\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Rivaroxaban \(Xarelto\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Hestia Outpatient Criteria/i)).toBeInTheDocument();
  });
});
