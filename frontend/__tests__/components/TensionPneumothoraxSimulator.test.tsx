import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TensionPneumothoraxSimulator from '../../components/simulators/TensionPneumothoraxSimulator';

describe('TensionPneumothoraxSimulator Component Tests', () => {
  it('1. Renders workstation header and main title', () => {
    render(<TensionPneumothoraxSimulator />);
    expect(screen.getByText(/Tension Pneumothorax & Thoracic Decompression Workstation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Obstructive Shock Hemodynamics/i).length).toBeGreaterThanOrEqual(1);
  });

  it('2. Displays hero physical exam and hemodynamics grid', () => {
    render(<TensionPneumothoraxSimulator />);
    expect(screen.getByText(/Blood Pressure \/ Shock/i)).toBeInTheDocument();
    expect(screen.getByText(/Trachea & Mediastinum/i)).toBeInTheDocument();
    expect(screen.getByText(/Auscultation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Chest Wall Depth/i).length).toBeGreaterThanOrEqual(1);
  });

  it('3. Renders clinical case presets and switches to needle failure with alert', () => {
    render(<TensionPneumothoraxSimulator />);
    const failurePresetBtn = screen.getByText(/2\. 2nd ICS MCL Needle Failure/i);
    expect(failurePresetBtn).toBeInTheDocument();

    fireEvent.click(failurePresetBtn);
    expect(screen.getAllByText(/NEEDLE DECOMPRESSION FAILURE/i).length).toBeGreaterThan(0);
  });

  it('4. Switches between tabs and renders decompression intervention options', () => {
    render(<TensionPneumothoraxSimulator />);
    const interventionTabBtn = screen.getByText(/2\. Decompression Bench/i);
    fireEvent.click(interventionTabBtn);

    expect(screen.getAllByText(/Decompression Modality/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Needle 5th ICS Anterior Axillary Line/i)).toBeInTheDocument();
    expect(screen.getByText(/Finger Thoracostomy \(Simple\)/i)).toBeInTheDocument();
  });

  it('5. Switches to 3-Bottle Drainage tab and displays chamber mechanics', () => {
    render(<TensionPneumothoraxSimulator />);
    const drainageTabBtn = screen.getByText(/3\. 3-Bottle Drainage & AutoTx/i);
    fireEvent.click(drainageTabBtn);

    expect(screen.getByText(/1\. Collection Chamber/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Water Seal Chamber/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Suction Chamber/i)).toBeInTheDocument();
  });
});
