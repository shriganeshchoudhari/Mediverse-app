import React from 'react';
import { render, screen } from '@testing-library/react';
import TridoshaANSSimulator from '../../components/ayush/TridoshaANSSimulator';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('TridoshaANSSimulator', () => {
  it('renders without crashing', () => {
    const { container } = render(<TridoshaANSSimulator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('contains SVG element for the Tridosha balance triangle', () => {
    const { container } = render(<TridoshaANSSimulator />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('contains range sliders for Vata, Pitta, Kapha', () => {
    const { container } = render(<TridoshaANSSimulator />);
    const sliders = container.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBeGreaterThanOrEqual(3);
  });

  it('displays LF/HF Ratio and tone metrics', () => {
    render(<TridoshaANSSimulator />);
    expect(screen.getByText(/LF\/HF Ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/^Sympathetic Tone:/i)).toBeInTheDocument();
    expect(screen.getByText(/^Parasympathetic Tone:/i)).toBeInTheDocument();
  });

  it('displays Circadian Clock section', () => {
    render(<TridoshaANSSimulator />);
    expect(screen.getByText(/Circadian Clock/i)).toBeInTheDocument();
  });
});
