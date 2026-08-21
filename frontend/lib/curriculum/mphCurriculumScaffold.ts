export interface MPHLesson {
  id: string;
  title: string;
  competencyCode: string;
  year: 1 | 2;
  hasSimulation: boolean;
  description: string;
}

export interface MPHSubject {
  id: string;
  name: string;
  code: string;
  year: 1 | 2;
  creditHours: number;
  description: string;
  lessons: MPHLesson[];
}

export const MPH_CURRICULUM: MPHSubject[] = [
  {
    id: "sub-mph-01",
    name: "Principles of Epidemiology",
    code: "PUB-EPI",
    year: 1,
    creditHours: 4,
    description: "Core principles of studying disease distribution and determinants in populations.",
    lessons: [
      { id: "les-mph-epi-01", title: "Study Designs in Epidemiology", competencyCode: "MPH-EPI-01", year: 1, hasSimulation: false, description: "Overview of observational and experimental study designs." },
      { id: "les-mph-epi-02", title: "Outbreak Investigation", competencyCode: "MPH-EPI-02", year: 1, hasSimulation: true, description: "Steps in identifying and controlling disease outbreaks." },
      { id: "les-mph-epi-03", title: "Epidemiological Surveillance", competencyCode: "MPH-EPI-03", year: 1, hasSimulation: false, description: "Methods for systematic collection and analysis of health data." }
    ]
  },
  {
    id: "sub-mph-02",
    name: "Biostatistics & Health Data Science",
    code: "PUB-BIO",
    year: 1,
    creditHours: 4,
    description: "Statistical methods applied to health sciences and data analysis.",
    lessons: [
      { id: "les-mph-bio-01", title: "Descriptive Statistics", competencyCode: "MPH-BIO-01", year: 1, hasSimulation: false, description: "Summarizing data using measures of central tendency and dispersion." },
      { id: "les-mph-bio-02", title: "Inferential Statistics", competencyCode: "MPH-BIO-02", year: 1, hasSimulation: false, description: "Hypothesis testing, confidence intervals, and p-values." },
      { id: "les-mph-bio-03", title: "Health Informatics", competencyCode: "MPH-BIO-03", year: 1, hasSimulation: true, description: "Use of information systems and technology in public health." }
    ]
  },
  {
    id: "sub-mph-03",
    name: "Health Systems & Ayushman Bharat",
    code: "PUB-HSA",
    year: 1,
    creditHours: 3,
    description: "Overview of health systems with a focus on Indian health schemes.",
    lessons: [
      { id: "les-mph-hsa-01", title: "Health System Frameworks", competencyCode: "MPH-HSA-01", year: 1, hasSimulation: false, description: "WHO building blocks of a health system." },
      { id: "les-mph-hsa-02", title: "Ayushman Bharat PM-JAY", competencyCode: "MPH-HSA-02", year: 1, hasSimulation: false, description: "Implementation and impact of the national health protection scheme." },
      { id: "les-mph-hsa-03", title: "Primary Healthcare", competencyCode: "MPH-HSA-03", year: 1, hasSimulation: true, description: "Role of Health and Wellness Centers in universal health coverage." }
    ]
  },
  {
    id: "sub-mph-04",
    name: "Health Economics & Decision Analysis",
    code: "PUB-ECO",
    year: 2,
    creditHours: 3,
    description: "Economic evaluation of healthcare programs and policies.",
    lessons: [
      { id: "les-mph-eco-01", title: "Cost-Effectiveness Analysis", competencyCode: "MPH-ECO-01", year: 2, hasSimulation: false, description: "Comparing costs and health outcomes of alternative interventions." },
      { id: "les-mph-eco-02", title: "Healthcare Financing", competencyCode: "MPH-ECO-02", year: 2, hasSimulation: false, description: "Methods of mobilizing and allocating resources for health." },
      { id: "les-mph-eco-03", title: "Economic Evaluation Models", competencyCode: "MPH-ECO-03", year: 2, hasSimulation: true, description: "Decision trees and Markov models in health economics." }
    ]
  },
  {
    id: "sub-mph-05",
    name: "Environmental & Occupational Health",
    code: "PUB-ENV",
    year: 2,
    creditHours: 3,
    description: "Impact of environmental factors and work conditions on health.",
    lessons: [
      { id: "les-mph-env-01", title: "Air and Water Quality", competencyCode: "MPH-ENV-01", year: 2, hasSimulation: false, description: "Health effects of environmental pollution." },
      { id: "les-mph-env-02", title: "Occupational Hazards", competencyCode: "MPH-ENV-02", year: 2, hasSimulation: true, description: "Identifying and mitigating risks in the workplace." },
      { id: "les-mph-env-03", title: "Climate Change and Health", competencyCode: "MPH-ENV-03", year: 2, hasSimulation: false, description: "Public health impacts of global climate change." }
    ]
  },
  {
    id: "sub-mph-06",
    name: "Global Health Governance & Disaster Management",
    code: "PUB-GLO",
    year: 2,
    creditHours: 3,
    description: "International health policies and emergency response strategies.",
    lessons: [
      { id: "les-mph-glo-01", title: "Global Health Organizations", competencyCode: "MPH-GLO-01", year: 2, hasSimulation: false, description: "Role of WHO, UNICEF, and other international bodies." },
      { id: "les-mph-glo-02", title: "Disaster Preparedness", competencyCode: "MPH-GLO-02", year: 2, hasSimulation: true, description: "Planning and preparing for natural and man-made disasters." },
      { id: "les-mph-glo-03", title: "Humanitarian Response", competencyCode: "MPH-GLO-03", year: 2, hasSimulation: false, description: "Delivering healthcare in crisis and conflict zones." }
    ]
  }
];

export const MPH_METADATA = {
  programName: 'Master of Public Health',
  regulatoryBody: 'UGC / NMC recognized',
  duration: '2 years'
};

export function getMPHSubjectById(id: string): MPHSubject | undefined {
  return MPH_CURRICULUM.find(subject => subject.id === id);
}
