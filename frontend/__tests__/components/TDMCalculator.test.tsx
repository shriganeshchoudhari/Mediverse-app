import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TDMCalculator from '../../components/pharmacy/TDMCalculator';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('TDMCalculator Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<TDMCalculator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays drug selector with NTI drug names', () => {
    const { container } = render(<TDMCalculator />);
    expect(container.textContent).toMatch(/vancomycin/i);
  });

  it('contains patient input fields (Age, Weight, SCr)', () => {
    const { container } = render(<TDMCalculator />);
    expect(container.textContent).toMatch(/age/i);
    expect(container.textContent).toMatch(/weight/i);
    expect(container.textContent).toMatch(/serum creatinine/i);
  });

  it('displays computed Creatinine Clearance (CrCl)', () => {
    const { container } = render(<TDMCalculator />);
    expect(container.textContent).toMatch(/creatinine clearance/i);
  });

  it('displays Target Therapeutic Range', () => {
    const { container } = render(<TDMCalculator />);
    expect(container.textContent).toMatch(/target therapeutic range/i);
  });
});
