import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChestTubePleuralSimulator from '@/components/simulators/ChestTubePleuralSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('ChestTubePleuralSimulator Component', () => {
  test('renders simulator header, title, and 3-chamber unit', () => {
    render(<ChestTubePleuralSimulator />);
    expect(screen.getAllByText(/Pleural Space Dynamics & Chest Tube Drainage Simulator/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Chamber 1: Collection/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Chamber 2: Water Seal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Chamber 3: Suction/i).length).toBeGreaterThan(0);
  });

  test('renders all 8 clinical pleural scenarios', () => {
    render(<ChestTubePleuralSimulator />);
    expect(screen.getAllByText(/Tension Pneumothorax/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Massive Hemothorax/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Open "Sucking" Communicating/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Loculated Empyema/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Malignant Pleural Effusion/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Post-Lobectomy Bronchopleural/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Chylothorax/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Resolved Pneumothorax/i).length).toBeGreaterThan(0);
  });

  test('switches to Massive Hemothorax preset and displays emergency thoracotomy alert', () => {
    render(<ChestTubePleuralSimulator />);
    const hemothoraxBtn = screen.getByRole('button', { name: /Massive Hemothorax/i });
    fireEvent.click(hemothoraxBtn);
    expect(screen.getAllByText(/MASSIVE HEMOTHORAX THORACOTOMY ALERT/i).length).toBeGreaterThan(0);
  });

  test('executes emergency needle decompression on tension pneumothorax', () => {
    render(<ChestTubePleuralSimulator />);
    // Switch to interventions tab
    const interventionsTab = screen.getByRole('button', { name: /Bedside Thoracic Interventions/i });
    fireEvent.click(interventionsTab);

    const decompressBtn = screen.getByRole('button', { name: /Decompress \(14G\)/i });
    fireEvent.click(decompressBtn);
    expect(screen.getByText(/Needle In Situ/i)).toBeInTheDocument();
  });

  test('navigates between all 4 tabs (Console, Interventions, Chemistry, Guidelines)', () => {
    render(<ChestTubePleuralSimulator />);

    // Interventions tab
    const intTab = screen.getByRole('button', { name: /Bedside Thoracic Interventions/i });
    fireEvent.click(intTab);
    expect(screen.getAllByText(/Emergency Thoracic & Bedside Procedures/i).length).toBeGreaterThan(0);

    // Chemistry tab (Light's criteria)
    const chemTab = screen.getByRole('button', { name: /Pleural Chemistry & Light's Criteria/i });
    fireEvent.click(chemTab);
    expect(screen.getAllByText(/Light's Criteria for Pleural Fluid Analysis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pleural \/ Serum Protein Ratio/i).length).toBeGreaterThan(0);

    // Guidelines tab (ATLS)
    const guideTab = screen.getByRole('button', { name: /ATLS Thoracotomy & Chest Tube Protocols/i });
    fireEvent.click(guideTab);
    expect(screen.getAllByText(/Definitive Thoracic Surgical Recommendation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ATLS Emergency Thoracotomy Criteria/i).length).toBeGreaterThan(0);

    // Back to Console
    const consoleTab = screen.getByRole('button', { name: /Thoracic Coronal & 3-Chamber Drainage Console/i });
    fireEvent.click(consoleTab);
    expect(screen.getAllByText(/Coronal Thorax & Pleural Cavity/i).length).toBeGreaterThan(0);
  });

  test('toggles tube clamping state', () => {
    render(<ChestTubePleuralSimulator />);
    const intTab = screen.getByRole('button', { name: /Bedside Thoracic Interventions/i });
    fireEvent.click(intTab);

    const clampBtn = screen.getByRole('button', { name: /Clamp Tube/i });
    fireEvent.click(clampBtn);
    expect(screen.getByRole('button', { name: /Unclamp Tube/i })).toBeInTheDocument();
  });

  test('exports clinical report on button click', () => {
    render(<ChestTubePleuralSimulator />);
    const exportBtn = screen.getByRole('button', { name: /Export Clinical Note/i });
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Report Generated!/i)).toBeInTheDocument();
  });
});
