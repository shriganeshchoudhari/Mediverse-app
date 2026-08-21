import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HealthcareLandscapeExplorer from './HealthcareLandscapeExplorer';

describe('HealthcareLandscapeExplorer Component', () => {
  it('renders title and all 9 domain cards by default', () => {
    render(<HealthcareLandscapeExplorer />);

    expect(screen.getByText('Healthcare Education Landscape')).toBeInTheDocument();
    expect(screen.getByText('Allopathic')).toBeInTheDocument();
    expect(screen.getByText('Dental')).toBeInTheDocument();
    expect(screen.getByText('AYUSH')).toBeInTheDocument();
    expect(screen.getByText('Pharmacy')).toBeInTheDocument();
    expect(screen.getByText('Nursing')).toBeInTheDocument();
    expect(screen.getByText('Physiotherapy')).toBeInTheDocument();
    expect(screen.getByText('Allied Health')).toBeInTheDocument();
    expect(screen.getByText('Veterinary')).toBeInTheDocument();
    expect(screen.getByText('Public Health')).toBeInTheDocument();
  });

  it('filters cards by tier tabs', () => {
    render(<HealthcareLandscapeExplorer showTierFilter />);

    const tier1Tab = screen.getByRole('tab', { name: /Tier 1/i });
    expect(tier1Tab).toBeInTheDocument();

    fireEvent.click(tier1Tab);

    // Tier 1 items should be visible
    expect(screen.getByText('Allopathic')).toBeInTheDocument();
    expect(screen.getByText('Dental')).toBeInTheDocument();
    expect(screen.getByText('AYUSH')).toBeInTheDocument();
    expect(screen.getByText('Pharmacy')).toBeInTheDocument();

    // Non-Tier 1 items should not be in the document
    expect(screen.queryByText('Public Health')).not.toBeInTheDocument();
    expect(screen.queryByText('Veterinary')).not.toBeInTheDocument();
  });

  it('calls onDomainSelect when a card is clicked', () => {
    const handleSelect = jest.fn();
    render(<HealthcareLandscapeExplorer onDomainSelect={handleSelect} />);

    const dentalCard = screen.getByLabelText(/Explore Dental Sciences/i);
    fireEvent.click(dentalCard);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'dental', shortName: 'Dental' })
    );
  });
});
