/**
 * Internship Core Clinical Postings: Vector-Borne Diseases & Malaria/Dengue Outbreak Control (NVBDCP)
 * Authoritative tropical medicine content derived from NVBDCP Guidelines, WHO Malaria/Dengue Guidelines.
 * Mapped to NMC CBME Competencies: IN6.2, CM5.2, CM7.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const VECTOR_BORNE_DISEASES_MALARIA_DENGUE_MODULE: PhysiologyLessonModule = {
  id: "int6-vector-borne-diseases-malaria-dengue",
  unitCode: "IN6.2",
  title: "Vector-Borne Diseases: NVBDCP Malaria Protocols (ACT-SP & 14-Day Primaquine Radical Cure) & Dengue Critical Phase Triage",
  competencies: ["IN6.2", "CM5.2", "CM7.2"],
  estimatedMinutes: 150,
  organ3dTarget: "HEMATOLOGIC",
  markdownContent: `
# Vector-Borne Diseases & Outbreak Control: Malaria & Dengue Protocols

Rapid species-specific diagnostic identification, radical anti-hypnozoite cure, and meticulous fluid management during the dengue critical phase prevent severe tropical morbidity and mortality.

---

## 1. National Vector Borne Disease Control Programme (NVBDCP) Malaria Regimens

$$\\begin{array}{lcccc}
\\hline
\\textbf{Malaria Species} & \\textbf{Primary Schizontocidal Therapy} & \\textbf{Radical / Gametocytocidal Therapy} & \\textbf{Safety Considerations} \\\\
\\hline
\\textbf{Plasmodium falciparum} & \\mathbf{\\text{Artemisinin-based Combination (ACT):}} & \\mathbf{\\text{Single Dose Primaquine (} 0.75\\text{ mg/kg)}} & \\text{Gametocytocidal action} \\\\
(\\text{Uncomplicated}) & \\mathbf{\\text{Artesunate + Sulfadoxine-Pyrimethamine}} & \\mathbf{\\text{administered on Day 2}} & \\text{blocks mosquito transmission;} \\\\
& \\mathbf{\\text{(ACT-SP) daily for 3 days}} & & \\text{contraindicated in pregnancy} \\\\
\\textbf{Plasmodium vivax} & \\mathbf{\\text{Chloroquine (} 25\\text{ mg/kg total}} & \\mathbf{\\text{Primaquine (} 0.25\\text{ mg/kg daily}} & \\mathbf{\\text{Anti-hypnozoite radical cure;}} \\\\
(\\text{Uncomplicated}) & \\text{over 3 days: } 10+10+5\\text{ mg/kg)} & \\mathbf{\\text{for 14 FULL DAYS)}} & \\mathbf{\\text{check G6PD status first}} \\\\
\\textbf{Severe Malaria} & \\mathbf{\\text{Intravenous Artesunate: } 2.4\\text{ mg/kg IV}} & \\text{Switch to complete oral ACT course} & \\text{Monitor for hypoglycemia} \\\\
(Pf \\text{ or } Pv) & \\text{at 0, 12, 24 hours, then once daily} & \\text{once patient can tolerate oral intake} & \\text{and acute kidney injury} \\\\
\\hline
\\end{array}$$

---

## 2. Dengue Fever Clinical Staging & Critical Phase Management

$$\\begin{array}{lcccc}
\\hline
\\textbf{Dengue Phase} & \\textbf{Clinical Timing \u0026 Diagnostic Markers} & \\textbf{Pathophysiology} & \\textbf{Mandated Clinical Protocol} \\\\
\\hline
\\textbf{1. Febrile Phase} & \\text{Days 1-3; high fever, myalgia, retro-orbital pain;} & \\text{Viremia; bone marrow} & \\text{Supportive paracetamol (AVOID NSAIDs/aspirin);} \\\\
& \\mathbf{\\text{NS1 Antigen POSITIVE (Days 1-5)}} & \\text{suppression (leukopenia)} & \\text{oral hydration} \\\\
\\textbf{2. Critical Phase} & \\mathbf{\\text{Days 3-7 (around defervescence);}} & \\mathbf{\\text{Plasma leakage into pleural/}} & \\mathbf{\\text{Meticulous IV crystalloid titration}} \\\\
& \\mathbf{\\text{Hematocrit rise } \\ge 20\\% \\text{, thrombocytopenia;}} & \\mathbf{\\text{peritoneal cavities;}} & (5-7 \\rightarrow 3-5 \\rightarrow 2-3\\text{ mL/kg/hr); avoid fluid overload} \\\\
& \\mathbf{\\text{IgM Antibodies POSITIVE}} & \\mathbf{\\text{hypovolemic shock}} & \\\\
\\textbf{3. Recovery Phase} & \\text{Days 7-10; reabsorption of extravasated fluid;} & \\text{Hemodynamic stabilization;} & \\mathbf{\\text{STOP intravenous fluids immediately;}} \\\\
& \\text{\"isles of white in a sea of red\" rash} & \\text{platelet count recovers} & \\text{prevent pulmonary edema} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old male residing in a malaria-endemic district presents with 4 days of tertian fever spikes accompanied by severe rigors, chills, and profuse diaphoresis. A rapid diagnostic test (RDT) and peripheral blood smear confirm Plasmodium vivax monoinfection (trophozoites and Schüffner's dots visible). His G6PD level is verified to be within normal limits.",
      question: "What is the complete therapeutic regimen required to achieve clinical cure and prevent relapses under NVBDCP guidelines?",
      options: [
        "Administer oral Chloroquine (total dose 25 mg/kg base over 3 days: 10 mg/kg on Day 1, 10 mg/kg on Day 2, and 5 mg/kg on Day 3) PLUS oral Primaquine (0.25 mg/kg daily for 14 full days) to eradicate dormant intrahepatic hypnozoites and achieve radical cure",
        "Prescribe 3 days of oral paracetamol alone",
        "Administer a single dose of oral Artesunate without primaquine",
        "Prescribe 1 dose of intramuscular Artemether and discharge"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates the standard radical cure protocol for Plasmodium vivax malaria under National Vector Borne Disease Control Programme (NVBDCP) guidelines: (1) Blood Schizontocide: Chloroquine (25 mg/kg over 3 days) eradicates erythrocytic stage parasites, resolving acute fever; (2) Tissue Hypnozoitocide: Primaquine (0.25 mg/kg daily for 14 days) eliminates dormant hepatic hypnozoites to prevent future clinical relapses; (3) Safety Rule: Normal G6PD status must be ensured prior to a 14-day primaquine course to prevent acute intravascular hemolysis."
    }
  ]
};
