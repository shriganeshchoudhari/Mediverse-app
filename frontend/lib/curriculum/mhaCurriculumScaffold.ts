export interface MHASubject {
  id: string;
  name: string;
  code: string;
  year: 1 | 2;
  creditHours: number;
  description: string;
  lessons: Array<{
    id: string;
    title: string;
    code: string;
    year: 1 | 2;
    description: string;
  }>;
}

export const MHA_CURRICULUM: MHASubject[] = [
  {
    id: "sub-mha-01",
    name: "Hospital Planning & Design",
    code: "MHA-PLN",
    year: 1,
    creditHours: 4,
    description: "Principles of designing healthcare facilities and infrastructure.",
    lessons: [
      { id: "les-mha-pln-01", title: "Site Selection and Zoning", code: "MHA-PLN-01", year: 1, description: "Evaluating locations and spatial requirements for hospitals." },
      { id: "les-mha-pln-02", title: "Facility Layouts", code: "MHA-PLN-02", year: 1, description: "Designing patient wards, OTs, and outpatient departments." },
      { id: "les-mha-pln-03", title: "Safety and Compliance", code: "MHA-PLN-03", year: 1, description: "Fire safety, building codes, and accessibility standards." }
    ]
  },
  {
    id: "sub-mha-02",
    name: "Healthcare Financial Management",
    code: "MHA-FIN",
    year: 1,
    creditHours: 4,
    description: "Financial planning, budgeting, and resource allocation in healthcare.",
    lessons: [
      { id: "les-mha-fin-01", title: "Hospital Budgeting", code: "MHA-FIN-01", year: 1, description: "Capital and operational budgeting processes." },
      { id: "les-mha-fin-02", title: "Revenue Cycle Management", code: "MHA-FIN-02", year: 1, description: "Billing, coding, and insurance claims processing." },
      { id: "les-mha-fin-03", title: "Cost Analysis", code: "MHA-FIN-03", year: 1, description: "Determining the cost of healthcare services and pricing strategies." }
    ]
  },
  {
    id: "sub-mha-03",
    name: "Hospital Operations & Logistics",
    code: "MHA-OPS",
    year: 1,
    creditHours: 3,
    description: "Managing daily operations, supply chain, and support services.",
    lessons: [
      { id: "les-mha-ops-01", title: "Supply Chain Management", code: "MHA-OPS-01", year: 1, description: "Procurement and inventory management of medical supplies." },
      { id: "les-mha-ops-02", title: "Patient Flow Optimization", code: "MHA-OPS-02", year: 1, description: "Reducing wait times and improving patient throughput." },
      { id: "les-mha-ops-03", title: "Support Services Management", code: "MHA-OPS-03", year: 1, description: "Managing dietary, laundry, and housekeeping services." }
    ]
  },
  {
    id: "sub-mha-04",
    name: "NABH Quality & Clinical Governance",
    code: "MHA-QAL",
    year: 2,
    creditHours: 3,
    description: "Quality assurance, patient safety, and accreditation standards.",
    lessons: [
      { id: "les-mha-qal-01", title: "NABH Standards", code: "MHA-QAL-01", year: 2, description: "Understanding and implementing National Accreditation Board for Hospitals guidelines." },
      { id: "les-mha-qal-02", title: "Patient Safety Goals", code: "MHA-QAL-02", year: 2, description: "Strategies to prevent medical errors and adverse events." },
      { id: "les-mha-qal-03", title: "Continuous Quality Improvement", code: "MHA-QAL-03", year: 2, description: "Tools and methodologies for process improvement (e.g., Lean, Six Sigma)." }
    ]
  },
  {
    id: "sub-mha-05",
    name: "Healthcare Information Systems",
    code: "MHA-HIS",
    year: 2,
    creditHours: 3,
    description: "Implementation and management of health IT and electronic records.",
    lessons: [
      { id: "les-mha-his-01", title: "Electronic Health Records (EHR)", code: "MHA-HIS-01", year: 2, description: "Adoption, interoperability, and data security." },
      { id: "les-mha-his-02", title: "Hospital Management Information Systems", code: "MHA-HIS-02", year: 2, description: "Integrated software solutions for hospital administration." },
      { id: "les-mha-his-03", title: "Data Analytics in Healthcare", code: "MHA-HIS-03", year: 2, description: "Using data to drive clinical and operational decisions." }
    ]
  },
  {
    id: "sub-mha-06",
    name: "Hospital HR & Healthcare Law",
    code: "MHA-LAW",
    year: 2,
    creditHours: 3,
    description: "Human resource management and legal/ethical issues in healthcare.",
    lessons: [
      { id: "les-mha-law-01", title: "Healthcare Staffing", code: "MHA-LAW-01", year: 2, description: "Recruitment, retention, and performance appraisal of medical staff." },
      { id: "les-mha-law-02", title: "Medical Ethics and Law", code: "MHA-LAW-02", year: 2, description: "Consent, confidentiality, and medical negligence." },
      { id: "les-mha-law-03", title: "Labor Laws in Healthcare", code: "MHA-LAW-03", year: 2, description: "Regulations governing workplace conditions and employee rights." }
    ]
  }
];

export const MHA_METADATA = {
  programName: 'Master of Hospital Administration',
  regulatoryBody: 'UGC recognized',
  duration: '2 years'
};
