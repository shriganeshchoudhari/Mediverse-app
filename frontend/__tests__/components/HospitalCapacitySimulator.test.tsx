import React from 'react';
import { render, screen } from '@testing-library/react';
import HospitalCapacitySimulator from '../../components/public-health/HospitalCapacitySimulator';

jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => {
        return children;
    };
});

describe('HospitalCapacitySimulator', () => {
    it('renders without crashing', () => {
        render(<HospitalCapacitySimulator />);
    });

    it('displays Bed Occupancy Rate (BOR%) meter', () => {
        render(<HospitalCapacitySimulator />);
        const elements = screen.getAllByText(/BOR|Bed Occupancy Rate/i);
        expect(elements.length).toBeGreaterThan(0);
    });

    it('displays ICU queuing metrics', () => {
        render(<HospitalCapacitySimulator />);
        const elements = screen.getAllByText(/ICU/i);
        expect(elements.length).toBeGreaterThan(0);
    });
});
