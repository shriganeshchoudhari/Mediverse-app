/**
 * Pediatrics: Pediatric Immunodeficiencies & Inborn Errors of Metabolism
 * Authoritative medical content derived from Nelson Textbook of Pediatrics (21st ed.), Scriver's The Metabolic and Molecular Bases of Inherited Disease.
 * Mapped to NMC CBME Competencies: PE1.7, PE1.8, PA44.1, PA44.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PEDIATRIC_IMMUNODEFICIENCY_METABOLIC_MODULE: PhysiologyLessonModule = {
  id: "pediatrics-adv-pediatric-immunodeficiency-metabolic",
  unitCode: "PE7.1",
  title: "Pediatric Immunodeficiencies (SCID, Bruton, WAS) & Inborn Errors (PKU, Galactosemia)",
  competencies: ["PE1.7", "PE1.8", "PA44.1", "PA44.2"],
  estimatedMinutes: 150,
  organ3dTarget: "IMMUNE",
  markdownContent: `
# Pediatric Immunodeficiencies & Inborn Errors of Metabolism

This module covers life-threatening congenital primary immunodeficiencies and classic enzymatic blocks in neonatal carbohydrate and amino acid metabolism.

---

## 1. Primary Immunodeficiency Syndromes Diagnostic Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Syndrome} & \\textbf{Defective Gene} & \\textbf{Cellular Defect} & \\textbf{Classic Clinical Triad / Hallmark} & \\textbf{Diagnostic Marker} \\\\
\\hline
\\textbf{SCID (Severe Combined)} & \\mathbf{IL2RG\\text{ / }ADA} & \\mathbf{\\text{Absent T cells (CD3+)}} & \\mathbf{\\text{Recurrent severe infections (PJP, Candida),}} & \\mathbf{\\text{ABSENT THYMIC SHADOW on CXR,}} \\\\
& \\text{X-linked / AR} & \\text{\u0026 non-functional B cells} & \\text{chronic diarrhea, failure to thrive} & \\text{severe lymphopenia (}<1,500/\\mu\\text{L)} \\\\
\\textbf{Bruton Agammaglobulinemia} & \\mathbf{BTK\\text{ (Tyrosine Kinase)}} & \\mathbf{\\text{Arrest of pre-B maturation;}} & \\mathbf{\\text{Recurrent pyogenic sinopulmonary infections}} & \\mathbf{\\text{ABSENT mature B cells (CD19/20);}} \\\\
\\textbf{(XLA)} & \\text{X-linked Recessive} & \\mathbf{\\text{ABSENT mature B cells}} & \\text{at } 6-9\\text{ mo (maternal IgG wanes); absent tonsils} & \\text{all immunoglobulin isotypes low} \\\\
\\textbf{Wiskott-Aldrich (WAS)} & \\mathbf{WASP\\text{ gene}} & \\text{Actin cytoskeleton defect} & \\mathbf{\\text{WATER Triad: Wiskott-Aldrich,}} & \\mathbf{\\text{THROMBOCYTOPENIA WITH}} \\\\
& \\text{X-linked Recessive} & \\text{in leukocytes \u0026 platelets} & \\mathbf{\\text{Thrombocytopenia, Eczema, Recurrent inf.}} & \\mathbf{\\text{SMALL (MICRO) PLATELETS}} \\\\
\\textbf{Chronic Granulomatous} & \\mathbf{CYBB\\text{ / NADPH Oxidase}} & \\mathbf{\\text{Defective respiratory burst}} & \\mathbf{\\text{Recurrent catalase-positive infections}} & \\mathbf{\\text{Abnormal DHR flow cytometry}} \\\\
\\textbf{(CGD)} & \\text{X-linked Recessive} & \\text{(cannot generate } \\text{O}_2^{\\bullet-}\\text{)}} & \\text{(S. aureus, Serratia, Aspergillus, Nocardia)} & \\text{(Dihydrorhodamine 123 test)} \\\\
\\hline
\\end{array}$$

---

## 2. Inborn Errors of Metabolism: PKU vs Galactosemia

$$\\begin{array}{lcccc}
\\hline
\\textbf{Inborn Error} & \\textbf{Enzyme Deficiency} & \\textbf{Accumulated Substrate} & \\textbf{Clinical Hallmarks} & \\textbf{Dietary Management} \\\\
\\hline
\\textbf{Phenylketonuria (PKU)} & \\mathbf{\\text{Phenylalanine Hydroxylase (PAH)}} & \\text{Phenylalanine \u0026} & \\mathbf{\\text{\"Musty\" / \"mousy\" body odor,}} & \\mathbf{\\text{Low Phenylalanine diet;}} \\\\
& \\text{or } \\text{BH}_4\\text{ cofactor deficiency} & \\text{phenylketones} & \\text{intellectual disability, fair hair/blue eyes} & \\mathbf{\\text{Tyrosine supplementation}} \\\\
\\textbf{Classic Galactosemia} & \\mathbf{\\text{Galactose-1-P Uridyltransferase}} & \\text{Galactose-1-phosphate} & \\mathbf{\\text{Bilateral \"oil-drop\" cataracts, jaundice,}} & \\mathbf{\\text{Strict elimination of}} \\\\
& \\mathbf{\\text{(GALT)}} & \\text{\u0026 galactitol} & \\mathbf{\\text{hepatomegaly, }} \\mathbf{E.\\text{ coli}}\\mathbf{\\text{ neonatal sepsis}} & \\text{galactose \u0026 lactose (milk)} \\\\
\\hline
\\end{array}$$

- **Pathophysiology of Galactosemia Cataracts & Sepsis**:
  - Excess galactose is converted by aldose reductase to **galactitol**, which accumulates in the lens fibers, drawing in water via hyperosmolar force and precipitating **bilateral cataracts**.
  - Galactose-1-phosphate accumulation impairs neutrophil bactericidal activity, predisposing the neonate to fulminant, lethal ***Escherichia coli* sepsis**.
`,
  clinicalVignettes: [
    {
      scenario: "A 4-day-old female infant born via uncomplicated spontaneous vaginal delivery is brought to the emergency room with lethargy, poor feeding, and vomiting following breast milk ingestion. On examination, the infant is icteric with palpable hepatomegaly (liver edge 4 cm below right costal margin) and bilateral clouding of the lenses on red reflex examination ('oil-drop cataracts'). Blood cultures draw positive for Gram-negative lactose-fermenting bacilli identified as Escherichia coli. Urine testing is positive for non-glucose reducing substances (Clinitest positive, glucose oxidase dipstick negative).",
      question: "Which of the following enzymes is deficient in this infant, and what is the mandatory immediate management?",
      options: [
        "Galactose-1-Phosphate Uridyltransferase (GALT); Immediate cessation of breast milk and initiation of a soy-based, lactose-free formula",
        "Phenylalanine Hydroxylase (PAH); Immediate initiation of a low-phenylalanine formula with tyrosine supplementation",
        "Galactokinase (GALK); Continue breast milk feeding with prophylactic daily Ciprofloxacin",
        "Glucose-6-Phosphate Dehydrogenase (G6PD); Immediate phototherapy and exchange transfusion"
      ],
      correctAnswerIndex: 0,
      explanation: "This neonate exhibits the classic presentation of Classic Galactosemia caused by autosomal recessive deficiency of Galactose-1-Phosphate Uridyltransferase (GALT). Ingestion of lactose (glucose + galactose) in breast milk or standard formula leads to toxic accumulation of galactose-1-phosphate and galactitol, resulting in hepatic dysfunction (jaundice, hepatomegaly), bilateral 'oil-drop' cataracts, and susceptibility to fulminant Escherichia coli sepsis. The presence of non-glucose reducing substances in the urine strongly supports the diagnosis. The life-saving immediate treatment is strict elimination of all galactose and lactose sources from the diet (switch to soy formula)."
    }
  ]
};
