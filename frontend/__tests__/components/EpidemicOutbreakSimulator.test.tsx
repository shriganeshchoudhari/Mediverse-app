import React from 'react';
import { render, screen } from '@testing-library/react';
import EpidemicOutbreakSimulator from '../../components/public-health/EpidemicOutbreakSimulator';

jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => {
        return children;
    };
});

describe('EpidemicOutbreakSimulator', () => {
    it('renders without crashing', () => {
        const { container } = render(<EpidemicOutbreakSimulator />);
        expect(container.firstChild).toBeTruthy();
    });

    it('displays pathogen preset buttons', () => {
        render(<EpidemicOutbreakSimulator />);
        const elements = screen.getAllByText(/COVID-19|Measles|Influenza|Pathogen/i);
        expect(elements.length).toBeGreaterThan(0);
    });

    it('displays R0 and NPI controls', () => {
        render(<EpidemicOutbreakSimulator />);
        expect(screen.getAllByText(/R₀|R0|Re/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/NPI|Non-Pharmaceutical|Interventions/i).length).toBeGreaterThan(0);
    });
});
