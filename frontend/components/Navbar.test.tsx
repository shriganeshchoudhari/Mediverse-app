import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { useAuth } from '../config/AuthContext';
import React from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  }
}));

// Mock useAuth directly
jest.mock('../config/AuthContext', () => ({
  useAuth: jest.fn()
}));

const mockUseAuth = useAuth as jest.Mock;

describe('Navbar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders brand identity Mediverse and Medical Education & Simulation subtitle instead of MedSyllabus', () => {
    mockUseAuth.mockReturnValue({
      token: null,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false
    });

    render(<Navbar />);

    expect(screen.getByText('Mediverse')).toBeInTheDocument();
    expect(screen.getByText('Medical Education & Simulation')).toBeInTheDocument();
    expect(screen.queryByText('MedSyllabus')).not.toBeInTheDocument();
  });

  it('renders login button when unauthenticated', () => {
    mockUseAuth.mockReturnValue({
      token: null,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false
    });

    render(<Navbar />);

    expect(screen.getByText('Mediverse')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('renders dashboard links when authenticated', () => {
    mockUseAuth.mockReturnValue({
      token: 'mock-token',
      user: {
        userId: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER'
      },
      login: jest.fn(),
      logout: jest.fn(),
      loading: false
    });

    render(<Navbar />);

    expect(screen.getByText('Mediverse')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
