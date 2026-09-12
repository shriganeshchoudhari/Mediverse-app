import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShuntHypoxemiaSimulator from '../../components/simulators/ShuntHypoxemiaSimulator';

describe('ShuntHypoxemiaSimulator Component', () => {
  it('renders executive header and KPI cards properly', () => {
    render(<ShuntHypoxemiaSimulator />);

    expect(screen.getAllByText(/Hypoxemic & Hypercapnic Respiratory Failure Workstation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Shunt Fraction/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/A-a Gradient/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/P\/F Ratio/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Oxygen Delivery/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches between preset clinical scenarios', () => {
    render(<ShuntHypoxemiaSimulator />);

    const copdPresetButton = screen.getAllByText(/Severe COPD Exacerbation/i)[0];
    fireEvent.click(copdPresetButton);

    // Verify COPD V/Q mismatch classification
    expect(screen.getAllByText(/V\/Q Mismatch/i).length).toBeGreaterThanOrEqual(1);

    const opioidPresetButton = screen.getAllByText(/Acute Opioid Overdose/i)[0];
    fireEvent.click(opioidPresetButton);

    // Verify Opioid hypoventilation classification
    expect(screen.getAllByText(/Alveolar Hypoventilation/i).length).toBeGreaterThanOrEqual(1);
  });

  it('navigates through interactive tabs smoothly', () => {
    render(<ShuntHypoxemiaSimulator />);

    // Tab 2: Berggren Shunt & 100% O2 Bench
    const shuntTabButton = screen.getByText(/2\. Berggren Shunt/i);
    fireEvent.click(shuntTabButton);
    expect(screen.getAllByText(/Hyperoxia Challenge/i).length).toBeGreaterThanOrEqual(1);

    // Tab 3: DO2 / VO2 Dysoxia Dynamics
    const do2TabButton = screen.getByText(/3\. DO2 \/ VO2/i);
    fireEvent.click(do2TabButton);
    expect(screen.getAllByText(/Critical Dysoxia Threshold/i).length).toBeGreaterThanOrEqual(1);

    // Tab 4: ARDS Mechanics & Dead Space
    const ventTabButton = screen.getByText(/4\. ARDS Mechanics/i);
    fireEvent.click(ventTabButton);
    expect(screen.getAllByText(/Bohr-Enghoff Dead Space/i).length).toBeGreaterThanOrEqual(1);

    // Tab 5: Clinical Protocols & Evidence
    const evidenceTabButton = screen.getByText(/5\. Clinical Protocols/i);
    fireEvent.click(evidenceTabButton);
    expect(screen.getAllByText(/ARDSNet Lung-Protective/i).length).toBeGreaterThanOrEqual(1);
  });

  it('updates parameter slider and triggers recalculation', () => {
    render(<ShuntHypoxemiaSimulator />);

    const paO2Input = screen.getByDisplayValue('64');
    fireEvent.change(paO2Input, { target: { value: '45' } });

    expect(screen.getAllByText(/45 mmHg/i).length).toBeGreaterThanOrEqual(1);
  });
});