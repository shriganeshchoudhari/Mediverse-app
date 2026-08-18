"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalInt1LabViewer.module.css";
import {
  Zap,
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
  Award,
  Flame,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
  UserCheck,
  Users,
  Activity,
  ClipboardList,
  Stethoscope,
  Wind,
} from "lucide-react";

export type Int1LabMode = "acls" | "sepsis" | "trauma" | "rsi";

export interface Int1LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  resuscitationProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const INT1_LAB_NODES: Record<Int1LabMode, Int1LabNode[]> = {
  acls: [
    {
      id: "int1-ac-shockable-vf-pvt-pathway",
      name: "Shockable VF / Pulseless VT Pathway (Unsynchronized Biphasic Defibrillation & Amiodarone Protocol)",
      category: "Shockable Arrest",
      subType: "VF / Pulseless VT • 120-200J Biphasic Shock • Epinephrine (Post-2nd Shock) • Amiodarone 300/150 mg",
      resuscitationProfile: "Rapid unsynchronized defibrillation protocol restoring organized cardiac electrical activity.",
      proceduralMechanism: "Depolarizes chaotic myocardial syncytium simultaneously, allowing the SA node pacemaker to reset rhythm.",
      clinicalHallmarks: "Deliver shock &rarr; instant 2 min CPR &rarr; shock &rarr; Epinephrine 1 mg &rarr; shock &rarr; Amiodarone 300 mg bolus.",
      highYieldPearls: "Shockable VF/pVT: Defibrillate stat, resume CPR immediately, give Epinephrine after shock 2, and Amiodarone after shock 3."
    },
    {
      id: "int1-ac-nonshockable-pea-asystole",
      name: "Non-Shockable PEA & Asystole Algorithm (Immediate Epinephrine & Continuous Compression Cycles)",
      category: "Non-Shockable Arrest",
      subType: "PEA / Asystole • NO Defibrillation • Epinephrine 1 mg IV Stat • Rapid Identification of 5 Hs & 5 Ts",
      resuscitationProfile: "Pharmacological and compression-focused resuscitation for organized/flatline arrest rhythms.",
      proceduralMechanism: "Alpha-1 vasoconstriction from epinephrine increases aortic diastolic pressure and coronary perfusion pressure.",
      clinicalHallmarks: "Epinephrine 1 mg IV given immediately upon establishing IV/IO access; search aggressively for reversible 5 Hs and 5 Ts.",
      highYieldPearls: "Non-shockable PEA/Asystole: Give Epinephrine 1 mg IV stat (do not delay) and immediately search for 5 Hs and 5 Ts."
    },
    {
      id: "int1-ac-reversible-5hs-5ts",
      name: "The Reversible 5 Hs & 5 Ts (Hypovolemia, Acidosis, Hyperkalemia, Tension Pneumo & Tamponade)",
      category: "Reversible Causes",
      subType: "5 Hs (Hypovolemia, Hypoxia, Hydrogen, K+, Hypothermia) • 5 Ts (Tension Pneumo, Tamponade, Toxins, PE, ACS)",
      resuscitationProfile: "Systematic diagnostic checklist identifying reversible physiological drivers of cardiac arrest.",
      proceduralMechanism: "Treating the underlying metabolic, mechanical, or toxic insult permits sustained ROSC.",
      clinicalHallmarks: "Tension pneumothorax &rarr; needle decompression; Tamponade &rarr; pericardiocentesis; Hyperkalemia &rarr; Calcium gluconate.",
      highYieldPearls: "5 Hs: Hypovolemia, Hypoxia, Hydrogen (acidosis), Hypo/Hyperkalemia, Hypothermia. 5 Ts: Tension pneumo, Tamponade, Toxins, PE, ACS."
    },
    {
      id: "int1-ac-post-rosc-ttm-care",
      name: "Post-ROSC Targeted Temperature Management (32-36&deg;C Neuroprotection & Coronary Catheterization Lab)",
      category: "Post-Arrest Care",
      subType: "ROSC Optimization • MAP &ge; 65 mmHg • TTM (32-36&deg;C for 24h) • Immediate Coronary Angiography for STEMI",
      resuscitationProfile: "Post-resuscitation bundle mitigating reperfusion cerebral injury and optimizing systemic perfusion.",
      proceduralMechanism: "Controlled hypothermia/normothermia suppresses cerebral metabolic rate of oxygen and free radical cascades.",
      clinicalHallmarks: "Maintain core temp 32-36&deg;C for at least 24 hours in comatose patients; target MAP &ge;65 mmHg with vasopressors.",
      highYieldPearls: "Post-ROSC comatose patients require Targeted Temperature Management (32-36&deg;C for 24h) and stat Cath Lab if STEMI."
    }
  ],

  sepsis: [
    {
      id: "int1-sp-sepsis3-sofa-criteria",
      name: "Sepsis-3 Diagnostic Criteria & SOFA Score (Organ Dysfunction & Acute SOFA Elevation &ge;2 Points)",
      category: "Sepsis-3 Definition",
      subType: "Dysregulated Host Response • Acute &Delta;SOFA &ge; 2 Points • Bedside qSOFA (RR &ge; 22, Altered Mental, SBP &le; 100)",
      resuscitationProfile: "Consensus international criteria defining life-threatening infection-induced multiorgan dysfunction.",
      proceduralMechanism: "Systemic endothelial injury, microvascular thrombosis, and mitochondrial dysfunction drive organ failure.",
      clinicalHallmarks: "Acute rise in SOFA score &ge;2 above baseline indicates sepsis; septic shock includes vasopressors + lactate >2 mmol/L.",
      highYieldPearls: "Sepsis is defined as life-threatening organ dysfunction with acute &Delta;SOFA &ge;2 points caused by a dysregulated host response."
    },
    {
      id: "int1-sp-hour1-resuscitation-bundle",
      name: "Surviving Sepsis Campaign Hour-1 Bundle (Lactate, Pre-Antibiotic Blood Cultures & Empiric Therapy)",
      category: "Hour-1 Bundle",
      subType: "Serum Lactate • Blood Cultures x 2 Sets • Broad-Spectrum IV Antibiotics Within 1 Hour of Recognition",
      resuscitationProfile: "Time-critical emergency bundle to halt bacterial proliferation and cellular metabolic crisis.",
      proceduralMechanism: "Early antimicrobial administration halts endotoxemia and bacteremia, preventing progression to irreversible shock.",
      clinicalHallmarks: "Draw blood cultures before starting antibiotics (do not delay abx >45 min); administer broad-spectrum abx within 1 hour.",
      highYieldPearls: "Hour-1 Bundle: Measure lactate, draw blood cultures x2, start broad-spectrum IV antibiotics within 1 hour, start 30 mL/kg fluids."
    },
    {
      id: "int1-sp-30ml-kg-fluid-resuscitation",
      name: "30 mL/kg Balanced Crystalloid Resuscitation (Lactated Ringer's Volume Expansion & Lactate Clearance)",
      category: "Fluid Resuscitation",
      subType: "30 mL/kg IV Within 3 Hours • Balanced Crystalloids (LR / Plasmalyte) • Lactate Clearance Monitoring",
      resuscitationProfile: "Standard volume resuscitation restoring venous return and cardiac preload in septic hypovolemia.",
      proceduralMechanism: "Replenishes capillary leak third-space losses and improves microcirculatory perfusion.",
      clinicalHallmarks: "Give 30 mL/kg balanced crystalloids for hypotension (SBP <90 mmHg) or initial lactate &ge;4.0 mmol/L.",
      highYieldPearls: "Administer 30 mL/kg IV balanced crystalloid (Lactated Ringer's) within 3 hours for sepsis-induced hypotension or lactate &ge;4."
    },
    {
      id: "int1-sp-vasopressor-norepinephrine-hierarchy",
      name: "Refractory Shock Vasopressor Hierarchy (Norepinephrine Alpha-1, Vasopressin V1 & Stress Hydrocortisone)",
      category: "Vasopressor Titration",
      subType: "Norepinephrine 1st-Line (MAP &ge; 65) • Vasopressin 0.03 U/min 2nd-Line • IV Hydrocortisone 200 mg/d Refractory",
      resuscitationProfile: "Hemodynamic escalation algorithm maintaining critical organ perfusion pressure in vasodilatory shock.",
      proceduralMechanism: "Alpha-1 vasoconstriction restores systemic vascular resistance; vasopressin restores tone in catecholamine resistance.",
      clinicalHallmarks: "Start Norepinephrine to achieve MAP &ge;65 mmHg; add fixed Vasopressin (0.03 U/min); add Hydrocortisone if refractory.",
      highYieldPearls: "Norepinephrine is the first-line vasopressor in septic shock; target MAP &ge;65 mmHg; add Vasopressin (0.03 U/min) second-line."
    }
  ],

  trauma: [
    {
      id: "int1-tr-atls-primary-survey-abcde",
      name: "ATLS ABCDE Primary Survey & Resuscitation (Inline C-Spine, Needle Decompression & Pelvic Stabilization)",
      category: "Primary Survey",
      subType: "A: Airway/C-Spine • B: Breathing (Tension Pneumo) • C: Circulation (1:1:1 MTP) • D: Disability • E: Exposure",
      resuscitationProfile: "Rigorous chronological protocol detecting and neutralizing immediately fatal trauma injuries.",
      proceduralMechanism: "Prevents secondary hypoxic brain damage, tension obstructive shock, and exsanguination.",
      clinicalHallmarks: "Decompress tension pneumothorax stat; apply pelvic binder; intubate if GCS &le;8; prevent lethal triad of death.",
      highYieldPearls: "ATLS Primary Survey: A (Airway + C-spine), B (Breathing - decompress tension pneumo), C (Circulation - MTP 1:1:1 + TXA), D, E."
    },
    {
      id: "int1-tr-mtp-damage-control-resuscitation",
      name: "Massive Transfusion Protocol & Damage Control (1:1:1 Balanced Component Therapy & Tranexamic Acid TXA)",
      category: "Damage Control",
      subType: "1:1:1 Balanced Ratio (PRBCs : FFP : Platelets) • Tranexamic Acid (TXA 1 g IV within 3h) • Prevent Lethal Triad",
      resuscitationProfile: "Hemostatic resuscitation reversing acute trauma-induced coagulopathy and acidosis.",
      proceduralMechanism: "Replaces clotting factors and platelets in physiological whole-blood proportions; TXA blocks plasminogen fibrinolysis.",
      clinicalHallmarks: "Activate MTP for massive bleeding; transfuse 1:1:1 PRBC:FFP:Platelets; give TXA 1 g IV within 3 hours of trauma.",
      highYieldPearls: "Massive Transfusion Protocol requires 1:1:1 PRBCs:FFP:Platelets PLUS Tranexamic Acid (TXA 1 g IV) within 3 hours of trauma."
    },
    {
      id: "int1-tr-fast-4view-ultrasound",
      name: "FAST 4-View Bedside Sonography (Morison's Hepatorenal Pouch, Splenic Recess & Pericardium)",
      category: "FAST Exam",
      subType: "1. Morison's Pouch (Hepatorenal) • 2. Splenorenal • 3. Suprapubic (Pelvic) • 4. Subxiphoid (Pericardial)",
      resuscitationProfile: "Rapid 60-second bedside ultrasound identifying occult hemoperitoneum and pericardial tamponade.",
      proceduralMechanism: "Gravity pools free blood in dependent peritoneal recesses; ultrasound visualizes anechoic (black) fluid collections.",
      clinicalHallmarks: "Morison's pouch is the most sensitive abdominal window; positive FAST in unstable trauma patient &rarr; emergent OR laparotomy.",
      highYieldPearls: "A positive FAST (free fluid in Morison's pouch) in an unstable trauma patient mandates immediate transfer to the OR."
    },
    {
      id: "int1-tr-efast-pleural-pneumothorax",
      name: "Extended E-FAST Pleural Manometry (Pneumothorax Barcode Sign & Loss of Dynamic Lung Sliding)",
      category: "E-FAST Thoracic",
      subType: "B-Lines / Lung Sliding (Normal 'Seashore Sign') • Absence of Sliding (Pneumothorax 'Barcode / Stratosphere Sign')",
      resuscitationProfile: "High-frequency thoracic ultrasound detecting occult pneumothorax and hemothorax.",
      proceduralMechanism: "Air trapped in the pleural space blocks the acoustic interface between visceral and parietal pleura.",
      clinicalHallmarks: "Loss of shimmering lung sliding and presence of stratosphere/barcode sign on M-mode confirms pneumothorax.",
      highYieldPearls: "E-FAST detects pneumothorax via loss of lung sliding and presence of the barcode/stratosphere sign on M-mode."
    }
  ],

  rsi: [
    {
      id: "int1-rs-7ps-chronological-timeline",
      name: "The 7 Ps Chronological RSI Timeline (SOAP ME Preparation to Post-Intubation Ventilator Adjustments)",
      category: "RSI Timeline",
      subType: "1. Prep (SOAP ME) • 2. Preox • 3. Pretreatment • 4. Paralysis/Induction • 5. Position • 6. Placement • 7. Post-Care",
      resuscitationProfile: "Systematic 7-step sequence achieving rapid definitive airway control with minimal aspiration risk.",
      proceduralMechanism: "Simultaneous induction and paralysis induces deep unconsciousness and flaccidity without positive pressure ventilation.",
      clinicalHallmarks: "Preoxygenate with 100% O2 for 3-5 min; simultaneous drug administration at T-0; verify with continuous waveform capnography.",
      highYieldPearls: "The 7 Ps of RSI: Preparation, Preoxygenation, Pretreatment, Paralysis with Induction, Positioning, Placement, Post-Management."
    },
    {
      id: "int1-rs-induction-etomidate-ketamine",
      name: "Hemodynamic Induction Pharmacology (Etomidate Neutrality, Ketamine Sympathomimetic & Propofol)",
      category: "Induction Agents",
      subType: "Etomidate 0.3 mg/kg (Hemodynamically Neutral) • Ketamine 1.5-2 mg/kg (Asthma/Shock) • Propofol (Vasodilation)",
      resuscitationProfile: "Strategic choice of intravenous sedative hypnotic matching patient hemodynamic stability.",
      proceduralMechanism: "Etomidate enhances GABA without depressing cardiac output; Ketamine inhibits NMDA and stimulates catecholamines.",
      clinicalHallmarks: "Etomidate (0.3 mg/kg) is preferred in trauma/shock; Ketamine (1.5-2.0 mg/kg) is ideal for severe asthma and shock.",
      highYieldPearls: "Etomidate (0.3 mg/kg) is hemodynamically neutral in shock; Ketamine is a bronchodilating sympathomimetic ideal in asthma/shock."
    },
    {
      id: "int1-rs-paralytics-succinylcholine-rocuronium",
      name: "Depolarizing vs Non-Depolarizing Paralytics (Succinylcholine Hyperkalemia Risk vs High-Dose Rocuronium)",
      category: "Neuromuscular Blockers",
      subType: "Succinylcholine 1.5 mg/kg (45s Onset, Contraindicated Burns >24h/Denervation) • Rocuronium 1.2 mg/kg",
      resuscitationProfile: "Neuromuscular blocking agents creating vocal cord flaccidity for rapid laryngoscopic intubation.",
      proceduralMechanism: "Succinylcholine depolarizes motor endplate; Rocuronium competitively blocks nicotinic ACh receptors.",
      clinicalHallmarks: "Succinylcholine causes fatal hyperkalemia in burns >24h, crush, or denervation; Rocuronium (1.2 mg/kg) has no hyperkalemia risk.",
      highYieldPearls: "Succinylcholine is CONTRAINDICATED in burns >24h, crush injuries, and denervation due to fatal hyperkalemic surge; use Rocuronium."
    },
    {
      id: "int1-rs-waveform-capnography-proof",
      name: "Continuous Quantitative Waveform Capnography (End-Tidal CO2 Tracing & Tube Verification Above Carina)",
      category: "Airway Confirmation",
      subType: "Continuous Waveform EtCO2 (Gold Standard) • Rectangular Box Waveform • CXR 3-5 cm Above Carina",
      resuscitationProfile: "The indisputable gold standard method verifying tracheal endotracheal tube placement.",
      proceduralMechanism: "Continuous detection of alveolar expired carbon dioxide confirms tube location in the respiratory tract.",
      clinicalHallmarks: "Sustained rectangular 4-phase waveform with EtCO2 >30 mmHg confirms tracheal placement; flatline indicates esophageal.",
      highYieldPearls: "Continuous quantitative waveform capnography (EtCO2) is the GOLD STANDARD for verifying endotracheal tube placement."
    }
  ]
};

interface ClinicalInt1LabViewerProps {
  initialMode?: Int1LabMode;
  height?: string;
  onNodeSelect?: (node: Int1LabNode) => void;
}

export default function ClinicalInt1LabViewer({
  initialMode = "acls",
  height = "560px",
  onNodeSelect,
}: ClinicalInt1LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Int1LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return INT1_LAB_NODES[activeMode] || INT1_LAB_NODES.acls;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Int1LabNode) => {
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
            <Zap size={14} /> INT-501
          </span>
          <span className={styles.titleText}>
            {activeMode === "acls" && "Advanced Cardiac Life Support (ACLS 2025): Shockable VF/pVT, Non-Shockable PEA & 5 Hs/5 Ts"}
            {activeMode === "sepsis" && "Sepsis-3 Resuscitation: Surviving Sepsis Hour-1 Bundle, 30 mL/kg Fluids & Norepinephrine"}
            {activeMode === "trauma" && "Trauma Resuscitation: ATLS ABCDE Primary Survey, Balanced MTP (1:1:1), TXA & FAST Ultrasound"}
            {activeMode === "rsi" && "Rapid Sequence Intubation (RSI): The 7 Ps Framework, Induction/Paralytic Drugs & EtCO2 Proof"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Resuscitation Quiz"}
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
                <div className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  Emergency Resuscitation Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Resuscitation Protocol: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-red-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-red-950 text-xs rounded border border-red-700 text-red-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: ACLS */}
          {activeMode === "acls" && (
            <div className={styles.criticalCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> ACLS 2025 Adult Cardiac Arrest &amp; Post-ROSC Care
                </span>
                <span className="text-[11px] text-slate-400">VF/pVT Defib &bull; PEA/Asystole Epinephrine &bull; 5 Hs &amp; 5 Ts &bull; TTM</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Shockable vs Non-Shockable Pathways</div>
                  <div className="text-slate-300 mt-1">VF/pVT: Defibrillate (120-200J) &rarr; CPR 2 min &rarr; Epinephrine 1 mg after shock 2 &rarr; Amiodarone 300 mg bolus after shock 3. PEA/Asystole: NO shock &rarr; give Epinephrine 1 mg IV stat and treat 5 Hs and 5 Ts.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Post-ROSC Care &amp; Targeted Temperature</div>
                  <div className="text-slate-300 mt-1">Maintain MAP &ge;65 mmHg with vasopressors. Targeted Temperature Management (TTM 32-36&deg;C for 24h) in comatose patients prevents secondary brain injury. Stat Cath Lab activation for STEMI.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Sepsis-3 */}
          {activeMode === "sepsis" && (
            <div className={styles.criticalCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Sepsis-3 Resuscitation &amp; Surviving Sepsis Hour-1 Bundle
                </span>
                <span className="text-[11px] text-slate-400">&Delta;SOFA &ge;2 &bull; 30 mL/kg Fluids &bull; Norepinephrine MAP &ge;65 &bull; Hydrocortisone</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Surviving Sepsis Hour-1 Bundle</div>
                  <div className="text-slate-300 mt-1">Measure lactate, draw blood cultures x2 prior to antibiotics, administer empiric broad-spectrum IV antibiotics within 1 hour, rapidly infuse 30 mL/kg balanced crystalloids for hypotension or lactate &ge;4.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Vasopressor Escalation in Shock</div>
                  <div className="text-slate-300 mt-1">Norepinephrine is first-line vasopressor (target MAP &ge;65 mmHg). Add fixed Vasopressin (0.03 U/min) second-line. Add Epinephrine/Dobutamine for inotropic depression. Add IV Hydrocortisone (200 mg/d) if refractory.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Trauma & FAST */}
          {activeMode === "trauma" && (
            <div className={styles.criticalCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> ATLS Primary Survey &amp; FAST Sonography
                </span>
                <span className="text-[11px] text-slate-400">ABCDE &bull; Tension Pneumo Needle &bull; MTP 1:1:1 &bull; TXA 1g &bull; Morison Pouch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">ATLS ABCDE &amp; Hemorrhage Control</div>
                  <div className="text-slate-300 mt-1">Inline C-spine, needle decompression for tension pneumothorax, pelvic binder, Massive Transfusion Protocol (1:1:1 PRBC:FFP:Platelets), and Tranexamic Acid (TXA 1 g IV within 3 hours of injury).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Bedside FAST &amp; E-FAST Ultrasound</div>
                  <div className="text-slate-300 mt-1">4 Views: Morison's pouch (hepatorenal), splenorenal, suprapubic, subxiphoid pericardium. Positive FAST in unstable trauma patient &rarr; emergent OR laparotomy. E-FAST detects pneumothorax via barcode sign.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: RSI */}
          {activeMode === "rsi" && (
            <div className={styles.criticalCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind size={14} /> Rapid Sequence Intubation &amp; Emergency Airway Management
                </span>
                <span className="text-[11px] text-slate-400">The 7 Ps &bull; Etomidate / Ketamine &bull; Succinylcholine vs Rocuronium &bull; EtCO2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">The 7 Ps &amp; Induction Agents</div>
                  <div className="text-slate-300 mt-1">SOAP ME preparation, 100% O2 preoxygenation, simultaneous induction + paralytic. Etomidate (0.3 mg/kg) is hemodynamically neutral; Ketamine (1.5-2.0 mg/kg) is a bronchodilator preserving tone in shock.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Paralytics &amp; Waveform Capnography</div>
                  <div className="text-slate-300 mt-1">Succinylcholine (1.5 mg/kg) contraindicated in burns &gt;24h, crush, or denervation due to fatal hyperkalemia; use Rocuronium (1.2 mg/kg). Continuous waveform EtCO2 is the GOLD STANDARD for confirmation.</div>
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
                    <span className="text-red-400 font-bold">Resuscitation:</span> {node.resuscitationProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Resuscitation Protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Emergency & Critical Care Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Emergency Care Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Resuscitation Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Physiological Mechanism</div>
            <div className="text-xs text-red-300 font-semibold">{activeNode.resuscitationProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Operations</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Resuscitation Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("acls")}
          className={`${styles.modeTab} ${activeMode === "acls" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. ACLS 2025 Pathways
        </button>
        <button
          onClick={() => setActiveMode("sepsis")}
          className={`${styles.modeTab} ${activeMode === "sepsis" ? styles.modeTabActive : ""}`}
        >
          🔥 2. Sepsis-3 Resuscitation
        </button>
        <button
          onClick={() => setActiveMode("trauma")}
          className={`${styles.modeTab} ${activeMode === "trauma" ? styles.modeTabActive : ""}`}
        >
          🩸 3. Trauma &amp; FAST Exam
        </button>
        <button
          onClick={() => setActiveMode("rsi")}
          className={`${styles.modeTab} ${activeMode === "rsi" ? styles.modeTabActive : ""}`}
        >
          🌬️ 4. RSI Airway (7 Ps)
        </button>
      </div>
    </div>
  );
}
