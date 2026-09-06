import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StewartAcidBaseSimulator from '@/components/simulators/StewartAcidBaseSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('StewartAcidBaseSimulator Component', () => {
  test('renders simulator header, SID badge, and independent variable controls', () => {
    render(<StewartAcidBaseSimulator />);
    expect(screen.getAllByText(/NEPHROLOGY & ICU/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Stewart Independent Variables/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Resuscitation Fluids & Diagnostics/i).length).toBeGreaterThan(0);
  });

  test('renders all 6 Stewart clinical presets', () => {
    render(<StewartAcidBaseSimulator />);
    expect(screen.getAllByText(/Normal Physiological Acid-Base/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Post-Resuscitation Hyperchloremic/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Septic Shock with Severe Hypoalbuminemia/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Severe Diabetic Ketoacidosis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/End-Stage Renal Disease/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Gastric Outlet Obstruction/i).length).toBeGreaterThan(0);
  });

  test('switches to Saline Resuscitation preset and shows hyperchloremic alarm', () => {
    render(<StewartAcidBaseSimulator />);
    const salineBtn = screen.getByText(/Post-Resuscitation Hyperchloremic/i);
    fireEvent.click(salineBtn);
    expect(screen.getAllByText(/SEVERE HYPERCHLOREMIC ACIDOSIS/i).length).toBeGreaterThan(0);
  });

  test('switches to DKA preset and shows high unmeasured anion gap alarm', () => {
    render(<StewartAcidBaseSimulator />);
    const dkaBtn = screen.getByText(/Severe Diabetic Ketoacidosis/i);
    fireEvent.click(dkaBtn);
    expect(screen.getAllByText(/UNMEASURED ANIONS HIGH SIG/i).length).toBeGreaterThan(0);
  });

  test('simulates IV fluid infusion of 0.9% normal saline', () => {
    render(<StewartAcidBaseSimulator />);
    const salineFluidBtn = screen.getByRole('button', { name: /0.9% Saline \(SID=0\)/i });
    fireEvent.click(salineFluidBtn);
    expect(salineFluidBtn).toHaveClass('border-teal-500');
    expect(screen.getAllByText(/Volume Infused:/i).length).toBeGreaterThan(0);
  });

  test('dispatches Socratic AI event with Stewart parameters', () => {
    render(<StewartAcidBaseSimulator />);
    const aiBtn = screen.getByText(/Ask Socratic AI Tutor/i);
    fireEvent.click(aiBtn);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );
  });
});
