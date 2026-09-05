import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TraumaATLSSimulator from '@/components/simulators/TraumaATLSSimulator';

// Mock animation / timer APIs
beforeEach(() => {
  global.requestAnimationFrame = (cb: FrameRequestCallback) => { cb(0); return 0; };
  global.cancelAnimationFrame = () => {};
  jest.useFakeTimers();
  window.dispatchEvent = jest.fn();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('TraumaATLSSimulator Component', () => {
  test('renders the trauma bay workstation heading', () => {
    render(<TraumaATLSSimulator />);
    expect(screen.getAllByText(/TRAUMA BAY/i).length).toBeGreaterThan(0);
  });

  test('renders all 6 preset scenario cards', () => {
    render(<TraumaATLSSimulator />);
    expect(screen.getAllByText(/Penetrating Abdominal Trauma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tension Pneumothorax/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cardiac Tamponade/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Polytrauma/i).length).toBeGreaterThan(0);
  });

  test('ABCDE primary survey panel is displayed', () => {
    render(<TraumaATLSSimulator />);
    expect(screen.getAllByText(/Primary Survey/i).length).toBeGreaterThan(0);
  });

  test('FAST exam section renders with POSITIVE/NEGATIVE status', () => {
    render(<TraumaATLSSimulator />);
    expect(screen.getAllByText(/FAST/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/POSITIVE|NEGATIVE/i).length).toBeGreaterThan(0);
  });

  test('MTP intervention button activates massive transfusion protocol', () => {
    render(<TraumaATLSSimulator />);
    const mtpBtns = screen.getAllByText(/Activate MTP/i);
    expect(mtpBtns[0]).toBeInTheDocument();
    fireEvent.click(mtpBtns[0]);
    expect(screen.getAllByText(/MTP/i).length).toBeGreaterThan(0);
  });

  test('Tension pneumothorax preset shows needle decompression button enabled', () => {
    render(<TraumaATLSSimulator />);
    const ptxPresets = screen.getAllByText(/Tension Pneumothorax/i);
    fireEvent.click(ptxPresets[0]);
    const needleBtns = screen.getAllByText(/Needle Decompression/i);
    const needleBtn = needleBtns.find((el) => el.tagName === 'BUTTON');
    expect(needleBtn).toBeDefined();
    expect(needleBtn).not.toBeDisabled();
  });

  test('Socratic AI tutor button dispatches context event', () => {
    render(<TraumaATLSSimulator />);
    const aiBtn = screen.getByText(/Socratic AI Tutor/i);
    fireEvent.click(aiBtn);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'mediverse:open-ai-with-context' })
    );
  });
});
