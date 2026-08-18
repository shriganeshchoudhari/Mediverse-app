/**
 * Rheumatology: Systemic Sclerosis (Scleroderma), Scleroderma Renal Crisis & Raynaud
 * Authoritative medical content derived from Kelley and Firestein's Textbook of Rheumatology (11th ed.), Robbins & Cotran.
 * Mapped to NMC CBME Competencies: IM1.5, IM1.6, PA31.1, PA31.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SYSTEMIC_SCLEROSIS_RENAL_CRISIS_MODULE: PhysiologyLessonModule = {
  id: "rheumatology-adv-systemic-sclerosis-renal-crisis",
  unitCode: "RH5.1",
  title: "Systemic Sclerosis: Limited (CREST) vs Diffuse Cutaneous, Scleroderma Renal Crisis & Raynaud",
  competencies: ["IM1.5", "IM1.6", "PA31.1", "PA31.2"],
  estimatedMinutes: 150,
  organ3dTarget: "IMMUNE",
  markdownContent: `
# Systemic Sclerosis (Scleroderma) & Scleroderma Renal Crisis

Systemic Sclerosis (SSc) is an autoimmune connective tissue disease characterized by small vessel vasculopathy, immune activation, and widespread excessive collagen deposition leading to progressive fibrosis of skin and internal organs.

---

## 1. Limited vs Diffuse Cutaneous Systemic Sclerosis

$$\\begin{array}{lcc}
\\hline
\\textbf{Feature} & \\textbf{Limited Cutaneous SSc (lcSSc)} & \\textbf{Diffuse Cutaneous SSc (dcSSc)} \\\\
\\hline
\\textbf{Skin Involvement} & \\text{Distal only (fingers, hands, face, neck)} & \\mathbf{\\text{Rapidly progressive; extends proximal to elbows/knees \u0026 trunk}} \\\\
\\textbf{Syndromic Complex} & \\mathbf{\\text{CREST Syndrome (Calcinosis, Raynaud,}} & \\text{Extensive diffuse skin thickening, early organ fibrosis} \\\\
& \\mathbf{\\text{Esophagus, Sclerodactyly, Telangiectasia)}} & \\\\
\\textbf{Autoantibody Marker} & \\mathbf{\\text{Anti-Centromere Antibodies (ACA+) (70-80\\%)}} & \\mathbf{\\text{Anti-Scl-70 (Anti-Topoisomerase I+) \u0026 Anti-RNA Pol III}} \\\\
\\textbf{Primary Pulmonary Threat} & \\mathbf{\\text{Isolated Pulmonary Arterial Hypertension (PAH)}} & \\mathbf{\\text{Interstitial Lung Disease (ILD / Pulmonary Fibrosis)}} \\\\
\\textbf{Renal Complication} & \\text{Extremely rare} & \\mathbf{\\text{Scleroderma Renal Crisis (SRC)}} \\\\
\\textbf{Prognosis} & \\text{Indolent, long-term survival} & \\text{Higher early mortality from pulmonary/renal disease} \\\\
\\hline
\\end{array}$$

---

## 2. Scleroderma Renal Crisis (SRC): Emergency Management

- **Pathophysiology**: Severe renal intraluminal onion-skin fibrointimal proliferation $\\rightarrow$ acute cortical ischemia $\rightarrow$ massive activation of the Renin-Angiotensin-Aldosterone System (RAAS) $\rightarrow$ malignant accelerated hypertension and microangiopathic hemolytic anemia.
- **Precipitating Factors**: Associated with **Anti-RNA Polymerase III antibodies** and the use of **moderate-to-high dose Corticosteroids** (Prednisone $\\ge 15\\text{ mg/day}$).
- **Emergency First-Line Drug of Choice**: **Short-acting ACE Inhibitors (Captopril or Enalaprilat)** titrated rapidly to control blood pressure.
- **Critical Contraindication**: Corticosteroids are strictly **CONTRAINDICATED** as they precipitate and worsen renal crisis.

---

## 3. Raynaud Phenomenon & Esophageal Dysmotility

- **Raynaud Phenomenon**: Reversible digital ischemia triggered by cold or emotional stress showing a triphasic color change: **White (pallor/vasospasm)** $\\rightarrow$ **Blue (cyanosis/deoxygenation)** $\\rightarrow$ **Red (rubor/reactive hyperemia)**; treated with **Dihydropyridine Calcium Channel Blockers (Amlodipine, Nifedipine)**.
- **Esophageal Dysmotility**: Smooth muscle atrophy and fibrosis of the lower two-thirds of the esophagus with lower esophageal sphincter (LES) hypotonia $\rightarrow$ severe acid reflux, dysphagia to solids/liquids, Barrett esophagus, and strictures $\rightarrow$ high-dose Proton Pump Inhibitors.
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old female with a 3-year history of diffuse cutaneous systemic sclerosis (positive anti-RNA polymerase III antibodies) presents to the emergency department with severe headache, blurred vision, and dyspnea. Vital signs: BP 210/124 mmHg, HR 102 bpm. Physical examination reveals taut, shiny, thickened skin over her face, arms, chest, and thighs with bilateral bibasilar fine crackles. Laboratory evaluation reveals: Serum Creatinine 3.8 mg/dL (baseline 0.9 mg/dL 1 month ago), peripheral blood smear showing schistocytes and thrombocytopenia (platelets 84,000/uL), and urinalysis demonstrating 2+ protein with mild microhematuria.",
      question: "Which of the following represents the immediate first-line pharmacological treatment of choice for this medical emergency?",
      options: [
        "Immediate initiation of oral Captopril (short-acting ACE inhibitor) titrated to reduce blood pressure",
        "High-dose intravenous Methylprednisolone pulse therapy (1 g/day for 3 days)",
        "Intravenous Nitroprusside monotherapy without ACE inhibitors",
        "Emergent plasma exchange (plasmapheresis) for thrombotic thrombocytopenic purpura"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is experiencing a classic Scleroderma Renal Crisis (SRC), characterized by acute-onset malignant hypertension, rapidly progressive oliguric renal failure, and microangiopathic hemolytic anemia with schistocytes, occurring in a patient with diffuse cutaneous systemic sclerosis and anti-RNA polymerase III antibodies. The life-saving first-line medication is an ACE inhibitor, specifically oral Captopril (short-acting, rapid titration), which directly reverses the profound angiotensin II-mediated intrarenal vasoconstriction. Corticosteroids are strictly contraindicated as they precipitate and exacerbate SRC."
    }
  ]
};
