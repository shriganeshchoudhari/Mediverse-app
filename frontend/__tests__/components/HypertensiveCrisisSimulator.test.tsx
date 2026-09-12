import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HypertensiveCrisisSimulator } from '../../components/simulators/HypertensiveCrisisSimulator';

describe('HypertensiveCrisisSimulator Component', () => {
  it('renders the header, title, and initial executive cards', () => {
    render(<HypertensiveCrisisSimulator />);
    expect(
      screen.getByText(/Hypertensive Crisis & IV Antihypertensive Titration Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Current BP & MAP/i)).toBeInTheDocument();
    expect(screen.getByText(/1-Hour MAP Drop/i)).toBeInTheDocument();
    expect(screen.getByText(/Heart Rate & dP\/dt/i)).toBeInTheDocument();
    expect(screen.getByText(/Autoregulation Status/i)).toBeInTheDocument();
  });

  it('switches between interactive workbench tabs', () => {
    render(<HypertensiveCrisisSimulator />);

    // Tab 2: Titration
    const titrationTab = screen.getByRole('button', { name: /2\. IV Antihypertensive Titration/i });
    fireEvent.click(titrationTab);
    expect(screen.getByText(/Parenteral Antihypertensive Titration Console/i)).toBeInTheDocument();
    expect(screen.getByText(/Nicardipine \(Cardene\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Esmolol \(Brevibloc\)/i)).toBeInTheDocument();

    // Tab 3: Autoregulation
    const autoTab = screen.getByRole('button', { name: /3\. Cerebral Autoregulation & Watershed/i });
    fireEvent.click(autoTab);
    expect(screen.getByText(/Cerebral Autoregulation Curve & Rightward Plateau Shift/i)).toBeInTheDocument();
    expect(screen.getByText(/The 20-25% MAP Rule in Hour 1/i)).toBeInTheDocument();

    // Tab 4: Protocols
    const protoTab = screen.getByRole('button', { name: /4\. Condition-Specific Guidelines/i });
    fireEvent.click(protoTab);
    expect(screen.getByText(/Target Organ Damage Clinical Protocols & Target Matrix/i)).toBeInTheDocument();

    // Tab 5: Toxicology
    const toxTab = screen.getByRole('button', { name: /5\. Toxicology & Drug Safety/i });
    fireEvent.click(toxTab);
    expect(screen.getByText(/Toxicology & Critical Care Pharmacovigilance Bench/i)).toBeInTheDocument();
  });

  it('updates target organ damage selection', () => {
    render(<HypertensiveCrisisSimulator />);
    const select = screen.getByLabelText(/Target Organ Damage Phenotype/i);
    fireEvent.change(select, { target: { value: 'flash_pulmonary_edema' } });
    expect(screen.getByText(/Target Goals for Hypertensive Emergency \(FLASH PULMONARY EDEMA\)/i)).toBeInTheDocument();
  });

  it('allows loading clinical presets', () => {
    render(<HypertensiveCrisisSimulator />);
    const encephalopathyBtn = screen.getByRole('button', { name: /Encephalopathy/i });
    fireEvent.click(encephalopathyBtn);
    expect(screen.getByText(/Target Goals for Hypertensive Emergency \(HYPERTENSIVE ENCEPHALOPATHY\)/i)).toBeInTheDocument();
  });

  it('detects and displays toxicology reflex tachycardia alert in aortic dissection when vasodilator is given alone', () => {
    render(<HypertensiveCrisisSimulator />);
    // Ensure on aortic dissection
    const select = screen.getByLabelText(/Target Organ Damage Phenotype/i);
    fireEvent.change(select, { target: { value: 'aortic_dissection' } });

    // Navigate to Titration tab and dial up Nicardipine
    const titrationTab = screen.getByRole('button', { name: /2\. IV Antihypertensive Titration/i });
    fireEvent.click(titrationTab);

    const sliders = screen.getAllByRole('slider');
    // First slider on titration tab is Nicardipine rate
    fireEvent.change(sliders[0], { target: { value: '10' } });

    // Navigate to Toxicology tab
    const toxTab = screen.getByRole('button', { name: /5\. Toxicology & Drug Safety/i });
    fireEvent.click(toxTab);

    expect(screen.getByText(/LETHAL DISSECTION PITFALL: Vasodilator therapy initiated without concurrent beta-blockade!/i)).toBeInTheDocument();
  });

  it('toggles risk modifier checkboxes correctly', () => {
    render(<HypertensiveCrisisSimulator />);
    const asthmaChk = screen.getByLabelText(/Asthma \/ Severe COPD/i);
    expect(asthmaChk).not.toBeChecked();
    fireEvent.click(asthmaChk);
    expect(asthmaChk).toBeChecked();
  });
});
