import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import GlobalSocraticAssistant from '../../components/ai/GlobalSocraticAssistant';

let mockCurrentPath = '/simulators/cardiac-cycle';

jest.mock('next/navigation', () => ({
  usePathname: () => mockCurrentPath,
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock useSocraticChatStream hook used by SocraticChat
jest.mock('../../hooks/useSocraticChatStream', () => ({
  useSocraticChatStream: () => ({
    messages: [],
    isGenerating: false,
    error: null,
    sendMessage: jest.fn(),
    stopGeneration: jest.fn(),
    clearChat: jest.fn(),
  }),
}));

describe('GlobalSocraticAssistant Component', () => {
  beforeEach(() => {
    mockCurrentPath = '/simulators/cardiac-cycle';
  });

  it('renders the floating action button (FAB) with accessible attributes', () => {
    render(<GlobalSocraticAssistant />);
    const fabButton = screen.getByRole('button', { name: /Open AI Socratic Tutor for Cardiac Cycle & Wiggers Diagram/i });
    expect(fabButton).toBeInTheDocument();
    expect(fabButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens slide-over drawer when FAB is clicked and displays topic context', () => {
    render(<GlobalSocraticAssistant />);
    const fabButton = screen.getByRole('button', { name: /Open AI Socratic Tutor/i });
    fireEvent.click(fabButton);

    expect(fabButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Socratic AI Companion')).toBeInTheDocument();
    expect(screen.getByText('Cardiac Cycle & Wiggers Diagram')).toBeInTheDocument();
  });

  it('closes drawer when the close button is clicked', () => {
    render(<GlobalSocraticAssistant />);
    const fabButton = screen.getByRole('button', { name: /Open AI Socratic Tutor/i });
    fireEvent.click(fabButton);

    const closeBtn = screen.getByRole('button', { name: /Close AI Socratic Tutor/i });
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);

    expect(fabButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes drawer when Escape key is pressed', () => {
    render(<GlobalSocraticAssistant />);
    const fabButton = screen.getByRole('button', { name: /Open AI Socratic Tutor/i });
    fireEvent.click(fabButton);

    expect(fabButton).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(fabButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('updates topic context when navigating to respiratory or lessons path', () => {
    mockCurrentPath = '/lessons/acid-base';
    const { unmount } = render(<GlobalSocraticAssistant />);
    expect(screen.getByRole('button', { name: /Acid-Base Balance & Compensation/i })).toBeInTheDocument();
    unmount();

    mockCurrentPath = '/simulators/respiratory-vq';
    render(<GlobalSocraticAssistant />);
    expect(screen.getByRole('button', { name: /Respiratory Mechanics & V\/Q Matching/i })).toBeInTheDocument();
  });
});
