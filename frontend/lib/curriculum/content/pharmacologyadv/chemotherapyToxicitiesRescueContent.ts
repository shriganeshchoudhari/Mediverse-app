/**
 * Clinical Pharmacology: Chemotherapeutic Toxicities & Rescue Pharmacotherapy
 * Authoritative medical content derived from DeVita Oncology, Goodman & Gilman's (14th ed.).
 * Mapped to NMC CBME Competencies: PH1.7, PH1.8, MD37.4, SU35.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CHEMOTHERAPY_TOXICITIES_RESCUE_MODULE: PhysiologyLessonModule = {
  id: "pharmacology-adv-chemo-toxicities-rescue",
  unitCode: "PH7.1",
  title: "Chemotherapeutic Toxicities & Rescue: Anthracycline Cardiotoxicity, Cisplatin & MTX Leucovorin",
  competencies: ["PH1.7", "PH1.8", "MD37.4", "SU35.4"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Chemotherapy Toxicities & Targeted Rescue Antidotes

Cancer pharmacotherapy is constrained by dose-limiting organ toxicities; recognizing specific toxicities and administering antidote rescue agents prevents permanent organ damage.

---

## 1. High-Yield Chemotherapeutic Toxicities & Rescue Agents

$$\\begin{array}{lcccc}
\\hline
\\textbf{Chemotherapy Drug} & \\textbf{Mechanism of Action} & \\textbf{Dose-Limiting Toxicity} & \\textbf{Pathophysiology} & \\textbf{Rescue Agent / Antidote} \\\\
\\hline
\\textbf{Doxorubicin / Daunorubicin} & \\text{Topoisomerase II / Intercalation} & \\mathbf{\\text{Dilated Cardiomyopathy / CHF}} & \\text{Iron-dependent lipid peroxidation} & \\mathbf{\\text{Dexrazoxane (Zinecard, iron chelator)}} \\\\
\\textbf{Cisplatin / Carboplatin} & \\text{DNA cross-linking (Pt-adducts)} & \\mathbf{\\text{ATN Nephrotoxicity, Ototoxicity}} & \\text{Proximal tubular apoptosis, cochlear injury} & \\mathbf{\\text{Aggressive Hydration + Amifostine}} \\\\
\\textbf{Cyclophosphamide / Ifosfamide} & \\text{Alkylating nitrogen mustard} & \\mathbf{\\text{Hemorrhagic Cystitis}} & \\mathbf{\\text{Toxic metabolite ACROLEIN in bladder}} & \\mathbf{\\text{Mesna (binds acrolein) + Hydration}} \\\\
\\textbf{Methotrexate (High-Dose)} & \\text{Dihydrofolate Reductase (DHFR)} & \\text{Myelosuppression, Mucositis} & \\text{Tetrahydrofolate depletion} & \\mathbf{\\text{Leucovorin (Folinic acid) Rescue}} \\\\
& & \\text{Acute Kidney Failure} & \\text{Tubular crystallization} & \\mathbf{\\text{Glucarpidase (cleaves MTX)}} \\\\
\\textbf{Bleomycin} & \\text{Free radical DNA strand breaks} & \\mathbf{\\text{Pulmonary Fibrosis}} & \\text{Bleomycin hydrolase deficiency in lung} & \\text{Limit lifetime dose (\\le 400 U); avoid high FiO2} \\\\
\\textbf{Vincristine} & \\text{Microtubule spindle inhibitor} & \\mathbf{\\text{Peripheral Neuropathy, Ileus}} & \\text{Axonal transport disruption} & \\mathbf{\\text{FATAL IF GIVEN INTRATHECALLY!}} \\\\
\\hline
\\end{array}$$

---

## 2. High-Yield Rescue Mechanisms

1. **Leucovorin (Folinic Acid) Rescue for Methotrexate**:
   - High-dose MTX ($>500-1000\\text{ mg/m}^2$) irreversibly inhibits Dihydrofolate Reductase (DHFR), depleting tetrahydrofolate ($N^5,N^{10}$-methylene-THF) required for thymidylate and purine synthesis.
   - **Leucovorin bypasses DHFR**: It is converted directly to tetrahydrofolate without requiring the DHFR enzyme, selectively rescuing healthy non-malignant bone marrow and gastrointestinal epithelial cells from lethal toxicity.
2. **Mesna (Sodium 2-mercaptoethanesulfonate) for Cyclophosphamide**:
   - Hepatic CYP450 activation of cyclophosphamide yields phosphoramide mustard (active antineoplastic) and **Acrolein** (toxic byproduct).
   - Acrolein is excreted into the urinary bladder where it induces severe urothelial necrosis and profuse hemorrhagic cystitis.
   - **Mesna concentrates in urine**: Its sulfhydryl ($-SH$) groups bind and neutralize acrolein into a non-toxic thioether conjugate, completely preventing bladder urothelial injury.
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old male with Ewing sarcoma is receiving high-dose Ifosfamide and Etoposide chemotherapy. On day 2 of treatment, he develops severe dysuria, suprapubic cramping, and gross painless hematuria with passing blood clots. Urinalysis demonstrates packed red blood cells with no bacteria on Gram stain. Cystoscopy confirms diffuse hemorrhagic urothelial ulcerations throughout the bladder mucosal surface.",
      question: "Which of the following toxic metabolites produced by hepatic breakdown of ifosfamide is responsible for this hemorrhagic cystitis, and what agent should have been co-administered as a preventative rescue?",
      options: [
        "Acrolein; Co-administration of intravenous Mesna (sodium 2-mercaptoethanesulfonate) and vigorous hyperhydration",
        "Hydroxyurea; Co-administration of Allopurinol",
        "Superoxide free radicals; Co-administration of Dexrazoxane",
        "Phosphoramide mustard; Co-administration of Leucovorin"
      ],
      correctAnswerIndex: 0,
      explanation: "Hepatic metabolism of oxazaphosphorines (Cyclophosphamide and Ifosfamide) generates Acrolein, a toxic urotoxic byproduct excreted into the urinary bladder that causes direct mucosal necrosis, ulceration, and severe hemorrhagic cystitis. Mesna (sodium 2-mercaptoethanesulfonate) is a protective thiol compound that concentrates in the bladder and binds acrolein via its active sulfhydryl groups, forming a stable, non-toxic conjugate that is safely eliminated. Co-administration of Mesna and aggressive intravenous hydration is standard of care to prevent hemorrhagic cystitis."
    }
  ]
};
