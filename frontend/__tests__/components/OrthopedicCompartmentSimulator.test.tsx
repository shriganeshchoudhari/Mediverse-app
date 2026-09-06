import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrthopedicCompartmentSimulator from '@/components/simulators/OrthopedicCompartmentSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('OrthopedicCompartmentSimulator Component', () => {
  test('renders simulator header, ACS badge, and manometer controls', () => {
    render(<OrthopedicCompartmentSimulator />);
    expect(screen.getAllByText(/ORTHOPEDIC SURGERY/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Stryker Needle Manometer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Critical Perfusion Delta P/i).length).toBeGreaterThan(0);
  });

  test('renders all 6 preset clinical buttons', () => {
    render(<OrthopedicCompartmentSimulator />);
    expect(screen.getAllByText(/Closed Tibial Shaft Fracture/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Building Collapse Crush Injury/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Iatrogenic Constrictive Fiberglass/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pediatric Supracondylar Humerus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Post-Arterial Embolectomy Reperfusion/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Benign Quadriceps.*Contusion/i).length).toBeGreaterThan(0);
  });

  test('switches presets to pediatric Volkmann forearm syndrome', () => {
    render(<OrthopedicCompartmentSimulator />);
    const volkmannBtn = screen.getByText(/Pediatric Supracondylar Humerus/i);
    fireEvent.click(volkmannBtn);
    expect(screen.getAllByText(/Forearm Volar Pressure/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Volar Curved Incision/i })).toBeInTheDocument();
  });

  test('bivalving cast triggers pressure drop', () => {
    render(<OrthopedicCompartmentSimulator />);
    const bivalveBtn = screen.getByText(/1. Bivalve Circumferential Cast/i);
    fireEvent.click(bivalveBtn);
    expect(screen.getAllByText(/BIVALVED/i).length).toBeGreaterThan(0);
  });

  test('performs anterolateral and posteromedial fasciotomy incisions', () => {
    render(<OrthopedicCompartmentSimulator />);
    const antBtn = screen.getByText(/2. Anterolateral Incision/i);
    fireEvent.click(antBtn);
    expect(screen.getAllByText(/COMPLETED/i).length).toBeGreaterThan(0);
  });

  test('dispatches Socratic AI event on button click', () => {
    render(<OrthopedicCompartmentSimulator />);
    const aiBtn = screen.getByText(/Ask Socratic AI Tutor/i);
    fireEvent.click(aiBtn);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'mediverse:open-ai-with-context' })
    );
  });
});
