/**
 * Cardiology & Cardiovascular Internal Medicine Learning Content
 * Authoritative medical content derived from Harrison, Davidson, Braunwald, and USMLE Step 2 CK.
 * Mapped to NMC CBME Competencies: IM1.1, IM1.2, IM1.3, IM1.4, IM1.5
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CARDIOLOGY_INTERNAL_MEDICINE_MODULE: PhysiologyLessonModule = {
  id: "med-cardiology",
  unitCode: "IM1.1",
  title: "Cardiology: Acute Coronary Syndromes (ACS), 12-Lead ECG STEMI Localization, HFrEF GDMT & Valvular Murmurs",
  competencies: ["IM1.1", "IM1.2", "IM1.3", "IM1.4", "IM1.5"],
  estimatedMinutes: 140,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Cardiology: Acute Coronary Syndromes (ACS), 12-Lead ECG STEMI Localization, HFrEF GDMT & Valvular Murmurs

Cardiovascular disease is the leading cause of global morbidity and mortality. Clinical management requires rapid electrocardiographic localization, emergency reperfusion protocols, guideline-directed neurohormonal blockade in heart failure, and precise physical diagnosis of valvular heart disease.

---

## 1. 12-Lead ECG STEMI Infarct Localization & Culprit Arteries

| Infarct Anatomical Territory | Leads with ST Elevation ($\\ge 1\\text{ mm}$) | Reciprocal ST Depressions | Culprit Coronary Artery | Critical Clinical Pitfalls & Management Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Anteroseptal** | **$V_1, V_2, V_3$** | $II, III, aVF$ (variable) | **Left Anterior Descending (LAD)** | Highest risk of cardiogenic shock, free wall rupture, and ventricular septal defect (VSD). |
| **Anterior / Extensive Anterolateral** | **$V_1 - V_6, I, aVL$** | $II, III, aVF$ | **Proximal LAD (Widow-Maker)** or Left Main | Massive myocardial loss; immediate Primary Percutaneous Coronary Intervention (**PCI $<90\\text{ min}$** door-to-balloon). |
| **Lateral** | **$I, aVL, V_5, V_6$** | $II, III, aVF$ | **Left Circumflex (LCx)** or Diagonal branch | Diagonal/obtuse marginal branches; check for posterior extension. |
| **Inferior** | **$II, III, aVF$** | **$I, aVL$** | **Right Coronary Artery (RCA)** ($85\\%$) or LCx | **MANDATORY**: Perform right-sided leads ($V_3R, V_4R$). In **Right Ventricular (RV) Infarction**, patient is strictly preload-dependent $\\implies$ **AVOID Nitrates, Diuretics, and Morphine**; administer aggressive IV normal saline! |
| **Posterior** | **$V_7, V_8, V_9$** | **Tall R waves $+$ Horizontal ST depressions in $V_1, V_2, V_3$** | Posterior Descending Artery (PDA) / LCx | True posterior STEMI is easily missed; mirror-image changes in $V_1-V_3$. |

---

## 2. Heart Failure with Reduced Ejection Fraction (HFrEF): The 4 Pillars of GDMT

Guideline-Directed Medical Therapy (**GDMT**) reduces all-cause mortality, cardiovascular hospitalization, and induces reverse ventricular remodeling in patients with $\\text{LVEF} \\le 40\\%$.

| GDMT Drug Class | Preferred Clinical Agents | Primary Physiological Mechanism | Vital Pearls & Contraindications |
| :--- | :--- | :--- | :--- |
| **1. ARNI / ACEi / ARB** | **Sacubitril / Valsartan** (preferred)<br>• Alternative: Lisinopril, Enalapril, Losartan | Inhibits Neprilysin ($\\uparrow$ endogenous BNP/ANP natriuretic peptides) $+$ blocks AT1 receptor. | **Mandatory 36-hour washout** when switching from an ACE inhibitor to ARNI to prevent life-threatening **Angioedema**; monitor $K^+$ and creatinine. |
| **2. Evidence-Based $\\beta$-Blockers** | **Bisoprolol**, **Carvedilol**, **Metoprolol Succinate** (extended-release) | Sympathetic neurohormonal antagonism, prevents catecholamine cardiotoxicity, reduces arrhythmias. | **Never start or up-titrate in acute decompensated shock** (start only when euvolemic / stabilized); avoid in active bronchospasm. |
| **3. Mineralocorticoid Receptor Antagonists (MRA)** | **Spironolactone**, **Eplerenone** | Aldosterone blockade $\\implies$ inhibits myocardial fibrosis and collagen deposition. | Monitor potassium closely (contraindicated if baseline $K^+ > 5.0\\text{ mEq/L}$ or $\\text{eGFR} < 30\\text{ mL/min}$). |
| **4. SGLT2 Inhibitors** | **Dapagliflozin**, **Empagliflozin** | Osmotic diuresis, reduces cardiac preload/afterload, enhances myocardial energetics. | Effective **regardless of diabetic status**; reduces cardiovascular death and HF hospitalizations. |

---

## 3. Physical Diagnosis of Cardiac Valvular Murmurs

| Valvular Lesion | Murmur Timing, Quality & Location | Radiation & Dynamic Maneuvers | Classic Physical Signs & High-Yield Associations |
| :--- | :--- | :--- | :--- |
| **Aortic Stenosis (AS)** | **Crescendo-Decrescendo Systolic Murmur** at Right 2nd Intercostal Space | Radiates to **Carotid Arteries**; $\\uparrow$ with squatting/leg raise; $\\downarrow$ with Valsalva | • **Pulsus Parvus et Tardus** (slow-rising, weak carotid upstroke).<br>• **SAD Triad**: **S**yncope, **A**ngina, **D**yspnea.<br>• Paradoxically split S2. |
| **Mitral Regurgitation (MR)** | **Holosystolic Blowing High-Pitched Murmur** at Cardiac Apex | Radiates to **Left Axilla**; $\\uparrow$ with handgrip ($\\uparrow$ afterload); $\\downarrow$ with amyl nitrite | • Etiologies: Post-MI papillary muscle rupture, Mitral Valve Prolapse (MVP with mid-systolic click), Rheumatic. |
| **Aortic Regurgitation (AR)** | **Early Diastolic Decrescendo Blowing Murmur** at Left 3rd/4th Sternal Border | $\\uparrow$ with patient **leaning forward in full expiration** and handgrip | • **Austin Flint Murmur** (apical mid-diastolic rumble).<br>• **Water-Hammer (Corrigan) Pulse** with wide pulse pressure.<br>• Head bobbing (**de Musset sign**), nailbed capillary pulsations (**Quincke sign**). |
| **Mitral Stenosis (MS)** | **Opening Snap (OS) followed by Mid-Diastolic Low-Pitched Rumble** at Apex | Best heard in **Left Lateral Decubitus** position using the bell of stethoscope | • **Rheumatic Heart Disease** is the overwhelmingly dominant cause.<br>• Shorter A2-to-OS interval signifies **more severe stenosis**.<br>• Associated with Left Atrial enlargement $\\rightarrow$ **Atrial Fibrillation** and dysphagia/hoarseness (**Ortner syndrome**). |
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male with a history of hypertension presents to the emergency department with 2 hours of crushing substernal chest pressure radiating to his left arm. Electrocardiogram reveals 3 mm ST-segment elevations in leads II, III, and aVF with 2 mm reciprocal ST-segment depressions in leads I and aVL. Blood pressure is 88/54 mmHg, heart rate is 54 bpm, and lungs are completely clear to auscultation bilaterally. A right-sided ECG (V4R) demonstrates 2 mm ST elevation.",
      question: "Which of the following therapeutic interventions is strictly contraindicated in this patient?",
      options: [
        "Intravenous Nitroglycerin infusion",
        "Dual Antiplatelet Therapy (Aspirin + Ticagrelor)",
        "Intravenous Normal Saline fluid bolus",
        "Primary Percutaneous Coronary Intervention (PCI) of the RCA"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient has an acute Inferior STEMI with Right Ventricular (RV) myocardial infarction (ST elevation in lead V4R, hypotension, bradycardia, and clear lung fields). The right ventricle is severely dysfunctional and relies heavily on high venous preload to maintain cardiac output. Nitrates, diuretics, and morphine cause venodilation and profound preload reduction, precipitating catastrophic refractory hypotension and cardiovascular collapse in RV infarction."
    }
  ]
};
