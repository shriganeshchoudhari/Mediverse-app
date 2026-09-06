import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AutoantibodyAnaSimulator from '@/components/simulators/AutoantibodyAnaSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('AutoantibodyAnaSimulator Component', () => {
  test('renders simulator title, autoimmune probability badge, and primary diagnosis', () => {
    render(<AutoantibodyAnaSimulator />);
    expect(
      screen.getAllByText(/Autoantibody Profiling, ICAP HEp-2 IFA & ACR\/EULAR Workstation/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Autoimmune Probability/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Serological Diagnosis/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Systemic Lupus Erythematosus/i)).toBeInTheDocument();
  });

  test('renders all 8 clinical preset buttons', () => {
    render(<AutoantibodyAnaSimulator />);
    expect(screen.getAllByText(/Systemic Lupus Erythematosus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Diffuse Cutaneous Systemic Sclerosis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CREST Syndrome/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Primary Sjögren Syndrome/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mixed Connective Tissue Disease/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Drug-Induced Lupus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Granulomatosis with Polyangiitis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Isolated Anti-DFS70/i).length).toBeGreaterThan(0);
  });

  test('switches to GPA preset and shows c-ANCA diagnosis and alerts', () => {
    render(<AutoantibodyAnaSimulator />);
    const gpaBtn = screen.getAllByText(/Granulomatosis with Polyangiitis/i)[0];
    fireEvent.click(gpaBtn);

    expect(
      screen.getAllByText(/Granulomatosis with Polyangiitis \(GPA \/ c-ANCA Vasculitis\)/i).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/FULMINANT PAUCI IMMUNE NECROTIZING VASCULITIS RISK/i).length
    ).toBeGreaterThan(0);
  });

  test('switches to Isolated DFS70 preset and displays benign low autoimmune probability', () => {
    render(<AutoantibodyAnaSimulator />);
    const dfsBtn = screen.getAllByText(/Isolated Anti-DFS70/i)[0];
    fireEvent.click(dfsBtn);

    expect(
      screen.getAllByText(/Isolated Anti-DFS70 \(Healthy Individual \/ Non-SARD\)/i).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/BENIGN DFS70 PATTERN LOW AUTOIMMUNE RISK/i).length
    ).toBeGreaterThan(0);
  });

  test('navigates through all 4 interactive tabs', () => {
    render(<AutoantibodyAnaSimulator />);

    // Tab 2: ENA & Serological Biomarker Deck
    const enaTab = screen.getByRole('button', { name: /ENA & Serological Biomarker Deck/i });
    fireEvent.click(enaTab);
    expect(screen.getByText(/Extractable Nuclear Antigens \(ENA\) Panel/i)).toBeInTheDocument();
    expect(screen.getByText(/ANCA Vasculitis Serology \(PR3 vs MPO\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Serum Complement System Consumption/i)).toBeInTheDocument();

    // Tab 3: ACR/EULAR Criteria Scorers
    const criteriaTab = screen.getByRole('button', { name: /ACR\/EULAR Criteria Scorers/i });
    fireEvent.click(criteriaTab);
    expect(screen.getByText(/2019 EULAR\/ACR Criteria for SLE/i)).toBeInTheDocument();
    expect(screen.getByText(/2013 ACR\/EULAR Systemic Sclerosis/i)).toBeInTheDocument();
    expect(screen.getByText(/2016 ACR\/EULAR Primary Sjögren/i)).toBeInTheDocument();

    // Tab 4: Diagnostic Guidelines & Biopsy
    const guideTab = screen.getByRole('button', { name: /Diagnostic Guidelines & Biopsy/i });
    fireEvent.click(guideTab);
    expect(screen.getByText(/Choosing Wisely • ACR ANA Ordering Principles/i)).toBeInTheDocument();
    expect(screen.getByText(/Isolated Anti-DFS70 Reassurance Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/Lupus Nephritis Biopsy Thresholds/i)).toBeInTheDocument();
  });

  test('exports serology report and resets to baseline', () => {
    render(<AutoantibodyAnaSimulator />);
    const exportBtn = screen.getByTitle(/Export Serological Consultation Report/i);
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Report Logged!/i)).toBeInTheDocument();

    const resetBtn = screen.getByTitle(/Reset to Active SLE Baseline/i);
    fireEvent.click(resetBtn);
    expect(screen.getAllByText(/Systemic Lupus Erythematosus/i).length).toBeGreaterThan(0);
  });
});
