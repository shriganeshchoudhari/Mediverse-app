import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlashcardsDueWidget from '../../components/dashboard/FlashcardsDueWidget';

describe('FlashcardsDueWidget Component', () => {
  it('renders widget title and due count when cards are due', () => {
    render(<FlashcardsDueWidget dueCount={7} />);

    expect(screen.getByText(/Spaced Repetition \(SRS\)/i)).toBeInTheDocument();
    expect(screen.getByText(/7/i)).toBeInTheDocument();
    expect(screen.getByText(/cards due/i)).toBeInTheDocument();

    const reviewLink = screen.getByRole('link', { name: /Review Now →/i });
    expect(reviewLink).toBeInTheDocument();
    expect(reviewLink).toHaveAttribute('href', '/dashboard/flashcards');
  });

  it('renders Clear state when zero cards are due', () => {
    render(<FlashcardsDueWidget dueCount={0} />);

    expect(screen.getByText(/0/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear!/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Review Now →/i })).not.toBeInTheDocument();
  });
});
