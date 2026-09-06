import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OphthalmologySlitLampSimulator from '@/components/simulators/OphthalmologySlitLampSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('OphthalmologySlitLampSimulator Component', () => {
  test('renders simulator header, initial IOP badge, and optical controls', () => {
    render(<OphthalmologySlitLampSimulator />);
    expect(screen.getAllByText(/OPHTHALMOLOGY/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Slit Lamp Optical Controls/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Goldmann Applanation Tonometry/i).length).toBeGreaterThan(0);
  });

  test('renders all 6 ophthalmic clinical presets', () => {
    render(<OphthalmologySlitLampSimulator />);
    expect(screen.getAllByText(/Acute Primary Angle-Closure Glaucoma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Herpes Simplex Virus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Acute Anterior Uveitis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Penetrating Corneal Laceration/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Normal Anterior Segment/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nuclear Sclerotic Cataract/i).length).toBeGreaterThan(0);
  });

  test('switches to HSV dendritic keratitis preset and updates findings', () => {
    render(<OphthalmologySlitLampSimulator />);
    const hsvBtn = screen.getByText(/Herpes Simplex Virus/i);
    fireEvent.click(hsvBtn);
    expect(screen.getAllByText(/Linear branching epithelial ulceration/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CORNEAL DENDRITIC ULCER HSV/i).length).toBeGreaterThan(0);
  });

  test('switches to penetrating globe Seidel sign preset', () => {
    render(<OphthalmologySlitLampSimulator />);
    const seidelBtn = screen.getByText(/Penetrating Corneal Laceration/i);
    fireEvent.click(seidelBtn);
    expect(screen.getAllByText(/GLOBE RUPTURE SEIDEL POSITIVE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Peaked irregular teardrop pupil/i).length).toBeGreaterThan(0);
  });

  test('toggles illumination filters and fluorescein instillation', () => {
    render(<OphthalmologySlitLampSimulator />);
    const cobaltBtn = screen.getByRole('button', { name: /Cobalt Blue/i });
    fireEvent.click(cobaltBtn);
    expect(cobaltBtn).toHaveClass('border-teal-500');

    const instillBtn = screen.getByRole('button', { name: /INSTILL/i });
    fireEvent.click(instillBtn);
    expect(screen.getByRole('button', { name: /✓ INSTILLED/i })).toBeInTheDocument();
  });

  test('performs acute angle-closure emergency interventions', () => {
    render(<OphthalmologySlitLampSimulator />);
    // Initial state is ACUTE_ANGLE_CLOSURE_GLAUCOMA
    expect(screen.getByText(/Angle-Closure Decompression/i)).toBeInTheDocument();

    const diamoxBtn = screen.getByRole('button', { name: /IV Diamox 500mg/i });
    fireEvent.click(diamoxBtn);

    const timololBtn = screen.getByRole('button', { name: /Timolol 0.5% Drops/i });
    fireEvent.click(timololBtn);

    const pilocarpineBtn = screen.getByRole('button', { name: /Pilocarpine 2%/i });
    fireEvent.click(pilocarpineBtn);

    const laserBtn = screen.getByRole('button', { name: /Nd:YAG Iridotomy/i });
    fireEvent.click(laserBtn);

    expect(screen.getAllByText(/NORMO-TENSIVE EYE/i).length).toBeGreaterThan(0);
  });

  test('dispatches Socratic AI event with ophthalmic context', () => {
    render(<OphthalmologySlitLampSimulator />);
    const aiBtn = screen.getByText(/Ask Socratic AI Tutor/i);
    fireEvent.click(aiBtn);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );
  });
});
