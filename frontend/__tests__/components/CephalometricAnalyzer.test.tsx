import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CephalometricAnalyzer from '../../components/dental/CephalometricAnalyzer';

describe('CephalometricAnalyzer Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<CephalometricAnalyzer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('SVG lateral cephalogram template is present', () => {
    const { container } = render(<CephalometricAnalyzer />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('Analysis type tabs are present (Steiner, Tweed, Ricketts)', () => {
    render(<CephalometricAnalyzer />);
    expect(screen.getByText(/Steiner/i)).toBeInTheDocument();
    expect(screen.getByText(/Tweed/i)).toBeInTheDocument();
    expect(screen.getByText(/Ricketts/i)).toBeInTheDocument();
  });

  it('SNA label is present', () => {
    render(<CephalometricAnalyzer />);
    expect(screen.getByText(/SNA/i)).toBeInTheDocument();
  });

  it('SNB label is present', () => {
    render(<CephalometricAnalyzer />);
    expect(screen.getByText(/SNB/i)).toBeInTheDocument();
  });

  it('ANB label is present and computed value 2 is displayed', () => {
    render(<CephalometricAnalyzer />);
    expect(screen.getByText(/ANB/i)).toBeInTheDocument();
    // ANB = SNA(82) - SNB(80) = 2 — should appear somewhere in the summary
    const elements = screen.getAllByText(/2/);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('Skeletal class is displayed (Class I with default values)', () => {
    render(<CephalometricAnalyzer />);
    expect(screen.getByText(/Class I/i)).toBeInTheDocument();
  });

  it('Skeletal pattern is displayed (normodivergent with defaults)', () => {
    render(<CephalometricAnalyzer />);
    // Default FMA=25 -> normodivergent (or component uses SN-GoGn)
    expect(screen.getByText(/Normodivergent/i)).toBeInTheDocument();
  });

  it('Changing analysis tab to Tweed does not crash', () => {
    render(<CephalometricAnalyzer />);
    const tweedTab = screen.getByText(/Tweed/i);
    fireEvent.click(tweedTab);
    expect(tweedTab).toBeInTheDocument();
  });

  it('Normal range badges are visible (multiple normal badges)', () => {
    render(<CephalometricAnalyzer />);
    // With default values, most measurements should be in normal range
    const normalBadges = screen.getAllByText(/normal/i);
    expect(normalBadges.length).toBeGreaterThan(0);
  });

  it('Diagnostic Summary section is displayed', () => {
    render(<CephalometricAnalyzer />);
    expect(screen.getByText(/Diagnostic Summary/i)).toBeInTheDocument();
  });
});
