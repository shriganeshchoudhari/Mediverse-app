import React from 'react';
import { render, screen } from '@testing-library/react';
import HealthEconomicsSimulator from '../../components/public-health/HealthEconomicsSimulator';

jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => {
        return children;
    };
});

describe('HealthEconomicsSimulator', () => {
    it('renders without crashing', () => {
        const { container } = render(<HealthEconomicsSimulator />);
        expect(container.firstChild).toBeTruthy();
    });

    it('displays ICER calculation and health economics metrics', () => {
        render(<HealthEconomicsSimulator />);
        const icerElements = screen.getAllByText(/ICER|Incremental Cost/i);
        expect(icerElements.length).toBeGreaterThan(0);
        const qalyElements = screen.getAllByText(/QALY/i);
        expect(qalyElements.length).toBeGreaterThan(0);
    });
});
