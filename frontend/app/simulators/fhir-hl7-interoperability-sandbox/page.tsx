import { Metadata } from 'next';
import FhirInteroperabilitySimulator from '@/components/simulators/FhirInteroperabilitySimulator';

export const metadata: Metadata = {
  title: 'FHIR R4 & HL7 Interoperability Sandbox | Mediverse',
  description:
    'Clinical health informatics interoperability sandbox. Generate and inspect HL7 FHIR Release 4 JSON Bundles (Patient, Observation, Condition, MedicationRequest), simulate SMART on FHIR OAuth 2.0 authorization, bridge legacy HL7 v2 pipe-delimited messages, and query LOINC / SNOMED CT / RxNorm clinical ontologies.',
  keywords: [
    'FHIR R4',
    'HL7',
    'Interoperability',
    'SMART on FHIR',
    'Health Informatics',
    'EHR Integration',
    'LOINC',
    'SNOMED CT',
    'RxNorm',
    'JSON Bundle'
  ]
};


export const dynamic = 'force-static';
export default function FhirInteroperabilityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <FhirInteroperabilitySimulator />
    </div>
  );
}
