import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CPETSimulator from '@/components/simulators/CPETSimulator';

// Mock Recharts responsive container and charts for jsdom
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container" style={{ width: 400, height: 200 }}>
        {children}
      </div>
    ),
  };
});

describe('CPETSimulator', () => {
  it('renders the simulator title, panels, and diagnostic HUD', () => {
    render(<CPETSimulator />);

    expect(screen.getByText('Cardiopulmonary Exercise Testing (CPET)')).toBeInTheDocument();
    expect(screen.getByText('Wasserman 9-Panel')).toBeInTheDocument();

    // Check key panels
    expect(screen.getByText('Panel 1: Ventilatory Demand (V̇E vs Time)')).toBeInTheDocument();
    expect(screen.getByText('Panel 2: HR & O₂ Pulse (V̇O₂/HR vs Time)')).toBeInTheDocument();
    expect(screen.getByText('Panel 3: V̇O₂ & V̇CO₂ vs Time')).toBeInTheDocument();
    expect(screen.getByText('Panel 7: Beaver V-Slope (V̇CO₂ vs V̇O₂)')).toBeInTheDocument();
    expect(screen.getByText('Panel 8: Respiratory Exchange Ratio (RER)')).toBeInTheDocument();
  });

  it('renders all 6 clinical presets', () => {
    render(<CPETSimulator />);

    expect(screen.getByText('Healthy Active Adult')).toBeInTheDocument();
    expect(screen.getByText('Heart Failure (HFrEF - Weber C)')).toBeInTheDocument();
    expect(screen.getByText('Severe COPD (GOLD Stage 3)')).toBeInTheDocument();
    expect(screen.getByText('Pulmonary Arterial Hypertension (PAH)')).toBeInTheDocument();
    expect(screen.getByText('Mitochondrial Cytopathy')).toBeInTheDocument();
    expect(screen.getByText('Elite Endurance Cyclist')).toBeInTheDocument();
  });

  it('switches preset and updates physiological limitation classification', () => {
    render(<CPETSimulator />);

    // Click Severe COPD preset
    const copdBtn = screen.getByText('Severe COPD (GOLD Stage 3)').closest('button');
    expect(copdBtn).toBeInTheDocument();
    fireEvent.click(copdBtn!);

    // Should indicate ventilatory limitation
    expect(screen.getAllByText(/VENTILATORY/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Breathing reserve is critically exhausted/i)).toBeInTheDocument();

    // Click Heart Failure preset
    const hfBtn = screen.getByText('Heart Failure (HFrEF - Weber C)').closest('button');
    expect(hfBtn).toBeInTheDocument();
    fireEvent.click(hfBtn!);

    // Should indicate cardiovascular limitation with Weber Class
    expect(screen.getAllByText(/CARDIOVASCULAR/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Weber CLASS C/i)).toBeInTheDocument();
  });

  it('toggles threshold markers (AT/RCP)', () => {
    render(<CPETSimulator />);

    const toggleBtn = screen.getByRole('button', { name: /Hide Thresholds/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /Show Thresholds/i })).toBeInTheDocument();
  });

  it('opens and adjusts custom patient sliders drawer', () => {
    render(<CPETSimulator />);

    const adjustBtn = screen.getByRole('button', { name: /Adjust Patient/i });
    fireEvent.click(adjustBtn);

    expect(screen.getByText(/Age:/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight:/i)).toBeInTheDocument();
    expect(screen.getByText(/FEV1:/i)).toBeInTheDocument();
  });

  it('dispatches Socratic AI custom event when Ask Socratic AI is clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<CPETSimulator />);

    const aiBtn = screen.getByRole('button', { name: /Ask Socratic AI/i });
    fireEvent.click(aiBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );
    dispatchSpy.mockRestore();
  });
});
