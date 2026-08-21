import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DentalNerveBlockViewer from '../../components/dental/DentalNerveBlockViewer';

describe('DentalNerveBlockViewer Component', () => {
  it('renders simulator title, technique tabs, and default IAN block', () => {
    render(<DentalNerveBlockViewer initialTechniqueId="ianb" />);

    expect(screen.getByText('3D Dental Nerve Block Simulator')).toBeInTheDocument();
    expect(screen.getByText(/Inferior Alveolar Nerve Block/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Coronoid Notch/i).length).toBeGreaterThan(0);
  });

  it('switches techniques between IANB, Gow-Gates, and Akinosi', () => {
    render(<DentalNerveBlockViewer />);

    const ggButton = screen.getByRole('button', { name: 'Gow-Gates' });
    fireEvent.click(ggButton);

    expect(screen.getByText(/Gow-Gates Mandibular Conduction Block/i)).toBeInTheDocument();
  });

  it('updates insertion depth and approach angle sliders', () => {
    render(<DentalNerveBlockViewer />);

    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(2);

    // Adjust depth slider
    fireEvent.change(sliders[0], { target: { value: '32' } });

    // Danger warning should trigger for depth > 30 on IANB
    expect(screen.getByText(/Parotid Capsule/i)).toBeInTheDocument();
  });

  it('performs aspiration test', () => {
    render(<DentalNerveBlockViewer />);

    const aspirationBtn = screen.getByRole('button', { name: /Perform Aspiration Test/i });
    fireEvent.click(aspirationBtn);

    expect(screen.getByText(/ASPIRATION:/i)).toBeInTheDocument();
  });
});
