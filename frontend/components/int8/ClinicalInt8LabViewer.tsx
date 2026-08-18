"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalInt8LabViewer.module.css";
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

export type Int8LabMode = "mccd" | "epa" | "osce" | "qi";

export interface Int8LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const INT8_LAB_NODES: Record<Int8LabMode, Int8LabNode[]> = {
  mccd: [
    {
      id: "int8-mc-mccd-death-certification-rules",
      name: "Medical Certification of Cause of Death (Part I Sequence, Underlying Cause of Death & Forbidden Mechanisms)",
      category: "MCCD Form 4/4A",
      subType: "Line (a) Immediate Cause &bull; Line (b) Antecedent Cause &bull; Line (c) UCOD &bull; Part II Contributory Factors",
      proceduralProfile: "Statutory medical death certification capturing etiologic cause of death for national vital statistics.",
      proceduralMechanism: "Documents the logical sequence of morbid events initiated by the true Underlying Cause of Death (UCOD).",
      clinicalHallmarks: "Part I Line (c) must be etiologic disease (e.g. Atherosclerosis); NEVER write 'Cardiorespiratory Arrest' as UCOD.",
      highYieldPearls: "Terminal mechanisms ('cardiorespiratory arrest', 'brain death') must NEVER be written as Underlying Cause of Death."
    },
    {
      id: "int8-mc-mlc-chain-of-custody-viscera",
      name: "Medico-Legal Registration & Viscera Preservation (Mandatory Police Intimation, Saturated Saline & Chain of Custody)",
      category: "MLC Protocols",
      subType: "RTAs, Poisons, Burns, Assault, Brought-Dead &bull; Saturated NaCl Solution &bull; NaF for Blood Alcohol &bull; Tamper Seals",
      proceduralProfile: "Formal medico-legal registration, police notification, and biological evidence preservation framework.",
      proceduralMechanism: "Preserves toxicological samples in non-reactive saturated saline with sealed labels and unbroken custody logs.",
      clinicalHallmarks: "Mandatory police intimation; preserve stomach, liver, and kidneys in saturated saline; log every handoff.",
      highYieldPearls: "All unnatural deaths mandate MLC registration, police intimation, and saturated saline viscera preservation."
    },
    {
      id: "int8-mc-thota-brainstem-death-apnea-test",
      name: "THOTA Brainstem Death & Apnea Testing (4-Doctor Panel, 6-Hour Testing Interval & PaCO2 >=60 mmHg Threshold)",
      category: "Brainstem Death",
      subType: "Board of 4 Medical Experts &bull; Absent Brainstem Reflexes &bull; 2 Tests 6h Apart &bull; PaCO2 &ge;60 mmHg or &Delta; &ge;20",
      proceduralProfile: "Statutory brainstem death certification under THOTA 2014 enabling legal deceased organ donation.",
      proceduralMechanism: "Loss of medullary respiratory drive confirmed by absent breathing during hypercapnic apnea test (PaCO2 >=60 mmHg).",
      clinicalHallmarks: "Confirm absent cranial reflexes; preoxygenate, disconnect ventilator with O2 catheter; positive if no breath and PaCO2 >=60.",
      highYieldPearls: "THOTA brainstem death certification requires 4-doctor panel and 2 apnea tests separated by at least 6 hours."
    },
    {
      id: "int8-mc-organ-donation-family-counseling",
      name: "Organ Donation & Family Consent Protocols (Deceased Donor Retrieval, Allocation Ethics & Counseling)",
      category: "Organ Retrieval",
      subType: "Transplant Coordinator &bull; Family Grief Counseling &bull; NOTTO/SOTTO Allocation &bull; Hemodynamic ICU Support",
      proceduralProfile: "Deceased donor multi-organ preservation, allocation networking, and compassionate next-of-kin counseling.",
      proceduralMechanism: "Maintains organ perfusion with inotropes and hormone replacement (T4, vasopressin) prior to sterile retrieval.",
      clinicalHallmarks: "Grief counseling by transplant coordinator; maintain donor MAP >=65 mmHg, UO >=1 mL/kg/h; follow NOTTO registry.",
      highYieldPearls: "Maintain donor hemodynamic stability (MAP >=65 mmHg) during organ preservation while coordinating with NOTTO."
    }
  ],

  epa: [
    {
      id: "int8-ep-13-core-entrustable-activities",
      name: "AAMC & NMC 13 Core Entrustable Activities (Workplace Clinical Competencies & Graduation Benchmarks)",
      category: "13 Core EPAs",
      subType: "EPAs 1-13 &bull; History/Exam &bull; Differential &bull; Diagnostic Orders &bull; Handover &bull; Procedures &bull; Urgent Care",
      proceduralProfile: "Essential clinical activities that graduating medical interns must be entrusted to perform without direct supervision.",
      proceduralMechanism: "Integrates medical knowledge, clinical reasoning, interpersonal skills, and patient safety into observable units of practice.",
      clinicalHallmarks: "Demonstrate progressive autonomy across history taking, acute resuscitation, informed consent, and procedural skills.",
      highYieldPearls: "The 13 Core EPAs define the operational benchmark units of practice expected of a graduating physician."
    },
    {
      id: "int8-ep-chen-5-level-entrustment-scale",
      name: "Chen's 5-Level Entrustment Decision Scale (Level 1 Observation to Level 4 Independent Autonomous Practice)",
      category: "Entrustment Scale",
      subType: "Level 1 (Observe) &bull; Level 2 (Direct) &bull; Level 3 (Indirect) &bull; Level 4 (Independent) &bull; Level 5 (Supervising)",
      proceduralProfile: "Standardized decision scale quantifying trainee clinical autonomy and supervisory requirements.",
      proceduralMechanism: "Clinical supervisors evaluate trainee competence, trustworthiness, and self-awareness to assign entrustment levels.",
      clinicalHallmarks: "Interns must attain Chen's Level 4 (Independent practice with distant oversight) for core clinical graduation.",
      highYieldPearls: "Graduating interns must achieve Chen Level 4 (independent practice with distant oversight) across core EPAs."
    },
    {
      id: "int8-ep-workplace-based-assessment-wba",
      name: "Workplace-Based Assessment Portfolios (Mini-CEX, DOPS, Case-Based Discussions & Multisource Feedback)",
      category: "WBA Portfolio",
      subType: "Mini-CEX (15m Clinical Encounter) &bull; DOPS (Procedural Skills) &bull; CbD (Reasoning) &bull; 360-Degree Feedback",
      proceduralProfile: "Formative and summative clinical evaluations conducted in real-world patient care environments.",
      proceduralMechanism: "Triangulates direct observation data to capture procedural precision, communication, and diagnostic stewardship.",
      clinicalHallmarks: "Log required numbers of Mini-CEX encounters, DOPS procedural evaluations, and case-based discussions in logbook.",
      highYieldPearls: "Triangulate Mini-CEX (clinical skills), DOPS (procedural skills), and CbD (clinical reasoning) in clinical logbook."
    },
    {
      id: "int8-ep-clinical-competency-committee-review",
      name: "Clinical Competency Committee Review (Milestone Tracking, Longitudinal E-Portfolio & Licensure Decision)",
      category: "CCC Review",
      subType: "Longitudinal E-Portfolio &bull; Milestone Benchmarks &bull; Remediation Pathways &bull; Medical Council Licensure",
      proceduralProfile: "Multi-faculty committee review synthesizing workplace assessments to grant exit internship completion certificates.",
      proceduralMechanism: "Evaluates aggregate evidence against national CBME milestones to certify safe, independent medical practice.",
      clinicalHallmarks: "Review logbook completion, WBA scorecards, and audit presentations to approve final medical council registration.",
      highYieldPearls: "The Clinical Competency Committee reviews aggregate WBA evidence to certify readiness for medical registration."
    }
  ],

  osce: [
    {
      id: "int8-os-septic-shock-resuscitation-station",
      name: "Septic Shock Resuscitation Master Station (Lactate >4, 30 mL/kg Crystalloid Bolus & Norepinephrine Vasopressor)",
      category: "Sepsis Shock Station",
      subType: "Lactate >4 mmol/L &bull; 30 mL/kg Balanced Crystalloid &le;3h &bull; Blood Cultures &bull; Norepinephrine Target MAP &ge;65",
      proceduralProfile: "High-stakes clinical simulation testing recognition and rapid bundle resuscitation of septic shock.",
      proceduralMechanism: "Restores intravascular volume and vasomotor tone, suppressing tissue hypoperfusion and anaerobic lactic acidosis.",
      clinicalHallmarks: "Measure lactate, obtain blood cultures, start broad antibiotics within 1h, infuse 30 mL/kg fluid, start Norepinephrine for MAP >=65.",
      highYieldPearls: "Septic shock resuscitation: 30 mL/kg crystalloids within 3 hours + Norepinephrine titrated to MAP >=65 mmHg."
    },
    {
      id: "int8-os-cico-surgical-cricothyroidotomy",
      name: "CICO Surgical Cricothyroidotomy Master Station (Cannot Intubate Cannot Oxygenate, Scalpel-Bougie-Tube & 6.0 ETT)",
      category: "Airway CICO Station",
      subType: "Failed Intubation + Failed Supraglottic Airway &bull; SpO2 <70% &bull; Scalpel-Bougie-Tube Protocol &bull; 6.0 mm Cuffed ETT",
      proceduralProfile: "Emergency Front-of-Neck Access (FONA) in a paralyzed patient with complete airway obstruction.",
      proceduralMechanism: "Bypasses supraglottic obstruction by creating direct surgical access through the cricothyroid membrane.",
      clinicalHallmarks: "Declare CICO; perform horizontal stab through cricothyroid membrane; insert bougie caudally; railroad 6.0 cuffed ETT.",
      highYieldPearls: "CICO crisis mandates emergency Scalpel-Bougie-Tube surgical cricothyroidotomy with size 6.0 cuffed ETT."
    },
    {
      id: "int8-os-refractory-pph-bakri-balloon",
      name: "Refractory Postpartum Hemorrhage Master Station (Uterine Atony, Medical Escalation & Bakri Intrauterine Balloon)",
      category: "PPH Master Station",
      subType: "EBL >1,000 mL &bull; Oxytocin &rarr; Methergine &rarr; Carboprost &rarr; Misoprostol &bull; Bakri Balloon (300-500 mL Saline)",
      proceduralProfile: "Emergency multidisciplinary obstetric protocol managing massive primary postpartum hemorrhage.",
      proceduralMechanism: "Uterotonics stimulate myometrial contractility; intrauterine balloon provides hydrostatic compressive tamponade.",
      clinicalHallmarks: "Perform bimanual massage, escalate uterotonics, insert Bakri balloon (inflate 300-500 mL saline), activate massive transfusion.",
      highYieldPearls: "Escalate uterotonics (Oxytocin, Methergine, Carboprost, Misoprostol); insert Bakri balloon (300-500 mL) if refractory."
    },
    {
      id: "int8-os-acute-ischemic-stroke-thrombolysis",
      name: "Acute Ischemic Stroke Thrombolysis Master Station (Door-to-Needle <=45m, Non-Contrast CT & IV Alteplase 0.9 mg/kg)",
      category: "Stroke Master Station",
      subType: "Onset <4.5 Hours &bull; NIHSS Scoring &bull; Non-Contrast CT Exclude Bleed &bull; IV Alteplase 0.9 mg/kg (Max 90 mg)",
      proceduralProfile: "Emergency code stroke protocol evaluating eligibility for systemic intravenous thrombolysis.",
      proceduralMechanism: "Recombinant tissue plasminogen activator (rtPA) converts plasminogen to plasmin, dissolving occlusive fibrin clots.",
      clinicalHallmarks: "Confirm symptom onset <4.5h, exclude bleed on CT, verify BP <185/110 mmHg, infuse IV Alteplase 0.9 mg/kg (10% bolus, 90% 1h).",
      highYieldPearls: "IV Alteplase 0.9 mg/kg (max 90 mg) within 4.5 hours of ischemic stroke onset after non-contrast CT excludes hemorrhage."
    }
  ],

  qi: [
    {
      id: "int8-qi-ishikawa-6m-fishbone-analysis",
      name: "Ishikawa 6M Fishbone Root Cause Analysis (Manpower, Methods, Machines, Materials, Measurements & Milieu)",
      category: "RCA Fishbone",
      subType: "Manpower, Methods, Machines, Materials, Measurements, Milieu &bull; Latent Systemic Vulnerabilities",
      proceduralProfile: "Structured visual tool mapping all potential contributing factors behind a major clinical adverse event.",
      proceduralMechanism: "Categorizes upstream latent systemic errors across 6 operational domains to prevent human-blame cognitive bias.",
      clinicalHallmarks: "Map medication errors across the 6Ms to identify unstandardized protocols, look-alike packaging, or staffing shortages.",
      highYieldPearls: "Ishikawa Fishbone RCA explores the 6Ms to identify latent organizational vulnerabilities behind adverse events."
    },
    {
      id: "int8-qi-5-whys-iterative-interrogation",
      name: "The 5 Whys Iterative Interrogation (Deep Root Cause Extraction from Sharp-End Adverse Events)",
      category: "5 Whys Technique",
      subType: "5 Iterative Whys &bull; Sharp-End Active Error &rarr; Latent Institutional Policies &bull; Root Solution Design",
      proceduralProfile: "Sequential causal interrogation drilling down from the immediate clinical slip to systemic root causes.",
      proceduralMechanism: "Repeatedly questioning 'Why' bypasses superficial proximate causes to reveal institutional policy and design flaws.",
      clinicalHallmarks: "Ask 'Why' 5 times sequentially following a sentinel event to uncover deep procedural or architectural gaps.",
      highYieldPearls: "The 5 Whys technique iteratively drills down from the immediate sharp-end error to fundamental systemic root causes."
    },
    {
      id: "int8-qi-pdsa-rapid-cycle-improvement",
      name: "PDSA Rapid-Cycle Quality Improvement (Plan-Do-Study-Act, Run Charts & System-Wide Standardization)",
      category: "PDSA Cycles",
      subType: "SMART Aim &bull; Plan (Design) &bull; Do (Pilot Single Ward) &bull; Study (Run Chart) &bull; Act (Scale System-Wide)",
      proceduralProfile: "Iterative scientific method for testing and implementing healthcare quality improvement changes.",
      proceduralMechanism: "Small-scale iterative testing refines clinical interventions before hospital-wide deployment, minimizing failure.",
      clinicalHallmarks: "Formulate SMART aim; test on one unit for 4 weeks; evaluate run chart data; scale hospital-wide if successful.",
      highYieldPearls: "PDSA cycles test small-scale clinical improvements iteratively before scaling proven interventions hospital-wide."
    },
    {
      id: "int8-qi-sbar-structured-clinical-handover",
      name: "SBAR Structured Clinical Handover (Situation, Background, Assessment & Actionable Recommendation)",
      category: "SBAR Handover",
      subType: "Situation (Immediate Problem) &bull; Background (Clinical Context) &bull; Assessment (Severity) &bull; Recommendation (Action)",
      proceduralProfile: "Standardized four-element communication framework for clinical handovers and emergency escalations.",
      proceduralMechanism: "Eliminates conversational ambiguity, framing critical patient information into an efficient, actionable format.",
      clinicalHallmarks: "State Situation (vital instability), Background (history), Assessment (diagnostic impression), Recommendation (timed request).",
      highYieldPearls: "SBAR framework: Situation (who/what), Background (context), Assessment (impression), Recommendation (action)."
    }
  ]
};

interface ClinicalInt8LabViewerProps {
  initialMode?: Int8LabMode;
  height?: string;
  onNodeSelect?: (node: Int8LabNode) => void;
}

export default function ClinicalInt8LabViewer({
  initialMode = "mccd",
  height = "560px",
  onNodeSelect,
}: ClinicalInt8LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Int8LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return INT8_LAB_NODES[activeMode] || INT8_LAB_NODES.mccd;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Int8LabNode) => {
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
            <Sparkles size={14} /> INT-508
          </span>
          <span className={styles.titleText}>
            {activeMode === "mccd" && "Medico-Legal Jurisprudence: MCCD Death Certification, MLC Viscera & THOTA Brainstem Death"}
            {activeMode === "epa" && "Entrustable Professional Activities: 13 Core EPAs, Chen's 5-Level Scale & WBA Portfolio"}
            {activeMode === "osce" && "Exit OSCE Master Stations: Sepsis Shock Bundle, CICO Surgical Airway, PPH & Stroke Thrombolysis"}
            {activeMode === "qi" && "Quality Improvement & Patient Safety: Ishikawa 6M RCA, 5 Whys, PDSA Cycles & SBAR Handover"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Exit Competency Quiz"}
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
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Exit Milestone Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Exit Competency: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-rose-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-rose-950 text-xs rounded border border-rose-700 text-rose-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: MCCD */}
          {activeMode === "mccd" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> MCCD Death Certification &amp; Medico-Legal Framework
                </span>
                <span className="text-[11px] text-slate-400">MCCD Form 4/4A &bull; Part I UCOD &bull; No Arrest/Asphyxia &bull; MLC Saturated Saline &bull; THOTA 6h</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">MCCD Cause of Death Rules</div>
                  <div className="text-slate-300 mt-1">Part I Line (c) must be the true Underlying Cause of Death (e.g. Coronary Atherosclerosis). NEVER enter terminal mechanisms ('Cardiorespiratory arrest', 'Brain death', 'Asphyxia') as the cause of death.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">THOTA Brainstem Death Testing</div>
                  <div className="text-slate-300 mt-1">Certification by a statutory 4-doctor panel. Requires absent brainstem reflexes and two positive apnea tests separated by 6 hours demonstrating no spontaneous breathing with PaCO2 &ge;60 mmHg.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: EPA */}
          {activeMode === "epa" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap size={14} /> 13 Core EPAs &amp; Chen's Entrustment Scale
                </span>
                <span className="text-[11px] text-slate-400">EPAs 1-13 &bull; Level 4 Independent Practice Target &bull; Mini-CEX &bull; DOPS &bull; CbD &bull; Portfolio</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Chen's 5-Level Entrustment Scale</div>
                  <div className="text-slate-300 mt-1">Level 1 (Observe), Level 2 (Direct supervision), Level 3 (Indirect supervision), Level 4 (Independent autonomous practice with distant oversight - Exit Graduation Target), Level 5 (Supervising others).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Workplace-Based Assessment Triangulation</div>
                  <div className="text-slate-300 mt-1">Mini-CEX directly observes 15m clinical encounters; DOPS evaluates procedural dexterity (LP, ABG, Central Line); CbD assesses clinical reasoning and diagnostic stewardship for CCC review.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: OSCE */}
          {activeMode === "osce" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Exit OSCE Master Stations
                </span>
                <span className="text-[11px] text-slate-400">Sepsis 30 mL/kg &bull; CICO Surgical Cricothyroidotomy 6.0 ETT &bull; PPH Bakri Balloon &bull; Stroke rtPA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Sepsis Shock &amp; CICO Airway Crisis</div>
                  <div className="text-slate-300 mt-1">Sepsis: 30 mL/kg fluid + broad antibiotics &le;1h + Norepinephrine for MAP &ge;65. CICO: Declare crisis, perform Scalpel-Bougie-Tube cricothyroidotomy through cricothyroid membrane with 6.0 cuffed ETT.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">PPH Tamponade &amp; Stroke Thrombolysis</div>
                  <div className="text-slate-300 mt-1">Refractory PPH: Oxytocin &rarr; Methergine &rarr; Carboprost &rarr; Misoprostol &rarr; Bakri balloon (300-500 mL saline). Stroke: IV Alteplase 0.9 mg/kg (max 90 mg) within 4.5 hours after CT excludes hemorrhage.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: QI */}
          {activeMode === "qi" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList size={14} /> Quality Improvement, Patient Safety &amp; SBAR
                </span>
                <span className="text-[11px] text-slate-400">Ishikawa 6Ms &bull; 5 Whys Root Cause &bull; PDSA Rapid-Cycle &bull; SBAR Structured Handover</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Ishikawa Fishbone &amp; 5 Whys</div>
                  <div className="text-slate-300 mt-1">Ishikawa 6Ms (Manpower, Methods, Machines, Materials, Measurements, Milieu) uncover latent systemic hazards. The 5 Whys drill down from sharp-end active slips to institutional policy defects.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">PDSA Cycles &amp; SBAR Communication</div>
                  <div className="text-slate-300 mt-1">PDSA tests small clinical changes on single wards before hospital-wide scaling. SBAR (Situation, Background, Assessment, Recommendation) provides standardized, unambiguous clinical handover.</div>
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
                    <span className="text-rose-400 font-bold">Protocol:</span> {node.proceduralProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Exit Competency</span>
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
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Exit Portfolio Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Competency Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Operational Mechanism</div>
            <div className="text-xs text-rose-300 font-semibold">{activeNode.proceduralProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Actions</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Exit Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("mccd")}
          className={`${styles.modeTab} ${activeMode === "mccd" ? styles.modeTabActive : ""}`}
        >
          📜 1. MCCD &amp; THOTA
        </button>
        <button
          onClick={() => setActiveMode("epa")}
          className={`${styles.modeTab} ${activeMode === "epa" ? styles.modeTabActive : ""}`}
        >
          🎓 2. EPAs &amp; Portfolio
        </button>
        <button
          onClick={() => setActiveMode("osce")}
          className={`${styles.modeTab} ${activeMode === "osce" ? styles.modeTabActive : ""}`}
        >
          🏥 3. Exit OSCE Stations
        </button>
        <button
          onClick={() => setActiveMode("qi")}
          className={`${styles.modeTab} ${activeMode === "qi" ? styles.modeTabActive : ""}`}
        >
          📈 4. Patient Safety &amp; QI
        </button>
      </div>
    </div>
  );
}
