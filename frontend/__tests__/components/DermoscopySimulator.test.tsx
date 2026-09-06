import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DermoscopySimulator from '@/components/simulators/DermoscopySimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('DermoscopySimulator Component', () => {
  test('renders simulator header, 7-point badge, and optical controls', () => {
    render(<DermoscopySimulator />);
    expect(screen.getAllByText(/DERMATOLOGY/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dermatoscope Optical Controls/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Diagnostic Scoring & Biopsy Action Deck/i).length).toBeGreaterThan(0);
  });

  test('renders all 6 dermatology clinical presets', () => {
    render(<DermoscopySimulator />);
    expect(screen.getAllByText(/Superficial Spreading Melanoma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nodular Basal Cell Carcinoma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Stuck-On Seborrheic Keratosis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Intertriginous Erythrasma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Generalized Vitiligo/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dysplastic Compound Melanocytic Nevus/i).length).toBeGreaterThan(0);
  });

  test('switches to Basal Cell Carcinoma preset', () => {
    render(<DermoscopySimulator />);
    const bccBtn = screen.getByText(/Nodular Basal Cell Carcinoma/i);
    fireEvent.click(bccBtn);
    expect(screen.getAllByText(/BASAL CELL CARCINOMA SUSPECTED/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Branching arborizing telangiectasias/i).length).toBeGreaterThan(0);
  });

  test('switches lighting mode to Wood\'s Lamp 365nm and inspects Erythrasma', () => {
    render(<DermoscopySimulator />);
    const erythrasmaBtn = screen.getByText(/Intertriginous Erythrasma/i);
    fireEvent.click(erythrasmaBtn);

    const woodsBtn = screen.getByRole('button', { name: /Wood's 365nm/i });
    fireEvent.click(woodsBtn);

    expect(screen.getAllByText(/CORAL-PINK/i).length).toBeGreaterThan(0);
  });

  test('toggles caliper reticle and immersion gel buttons', () => {
    render(<DermoscopySimulator />);
    const reticleBtn = screen.getByRole('button', { name: /✓ RETICLE ON/i });
    fireEvent.click(reticleBtn);
    expect(screen.getByRole('button', { name: /OFF/i })).toBeInTheDocument();

    const gelBtn = screen.getByRole('button', { name: /APPLY GEL/i });
    fireEvent.click(gelBtn);
    expect(screen.getByRole('button', { name: /✓ GEL APPLIED/i })).toBeInTheDocument();
  });

  test('performs diagnostic excisional biopsy', () => {
    render(<DermoscopySimulator />);
    const excisionalBtn = screen.getByRole('button', { name: /Excisional Biopsy \(2mm\)/i });
    fireEvent.click(excisionalBtn);
    expect(excisionalBtn).toHaveClass('border-emerald-500');
  });

  test('dispatches Socratic AI event with dermoscopic context', () => {
    render(<DermoscopySimulator />);
    const aiBtn = screen.getByText(/Ask Socratic AI Tutor/i);
    fireEvent.click(aiBtn);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );
  });
});
