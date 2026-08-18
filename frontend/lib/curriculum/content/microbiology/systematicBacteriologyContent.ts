/**
 * Systematic Bacteriology & Diagnostic Flowcharts Learning Content
 * Authoritative medical content derived from Jawetz, Murray, Levinson, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: MI2.1, MI2.2, MI2.3, MI2.4, MI3.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SYSTEMATIC_BACTERIOLOGY_MODULE: PhysiologyLessonModule = {
  id: "micr-bacteriology",
  unitCode: "MI2.1",
  title: "Gram-Positive & Gram-Negative Bacteria: Morphological Flowcharts & Clinical Syndromes",
  competencies: ["MI2.1", "MI2.2", "MI2.3", "MI2.4", "MI3.1"],
  estimatedMinutes: 130,
  organ3dTarget: "IMMUNOLOGY",
  markdownContent: `
# Gram-Positive & Gram-Negative Bacteria: Morphological Flowcharts & Clinical Syndromes

Diagnostic medical bacteriology relies on a systematic algorithmic approach based on **Gram Stain Reaction**, cellular morphology (cocci, bacilli, spiral), atmospheric requirements, and biochemical enzymology (catalase, coagulase, oxidase, hemolysis, lactose fermentation).

---

## 1. Gram-Positive Cocci Algorithmic Flowchart

> **Step 1: Catalase Test ($2\\text{ }H_2O_2 \\rightarrow 2\\text{ }H_2O + O_2\\uparrow \\text{ via Catalase}$)**:
> - **Catalase Positive** (Clusters / Bunches) $\\implies$ ***Staphylococcus*** species:
>   - **Coagulase Positive**: ***Staphylococcus aureus*** (Gold colonies on blood agar, mannitol fermenter on MSA, Protein A binds Fc of IgG $\\implies$ skin abscesses, acute endocarditis, osteomyelitis, TSS, Scalded Skin Syndrome).
>   - **Coagulase Negative**:
>     - **Novobiocin Sensitive**: ***Staphylococcus epidermidis*** (Biofilm on prosthetic joints/valves, IV catheters).
>     - **Novobiocin Resistant**: ***Staphylococcus saprophyticus*** (Second most common cause of honeymoon cystitis / UTIs in young sexually active females).
>
> - **Catalase Negative** (Chains / Pairs) $\\implies$ ***Streptococcus*** and ***Enterococcus*** species:
>   - **$\\alpha$-Hemolytic (Partial green hemolysis)**:
>     - **Optochin Sensitive & Bile Soluble**: ***Streptococcus pneumoniae*** (Lancet-shaped diplococci, capsule $\\implies$ MOPS: Meningitis, Otitis media, Pneumonia, Sinusitis).
>     - **Optochin Resistant & Bile Insoluble**: ***Viridans Streptococci*** (*S. mutans, S. sanguinis* $\\implies$ dental caries, subacute bacterial endocarditis on damaged valves).
>   - **$\\beta$-Hemolytic (Complete clear hemolysis)**:
>     - **Bacitracin Sensitive & PYR Positive**: ***Streptococcus pyogenes* (Group A Strep / GAS)** (Pharyngitis, cellulitis, impetigo; Rheumatic fever & PSGN; M protein, Streptolysin O).
>     - **Bacitracin Resistant & CAMP Positive**: ***Streptococcus agalactiae* (Group B Strep / GBS)** (Hippurate positive $\\implies$ neonatal meningitis, pneumonia, and sepsis).
>   - **$\\gamma$-Hemolytic (No hemolysis / Grow in 6.5% NaCl & Bile Esculin)**:
>     - ***Enterococcus faecalis / Enterococcus faecium* (VRE)**: Urinary tract infections, biliary tract infections, subacute endocarditis post-GI/GU procedures.

---

## 2. Gram-Negative Bacilli & Lactose Fermentation on MacConkey Agar

Gram-negative bacilli are classified by their ability to ferment lactose into acid (turning MacConkey agar **pink**):

| Category & Fermentation | Biochemical Key Tests | Important Pathogens & Clinical Disease Syndromes |
| :--- | :--- | :--- |
| **Fast Lactose Fermenters (Pink Colonies)** | **Indole Positive**: *Escherichia coli*<br>**Indole Negative, Urease Positive, Mucoid Capsule**: *Klebsiella pneumoniae* | • ***Escherichia coli* (ETEC, EHEC O157:H7, UPEC)**: #1 cause of UTI, neonatal meningitis (K1 capsule), traveler\'s diarrhea.<br>• ***Klebsiella pneumoniae***: Thick currant-jelly sputum, aspiration lobar pneumonia in alcoholics/diabetics. |
| **Slow Lactose Fermenters (Light Pink/Late)** | **Citrate Positive** | ***Citrobacter***, ***Serratia marcescens*** (produces red prodigiosin pigment; hospital-acquired catheter UTIs). |
| **Non-Lactose Fermenters (White/Colorless Colonies)** | **Oxidase Positive**: ***Pseudomonas aeruginosa***<br><br>**Oxidase Negative, $H_2S$ Gas Positive (Black on TSI)**: ***Salmonella enterica***, ***Proteus mirabilis***<br><br>**Oxidase Negative, $H_2S$ Gas Negative**: ***Shigella sonnei/flexneri***, ***Yersinia enterocolitica*** | • ***Pseudomonas aeruginosa***: Pyocyanin/pyoverdin blue-green pigment, grape-like sweet odor; Pneumonia in cystic fibrosis, Ecthyma gangrenosum in neutropenia, hot tub folliculitis, malignant otitis externa.<br>• ***Salmonella Typhi***: Rose spots, step-ladder fever, pea-soup diarrhea, carrier state in gallbladder.<br>• ***Proteus mirabilis***: Swarming motility, high urease alkalinizes urine $\\rightarrow$ **Staghorn Calculi** (magnesium ammonium phosphate / struvite stones).<br>• ***Shigella***: Low infectious dose ($<100$ organisms), bloody bacillary dysentery via Shiga toxin. |

---

## 3. Fastidious Gram-Negative Cocci & Coccobacilli

- ***Neisseria meningitidis* (Meningococcus)**:
  - Gram-negative diplococci with polysaccharide capsule; ferments **Maltose AND Glucose** on Thayer-Martin chocolate agar (VPN).
  - Produces acute bacterial meningitis, petechial/purpuric rash, and **Waterhouse-Friderichsen Syndrome** (bilateral adrenal hemorrhagic necrosis $\\implies$ acute adrenal crisis & shock).
- ***Neisseria gonorrhoeae* (Gonococcus)**:
  - Gram-negative intracellular diplococci inside PMNs; ferments **Glucose ONLY**; NO capsule.
  - Causes urethritis, pelvic inflammatory disease (PID), Fitz-Hugh-Curtis syndrome (perihepatitis / "violin-string" adhesions), septic arthritis.
- ***Haemophilus influenzae***:
  - Pleomorphic coccobacillus requiring **Factor X (Hemin) and Factor V ($NAD^+$)** on chocolate agar.
  - Epiglottitis ("thumbprint sign", cherry-red epiglottis in non-vaccinated children), otitis media, pneumonia.
`,
  clinicalVignettes: [
    {
      scenario: "A 21-year-old college student is brought to the emergency department with high fever, severe headache, photophobia, and stiff neck. Physical examination demonstrates positive Kernig and Brudzinski signs, and a rapidly spreading non-blanching petechial and purpuric rash is noted on his lower extremities. Lumbar puncture reveals cloudy CSF with opening pressure of 320 mm H2O, 4,500 neutrophils/uL, protein 280 mg/dL, and glucose 15 mg/dL. Gram stain reveals Gram-negative kidney bean-shaped diplococci that ferment both glucose and maltose.",
      question: "Which of the following pathogens is the causative agent?",
      options: [
        "Neisseria meningitidis (Meningococcal Meningitis)",
        "Neisseria gonorrhoeae",
        "Streptococcus pneumoniae",
        "Haemophilus influenzae"
      ],
      correctAnswerIndex: 0,
      explanation: "Neisseria meningitidis is a Gram-negative diplococcus characterized by fermentation of both maltose and glucose (differentiating it from N. gonorrhoeae, which ferments only glucose). It causes epidemic bacterial meningitis and fulminant meningococcemia with petechial/purpuric purpura fulminans and risk of bilateral adrenal hemorrhage (Waterhouse-Friderichsen syndrome)."
    }
  ]
};
