"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalMedicineAdvLabViewer.module.css";
import {
  Activity,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Droplet,
  Calculator,
  TrendingUp,
  Gauge,
  Thermometer,
  Shield,
  Crosshair,
  Pill,
  Brain,
  Scissors,
  Zap,
  Award,
  Flame,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
} from "lucide-react";

export type MedicineLabMode = "acs" | "hfref" | "acidBase" | "aki";

export interface MedicineLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  internalMedicineProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const MEDICINE_LAB_NODES: Record<MedicineLabMode, MedicineLabNode[]> = {
  acs: [
    {
      id: "med-acs-anterior-lad",
      name: "Anterior STEMI LAD Occlusion (V1-V4 ST Elevation & Emergent PCI)",
      category: "Coronary Ischemia",
      subType: "Leads V1-V4 ST Elevation • Left Anterior Descending ('Widow-Maker') • Door-to-Balloon <=90 min",
      internalMedicineProfile: "Transmural ischemic injury of the anterior left ventricular myocardium and interventricular septum.",
      pathophysiologyMechanism: "Atherosclerotic plaque rupture in the LAD with acute occlusive thrombosis; high risk of pump failure.",
      clinicalHallmarks: "Crushing retrosternal chest pain, diaphoresis; complications: cardiogenic shock, VSD, free wall rupture; emergent PCI.",
      highYieldPearls: "Anterior STEMI (LAD) carries the highest risk of cardiogenic shock; primary PCI door-to-balloon target is <=90 minutes."
    },
    {
      id: "med-acs-inferior-rv",
      name: "Inferior STEMI & RV Infarction (RCA Occlusion & V4R Preload Fluid Loading)",
      category: "Coronary Ischemia",
      subType: "Leads II, III, aVF ST Elevation • RCA Culprit • Right-Sided V4R Elevation • AVOID Nitrates/Diuretics!",
      internalMedicineProfile: "Transmural infarction of the inferior LV wall and right ventricular free wall.",
      pathophysiologyMechanism: "Proximal RCA occlusion causes severe RV pump failure; forward output is exquisitely preload-dependent.",
      clinicalHallmarks: "Hypotension, elevated JVP with Kussmaul sign, CLEAR lung fields; treated with IV Saline boluses; NO nitrates/morphine.",
      highYieldPearls: "Right Ventricular Infarction triad: Hypotension + Elevated JVP + Clear Lungs; Nitrates are strictly contraindicated!"
    },
    {
      id: "med-acs-lateral-lcx",
      name: "Lateral Wall Infarct LCx (I, aVL, V5-V6 & Papillary Rupture)",
      category: "Coronary Ischemia",
      subType: "Leads I, aVL, V5-V6 • Left Circumflex (LCx) / Obtuse Marginal • Acute Mitral Regurgitation Risk",
      internalMedicineProfile: "Ischemic necrosis of the anterolateral and posterolateral left ventricular free wall.",
      pathophysiologyMechanism: "LCx occlusion compromising blood supply to the posteromedial or anterolateral papillary muscles.",
      clinicalHallmarks: "Chest pain radiating to left arm; holosystolic apical murmur in acute papillary muscle rupture; urgent surgery.",
      highYieldPearls: "Acute severe mitral regurgitation post-MI presents with sudden pulmonary edema and a new holosystolic apical murmur."
    },
    {
      id: "med-acs-posterior-pda",
      name: "Posterior Wall Infarct PDA (Reciprocal V1-V3 Depressions & Tall R Waves)",
      category: "Coronary Ischemia",
      subType: "Horizontal ST Depressions V1-V3 • Tall R Waves (R/S >1) • Posterior Leads V7-V9 ST Elevation",
      internalMedicineProfile: "Transmural infarction of the posterior wall of the left ventricle supplied by the PDA.",
      pathophysiologyMechanism: "Mirror-image reciprocal ECG changes recorded from standard anterior precordial leads V1-V3.",
      clinicalHallmarks: "Anterior ST depressions with upright T waves; confirmed by obtaining posterior 15-lead ECG (V7-V9 ST elevation >=0.5mm).",
      highYieldPearls: "Horizontal ST depressions in V1-V3 with prominent R waves represent an acute posterior STEMI until proven otherwise."
    }
  ],

  hfref: [
    {
      id: "med-hf-arni-sacubitril",
      name: "ARNI Sacubitril / Valsartan (Neprilysin Inhibition & 36h ACEi Washout)",
      category: "1st GDMT Pillar",
      subType: "Sacubitril/Valsartan (Entresto) • PARADIGM-HF >20% Mortality Reduction • Mandatory 36-Hour Washout from ACEi",
      internalMedicineProfile: "Dual angiotensin receptor blockade and neprilysin inhibition augmenting natriuretic peptides (ANP/BNP).",
      pathophysiologyMechanism: "Inhibits neprilysin degradation of bradykinin/ANP/BNP while selectively blocking angiotensin AT1 receptors.",
      clinicalHallmarks: "First-line replacement for ACEi/ARB in HFrEF (LVEF <=40%); prevents ventricular remodeling and lowers filling pressures.",
      highYieldPearls: "Always enforce a 36-hour washout period when switching from an ACE inhibitor to an ARNI to prevent fatal angioedema."
    },
    {
      id: "med-hf-bb-mortality",
      name: "Evidence-Based Beta-Blockade (Metoprolol Succinate & Carvedilol Titration)",
      category: "2nd GDMT Pillar",
      subType: "Metoprolol Succinate (NOT Tartrate!), Carvedilol, Bisoprolol • >30% Mortality Reduction in HFrEF",
      internalMedicineProfile: "Cardioselective or combined alpha/beta blockade suppressing chronic adrenergic neurotoxicity.",
      pathophysiologyMechanism: "Reverses catecholamine-mediated cardiomyocyte apoptosis, upregulates beta-1 receptors, and reduces sudden cardiac death.",
      clinicalHallmarks: "Initiate only in stable, euvolemic patients; start at micro-doses and uptitrate every 2-4 weeks to target trial doses.",
      highYieldPearls: "Only Metoprolol Succinate (extended-release), Carvedilol, and Bisoprolol have proven mortality benefits in HFrEF."
    },
    {
      id: "med-hf-mra-spironolactone",
      name: "Mineralocorticoid Antagonism (Spironolactone Aldosterone Blockade)",
      category: "3rd GDMT Pillar",
      subType: "Spironolactone / Eplerenone • RALES & EMPHASIS-HF >30% Mortality Reduction • Monitor K+ and Creatinine",
      internalMedicineProfile: "Competitive aldosterone receptor antagonist preventing myocardial and vascular collagen fibrosis.",
      pathophysiologyMechanism: "Blocks aldosterone-driven sodium retention, potassium wasting, and progressive interstitial myocardial fibrosis.",
      clinicalHallmarks: "Add to ARNI + Beta-blocker in LVEF <=40%; caution if serum potassium >5.0 mEq/L or eGFR <30 mL/min/1.73m2.",
      highYieldPearls: "Spironolactone reduces all-cause mortality in HFrEF; monitor serum potassium and renal function at 1, 4, and 12 weeks."
    },
    {
      id: "med-hf-sglt2i-dapagliflozin",
      name: "SGLT2 Inhibitor Cardiorenal Protection (Dapagliflozin Osmotic Diuresis)",
      category: "4th GDMT Pillar",
      subType: "Dapagliflozin (Farxiga) / Empagliflozin (Jardiance) • DAPA-HF >25% Reduction in Death/Hosp • Effective in Non-Diabetics",
      internalMedicineProfile: "Proximal tubular SGLT2 transporter inhibitor promoting glycosuria, natriuresis, and metabolic efficiency.",
      pathophysiologyMechanism: "Reduces cardiac preload/afterload, improves myocardial energetics (ketone utilization), and protects nephron hemodynamics.",
      clinicalHallmarks: "Initiated in all HFrEF patients regardless of glycemic status; negligible hypoglycemia risk; reduces cardiovascular death.",
      highYieldPearls: "SGLT2 inhibitors provide proven mortality benefit in HFrEF and chronic kidney disease in both diabetic and non-diabetic patients."
    }
  ],

  acidBase: [
    {
      id: "med-ab-hagma-goldmark",
      name: "High Anion Gap Metabolic Acidosis (GOLD MARK Anion Gap & Albumin Correction)",
      category: "Metabolic Disturbance",
      subType: "AG = Na - (Cl + HCO3) > 12 • Albumin Correction (+2.5 per 1 g/dL drop) • DKA, L-Lactate, Toxic Alcohols",
      internalMedicineProfile: "Accumulation of unmeasured organic and inorganic anions consuming extracellular bicarbonate buffer.",
      pathophysiologyMechanism: "Excess fixed acid production (ketoacids, lactic acid, formic acid) exceeds renal hydrogen ion excretory capacity.",
      clinicalHallmarks: "Kussmaul hyperventilation; calculate albumin-corrected anion gap to avoid missing occult HAGMA in hypoalbuminemia.",
      highYieldPearls: "Always correct the anion gap for serum albumin: for every 1 g/dL drop in albumin below 4.0, add 2.5 mEq/L to the calculated AG."
    },
    {
      id: "med-ab-winters-compensation",
      name: "Respiratory Compensation (Winter's Formula PaCO2 Equilibrium)",
      category: "Acid-Base Compensation",
      subType: "Expected PaCO2 = 1.5 * [HCO3-] + 8 (+/- 2) • Evaluates Adequacy of Medullary Respiratory Response",
      internalMedicineProfile: "Chemoreceptor-driven alveolar hyperventilation lowering PaCO2 to restore arterial blood pH toward 7.40.",
      pathophysiologyMechanism: "Peripheral carotid and central medullary chemoreceptors sense extracellular H+ and trigger tachypnea.",
      clinicalHallmarks: "If actual PaCO2 > expected: concurrent Respiratory Acidosis; if actual PaCO2 < expected: concurrent Respiratory Alkalosis.",
      highYieldPearls: "Winter's formula evaluates respiratory compensation in metabolic acidosis: Expected PaCO2 = 1.5 * [HCO3-] + 8 (+/- 2)."
    },
    {
      id: "med-ab-delta-delta-ratio",
      name: "Delta-Delta Ratio Mixed Disturbances (HAGMA + Metabolic Alkalosis / NAGMA)",
      category: "Mixed Acid-Base",
      subType: "Delta-Delta = (AG - 12) / (24 - HCO3) • <0.4-0.8 (Mixed HAGMA + NAGMA) • >2.0 (HAGMA + Metabolic Alkalosis)",
      internalMedicineProfile: "Mathematical comparison of the increase in unmeasured anions relative to the decrease in serum bicarbonate.",
      pathophysiologyMechanism: "In pure HAGMA, 1 mEq of unmeasured acid titrates exactly 1 mEq of HCO3- (Delta-Delta = 1.0 to 2.0).",
      clinicalHallmarks: "Delta-Delta >2.0 proves concurrent Metabolic Alkalosis (e.g., DKA + Vomiting); <0.4-0.8 proves concurrent NAGMA (e.g., DKA + Diarrhea).",
      highYieldPearls: "A Delta-Delta ratio >2.0 indicates a mixed High Anion Gap Metabolic Acidosis PLUS Metabolic Alkalosis."
    },
    {
      id: "med-ab-osmolar-gap-alcohols",
      name: "Toxic Alcohol Osmolar Gap (Methanol & Ethylene Glycol Ingestions)",
      category: "Toxic Acid-Base",
      subType: "Calculated Osm = 2*Na + Glucose/18 + BUN/2.8 • Osmolar Gap = Measured - Calculated > 10 • Fomepizole Antidote",
      internalMedicineProfile: "Presence of low-molecular-weight uncharged toxic xenobiotics exerting significant colligative osmotic pressure.",
      pathophysiologyMechanism: "Methanol forms formic acid (optic papillitis); Ethylene glycol forms oxalic acid (calcium oxalate monohydrate AKI).",
      clinicalHallmarks: "Severe HAGMA + Osmolar gap >10 mOsm/kg; antidote: IV Fomepizole (alcohol dehydrogenase inhibitor) + emergent hemodialysis.",
      highYieldPearls: "An elevated Osmolar Gap (>10 mOsm/kg) in the presence of severe HAGMA is diagnostic of toxic alcohol ingestion (Fomepizole DOC)."
    }
  ],

  aki: [
    {
      id: "med-aki-kdigo-staging",
      name: "KDIGO Acute Kidney Injury Staging (Stages 1-3 Creatinine & Oliguria Criteria)",
      category: "Renal Failure Staging",
      subType: "Stage 1 (1.5-1.9x Cr / >=0.3 mg/dL) • Stage 2 (2.0-2.9x Cr) • Stage 3 (>=3.0x Cr / >=4.0 mg/dL / RRT)",
      internalMedicineProfile: "Consensus clinical criteria defining the severity, trajectory, and dialysis requirement of acute renal injury.",
      pathophysiologyMechanism: "Sudden decrement in glomerular filtration rate resulting in nitrogenous waste accumulation (uremia) and dyselectrolytemia.",
      clinicalHallmarks: "Oliguria (<0.5 mL/kg/h for >6h) is an early, sensitive warning sign preceding serum creatinine elevations by 24-48h.",
      highYieldPearls: "KDIGO Stage 3 AKI is defined by a >=3.0x rise in creatinine from baseline, creatinine >=4.0 mg/dL, or need for dialysis."
    },
    {
      id: "med-aki-prerenal-azotemia",
      name: "Prerenal Azotemia Hemodynamics (FeNa <1% & Concentrated Urine)",
      category: "Prerenal Pathology",
      subType: "BUN/Cr > 20:1 • FeNa < 1% • FeUrea < 35% • Urine Osmolality > 500 mOsm/kg • Hyaline Casts Alone",
      internalMedicineProfile: "Functional decrease in renal perfusion with structurally intact, maximally conserving tubular epithelium.",
      pathophysiologyMechanism: "Hypovolemia triggers intense RAAS and ADH activation, driving maximal proximal sodium and water reabsorption.",
      clinicalHallmarks: "Dehydration, hemorrhage, heart failure, sepsis; rapid normalization of serum creatinine following isotonic crystalloid resuscitation.",
      highYieldPearls: "Prerenal azotemia is characterized by intact tubular function: FeNa <1%, FeUrea <35%, UNa <20, and BUN/Cr >20:1."
    },
    {
      id: "med-aki-atn-muddy-brown",
      name: "Ischemic Acute Tubular Necrosis (FeNa >2% & Muddy Brown Granular Casts)",
      category: "Intrinsic Renal",
      subType: "BUN/Cr < 15:1 • FeNa > 2% • Urine Osmolality < 350 mOsm/kg • Sloughed Muddy Brown Granular Casts",
      internalMedicineProfile: "Structural necrosis and sloughing of renal tubular epithelial cells into tubular lumens.",
      pathophysiologyMechanism: "Severe ischemia (shock) or nephrotoxins (aminoglycosides, cisplatin) cause loss of tubular polarity and cell necrosis.",
      clinicalHallmarks: "Fixed isosthenuria (urine osm ~300 mOsm/kg), high urine sodium (UNa >40 mEq/L), pathognomonic muddy brown granular casts.",
      highYieldPearls: "Muddy brown granular casts and a FeNa >2% are diagnostic of Acute Tubular Necrosis (ATN)."
    },
    {
      id: "med-aki-ain-allergic-wbc",
      name: "Acute Interstitial Nephritis (Drug-Induced Allergic WBC Casts & Eosinophils)",
      category: "Tubulointerstitial",
      subType: "NSAIDs, Penicillins, PPIs • Triad: Fever, Rash, Arthralgias • WBC Casts • Sterile Pyuria & Eosinophiluria",
      internalMedicineProfile: "Type IV hypersensitivity and immune-mediated inflammatory infiltration of the renal interstitium.",
      pathophysiologyMechanism: "Hapten-like drug binding to tubular basement membrane triggers CD4+ T-cell and eosinophilic tubulointerstitial nephritis.",
      clinicalHallmarks: "Urine microscopy shows White Blood Cell (WBC) casts with sterile urine cultures; first-line therapy is immediate drug cessation.",
      highYieldPearls: "White Blood Cell (WBC) casts in the absence of bacterial urinary tract infection indicate Acute Interstitial Nephritis (AIN)."
    }
  ]
};

interface ClinicalMedicineAdvLabViewerProps {
  initialMode?: MedicineLabMode;
  height?: string;
  onNodeSelect?: (node: MedicineLabNode) => void;
}

export default function ClinicalMedicineAdvLabViewer({
  initialMode = "acs",
  height = "560px",
  onNodeSelect,
}: ClinicalMedicineAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<MedicineLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // ACS Profiler State
  const [selectedAcs, setSelectedAcs] = useState<"ant" | "inf" | "lat" | "post">("inf");

  // GDMT Profiler State
  const [selectedGdmt, setSelectedGdmt] = useState<"arni" | "bb" | "mra" | "sglt2i">("arni");

  const acsDetails = useMemo(() => {
    if (selectedAcs === "ant") {
      return {
        title: "Anterior STEMI: Left Anterior Descending (LAD) Occlusion",
        indices: "ST Elevation in V1-V4 • 'Widow-Maker' Infarct • Door-to-Balloon Time <= 90 min",
        rx: "Immediate Primary PCI + Dual Antiplatelet Therapy (Aspirin + Ticagrelor) + IV Heparin + High-Intensity Statin",
        pearl: "Anterior STEMI has the highest incidence of cardiogenic shock, free wall rupture, and ventricular arrhythmias."
      };
    } else if (selectedAcs === "inf") {
      return {
        title: "Inferior STEMI & Right Ventricular (RV) Infarction",
        indices: "ST Elevation in II, III, aVF • Right Coronary Artery (RCA) • Right-Sided V4R ST Elevation",
        rx: "Aggressive IV Isotonic Crystalloid (Normal Saline) Boluses; STRICTLY AVOID Nitrates, Morphine, and Diuretics!",
        pearl: "The RV Infarction triad is Hypotension, Elevated JVP, and Clear Lungs; venodilators trigger fatal shock."
      };
    } else if (selectedAcs === "lat") {
      return {
        title: "Lateral STEMI: Left Circumflex (LCx) Occlusion",
        indices: "ST Elevation in Leads I, aVL, V5-V6 • Papillary Muscle Blood Supply",
        rx: "Primary PCI / Anticoagulation; Monitor for Acute Severe Mitral Regurgitation (Holosystolic Murmur)",
        pearl: "Papillary muscle rupture presents with sudden pulmonary edema and a harsh new holosystolic apical murmur."
      };
    } else {
      return {
        title: "Posterior STEMI: Posterior Descending Artery (PDA) Occlusion",
        indices: "Horizontal ST Depressions in V1-V3 with Tall R Waves (R/S >1) • Posterior Leads V7-V9 ST Elevation",
        rx: "Emergency Primary PCI; Obtain 15-lead posterior ECG to confirm V7-V9 ST-segment elevations",
        pearl: "Anterior ST depressions with prominent R waves represent posterior transmural infarction until proven otherwise."
      };
    }
  }, [selectedAcs]);

  const gdmtDetails = useMemo(() => {
    if (selectedGdmt === "arni") {
      return {
        title: "Pillar 1: ARNI (Sacubitril / Valsartan)",
        indices: "Neprilysin Inhibitor + ARB • PARADIGM-HF >20% Mortality Reduction • Mandatory 36-Hour Washout from ACEi",
        rx: "Titrate to target dose 97/103 mg BID; withhold ACEi for 36 hours prior to initiation to prevent angioedema",
        pearl: "Sacubitril/Valsartan is first-line over ACEi/ARB for all patients with HFrEF (LVEF <=40%)."
      };
    } else if (selectedGdmt === "bb") {
      return {
        title: "Pillar 2: Evidence-Based Beta-Blockers",
        indices: "Metoprolol Succinate (NOT Tartrate!), Carvedilol, Bisoprolol • >30% Mortality Reduction",
        rx: "Initiate only in euvolemic patients; start low and double dose every 2-4 weeks to target trial doses",
        pearl: "Only Metoprolol Succinate, Carvedilol, and Bisoprolol have proven mortality benefits in HFrEF."
      };
    } else if (selectedGdmt === "mra") {
      return {
        title: "Pillar 3: Mineralocorticoid Receptor Antagonists",
        indices: "Spironolactone / Eplerenone • RALES >30% Mortality Reduction • Monitor K+ and Creatinine",
        rx: "Add Spironolactone 25 mg daily; check BMP at 1, 4, and 12 weeks; avoid if K+ >5.0 or eGFR <30",
        pearl: "MRA therapy blocks aldosterone-mediated myocardial fibrosis and reduces sudden cardiac death in HFrEF."
      };
    } else {
      return {
        title: "Pillar 4: SGLT2 Inhibitors",
        indices: "Dapagliflozin / Empagliflozin • DAPA-HF >25% Reduction in CV Death/HF Hosp • Non-Diabetic Benefit",
        rx: "Add Dapagliflozin 10 mg once daily; no dose titration required; excellent cardiorenal protection",
        pearl: "SGLT2 inhibitors reduce mortality in HFrEF and CKD in both diabetic and non-diabetic patients."
      };
    }
  }, [selectedGdmt]);

  const currentNodes = useMemo(() => {
    return MEDICINE_LAB_NODES[activeMode] || MEDICINE_LAB_NODES.acs;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: MedicineLabNode) => {
    if (isQuizMode && quizTargetNodeId) {
      if (node.id === quizTargetNodeId) {
        setQuizScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        setQuizFeedback(`Correct! You identified ${node.name}.`);
        setTimeout(() => nextQuizQuestion(), 1500);
      } else {
        setQuizScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
        setQuizFeedback(`Incorrect. Find ${currentNodes.find((n) => n.id === quizTargetNodeId)?.name}.`);
      }
    } else {
      setActiveNodeId(node.id);
      if (onNodeSelect) {
        onNodeSelect(node);
      }
    }
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    const randomNode = currentNodes[Math.floor(Math.random() * currentNodes.length)];
    setQuizTargetNodeId(randomNode.id);
    setQuizFeedback(null);
  };

  const nextQuizQuestion = () => {
    const randomNode = currentNodes[Math.floor(Math.random() * currentNodes.length)];
    setQuizTargetNodeId(randomNode.id);
    setQuizFeedback(null);
  };

  const toggleQuizMode = () => {
    if (!isQuizMode) {
      startQuiz();
    } else {
      setIsQuizMode(false);
      setQuizTargetNodeId(null);
      setQuizFeedback(null);
    }
  };

  const quizTargetNode = useMemo(() => {
    return currentNodes.find((n) => n.id === quizTargetNodeId) || null;
  }, [currentNodes, quizTargetNodeId]);

  return (
    <div
      className={styles.container}
      style={{ height: isFullscreen ? "100vh" : "auto" }}
    >
      {/* Top Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.titleArea}>
          <span className={styles.modeBadge}>
            <HeartPulse size={14} /> MED-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "acs" && "Acute Coronary Syndromes (ACS): ECG Localization, Primary PCI & RV Infarct Preload"}
            {activeMode === "hfref" && "Heart Failure with Reduced Ejection Fraction (HFrEF): 4-Pillar GDMT Optimization"}
            {activeMode === "acidBase" && "Advanced Acid-Base & ABG Interpretation: Winter's Formula, Delta-Delta & Osmolar Gap"}
            {activeMode === "aki" && "Acute Kidney Injury (AKI): KDIGO Staging, FeNa / FeUrea & Urinary Sediment Diagnostics"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Medicine Diagnostic Quiz"}
          </button>

          <button
            className={styles.btn}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className={styles.mainLayout}>
        {/* Left Side: Interactive Lab Workspaces */}
        <div className={styles.labCanvas}>
          {/* Quiz Prompt Banner */}
          {isQuizMode && quizTargetNode && (
            <div className={styles.quizBanner}>
              <div>
                <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Internal Medicine Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Pathology / Intervention: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-sky-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-sky-950 text-xs rounded border border-sky-700 text-sky-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: ACS & ECG Territory Locator */}
          {activeMode === "acs" && (
            <div className={styles.medCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Acute Coronary Syndrome ECG Culprit &amp; Infarct Territory Locator
                </span>
                <span className="text-[11px] text-slate-400">Anterior (LAD) &bull; Inferior (RCA) &bull; Lateral (LCx) &bull; Posterior (PDA)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedAcs("ant")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAcs === "ant"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Anterior LAD (V1-V4)
                </button>
                <button
                  onClick={() => setSelectedAcs("inf")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAcs === "inf"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🎯 Inferior RCA (II, III, aVF)
                </button>
                <button
                  onClick={() => setSelectedAcs("lat")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAcs === "lat"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧱 Lateral LCx (I, aVL, V5-6)
                </button>
                <button
                  onClick={() => setSelectedAcs("post")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAcs === "post"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🛡️ Posterior PDA (V7-V9)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-sky-300">{acsDetails.title}</div>
                <div className="text-cyan-400 font-bold mt-1">{acsDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-sky-400">Emergent Protocol:</strong> {acsDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Cardiology Rule:</strong> {acsDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: HFrEF 4-Pillar GDMT */}
          {activeMode === "hfref" && (
            <div className={styles.medCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> The 4 Foundational Pillars of GDMT in HFrEF (LVEF &le; 40%)
                </span>
                <span className="text-[11px] text-slate-400">ARNI &bull; Beta-Blocker &bull; MRA &bull; SGLT2i</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedGdmt("arni")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGdmt === "arni"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💊 1. ARNI (Entresto)
                </button>
                <button
                  onClick={() => setSelectedGdmt("bb")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGdmt === "bb"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ❤️ 2. Beta-Blocker
                </button>
                <button
                  onClick={() => setSelectedGdmt("mra")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGdmt === "mra"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💧 3. MRA (Spironolactone)
                </button>
                <button
                  onClick={() => setSelectedGdmt("sglt2i")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGdmt === "sglt2i"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🛡️ 4. SGLT2i (Dapagliflozin)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-sky-300">{gdmtDetails.title}</div>
                <div className="text-cyan-400 font-bold mt-1">{gdmtDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-sky-400">Guideline Protocol:</strong> {gdmtDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Mortality Pearl:</strong> {gdmtDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Advanced Acid-Base & ABG */}
          {activeMode === "acidBase" && (
            <div className={styles.medCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> 5-Step Systematic Acid-Base &amp; ABG Analysis
                </span>
                <span className="text-[11px] text-slate-400">pH &bull; Anion Gap &bull; Winter's Formula &bull; Delta-Delta Ratio</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Winter's Formula &amp; Delta-Delta Ratio</div>
                  <div className="text-slate-300 mt-1">Expected PaCO2 = 1.5 * [HCO3-] + 8 &plusmn; 2 evaluates respiratory compensation. Delta-Delta ratio = (AG - 12) / (24 - HCO3-): &lt;0.4-0.8 indicates combined HAGMA + NAGMA; 1.0-2.0 indicates pure HAGMA; &gt;2.0 proves concurrent Metabolic Alkalosis (e.g., DKA + vomiting).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Albumin Correction &amp; Osmolar Gap</div>
                  <div className="text-slate-300 mt-1">Corrected AG = Calculated AG + 2.5 * (4.0 - Albumin). Osmolar gap = Measured Osm - (2*Na + Glucose/18 + BUN/2.8). An osmolar gap &gt;10 mOsm/kg in HAGMA confirms toxic alcohol ingestion (Methanol, Ethylene glycol; treat with Fomepizole).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Acute Kidney Injury */}
          {activeMode === "aki" && (
            <div className={styles.medCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Acute Kidney Injury: KDIGO Staging &amp; Urinary Differentials
                </span>
                <span className="text-[11px] text-slate-400">Prerenal (FeNa &lt;1%) &bull; ATN (Muddy Brown Casts) &bull; AIN (WBC Casts)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Prerenal Azotemia vs Ischemic ATN</div>
                  <div className="text-slate-300 mt-1">Prerenal features intact tubules: BUN/Cr &gt;20:1, FeNa &lt;1%, FeUrea &lt;35%, and hyaline casts; normalizes with IV fluids. ATN features necrotic tubules: BUN/Cr &lt;15:1, FeNa &gt;2%, isosthenuria, and pathognomonic 'muddy brown' coarse granular casts.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Acute Interstitial Nephritis (AIN) &amp; KDIGO 3</div>
                  <div className="text-slate-300 mt-1">Drug-induced AIN (NSAIDs, penicillins, PPIs) presents with fever, rash, eosinophiluria, and White Blood Cell (WBC) casts with sterile cultures. KDIGO Stage 3 AKI requires &ge;3.0x baseline creatinine, creatinine &ge;4.0 mg/dL, or renal replacement therapy.</div>
                </div>
              </div>
            </div>
          )}

          {/* Node Selection Grid */}
          <div className={styles.nodeGrid}>
            {currentNodes.map((node) => {
              const isSelected = activeNode.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`${styles.nodeCard} ${isSelected ? styles.nodeCardSelected : ""}`}
                >
                  <div className={styles.nodeHeader}>
                    <span className={styles.categoryBadge}>{node.category}</span>
                  </div>

                  <div>
                    <div className={styles.nodeTitle}>{node.name}</div>
                    <div className={styles.nodeSub}>{node.subType}</div>
                  </div>

                  <div className="text-[11px] text-slate-300 font-medium bg-slate-950/60 p-2 rounded border border-slate-800">
                    <span className="text-sky-400 font-bold">Medicine:</span> {node.internalMedicineProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect clinical protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Medicine Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Medicine Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Entity / Syndrome</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Pathophysiology &amp; Biomarkers</div>
            <div className="text-xs text-sky-300 font-semibold">{activeNode.internalMedicineProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Medicine Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("acs")}
          className={`${styles.modeTab} ${activeMode === "acs" ? styles.modeTabActive : ""}`}
        >
          🫀 1. ACS &amp; ECG Locator
        </button>
        <button
          onClick={() => setActiveMode("hfref")}
          className={`${styles.modeTab} ${activeMode === "hfref" ? styles.modeTabActive : ""}`}
        >
          💊 2. HFrEF 4-Pillar GDMT
        </button>
        <button
          onClick={() => setActiveMode("acidBase")}
          className={`${styles.modeTab} ${activeMode === "acidBase" ? styles.modeTabActive : ""}`}
        >
          🧪 3. Advanced ABG Algorithm
        </button>
        <button
          onClick={() => setActiveMode("aki")}
          className={`${styles.modeTab} ${activeMode === "aki" ? styles.modeTabActive : ""}`}
        >
          💧 4. AKI KDIGO &amp; FeNa
        </button>
      </div>
    </div>
  );
}
