/**
 * Infectious Diseases: Healthcare-Associated Multi-Drug Resistant (MDR) Pathogens & Molecular Diagnostics
 * Authoritative medical content derived from Mandell's Infectious Diseases (9th ed.), Sanford Guide to Antimicrobial Therapy.
 * Mapped to NMC CBME Competencies: ID5.1, ID5.2, ID6.1, ID6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MDR_PATHOGENS_ESKAPE_DIAGNOSTICS_MODULE: PhysiologyLessonModule = {
  id: "infectious-diseases-mdr-pathogens-eskape-diagnostics",
  unitCode: "ID5.1",
  title: "Multi-Drug Resistant (MDR) ESKAPE Pathogens, MRSA, VRE, CRE, Candida auris & Molecular Diagnostics",
  competencies: ["ID5.1", "ID5.2", "ID6.1", "ID6.2"],
  estimatedMinutes: 150,
  organ3dTarget: "MICROBIOLOGY",
  markdownContent: `
# Multi-Drug Resistant (MDR) ESKAPE Superbugs & Molecular Diagnostics

The ESKAPE pathogens represent a group of virulent healthcare-associated bacteria capable of escaping the biocidal actions of antimicrobial agents through acquired resistance mutations.

---

## 1. The ESKAPE Pathogen Resistance Matrix

| ESKAPE Pathogen | Molecular Mechanism of Resistance | Clinical Spectrum \u0026 Infections | First-Line Antimicrobial Options | Crucial Clinical Caveats \u0026 Prohibitions |
| :--- | :--- | :--- | :--- | :--- |
| **Enterococcus faecium (VRE)** | Acquisition of ***vanA / vanB*** operon: alters peptidoglycan precursor from **$\\text{D-Ala-D-Ala}$ to $\\text{D-Ala-D-Lac}$** ($1000\\times$ lower vancomycin binding). | Catheter-associated UTIs, intra-abdominal infections, endocarditis, bacteremia. | **Linezolid** ($600\\text{ mg}$ IV/PO q12h) or **Daptomycin** ($8 - 12\\text{ mg/kg}$ IV q24h) or **Tigecycline**. | Linezolid requires weekly CBC monitoring (myelosuppression / thrombocytopenia after 2 weeks) and caution with SSRIs (serotonin syndrome). |
| **Staphylococcus aureus (MRSA)** | Acquisition of ***mecA* gene on SCCmec element**: encodes **Penicillin-Binding Protein 2a (PBP2a)** with low affinity for all standard $\\beta$-lactams. | Hospital-acquired pneumonia, skin/soft tissue infections, osteomyelitis, infective endocarditis, central line bacteremia. | **IV Vancomycin** (target trough $15 - 20\\ \\mu\\text{g/mL}$ or $\\text{AUC}/\\text{MIC} \\ge 400 - 600$), **Daptomycin**, **Linezolid**, **Ceftaroline** (5th-gen anti-MRSA cephalosporin). | **DAPTOMYCIN IS STRICTLY CONTRAINDICATED IN PNEUMONIA!** Pulmonary surfactant directly binds and inactivates daptomycin. |
| **Klebsiella pneumoniae (ESBL \u0026 CRE)** | 1. **ESBL (CTX-M, SHV, TEM)**: hydrolyzes penicillins and cephalosporins.<br>2. **CRE (KPC, NDM-1 metallo-$\\beta$-lactamase, OXA-48)**: hydrolyzes all carbapenems. | Ventilator-associated pneumonia, complicated intra-abdominal infections, urosepsis. | • **ESBL**: **Carbapenems (Meropenem, Imipenem)** are drugs of choice.<br>• **CRE**: **Ceftazidime-Avibactam**, **Meropenem-Vaborbactam**, **Cefiderocol**, **Colistin / Polymyxin B**. | Avibactam inhibits KPC and OXA-48, but does NOT inhibit NDM-1 metallo-$\\beta$-lactamases (requires Aztreonam + Ceftazidime-Avibactam or Cefiderocol). |
| **Acinetobacter baumannii (CRAB)** | Multi-drug efflux pumps, loss of outer membrane porins, aminoglycoside-modifying enzymes, and OXA carbapenemases. | ICU ventilator-associated pneumonia, extensive wound/burn infections, post-neurosurgical meningitis. | **High-Dose Ampicillin-Sulbactam** ($9\\text{ g}$ IV q8h extended infusion), **Cefiderocol**, **Tigecycline**, **Colistin**. | Sulbactam has direct bactericidal affinity for PBP1 and PBP3 in *A. baumannii*. |
| **Pseudomonas aeruginosa (DTR-P)** | AmpC $\\beta$-lactamase derepression, MexAB-OprM efflux pumps, OprD porin loss, and metallo-carbapenemases. | Ecthyma gangrenosum, malignant otitis externa, VAP in CF/COPD patients, burn wound sepsis. | **Ceftolozane-Tazobactam**, **Ceftazidime-Avibactam**, **Cefepime**, **Piperacillin-Tazobactam**, **Meropenem**. | Ceftolozane-Tazobactam is highly stable against AmpC hyperproduction and porin loss in resistant *Pseudomonas*. |
| **Enterobacter species (AmpC)** | Inducible chromosomal ***AmpC* $\\beta$-lactamase** (derepressed during therapy with 3rd-gen cephalosporins). | Healthcare-associated intra-abdominal infections, bacteremia, UTIs. | **Cefepime** (4th-gen cephalosporin resists AmpC hydrolysis) or **Carbapenems**. | *Avoid 3rd-gen cephalosporins (Ceftriaxone)* for AmpC producers (*Enterobacter, Serratia, Citrobacter*) due to emergence of clinical resistance! |

---

## 2. *Candida auris* & Multidrug-Resistant Fungal Yeasts

- **Characteristics**: Emerging multidrug-resistant fungal pathogen capable of environmental persistence, healthcare surface colonisation, and horizontal nosocomial transmission.
- **Antifungal Resistance**: $>90\\%$ resistant to Fluconazole; $\\sim 30\\%$ resistant to Amphotericin B.
- **First-Line Therapy**: **Echinocandins (Caspofungin, Micafungin, Anidulafungin)** which inhibit $\\beta-(1,3)\\text{-D-glucan}$ synthase in the fungal cell wall.

---

## 3. Rapid Molecular Diagnostic Technologies

1. **MALDI-TOF Mass Spectrometry**: Identifies bacterial/fungal species within **$10\\text{ minutes}$** from positive blood culture bottles via ribosomal protein peptide mass fingerprinting.
2. **Multiplex PCR Blood Culture Identification (BioFire FilmArray BCID Panel)**: Detects 43 bacterial/fungal targets and key resistance genes (***mecA* [MRSA], *vanA/B* [VRE], *blaKPC*, *blaNDM*, *blaOXA-48*, *blaCTX-M***) within **$1\\text{ hour}$** of positive blood culture notification, accelerating targeted antibiotic optimization by $>24-48\\text{ hours}$.
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male intubated in the intensive care unit develops ventilator-associated pneumonia with purulent endotracheal secretions and new bilateral infiltrates. Endotracheal aspirate culture grows heavy Methicillin-Resistant Staphylococcus aureus (MRSA). The clinical team discusses initiating intravenous antimicrobial therapy. A junior trainee suggests starting Daptomycin at 8 mg/kg IV once daily.",
      question: "Why is Daptomycin STRICTLY CONTRAINDICATED in the treatment of pulmonary infections caused by MRSA?",
      options: [
        "Daptomycin is directly bound and inactivated by endogenous pulmonary surfactant in the alveolar fluid, resulting in clinical failure",
        "Daptomycin causes severe bronchospasm and immediate anaphylactoid reaction in intubated patients",
        "Daptomycin cannot penetrate Gram-positive bacterial cell walls in the respiratory tract",
        "Daptomycin triggers rapid development of high-level vancomycin cross-resistance"
      ],
      correctAnswerIndex: 0,
      explanation: "Daptomycin is a cyclic lipopeptide antibiotic that is highly effective for MRSA bacteremia, right-sided endocarditis, and skin/soft tissue infections. However, it is STRICTLY CONTRAINDICATED in pneumonia because pulmonary surfactant in alveolar fluid binds daptomycin with high affinity, neutralizing its antimicrobial activity and causing universal clinical treatment failure. The correct first-line agents for MRSA pneumonia are IV Vancomycin (targeting AUC/MIC 400-600) or IV Linezolid (600 mg q12h)."
    }
  ]
};
