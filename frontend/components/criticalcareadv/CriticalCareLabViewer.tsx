"use client";

import React, { useState, useMemo } from "react";
import styles from "./CriticalCareLabViewer.module.css";
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

export type CriticalCareLabMode = "hemodynamics" | "ards" | "fluid" | "delirium";

export interface CriticalCareLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  pathophysiologyProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const CRITICAL_CARE_LAB_NODES: Record<CriticalCareLabMode, CriticalCareLabNode[]> = {
  hemodynamics: [
    {
      id: "ccm-hemo-do2-vo2",
      name: "Oxygen Delivery DO2 & Extraction Ratio (Supply Dependency)",
      category: "Oxygen Transport",
      subType: "DO2 = CO * CaO2 * 10 (~1000 mL/min) • VO2 = CO * (CaO2 - CvO2) * 10 (~250 mL/min) • O2ER ~25% • DO2crit",
      pathophysiologyProfile: "Mathematical relationship between systemic forward arterial oxygen flux and peripheral tissue cellular consumption.",
      pathophysiology: "When DO2 drops below critical threshold (DO2crit ~330 mL/min/m2), extraction is maximized and VO2 becomes supply-dependent, producing dysoxia.",
      clinicalHallmarks: "Lactic acidosis, oliguria, altered mentation; low SvO2 (<65%) indicates high tissue extraction from depressed DO2; inotropes restore DO2.",
      highYieldPearls: "Supply-dependent VO2 (VO2-DO2 dependency) defines pathological tissue dysoxia where cellular oxygen consumption is limited by blood flow."
    },
    {
      id: "ccm-hemo-swan-ganz",
      name: "Pulmonary Artery Swan-Ganz Catheter (PA Dicrotic Notch & PCWP)",
      category: "Invasive Monitoring",
      subType: "RA (0-8) -> RV (25/5) -> PA (25/10 with Dicrotic Notch) -> PCWP Wedge (4-12 mmHg) • Thermodilution CO",
      pathophysiologyProfile: "Right heart floating balloon-tipped catheter traversing chambers to measure intracardiac and pulmonary capillary pressures.",
      pathophysiology: "Balloon occlusion of a distal pulmonary arterial branch creates a static column of blood reflecting left atrial pressure (LVEDP).",
      clinicalHallmarks: "Dicrotic notch distinguishes PA from RV waveform; elevated PCWP (>18 mmHg) differentiates cardiogenic from non-cardiogenic (ARDS) edema.",
      highYieldPearls: "PCWP <= 18 mmHg confirms non-cardiogenic pulmonary edema (ARDS); PCWP > 18 mmHg indicates cardiogenic hydrostatic pulmonary congestion."
    },
    {
      id: "ccm-hemo-svo2-scvo2",
      name: "Mixed Venous Oxygen Saturation SvO2 (Tissue Extraction Index)",
      category: "Metabolic Monitoring",
      subType: "Normal SvO2 65-75% • Low in Cardiogenic/Hypovolemic Shock • Elevated in Severe Sepsis / Cyanide Toxicity",
      pathophysiologyProfile: "Reflects the weighted average of blood returning from all vascular beds, balancing arterial delivery against extraction.",
      pathophysiology: "Low forward flow forces tissues to extract more O2, lowering SvO2; microvascular shunting in sepsis prevents extraction, raising SvO2.",
      clinicalHallmarks: "SvO2 <65%: cardiogenic shock, hemorrhage, severe anemia; SvO2 >80%: septic shock (vasoplegia/shunting), cyanide poisoning (cytochrome c block).",
      highYieldPearls: "SvO2 < 65% indicates depressed cardiac output or severe anemia; SvO2 > 80% indicates impaired tissue oxygen utilization (sepsis/cyanide)."
    }
  ],

  ards: [
    {
      id: "ccm-ards-berlin-criteria",
      name: "ARDS Berlin Diagnostic Criteria (Timing, Opacities & PaO2/FiO2)",
      category: "ARDS Diagnostics",
      subType: "Acute (<=1 Week) • Bilateral Opacities • Non-Cardiogenic (PCWP <=18) • Mild (200-300), Moderate (100-200), Severe (<=100)",
      pathophysiologyProfile: "Immune-mediated alveolar-capillary barrier disruption causing protein-rich alveolar flooding and surfactant destruction.",
      pathophysiology: "Diffuse alveolar damage creates widespread intrapulmonary shunt, severe ventilation-perfusion mismatch, and loss of lung compliance.",
      clinicalHallmarks: "Refractory hypoxemia following sepsis, pneumonia, pancreatitis, or aspiration; diffuse bilateral infiltrates; low compliance.",
      highYieldPearls: "The Berlin ARDS Definition requires: acute onset <=1 week, bilateral infiltrates, non-cardiogenic origin, and PaO2/FiO2 <= 300 on PEEP >= 5."
    },
    {
      id: "ccm-ards-low-vt-pbw",
      name: "ARDSNet Low Tidal Volume Ventilation (4-6 mL/kg PBW)",
      category: "Lung-Protective MV",
      subType: "4-6 mL/kg Predicted Body Weight (PBW) • Plateau Pressure Pplat <= 30 cmH2O • Volutrauma & Barotrauma Prevention",
      pathophysiologyProfile: "Heterogeneous lung injury creates a small functional 'baby lung' vulnerable to overdistension by normal tidal volumes.",
      pathophysiology: "Low tidal volumes based on predicted (not actual) weight prevent cyclic alveolar overstretching and shear-stress biotrauma.",
      clinicalHallmarks: "Tidal volume calculated from height (PBW formula); limit Pplat to <=30 cmH2O during end-inspiratory pause; permissive hypercapnia allowed.",
      highYieldPearls: "Always calculate ARDS tidal volume using PREDICTED body weight (based on height and sex), NEVER actual body weight!"
    },
    {
      id: "ccm-ards-driving-pressure",
      name: "Driving Pressure Delta-P Optimization (Pplat - PEEP <= 14 cmH2O)",
      category: "Mechanical Strain",
      subType: "Delta-P = Pplat - PEEP • Target <= 14-15 cmH2O • Ratio of Tidal Volume to Respiratory System Compliance",
      pathophysiologyProfile: "Index of functional lung strain: Delta-P = VT / C_rs, reflecting the tidal stretch delivered to aerated lung tissue.",
      pathophysiology: "High driving pressure indicates excessive cyclical deformation of open alveoli, strongly predicting multi-organ failure and death.",
      clinicalHallmarks: "Driving pressure >15 cmH2O requires reduction in tidal volume or optimization of PEEP along the deflation limb of compliance.",
      highYieldPearls: "Driving Pressure (Plateau Pressure - PEEP) is the single mechanical ventilator variable most strongly associated with survival in ARDS."
    },
    {
      id: "ccm-ards-prone-positioning",
      name: "Prone Positioning Resuscitation (PROSEVA Protocol >=16 Hours/Day)",
      category: "Rescue Therapy",
      subType: "Moderate-Severe ARDS (PaO2/FiO2 <150) • >=16 Hours/Day Prone • Relieves Dorsal Lung Compression • Proven Mortality Benefit",
      pathophysiologyProfile: "Gravitational relief of ventral-dorsal transpulmonary pressure gradients and cardiac mass compression on dependent dorsal lung.",
      pathophysiology: "Prone orientation homogenizes transpulmonary pressure, promotes dorsal alveolar recruitment, and optimizes ventilation-perfusion matching.",
      clinicalHallmarks: "Initiate in PaO2/FiO2 <150 on PEEP >=10; maintain prone for >=16 consecutive hours daily; reduces 28-day mortality by >50% (PROSEVA).",
      highYieldPearls: "Prone positioning for >=16 hours/day provides a definitive, proven mortality reduction in moderate-to-severe ARDS (PaO2/FiO2 < 150)."
    }
  ],

  fluid: [
    {
      id: "ccm-flu-plr-dynamic",
      name: "Passive Leg Raise PLR Dynamic Challenge (300-500 mL Reversible)",
      category: "Dynamic Responsiveness",
      subType: "Reversible Autotransfusion • >=10-15% Rise in Stroke Volume / CO • Gold Standard • Valid in Arrhythmias & Spontaneous Breathing",
      pathophysiologyProfile: "Gravitational shift of venous reservoir blood from the lower extremities and splanchnic circulation back to the right atrium.",
      pathophysiology: "Acts as a temporary, fully reversible ~300-500 mL fluid bolus: if the patient is on the ascending limb of the Starling curve, CO increases.",
      clinicalHallmarks: "Transition bed from semi-recumbent to supine with legs elevated 45 degrees; real-time CO monitoring showing >=10% rise confirms response.",
      highYieldPearls: "The Passive Leg Raise (PLR) test is the gold standard dynamic fluid challenge because it is reversible and valid during spontaneous breathing."
    },
    {
      id: "ccm-flu-svv-ppv",
      name: "Stroke Volume Variation SVV & PPV (Cardiopulmonary Interactions)",
      category: "Dynamic Responsiveness",
      subType: "SVV > 12-13% • PPV > 13% • Requires Volume-Controlled MV (VT >= 8 mL/kg) • NO Spontaneous Breaths • Sinus Rhythm Only",
      pathophysiologyProfile: "Cyclical positive-pressure mechanical inspiration increases intrathoracic pressure, transiently decreasing RV venous return.",
      pathophysiology: "Large variations in left ventricular stroke volume across the respiratory cycle indicate biventricular preload responsiveness.",
      clinicalHallmarks: "Arterial line pulse contour analysis; SVV >13% indicates fluid responsiveness only if fully passive on controlled MV with VT >=8 mL/kg.",
      highYieldPearls: "SVV and PPV are valid ONLY in deeply sedated patients on volume-controlled mechanical ventilation with NO spontaneous breaths or arrhythmias."
    },
    {
      id: "ccm-flu-norepi-vasopressor",
      name: "First-Line Norepinephrine Vasopressor Therapy (Alpha-1 SVR)",
      category: "Vasoactive Pharmacology",
      subType: "Alpha-1 > Beta-1 Adrenergic Agonist • Restores SVR & MAP (Target >=65 mmHg) • Sparing Vasopressin (0.03 U/min) Adjunct",
      pathophysiologyProfile: "Potent arteriolar vasoconstriction via vascular smooth muscle alpha-1 Gq-protein coupled receptors.",
      pathophysiology: "Counteracts cytokine-mediated vasoplegia, raising mean arterial pressure and restoring coronary and renal perfusion.",
      clinicalHallmarks: "First-line vasopressor in septic and vasodilatory shock; titrate to MAP >=65 mmHg; add fixed-dose Vasopressin (0.03 U/min) to reduce dose.",
      highYieldPearls: "Norepinephrine is the uncontested first-line vasopressor for septic shock; add Vasopressin (0.03 U/min) as a second-line catecholamine-sparing agent."
    },
    {
      id: "ccm-flu-dobutamine-inotrope",
      name: "Inotropic Dobutamine Support (Septic Cardiomyopathy)",
      category: "Inotropic Support",
      subType: "Beta-1 > Beta-2 Inotrope & Lusitrope • Augmented Myocardial Contractility • Indicated for Persistent Hypoperfusion / Depressed CI",
      pathophysiologyProfile: "Direct stimulation of cardiac beta-1 receptors activating adenylate cyclase, raising intracellular cAMP and calcium transients.",
      pathophysiology: "Increases forward stroke volume and cardiac index in patients with sepsis-induced myocardial dysfunction (septic cardiomyopathy).",
      clinicalHallmarks: "Indicated when patient remains hypoperfused (high lactate, low ScvO2 <70%) despite achieving target MAP >=65 mmHg with norepinephrine.",
      highYieldPearls: "Add Dobutamine in septic shock when persistent hypoperfusion or myocardial dysfunction persists despite adequate volume and MAP."
    }
  ],

  delirium: [
    {
      id: "ccm-del-rass-score",
      name: "Richmond Agitation-Sedation Scale RASS (Light Sedation Target 0 to -1)",
      category: "Sedation Scoring",
      subType: "Scale from +4 (Combative) to -5 (Unarousable) • Target Light Sedation: RASS 0 (Alert/Calm) to -1 (Drowsy) • PADIS Guideline",
      pathophysiologyProfile: "Standardized numerical scale quantifying patient arousal and agitation in response to verbal and physical stimuli.",
      pathophysiology: "Deep sedation (RASS -4/-5) increases mortality, prolongs mechanical ventilation, and triggers cognitive delirium.",
      clinicalHallmarks: "Routine nursing titration every 2-4 hours; titrate sedatives downward to achieve target RASS 0 to -1 (sustained eye contact to voice).",
      highYieldPearls: "Modern ICU guidelines mandate targeting LIGHT sedation (RASS 0 to -1); deep sedation must be avoided unless specific indications exist."
    },
    {
      id: "ccm-del-cam-icu-algorithm",
      name: "CAM-ICU Delirium Diagnostic Algorithm (Inattention & Confusion)",
      category: "Delirium Assessment",
      subType: "Feature 1: Acute Onset/Fluctuating + Feature 2: Inattention (SaveAHAART) + Feature 3 (RASS != 0) OR Feature 4 (Disorganized Thinking)",
      pathophysiologyProfile: "Neurotransmitter imbalance (dopaminergic excess, cholinergic deficit, neuroinflammation) producing acute encephalopathy.",
      pathophysiology: "ICU delirium triples 6-month mortality and causes long-term cognitive impairment (post-intensive care syndrome).",
      clinicalHallmarks: "Inattention test with letter sequence 'SAVEAHAART' (>2 errors = positive); current RASS != 0; Disorganized thinking questions.",
      highYieldPearls: "CAM-ICU Positive requires: Acute onset (Feat 1) + Inattention (Feat 2) + EITHER Altered Consciousness (Feat 3) OR Disorganized Thinking (Feat 4)."
    },
    {
      id: "ccm-del-dexmedetomidine-propofol",
      name: "Dexmedetomidine vs Benzodiazepines (Delirium Reduction)",
      category: "Sedative Pharmacology",
      subType: "Dexmedetomidine (Selective Alpha-2 Agonist) • Conscious Cooperative Sedation • No Respiratory Depression • Low Delirium",
      pathophysiologyProfile: "Locus coeruleus alpha-2 adrenergic receptor stimulation promoting natural non-REM stage 3 sleep pathways.",
      pathophysiology: "Avoids GABAergic disruption of cognitive circuits; benzodiazepines (Midazolam) are independent drivers of ICU delirium.",
      clinicalHallmarks: "Dexmedetomidine allows interactive, cooperative patient state while intubated; Propofol for rapid sedation; avoid routine benzos.",
      highYieldPearls: "Dexmedetomidine and Propofol are preferred over Benzodiazepines because Benzodiazepines directly increase the incidence of ICU Delirium."
    },
    {
      id: "ccm-del-abcdef-bundle",
      name: "The ABCDEF ICU Liberation Protocol (SAT/SBT & Early Mobility)",
      category: "ICU Liberation",
      subType: "A: Assess Pain • B: Both SAT/SBT • C: Choice Sedation • D: Delirium Screen • E: Early Mobility • F: Family Engagement",
      pathophysiologyProfile: "Multicomponent evidence-based clinical bundle designed to break the cycle of immobilization, oversedation, and delirium.",
      pathophysiology: "Daily interruption of sedatives paired with spontaneous breathing trials shortens mechanical ventilation by 3-4 days.",
      clinicalHallmarks: "Daily SAT (stop sedatives) + SBT (T-piece trial); progressive physical therapy (walking while intubated); reduces 1-year mortality.",
      highYieldPearls: "The ABCDEF bundle significantly reduces ventilator days, ICU delirium, ICU length of stay, and long-term post-ICU cognitive decline."
    }
  ]
};

interface CriticalCareLabViewerProps {
  initialMode?: CriticalCareLabMode;
  height?: string;
  onNodeSelect?: (node: CriticalCareLabNode) => void;
}

export default function CriticalCareLabViewer({
  initialMode = "hemodynamics",
  height = "560px",
  onNodeSelect,
}: CriticalCareLabViewerProps) {
  const [activeMode, setActiveMode] = useState<CriticalCareLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // ARDS Profiler State
  const [selectedArds, setSelectedArds] = useState<"mild" | "moderate" | "severe">("severe");

  // Fluid Profiler State
  const [selectedFluid, setSelectedFluid] = useState<"plr" | "svv" | "norepi" | "dobutamine">("plr");

  const ardsDetails = useMemo(() => {
    if (selectedArds === "mild") {
      return {
        title: "Mild ARDS (Berlin Definition)",
        indices: "200 < PaO2/FiO2 <= 300 mmHg • PEEP >= 5 cmH2O • Non-Cardiogenic Bilateral Infiltrates",
        rx: "Low Tidal Volume (4-6 mL/kg PBW) + Pplat <= 30 cmH2O + Delta-P <= 14 cmH2O + Nasal CPAP / NIV trial",
        pearl: "Maintain plateau pressure <= 30 cmH2O to prevent alveolar overdistension barotrauma."
      };
    } else if (selectedArds === "moderate") {
      return {
        title: "Moderate ARDS (Berlin Definition)",
        indices: "100 < PaO2/FiO2 <= 200 mmHg • PEEP >= 5-10 cmH2O • Significant Intrapulmonary Shunt",
        rx: "ARDSNet Low-VT + Higher PEEP titration + Consider Neuromuscular Blockade (Cisatracurium <48h)",
        pearl: "Titrate PEEP according to ARDSNet table to prevent cyclic alveolar collapse and atelectrauma."
      };
    } else {
      return {
        title: "Severe ARDS (Berlin Definition)",
        indices: "PaO2/FiO2 <= 100 mmHg on PEEP >= 10 cmH2O • Profound Refractory Hypoxemia",
        rx: "PRONE POSITIONING (>=16 hours/day PROSEVA) + Cisatracurium infusion + Consider VV-ECMO rescue",
        pearl: "Prone positioning for >=16 hours/day reduces mortality by >50% in severe ARDS (PaO2/FiO2 < 150)."
      };
    }
  }, [selectedArds]);

  const fluidDetails = useMemo(() => {
    if (selectedFluid === "plr") {
      return {
        title: "Passive Leg Raise (PLR) Dynamic Autotransfusion",
        indices: "300-500 mL Reversible Blood Challenge • >=10-15% Rise in Stroke Volume / CO • Gold Standard",
        rx: "If PLR positive: administer 250-500 mL balanced crystalloid bolus; if negative: withhold fluid bolus",
        pearl: "PLR is valid in spontaneously breathing patients and those with cardiac arrhythmias."
      };
    } else if (selectedFluid === "svv") {
      return {
        title: "Stroke Volume Variation (SVV) & PPV",
        indices: "SVV > 12-13% on Controlled MV • Requires VT >= 8 mL/kg, NO Spontaneous Breaths, Sinus Rhythm",
        rx: "SVV > 13% confirms fluid responsiveness on the ascending limb of the Frank-Starling curve",
        pearl: "SVV is invalid if the patient makes spontaneous breathing efforts or has cardiac arrhythmias."
      };
    } else if (selectedFluid === "norepi") {
      return {
        title: "Norepinephrine (First-Line Vasopressor)",
        indices: "Alpha-1 > Beta-1 • Restores SVR & Target MAP >= 65 mmHg • Preserves Cardiac Inotropy",
        rx: "Titrate 0.02 - 1.0 mcg/kg/min; add fixed Vasopressin (0.03 U/min) to reduce adrenergic toxicity",
        pearl: "Norepinephrine is the first-choice vasopressor in septic shock to restore organ perfusion pressure."
      };
    } else {
      return {
        title: "Dobutamine (Inotropic Support in Sepsis)",
        indices: "Beta-1 > Beta-2 • Augmented Myocardial Contractility • Indicated for Septic Cardiomyopathy",
        rx: "Initiate 2.5 - 20 mcg/kg/min when hypoperfusion (lactate, ScvO2 <70%) persists despite target MAP",
        pearl: "Add Dobutamine if persistent tissue hypoperfusion occurs due to myocardial depression."
      };
    }
  }, [selectedFluid]);

  const currentNodes = useMemo(() => {
    return CRITICAL_CARE_LAB_NODES[activeMode] || CRITICAL_CARE_LAB_NODES.hemodynamics;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: CriticalCareLabNode) => {
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
            <Activity size={14} /> CCM-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "hemodynamics" && "Advanced Hemodynamics: DO2/VO2 Dynamics, Swan-Ganz Catheter & SvO2"}
            {activeMode === "ards" && "ARDS Mechanical Ventilation: Berlin Criteria, ARDSNet Low-VT & Prone Positioning"}
            {activeMode === "fluid" && "Dynamic Fluid Responsiveness (PLR, SVV) & Vasoactive Pharmacology in Sepsis"}
            {activeMode === "delirium" && "ICU Sedation (PADIS Guidelines), CAM-ICU Delirium & The ABCDEF Bundle"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Critical Care Diagnostic Quiz"}
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
                  Critical Care Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Critical Care Protocol / Dynamic Target: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Oxygen Transport & Hemodynamics */}
          {activeMode === "hemodynamics" && (
            <div className={styles.ccmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Oxygen Transport Dynamics &amp; Pulmonary Artery Catheterization
                </span>
                <span className="text-[11px] text-slate-400">DO2 &bull; VO2 &bull; O2ER &bull; SvO2 &bull; PCWP Wedge</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Oxygen Delivery (DO2) &amp; Supply Dependency</div>
                  <div className="text-slate-300 mt-1">DO2 = CO &times; CaO2 &times; 10 (~1,000 mL/min). When DO2 falls below critical threshold (DO2crit ~330 mL/min/m2), tissue oxygen consumption becomes supply-dependent, precipitating anaerobic cellular dysoxia and hyperlactatemia.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Swan-Ganz Catheterization &amp; SvO2 Index</div>
                  <div className="text-slate-300 mt-1">RA (0-8) -&gt; RV (25/5) -&gt; PA with dicrotic notch (25/10) -&gt; PCWP Wedge (4-12 mmHg). Low SvO2 (&lt;65%) indicates high tissue extraction (cardiogenic/hypovolemic shock); High SvO2 (&gt;80%) indicates microvascular extraction failure (sepsis, cyanide).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: ARDS & Mechanical Ventilation */}
          {activeMode === "ards" && (
            <div className={styles.ccmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> ARDS Berlin Severity &amp; ARDSNet Lung-Protective Strategy
                </span>
                <span className="text-[11px] text-slate-400">Low-VT (4-6 mL/kg PBW) &bull; Pplat &le; 30 &bull; &Delta;P &le; 14 &bull; Prone (PROSEVA)</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setSelectedArds("mild")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedArds === "mild"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🟢 Mild (PaO2/FiO2 201-300)
                </button>
                <button
                  onClick={() => setSelectedArds("moderate")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedArds === "moderate"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🟡 Moderate (PaO2/FiO2 101-200)
                </button>
                <button
                  onClick={() => setSelectedArds("severe")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedArds === "severe"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔴 Severe (PaO2/FiO2 &le; 100)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-sky-300">{ardsDetails.title}</div>
                <div className="text-cyan-400 font-bold mt-1">{ardsDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-sky-400">Ventilator Protocol:</strong> {ardsDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Mechanical Pearl:</strong> {ardsDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Fluid Responsiveness & Vasopressors */}
          {activeMode === "fluid" && (
            <div className={styles.ccmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Dynamic Fluid Responsiveness &amp; Vasoactive Titration
                </span>
                <span className="text-[11px] text-slate-400">PLR &bull; SVV &bull; Norepinephrine &bull; Dobutamine</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedFluid("plr")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedFluid === "plr"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🦵 Passive Leg Raise (PLR)
                </button>
                <button
                  onClick={() => setSelectedFluid("svv")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedFluid === "svv"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  📈 Stroke Volume Var (SVV)
                </button>
                <button
                  onClick={() => setSelectedFluid("norepi")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedFluid === "norepi"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💊 Norepinephrine (1st Line)
                </button>
                <button
                  onClick={() => setSelectedFluid("dobutamine")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedFluid === "dobutamine"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Dobutamine (Inotrope)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-sky-300">{fluidDetails.title}</div>
                <div className="text-cyan-400 font-bold mt-1">{fluidDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-sky-400">Clinical Action:</strong> {fluidDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Rule:</strong> {fluidDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Delirium & ABCDEF Bundle */}
          {activeMode === "delirium" && (
            <div className={styles.ccmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> ICU Sedation, CAM-ICU Delirium &amp; The ABCDEF Bundle
                </span>
                <span className="text-[11px] text-slate-400">RASS 0 to -1 &bull; Dexmedetomidine &bull; SAT/SBT &bull; Early Mobility</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">RASS Target &amp; Non-Benzodiazepine Sedation</div>
                  <div className="text-slate-300 mt-1">PADIS guidelines recommend targeting LIGHT sedation (RASS 0 to -1, drowsy with sustained eye contact). Non-benzodiazepine sedatives like Dexmedetomidine (alpha-2 agonist) and Propofol are preferred over benzodiazepines, which are major drivers of ICU delirium.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">CAM-ICU Delirium &amp; The ABCDEF Liberation Bundle</div>
                  <div className="text-slate-300 mt-1">CAM-ICU evaluates acute fluctuation, inattention (SaveAHAART), altered RASS, and disorganized thinking. Implement the ABCDEF bundle (Assess pain, Both SAT/SBT weaning trials, Choice of sedation, Delirium management, Early mobility while intubated, Family engagement).</div>
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
                    <span className="text-sky-400 font-bold">Pathophysiology:</span> {node.pathophysiologyProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Critical Care Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Critical Care Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 ICU Entity / Ventilator Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📐 Physiology &amp; Mechanical Equations</div>
            <div className="text-xs text-sky-300 font-semibold">{activeNode.pathophysiologyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Critical Care Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("hemodynamics")}
          className={`${styles.modeTab} ${activeMode === "hemodynamics" ? styles.modeTabActive : ""}`}
        >
          📈 1. Hemodynamics &amp; DO2
        </button>
        <button
          onClick={() => setActiveMode("ards")}
          className={`${styles.modeTab} ${activeMode === "ards" ? styles.modeTabActive : ""}`}
        >
          🫁 2. ARDS &amp; Ventilation
        </button>
        <button
          onClick={() => setActiveMode("fluid")}
          className={`${styles.modeTab} ${activeMode === "fluid" ? styles.modeTabActive : ""}`}
        >
          💧 3. Fluid &amp; Vasopressors
        </button>
        <button
          onClick={() => setActiveMode("delirium")}
          className={`${styles.modeTab} ${activeMode === "delirium" ? styles.modeTabActive : ""}`}
        >
          🧠 4. Sedation &amp; Delirium
        </button>
      </div>
    </div>
  );
}
