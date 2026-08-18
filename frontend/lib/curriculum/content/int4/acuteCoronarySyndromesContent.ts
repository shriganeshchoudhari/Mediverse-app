/**
 * Internship Core Clinical Postings: Acute Coronary Syndromes & Inpatient Cardiology Consults
 * Authoritative cardiology content derived from AHA/ACC Guidelines 2025, Harrison's Principles.
 * Mapped to NMC CBME Competencies: IN4.1, IM4.1, CD4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_CORONARY_SYNDROMES_MODULE: PhysiologyLessonModule = {
  id: "int4-acute-coronary-syndromes",
  unitCode: "IN4.1",
  title: "Acute Coronary Syndromes: STEMI Reperfusion Timelines (<=90m Door-to-Balloon), NSTEMI Risk Stratification & Dual Antiplatelet Therapy",
  competencies: ["IN4.1", "IM4.1", "CD4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Acute Coronary Syndromes (ACS): STEMI Reperfusion & Inpatient Cardiology Protocols

Rapid triage, emergency catheterization lab activation, and dual antiplatelet/anticoagulant regimens minimize infarct size and prevent ischemic re-infarction.

---

## 1. STEMI vs NSTEMI / Unstable Angina Reperfusion Pathways

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Presentation} & \\textbf{ECG \u0026 Biomarker Criteria} & \\textbf{Primary Reperfusion Strategy} & \\textbf{Mandated Time Benchmarks} \\\\
\\hline
\\textbf{ST-Elevation MI} & \\mathbf{\\text{New ST elevation } \\ge 1\\text{ mm in } \\ge 2} & \\mathbf{\\text{Primary Percutaneous Coronary}} & \\mathbf{\\text{Door-to-Balloon Time } \\le 90\\text{ min}} \\\\
(\\textbf{STEMI}) & \\text{contiguous leads (}\\ge 2\\text{ mm V2-V3) or new LBBB} & \\mathbf{\\text{Intervention (PCI) in Cath Lab}} & (\\le 120\\text{ min if transfer needed}) \\\\
\\textbf{STEMI (Non-PCI Center)} & \\text{PCI center transfer exceeds } > 120\\text{ min} & \\mathbf{\\text{Intravenous Fibrinolysis}} & \\mathbf{\\text{Door-to-Needle Time } \\le 30\\text{ min}} \\\\
& & (\\text{Tenecteplase / Alteplase}) & \\\\
\\textbf{NSTEMI / High-Risk} & \\text{ST depression, T-wave inversion,} & \\mathbf{\\text{Early Invasive Strategy (Cath Lab)}} & \\mathbf{\\text{Urgent angiography } \\le 24\\text{ hours}} \\\\
\\textbf{Unstable Angina} & \\text{elevated troponin; GRACE } > 140 & \\text{with coronary stenting} & (\\le 2\\text{ hours if refractory/shock}) \\\\
\\hline
\\end{array}$$

---

## 2. Inpatient Antiplatelet, Anticoagulant & Medical Therapy

$$\\begin{array}{lcccc}
\\hline
\\textbf{Drug Class} & \\textbf{Agent \u0026 Inpatient Dosing} & \\textbf{Mechanism of Action} & \\textbf{Clinical Safety Precautions} \\\\
\\hline
\\textbf{Aspirin (COX-1)} & 325\\text{ mg chewable load } \\rightarrow 81\\text{ mg daily} & \\text{Irreversible platelet COX-1 inhibition;} & \\text{Lifelong secondary prevention} \\\\
& & \\text{blocks thromboxane } A_2\\text{ production} & \\\\
\\textbf{P2Y12 Inhibitor} & \\mathbf{\\text{Ticagrelor } 180\\text{ mg load } \\rightarrow 90\\text{ mg BID or}} & \\text{ADP P2Y12 receptor blockade;} & \\mathbf{\\text{Prasugrel is STRICTLY CONTRAINDICATED}} \\\\
& \\mathbf{\\text{Prasugrel } 60\\text{ mg load } \\rightarrow 10\\text{ mg daily}} & \\text{inhibits platelet aggregation} & \\mathbf{\\text{in patients with prior stroke or TIA}} \\\\
\\textbf{Anticoagulation} & \\text{Unfractionated Heparin (60 U/kg bolus,} & \\text{Antithrombin III cofactor activation;} & \\text{Monitor aPTT (target 50-70 seconds);} \\\\
& 12\\text{ U/kg/hr) or Enoxaparin } 1\\text{ mg/kg q12h} & \\text{inhibits thrombin and factor Xa} & \\text{stop heparin immediately after PCI} \\\\
\\textbf{High-Intensity Statin} & \\mathbf{\\text{Atorvastatin } 80\\text{ mg daily}} & \\text{HMG-CoA reductase inhibitor;} & \\text{Plaque stabilization, anti-inflammatory,} \\\\
& (\\text{or Rosuvastatin } 40\\text{ mg daily}) & \\text{endothelial stabilization} & \\text{initiate prior to hospital discharge} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male with a history of hypertension and heavy smoking presents to the emergency department with 90 minutes of crushing substernal chest pressure radiating to his left jaw and diaphoresis. An ECG performed within 6 minutes of arrival demonstrates 3.5 mm ST elevations in leads II, III, and aVF with reciprocal ST depressions in leads I and aVL. His blood pressure is 134/86 mmHg and pulse is 78 bpm. The hospital has a 24/7 cardiac catheterization laboratory available on site.",
      question: "What is the diagnosis, the primary reperfusion benchmark, and the required inpatient dual antiplatelet loading regimen?",
      options: [
        "Acute Inferior STEMI; immediate transfer to the cardiac catheterization laboratory for Primary Percutaneous Coronary Intervention (PCI) with a target Door-to-Balloon time <=90 minutes; administer Aspirin (325 mg chewable) PLUS a potent P2Y12 inhibitor (Ticagrelor 180 mg load or Prasugrel 60 mg load, provided no prior stroke/TIA history) PLUS anticoagulation (Unfractionated Heparin) PLUS high-intensity Atorvastatin (80 mg)",
        "NSTEMI; administer oral beta-blockers and schedule an elective stress test in 72 hours",
        "Costochondritis; discharge on high-dose oral ibuprofen and acetaminophen",
        "Acute STEMI; administer intravenous Alteplase immediately despite having an on-site catheterization lab"
      ],
      correctAnswerIndex: 0,
      explanation: "This case presents an acute ST-elevation myocardial infarction (STEMI): (1) ECG Diagnosis: ST elevations >=1 mm in >=2 contiguous inferior leads (II, III, aVF) confirm acute transmural Inferior STEMI; (2) Reperfusion Target: When a 24/7 PCI-capable laboratory is available on-site, Primary PCI is the gold standard reperfusion modality with a mandated Door-to-Balloon time <=90 minutes; (3) Pharmacotherapy Bundle: Immediate loading with chewable Aspirin 325 mg + potent P2Y12 inhibitor (Ticagrelor 180 mg or Prasugrel 60 mg) + Unfractionated Heparin bolus + Atorvastatin 80 mg significantly reduces mortality and stent thrombosis."
    }
  ]
};
