/**
 * Transfusion Medicine: Therapeutic Apheresis, Blood Safety (NAT) & Hemolytic Disease of Fetus/Newborn (HDFN / RhoGAM)
 * Authoritative medical content derived from AABB Technical Manual (20th ed.), ASFA Guidelines (9th ed.), and ACOG Guidelines.
 * Mapped to NMC CBME Competencies: TR7.1, TR7.2, TR8.1, TR8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const APHERESIS_SAFETY_HDFN_RHOGAM_MODULE: PhysiologyLessonModule = {
  id: "transfusion-apheresis-safety-hdfn-rhogam",
  unitCode: "TR7.1",
  title: "Therapeutic Apheresis, Blood Safety Testing (NAT), Rh Alloimmunization & RhoGAM Immunoprophylaxis",
  competencies: ["TR7.1", "TR7.2", "TR8.1", "TR8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "HEMATOLOGY",
  markdownContent: `
# Therapeutic Apheresis, Blood Safety Testing (NAT), Rh Alloimmunization & RhoGAM Immunoprophylaxis

Immunohematological prevention of maternal alloimmunization, rigorous viral safety screening, and cellular/plasma apheresis modalities form the final cornerstone of transfusion medicine.

---

## 1. Hemolytic Disease of the Fetus and Newborn (HDFN) & Anti-D Immunoprophylaxis

### Pathophysiology of Rh(D) Alloimmunization:
- **Prerequisites**: An **$\text{Rh(D)-negative}$ mother** carrying an **$\text{Rh(D)-positive}$ fetus** (inherited from an Rh-positive father).
- **Sensitization Event**: Feto-maternal hemorrhage during delivery, miscarriage, chorionic villus sampling, amniocentesis, or abdominal trauma allows fetal RhD-positive RBCs to enter maternal circulation.
- **Primary Response**: Mother produces low-affinity **IgM Anti-D** (cannot cross placenta $\implies$ 1st pregnancy is usually unaffected).
- **Secondary Response (Subsequent RhD+ Pregnancy)**: Anamnestic memory activates high-titer **IgG Anti-D**, which readily crosses the placenta via syncytiotrophoblast Fc receptors $\implies$ Destroys fetal RhD+ erythrocytes $\implies$ Severe fetal anemia, extramedullary hematopoiesis, portal hypertension, hypoalbuminemia, and **Hydrops Fetalis** (high-output heart failure, ascites, generalized anasarca).

### Rho(D) Immune Globulin (RhoGAM) Dosing Protocols:
- **Standard Prophylaxis Regimen**:
  1. **$300\ \mu\text{g}$ (1500 IU) IM at $28\text{ weeks}$ of gestation** to all unsensitized RhD-negative pregnant women.
  2. **$300\ \mu\text{g}$ IM within $72\text{ hours}$ of delivery** of an RhD-positive infant (confirmed by negative maternal Indirect Coombs Test).
- **The Kleihauer-Betke (KB) Acid Elution Test**:
  - *Principle*: Fetal hemoglobin ($HbF$) is resistant to acid elution, while adult hemoglobin ($HbA$) elutes out, leaving ghost cells. Fetal cells stain dark pink.
  - *Calculation of Feto-Maternal Hemorrhage (FMH)*:

$$\\text{FMH (mL of Whole Blood)} = \\frac{\\text{Number of Fetal Cells}}{\\text{Total Cells Counted (2000)}} \\times 5000\\text{ mL}$$

$$\\text{Vials of RhoGAM } (300\\ \\mu\\text{g}) = \\frac{\\text{FMH (mL)}}{30\\text{ mL}} + 1\\text{ (round up safety vial)}$$

*Note: One standard $300\\ \\mu\\text{g}$ vial of RhoGAM neutralizes up to $30\\text{ mL}$ of fetal whole blood (or $15\\text{ mL}$ of packed red cells).*

---

## 2. Therapeutic Apheresis (ASFA Category I Indications)

| Apheresis Modality | Replaced / Removed Component | ASFA Category I First-Line Clinical Indications |
| :--- | :--- | :--- |
| **Therapeutic Plasma Exchange (TPE / Plasmapheresis)** | Removes pathognomonic autoantibodies, immune complexes, or paraproteins; replaced with $5\%$ Albumin or FFP. | • **Thrombotic Thrombocytopenic Purpura (TTP)**: Removes anti-ADAMTS13 antibodies $+$ infuses donor ADAMTS13 via FFP.<br>• **Guillain-Barré Syndrome (GBS)**.<br>• **Myasthenia Gravis (Myasthenic Crisis)**: Removes anti-AChR antibodies.<br>• **Anti-GBM Disease (Goodpasture Syndrome)**.<br>• **Hyperviscosity in Waldenström Macroglobulinemia** (IgM pentamer). |
| **Red Blood Cell Exchange (Erythrocytapheresis)** | Removes sickled/parasitized host RBCs; replaces with normal donor PRBCs. | • **Acute Stroke or Acute Chest Syndrome in Sickle Cell Disease** (reduces $HbS < 30\%$).<br>• **Severe *Plasmodium falciparum* Malaria** ($>10\%$ parasitemia with organ failure). |
| **Therapeutic Leukocytoreduction** | Removes massive excess circulating blast cells. | **Hyperleukocytosis / Leukostasis in AML/ALL** ($WBC > 100,000/\mu\text{L}$ with respiratory/neurological compromise). |

---

## 3. Transfusion-Transmissible Infections & Nucleic Acid Testing (NAT)

- **Mandatory Infectious Screening**:
  1. **HIV-1 & HIV-2** (HIV p24 antigen $+$ anti-HIV $1/2$ antibodies $+$ HIV-1 RNA NAT).
  2. **Hepatitis B Virus (HBV)** (HBsAg $+$ anti-HBc $+$ HBV DNA NAT).
  3. **Hepatitis C Virus (HCV)** (Anti-HCV antibody $+$ HCV RNA NAT).
  4. **Syphilis** (*Treponema pallidum* hemagglutination / RPR).
  5. **Malaria & Chagas Disease** (in endemic / at-risk regions).
- **Impact of Nucleic Acid Testing (NAT)**:
  - Dramatically shortens the "window period" (time between viral infection and antibody detectability):
    - *HCV*: Window reduced from $70\text{ days}$ to **$<3 - 5\text{ days}$**.
    - *HIV*: Window reduced from $22\text{ days}$ to **$<5 - 9\text{ days}$**.
    - *HBV*: Window reduced from $56\text{ days}$ to **$<20 - 30\text{ days}$**.
`,
  clinicalVignettes: [
    {
      scenario: "An Rh(D)-negative primigravida at 39 weeks gestation delivers an Rh(D)-positive infant complicated by a manual placental extraction. A postpartum Kleihauer-Betke acid elution test reveals 1.2% fetal red blood cells in the maternal circulation. Maternal total blood volume is estimated at 5000 mL.",
      question: "What is the volume of feto-maternal hemorrhage (FMH), and how many standard 300 mcg vials of Rho(D) Immune Globulin (RhoGAM) should be administered to prevent maternal RhD-alloimmunization?",
      options: [
        "60 mL FMH; 3 vials of RhoGAM (60 mL / 30 mL + 1 safety vial)",
        "30 mL FMH; 1 vial of RhoGAM",
        "120 mL FMH; 5 vials of RhoGAM",
        "12 mL FMH; 1 vial of RhoGAM"
      ],
      correctAnswerIndex: 0,
      explanation: "Step 1: Calculate FMH = % fetal cells x 5000 mL = 0.012 x 5000 mL = 60 mL of fetal whole blood. Step 2: Since one 300 mcg vial of RhoGAM covers up to 30 mL of fetal whole blood: Number of vials = 60 mL / 30 mL = 2 vials. Step 3: By AABB and ACOG clinical protocol, always add 1 additional safety vial when rounding: 2 + 1 = 3 vials of RhoGAM (total 900 mcg) administered intramuscularly within 72 hours of delivery."
    }
  ]
};
