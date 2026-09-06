import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AudiometrySimulator from '@/components/simulators/AudiometrySimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('AudiometrySimulator Component', () => {
  test('renders simulator header, title, and initial diagnosis', () => {
    render(<AudiometrySimulator />);
    expect(screen.getAllByText(/Pure Tone Audiometry & Tympanometry Workstation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Normal Bilateral Auditory Acuity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/OPTIMAL HEARING/i).length).toBeGreaterThan(0);
  });

  test('renders all 8 clinical audiology presets', () => {
    render(<AudiometrySimulator />);
    expect(screen.getAllByText(/Normal Bilateral Hearing/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Stapedial Otosclerosis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Otitis Media with Effusion/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tympanic Membrane Perforation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bilateral Presbycusis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Noise-Induced Hearing Loss/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vestibular Schwannoma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Eustachian Tube Dysfunction/i).length).toBeGreaterThan(0);
  });

  test('switches to Otosclerosis preset and displays Carhart notch alarm', () => {
    render(<AudiometrySimulator />);
    const otosclerosisBtn = screen.getByRole('button', { name: /Stapedial Otosclerosis/i });
    fireEvent.click(otosclerosisBtn);
    expect(screen.getAllByText(/CARHART NOTCH OTOSCLEROSIS/i).length).toBeGreaterThan(0);
  });

  test('switches to Vestibular Schwannoma preset and displays retrocochlear emergency alert', () => {
    render(<AudiometrySimulator />);
    const acousticNeuromaBtn = screen.getByRole('button', { name: /Vestibular Schwannoma/i });
    fireEvent.click(acousticNeuromaBtn);
    expect(screen.getAllByText(/ASYMMETRIC SNHL RETROCOCHLEAR ALERT/i).length).toBeGreaterThan(0);
  });

  test('navigates between all tabs (Audiogram, Tympanometry, Speech, Clinical)', () => {
    render(<AudiometrySimulator />);

    // Tympanometry Tab
    const tympTab = screen.getByRole('button', { name: /Jerger Tympanometry & Admittance/i });
    fireEvent.click(tympTab);
    expect(screen.getAllByText(/Jerger Middle Ear Admittance Curves/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Middle Ear Air Pressure/i).length).toBeGreaterThan(0);

    // Speech & Reflex Tab
    const speechTab = screen.getByRole('button', { name: /Speech Audiometry & Stapedial Reflexes/i });
    fireEvent.click(speechTab);
    expect(screen.getAllByText(/Speech Audiometry & Rollover Index/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Stapedial Acoustic Reflex Arc Matrix/i).length).toBeGreaterThan(0);

    // Clinical Tab
    const clinicalTab = screen.getByRole('button', { name: /Tuning Forks & Otology Management/i });
    fireEvent.click(clinicalTab);
    expect(screen.getAllByText(/512 Hz Tuning Fork Examination Correlation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Evidence-Based Otology Management Pathway/i).length).toBeGreaterThan(0);

    // Back to Audiogram Tab
    const audiogramTab = screen.getByRole('button', { name: /Pure Tone Audiogram \(PTA\)/i });
    fireEvent.click(audiogramTab);
    expect(screen.getAllByText(/Speech Banana Overlay/i).length).toBeGreaterThan(0);
  });

  test('toggles ear selection between Right and Left in audiogram view', () => {
    render(<AudiometrySimulator />);
    const leftEarBtn = screen.getByRole('button', { name: /Left Ear \(AS\)/i });
    fireEvent.click(leftEarBtn);
    expect(screen.getAllByText(/Left Ear Quantitative Analysis/i).length).toBeGreaterThan(0);

    const rightEarBtn = screen.getByRole('button', { name: /Right Ear \(AD\)/i });
    fireEvent.click(rightEarBtn);
    expect(screen.getAllByText(/Right Ear Quantitative Analysis/i).length).toBeGreaterThan(0);
  });

  test('exports clinical report when export button clicked', () => {
    render(<AudiometrySimulator />);
    const exportBtn = screen.getByRole('button', { name: /Export Clinical Report/i });
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Report Generated!/i)).toBeInTheDocument();
  });
});
