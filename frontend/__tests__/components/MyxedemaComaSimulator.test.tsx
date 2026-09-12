import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyxedemaComaSimulator from '../../components/simulators/MyxedemaComaSimulator';

describe('MyxedemaComaSimulator Component', () => {
  it('renders simulator header, title, and initial executive summary cards', () => {
    render(<MyxedemaComaSimulator />);

    expect(
      screen.getByText(/Myxedema Coma & Thyroid Crisis Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Popoveniuc Score/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Adrenal Protection/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Thyroid Hormone/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Core Temp & Heat/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Ventilation & Na⁺/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clinical presets and applies Impending Myxedema with CAD preset', () => {
    render(<MyxedemaComaSimulator />);

    const cadPresetButtons = screen.getAllByRole('button', { name: /Impending Myxedema/i });
    expect(cadPresetButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(cadPresetButtons[0]);

    // Should reflect CAD warning or lower T4 load
    expect(screen.getAllByText(/Reduced \(200 mcg\)/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches tabs to Popoveniuc Diagnostic Score and selects CNS severity', () => {
    render(<MyxedemaComaSimulator />);

    const popoveniucTab = screen.getByRole('button', { name: /Popoveniuc Diagnostic Score/i });
    fireEvent.click(popoveniucTab);

    expect(screen.getAllByText(/Popoveniuc Diagnostic Scoring System/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/CNS Dysfunction/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Gastrointestinal/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Score Breakdown by System/i).length).toBeGreaterThanOrEqual(1);

    const stuporButton = screen.getByRole('button', { name: /Stupor \/ Delirium/i });
    fireEvent.click(stuporButton);
  });

  it('switches tabs to Steroids-Before-Thyroid Protocol and toggles adrenal safety interlock', () => {
    render(<MyxedemaComaSimulator />);

    const adrenalTab = screen.getByRole('button', { name: /Steroids-Before-Thyroid Protocol/i });
    fireEvent.click(adrenalTab);

    expect(screen.getByText(/The "Steroids-Before-Thyroid" Safety Interlock/i)).toBeInTheDocument();
    expect(screen.getByText(/Stress-Dose Hydrocortisone Regimen/i)).toBeInTheDocument();
    expect(screen.getByText(/Protected Adrenal State:/i)).toBeInTheDocument();

    // Toggle hydrocortisone off -> should trigger LETHAL ADRENAL CRISIS TRIGGER
    const hydrocortisoneCheckbox = screen.getByRole('checkbox');
    fireEvent.click(hydrocortisoneCheckbox);

    expect(screen.getByText(/LETHAL ADRENAL CRISIS TRIGGER:/i)).toBeInTheDocument();
  });

  it('switches tabs to IV Thyroid Hormone Titration and selects monotherapy and CAD', () => {
    render(<MyxedemaComaSimulator />);

    const thyroidTab = screen.getByRole('button', { name: /IV Thyroid Hormone Titration/i });
    fireEvent.click(thyroidTab);

    expect(screen.getByText(/ATA Guidelines Thyroid Hormone Dosing/i)).toBeInTheDocument();
    expect(screen.getByText(/Myocardial Ischemia Risk & Deiodinase Impairment/i)).toBeInTheDocument();

    const monoButton = screen.getByRole('button', { name: /IV T4 Monotherapy/i });
    fireEvent.click(monoButton);

    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[0]);
    }
  });

  it('switches tabs to Rewarming, Ventilation & Sodium and toggles active rewarming hazard', () => {
    render(<MyxedemaComaSimulator />);

    const supportiveTab = screen.getByRole('button', { name: /Rewarming, Ventilation & Sodium/i });
    fireEvent.click(supportiveTab);

    expect(screen.getByText(/Passive External Rewarming vs. Vasodilatory Shock/i)).toBeInTheDocument();
    expect(screen.getByText(/Hypoventilation & Hyponatremia Protocols/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended Rewarming:/i)).toBeInTheDocument();

    // Toggle active warming blanket
    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[0]);
    }

    expect(screen.getByText(/Lethal Vasodilatory Collapse Hazard/i)).toBeInTheDocument();
  });
});
