import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GIEndoscopySimulator from '@/components/simulators/GIEndoscopySimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('GIEndoscopySimulator Component', () => {
  test('renders simulator header, depth indicator, and optical aperture', () => {
    render(<GIEndoscopySimulator />);
    expect(screen.getAllByText(/INTERVENTIONAL ENDOSCOPY/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/OPTICAL ENDOCAM 4K/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Rockall Score/i).length).toBeGreaterThan(0);
  });

  test('renders all 6 preset clinical buttons', () => {
    render(<GIEndoscopySimulator />);
    expect(screen.getAllByText(/Severe Duodenal Ulcer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cirrhotic Esophageal Variceal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Choledocholithiasis.*ERCP/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Barrett.*s Esophagus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Gastric Antral Ulcer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Malignant Common Bile Duct/i).length).toBeGreaterThan(0);
  });

  test('switches presets to ERCP and displays ampullary options', () => {
    render(<GIEndoscopySimulator />);
    const ercpPresetBtn = screen.getByText(/Choledocholithiasis.*ERCP/i);
    fireEvent.click(ercpPresetBtn);
    expect(screen.getAllByText(/ERCP Cannulation & Extraction/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /CBD Wire/i })).toBeInTheDocument();
  });

  test('performs dual hemostasis by injecting epinephrine and deploying hemoclips', () => {
    render(<GIEndoscopySimulator />);
    const epiBtn = screen.getByText(/Dilute Epinephrine Injection/i);
    fireEvent.click(epiBtn);
    expect(screen.getAllByText(/INJECTED/i).length).toBeGreaterThan(0);

    const clipBtn = screen.getByText(/Deploy Through-the-Scope Hemoclip/i);
    fireEvent.click(clipBtn);
    fireEvent.click(clipBtn);
    expect(screen.getAllByText(/2 Deployed/i).length).toBeGreaterThan(0);
  });

  test('dispatches Socratic AI event on button click', () => {
    render(<GIEndoscopySimulator />);
    const aiBtn = screen.getByText(/Ask Socratic AI Tutor/i);
    fireEvent.click(aiBtn);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'mediverse:open-ai-with-context' })
    );
  });
});
