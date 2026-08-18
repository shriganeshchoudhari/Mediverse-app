"use client";

import React, { useState, useMemo } from "react";
import styles from "./MedicineLabViewer.module.css";
import {
  Activity,
  Flame,
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Stethoscope,
  Heart,
  Wind,
  Droplet,
  Calculator,
  TrendingUp,
} from "lucide-react";

export type MedicineLabMode = "cardiology" | "pulmonology" | "nephrology" | "endocrinology";

export interface MedicineLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalAlgorithm: string;
  diagnosticCriteria: string;
  therapeuticManagement: string;
  highYieldPearl: string;
}

export const MEDICINE_NODES: Record<MedicineLabMode, MedicineLabNode[]> = {
  cardiology: [
    {
      id: "stemi-localization",
      name: "1. 12-Lead ECG STEMI Localization & Reperfusion",
      category: "Acute Coronary Syndromes",
      subType: "Coronary Anatomy • Primary PCI vs Fibrinolysis",
      clinicalAlgorithm: "Anterior (V1-V4 -> LAD); Inferior (II, III, aVF -> RCA); Lateral (I, aVL, V5, V6 -> LCx); Posterior (V7-V9 or reciprocal V1-V3 -> PDA).",
      diagnosticCriteria: "ST-segment elevation >= 1 mm in >= 2 contiguous leads (or >= 2 mm in V2-V3 in men) or new LBBB with ischemic symptoms.",
      therapeuticManagement: "Door-to-balloon time < 90 min (PCI) or Door-to-needle < 30 min (Fibrinolysis); DAPT (Aspirin + Ticagrelor), High-intensity Statin, Heparin.",
      highYieldPearl: "In Inferior STEMI with RV involvement (V4R elevation), avoid Nitrates and Diuretics; administer IV fluids to maintain preload."
    },
    {
      id: "hfref-gdmt",
      name: "2. HFrEF: 4 Pillars of Mortality-Reducing GDMT",
      category: "Heart Failure Cardiology",
      subType: "Neurohormonal Blockade (LVEF <= 40%)",
      clinicalAlgorithm: "1. ARNI (Sacubitril/Valsartan) / ACEi / ARB + 2. Beta-Blocker + 3. MRA (Spironolactone) + 4. SGLT2i (Dapagliflozin/Empagliflozin).",
      diagnosticCriteria: "Symptoms of congestion/dyspnea + Echocardiogram demonstrating Left Ventricular Ejection Fraction (LVEF) <= 40% + elevated BNP/NT-proBNP.",
      therapeuticManagement: "Simultaneous low-dose initiation and up-titration of all 4 pillars; loop diuretics (Furosemide) added strictly for symptomatic volume control.",
      highYieldPearl: "Sacubitril/Valsartan requires a mandatory 36-hour washout period when switching from an ACE inhibitor to prevent fatal angioedema."
    },
    {
      id: "valvular-murmurs",
      name: "3. Valvular Heart Disease & Murmur Auscultation",
      category: "Valvular Cardiology",
      subType: "Aortic Stenosis • Mitral Regurgitation • Aortic Regurgitation",
      clinicalAlgorithm: "AS: Crescendo-decrescendo systolic at right 2nd ICS radiating to carotids. MR: Holosystolic blowing at apex radiating to axilla. AR: Early diastolic decrescendo.",
      diagnosticCriteria: "Echocardiography (valve area, peak velocity, jet gradients, regurgitant fraction). AS triad: Syncope, Angina, Dyspnea (SAD).",
      therapeuticManagement: "Severe symptomatic AS: Surgical Aortic Valve Replacement (SAVR) or Transcatheter AVR (TAVR); Severe MR: Transcatheter Edge-to-Edge Repair (MitraClip) or surgery.",
      highYieldPearl: "Pulsus parvus et tardus (slow-rising, weak carotid pulse) is the classical physical sign of severe aortic stenosis."
    }
  ],

  pulmonology: [
    {
      id: "spirometry-patterns",
      name: "1. Spirometry: Obstructive vs Restrictive Patterns",
      category: "Pulmonary Function Testing",
      subType: "FEV1/FVC < 0.70 vs FVC < 80% with Normal Ratio",
      clinicalAlgorithm: "FEV1/FVC < 0.70 = Obstructive (COPD, Asthma, Bronchiectasis); FEV1/FVC >= 0.70 + TLC < 80% = Restrictive (IPF, Sarcoidosis, Kyphoscoliosis).",
      diagnosticCriteria: "DLCO differentiation: Reduced DLCO in Emphysema and ILD; Normal DLCO in Chronic Bronchitis and Extrinsic Chest Wall Restriction.",
      therapeuticManagement: "COPD: LAMA + LABA inhalers +/- Inhaled Corticosteroids if eosinophils >= 300; Asthma: ICS-Formoterol SMART protocol.",
      highYieldPearl: "Emphysema demonstrates an obstructive pattern with elevated TLC (hyperinflation) and a markedly reduced DLCO due to alveolar capillary destruction."
    },
    {
      id: "abg-acid-base",
      name: "2. Arterial Blood Gas (ABG) & Acid-Base Davenport Nomogram",
      category: "Critical Care Pulmonology",
      subType: "Anion Gap • Winter's Formula Compensation • Delta-Delta",
      clinicalAlgorithm: "Anion Gap = Na - (Cl + HCO3). Normal = 8-12 mEq/L. Winter's expected PaCO2 = 1.5 * HCO3 + 8 (+/- 2).",
      diagnosticCriteria: "High AG Metabolic Acidosis mnemonic: GOLDMARK / MUDPILES (Methanol, Uremia, DKA, Propylene glycol, Iron/Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates).",
      therapeuticManagement: "Treat underlying etiology: IV insulin for DKA, IV fluids/antibiotics for Sepsis, Fomepizole for toxic alcohols.",
      highYieldPearl: "If measured PaCO2 is higher than Winter's predicted value, a concomitant primary respiratory acidosis is present (e.g. impending respiratory fatigue)."
    },
    {
      id: "pulmonary-embolism",
      name: "3. Pulmonary Embolism (PE) & Hemodynamic Triage",
      category: "Pulmonary Vascular Disease",
      subType: "Wells Score • CTPA • Massive vs Non-Massive Triage",
      clinicalAlgorithm: "Wells > 4 -> CT Pulmonary Angiography (CTPA); Wells <= 4 -> High-sensitivity D-dimer (<500 ng/mL rules out).",
      diagnosticCriteria: "Filling defects in pulmonary arterial branches on CTPA; RV strain on echocardiogram (McConnell sign) and elevated Troponin/BNP.",
      therapeuticManagement: "Massive PE (Shock/SBP < 90): Systemic Thrombolysis (tPA) or embolectomy; Non-massive PE: DOACs (Apixaban/Rivaroxaban) or LMWH.",
      highYieldPearl: "In hemodynamically unstable massive PE, systemic thrombolysis is life-saving and should not be delayed for CTPA if bedside echo confirms acute RV failure."
    }
  ],

  nephrology: [
    {
      id: "aki-prerenal-atn",
      name: "1. Acute Kidney Injury: Prerenal vs ATN (FeNa)",
      category: "Renal Physiology & AKI",
      subType: "KDIGO Staging • Fractional Excretion of Sodium",
      clinicalAlgorithm: "Prerenal: FeNa < 1.0%, BUN/Cr > 20:1, Urine Na < 20, Urine Osm > 500. ATN: FeNa > 2.0%, BUN/Cr < 15:1, Urine Na > 40, Muddy brown casts.",
      diagnosticCriteria: "KDIGO criteria: Rise in Serum Creatinine by >= 0.3 mg/dL within 48h, or >= 1.5x baseline within 7 days, or urine output < 0.5 mL/kg/h for 6h.",
      therapeuticManagement: "Prerenal: IV Isotonic Saline volume resuscitation; ATN: Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast), optimize renal perfusion.",
      highYieldPearl: "If the patient is on active loop diuretics, use Fractional Excretion of Urea (FeUrea < 35% indicates prerenal azotemia)."
    },
    {
      id: "hyperkalemia-emergency",
      name: "2. Severe Hyperkalemia 4-Step Emergency Protocol",
      category: "Electrolyte Emergencies",
      subType: "Membrane Stabilization • Intracellular Shift • Elimination",
      clinicalAlgorithm: "Step 1: IV Calcium Gluconate (10%) -> Step 2: IV Regular Insulin (10 U) + 50% Dextrose (50 mL) -> Step 3: Nebulized Albuterol -> Step 4: Hemodialysis.",
      diagnosticCriteria: "Serum K+ > 5.5 mEq/L; ECG signs: Peaked T waves, PR prolongation, wide QRS, sine wave, asystole.",
      therapeuticManagement: "IV Calcium Gluconate acts in 1-3 minutes to stabilize cardiac membranes; Insulin + Dextrose shifts K+ intracellularly for 4-6 hours.",
      highYieldPearl: "Calcium gluconate does NOT lower serum potassium; its sole vital function is to protect the myocardium against lethal ventricular arrhythmias."
    }
  ],

  endocrinology: [
    {
      id: "dka-vs-hhs",
      name: "1. Diabetic Ketoacidosis (DKA) vs HHS Management",
      category: "Endocrine Emergencies",
      subType: "Hyperglycemia • Anion Gap Acidosis • Fluid Resuscitation",
      clinicalAlgorithm: "DKA: Glucose 250-500, pH < 7.30, HCO3 < 18, Anion Gap > 12, Positive Ketones. HHS: Glucose > 600, Osmolality > 320, minimal ketones.",
      diagnosticCriteria: "Serum beta-hydroxybutyrate, arterial blood gas, basic metabolic panel, effective serum osmolality.",
      therapeuticManagement: "IV 0.9% Normal Saline (1-2 L/h) -> Check K+ (if K+ < 3.3, HOLD insulin and give KCl) -> IV Regular Insulin 0.1 U/kg/h -> Add D5W when glucose < 200.",
      highYieldPearl: "Never start insulin in DKA if serum potassium is below 3.3 mEq/L, as insulin drives K+ into cells and triggers fatal cardiac arrest."
    },
    {
      id: "thyroid-storm-myxedema",
      name: "2. Thyroid Storm vs Myxedema Coma",
      category: "Thyroid Emergencies",
      subType: "Decompensated Thyrotoxicosis vs Severe Hypothyroidism",
      clinicalAlgorithm: "Thyroid Storm: Propranolol -> High-dose PTU -> Lugol/Potassium Iodide (1h after PTU) -> IV Hydrocortisone. Myxedema: IV Levothyroxine + IV Hydrocortisone.",
      diagnosticCriteria: "Burch-Wartofsky Point Scale for Thyroid Storm; severe hyperthermia, atrial fibrillation, delirium vs hypothermia, bradycardia, myxedema coma.",
      therapeuticManagement: "In Myxedema Coma, IV Hydrocortisone must be administered BEFORE or simultaneously with IV Levothyroxine to prevent precipitating adrenal crisis.",
      highYieldPearl: "In Thyroid Storm, Potassium Iodide must be given at least 1 hour AFTER the thionamide to prevent the iodine from being used as substrate for new hormone synthesis."
    }
  ]
};

interface MedicineLabViewerProps {
  initialMode?: MedicineLabMode;
  height?: string;
  onNodeSelect?: (node: MedicineLabNode) => void;
}

export default function MedicineLabViewer({
  initialMode = "cardiology",
  height = "560px",
  onNodeSelect,
}: MedicineLabViewerProps) {
  const [activeMode, setActiveMode] = useState<MedicineLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Cardiology STEMI Territory State
  const [selectedTerritory, setSelectedTerritory] = useState<"anterior" | "inferior" | "lateral" | "posterior">("anterior");

  // Pulmonology ABG Sliders State
  const [ph, setPh] = useState<number>(7.28);
  const [paco2, setPaco2] = useState<number>(28); // mmHg
  const [hco3, setHco3] = useState<number>(14); // mEq/L
  const [na, setNa] = useState<number>(138); // mEq/L
  const [cl, setCl] = useState<number>(100); // mEq/L

  // Nephrology FeNa Sliders State
  const [serumCr, setSerumCr] = useState<number>(3.2); // mg/dL
  const [urineNa, setUrineNa] = useState<number>(14); // mEq/L
  const [serumNa, setSerumNa] = useState<number>(136); // mEq/L
  const [urineCr, setUrineCr] = useState<number>(85); // mg/dL

  // ABG Calculations
  const anionGap = useMemo(() => {
    return na - (cl + hco3);
  }, [na, cl, hco3]);

  const wintersPaco2 = useMemo(() => {
    const expected = 1.5 * hco3 + 8;
    return `${(expected - 2).toFixed(0)} – ${(expected + 2).toFixed(0)} mmHg`;
  }, [hco3]);

  const abgDiagnosis = useMemo(() => {
    if (ph < 7.35) {
      if (anionGap > 12) {
        return "High Anion Gap Metabolic Acidosis (HAGMA)";
      } else if (hco3 < 22) {
        return "Normal Anion Gap Metabolic Acidosis (NAGMA)";
      } else if (paco2 > 45) {
        return "Primary Respiratory Acidosis";
      }
    } else if (ph > 7.45) {
      if (hco3 > 26) {
        return "Primary Metabolic Alkalosis";
      } else if (paco2 < 35) {
        return "Primary Respiratory Alkalosis";
      }
    }
    return "Compensated / Normal Acid-Base State";
  }, [ph, anionGap, hco3, paco2]);

  // Nephrology FeNa Calculation
  const fena = useMemo(() => {
    if (serumNa <= 0 || urineCr <= 0) return 0;
    return ((urineNa * serumCr) / (serumNa * urineCr)) * 100;
  }, [urineNa, serumCr, serumNa, urineCr]);

  const akiDiagnosis = useMemo(() => {
    if (fena < 1.0) {
      return "Prerenal Azotemia (Avid Na+ retention, FeNa < 1%)";
    } else if (fena > 2.0) {
      return "Acute Tubular Necrosis (ATN / Intrinsic AKI, FeNa > 2%)";
    }
    return "Indeterminate / Mixed AKI (FeNa 1-2%)";
  }, [fena]);

  const currentNodes = useMemo(() => {
    return MEDICINE_NODES[activeMode] || MEDICINE_NODES.cardiology;
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
            <Stethoscope size={14} /> MED-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "cardiology" && "Cardiovascular Clinical Simulator & 12-Lead STEMI Localizer"}
            {activeMode === "pulmonology" && "Pulmonology, ABG Davenport Nomogram & Critical Care Triage"}
            {activeMode === "nephrology" && "Nephrology AKI KDIGO & FeNa Fractional Excretion Calculator"}
            {activeMode === "endocrinology" && "Endocrinology, DKA vs HHS Protocol & Emergency Management"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Medicine Quiz"}
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
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Internal Medicine Case Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Entity: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-emerald-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-indigo-950 text-xs rounded border border-indigo-700 text-indigo-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Cardiology 12-Lead ECG STEMI Localizer */}
          {activeMode === "cardiology" && (
            <div className={styles.medSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={14} /> 12-Lead ECG STEMI Territory Localizer & Culprit Artery Engine
                </span>
                <span className="text-[11px] text-slate-400">Door-to-Balloon Goal: &lt; 90 min</span>
              </div>

              {/* Territory Selector Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedTerritory("anterior")}
                  className={`p-2 rounded-lg text-xs font-bold border transition ${
                    selectedTerritory === "anterior"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  Anterior / Septal (LAD)
                </button>
                <button
                  onClick={() => setSelectedTerritory("inferior")}
                  className={`p-2 rounded-lg text-xs font-bold border transition ${
                    selectedTerritory === "inferior"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  Inferior (RCA / II, III, aVF)
                </button>
                <button
                  onClick={() => setSelectedTerritory("lateral")}
                  className={`p-2 rounded-lg text-xs font-bold border transition ${
                    selectedTerritory === "lateral"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  Lateral (LCx / I, aVL, V5-6)
                </button>
                <button
                  onClick={() => setSelectedTerritory("posterior")}
                  className={`p-2 rounded-lg text-xs font-bold border transition ${
                    selectedTerritory === "posterior"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  Posterior (PDA / V7-V9)
                </button>
              </div>

              {/* Real-time 12-Lead Grid Display */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"].map((lead) => {
                  let isElevated = false;
                  let isDepressed = false;

                  if (selectedTerritory === "anterior" && ["V1", "V2", "V3", "V4"].includes(lead)) isElevated = true;
                  if (selectedTerritory === "inferior") {
                    if (["II", "III", "aVF"].includes(lead)) isElevated = true;
                    if (["I", "aVL"].includes(lead)) isDepressed = true;
                  }
                  if (selectedTerritory === "lateral" && ["I", "aVL", "V5", "V6"].includes(lead)) isElevated = true;
                  if (selectedTerritory === "posterior" && ["V1", "V2", "V3"].includes(lead)) isDepressed = true;

                  return (
                    <div
                      key={lead}
                      className={`p-2 rounded border text-center font-mono ${
                        isElevated
                          ? "bg-rose-950/80 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-500/20"
                          : isDepressed
                          ? "bg-blue-950/80 border-blue-500 text-blue-300 font-bold"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <div className="text-[10px] text-slate-500 font-sans">{lead}</div>
                      <div className="text-xs mt-0.5">
                        {isElevated ? "⬆️ ST Elev (+3mm)" : isDepressed ? "⬇️ ST Dep (-2mm)" : "Isoelectric"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pulmonology ABG & Davenport Simulator */}
          {activeMode === "pulmonology" && (
            <div className={styles.medSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind size={14} /> Comprehensive Arterial Blood Gas (ABG) & Davenport Nomogram Engine
                </span>
                <span className="text-[11px] text-slate-400">Henderson-Hasselbalch Equilibrium</span>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>pH:</span> <strong className="text-indigo-400">{ph.toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min="7.00"
                    max="7.60"
                    step="0.01"
                    value={ph}
                    onChange={(e) => setPh(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>PaCO2:</span> <strong className="text-indigo-400">{paco2} mmHg</strong>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="1"
                    value={paco2}
                    onChange={(e) => setPaco2(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>HCO3-:</span> <strong className="text-indigo-400">{hco3} mEq/L</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="1"
                    value={hco3}
                    onChange={(e) => setHco3(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              {/* Real-time ABG Outputs */}
              <div className={styles.medResultsGrid}>
                <div className={styles.medResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Anion Gap</div>
                  <div className={styles.medResultVal}>{anionGap} mEq/L</div>
                </div>
                <div className={styles.medResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Winter's Expected PaCO2</div>
                  <div className="text-xs font-bold text-indigo-300 mt-1">{wintersPaco2}</div>
                </div>
                <div className={styles.medResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Acid-Base Diagnosis</div>
                  <div className="text-xs font-bold text-rose-400 mt-1">{abgDiagnosis}</div>
                </div>
              </div>
            </div>
          )}

          {/* Nephrology FeNa AKI Simulator */}
          {activeMode === "nephrology" && (
            <div className={styles.medSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> AKI KDIGO & Fractional Excretion of Sodium (FeNa) Calculator
                </span>
                <span className="text-[11px] text-slate-400">FeNa = (UNa * SCr) / (SNa * UCr) * 100</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Serum Cr:</span> <strong className="text-indigo-400">{serumCr.toFixed(1)} mg/dL</strong>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.1"
                    value={serumCr}
                    onChange={(e) => setSerumCr(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Urine Na:</span> <strong className="text-indigo-400">{urineNa} mEq/L</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={urineNa}
                    onChange={(e) => setUrineNa(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Serum Na:</span> <strong className="text-indigo-400">{serumNa} mEq/L</strong>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="155"
                    step="1"
                    value={serumNa}
                    onChange={(e) => setSerumNa(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Urine Cr:</span> <strong className="text-indigo-400">{urineCr} mg/dL</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={urineCr}
                    onChange={(e) => setUrineCr(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              <div className={styles.medResultsGrid}>
                <div className={styles.medResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Calculated FeNa</div>
                  <div className={styles.medResultVal}>{fena.toFixed(2)}%</div>
                </div>
                <div className={styles.medResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Diagnostic Classification</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">{akiDiagnosis}</div>
                </div>
                <div className={styles.medResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Urine Cast Hallmark</div>
                  <div className="text-xs font-bold text-indigo-300 mt-1">
                    {fena < 1.0 ? "Hyaline Casts (Prerenal)" : "Muddy Brown Granular Casts (ATN)"}
                  </div>
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
                    <span className="text-indigo-400 font-bold">Algorithm:</span> {node.clinicalAlgorithm}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect internal medicine protocol</span>
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
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Clinical Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Disease / Clinical Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria & Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💊 Guideline-Directed Management</div>
            <div className={styles.inspectorBody}>{activeNode.therapeuticManagement}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Harrison / USMLE High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("cardiology")}
          className={`${styles.modeTab} ${activeMode === "cardiology" ? styles.modeTabActive : ""}`}
        >
          🫀 1. Cardiology & STEMI
        </button>
        <button
          onClick={() => setActiveMode("pulmonology")}
          className={`${styles.modeTab} ${activeMode === "pulmonology" ? styles.modeTabActive : ""}`}
        >
          🫁 2. Pulmonology & ABG
        </button>
        <button
          onClick={() => setActiveMode("nephrology")}
          className={`${styles.modeTab} ${activeMode === "nephrology" ? styles.modeTabActive : ""}`}
        >
          💧 3. Nephrology & AKI
        </button>
        <button
          onClick={() => setActiveMode("endocrinology")}
          className={`${styles.modeTab} ${activeMode === "endocrinology" ? styles.modeTabActive : ""}`}
        >
          ⚡ 4. Endocrinology & DKA
        </button>
      </div>
    </div>
  );
}
