import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PKPDSimulator from '../../components/pharmacy/PKPDSimulator';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('PKPDSimulator Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<PKPDSimulator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('contains SVG element for concentration-time curve', () => {
    const { container } = render(<PKPDSimulator />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('contains route selector buttons / inputs (IV Bolus, IV Infusion, Oral)', () => {
    const { container } = render(<PKPDSimulator />);
    expect(container.textContent).toMatch(/iv bolus/i);
    expect(container.textContent).toMatch(/iv infusion/i);
    expect(container.textContent).toMatch(/oral/i);
  });

  it('displays parameter sliders for Dose, Clearance, Vd', () => {
    const { container } = render(<PKPDSimulator />);
    expect(container.textContent).toMatch(/dose/i);
    expect(container.textContent).toMatch(/clearance/i);
    expect(container.textContent).toMatch(/vd/i);
  });

  it('displays Cmax and Trough metrics', () => {
    const { container } = render(<PKPDSimulator />);
    expect(container.textContent).toMatch(/cmax/i);
    expect(container.textContent).toMatch(/trough/i);
  });
});
