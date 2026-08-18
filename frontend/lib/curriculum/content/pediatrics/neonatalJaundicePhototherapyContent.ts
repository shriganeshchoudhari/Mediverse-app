/**
 * Neonatal Hyperbilirubinemia, Phototherapy & Exchange Transfusion Learning Content
 * Authoritative medical content derived from AAP 2022 Guidelines, Nelson Pediatrics, Ghai Pediatrics, and USMLE Step 2 CK Pediatrics.
 * Mapped to NMC CBME Competencies: PE3.1, PE3.2, PE3.3, PE3.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEONATAL_JAUNDICE_PHOTOTHERAPY_MODULE: PhysiologyLessonModule = {
  id: "ped-jaundice-phototherapy",
  unitCode: "PE3.1",
  title: "Neonatology: Neonatal Hyperbilirubinemia, Phototherapy (Lumirubin) & Exchange Transfusion",
  competencies: ["PE3.1", "PE3.2", "PE3.3", "PE3.4"],
  estimatedMinutes: 140,
  organ3dTarget: "HEPATIC",
  markdownContent: `
# Neonatology: Neonatal Hyperbilirubinemia, Phototherapy (Lumirubin) & Exchange Transfusion

Neonatal jaundice affects over $60\\%$ of term and $80\\%$ of preterm infants. Timely discrimination between benign physiological jaundice and rapidly progressive neurotoxic unconjugated hyperbilirubinemia prevents irreversible **Kernicterus**.

---

## 1. Physiological vs Pathological Neonatal Jaundice

| Diagnostic Parameter | Physiological Jaundice | Pathological Jaundice (High Alert!) |
| :--- | :--- | :--- |
| **Onset Timing** | **APPEARS AFTER 24 HOURS OF LIFE** (peaks day 3–5 in term, day 5–7 in preterm). | **APPEARS WITHIN FIRST 24 HOURS OF LIFE** *(Always Pathological!)*. |
| **Rate of Rise in Total Bilirubin** | $< 0.2\\text{ mg/dL/hour}$ ($< 5.0\\text{ mg/dL/24 hours}$). | **$> 0.2\\text{ mg/dL/hour}$ ($> 5.0\\text{ mg/dL/24 hours}$)**. |
| **Peak Total Serum Bilirubin (TSB)** | $< 12\\text{–}15\\text{ mg/dL}$ in term; $< 15\\text{ mg/dL}$ in preterm. | **Exceeds hour-specific AAP Bhutani Phototherapy nomogram threshold**. |
| **Direct / Conjugated Fraction** | $< 1.0\\text{ mg/dL}$ (or $< 20\\%$ of Total Bilirubin). | **$> 1.0\\text{ mg/dL}$ (or $> 20\\%$ of Total)** $\\implies$ **Cholestasis (Biliary Atresia / Hepatitis)**. |
| **Duration of Jaundice** | Resolves by **$10\\text{–}14\\text{ days}$** in term ($21\\text{ days}$ in preterm). | **Persists $> 14\\text{ days}$** in term ($> 21\\text{ days}$ in preterm). |
| **Clinical Condition of Newborn** | Active, feeding well, normal stool/urine color. | Lethargic, poor feeding, dark urine, pale acholic clay stools, hepatosplenomegaly. |

---

## 2. Common Causes of Unconjugated Hyperbilirubinemia

1. **Isoimmune Hemolytic Disease**:
   - **ABO Incompatibility**: Mother blood group **O**, Infant blood group **A or B** (maternal IgG anti-A/anti-B crosses placenta; **Microspherocytes** on blood smear; Direct Antiglobulin / Coombs Test usually weakly positive).
   - **Rh Incompatibility**: Mother **Rh-negative**, Infant **Rh-positive** (maternal anti-D antibodies; severe erythroblastosis fetalis, positive Direct Coombs Test, massive reticulocytosis).
2. **Breastfeeding Jaundice (Suboptimal Intake / Lactation Failure)**:
   - **Timing**: Days **1 to 5** of life.
   - **Mechanism**: Inadequate breast milk volume $\\rightarrow$ mild dehydration, weight loss $>10\\%$, infrequent stooling $\\rightarrow$ delayed meconium passage and **increased intestinal enterohepatic circulation of bilirubin**.
   - **Management**: Optimize latch, increase feeding frequency to **$10-12\\text{ times/24 hours}$**. *Do NOT discontinue breastfeeding!*
3. **Breast Milk Jaundice**:
   - **Timing**: Onset after **day 5–7**, peaks at **week 2 to 3** (can persist for up to 3 months).
   - **Mechanism**: Substances in mature breast milk (**$\\beta$-glucuronidase**, non-esterified fatty acids, pregnanediol) deconjugate intestinal bilirubin, increasing enterohepatic resorption in a healthy, thriving infant.
   - **Management**: Reassurance; **CONTINUE BREASTFEEDING**.

---

## 3. Phototherapy & Exchange Transfusion Mechanics

### Phototherapy Principles:
- **Optimal Light Wavelength**: **$460\\text{ to } 490\\text{ nm}$ (Blue-Green Spectrum)**.
- **Primary Mechanism**: **Structural Photoisomerization** converts insoluble unconjugated $4Z,15Z$-bilirubin into the water-soluble structural isomer **Lumirubin**, which is excreted directly in bile and urine without requiring hepatic glucuronidation.
- **Bronze Baby Syndrome**: Occurs if phototherapy is mistakenly applied to infants with elevated conjugated/direct bilirubin (due to photo-oxidation of copper-porphyrin complexes).

### Acute Bilirubin Encephalopathy (ABE) & Kernicterus:
- Unbound, lipid-soluble unconjugated bilirubin crosses the blood-brain barrier and deposits selectively in the **Basal Ganglia (Globus Pallidus)**, Subthalamic Nuclei, Hippocampus, and Oculomotor/Auditory Nuclei.
- **Progression**:
  - *Phase 1 (Early)*: Lethargy, hypotonia, poor Moro reflex, weak suck.
  - *Phase 2 (Intermediate)*: Stupor, irritability, high-pitched cry, hypertonia of extensor muscles, **Retrocollis (neck arching) and Opisthotonus (back arching)**.
  - *Phase 3 (Chronic / Kernicterus)*: **Choreoathetoid Cerebral Palsy**, Sensorineural Hearing Loss, Upward Gaze Palsy (Parinaud-like), and Dental Enamel Hypoplasia.
- **Double-Volume Exchange Transfusion ($160\\text{ mL/kg}$)**: Rapidly removes antibody-coated RBCs and unbound serum bilirubin while correcting anemia.
`,
  clinicalVignettes: [
    {
      scenario: "A 36-hour-old full-term male newborn born to a 26-year-old G1P0 mother (Blood type O-positive) develops progressive jaundice extending down to his ankles. Physical examination reveals an active, alert infant with scleral icterus and cutaneous jaundice (Kramer zone 4). Laboratory workup reveals: Total Serum Bilirubin 18.2 mg/dL, Direct Bilirubin 0.6 mg/dL, Infant Blood Type A-positive, Direct Antiglobulin (Coombs) Test positive, Peripheral blood smear shows numerous microspherocytes and reticulocyte count 9.5%.",
      question: "Which of the following is the underlying diagnosis, and what is the primary photochemical mechanism by which intensive phototherapy lowers this infant's serum bilirubin?",
      options: [
        "ABO Incompatibility; Phototherapy induces Structural Photoisomerization into Lumirubin",
        "Rh Isoimmunization; Phototherapy induces Hepatic Glucuronidation via UGT1A1",
        "Breast Milk Jaundice; Phototherapy induces Enterohepatic Bile Acid precipitation",
        "Biliary Atresia; Phototherapy causes Photo-oxidation into Biliverdin"
      ],
      correctAnswerIndex: 0,
      explanation: "A mother with blood type O delivering an infant with blood type A who develops early jaundice (< 36h) with a positive Direct Coombs Test and microspherocytes on blood smear has ABO Incompatibility Hemolytic Disease. Intensive phototherapy (460-490 nm blue-green light) lowers serum bilirubin primarily via Structural Photoisomerization, which irreversibly converts insoluble unconjugated bilirubin into the water-soluble isomer Lumirubin, allowing rapid renal and biliary excretion without hepatic conjugation."
    }
  ]
};
