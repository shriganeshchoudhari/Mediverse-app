/**
 * Postgraduate Advanced Pediatrics & NICU: Neonatal HIE & Therapeutic Hypothermia
 * Authoritative neonatology content derived from TOBY / NICHD Hypothermia Trials, Volpe's Neurology of the Newborn.
 * Mapped to NMC PG CBME Competencies: PG4.1, PE1.1, PE1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEONATAL_HIE_THERAPEUTIC_HYPOTHERMIA_MODULE: PhysiologyLessonModule = {
  id: "pg4-neonatal-hie-therapeutic-hypothermia",
  unitCode: "PG4.1",
  title: "Neonatal Hypoxic-Ischemic Encephalopathy (HIE): Sarnat Staging, 72h Therapeutic Hypothermia & aEEG",
  competencies: ["PG4.1", "PE1.1", "PE1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Neonatal Hypoxic-Ischemic Encephalopathy (HIE) & Hypothermia

Therapeutic hypothermia initiated within the 6-hour therapeutic window interrupts secondary neurotoxic cascades and reduces death and severe cerebral palsy.

---

## 1. Sarnat Clinical Staging of Neonatal Encephalopathy

$$\\begin{array}{lcccc}
\\hline
\\textbf{Sarnat Stage} & \\textbf{Level of Consciousness & Tone} & \\textbf{Seizures / Reflexes} & \\textbf{aEEG / Long-Term Outcome} \\\\
\\hline
\\textbf{Stage 1: Mild} & \\text{Hyperalert, jittery, normal/increased tone} & \\mathbf{\\text{No seizures; exaggerated Moro}} & \\text{Normal background; } \\mathbf{100\\% \\text{ normal outcome}} \\\\
\\textbf{Stage 2: Moderate} & \\mathbf{\\text{Lethargic, marked hypotonia, miosis}} & \\mathbf{\\text{Frequent seizures; weak Moro/suck}} & \\mathbf{\\text{Discontinuous / Burst suppression; } 25\\% \\text{ disability}} \\\\
\\textbf{Stage 3: Severe} & \\mathbf{\\text{Stuporous / Comatose, flaccid, mydriasis}} & \\mathbf{\\text{Absent reflexes; status epilepticus}} & \\mathbf{\\text{Low voltage / Isoelectric; } >50\\% \\text{ mortality & CP}} \\\\
\\hline
\\end{array}$$

---

## 2. Therapeutic Hypothermia Eligibility & Protocol (TOBY / NICHD)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Protocol Step} & \\textbf{Clinical Standard / Target Goal} & \\textbf{Physiological Rationale} \\\\
\\hline
\\textbf{Inclusion Criteria} & \\mathbf{\\text{GA } \\ge 36\\text{ wks, Birth Wt } \\ge 1{,}800\\text{ g, Age } \\le 6\\text{ hours;}} & \\text{Intervenes during latent phase before secondary} \\\\
& \\mathbf{\\text{Cord/1h pH } \\le 7.00\\text{ or Base Deficit } \\ge 16\\text{ mEq/L}} & \\text{mitochondrial and apoptotic energy failure} \\\\
\\textbf{Target Core Temp} & \\mathbf{33.5^{\\circ}\\text{C (Range: } 33.0 - 34.0^{\\circ}\\text{C)}} & \\text{Suppresses glutamate release, NO synthase, apoptosis} \\\\
\\textbf{Cooling Duration} & \\mathbf{72\\text{ consecutive hours}} & \\text{Maintains neuroprotection through secondary phase} \\\\
\\textbf{Rewarming Protocol} & \\mathbf{\\text{Controlled slow rewarming at } \\le 0.5^{\\circ}\\text{C / hour}} & \\mathbf{\\text{Prevents rebound seizures, hypotension & ICH}} \\\\
& \\mathbf{(\\ge 6\\text{ hours total rewarming time)}} & \\\\
\\hline
\\end{array}$$

---

## 3. Physiological Effects & Multisystem Monitoring During Cooling

- **Cardiovascular**: Physiological sinus bradycardia ($80-100\\text{ bpm}$) is expected and protective; only treat if accompanied by hypotension (MAP $<35-40\\text{ mmHg}$).
- **Hematology**: Mild thrombocytopenia and coagulopathy.
- **Dermatology**: Monitor for subcutaneous fat necrosis (firm, erythematous violaceous plaques).
`,
  clinicalVignettes: [
    {
      scenario: "A male infant is born at 39 weeks gestation following an emergent cesarean section for acute placental abruption and fetal bradycardia. Apgar scores are 2 at 1 minute, 3 at 5 minutes, and 4 at 10 minutes. Umbilical arterial blood gas shows: pH 6.92, Base Deficit -18 mEq/L, and Lactate 14 mmol/L. At 90 minutes of life in the NICU, the infant is lethargic with marked generalized hypotonia, weak suck, constricted pupils, and amplitude-integrated EEG (aEEG) shows a discontinuous background with intermittent electrographic seizure bursts.",
      question: "What Sarnat encephalopathy grade is present, and what is the exact therapeutic hypothermia cooling target and duration?",
      options: [
        "Sarnat Stage 2 (Moderate) HIE; the infant meets all criteria for therapeutic hypothermia (GA >=36 weeks, age <=6h, cord pH <=7.00 / base deficit >=16, and moderate encephalopathy); initiate whole-body cooling immediately to a target rectal/esophageal core temperature of 33.5°C (33.0-34.0°C) for 72 consecutive hours, followed by slow controlled rewarming at <=0.5°C per hour over at least 6 hours",
        "Sarnat Stage 1; discharge home with outpatient follow-up",
        "Sarnat Stage 3; cooling is contraindicated; warm to 38.5°C",
        "Cool to 28°C for 24 hours only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates gold-standard management of neonatal HIE: (1) Sarnat Grading: Lethargy, hypotonia, weak reflexes, and aEEG burst suppression confirm Moderate (Stage 2) HIE; (2) Therapeutic Window: Hypothermia must be initiated within <=6 hours of birth to block secondary energy failure; (3) Protocol Targets: Target core temperature is precisely 33.5°C (33.0-34.0°C) for 72 hours, followed by slow rewarming at <=0.5°C/hour over >=6 hours to prevent cerebral reperfusion injury and rebound seizures."
    }
  ]
};
