import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InpatientEmrWorkstation from '../../components/emr/InpatientEmrWorkstation';

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons: Record<string, React.FC<any>> = {};
  return new Proxy(icons, {
    get: (target, prop: string) => {
      if (!target[prop]) {
        target[prop] = (props: any) => <span data-testid={`icon-${prop}`} {...props} />;
      }
      return target[prop];
    },
  });
});

// Mock SoapNoteWriter
jest.mock('../../components/emr/SoapNoteWriter', () => {
  return function MockSoapNoteWriter(props: any) {
    return <div data-testid="mock-soap-note-writer">Mock SOAP Writer for {props.patientId}</div>;
  };
});

describe('InpatientEmrWorkstation Component Tests', () => {
  it('renders initial patient banner with demographics and critical allergies', () => {
    render(<InpatientEmrWorkstation initialPatientId="pt-adhf-001" />);

    // Header demographics
    expect(screen.getByRole('heading', { level: 1, name: /Vance, Marcus/i })).toBeInTheDocument();
    expect(screen.getByText(/MRN-448102/i)).toBeInTheDocument();
    expect(screen.getAllByText(/FULL CODE/i)[0]).toBeInTheDocument();

    // Allergy strip
    expect(screen.getByText(/Lisinopril/i)).toBeInTheDocument();
    expect(screen.getByText(/ANGIOEDEMA/i)).toBeInTheDocument();
  });

  it('allows switching patients from the inpatient census dropdown', () => {
    render(<InpatientEmrWorkstation initialPatientId="pt-adhf-001" />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'pt-sepsis-002' } });

    expect(screen.getByRole('heading', { level: 1, name: /Jenkins, Sarah/i })).toBeInTheDocument();
    expect(screen.getByText(/MRN-882941/i)).toBeInTheDocument();
    expect(screen.getByText(/CONTACT PRECAUTIONS/i)).toBeInTheDocument();
  });

  it('navigates through core hospital EMR tabs', () => {
    render(<InpatientEmrWorkstation initialPatientId="pt-adhf-001" />);

    // Switch to Vitals Flowsheet tab
    const flowsheetTab = screen.getByRole('button', { name: /Vitals & Flowsheet/i });
    fireEvent.click(flowsheetTab);
    expect(screen.getByText(/Inpatient Vitals & Neurologic Flowsheet/i)).toBeInTheDocument();

    // Switch to I&O tab
    const ioTab = screen.getByRole('button', { name: /Intake & Output/i });
    fireEvent.click(ioTab);
    expect(screen.getByText(/Inpatient Fluid Balance & Renal Output/i)).toBeInTheDocument();
    expect(screen.getByText(/Cumulative Intake/i)).toBeInTheDocument();

    // Switch to eMAR tab
    const emarTab = screen.getByRole('button', { name: /eMAR Medication Admin/i });
    fireEvent.click(emarTab);
    expect(screen.getByText(/Electronic Medication Administration Record/i)).toBeInTheDocument();
    expect(screen.getByText(/Furosemide/i)).toBeInTheDocument();

    // Switch to Labs & Imaging tab
    const labsTab = screen.getByRole('button', { name: /Labs & Imaging/i });
    fireEvent.click(labsTab);
    expect(screen.getByText(/Cumulative Inpatient Laboratory Panels/i)).toBeInTheDocument();
    expect(screen.getByText(/NT-proBNP/i)).toBeInTheDocument();

    // Switch to Notes tab
    const notesTab = screen.getByRole('button', { name: /Clinical Documentation & SOAP/i });
    fireEvent.click(notesTab);
    expect(screen.getByText(/Multidisciplinary Inpatient Documentation/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-soap-note-writer')).toBeInTheDocument();
  });

  it('triggers CDS Hard Stop when attempting to order an allergic medication', () => {
    render(<InpatientEmrWorkstation initialPatientId="pt-adhf-001" />);

    // Go to CPOE tab
    const cpoeTab = screen.getByRole('button', { name: /CPOE & Order Sets/i });
    fireEvent.click(cpoeTab);

    // Fill in order form with Lisinopril (patient Marcus Vance has severe angioedema allergy to Lisinopril)
    const drugInput = screen.getByPlaceholderText(/Lisinopril, Cefepime/i);
    const doseInput = screen.getByPlaceholderText(/20 mg, 1 g/i);

    fireEvent.change(drugInput, { target: { value: 'Lisinopril' } });
    fireEvent.change(doseInput, { target: { value: '20 mg' } });

    const submitBtn = screen.getByRole('button', { name: /Sign & Submit Order/i });
    fireEvent.click(submitBtn);

    // Hard Stop modal should pop up
    expect(screen.getByText(/CRITICAL CDS: ACE Inhibitor Angioedema Contraindication/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel Order \(Hard Stop\)/i })).toBeInTheDocument();
  });

  it('applies ADHF order set and shows success notification', () => {
    render(<InpatientEmrWorkstation initialPatientId="pt-adhf-001" />);

    const cpoeTab = screen.getByRole('button', { name: /CPOE & Order Sets/i });
    fireEvent.click(cpoeTab);

    const applyAdhfBtn = screen.getByRole('button', { name: /Apply ADHF Order Set/i });
    fireEvent.click(applyAdhfBtn);

    expect(screen.getByText(/Applied ADHF Decongestion Order Set/i)).toBeInTheDocument();
  });
});
