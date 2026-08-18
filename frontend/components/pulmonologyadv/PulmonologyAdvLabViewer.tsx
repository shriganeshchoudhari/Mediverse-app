"use client";

import React, { useState, useMemo } from "react";
import styles from "./PulmonologyAdvLabViewer.module.css";
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
  Wind,
} from "lucide-react";

export type PulmonologyLabMode = "pft" | "vent" | "ards" | "hypoxemia";

export interface PulmonologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  mechanicsProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const PULMONOLOGY_LAB_NODES: Record<PulmonologyLabMode, PulmonologyLabNode[]> = {
  pft: [
    {
      id: "pulm-pft-obstructive-copd",
      name: "Obstructive Disease (Coved Loop & Air Trapping)",
      category: "Airway Obstruction",
      subType: "FEV1/FVC <0.70 • Scooped Expiratory Loop • High RV/TLC • Decreased DLCO (Emphysema)",
      mechanicsProfile: "Reduced FEV1/FVC <0.70, coved expiratory flow-volume loop, increased TLC and RV due to air trapping.",
      pathophysiology: "Loss of alveolar elastic recoil (emphysema) and airway inflammation/narrowing (bronchitis) impedes expiratory airflow.",
      clinicalHallmarks: "Chronic productive cough, exertional dyspnea, barrel chest, pursed-lip breathing, wheezing; bronchodilators + inhaled steroids.",
      highYieldPearls: "Emphysema has low DLCO due to alveolar capillary destruction, whereas pure Asthma has normal or elevated DLCO."
    },
    {
      id: "pulm-pft-fixed-upper-airway",
      name: "Fixed Upper Airway Obstruction (Bilateral Loop Flattening)",
      category: "Upper Airway Lesion",
      subType: "Flattened Insp & Exp Loops • Box-like Contour • Post-Intubation Tracheal Stenosis",
      mechanicsProfile: "Symmetrical plateauing and flattening of BOTH the inspiratory and expiratory flow limbs.",
      pathophysiology: "Rigid circumferential tracheal narrowing maintains a constant cross-sectional area regardless of transmural pressure changes.",
      clinicalHallmarks: "Biphasic stridor, exertional dyspnea after prolonged intubation; requires tracheal dilation or surgical resection.",
      highYieldPearls: "Fixed lesions flatten BOTH limbs; Variable extrathoracic flattens inspiration ONLY; Variable intrathoracic flattens expiration ONLY."
    }
  ],

  vent: [
    {
      id: "pulm-vent-high-resistance",
      name: "High Airway Resistance (High PIP & Normal Pplat)",
      category: "Ventilator Mechanics",
      subType: "Elevated PIP (>40) • Normal Pplat (<=30) • Bronchospasm • Secretions • ETT Kink",
      mechanicsProfile: "Large gradient between PIP and Pplat (Raw >15 cmH2O/L/s); alveolar distending pressure remains protected.",
      pathophysiology: "Increased frictional resistance to airflow through the conducting airways or endotracheal tube without parenchymal stiffness.",
      clinicalHallmarks: "Sudden high-pressure alarm, wheezing, rhonchi; managed with airway suctioning, bite block, and inhaled bronchodilators.",
      highYieldPearls: "Normal Pplat proves lung compliance is intact; the resistive workload is confined to the tube or large conducting airways."
    },
    {
      id: "pulm-vent-low-compliance",
      name: "Low Lung Compliance (High PIP & High Pplat)",
      category: "Ventilator Mechanics",
      subType: "Elevated PIP (>40) • Elevated Pplat (>30) • Driving Pressure >15 • Tension PTX / ARDS",
      mechanicsProfile: "Simultaneous elevation of PIP and Pplat with narrow gradient; severely reduced static compliance (Cstat <30 mL/cmH2O).",
      pathophysiology: "Stiff, non-compliant lungs or chest wall or pleural air/fluid collection impairs elastic expansion.",
      clinicalHallmarks: "Tension pneumothorax (unilateral absent breath sounds, hypotension), severe ARDS, massive pulmonary edema; immediate needle decompression if PTX.",
      highYieldPearls: "Elevated Pplat (>30 cmH2O) warns of impending alveolar barotrauma; Driving Pressure (Pplat - PEEP) must be targeted <15 cmH2O."
    }
  ],

  ards: [
    {
      id: "pulm-ards-severe-prone",
      name: "Severe ARDS & Prone Rescue (P/F <=100 & True Shunt)",
      category: "Acute Lung Injury",
      subType: "P/F <=100 mmHg • Low Vt (6 mL/kg PBW) • Pplat <=30 • Prone Positioning >=16h/day",
      mechanicsProfile: "Profound true right-to-left intrapulmonary shunt (V/Q = 0) with diffuse bilateral non-cardiogenic pulmonary edema.",
      pathophysiology: "Inflammatory alveolar-capillary barrier breakdown causes alveolar flooding, hyaline membranes, and extensive dorsal collapse.",
      clinicalHallmarks: "Severe refractory hypoxemia, bilateral infiltrates without left heart failure; managed with prone ventilation >=16h/day and VV-ECMO.",
      highYieldPearls: "Prone positioning recruits dorsal alveoli, homogenizes transpulmonary pressures, and significantly reduces ARDS mortality."
    },
    {
      id: "pulm-ards-protective-ventilation",
      name: "ARDSNet Low Tidal Volume Strategy (6 mL/kg PBW)",
      category: "Lung Protective Protocol",
      subType: "Vt 4-8 mL/kg PBW • Pplat <=30 cmH2O • Driving Pressure <15 • Permissive Hypercapnia",
      mechanicsProfile: "Limits tidal volume based on predicted body weight (not actual weight) to prevent alveolar overdistention (volutrauma).",
      pathophysiology: "Reduces repetitive opening and closing of unstable alveolar units (atelectrauma) and biotrauma.",
      clinicalHallmarks: "Permissive hypercapnia allowed as long as pH >=7.20; target Pplat <=30 cmH2O and driving pressure <15 cmH2O.",
      highYieldPearls: "PBW calculation uses height, not actual weight, avoiding lethal tidal volume overdose in obese patients."
    }
  ],

  hypoxemia: [
    {
      id: "pulm-hypox-hypoventilation",
      name: "Pure Alveolar Hypoventilation (Normal A-a & High PaCO2)",
      category: "Hypoxemia Mechanism",
      subType: "Normal A-a Gradient (<15) • High PaCO2 (>50) • Low PaO2 • Opioid Overdose / ALS",
      mechanicsProfile: "Inadequate minute ventilation leads to alveolar CO2 accumulation, displacing oxygen according to the Alveolar Gas Equation.",
      pathophysiology: "Central respiratory depression or neuromuscular failure prevents fresh gas exchange despite normal alveolar-capillary membranes.",
      clinicalHallmarks: "Somnolence, shallow breathing, bradypnea, respiratory acidosis; rapidly reverses with Naloxone or non-invasive/invasive ventilation.",
      highYieldPearls: "Normal A-a gradient (PAO2 - PaO2 <15) in a hypoxemic patient proves the lungs themselves are completely normal."
    },
    {
      id: "pulm-hypox-sharkfin-capnogram",
      name: "Bronchospasm Shark-Fin Capnogram (Sloping Plateau)",
      category: "Capnography Waveform",
      subType: "Loss of Flat Phase III Plateau • Upward Sloping 'Shark-Fin' • Asthma / Severe COPD",
      mechanicsProfile: "Delayed and uneven alveolar emptying creates a prolonged, upward-slanted expiratory Phase III on capnography.",
      pathophysiology: "Heterogeneous airway narrowing in severe asthma or COPD leads to asynchronous exhalation of CO2 from obstructed lung units.",
      clinicalHallmarks: "Expiratory wheezing, prolonged expiratory phase, dyspnea; responds to inhaled beta-2 agonists and systemic corticosteroids.",
      highYieldPearls: "Sudden flattening or normalization of the shark-fin waveform provides real-time objective proof of bronchodilator response."
    }
  ]
};

interface PulmonologyAdvLabViewerProps {
  initialMode?: PulmonologyLabMode;
  height?: string;
  onNodeSelect?: (node: PulmonologyLabNode) => void;
}

export default function PulmonologyAdvLabViewer({
  initialMode = "pft",
  height = "560px",
  onNodeSelect,
}: PulmonologyAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<PulmonologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // PFT Selector State
  const [selectedPft, setSelectedPft] = useState<"obstructive" | "restrictive" | "fixed" | "variable">("obstructive");

  // Ventilator Troubleshooting State
  const [selectedVent, setSelectedVent] = useState<"resistance" | "compliance" | "driving" | "cstat">("resistance");

  const pftDetails = useMemo(() => {
    if (selectedPft === "obstructive") {
      return {
        title: "Obstructive Lung Disease (COPD / Asthma)",
        profile: "FEV1/FVC <0.70 • Scooped-out Expiratory Loop • High RV & FRC (Air Trapping)",
        dlco: "Decreased DLCO in Emphysema; Normal or High DLCO in Asthma",
        pearl: "Bronchodilator reversibility: >12% and >200 mL increase in FEV1 or FVC confirms asthma."
      };
    } else if (selectedPft === "restrictive") {
      return {
        title: "Intrinsic Restrictive Disease (Idiopathic Pulmonary Fibrosis)",
        profile: "FEV1/FVC >=0.75 • Miniature 'Witch's Hat' Loop • TLC <80% Predicted",
        dlco: "Severely Reduced DLCO (<50%) due to interstitial thickening and fibrosis",
        pearl: "Extrinsic chest wall / neuromuscular restrictions have NORMAL DLCO."
      };
    } else if (selectedPft === "fixed") {
      return {
        title: "Fixed Upper Airway Obstruction (Tracheal Stenosis / Goiter)",
        profile: "Flattening of BOTH Inspiratory AND Expiratory Loops • Box-like Contour",
        dlco: "Normal DLCO; constant orifice resistance independent of transmural pressure",
        pearl: "Post-intubation tracheal stenosis is the classic cause of fixed upper airway obstruction."
      };
    } else {
      return {
        title: "Variable Extrathoracic Obstruction (Vocal Cord Paralysis)",
        profile: "Flattening of INSPIRATORY Loop ONLY • Expiratory Loop Preserved",
        dlco: "Normal DLCO; negative airway pressure during inspiration collapses the lesion",
        pearl: "Contrasts with variable intrathoracic obstruction which flattens EXPIRATION only."
      };
    }
  }, [selectedPft]);

  const ventDetails = useMemo(() => {
    if (selectedVent === "resistance") {
      return {
        title: "High Airway Resistance (PIP >40, Pplat <=30)",
        mechanics: "Elevated PIP • Normal Pplat • Raw >15 cmH2O/L/s • Safe Alveolar Pressure",
        causes: "Bronchospasm, secretions, mucus plug, endotracheal tube biting/kinking",
        pearl: "Normal Pplat proves lung compliance is intact; the obstruction is in the tube or large airways."
      };
    } else if (selectedVent === "compliance") {
      return {
        title: "Low Respiratory Compliance (PIP >40, Pplat >30)",
        mechanics: "Elevated PIP • Elevated Pplat • Cstat <30 mL/cmH2O • High Barotrauma Risk",
        causes: "Tension Pneumothorax (EMERGENCY!), Severe ARDS, Pulmonary Edema, Right Mainstem Intubation",
        pearl: "Pplat >30 cmH2O indicates alveolar overdistention; immediately decompress if tension PTX."
      };
    } else if (selectedVent === "driving") {
      return {
        title: "Driving Pressure Optimization (Target ΔP <15 cmH2O)",
        mechanics: "ΔP = Pplat - PEEP • Primary determinant of ARDS mortality",
        causes: "High driving pressure indicates excessive lung strain relative to functional lung size",
        pearl: "Titrating PEEP and reducing tidal volume to minimize ΔP improves survival in ARDS."
      };
    } else {
      return {
        title: "Static Respiratory System Compliance (Cstat)",
        mechanics: "Cstat = Vt / (Pplat - PEEP) • Normal: 50 - 80 mL/cmH2O",
        causes: "Severely depressed in ARDS, chest wall rigidity, abdominal compartment syndrome",
        pearl: "Measured during an end-inspiratory hold when airflow is zero."
      };
    }
  }, [selectedVent]);

  const currentNodes = useMemo(() => {
    return PULMONOLOGY_LAB_NODES[activeMode] || PULMONOLOGY_LAB_NODES.pft;
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
            <Wind size={14} /> PULM-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "pft" && "Flow-Volume Loops & Pulmonary Function Testing (PFT)"}
            {activeMode === "vent" && "Mechanical Ventilation Mechanics & Pressure Troubleshooting"}
            {activeMode === "ards" && "ARDS Berlin Criteria, Lung-Protective Ventilation & Prone Rescue"}
            {activeMode === "hypoxemia" && "Mechanisms of Hypoxemia, A-a Gradient & Capnography Waveforms"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Pulmonology Diagnostic Quiz"}
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
                  Pulmonology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Pulmonary Entity: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Flow-Volume Loops */}
          {activeMode === "pft" && (
            <div className={styles.pulmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Flow-Volume Loop &amp; Spirometry Simulator
                </span>
                <span className="text-[11px] text-slate-400">FEV1/FVC &bull; TLC &bull; RV &bull; DLCO</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedPft("obstructive")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPft === "obstructive"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌬️ Obstructive (COPD)
                </button>
                <button
                  onClick={() => setSelectedPft("restrictive")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPft === "restrictive"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧱 Restrictive (IPF)
                </button>
                <button
                  onClick={() => setSelectedPft("fixed")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPft === "fixed"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔒 Fixed Upper Airway
                </button>
                <button
                  onClick={() => setSelectedPft("variable")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPft === "variable"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🗣️ Extrathoracic
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-sky-300">{pftDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{pftDetails.profile}</div>
                <div className="text-slate-300 mt-1"><strong className="text-sky-400">Diffusion (DLCO):</strong> {pftDetails.dlco}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">PFT Pearl:</strong> {pftDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Ventilator Mechanics */}
          {activeMode === "vent" && (
            <div className={styles.pulmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge size={14} /> Ventilator Mechanics &amp; Pressure Alarm Troubleshooting
                </span>
                <span className="text-[11px] text-slate-400">PIP &bull; Pplat &bull; Compliance &bull; Driving Pressure</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedVent("resistance")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedVent === "resistance"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ High Airway Resistance
                </button>
                <button
                  onClick={() => setSelectedVent("compliance")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedVent === "compliance"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  📉 Low Compliance (PTX)
                </button>
                <button
                  onClick={() => setSelectedVent("driving")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedVent === "driving"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🎯 Driving Pressure (&Delta;P)
                </button>
                <button
                  onClick={() => setSelectedVent("cstat")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedVent === "cstat"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  📐 Static Compliance
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-sky-300">{ventDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{ventDetails.mechanics}</div>
                <div className="text-slate-300 mt-1"><strong className="text-sky-400">Etiologies:</strong> {ventDetails.causes}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Clinical Pearl:</strong> {ventDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: ARDS & Rescue */}
          {activeMode === "ards" && (
            <div className={styles.pulmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> ARDS Berlin Criteria &amp; Evidence-Based Rescue
                </span>
                <span className="text-[11px] text-slate-400">P/F Ratio &bull; Low Vt (6 mL/kg PBW) &bull; Prone &ge;16h/day</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">ARDSNet Lung-Protective Ventilation</div>
                  <div className="text-slate-300 mt-1">Low tidal volume (4-8 mL/kg Predicted Body Weight), target Pplat &le;30 cmH2O, driving pressure &lt;15 cmH2O, permissive hypercapnia (pH &ge;7.20). Prevents volutrauma.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Prone Positioning Rescue (PROSEVA)</div>
                  <div className="text-slate-300 mt-1">Indicated for severe/moderate ARDS with P/F &lt;150 mmHg. Maintain &ge;16 consecutive hours/day in prone position. Recruits dorsal alveoli and lowers mortality.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Hypoxemia & Capnography */}
          {activeMode === "hypoxemia" && (
            <div className={styles.pulmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio size={14} /> Mechanisms of Hypoxemia &amp; Capnography Waveforms
                </span>
                <span className="text-[11px] text-slate-400">A-a Gradient &bull; Shunt &bull; Shark-Fin EtCO2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">The 5 Mechanisms of Hypoxemia</div>
                  <div className="text-slate-300 mt-1">Normal A-a: Hypoventilation &amp; Low FiO2. High A-a: V/Q mismatch (O2 responsive), Right-to-Left Shunt (REFRACTORY to 100% O2), and Diffusion impairment.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">"Shark-Fin" Capnogram (EtCO2)</div>
                  <div className="text-slate-300 mt-1">Loss of flat Phase III alveolar plateau with upward slanting slope. Pathognomonic of bronchospasm / severe airflow obstruction in asthma and COPD.</div>
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
                    <span className="text-sky-400 font-bold">Mechanics:</span> {node.mechanicsProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect dynamics</span>
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
              Pulmonary Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🫁 Pulmonary Entity / Mode</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📊 Respiratory Mechanics &amp; Pressures</div>
            <div className="text-xs text-sky-300 font-semibold">{activeNode.mechanicsProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Features &amp; Evidence-Based Action</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Diagnostic Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("pft")}
          className={`${styles.modeTab} ${activeMode === "pft" ? styles.modeTabActive : ""}`}
        >
          🌬️ 1. Flow-Volume Loops
        </button>
        <button
          onClick={() => setActiveMode("vent")}
          className={`${styles.modeTab} ${activeMode === "vent" ? styles.modeTabActive : ""}`}
        >
          ⚙️ 2. Vent Mechanics
        </button>
        <button
          onClick={() => setActiveMode("ards")}
          className={`${styles.modeTab} ${activeMode === "ards" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. ARDS &amp; Prone
        </button>
        <button
          onClick={() => setActiveMode("hypoxemia")}
          className={`${styles.modeTab} ${activeMode === "hypoxemia" ? styles.modeTabActive : ""}`}
        >
          📈 4. Hypoxemia &amp; EtCO2
        </button>
      </div>
    </div>
  );
}
