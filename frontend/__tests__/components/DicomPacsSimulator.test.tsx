import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DicomPacsSimulator from '@/components/simulators/DicomPacsSimulator';

// Mock HTML5 Canvas getContext
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    createImageData: jest.fn((w, h) => ({
      data: new Uint8ClampedArray(w * h * 4)
    })),
    putImageData: jest.fn(),
    drawImage: jest.fn(),
    fillRect: jest.fn(),
    clearRect: jest.fn()
  })) as any;
});

describe('DicomPacsSimulator Component', () => {
  it('1. renders hero header and main title', () => {
    render(<DicomPacsSimulator />);
    expect(
      screen.getByText(/Advanced DICOM Radiology PACS Viewer & Multi-Planar Reconstruction/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Track C2 • Radiology, Medical Imaging & PACS/i)
    ).toBeInTheDocument();
  });

  it('2. allows switching between clinical imaging cases', () => {
    render(<DicomPacsSimulator />);
    const pePresetBtn = screen.getByText(/Thoracic Radiology/i);
    fireEvent.click(pePresetBtn);
    expect(
      screen.getByText(/Acute Saddle Pulmonary Embolism & Infarction/i)
    ).toBeInTheDocument();
  });

  it('3. renders window/level presets and allows switching to Bone window', () => {
    render(<DicomPacsSimulator />);
    const boneBtn = screen.getByText(/Bone \/ Calvarium/i);
    fireEvent.click(boneBtn);
    expect(screen.getByText(/300 HU/i)).toBeInTheDocument(); // Window Level Center
    expect(screen.getByText(/1500 HU/i)).toBeInTheDocument(); // Window Width
  });

  it('4. switches to pathology notes tab and displays clinical pearls', () => {
    render(<DicomPacsSimulator />);
    const notesTab = screen.getByRole('button', { name: /Radiologic Findings & Clinical Pearls/i });
    fireEvent.click(notesTab);
    expect(screen.getByText(/Clinical & Radiologic Diagnostic Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Hounsfield Unit Diagnostic Matrix:/i)).toBeInTheDocument();
  });

  it('5. switches to DICOM header tags tab and displays tag table', () => {
    render(<DicomPacsSimulator />);
    const tagsTab = screen.getByRole('button', { name: /DICOM Header Metadata/i });
    fireEvent.click(tagsTab);
    expect(screen.getByText(/DICOM Header Metadata Tags/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient's Name/i)).toBeInTheDocument();
    expect(screen.getByText(/\(0010,0010\)/i)).toBeInTheDocument();
  });
});
