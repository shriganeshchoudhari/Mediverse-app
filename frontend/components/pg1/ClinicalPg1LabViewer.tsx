"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalPg1LabViewer.module.css";
import {
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Flame,
  Calculator,
  TrendingUp,
  Gauge,
  Thermometer,
  Shield,
  Crosshair,
  Pill,
  Brain,
  Award,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
  UserCheck,
  Users,
  Activity,
  ClipboardList,
  Wind,
  Zap,
  GraduationCap,
  FileCheck,
} from "lucide-react";

export type Pg1LabMode = "hemo" | "vent" | "sepsis" | "residency";

export interface Pg1LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const PG1_LAB_NODES: Record<Pg1LabMode, Pg1LabNode[]> = {
  hemo: [
    {
      id: "pg1-hm-swan-ganz-thermodilution-shock",
      name: "Swan-Ganz Pulmonary Artery Catheterization (Thermodilution Profiling, Diastolic Equalization & Mixed Venous SvO2)",
      category: "PAC Hemodynamics",
      subType: "Hypovolemic vs Cardiogenic vs Septic Shock Profiles &bull; PCWP &bull; SVR &bull; Diastolic Equalization in Tamponade",
      proceduralProfile: "Invasive central hemodynamic profiling quantifying cardiac index, ventricular filling pressures, and vascular resistance.",
      proceduralMechanism: "Thermodilution computes Cardiac Output; microvascular O2 extraction determines mixed venous oxygenation (SvO2 65-75%).",
      clinicalHallmarks: "Cardiogenic: High PCWP >18, low CI <2.2, high SVR, low SvO2 <60%; Tamponade: Diastolic equalization (CVP = PAD = PCWP).",
      highYieldPearls: "Cardiogenic shock has high PCWP >18 and low SvO2 <60%; cardiac tamponade causes diastolic equalization (CVP=PAD=PCWP)."
    },
    {
      id: "pg1-hm-oxygen-delivery-consumption-dynamics",
      name: "Oxygen Delivery DO2 & Consumption VO2 Dynamics (Arterial O2 Content CaO2, Extraction Ratio & ScvO2 Target >=70%)",
      category: "DO2/VO2 Dynamics",
      subType: "CaO2 = 1.34 x [Hb] x SaO2 + 0.003 x PaO2 &bull; DO2 = CO x CaO2 x 10 (950-1,100 mL/m) &bull; O2ER 22-30%",
      proceduralProfile: "Macro- and microcirculatory oxygenation kinetics guiding inotropic, transfusion, and ventilator titrations.",
      proceduralMechanism: "Balances convective systemic oxygen delivery (DO2) with cellular metabolic oxygen consumption demand (VO2).",
      clinicalHallmarks: "Calculate CaO2 and DO2; maintain ScvO2 >=70% and lactate clearance as markers of cellular aerobic restoration.",
      highYieldPearls: "Target ScvO2 >=70% (SvO2 >=65%) and DO2 >=1,000 mL/min to prevent cellular anaerobic lactic acidosis."
    },
    {
      id: "pg1-hm-vv-ecmo-refractory-ards",
      name: "Veno-Venous (VV) ECMO for Refractory ARDS (Femoral-Jugular Cannulation, Gas Exchange & Native Cardiac Output)",
      category: "VV-ECMO Protocol",
      subType: "Severe ARDS PaO2/FiO2 <80 for >6h &bull; Drainage: Femoral Vein (IVC) &bull; Reinfusion: Internal Jugular (RA)",
      proceduralProfile: "Extracorporeal gas exchange life support providing total oxygenation and CO2 clearance in isolated lung failure.",
      proceduralMechanism: "Drains venous blood, oxygenates through polymethylpentene membrane lung, and reinfuses into RA; relies on native cardiac output.",
      clinicalHallmarks: "Indicated for refractory hypoxemic ARDS (P/F <80 despite prone positioning); sweep gas controls PaCO2, pump flow controls PaO2.",
      highYieldPearls: "VV-ECMO provides isolated respiratory gas exchange (P/F <80) and relies 100% on native cardiac pump function."
    },
    {
      id: "pg1-hm-va-ecmo-circulatory-rescue",
      name: "Veno-Arterial (VA) ECMO & Circulatory Rescue (Femoral-Femoral E-CPR, Harlequin Syndrome & Distal Limb Perfusion)",
      category: "VA-ECMO Rescue",
      subType: "Refractory Cardiogenic Shock &bull; Full Hemodynamic Circulatory Support &bull; Distal Perfusion Cannula &bull; Harlequin",
      proceduralProfile: "Mechanical circulatory and respiratory support delivering fully oxygenated blood into the arterial system.",
      proceduralMechanism: "Drains venous blood from RA, oxygenates, and returns under arterial pressure into femoral artery (retrograde flow up aorta).",
      clinicalHallmarks: "Place mandatory 6-8 Fr distal perfusion cannula to prevent leg ischemia; monitor for Harlequin (North-South) syndrome and LV distension.",
      highYieldPearls: "Peripheral VA-ECMO mandates a 6-8 Fr distal leg perfusion cannula and vigilant monitoring for Harlequin syndrome."
    }
  ],

  vent: [
    {
      id: "pg1-vt-ardsnet-lung-protective-strategy",
      name: "ARDSNet Lung-Protective Mechanical Ventilation (4-6 mL/kg PBW, Plateau Pressure <=30 & Driving Pressure <=14)",
      category: "ARDSNet Protocol",
      subType: "Target Vt 4-6 mL/kg PBW &bull; Pplat &le;30 cmH2O &bull; Driving Pressure &Delta;P &le;14 cmH2O &bull; Permissive Hypercapnia pH &ge;7.20",
      proceduralProfile: "Evidence-based lung-protective mechanical ventilation mitigating ventilator-induced lung injury (VILI).",
      proceduralMechanism: "Low tidal volume and limited driving pressure prevent alveolar overdistension (volutrauma) and cyclic shear stress (atelectrauma).",
      clinicalHallmarks: "Calculate Vt based on Predicted Body Weight; maintain Pplat <=30 cmH2O and Driving Pressure (Pplat - PEEP) <=14 cmH2O.",
      highYieldPearls: "ARDSNet targets Vt 4-6 mL/kg PBW, Pplat <=30 cmH2O, and Driving Pressure <=14 cmH2O (strongest survival predictor)."
    },
    {
      id: "pg1-vt-prone-positioning-paralysis-proseva",
      name: "Prone Positioning & Neuromuscular Blockade (PROSEVA >=16h/day Protocol & 48h Cisatracurium Infusion)",
      category: "Prone / Paralysis",
      subType: "Prone Positioning &ge;16 Hours/Day for P/F <150 &bull; Cisatracurium Paralysis (48h) &bull; Dorsal Alveolar Recruitment",
      proceduralProfile: "High-level evidence-based physiological adjuncts for moderate-to-severe ARDS improving survival.",
      proceduralMechanism: "Prone positioning homogenizes transpulmonary pressure and recruits dorsal alveoli; paralysis eliminates dyssynchronous biotrauma.",
      clinicalHallmarks: "Initiate early prone positioning for >=16 consecutive hours/day in severe ARDS (P/F <150); add 48h Cisatracurium if dyssynchronous.",
      highYieldPearls: "Prone positioning for >=16h/day significantly reduces mortality in severe ARDS (P/F <150) by recruiting dorsal lung units."
    },
    {
      id: "pg1-vt-double-triggering-breath-stacking",
      name: "Double-Triggering & Breath Stacking Asynchrony (Inspiratory Time Mismatch, Tidal Spikes & Sedation Optimization)",
      category: "Double Triggering",
      subType: "Two Consecutive Delivered Breaths with Single Patient Effort &bull; Tidal Volume 2x Set &bull; Barotrauma Hazard",
      proceduralProfile: "Severe patient-ventilator dyssynchrony resulting in massive delivered volume spikes and alveolar rupture.",
      proceduralMechanism: "Patient's neural inspiratory time exceeds ventilator set inspiratory time, triggering a second breath before exhalation.",
      clinicalHallmarks: "Waveform shows double inspiratory cycle without expiratory baseline return; manage by increasing inspiratory time or deepening sedation.",
      highYieldPearls: "Double-triggering causes dangerous breath-stacking barotrauma; manage by matching inspiratory times or neuromuscular blockade."
    },
    {
      id: "pg1-vt-auto-peep-dynamic-hyperinflation",
      name: "Auto-PEEP & Dynamic Hyperinflation Waveforms (Incomplete Expiration, Flow Concavity & I:E Ratio Prolongation)",
      category: "Auto-PEEP Dynamics",
      subType: "Expiratory Flow Fails to Reach Zero &bull; Intrinsic PEEP &bull; Prolong I:E Ratio (1:3 or 1:4) &bull; Decrease Respiratory Rate",
      proceduralProfile: "Severe dynamic air trapping in obstructive airway disease (COPD / Status Asthmaticus) causing hemodynamic collapse.",
      proceduralMechanism: "Incomplete lung emptying traps positive end-expiratory pressure, increasing intrathoracic pressure and impeding venous return.",
      clinicalHallmarks: "Expiratory flow does not return to zero before next breath; decrease respiratory rate, increase flow rate, set I:E to 1:3-1:4.",
      highYieldPearls: "Auto-PEEP is identified when expiratory flow fails to reach zero; treat by lowering RR and extending expiratory time (I:E 1:4)."
    }
  ],

  sepsis: [
    {
      id: "pg1-sp-sepsis-phenotyping-alpha-delta",
      name: "Sepsis-3 Clinical Phenotyping Matrix (Alpha, Beta, Gamma & Delta Phenotype Profiling and Mortality)",
      category: "Seymour Phenotypes",
      subType: "Alpha (33% Mild, 2% Mort) &bull; Beta (27% Chronic/Renal) &bull; Gamma (27% Hyperinflammatory) &bull; Delta (13% Shock/Liver, 32% Mort)",
      proceduralProfile: "Machine learning derived subtyping of septic shock guiding tailored immunomodulatory and fluid strategies.",
      proceduralMechanism: "Identifies dominant host response pathways: hyperinflammatory cytokine storms versus multi-organ refractory vasodilation.",
      clinicalHallmarks: "Alpha: minimal support; Gamma: high fever/CRP/lung failure; Delta: profound shock, liver injury, and highest mortality (32%).",
      highYieldPearls: "Sepsis Delta phenotype features severe shock, liver dysfunction, hyperlactatemia, and highest mortality (32%)."
    },
    {
      id: "pg1-sp-passive-leg-raise-dynamic-sv",
      name: "Passive Leg Raise (PLR) Dynamic Stroke Volume (Real-Time Echocardiographic Delta SV >=10% Preload Recruitability)",
      category: "PLR Maneuver",
      subType: "Autologous 300-500 mL Blood Bolus &bull; Positive if &Delta;Stroke Volume &ge;10% &bull; Valid in Spontaneous Breathing",
      proceduralProfile: "Reversible dynamic test of Frank-Starling preload responsiveness without administering exogenous volume.",
      proceduralMechanism: "Shifts 300-500 mL of blood from lower extremities into right heart; transiently increases stroke volume if preload reserve exists.",
      clinicalHallmarks: "Measure baseline SV; tilt to 45° leg elevation; positive if SV rises >=10%; proving preload responsiveness without volume overload.",
      highYieldPearls: "Passive Leg Raise (PLR) is positive if real-time Stroke Volume increases >=10%, proving fluid responsiveness."
    },
    {
      id: "pg1-sp-pulse-pressure-variation-ppv",
      name: "Pulse Pressure Variation (PPV) & Heart-Lung Dynamics (Arterial Line PPV >13% & SVV >12% in Controlled Ventilation)",
      category: "Heart-Lung PPV",
      subType: "PPV >13% or SVV >12% &bull; Mandatory Criteria: Controlled MV, Vt &ge;8 mL/kg, Sinus Rhythm, No Spontaneous Breaths",
      proceduralProfile: "Continuous arterial waveform analysis quantifying cardiopulmonary interactions during positive-pressure ventilation.",
      proceduralMechanism: "Inspiratory positive pressure decreases RV filling and transiently increases LV preload, causing cyclical pulse pressure swings.",
      clinicalHallmarks: "PPV >13% indicates fluid responsiveness ONLY in fully sedated patients on volume control with Vt >=8 mL/kg and sinus rhythm.",
      highYieldPearls: "PPV >13% predicts fluid responsiveness ONLY under mandatory conditions: controlled mechanical ventilation and sinus rhythm."
    },
    {
      id: "pg1-sp-rose-4-phase-resuscitation-deescalation",
      name: "The ROSE 4-Phase Resuscitation Model (Resuscitation, Optimization, Stabilization & Active Fluid Evacuation)",
      category: "ROSE Framework",
      subType: "Resuscitation (0-3h) &bull; Optimization (3-24h) &bull; Stabilization (1-3d) &bull; Evacuation (Day 3+ Active Negative Fluid Balance)",
      proceduralProfile: "Four-phase hemodynamic strategy preventing fluid overload morbidity (acute kidney injury, abdominal compartment syndrome).",
      proceduralMechanism: "Transitions from early aggressive resuscitation to active loop diuretic/ultrafiltration fluid evacuation once shock resolves.",
      clinicalHallmarks: "Limit fluid boluses in Optimization; achieve active negative daily fluid balance in Evacuation phase to restore microcirculation.",
      highYieldPearls: "ROSE model: Resuscitation -> Optimization -> Stabilization -> Evacuation (active negative fluid balance to treat fluid overload)."
    }
  ],

  residency: [
    {
      id: "pg1-rc-acgme-6-core-competencies-milestones",
      name: "ACGME 6 Core Competencies & Residency Milestones (Patient Care, Medical Knowledge, PBLI, SBP & Professionalism)",
      category: "ACGME Core 6",
      subType: "1. Patient Care &bull; 2. Medical Knowledge &bull; 3. PBLI &bull; 4. Communication &bull; 5. Professionalism &bull; 6. Systems-Based Practice",
      proceduralProfile: "Standardized framework defining postgraduate clinical autonomy, scholarship, and systems leadership.",
      proceduralMechanism: "Evaluates multi-domain developmental milestones progressing from direct supervision to expert autonomous leadership.",
      clinicalHallmarks: "Demonstrate progressive autonomy across complex clinical encounters, departmental audits, and interprofessional leadership.",
      highYieldPearls: "ACGME 6 Core Competencies evaluate Patient Care, Medical Knowledge, PBLI, Communication, Professionalism, and SBP."
    },
    {
      id: "pg1-rc-mm-cognitive-heuristics-biases",
      name: "Morbidity & Mortality (M&M) Cognitive Heuristics (Anchoring Bias, Premature Closure & Diagnostic Time-Out)",
      category: "M&M Cognitive",
      subType: "Anchoring Bias &bull; Premature Closure &bull; Availability Heuristic &bull; Diagnostic Time-Out Protocol",
      proceduralProfile: "Peer-reviewed cognitive deconstruction of diagnostic errors and adverse patient outcomes.",
      proceduralMechanism: "Identifies systemic cognitive vulnerabilities and automatic fast-thinking biases leading to delayed critical diagnoses.",
      clinicalHallmarks: "Analyze diagnostic anchoring in M&M conferences; institute mandatory diagnostic time-outs when patient trajectory deviates.",
      highYieldPearls: "M&M conferences analyze cognitive biases (anchoring, premature closure) to institute diagnostic time-out safeguards."
    },
    {
      id: "pg1-rc-reason-swiss-cheese-systems-safety",
      name: "James Reason's Swiss Cheese Systems Safety Model (Latent Organizational Holes vs Active Sharp-End Human Blame)",
      category: "Swiss Cheese Model",
      subType: "Latent Organizational Conditions &bull; Sharp-End Active Slips &bull; Blameless Culture &bull; Systemic Defense Barriers",
      proceduralProfile: "Epidemiological model of adverse medical events examining institutional defense barrier failures.",
      proceduralMechanism: "Catastrophes occur when multiple latent holes in defense layers (staffing, protocols, equipment, supervision) align simultaneously.",
      clinicalHallmarks: "Examine latent organizational gaps during sentinel event audits rather than focusing solely on frontline clinician slips.",
      highYieldPearls: "Reason's Swiss Cheese model proves adverse events occur when multiple latent systemic holes align across defenses."
    },
    {
      id: "pg1-rc-crisis-resource-management-closed-loop",
      name: "Resuscitation Crisis Resource Management (Closed-Loop Call-Outs, Check-Backs & Sterile Cockpit Leadership)",
      category: "Resuscitation CRM",
      subType: "Closed-Loop Call-Outs &bull; Verbal Check-Back &bull; Sterile Cockpit Environment &bull; Hands-Off Team Leader",
      proceduralProfile: "High-performance team leadership and communication protocol during complex acute resuscitation events.",
      proceduralMechanism: "Eliminates verbal ambiguity and maintains macro-situational awareness, preventing procedural distraction errors.",
      clinicalHallmarks: "Leader maintains hands-off stance at foot of bed; utilize named closed-loop orders: 'Dr. X, give 1 mg Epinephrine' -> '1 mg Epinephrine given'.",
      highYieldPearls: "Resuscitation CRM requires a hands-off team leader, a sterile cockpit environment, and strict closed-loop communication."
    }
  ]
};

interface ClinicalPg1LabViewerProps {
  initialMode?: Pg1LabMode;
  height?: string;
  onNodeSelect?: (node: Pg1LabNode) => void;
}

export default function ClinicalPg1LabViewer({
  initialMode = "hemo",
  height = "560px",
  onNodeSelect,
}: ClinicalPg1LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Pg1LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return PG1_LAB_NODES[activeMode] || PG1_LAB_NODES.hemo;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Pg1LabNode) => {
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
            <Sparkles size={14} /> PG-601
          </span>
          <span className={styles.titleText}>
            {activeMode === "hemo" && "Critical Care Hemodynamics: Swan-Ganz Thermodilution, DO2/VO2 Dynamics & VA/VV ECMO"}
            {activeMode === "vent" && "Advanced Mechanical Ventilation: ARDSNet Driving Pressure, Prone Positioning & Asynchronies"}
            {activeMode === "sepsis" && "Sepsis-3 Precision Resuscitation: Clinical Phenotypes, Dynamic PLR & ROSE De-escalation"}
            {activeMode === "residency" && "Residency Core Competencies: ACGME Milestones, M&M Cognitive Audits & Resuscitation CRM"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Residency Readiness Quiz"}
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
                  Residency Fellow Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Postgraduate Competency: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-indigo-300 font-medium mt-1">{quizFeedback}</div>
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

          {/* Mode 1: Hemodynamics */}
          {activeMode === "hemo" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Advanced Critical Care Hemodynamics &amp; ECMO
                </span>
                <span className="text-[11px] text-slate-400">Swan-Ganz PAC &bull; DO2 = CO x CaO2 x 10 &bull; VV ECMO (P/F &lt;80) &bull; VA ECMO Distal Leg Cannula</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Swan-Ganz Thermodilution Profiles</div>
                  <div className="text-slate-300 mt-1">Cardiogenic: High PCWP &gt;18, low CI &lt;2.2, high SVR, low SvO2 &lt;60%. Distributive: Low SVR &lt;800, high CI &gt;4.0, high SvO2 &gt;75%. Tamponade: Diastolic equalization (CVP = PAD = PCWP).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">VV vs VA ECMO Mechanical Support</div>
                  <div className="text-slate-300 mt-1">VV ECMO provides isolated respiratory gas exchange for severe ARDS (P/F &lt;80). VA ECMO provides full circulatory support for cardiogenic shock; mandates 6-8 Fr distal limb perfusion cannula.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Ventilation */}
          {activeMode === "vent" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind size={14} /> Advanced Mechanical Ventilation &amp; ARDS
                </span>
                <span className="text-[11px] text-slate-400">ARDSNet 4-6 mL/kg PBW &bull; Pplat &le;30 &bull; Driving Pressure &Delta;P &le;14 &bull; Prone &ge;16h/d &bull; Asynchronies</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">ARDSNet &amp; Driving Pressure Target</div>
                  <div className="text-slate-300 mt-1">Tidal volume 4-6 mL/kg Predicted Body Weight. Target Plateau Pressure Pplat &le;30 cmH2O and Driving Pressure &Delta;P (Pplat - PEEP) &le;14 cmH2O. Prone position &ge;16h/day for P/F &lt;150 (PROSEVA).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Ventilator Asynchrony Recognition</div>
                  <div className="text-slate-300 mt-1">Double-triggering causes dangerous breath-stacking barotrauma; manage by increasing inspiratory time or sedation. Auto-PEEP: Expiratory flow fails to reach zero; prolong I:E ratio (1:3-1:4).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Sepsis */}
          {activeMode === "sepsis" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Sepsis Precision Phenotyping &amp; Fluid De-escalation
                </span>
                <span className="text-[11px] text-slate-400">Alpha-Delta Phenotypes &bull; Passive Leg Raise &Delta;SV &ge;10% &bull; PPV &gt;13% &bull; ROSE Evacuation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Sepsis-3 Clinical Phenotyping</div>
                  <div className="text-slate-300 mt-1">Alpha (33% mild), Beta (27% renal/chronic), Gamma (27% hyperinflammatory), Delta (13% hepatic shock, highest mortality 32%). Tailor vasopressors and fluid strategies by phenotype.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Dynamic Fluid &amp; ROSE De-escalation</div>
                  <div className="text-slate-300 mt-1">Passive Leg Raise (PLR) confirms preload recruitability if stroke volume rises &ge;10%. Transition to ROSE Evacuation phase (Day 3+ loop diuretics/CRRT) to achieve negative fluid balance.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Residency */}
          {activeMode === "residency" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap size={14} /> ACGME Milestones &amp; Crisis Management
                </span>
                <span className="text-[11px] text-slate-400">6 Core Competencies &bull; M&amp;M Cognitive Biases &bull; Swiss Cheese Latent Holes &bull; Closed-Loop CRM</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">M&amp;M Cognitive Heuristics &amp; Systems Safety</div>
                  <div className="text-slate-300 mt-1">Deconstruct anchoring bias and premature closure via diagnostic time-outs. Apply Reason's Swiss Cheese model to target latent organizational hazards rather than frontline human blame.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Resuscitation Crisis Resource Management</div>
                  <div className="text-slate-300 mt-1">Designated team leader maintains hands-off stance at foot of bed, enforces a sterile cockpit environment, and executes strict closed-loop call-out and check-back communication.</div>
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
                    <span className="text-indigo-400 font-bold">Protocol:</span> {node.proceduralProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Residency Protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Consult Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Residency Fellow Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Pathophysiological Mechanism</div>
            <div className="text-xs text-indigo-300 font-semibold">{activeNode.proceduralProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Actions</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Residency Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("hemo")}
          className={`${styles.modeTab} ${activeMode === "hemo" ? styles.modeTabActive : ""}`}
        >
          🫀 1. Hemodynamics &amp; ECMO
        </button>
        <button
          onClick={() => setActiveMode("vent")}
          className={`${styles.modeTab} ${activeMode === "vent" ? styles.modeTabActive : ""}`}
        >
          🫁 2. Ventilation &amp; ARDS
        </button>
        <button
          onClick={() => setActiveMode("sepsis")}
          className={`${styles.modeTab} ${activeMode === "sepsis" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. Sepsis &amp; Fluid ROSE
        </button>
        <button
          onClick={() => setActiveMode("residency")}
          className={`${styles.modeTab} ${activeMode === "residency" ? styles.modeTabActive : ""}`}
        >
          🎓 4. Residency &amp; CRM
        </button>
      </div>
    </div>
  );
}
