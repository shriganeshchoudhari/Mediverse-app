import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NeurosurgeryEVDSimulator from '@/components/simulators/NeurosurgeryEVDSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('NeurosurgeryEVDSimulator Component', () => {
  test('renders simulator header, ICP badge, and console controls', () => {
    render(<NeurosurgeryEVDSimulator />);
    expect(screen.getAllByText(/NEUROSURGERY/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Stereotactic Ventriculostomy Navigation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hydrodynamic Burette/i).length).toBeGreaterThan(0);
  });

  test('renders all 6 neurosurgical clinical presets', () => {
    render(<NeurosurgeryEVDSimulator />);
    expect(screen.getAllByText(/Aneurysmal SAH with Acute Obstructive Hydrocephalus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Severe Traumatic Brain Injury/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Thalamic ICH with IVH Casting/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Iatrogenic CSF Overdrainage/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Normal Pressure Hydrocephalus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/EVD Weaning Trial/i).length).toBeGreaterThan(0);
  });

  test('switches to clotted catheter occlusion preset and displays alert', () => {
    render(<NeurosurgeryEVDSimulator />);
    const clottedBtn = screen.getByText(/Thalamic ICH with IVH Casting/i);
    fireEvent.click(clottedBtn);
    expect(screen.getAllByText(/CATHETER OCCLUSION NO PULSATION/i).length).toBeGreaterThan(0);
  });

  test('switches to slit ventricle overdrainage preset and displays danger alerts', () => {
    render(<NeurosurgeryEVDSimulator />);
    const slitBtn = screen.getByText(/Iatrogenic CSF Overdrainage/i);
    fireEvent.click(slitBtn);
    expect(screen.getAllByText(/CRITICAL OVERDRAINAGE COLLAPSE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/VENTRICULAR SLIT COLLAPSE/i).length).toBeGreaterThan(0);
  });

  test('toggles EVD drainage stopcock between open and clamped', () => {
    render(<NeurosurgeryEVDSimulator />);
    const clampBtn = screen.getByRole('button', { name: /OPEN & DRAINING/i });
    fireEvent.click(clampBtn);
    expect(screen.getByRole('button', { name: /CLAMPED/i })).toBeInTheDocument();
  });

  test('executes bedside neurocritical interventions', () => {
    render(<NeurosurgeryEVDSimulator />);
    const hypertonicBtn = screen.getByRole('button', { name: /3% NaCl 250mL/i });
    fireEvent.click(hypertonicBtn);
    expect(hypertonicBtn).toHaveClass('border-emerald-500');

    const mannitolBtn = screen.getByRole('button', { name: /20% Mannitol 1g\/kg/i });
    fireEvent.click(mannitolBtn);
    expect(mannitolBtn).toHaveClass('border-emerald-500');

    const flushBtn = screen.getByRole('button', { name: /Sterile Saline Flush/i });
    fireEvent.click(flushBtn);
    expect(flushBtn).toHaveClass('border-emerald-500');

    const tpaBtn = screen.getByRole('button', { name: /Intrathecal rt-PA 1mg/i });
    fireEvent.click(tpaBtn);
    expect(tpaBtn).toHaveClass('border-emerald-500');
  });

  test('dispatches Socratic AI event with neurosurgical context', () => {
    render(<NeurosurgeryEVDSimulator />);
    const aiBtn = screen.getByText(/Ask Socratic AI Tutor/i);
    fireEvent.click(aiBtn);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );
  });
});
