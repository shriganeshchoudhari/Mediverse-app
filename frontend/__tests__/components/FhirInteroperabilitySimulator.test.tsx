import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FhirInteroperabilitySimulator from '@/components/simulators/FhirInteroperabilitySimulator';

describe('FhirInteroperabilitySimulator Component', () => {
  it('1. renders hero header and main title', () => {
    render(<FhirInteroperabilitySimulator />);
    expect(
      screen.getByText(/FHIR R4 & HL7 Interoperability Gateway & EHR Sandbox/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Track C1 • Health Informatics & Interoperability/i)).toBeInTheDocument();
  });

  it('2. allows switching clinical presets', () => {
    render(<FhirInteroperabilitySimulator />);
    const dmButton = screen.getByText(/Eleanor Chen/i);
    fireEvent.click(dmButton);
    expect(screen.getByText(/HbA1c 8.9%/i)).toBeInTheDocument();
  });

  it('3. renders sub-tabs and switches to FHIR R4 JSON Bundle explorer', () => {
    render(<FhirInteroperabilitySimulator />);
    const bundleTab = screen.getByRole('button', { name: /FHIR R4 JSON Bundle/i });
    fireEvent.click(bundleTab);
    expect(screen.getByText(/Copy Full Bundle/i)).toBeInTheDocument();
  });

  it('4. switches to SMART on FHIR OAuth 2.0 tab and verifies token generation', () => {
    render(<FhirInteroperabilitySimulator />);
    const oauthTab = screen.getByRole('button', { name: /SMART on FHIR OAuth 2.0/i });
    fireEvent.click(oauthTab);
    expect(screen.getByText(/OAuth 2.0 \/ OIDC Launch Context/i)).toBeInTheDocument();

    const generateBtn = screen.getByText(/Simulate SMART App Launch Token Exchange/i);
    fireEvent.click(generateBtn);
    expect(screen.getAllByText(/Bearer/i).length).toBeGreaterThanOrEqual(1);
  });

  it('5. switches to HL7 v2.x to FHIR Transformer and displays parsed segments', () => {
    render(<FhirInteroperabilitySimulator />);
    const hl7Tab = screen.getByRole('button', { name: /HL7 v2.x to FHIR Transformer/i });
    fireEvent.click(hl7Tab);
    expect(screen.getByText(/Legacy HL7 v2.x Message Feeder/i)).toBeInTheDocument();
    expect(screen.getByText(/Transformed FHIR R4 Bundle/i)).toBeInTheDocument();
  });
});
