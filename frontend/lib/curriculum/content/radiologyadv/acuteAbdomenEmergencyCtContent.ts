/**
 * Clinical Radiology: Acute Abdomen Emergency CT Diagnostics & Staging
 * Authoritative medical content derived from Brant and Helms' (5th ed.), ACR Appropriateness Criteria.
 * Mapped to NMC CBME Competencies: RD1.5, RD1.6, MD39.3, SU37.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_ABDOMEN_EMERGENCY_CT_MODULE: PhysiologyLessonModule = {
  id: "radiology-adv-acute-abdomen-ct",
  unitCode: "RD5.1",
  title: "Acute Abdomen Emergency CT: Pneumoperitoneum (Rigler Sign), Mesenteric Ischemia & Diverticulitis",
  competencies: ["RD1.5", "RD1.6", "MD39.3", "SU37.3"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Acute Abdomen Emergency CT: Critical Pathological Signs & Staging

Contrast-enhanced multidetector CT (MDCT) of the abdomen and pelvis is the gold-standard modality for triaging acute surgical emergencies.

---

## 1. High-Yield Acute Abdomen CT Signs

$$\\begin{array}{lcccc}
\\hline
\\textbf{Emergency Pathology} & \\textbf{Primary CT Findings} & \\textbf{Pathognomonic Sign} & \\textbf{Clinical Mechanism} & \\textbf{Surgical Triage} \\\\
\\hline
\\textbf{Pneumoperitoneum} & \\text{Extraluminal free air} & \\mathbf{\\text{Rigler Sign (Double wall)}} & \\text{Gastrointestinal perforation} & \\mathbf{\\text{Immediate Exploratory Laparotomy}} \\\\
& \\text{Subdiaphragmatic gas} & \\mathbf{\\text{Falciform ligament sign}} & (\\text{peptic ulcer, diverticulum}) & \\\\
\\textbf{Mesenteric Ischemia} & \\mathbf{\\text{Pale bowel wall (hypoenhancement)}} & \\mathbf{\\text{Pneumatosis Intestinalis}} & \\text{Transmural bowel necrosis} & \\mathbf{\\text{Emergency Laparotomy +}} \\\\
& + \\text{ SMA filling defect} & + \\mathbf{\\text{Porto-Venous Gas}} & \\text{with mucosal gas dissection} & \\text{Revascularization / Resection} \\\\
\\textbf{Acute Appendicitis} & \\mathbf{\\text{Outer diameter } > 6\\text{ mm}} & \\mathbf{\\text{Appendicolith (fecalith)}} & \\text{Luminal obstruction } \\rightarrow & \\text{Appendectomy} \\\\
& + \\text{ target sign mucosal enhancement} & + \\text{ periappendiceal fat stranding} & \\text{intraluminal bacterial infection} & \\\\
\\textbf{Acute Diverticulitis} & \\text{Sigmoid wall thickening} & \\mathbf{\\text{Hinchey Staging (I to IV)}} & \\text{Micro/macro-perforation of} & \\text{Antibiotics (I), Drainage (II),} \\\\
& + \\text{ pericolonic fat stranding} & \\text{Phlegmon } \\rightarrow \\text{ Abscess } \\rightarrow \\text{ Peritonitis} & \\text{colonic diverticulum} & \\mathbf{\\text{Hartmann Procedure (III/IV)}} \\\\
\\hline
\\end{array}$$

---

## 2. Hinchey Diverticulitis Staging

1. **Hinchey I**: Pericolic phlegmon or small pericolic walled-off abscess ($<3-4\\text{ cm}$) $\rightarrow$ Intravenous/oral antibiotics and bowel rest.
2. **Hinchey II**: Distant pelvic, retroperitoneal, or intra-abdominal walled-off abscess ($>4\\text{ cm}$) $\rightarrow$ **CT-guided percutaneous catheter drainage** $+$ IV antibiotics.
3. **Hinchey III**: Generalized **purulent peritonitis** from ruptured non-communicating abscess $\rightarrow$ Emergency surgical intervention (**Hartmann procedure** or laparoscopic lavage).
4. **Hinchey IV**: Generalized **feculent peritonitis** from free colonic perforation with stool spillage $\rightarrow$ Emergency **Hartmann procedure** (sigmoid resection with end colostomy).
`,
  clinicalVignettes: [
    {
      scenario: "A 78-year-old male with atrial fibrillation not taking anticoagulation presents with sudden-onset severe, diffuse, agonizing abdominal pain out of proportion to physical examination. Abdomen is soft without guarding. Serum lactate is 4.8 mmol/L. Contrast-enhanced CT of the abdomen demonstrates a complete non-occlusive filling defect in the main trunk of the Superior Mesenteric Artery (SMA), marked absence of mucosal wall enhancement throughout the jejunum and ileum ('pale bowel'), linear gas within the wall of the small intestine (Pneumatosis Intestinalis), and branching branching gas within the peripheral intrahepatic portal venous system.",
      question: "What is the diagnosis, and what is the clinical significance of portal venous gas and pneumatosis intestinalis?",
      options: [
        "Acute Superior Mesenteric Artery Embolic Ischemia with Transmural Bowel Infarction; Indicates severe mucosal breakdown allowing intraluminal gas to dissect through necrotic bowel wall into mesenteric veins and portal circulation, requiring immediate emergency laparotomy",
        "Uncomplicated sigmoid diverticulitis; Prescribe oral Ciprofloxacin and Metronidazole",
        "Biliary tract gas from a gallstone ileus; Perform emergency endoscopy",
        "Benign pneumoperitoneum following colonoscopy; Discharge home with reassurance"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits classic Acute Mesenteric Ischemia from an embolic SMA occlusion. The radiological combination of 'pale bowel' (lack of wall enhancement), Pneumatosis Intestinalis (gas dissecting into the ischemic bowel wall), and branching Porto-Venous Gas (gas traveling via mesenteric veins into intrahepatic portal branches) indicates advanced, irreversible transmural bowel infarction and impending perforation. This is an extreme surgical emergency mandating immediate exploratory laparotomy, vascular embolectomy/revascularization, and resection of non-viable bowel."
    }
  ]
};
