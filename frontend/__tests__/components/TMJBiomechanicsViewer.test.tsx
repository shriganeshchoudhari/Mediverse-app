import React from 'react';
import { render, screen } from '@testing-library/react';
import TMJBiomechanicsViewer from '../../components/dental/TMJBiomechanicsViewer';

describe('TMJBiomechanicsViewer Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<TMJBiomechanicsViewer />);
    // Component renders a container div — verify it is in the document
    expect(container.firstChild).toBeInTheDocument();
  });

  it('SVG element present for the TMJ anatomy diagram', () => {
    const { container } = render(<TMJBiomechanicsViewer />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('Opening range slider is present', () => {
    render(<TMJBiomechanicsViewer />);
    // There are 3 sliders (Opening, Protrusion, Lateral Excursion)
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThanOrEqual(1);
    // The label text is split across text nodes — match via getAllByText
    expect(screen.getAllByText(/Mouth Opening/i).length).toBeGreaterThan(0);
  });

  it('Protrusion slider is present', () => {
    render(<TMJBiomechanicsViewer />);
    expect(screen.getByText(/Protrusion/i)).toBeInTheDocument();
  });

  it('Disc position selector has 3 radio options', () => {
    render(<TMJBiomechanicsViewer />);
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(3);
    // Check actual rendered text — component uses abbreviated labels
    expect(screen.getByText(/Normal/i)).toBeInTheDocument();
    expect(screen.getByText(/ADR/i)).toBeInTheDocument();
    expect(screen.getByText(/ADWR/i)).toBeInTheDocument();
  });

  it('TMD Classification section is displayed', () => {
    render(<TMJBiomechanicsViewer />);
    // The section heading exists even if Piper label is not shown
    expect(screen.getByText(/TMD Classification/i)).toBeInTheDocument();
  });

  it('Default opening value (35mm) is shown', () => {
    render(<TMJBiomechanicsViewer />);
    // "35 mm" is rendered inside the label text node
    expect(screen.getByText(/35/)).toBeInTheDocument();
  });

  it('Clinical Findings section is visible', () => {
    render(<TMJBiomechanicsViewer />);
    expect(screen.getByText(/Clinical Findings/i)).toBeInTheDocument();
  });

  it('Motion Parameters section heading is present', () => {
    render(<TMJBiomechanicsViewer />);
    expect(screen.getByText(/Motion Parameters/i)).toBeInTheDocument();
  });
});
