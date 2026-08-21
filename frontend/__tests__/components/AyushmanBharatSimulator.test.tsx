import React from 'react';
import { render, screen } from '@testing-library/react';
import AyushmanBharatSimulator from '../../components/public-health/AyushmanBharatSimulator';

jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => {
        return children;
    };
});

describe('AyushmanBharatSimulator', () => {
    it('renders without crashing', () => {
        render(<AyushmanBharatSimulator />);
    });

    it('displays PM-JAY package selector', () => {
        render(<AyushmanBharatSimulator />);
        const elements = screen.getAllByText(/PM-JAY|Package/i);
        expect(elements.length).toBeGreaterThan(0);
    });

    it('displays sum insured tracker', () => {
        render(<AyushmanBharatSimulator />);
        const elements = screen.getAllByText(/Sum Insured/i);
        expect(elements.length).toBeGreaterThan(0);
    });
});
