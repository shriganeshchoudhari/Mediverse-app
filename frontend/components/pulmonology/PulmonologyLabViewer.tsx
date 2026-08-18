"use client";

import React, { useState, useMemo } from "react";
import styles from "./PulmonologyLabViewer.module.css";
import {
  Activity,
  Wind,
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
  Stethoscope,
  Crosshair,
  Pill,
  Moon,
} from "lucide-react";

export type PulmonologyLabMode = "spirometry" | "tuberculosis" | "pleural" | "occupational";

export interface PulmonologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalProtocol: string;
  diagnosticCriteria: string;
  emergencyAction: string;
  highYieldPearl: string;
}

export const PULMONOLOGY_NODES: Record<PulmonologyLabMode, PulmonologyLabNode[]> = {
  spirometry: [
    {
      id: "spirometry-obstructive-asthma-copd",
      name: "1. Obstructive Lung Defect: Asthma vs COPD (GOLD Staging)",
      category: "Spirometry & Airflow Mechanics",
      subType: "FEV1/FVC < 0.70 • Bronchodilator Reversibility (>=12% & >=200 mL) • GOLD 1–4",
      clinicalProtocol: "FEV1/FVC < 0.70 defines airflow obstruction. Assess BD reversibility (400 mcg Albuterol): Positive in Asthma (reversible), negative/fixed in COPD.",
      diagnosticCriteria: "GOLD 1 (>=80%), GOLD 2 (50-79%), GOLD 3 (30-49%), GOLD 4 (<30% predicted). DLCO reduced in Emphysema, normal/elevated in Asthma.",
      emergencyAction: "In acute severe asthma: High-flow O2, nebulized SABA (Albuterol) + SAMA (Ipratropium), and systemic IV/oral Corticosteroids.",
      highYieldPearl: "A positive bronchodilator reversibility response requires an improvement of at least 12% AND 200 mL in either FEV1 or FVC, characteristic of asthma."
    },
    {
      id: "spirometry-restrictive-ild-chestwall",
      name: "2. Restrictive Lung Defect: Intrinsic ILD vs Extrinsic Disorders",
      category: "Restrictive Diagnostics",
      subType: "FEV1/FVC >= 0.70 • FVC < 80% • TLC < 80% • DLCO Differential (ILD vs Chest Wall)",
      clinicalProtocol: "FEV1/FVC >= 0.70 with TLC < 80% defines restriction. DLCO < 80% indicates Intrinsic ILD (IPF, sarcoidosis); DLCO normal indicates Extrinsic (scoliosis, ALS).",
      diagnosticCriteria: "Flow-volume curve shows narrow miniature 'Witch's hat' morphology. IPF: Bilateral subpleural basal reticulation and honeycombing.",
      emergencyAction: "In acute ILD exacerbation, administer high-dose IV pulse Methylprednisolone and provide supplemental high-flow oxygen.",
      highYieldPearl: "Measuring DLCO differentiates intrinsic parenchymal fibrosis (reduced DLCO) from extrinsic chest wall/neuromuscular restriction (normal DLCO)."
    }
  ],

  tuberculosis: [
    {
      id: "tuberculosis-cbnaat-genexpert",
      name: "1. Tuberculosis Molecular Diagnostics (CBNAAT / GeneXpert)",
      category: "NTEP Diagnostics",
      subType: "GeneXpert MTB/RIF (<2h) • rpoB Rifampicin Mutation • First-Line LPA (katG/inhA) • MGIT",
      clinicalProtocol: "Initial test of choice is CBNAAT (GeneXpert MTB/RIF): Rapidly confirms M. tuberculosis DNA and detects rpoB Rifampicin resistance mutations.",
      diagnosticCriteria: "Primary TB: Ghon complex (Ghon focus + hilar lymphadenopathy). Reactivation TB: Apical/posterior upper lobe cavitary lesions with hemoptysis.",
      emergencyAction: "Isolate patient in negative-pressure airborne infection isolation room (AIIR) and initiate weight-banded daily FDC anti-tubercular therapy.",
      highYieldPearl: "GeneXpert CBNAAT provides automated nucleic acid detection of M. tuberculosis and Rifampicin resistance within 2 hours, serving as the cornerstone of NTEP."
    },
    {
      id: "tuberculosis-ntep-hrze-bpal",
      name: "2. NTEP First-Line 2 HRZE Regimen & All-Oral BPaL for MDR-TB",
      category: "Anti-Tubercular Pharmacotherapy",
      subType: "2 HRZE + 4 HRE • Pyridoxine (B6) • Ethambutol Optic Neuritis • BPaL (Bedaquiline/Linezolid)",
      clinicalProtocol: "DS-TB: 2 months HRZE + 4 months HRE. Co-prescribe Pyridoxine 10–25 mg/day with INH. MDR-TB (INH+RIF resistant): 6-month all-oral BPaL/BPaLM regimen.",
      diagnosticCriteria: "Toxicities: INH (neuropathy, hepatitis), RIF (orange urine, CYP3A4 inducer), PZA (hyperuricemia/gout, hepatotoxic), EMB (optic neuritis red-green color blindness).",
      emergencyAction: "If visual acuity/color vision drops on Ethambutol, discontinue Ethambutol immediately. If jaundice/transaminases >5x ULN, halt hepatotoxic drugs.",
      highYieldPearl: "Ethambutol causes retrobulbar optic neuritis with red-green dyschromatopsia and must be discontinued immediately at the first sign of visual impairment."
    }
  ],

  pleural: [
    {
      id: "pleural-lights-criteria-transudate-exudate",
      name: "1. Light's Criteria: Transudative vs Exudative Pleural Effusion",
      category: "Pleural Diagnostics",
      subType: "Protein Ratio >0.5 • LDH Ratio >0.6 • LDH >2/3 ULN • CHF Transudates • Malignancy",
      clinicalProtocol: "Exudate if ANY 1 is met: Pleural/Serum Protein >0.5, Pleural/Serum LDH >0.6, or Pleural LDH >2/3 ULN. Transudates (CHF, cirrhosis, nephrosis) meet none.",
      diagnosticCriteria: "Diagnostic thoracocentesis inserted over the superior border of the 7th–8th rib to avoid the subcostal neurovascular bundle. Limit removal to <=1500 mL.",
      emergencyAction: "Transudates: Treat underlying heart failure / cirrhosis (diuretics). Do not drain large transudates unless severe respiratory compromise.",
      highYieldPearl: "An effusion is definitively an exudate if it meets just ONE of Light's 3 criteria; transudates occur due to systemic hydrostatic/oncotic pressure imbalances."
    },
    {
      id: "pleural-empyema-chest-tube-drainage",
      name: "2. Complicated Parapneumonic Effusion & Empyema Drainage",
      category: "Pleural Interventions",
      subType: "pH < 7.20 • Glucose < 40 mg/dL • LDH > 1000 U/L • Mandatory Chest Tube Drainage • VATS",
      clinicalProtocol: "Stage 1 (Uncomplicated): pH >7.30, Glucose >60 -> Antibiotics alone. Stage 2 (Complicated: pH <7.20, Glucose <40) & Stage 3 (Empyema) -> Chest Tube.",
      diagnosticCriteria: "Tuberculous pleurisy: High pleural ADA (>40 U/L) with lymphocytic predominance. Pancreatitis: High pleural amylase. Chylothorax: Triglycerides >110 mg/dL.",
      emergencyAction: "Insert immediate 28–32 Fr tube thoracostomy in Safe Triangle. If multiloculated, instill intrapleural tPA + DNase or perform VATS decortication.",
      highYieldPearl: "A pleural fluid pH < 7.20, glucose < 40 mg/dL, or frank pus in parapneumonic effusion mandates immediate tube thoracostomy drainage to prevent trapped lung."
    }
  ],

  occupational: [
    {
      id: "occupational-silicosis-asbestosis",
      name: "1. Occupational Pneumoconioses: Silicosis vs Asbestosis",
      category: "Environmental Pulmonology",
      subType: "Silicosis (Eggshell Nodes, 30x TB) • Asbestosis (Pleural Plaques, Mesothelioma) • Byssinosis",
      clinicalProtocol: "Silicosis: Upper lobe nodular fibrosis + eggshell hilar calcifications (quarrying/sandblasting). Asbestosis: Lower lobe fibrosis + calcified pleural plaques.",
      diagnosticCriteria: "Asbestosis: Ferruginous bodies (Prussian blue). Bronchogenic carcinoma is most common, but Mesothelioma is most specific. Byssinosis: Monday fever.",
      emergencyAction: "Annual TB screening (TST/IGRA) in all silicosis patients due to a 30-fold increased lifetime risk of active Tuberculosis (Silicotuberculosis).",
      highYieldPearl: "Silicosis predominantly affects the upper lobes with eggshell lymph node calcifications and carries a 30-fold increased risk of developing active tuberculosis."
    },
    {
      id: "obstructive-sleep-apnea-polysomnography",
      name: "2. Obstructive Sleep Apnea (OSA): Polysomnography & CPAP",
      category: "Sleep-Disordered Breathing",
      subType: "AHI >= 30 (Severe) • Epworth Sleepiness Scale • Intermittent Hypoxia • Nocturnal CPAP",
      clinicalProtocol: "Gold standard: Overnight Polysomnography (PSG). Calculate Apnea-Hypopnea Index (AHI): Mild (5-14.9), Moderate (15-29.9), Severe (>=30 events/hour).",
      diagnosticCriteria: "Clinical triad: Habitual loud snoring + witnessed apneas + daytime somnolence (ESS >10) in obese males with resistant hypertension.",
      emergencyAction: "Titrate nocturnal Continuous Positive Airway Pressure (CPAP) as a pneumatic splint to eliminate upper airway collapse.",
      highYieldPearl: "Continuous Positive Airway Pressure (CPAP) is the first-line gold standard therapy for moderate-to-severe OSA, acting as a pneumatic airway splint."
    }
  ]
};

interface PulmonologyLabViewerProps {
  initialMode?: PulmonologyLabMode;
  height?: string;
  onNodeSelect?: (node: PulmonologyLabNode) => void;
}

export default function PulmonologyLabViewer({
  initialMode = "spirometry",
  height = "560px",
  onNodeSelect,
}: PulmonologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<PulmonologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Spirometry State
  const [fev1FvcRatio, setFev1FvcRatio] = useState<number>(0.54); // 54%
  const [fvcPredicted, setFvcPredicted] = useState<number>(85); // 85%
  const [dlcoPredicted, setDlcoPredicted] = useState<number>(46); // 46%

  // Light's Criteria State
  const [proteinRatio, setProteinRatio] = useState<number>(0.68); // Pleural/Serum
  const [ldhRatio, setLdhRatio] = useState<number>(2.4); // Pleural/Serum
  const [pleuralPh, setPleuralPh] = useState<number>(7.12); // pH

  // OSA AHI State
  const [ahiScore, setAhiScore] = useState<number>(36); // events/hour

  // PFT Diagnostic Interpretation
  const pftInterpretation = useMemo(() => {
    const isObstructive = fev1FvcRatio < 0.70;
    const isRestrictive = fev1FvcRatio >= 0.70 && fvcPredicted < 80;

    let diagnosis = "Normal Spirometry";
    let color = "text-emerald-400 font-bold";
    let pearl = "Normal pulmonary mechanics and diffusion.";

    if (isObstructive) {
      if (dlcoPredicted < 80) {
        diagnosis = "OBSTRUCTIVE DEFECT: COPD (Emphysema Phenotype with Reduced DLCO)";
        color = "text-rose-400 font-extrabold";
        pearl = "Alveolar septal destruction leads to gas trapping and impaired carbon monoxide diffusion.";
      } else {
        diagnosis = "OBSTRUCTIVE DEFECT: Bronchial Asthma (Preserved/Normal DLCO)";
        color = "text-amber-300 font-bold";
        pearl = "Airway hyper-reactivity with preserved alveolar-capillary architecture.";
      }
    } else if (isRestrictive) {
      if (dlcoPredicted < 80) {
        diagnosis = "RESTRICTIVE DEFECT: Intrinsic Interstitial Lung Disease (IPF / Fibrosis)";
        color = "text-rose-400 font-extrabold";
        pearl = "Alveolar-capillary membrane thickening and honeycombing reduce lung volumes and DLCO.";
      } else {
        diagnosis = "RESTRICTIVE DEFECT: Extrinsic / Chest Wall & Neuromuscular Disorder";
        color = "text-sky-300 font-bold";
        pearl = "Normal alveolar membrane with mechanical chest wall or neuromuscular restriction (e.g. Scoliosis, ALS).";
      }
    }

    return {
      isObstructive,
      isRestrictive,
      diagnosis,
      color,
      pearl
    };
  }, [fev1FvcRatio, fvcPredicted, dlcoPredicted]);

  // Light's Criteria Interpretation
  const pleuralInterpretation = useMemo(() => {
    const isExudate = proteinRatio > 0.5 || ldhRatio > 0.6;
    const isComplicated = isExudate && pleuralPh < 7.20;

    if (isComplicated) {
      return {
        type: "COMPLICATED PARAPNEUMONIC / EMPYEMA (Exudate with pH < 7.20)",
        action: "MANDATORY TUBE THORACOSTOMY (Chest Tube Drainage) + IV Antibiotics",
        color: "text-rose-400 font-extrabold"
      };
    } else if (isExudate) {
      return {
        type: "EXUDATIVE PLEURAL EFFUSION (Local Inflammation / Malignancy / TB)",
        action: "Investigate for Pneumonia, Malignancy, TB (ADA >40 U/L), or Pulmonary Embolism",
        color: "text-amber-300 font-bold"
      };
    }
    return {
      type: "TRANSUDATIVE PLEURAL EFFUSION (Systemic Imbalance: CHF / Cirrhosis)",
      action: "Treat underlying Congestive Heart Failure or Cirrhosis with diuresis",
      color: "text-emerald-400 font-bold"
    };
  }, [proteinRatio, ldhRatio, pleuralPh]);

  // OSA Severity
  const osaSeverity = useMemo(() => {
    if (ahiScore >= 30) {
      return {
        stage: "SEVERE OBSTRUCTIVE SLEEP APNEA (AHI >= 30 events/hour)",
        action: "Mandatory Nocturnal Continuous Positive Airway Pressure (CPAP)",
        color: "text-rose-400 font-extrabold"
      };
    } else if (ahiScore >= 15) {
      return {
        stage: "MODERATE OBSTRUCTIVE SLEEP APNEA (AHI 15–29.9 events/hour)",
        action: "Nocturnal CPAP or Mandibular Advancement Device (MAD) + Weight loss",
        color: "text-amber-300 font-bold"
      };
    } else if (ahiScore >= 5) {
      return {
        stage: "MILD OBSTRUCTIVE SLEEP APNEA (AHI 5–14.9 events/hour)",
        action: "Positional therapy, weight reduction, avoidance of evening sedatives/alcohol",
        color: "text-sky-300 font-bold"
      };
    }
    return {
      stage: "NORMAL SLEEP ARCHITECTURE (AHI < 5 events/hour)",
      action: "No sleep apnea intervention required",
      color: "text-emerald-400 font-bold"
    };
  }, [ahiScore]);

  const currentNodes = useMemo(() => {
    return PULMONOLOGY_NODES[activeMode] || PULMONOLOGY_NODES.spirometry;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: PulmonologyLabNode) => {
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
            <Wind size={14} /> RESP-401
          </span>
          <span className={styles.titleText}>
            {activeMode === "spirometry" && "PFT Spirometry & Flow-Volume Curve Diagnostic Engine"}
            {activeMode === "tuberculosis" && "Tuberculosis Diagnostics (CBNAAT) & NTEP Multi-Drug Regimens"}
            {activeMode === "pleural" && "Pleural Diseases, Light's Criteria & Empyema Drainage Analyzer"}
            {activeMode === "occupational" && "Occupational Pneumoconioses & Obstructive Sleep Apnea (OSA) Engine"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Pulmonology Quiz"}
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
                  Pulmonology Clinical Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Respiratory Protocol: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: Spirometry & PFT Simulator */}
          {activeMode === "spirometry" && (
            <div className={styles.respSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind size={14} /> Stepwise Spirometry &amp; DLCO Interpretation
                </span>
                <span className="text-[11px] text-slate-400">Obstructive vs Restrictive</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>FEV1 / FVC Ratio:</span>{" "}
                    <strong className="text-sky-400">{(fev1FvcRatio * 100).toFixed(0)}% (Cutoff: 70%)</strong>
                  </div>
                  <input
                    type="range"
                    min="0.30"
                    max="0.90"
                    step="0.01"
                    value={fev1FvcRatio}
                    onChange={(e) => setFev1FvcRatio(parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>FVC (% Predicted):</span>{" "}
                    <strong className="text-sky-400">{fvcPredicted}% (Normal: &ge;80%)</strong>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="110"
                    step="1"
                    value={fvcPredicted}
                    onChange={(e) => setFvcPredicted(parseInt(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>DLCO (% Predicted):</span>{" "}
                    <strong className="text-sky-400">{dlcoPredicted}% (Normal: &ge;80%)</strong>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="120"
                    step="1"
                    value={dlcoPredicted}
                    onChange={(e) => setDlcoPredicted(parseInt(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>

              <div className={styles.respResultsGrid}>
                <div className={styles.respResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">PFT Diagnostic Interpretation</div>
                  <div className={`text-xs font-bold mt-1 ${pftInterpretation.color}`}>{pftInterpretation.diagnosis}</div>
                </div>
                <div className={styles.respResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Physiological Mechanism</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{pftInterpretation.pearl}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Tuberculosis & NTEP Regimen Ladder */}
          {activeMode === "tuberculosis" && (
            <div className={styles.respSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill size={14} /> NTEP Tuberculosis Diagnostics &amp; Regimen Ladder
                </span>
                <span className="text-[11px] text-slate-400">CBNAAT / GeneXpert MTB/RIF</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Drug-Sensitive TB (2 HRZE + 4 HRE)</div>
                  <div className="text-slate-300 mt-1">Fixed-dose daily regimen: Isoniazid, Rifampicin, Pyrazinamide, Ethambutol.</div>
                  <div className="text-emerald-300 font-bold mt-1">Co-prescribe Pyridoxine (B6) 10–25 mg to prevent peripheral neuropathy.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">MDR-TB &amp; All-Oral BPaL Regimen (6 Months)</div>
                  <div className="text-slate-300 mt-1">Bedaquiline + Pretomanid + Linezolid (&plusmn; Moxifloxacin).</div>
                  <div className="text-amber-300 font-bold mt-1">Indicated for Rifampicin-resistant (rpoB) &amp; MDR-TB strains.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Light's Criteria & Pleural Fluid */}
          {activeMode === "pleural" && (
            <div className={styles.respSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Light's Criteria &amp; Pleural Fluid Stratification
                </span>
                <span className="text-[11px] text-slate-400">Exudate vs Transudate</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Pleural/Serum Protein:</span>{" "}
                    <strong className="text-sky-400">{proteinRatio.toFixed(2)} (Exudate: &gt;0.5)</strong>
                  </div>
                  <input
                    type="range"
                    min="0.20"
                    max="0.90"
                    step="0.01"
                    value={proteinRatio}
                    onChange={(e) => setProteinRatio(parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Pleural/Serum LDH:</span>{" "}
                    <strong className="text-sky-400">{ldhRatio.toFixed(2)} (Exudate: &gt;0.6)</strong>
                  </div>
                  <input
                    type="range"
                    min="0.20"
                    max="5.00"
                    step="0.1"
                    value={ldhRatio}
                    onChange={(e) => setLdhRatio(parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Pleural Fluid pH:</span>{" "}
                    <strong className="text-sky-400">{pleuralPh.toFixed(2)} (Drain if &lt;7.20)</strong>
                  </div>
                  <input
                    type="range"
                    min="6.80"
                    max="7.60"
                    step="0.02"
                    value={pleuralPh}
                    onChange={(e) => setPleuralPh(parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>

              <div className={styles.respResultsGrid}>
                <div className={styles.respResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Classification</div>
                  <div className={`text-xs font-bold mt-1 ${pleuralInterpretation.color}`}>{pleuralInterpretation.type}</div>
                </div>

                <div className={styles.respResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Management Action</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{pleuralInterpretation.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Occupational & OSA Simulator */}
          {activeMode === "occupational" && (
            <div className={styles.respSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Moon size={14} /> Obstructive Sleep Apnea (AHI) Polysomnography Engine
                </span>
                <span className="text-[11px] text-slate-400">Severe: AHI &ge; 30 events/hour</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Apnea-Hypopnea Index (AHI):</span>{" "}
                  <strong className="text-sky-400">{ahiScore} events/hour</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={ahiScore}
                  onChange={(e) => setAhiScore(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div className={styles.respResultsGrid}>
                <div className={styles.respResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">OSA Severity Stage</div>
                  <div className={`text-xs font-bold mt-1 ${osaSeverity.color}`}>{osaSeverity.stage}</div>
                </div>

                <div className={styles.respResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Gold Standard Therapy</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{osaSeverity.action}</div>
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
                    <span className="text-sky-400 font-bold">Protocol:</span> {node.clinicalProtocol}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect pulmonology protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Pulmonology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Pulmonology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Pulmonary Focus / Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Clinical Management &amp; Dosing</div>
            <div className={styles.inspectorBody}>{activeNode.emergencyAction}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Fishman &amp; Murray-Nadel Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("spirometry")}
          className={`${styles.modeTab} ${activeMode === "spirometry" ? styles.modeTabActive : ""}`}
        >
          🫁 1. Spirometry &amp; PFTs
        </button>
        <button
          onClick={() => setActiveMode("tuberculosis")}
          className={`${styles.modeTab} ${activeMode === "tuberculosis" ? styles.modeTabActive : ""}`}
        >
          💊 2. Tuberculosis &amp; NTEP
        </button>
        <button
          onClick={() => setActiveMode("pleural")}
          className={`${styles.modeTab} ${activeMode === "pleural" ? styles.modeTabActive : ""}`}
        >
          💧 3. Light's &amp; Pleural Tap
        </button>
        <button
          onClick={() => setActiveMode("occupational")}
          className={`${styles.modeTab} ${activeMode === "occupational" ? styles.modeTabActive : ""}`}
        >
          🏭 4. Occupational &amp; OSA
        </button>
      </div>
    </div>
  );
}
