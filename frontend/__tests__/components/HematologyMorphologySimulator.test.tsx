import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HematologyMorphologySimulator from '../../components/simulators/HematologyMorphologySimulator';

describe('HematologyMorphologySimulator', () => {
  it('renders title and essential hematology morphology sections', () => {
    render(<HematologyMorphologySimulator />);
    expect(screen.getByText(/Hematology Smear & Marrow Morphology Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/WHO 2022 & M:E Solver/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete Blood Count & Diff/i)).toBeInTheDocument();
    expect(screen.getByText(/Bone Marrow Aspirate & Biopsy/i)).toBeInTheDocument();
    expect(screen.getByText(/Peripheral Smear Morphological Findings/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates malignancy diagnosis', () => {
    render(<HematologyMorphologySimulator />);
    const normalPreset = screen.getByRole('button', { name: /Normal Peripheral Blood & Marrow/i });
    fireEvent.click(normalPreset);

    expect(screen.getAllByText(/NORMAL PERIPHERAL SMEAR/i).length).toBeGreaterThan(0);

    const apmlPreset = screen.getByRole('button', { name: /Acute Promyelocytic Leukemia \(APML \/ FAB M3\)/i });
    fireEvent.click(apmlPreset);

    expect(screen.getAllByText(/ACUTE PROMYELOCYTIC LEUKEMIA/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/All-Trans Retinoic Acid \(ATRA\)/i).length).toBeGreaterThan(0);
  });

  it('allows adjusting WBC and marrow sliders', () => {
    render(<HematologyMorphologySimulator />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThan(5);

    // Find WBC slider
    const wbcSlider = sliders.find(
      s => Number(s.getAttribute('max')) === 180
    );
    expect(wbcSlider).toBeDefined();

    if (wbcSlider) {
      fireEvent.change(wbcSlider, { target: { value: '110' } });
      expect(screen.getAllByText(/110/i).length).toBeGreaterThan(0);
    }
  });

  it('toggles RBC morphology checkboxes', () => {
    render(<HematologyMorphologySimulator />);
    const rouleauxCheck = screen.getByRole('checkbox', { name: /Rouleaux Formation/i });
    expect(rouleauxCheck).not.toBeChecked();

    fireEvent.click(rouleauxCheck);
    expect(rouleauxCheck).toBeChecked();
  });

  it('displays bone marrow M:E ratio and diagnostic workup items', () => {
    render(<HematologyMorphologySimulator />);
    expect(screen.getAllByText(/Myeloid:Erythroid \(M:E\)/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Blast Burden/i)).toBeInTheDocument();
    expect(screen.getByText(/Essential Confirmatory Workup:/i)).toBeInTheDocument();
  });
});
