"use client";

import React, { useState, useMemo } from "react";
import styles from "./AnesthesiologyLabViewer.module.css";
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
  Heart,
  Droplet,
  Calculator,
  TrendingUp,
  Wind,
  Gauge,
  Thermometer,
  Shield,
  Stethoscope,
} from "lucide-react";

export type AnesthesiologyLabMode = "airway" | "volatileMh" | "neuromuscular" | "ardsnet";

export interface AnesthesiologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalProtocol: string;
  diagnosticCriteria: string;
  emergencyAction: string;
  highYieldPearl: string;
}

export const ANESTHESIOLOGY_NODES: Record<AnesthesiologyLabMode, AnesthesiologyLabNode[]> = {
  airway: [
    {
      id: "airway-mallampati-cico-algorithm",
      name: "1. Preoperative Airway (Mallampati I–IV) & ASA CICO Cascade",
      category: "Airway Management",
      subType: "Mallampati I–IV • LEMON 3-3-2 • Video Laryngoscopy • eFONA (Scalpel Cricothyroidotomy)",
      clinicalProtocol: "Plan A (Video Laryngoscopy, max 3) -> Plan B (2nd Gen LMA, max 2) -> Plan C (2-Person Mask) -> Plan D (Surgical Scalpel Cricothyroidotomy).",
      diagnosticCriteria: "Mallampati III/IV (soft/hard palate only visible) predicts difficult direct laryngoscopy. CICO: Failed intubation + failed LMA + failed bag-mask.",
      emergencyAction: "In CICO crisis, execute immediate Emergency Front of Neck Access (eFONA): Scalpel-Bougie-Tube 6.0 mm through cricothyroid membrane.",
      highYieldPearl: "The ASA Difficult Airway algorithm strictly limits intubation attempts to <=3 before transitioning through supraglottic airway to emergency surgical cricothyroidotomy."
    },
    {
      id: "cormack-lehane-laryngoscopy",
      name: "2. Cormack-Lehane Laryngoscopy Grading & BONES Mask Ventilation",
      category: "Airway Diagnostics",
      subType: "Grade 1 (Full Glottis) to Grade 4 (No Cords/Epiglottis) • BONES Mask Criteria",
      clinicalProtocol: "Optimize sniffing position (ear-to-sternal notch alignment), BURP maneuver (Back-Up-Right Pressure), and introduce Gum Elastic Bougie.",
      diagnosticCriteria: "BONES criteria: Beard, Obesity (BMI >30), No teeth (edentulous), Elderly (>55 yrs), Snoring/OSA (>=2 predicts difficult mask ventilation).",
      emergencyAction: "Use two-person bag-valve-mask with oral/nasal airway adjuncts and prepare video laryngoscopy / LMA immediately.",
      highYieldPearl: "Cormack-Lehane Grade 3 (epiglottis visible only, no cords) and Grade 4 require video laryngoscopy and a gum elastic bougie for successful tube delivery."
    }
  ],

  volatileMh: [
    {
      id: "volatile-mac-solubility",
      name: "1. Volatile Anesthetic MAC Principles & Blood:Gas Solubility",
      category: "Inhalational Pharmacology",
      subType: "N2O (104%) • Desflurane (6%) • Sevoflurane (2%) • Isoflurane (1.15%)",
      clinicalProtocol: "MAC represents alveolar concentration preventing movement in 50% of patients. Lower blood:gas solubility = faster induction and emergence.",
      diagnosticCriteria: "Sevoflurane: Non-pungent (pediatric mask induction). Desflurane: Ultra-rapid recovery (heated vaporizer). N2O: Expands closed gas spaces.",
      emergencyAction: "Titrate volatile concentration to maintain surgical depth (MAC 1.0–1.3) while monitoring hemodynamics and end-tidal anesthetic concentration.",
      highYieldPearl: "Desflurane has the lowest blood-gas partition coefficient (0.42) among volatile liquids, providing the most rapid induction and emergence."
    },
    {
      id: "malignant-hyperthermia-dantrolene",
      name: "2. Malignant Hyperthermia (RYR1 Crisis) & Dantrolene Protocol",
      category: "Anesthetic Emergencies",
      subType: "RYR1 Mutation • EtCO2 Rise (Earliest Sign) • Masseter Spasm • IV Dantrolene 2.5 mg/kg",
      clinicalProtocol: "Triggered by Volatiles + Succinylcholine -> Sudden EtCO2 surge -> Generalized rigidity -> Mixed acidosis, hyperkalemia -> Late hyperthermia (>41C).",
      diagnosticCriteria: "Massive sarcoplasmic Ca2+ efflux. Diagnostic triad: Unexplained EtCO2 rise + masseter muscle rigidity + sinus tachycardia.",
      emergencyAction: "1. STOP volatiles/succinylcholine. 2. Hyperventilate 100% O2 (>10 L/min). 3. IV Dantrolene 2.5 mg/kg push q5-10min. 4. Active cold saline cooling.",
      highYieldPearl: "An unexplained, sudden, dramatic rise in End-Tidal CO2 (EtCO2) refractory to hyperventilation is the EARLIEST and most sensitive clinical sign of Malignant Hyperthermia."
    }
  ],

  neuromuscular: [
    {
      id: "succinylcholine-hyperkalemia-atypical",
      name: "1. Succinylcholine Fasciculations, Hyperkalemic Arrest & Apnea",
      category: "Depolarizing Neuromuscular Blockade",
      subType: "nAChR Agonist • Hyperkalemia in Burns/Denervation • Pseudocholinesterase Apnea",
      clinicalProtocol: "Rapid onset (30-60s) for RSI. Hydrolyzed by plasma Pseudocholinesterase (Butyrylcholinesterase). Dibucaine number <20 indicates homozygous atypical enzyme.",
      diagnosticCriteria: "STRICT CONTRAINDICATION in Burns >24-48h, Spinal cord denervation/stroke, Muscular dystrophy, Crush trauma (causes lethal K+ efflux).",
      emergencyAction: "In pseudocholinesterase deficiency apnea, maintain sedation and mechanical ventilation until spontaneous enzymatic recovery (hours).",
      highYieldPearl: "Succinylcholine is strictly contraindicated in burn and denervation injuries due to upregulation of extrajunctional acetylcholine receptors triggering fatal hyperkalemic cardiac arrest."
    },
    {
      id: "rocuronium-sugammadex-hofmann",
      name: "2. Non-Depolarizing Blockers (TOF), Sugammadex & Hofmann Elimination",
      category: "Non-Depolarizing Blockade & Reversal",
      subType: "Rocuronium • Cisatracurium (Hofmann in ESRD) • TOF Ratio >=0.9 • Sugammadex 2–16 mg/kg",
      clinicalProtocol: "Cisatracurium degrades organ-independently via Hofmann elimination (drug of choice in renal/hepatic failure). Target TOF ratio >=0.9 for extubation.",
      diagnosticCriteria: "Sugammadex: 1:1 molecular encapsulation of Rocuronium. Dosing: 2 mg/kg (shallow), 4 mg/kg (deep 0/4 TOF), 16 mg/kg (immediate RSI reversal).",
      emergencyAction: "Administer IV Sugammadex for instant reversal of deep/profound rocuronium blockade within 2-3 minutes without muscarinic side effects.",
      highYieldPearl: "Cisatracurium undergoes spontaneous non-enzymatic Hofmann elimination at body temperature and pH, making it the neuromuscular blocker of choice in end-stage renal disease."
    }
  ],

  ardsnet: [
    {
      id: "ardsnet-lung-protective-ventilation",
      name: "1. ARDSNet Low Tidal Volume (Vt 4–8 mL/kg PBW) & Driving Pressure",
      category: "Critical Care Mechanical Ventilation",
      subType: "Predicted Body Weight (PBW) • Pplat <=30 cmH2O • Driving Pressure <=14 cmH2O • PEEP Ladder",
      clinicalProtocol: "Calculate PBW based on height/sex. Start Vt at 6 mL/kg PBW. Target Plateau Pressure <=30 cmH2O and Driving Pressure (Pplat - PEEP) <=14 cmH2O.",
      diagnosticCriteria: "Berlin Criteria: Acute (<1 wk), Bilateral infiltrates, Non-cardiogenic, P/F <=300 (Mild 201-300, Moderate 101-200, Severe <=100).",
      emergencyAction: "If Pplat >30 cmH2O, decrease Vt by 1 mL/kg PBW (down to 4 mL/kg). Accept permissive hypercapnia (pH >=7.20-7.25).",
      highYieldPearl: "Tidal volumes in ARDS MUST be calculated using Predicted Body Weight (PBW), NEVER actual body weight, to prevent fatal ventilator-induced volutrauma."
    },
    {
      id: "prone-positioning-proseva-ecmo",
      name: "2. Prone Positioning Ventilation (PROSEVA Trial) & VV-ECMO",
      category: "Refractory ARDS Rescue Protocols",
      subType: "Prone >=16 h/day in P/F <150 • V/Q Homogenization • VV-ECMO in Refractory Hypoxemia",
      clinicalProtocol: "Prone positioning for >=16 consecutive hours/day in severe ARDS (P/F <150 on FiO2 >=0.60, PEEP >=10) reduces 28-day mortality by >50%.",
      diagnosticCriteria: "Proning removes dorsal lung compression by heart/abdomen, homogenizing transpulmonary pressure and recruit dorsal alveoli.",
      emergencyAction: "If severe hypoxemia (P/F <80 mmHg for >6h) persists despite lung-protective ventilation and proning, initiate Veno-Venous (VV) ECMO.",
      highYieldPearl: "Prone positioning ventilation for at least 16 hours per day in severe ARDS (P/F < 150 mmHg) improves dorsal V/Q matching and reduces mortality by over 50%."
    }
  ]
};

interface AnesthesiologyLabViewerProps {
  initialMode?: AnesthesiologyLabMode;
  height?: string;
  onNodeSelect?: (node: AnesthesiologyLabNode) => void;
}

export default function AnesthesiologyLabViewer({
  initialMode = "airway",
  height = "560px",
  onNodeSelect,
}: AnesthesiologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<AnesthesiologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Airway State
  const [mallampatiClass, setMallampatiClass] = useState<1 | 2 | 3 | 4>(3);

  // Volatile & MH State
  const [etco2Level, setEtco2Level] = useState<number>(76); // mmHg
  const [mhTriggerActive, setMhTriggerActive] = useState<boolean>(true);

  // ARDSNet Ventilation State
  const [patientGender, setPatientGender] = useState<"male" | "female">("male");
  const [patientHeightCm, setPatientHeightCm] = useState<number>(178); // cm
  const [tidalVolumeMlPerKg, setTidalVolumeMlPerKg] = useState<number>(6); // mL/kg PBW
  const [peepCmH2O, setPeepCmH2O] = useState<number>(12); // cmH2O
  const [pao2Fio2Ratio, setPao2Fio2Ratio] = useState<number>(110); // mmHg (Moderate ARDS)

  // ARDSNet PBW Calculation
  const ardsnetCalculations = useMemo(() => {
    const basePbw = patientGender === "male" ? 50 : 45.5;
    const calculatedPbw = Math.max(30, basePbw + 0.91 * (patientHeightCm - 152.4));
    const totalTidalVolumeMl = Math.round(calculatedPbw * tidalVolumeMlPerKg);
    const estimatedPlateauPressure = Math.round(peepCmH2O + (totalTidalVolumeMl / 30));
    const drivingPressure = estimatedPlateauPressure - peepCmH2O;

    let ardsSeverity = "Mild ARDS (P/F 201–300)";
    let ardsColor = "text-sky-300";
    let proningIndicated = false;

    if (pao2Fio2Ratio <= 100) {
      ardsSeverity = "Severe ARDS (P/F <= 100 mmHg)";
      ardsColor = "text-rose-400 font-extrabold";
      proningIndicated = true;
    } else if (pao2Fio2Ratio <= 150) {
      ardsSeverity = "Moderate ARDS (P/F <= 150 mmHg)";
      ardsColor = "text-amber-300 font-bold";
      proningIndicated = true;
    } else if (pao2Fio2Ratio <= 200) {
      ardsSeverity = "Moderate ARDS (P/F 151–200 mmHg)";
      ardsColor = "text-amber-300 font-bold";
      proningIndicated = false;
    }

    return {
      pbw: calculatedPbw.toFixed(1),
      totalVt: totalTidalVolumeMl,
      pplat: estimatedPlateauPressure,
      drivingPressure,
      isPplatSafe: estimatedPlateauPressure <= 30,
      isDrivingSafe: drivingPressure <= 14,
      ardsSeverity,
      ardsColor,
      proningIndicated
    };
  }, [patientGender, patientHeightCm, tidalVolumeMlPerKg, peepCmH2O, pao2Fio2Ratio]);

  // MH Crisis Calculation
  const mhCrisisTriage = useMemo(() => {
    if (etco2Level >= 70) {
      return {
        stage: "FULMINANT MALIGNANT HYPERTHERMIA CRISIS",
        color: "text-rose-400 font-extrabold",
        dantroleneDose: "IV Dantrolene 2.5 mg/kg rapid push (repeat q5-10m up to 10 mg/kg)",
        action: "STOP volatile agent + 100% O2 (>10 L/min) + Ice-cold saline cooling"
      };
    } else if (etco2Level >= 55) {
      return {
        stage: "EARLY MALIGNANT HYPERTHERMIA SUSPICION",
        color: "text-amber-300 font-bold",
        dantroleneDose: "Prepare IV Dantrolene 2.5 mg/kg bolus immediately",
        action: "Check for masseter spasm, inspect temp, draw emergency ABG/K+/CK"
      };
    }
    return {
      stage: "NORMAL END-TIDAL CO2 (35–45 mmHg)",
      color: "text-emerald-400 font-bold",
      dantroleneDose: "Dantrolene not indicated",
      action: "Maintain normocapnia and standard volatile depth"
    };
  }, [etco2Level]);

  const currentNodes = useMemo(() => {
    return ANESTHESIOLOGY_NODES[activeMode] || ANESTHESIOLOGY_NODES.airway;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: AnesthesiologyLabNode) => {
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
            <Wind size={14} /> ANES-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "airway" && "ASA Difficult Airway Algorithm & Mallampati Class I–IV Simulator"}
            {activeMode === "volatileMh" && "Volatile Anesthetics MAC & Malignant Hyperthermia Dantrolene Crisis Engine"}
            {activeMode === "neuromuscular" && "Neuromuscular Blockade (TOF) & Sugammadex Reversal Engine"}
            {activeMode === "ardsnet" && "ARDSNet Lung-Protective Mechanical Ventilation & Proning Protocol"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Anesthesia Quiz"}
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
                <div className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  Anesthesiology Clinical Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Protocol: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-teal-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-teal-950 text-xs rounded border border-teal-700 text-teal-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Mallampati & Difficult Airway Simulator */}
          {activeMode === "airway" && (
            <div className={styles.anesSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Mallampati Classification &amp; ASA Difficult Airway Cascade
                </span>
                <span className="text-[11px] text-slate-400">Preoperative Airway Staging</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setMallampatiClass(1)}
                  className={`p-2 rounded font-bold border transition ${
                    mallampatiClass === 1
                      ? "bg-teal-600 text-white border-teal-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Class I (Full View)
                </button>
                <button
                  onClick={() => setMallampatiClass(2)}
                  className={`p-2 rounded font-bold border transition ${
                    mallampatiClass === 2
                      ? "bg-teal-600 text-white border-teal-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Class II (Uvula Partial)
                </button>
                <button
                  onClick={() => setMallampatiClass(3)}
                  className={`p-2 rounded font-bold border transition ${
                    mallampatiClass === 3
                      ? "bg-teal-600 text-white border-teal-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Class III (Base of Uvula)
                </button>
                <button
                  onClick={() => setMallampatiClass(4)}
                  className={`p-2 rounded font-bold border transition ${
                    mallampatiClass === 4
                      ? "bg-teal-600 text-white border-teal-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Class IV (Hard Palate)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {mallampatiClass === 1 && (
                  <div>
                    <div className="text-teal-300 font-bold">Mallampati Class I (Low Risk of Difficult Intubation)</div>
                    <div className="text-slate-300 mt-1">Soft palate, fauces, complete uvula, and anterior/posterior tonsillar pillars fully visible. Routine direct laryngoscopy anticipated.</div>
                  </div>
                )}
                {mallampatiClass === 2 && (
                  <div>
                    <div className="text-teal-300 font-bold">Mallampati Class II (Low-to-Moderate Risk)</div>
                    <div className="text-slate-300 mt-1">Soft palate, fauces, and upper portion of uvula visible; tonsillar pillars obscured by tongue base.</div>
                  </div>
                )}
                {mallampatiClass === 3 && (
                  <div>
                    <div className="text-teal-300 font-bold">Mallampati Class III (High Risk of Difficult Direct Laryngoscopy)</div>
                    <div className="text-slate-300 mt-1">Soft palate and base of uvula visible only. Prepare Video Laryngoscope + Gum Elastic Bougie in advance.</div>
                  </div>
                )}
                {mallampatiClass === 4 && (
                  <div>
                    <div className="text-teal-300 font-bold">Mallampati Class IV (Very High Risk / Difficult Airway)</div>
                    <div className="text-slate-300 mt-1">Hard palate only visible; soft palate completely hidden. High likelihood of Cormack-Lehane Grade 3/4. Have 2nd-gen LMA &amp; scalpel cricothyroidotomy ready.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: Volatile MAC & MH Dantrolene Engine */}
          {activeMode === "volatileMh" && (
            <div className={styles.anesSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Malignant Hyperthermia (RYR1 Crisis) &amp; Dantrolene Engine
                </span>
                <span className="text-[11px] text-slate-400">Trigger: Sevoflurane + Succinylcholine</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>End-Tidal CO2 (EtCO2):</span>{" "}
                  <strong className="text-teal-400">{etco2Level} mmHg (Normal: 35–45 mmHg)</strong>
                </div>
                <input
                  type="range"
                  min="35"
                  max="90"
                  step="1"
                  value={etco2Level}
                  onChange={(e) => setEtco2Level(parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div className={styles.anesResultsGrid}>
                <div className={styles.anesResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Crisis Status</div>
                  <div className={`text-xs font-bold mt-1 ${mhCrisisTriage.color}`}>{mhCrisisTriage.stage}</div>
                </div>
                <div className={styles.anesResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Dantrolene Dosing</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{mhCrisisTriage.dantroleneDose}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Neuromuscular Blockade & Sugammadex */}
          {activeMode === "neuromuscular" && (
            <div className={styles.anesSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Neuromuscular Blockade (TOF) &amp; Sugammadex Chelation
                </span>
                <span className="text-[11px] text-slate-400">Target TOF Ratio &ge; 0.90</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">Sugammadex Selective Binding (SRBA)</div>
                  <div className="text-slate-300 mt-1">1:1 molecular encapsulation of Rocuronium/Vecuronium in plasma.</div>
                  <div className="text-emerald-300 font-bold mt-1">Dose: 2 mg/kg (shallow), 4 mg/kg (deep 0/4 TOF), 16 mg/kg (emergency RSI reversal).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">Cisatracurium &amp; Hofmann Elimination</div>
                  <div className="text-slate-300 mt-1">Spontaneous degradation at body temperature and pH. Completely organ-independent.</div>
                  <div className="text-sky-300 font-bold mt-1">Drug of choice in End-Stage Renal Disease (ESRD) &amp; Liver Failure.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: ARDSNet Ventilation & Proning Calculator */}
          {activeMode === "ardsnet" && (
            <div className={styles.anesSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind size={14} /> ARDSNet Lung-Protective Ventilation &amp; Proning Engine
                </span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    onClick={() => setPatientGender("male")}
                    className={`px-2 py-0.5 rounded font-bold border transition ${
                      patientGender === "male"
                        ? "bg-teal-600 text-white border-teal-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setPatientGender("female")}
                    className={`px-2 py-0.5 rounded font-bold border transition ${
                      patientGender === "female"
                        ? "bg-teal-600 text-white border-teal-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Height:</span>{" "}
                    <strong className="text-teal-400">{patientHeightCm} cm (PBW: {ardsnetCalculations.pbw} kg)</strong>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="200"
                    step="1"
                    value={patientHeightCm}
                    onChange={(e) => setPatientHeightCm(parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Tidal Volume:</span>{" "}
                    <strong className="text-teal-400">{tidalVolumeMlPerKg} mL/kg ({ardsnetCalculations.totalVt} mL)</strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="1"
                    value={tidalVolumeMlPerKg}
                    onChange={(e) => setTidalVolumeMlPerKg(parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>PaO2 / FiO2 Ratio:</span>{" "}
                    <strong className="text-teal-400">{pao2Fio2Ratio} mmHg</strong>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    step="10"
                    value={pao2Fio2Ratio}
                    onChange={(e) => setPao2Fio2Ratio(parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                </div>
              </div>

              <div className={styles.anesResultsGrid}>
                <div className={styles.anesResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Plateau Pressure (Pplat)</div>
                  <div className={`anesResultVal font-extrabold ${ardsnetCalculations.isPplatSafe ? "text-emerald-400" : "text-rose-400"}`}>
                    {ardsnetCalculations.pplat} cmH2O
                  </div>
                  <div className="text-[10px] text-slate-400">{ardsnetCalculations.isPplatSafe ? "Safe (<=30)" : "BAROTRAUMA RISK (>30)"}</div>
                </div>

                <div className={styles.anesResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Driving Pressure (&Delta;P)</div>
                  <div className={`anesResultVal font-extrabold ${ardsnetCalculations.isDrivingSafe ? "text-emerald-400" : "text-rose-400"}`}>
                    {ardsnetCalculations.drivingPressure} cmH2O
                  </div>
                  <div className="text-[10px] text-slate-400">{ardsnetCalculations.isDrivingSafe ? "Safe (<=14)" : "HIGH MORTALITY (>14)"}</div>
                </div>

                <div className={styles.anesResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Prone Positioning</div>
                  <div className={`text-xs font-bold mt-1 ${ardsnetCalculations.proningIndicated ? "text-rose-400 font-extrabold" : "text-slate-300"}`}>
                    {ardsnetCalculations.proningIndicated ? "MANDATORY (>=16 h/day)" : "Not Indicated"}
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
                    <span className="text-teal-400 font-bold">Protocol:</span> {node.clinicalProtocol}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect anesthesia protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Anesthesiology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Anesthesia Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Clinical Focus / Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Emergency Action &amp; Dosing</div>
            <div className={styles.inspectorBody}>{activeNode.emergencyAction}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Miller &amp; Morgan-Mikhail Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("airway")}
          className={`${styles.modeTab} ${activeMode === "airway" ? styles.modeTabActive : ""}`}
        >
          🫁 1. Airway &amp; Mallampati
        </button>
        <button
          onClick={() => setActiveMode("volatileMh")}
          className={`${styles.modeTab} ${activeMode === "volatileMh" ? styles.modeTabActive : ""}`}
        >
          🔥 2. Volatile MAC &amp; MH
        </button>
        <button
          onClick={() => setActiveMode("neuromuscular")}
          className={`${styles.modeTab} ${activeMode === "neuromuscular" ? styles.modeTabActive : ""}`}
        >
          ⚡ 3. NMB &amp; Sugammadex
        </button>
        <button
          onClick={() => setActiveMode("ardsnet")}
          className={`${styles.modeTab} ${activeMode === "ardsnet" ? styles.modeTabActive : ""}`}
        >
          💨 4. ARDSNet &amp; Proning
        </button>
      </div>
    </div>
  );
}
