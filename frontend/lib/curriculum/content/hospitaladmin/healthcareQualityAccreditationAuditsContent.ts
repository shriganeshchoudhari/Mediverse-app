/**
 * Hospital Administration: Healthcare Quality Frameworks, Accreditation & Clinical Audits
 * Authoritative medical content derived from NABH 5th Edition Standards, JCI, Donabedian Healthcare Quality Model.
 * Mapped to NMC CBME Competencies: HA5.1, HA5.2, HA6.1, HA6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HEALTHCARE_QUALITY_ACCREDITATION_AUDITS_MODULE: PhysiologyLessonModule = {
  id: "hospital-admin-healthcare-quality-accreditation-audits",
  unitCode: "HA5.1",
  title: "Healthcare Quality Frameworks (Donabedian), NABH/JCI Accreditation, Clinical Audits & Bed Metrics",
  competencies: ["HA5.1", "HA5.2", "HA6.1", "HA6.2"],
  estimatedMinutes: 150,
  organ3dTarget: "COMMUNITY",
  markdownContent: `
# Healthcare Quality Frameworks, Accreditation, Clinical Audits & Hospital Metrics

Healthcare quality is defined by the Institute of Medicine (IOM) as care that is Safe, Timely, Effective, Efficient, Equitable, and Patient-Centered (STEEEP).

---

## 1. The Donabedian Triad of Healthcare Quality

$$\\begin{array}{lll}
\\hline
\\textbf{Dimension} & \\textbf{Definition \u0026 Operational Scope} & \\textbf{Practical Healthcare Examples} \\\\
\\hline
\\textbf{Structure} & \\text{The physical, organizational, and material} & \\text{• ICU Nurse-to-Patient ratio (1:1 for ventilated patients, 1:2 for stepdown)} \\\\
& \\text{attributes of the healthcare facility and its staff.} & \\text{• Availability of functional 1.5T/3T MRI, 24/7 blood bank, oxygen supply} \\\\
& & \\text{• Credentials and licensing of medical and nursing personnel} \\\\
\\hline
\\textbf{Process} & \\text{What is actually done in giving and receiving} & \\text{• Door-to-Needle time in STEMI (}\u003c30\\text{ min for IV Thrombolysis)} \\\\
& \\text{care; adherence to clinical practice guidelines.} & \\text{• Door-to-Balloon time in primary PCI (}\u003c90\\text{ min)} \\\\
& & \\text{• Proportion of diabetic inpatients receiving HbA1c testing} \\\\
& & \\text{• Surgical Safety Checklist completion rate before skin incision} \\\\
\\hline
\\textbf{Outcome} & \\text{The end results of healthcare intervention on the} & \\text{• 30-day all-cause mortality rate post-acute myocardial infarction} \\\\
& \\text{health status and recovery of the patient.} & \\text{• Hospital-acquired infection (HAI) rates per 1,000 device-days} \\\\
& & \\text{• 30-day unplanned hospital readmission rate} \\\\
& & \\text{• Patient satisfaction score (HCAHPS)} \\\\
\\hline
\\end{array}$$

---

## 2. Accreditation Systems: NABH vs JCI Standards

- **NABH (National Accreditation Board for Hospitals & Healthcare Providers, 5th Edition)**:
  - Apex national healthcare accreditation body in India (under Quality Council of India - QCI).
  - Divided into 10 Chapters:
    - *Patient-Centered Chapters (5)*: Access, Assessment and Continuity of Care (AAC); Care of Patients (COP); Management of Medication (MOM); Patient Rights and Education (PRE); Hospital Infection Control (HIC).
    - *Organization-Centered Chapters (5)*: Continuous Quality Improvement (CQI); Responsibilities of Management (ROM); Facility Management and Safety (FMS); Human Resource Management (HRM); Information Management System (IMS).
  - Emphasizes statutory legal compliance, antibiotic stewardship, medication safety, and patient rights.
- **JCI (Joint Commission International)**:
  - Gold-standard global international healthcare accreditation body based in the USA.
  - Centered upon the **International Patient Safety Goals (IPSG 1-6)**, medication tracer methodology, and patient-tracer clinical pathways.

---

## 3. The 5-Stage Clinical Audit Closed Loop

$$\\text{Stage 1: Identify Topic \u0026 Define Standards} \\longrightarrow \\text{Stage 2: Measure Baseline Practice} \\longrightarrow \\text{Stage 3: Compare Data with Standards} \\longrightarrow \\text{Stage 4: Implement Change \u0026 Action Plan} \\longrightarrow \\text{Stage 5: Re-Audit (Close the Loop)}$$

1. **Stage 1 (Define Standards)**: Establish clear, evidence-based, measurable criteria and target performance levels (e.g. "100% of surgical patients receive prophylactic antibiotics within 60 min of incision").
2. **Stage 2 (Measure Practice)**: Collect retrospective or prospective clinical data from case records.
3. **Stage 3 (Compare with Standards)**: Analyze the gap between actual performance and standard.
4. **Stage 4 (Implement Change)**: Educate staff, modify electronic medical records (EMR) order sets, or introduce checklist reminders.
5. **Stage 5 (Re-Audit)**: Repeat the audit on a new sample to confirm sustained improvement (**Closing the Loop**).

---

## 4. Key Hospital Performance & Utilization Metrics

1. **Bed Occupancy Rate (BOR)**:
   $$\\text{BOR} = \\frac{\\text{Total Inpatient Bed-Days Occupied}}{\\text{Total Available Bed-Days in Period}} \\times 100\\%$$
   - *Optimal Benchmark*: **$75\\% - 85\\%$**. (BOR $>90\\%$ indicates severe bed crunch and increases HAI transmission; BOR $<70\\%$ indicates underutilization).
2. **Average Length of Stay (ALOS)**:
   $$\\text{ALOS} = \\frac{\\text{Total Days of Care Provided to Discharged Patients}}{\\text{Total Number of Discharges + Deaths in Period}}$$
   - *Optimal Benchmark*: **$4.0 - 5.5\\text{ days}$** for acute care tertiary hospitals.
3. **Bed Turnover Interval (BTI)**:
   $$\\text{BTI} = \\frac{\\text{Available Bed Days} - \\text{Occupied Bed Days}}{\\text{Total Discharges + Deaths}}$$
   - Average number of days a bed remains vacant between one patient discharge and the next patient admission. *Optimal benchmark*: **$1.0 - 2.0\\text{ days}$**.
4. **Net Death Rate (NDR)**:
   $$\\text{NDR} = \\frac{\\text{Hospital Deaths occurring } \u003e48\\text{ hours after admission}}{\\text{Total Discharges + Deaths occurring } \u003e48\\text{ hours}} \\times 100\\%$$
   - Excludes terminal moribund patients dying within 48h of arrival. *Target*: **$<2.0\\%$**.
`,
  clinicalVignettes: [
    {
      scenario: "A 500-bed multispecialty hospital reviews its annual inpatient performance statistics. Over a 365-day calendar year, the hospital recorded a total of 155,125 occupied bed-days, with 31,025 total inpatient discharges and deaths. The hospital quality committee evaluates whether the facility is operating within optimal efficiency and capacity thresholds.",
      question: "Which of the following values correctly represents the hospital's Bed Occupancy Rate (BOR) and Average Length of Stay (ALOS)?",
      options: [
        "Bed Occupancy Rate (BOR) = 85.0%; Average Length of Stay (ALOS) = 5.0 days",
        "Bed Occupancy Rate (BOR) = 75.0%; Average Length of Stay (ALOS) = 6.5 days",
        "Bed Occupancy Rate (BOR) = 92.5%; Average Length of Stay (ALOS) = 3.5 days",
        "Bed Occupancy Rate (BOR) = 68.0%; Average Length of Stay (ALOS) = 4.0 days"
      ],
      correctAnswerIndex: 0,
      explanation: "Total available bed-days in the year = 500 beds * 365 days = 182,500 available bed-days. BOR = (Total Occupied Bed-Days / Available Bed-Days) * 100% = (155,125 / 182,500) * 100% = 85.0%, which is at the upper limit of the optimal international target range (75-85%). Average Length of Stay (ALOS) = Total Occupied Inpatient Days / Total Discharges and Deaths = 155,125 / 31,025 = 5.0 days, which is within the standard acute care benchmark of 4-5.5 days."
    }
  ]
};
