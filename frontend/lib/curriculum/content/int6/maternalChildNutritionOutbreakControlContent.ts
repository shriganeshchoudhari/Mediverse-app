/**
 * Internship Core Clinical Postings: Maternal-Child Nutrition, Immunization & Epidemic Outbreak Investigation
 * Authoritative public health content derived from UIP National Schedule, WHO Outbreak Response, ICDS POSHAN.
 * Mapped to NMC CBME Competencies: IN6.4, CM5.4, CM10.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MATERNAL_CHILD_NUTRITION_OUTBREAK_CONTROL_MODULE: PhysiologyLessonModule = {
  id: "int6-maternal-child-nutrition-outbreak-control",
  unitCode: "IN6.4",
  title: "Maternal-Child Nutrition, Universal Immunization Programme (UIP) & 10-Step Epidemic Outbreak Investigation",
  competencies: ["IN6.4", "CM5.4", "CM10.4"],
  estimatedMinutes: 150,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Maternal-Child Health, Immunization & Outbreak Investigation

Systematic immunization schedules, nutritional anthropometric screening (SAM/MAM), and the 10-step epidemiological outbreak investigation framework safeguard community health.

---

## 1. Universal Immunization Programme (UIP) Milestone Schedule

$$\\begin{array}{lcccc}
\\hline
\\textbf{Age Benchmark} & \\textbf{Vaccines Administered} & \\textbf{Dose / Route / Site} \\\\
\\hline
\\textbf{At Birth} & \\mathbf{\\text{BCG + OPV-0 + Hepatitis B Birth Dose}} & \\text{BCG: } 0.1\\text{ mL ID (left deltoid); OPV: 2 drops PO;} \\\\
& & \\text{HepB: } 0.5\\text{ mL IM (anterolateral thigh } \\le 24\\text{h)} \\\\
\\textbf{6, 10, 14 Weeks} & \\mathbf{\\text{Pentavalent (DPT-HepB-Hib) +}} & \\text{Penta: } 0.5\\text{ mL IM; Rota: 5 drops PO;} \\\\
& \\mathbf{\\text{Rotavirus + fIPV + PCV}} & \\text{fIPV (at 6, 14w): } 0.1\\text{ mL ID (right deltoid)} \\\\
\\textbf{9-12 Months} & \\mathbf{\\text{MR-1 + JE-1 + PCV Booster + Vit A}} & \\text{MR-1: } 0.5\\text{ mL SC (right upper arm); Vit A: } 100{,}000\\text{ IU PO} \\\\
\\textbf{16-24 Months} & \\mathbf{\\text{MR-2 + JE-2 + DPT Booster-1 + OPV}} & \\text{DPT-B: } 0.5\\text{ mL IM; Vit A: } 200{,}000\\text{ IU PO (every 6m to 5y)} \\\\
\\hline
\\end{array}$$

---

## 2. Severe Acute Malnutrition (SAM) Diagnostic Criteria & NRC Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Criterion} & \\textbf{Threshold for SAM} & \\textbf{Management Protocol} \\\\
\\hline
\\textbf{Mid-Upper Arm Circumference} & \\mathbf{\\text{MUAC } < 11.5\\text{ cm}} & \\text{Admit to Nutrition Rehabilitation} \\\\
\\textbf{Weight-for-Height Z-Score} & \\mathbf{\\text{WHZ } < -3\\text{ SD (WHO Growth Standards)}} & \\text{Centre (NRC); F-75 initial starter formula} \\\\
\\textbf{Bilateral Pitting Edema} & \\mathbf{\\text{Present (Kwashiorkor nutritional edema)}} & (100\\text{ kcal/kg/d}) \\rightarrow \\text{F-100 catch-up formula} \\\\
& & + \\text{ Ready-to-Use Therapeutic Food (RUTF)} \\\\
\\hline
\\end{array}$$

---

## 3. The 10-Step Outbreak Investigation Framework

$$\\begin{array}{lcccc}
\\hline
\\textbf{Step Number} & \\textbf{Epidemiological Action} & \\textbf{Core Methodological Tool} \\\\
\\hline
\\textbf{1. Verify Outbreak} & \\text{Confirm observed cases exceed baseline expected frequency} & \\text{Local surveillance baseline comparison} \\\\
\\textbf{2. Verify Diagnosis} & \\text{Validate clinical, microbiological, and serological findings} & \\text{Standard reference laboratory testing} \\\\
\\textbf{3. Case Definition} & \\text{Establish standard criteria: Confirmed, Probable, Suspect} & \\text{Person, Place, Time parameters} \\\\
\\textbf{4. Descriptive Epi} & \\mathbf{\\text{Characterize outbreak by Time, Place, and Person}} & \\mathbf{\\text{Epidemic Curve (Epi-Curve) + Spot Map}} \\\\
\\textbf{5. Hypotheses} & \\text{Formulate source, vehicle, transmission route hypotheses} & \\text{Clinical interviews and risk factor profiling} \\\\
\\textbf{6. Analytical Study} & \\mathbf{\\text{Test hypotheses using analytical epidemiological studies}} & \\mathbf{\\text{Case-Control Study (Odds Ratio) or Cohort (RR)}} \\\\
\\textbf{7. Refine / Special} & \\text{Conduct environmental sampling, vector surveys, trace-backs} & \\text{Water quality testing, food source tracing} \\\\
\\textbf{8. Control Measures} & \\mathbf{\\text{Implement control interventions immediately}} & \\mathbf{\\text{Source isolation, chlorination, vaccination}} \\\\
\\textbf{9. Communicate} & \\text{Disseminate findings, health education, administrative reports} & \\text{Community press releases and bulletins} \\\\
\\textbf{10. Surveillance} & \\text{Maintain active prospective surveillance to confirm termination} & \\text{Active daily sentinel case reporting} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "During an acute gastroenteritis outbreak in a rural village, 48 residents develop severe watery diarrhea and vomiting within 24 hours of attending a community festival. A spot map demonstrates clustering around a communal shallow well, and an epidemic curve shows a sharp unimodal peak consistent with a point-source common vehicle outbreak. A case-control study reveals an Odds Ratio of 8.4 (95% CI: 3.2-22.1) for drinking unboiled well water compared to bottled water.",
      question: "Which type of epidemic curve is characteristic of this outbreak, and what are the immediate control measures indicated under public health protocols?",
      options: [
        "Point-Source Common Vehicle Epidemic (steep upslope, gradual downslope with all cases occurring within a single incubation period); immediate control measures include super-chlorination of the village well (target residual chlorine 0.5 mg/L), distribution of chlorine tablets/halogen tablets to households, active case finding, distribution of oral rehydration salts (ORS), and health education on boiling water",
        "Propagated person-to-person epidemic; prescribe lifelong antibiotics to all village residents",
        "Continuous common source outbreak; no environmental intervention is required",
        "Secular cyclic variation; wait for natural resolution without water disinfection"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates a classic 10-step outbreak investigation of a water-borne enteric epidemic: (1) Epi-Curve Classification: A rapid sharp rise with a clustering of cases within one incubation period indicates a Point-Source Common Vehicle Epidemic; (2) Analytical Confirmation: The elevated Odds Ratio (8.4) implicates the contaminated well; (3) Immediate Control: Public health intervention requires immediate source disinfection (super-chlorination of the well), provision of safe drinking water / boiling instructions, household halogen tablets, ORS distribution for dehydration management, and ongoing active surveillance."
    }
  ]
};
