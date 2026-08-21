import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MarmaMapViewer from '../../components/ayush/MarmaMapViewer';

describe('MarmaMapViewer Component', () => {
  it('renders header, controls, and default selected Marma details', () => {
    render(<MarmaMapViewer initialMarmaId="sthapani" />);

    expect(screen.getByText('107 Marma Points 3D Body Explorer')).toBeInTheDocument();
    expect(screen.getByText(/Sthapani Marma/i)).toBeInTheDocument();
    expect(screen.getByText('स्थपनी')).toBeInTheDocument();
    expect(screen.getByText(/Nasion/i)).toBeInTheDocument();
  });

  it('switches views between Anterior, Posterior, and Cranial', () => {
    render(<MarmaMapViewer />);

    const backButton = screen.getByRole('button', { name: /Posterior \(Back\)/i });
    fireEvent.click(backButton);

    expect(screen.getByText('BACK')).toBeInTheDocument();

    const headButton = screen.getByRole('button', { name: /Cranial \(Head\)/i });
    fireEvent.click(headButton);

    expect(screen.getByText('HEAD')).toBeInTheDocument();
  });

  it('filters by prognosis tab', () => {
    render(<MarmaMapViewer />);

    const sadyaTab = screen.getByRole('button', { name: 'Sadya Pranahara' });
    fireEvent.click(sadyaTab);

    // Filtered count should be displayed
    expect(screen.getByText(/Visible:/i)).toBeInTheDocument();
  });

  it('toggles quiz mode', () => {
    render(<MarmaMapViewer />);

    const quizButton = screen.getByRole('button', { name: /Start Marma Quiz/i });
    fireEvent.click(quizButton);

    expect(screen.getByText(/Quiz Objective:/i)).toBeInTheDocument();
    expect(screen.getByText(/Exit Quiz/i)).toBeInTheDocument();
  });
});
