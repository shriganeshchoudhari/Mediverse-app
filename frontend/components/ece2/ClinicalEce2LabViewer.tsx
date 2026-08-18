"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalEce2LabViewer.module.css";
import {
  ShieldCheck,
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
  UserCheck,
  Users,
} from "lucide-react";

export type Ece2LabMode = "safety" | "sbar" | "ebm" | "reasoning";

export interface Ece2LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  safetyProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const ECE2_LAB_NODES: Record<Ece2LabMode, Ece2LabNode[]> = {
  safety: [
    {
      id: "ece2-saf-swiss-cheese-system-accidents",
      name: "Swiss Cheese System Accidents (Latent Blunt-End Conditions & Active Frontline Slips)",
      category: "Accident Trajectory",
      subType: "James Reason Model • Latent Conditions (Blunt End) • Active Failures (Sharp End) • Defenses",
      safetyProfile: "Pioneering systems safety model explaining how catastrophic accidents breach multiple defenses.",
      proceduralMechanism: "Adverse events occur when latent systemic holes (understaffing, poor UX) align with active execution slips.",
      clinicalHallmarks: "Focuses on systems architecture rather than individual blame; distinguishes slips/lapses from mistakes/violations.",
      highYieldPearls: "The Swiss Cheese model distinguishes blunt-end latent conditions (policies, staffing) from sharp-end active failures."
    },
    {
      id: "ece2-saf-root-cause-analysis-rca",
      name: "Root Cause Analysis RCA Architecture (Ishikawa Fishbone 6 Domains & 5 Whys Investigative Tree)",
      category: "Sentinel Event Investigation",
      subType: "Multidisciplinary Team • Ishikawa Fishbone (6 Domains) • 5 Whys Tree • Action Plan & Metrics",
      safetyProfile: "Structured retrospective investigation framework mandated for sentinel patient safety events.",
      proceduralMechanism: "Iterative '5 Whys' questioning drills past active human errors to uncover fundamental root organizational vulnerabilities.",
      clinicalHallmarks: "Fishbone domains: People, Methods, Machines, Materials, Environment, Measurement; formulates measurable action plan.",
      highYieldPearls: "RCA utilizes the Ishikawa fishbone diagram (6 domains) and 5 Whys to identify latent systemic root causes."
    },
    {
      id: "ece2-saf-hierarchy-safety-controls",
      name: "Hierarchy of Safety Controls (Engineered Forcing Functions vs Administrative Policies)",
      category: "Intervention Leverage",
      subType: "Forcing Functions (Strongest) • Automation / Barcodes • Standardized Policies & Education (Weakest)",
      safetyProfile: "Stratification of patient safety interventions by sustainable efficacy and reliance on human memory.",
      proceduralMechanism: "Physical forcing functions make error impossible; educational lectures and memos rely on fallible vigilance.",
      clinicalHallmarks: "Strongest: Non-Luer spinal connectors; Intermediate: Barcode medication scanning; Weakest: Memoranda and lectures.",
      highYieldPearls: "Engineering forcing functions (e.g. unique physical connectors) represent the strongest, most sustainable safety controls."
    },
    {
      id: "ece2-saf-prospective-fmea-analysis",
      name: "Prospective Failure Mode Analysis FMEA (Proactive Hazard Identification & Risk Priority Scoring)",
      category: "Prospective Safety",
      subType: "Proactive Risk Assessment • Failure Modes • Severity x Occurrence x Detection = Risk Priority Number",
      safetyProfile: "Prospective engineering methodology identifying potential failure modes before implementing new clinical processes.",
      proceduralMechanism: "Calculates Risk Priority Number (RPN) to prioritize safety redesigns and prevent first-occurrence accidents.",
      clinicalHallmarks: "Used before launching new chemotherapy protocols, robotic surgical suites, or electronic health record transitions.",
      highYieldPearls: "FMEA is a PROSPECTIVE risk assessment calculating RPN (Severity x Occurrence x Detection) before launching new processes."
    }
  ],

  sbar: [
    {
      id: "ece2-sb-sbar-structured-handover",
      name: "SBAR Structured Handover Protocol (Situation, Background, Assessment & Actionable Recommendation)",
      category: "Structured Handoff",
      subType: "S (Situation) • B (Background) • A (Assessment) • R (Actionable Recommendation / Repeat-Back)",
      safetyProfile: "Gold-standard interprofessional communication framework bridging professional discipline cultures.",
      proceduralMechanism: "Structures urgent communication into four logical components, ending with a concrete actionable request.",
      clinicalHallmarks: "State name and urgent concern &rarr; provide relevant clinical context &rarr; state vitals/impression &rarr; request bedside eval.",
      highYieldPearls: "SBAR structure: Situation (current concern), Background (history/context), Assessment (vitals/impression), Recommendation (request)."
    },
    {
      id: "ece2-sb-teamstepps-cus-escalation",
      name: "TeamSTEPPS CUS Safety Escalation (Concerned, Uncomfortable, Safety Issue Stop-the-Line Script)",
      category: "Assertiveness Language",
      subType: "I am CONCERNED • I am UNCOMFORTABLE • This is a SAFETY Issue / STOP THE LINE!",
      safetyProfile: "Graduated assertiveness tool empowering any team member to halt clinical actions across steep hierarchies.",
      proceduralMechanism: "Standardized trigger words signal immediate, non-punitive pause to re-evaluate life-threatening procedural hazards.",
      clinicalHallmarks: "Used when surgical site is questionable, wrong dose is prepared, or airway integrity is deteriorating.",
      highYieldPearls: "The CUS mnemonic ('Concerned, Uncomfortable, Safety issue') is a standardized trigger to immediately stop the line."
    },
    {
      id: "ece2-sb-two-challenge-rule-injunction",
      name: "Two-Challenge Safety Injunction (Hierarchical Authority Gradient Overcoming & Assertion Mandate)",
      category: "Safety Advocacy",
      subType: "First Challenge • Unacknowledged Concern • Mandatory Second Assertive Challenge • Chain of Command",
      safetyProfile: "Operational safety rule requiring team members to assert an unaddressed safety concern at least twice.",
      proceduralMechanism: "If the initial concern is dismissed, the team member must voice a clear second challenge and escalate if unheeded.",
      clinicalHallmarks: "Prevents silent compliance with error when interacting with senior surgeons or department chiefs.",
      highYieldPearls: "The Two-Challenge Rule mandates voicing a safety concern at least twice if unaddressed before escalating to leadership."
    },
    {
      id: "ece2-sb-closed-loop-resuscitation",
      name: "Closed-Loop Resuscitation Communication (Sender Call-Out, Receiver Repeat-Back & Verification Confirmation)",
      category: "High-Stress Execution",
      subType: "Call-Out • Check-Back / Read-Back • Verification • ACLS Code Resuscitation Protocols",
      safetyProfile: "Communication loop guaranteeing accurate transmission and execution of verbal orders during crisis.",
      proceduralMechanism: "The sender states the drug/dose; the receiver repeats back verbatim; the sender verbally verifies before drug push.",
      clinicalHallmarks: "Mandatory in trauma resuscitation, cardiac arrest code blue, and pediatric emergency dosing.",
      highYieldPearls: "Closed-loop communication requires the receiver to repeat verbal orders back verbatim before execution."
    }
  ],

  ebm: [
    {
      id: "ece2-ebm-diagnostic-test-physics-sn-sp",
      name: "Diagnostic Decision Physics (Sensitivity SnNOut, Specificity SpPIn & Prevalence-Driven PPV/NPV)",
      category: "Test Accuracy",
      subType: "Sensitivity (TP/[TP+FN]) • Specificity (TN/[TN+FP]) • PPV (Prevalence-Driven) • NPV",
      safetyProfile: "Fundamental diagnostic test performance mathematics and impact of population disease prevalence.",
      proceduralMechanism: "High sensitivity rules OUT disease when negative (SnNOut); high specificity rules IN disease when positive (SpPIn).",
      clinicalHallmarks: "PPV falls dramatically in low-prevalence screening populations; NPV rises with lower disease prevalence.",
      highYieldPearls: "Sensitivity and Specificity are independent of prevalence; Positive Predictive Value (PPV) increases with prevalence."
    },
    {
      id: "ece2-ebm-likelihood-ratios-lr-pos-neg",
      name: "Likelihood Ratios LR+ and LR- (Prevalence-Independent Diagnostic Power & Bayesian Updating)",
      category: "Bayesian Statistics",
      subType: "LR+ = Sn / (1 - Sp) (>10 rules in) • LR- = (1 - Sn) / Sp (<0.1 rules out) • Prevalence-Independent",
      safetyProfile: "Prevalence-independent metric quantifying how much a diagnostic test shifts pre-test disease probability.",
      proceduralMechanism: "LR+ > 10 generates large, conclusive increase in disease probability; LR- < 0.1 virtually excludes disease.",
      clinicalHallmarks: "Applied directly to pre-test odds to calculate post-test odds without confounding by local disease prevalence.",
      highYieldPearls: "LR+ = Sensitivity / (1 - Specificity); LR- = (1 - Sensitivity) / Specificity; both are independent of disease prevalence."
    },
    {
      id: "ece2-ebm-fagan-nomogram-odds-transform",
      name: "Fagan Nomogram Odds Transformations (Pre-Test Probability to Post-Test Disease Probability Conversion)",
      category: "Probability Updating",
      subType: "Odds = p / (1 - p) • Post-Odds = Pre-Odds x LR • Post-Probability = Post-Odds / (Post-Odds + 1)",
      safetyProfile: "Mathematical and graphical method for converting pre-test clinical suspicion into post-test certainty.",
      proceduralMechanism: "Converts probability to odds, multiplies by the likelihood ratio, and converts back to post-test probability.",
      clinicalHallmarks: "Wells score pre-test probability + D-dimer LR- allows instant rule-out of pulmonary embolism.",
      highYieldPearls: "Fagan transformation: Pre-Test Odds x Likelihood Ratio = Post-Test Odds; converts back to post-test probability."
    },
    {
      id: "ece2-ebm-choosing-wisely-stewardship",
      name: "Choosing Wisely Low-Value Test De-escalation (Diagnostic Cascades, Incidentaloma Harms & Stewardship)",
      category: "Diagnostic Stewardship",
      subType: "Choosing Wisely • Low-Value Testing • Diagnostic Cascades • Incidentalomas & False Positive Harm",
      safetyProfile: "Evidence-based initiative to eliminate tests and procedures whose harms outweigh clinical benefits.",
      proceduralMechanism: "Avoiding low-yield testing prevents false positive results that trigger invasive, risky downstream workups.",
      clinicalHallmarks: "Avoid routine daily ICU lab draws, urine cultures for asymptomatic bacteriuria, and preoperative EKGs for low-risk surgery.",
      highYieldPearls: "Diagnostic stewardship avoids low-value testing to prevent diagnostic cascades and harm from false-positive incidentalomas."
    }
  ],

  reasoning: [
    {
      id: "ece2-rs-dual-process-system1-system2",
      name: "Dual-Process Cognitive Architecture (System 1 Fast Pattern Matching vs System 2 Analytical Deduction)",
      category: "Cognitive Theory",
      subType: "System 1 (Heuristic / Fast / Subconscious) • System 2 (Analytical / Slow / Deductive) • Croskerry",
      safetyProfile: "Cognitive framework explaining how expert intuitive pattern recognition interacts with conscious logic.",
      proceduralMechanism: "System 1 is fast and efficient for typical presentations but vulnerable to bias; System 2 is slow and analytical.",
      clinicalHallmarks: "Expert clinicians fluidly switch from System 1 pattern matching to System 2 analytical deduction for atypical cases.",
      highYieldPearls: "System 1 is fast and heuristic-based; System 2 is slow, analytical, and hypothetico-deductive."
    },
    {
      id: "ece2-rs-anchoring-diagnostic-momentum",
      name: "Anchoring Bias & Diagnostic Momentum (Triage Fixation & Failure to Update with Objective Vital Signs)",
      category: "Cognitive Heuristics",
      subType: "Anchoring on Initial Impression • Diagnostic Momentum (Uncritical Passing) • Premature Closure",
      safetyProfile: "Common cognitive trap where clinicians prematurely fixate on initial data and fail to update their differential.",
      proceduralMechanism: "Accepting a previous provider's 'panic attack' or 'intoxication' label blocks recognition of pulmonary embolism or trauma.",
      clinicalHallmarks: "Failure to adjust diagnostic hypothesis when confronted with objective tachycardia, hypoxia, or abdominal rigidity.",
      highYieldPearls: "Anchoring bias is fixating on initial impressions; Diagnostic Momentum is uncritically accepting a prior provider's label."
    },
    {
      id: "ece2-rs-availability-confirmation-biases",
      name: "Availability & Confirmation Biases (Salient Recent Case Overestimation & Selective Evidence Seeking)",
      category: "Biased Search",
      subType: "Availability Bias (Vivid Recent Cases) • Confirmation Bias (Selective Evidence Gathering)",
      safetyProfile: "Cognitive distortions where recent vivid experiences or pre-formed theories bias clinical data gathering.",
      proceduralMechanism: "Availability bias overestimates rare disease likelihood; confirmation bias selectively seeks data confirming a pet hypothesis.",
      clinicalHallmarks: "Ordering tests only to prove pneumonia while ignoring negative sputum cultures and bilateral rales.",
      highYieldPearls: "Availability bias overestimates probability based on recent vivid cases; Confirmation bias ignores refuting evidence."
    },
    {
      id: "ece2-rs-metacognitive-diagnostic-timeout",
      name: "Metacognitive Diagnostic Time-Outs (Cognitive Forcing Functions & 'What Doesn't Fit?' Pause Protocol)",
      category: "De-Biasing Tools",
      subType: "Metacognitive Pause • 'What Doesn't Fit?' • 'What Else Could This Be?' • Cognitive Forcing Function",
      safetyProfile: "Structured reflective pause deliberately triggering System 2 analytical review before finalizing diagnosis.",
      proceduralMechanism: "Forces explicit consideration of disconfirming evidence, alternative life threats, and unaddressed vital sign abnormalities.",
      clinicalHallmarks: "Performed prior to hospital discharge, transfer, or initiating irreversible therapies (e.g. thrombolysis).",
      highYieldPearls: "A Diagnostic Time-Out asks: 'What findings do not fit this diagnosis? What else could this be? What is the worst-case scenario?'"
    }
  ]
};

interface ClinicalEce2LabViewerProps {
  initialMode?: Ece2LabMode;
  height?: string;
  onNodeSelect?: (node: Ece2LabNode) => void;
}

export default function ClinicalEce2LabViewer({
  initialMode = "safety",
  height = "560px",
  onNodeSelect,
}: ClinicalEce2LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Ece2LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return ECE2_LAB_NODES[activeMode] || ECE2_LAB_NODES.safety;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Ece2LabNode) => {
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
            <ShieldCheck size={14} /> ECE-102
          </span>
          <span className={styles.titleText}>
            {activeMode === "safety" && "Patient Safety & Incident Analysis: Swiss Cheese Model, RCA (Ishikawa) & FMEA"}
            {activeMode === "sbar" && "Interprofessional Communication: SBAR Handover, TeamSTEPPS, CUS & Two-Challenge Rule"}
            {activeMode === "ebm" && "Diagnostic Stewardship & EBM: Sensitivity/Specificity, Likelihood Ratios & Fagan Nomogram"}
            {activeMode === "reasoning" && "Clinical Reasoning & Cognitive Biases: Dual-Process (System 1/2), Anchoring & Time-Outs"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "ECE 2 Quality Quiz"}
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
                <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Patient Safety Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Patient Safety Principle: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-blue-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-blue-950 text-xs rounded border border-blue-700 text-blue-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Patient Safety & RCA */}
          {activeMode === "safety" && (
            <div className={styles.eceCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Systems Safety Architecture &amp; Root Cause Analysis
                </span>
                <span className="text-[11px] text-slate-400">Swiss Cheese &bull; RCA Ishikawa &bull; Forcing Functions &bull; FMEA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">Swiss Cheese Model &amp; Latent Conditions</div>
                  <div className="text-slate-300 mt-1">Latent conditions (blunt end: staffing, EHR design, vial look-alikes) lie dormant until aligned with sharp-end frontline execution slips to produce sentinel adverse events.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">Hierarchy of Safety Controls</div>
                  <div className="text-slate-300 mt-1">Strongest: Engineering forcing functions (making errors physically impossible) and barcode scanning. Weakest: Administrative policies, memos, and educational lectures relying on human memory.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: SBAR & TeamSTEPPS */}
          {activeMode === "sbar" && (
            <div className={styles.eceCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} /> SBAR Handover &amp; TeamSTEPPS Psychological Safety
                </span>
                <span className="text-[11px] text-slate-400">SBAR Protocol &bull; CUS Mnemonic &bull; Two-Challenge Rule &bull; Closed-Loop</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">SBAR Structured Handover</div>
                  <div className="text-slate-300 mt-1">Situation (identify urgent concern) &rarr; Background (admission diagnosis/context) &rarr; Assessment (vitals and clinical impression) &rarr; Recommendation (specific actionable order and repeat-back).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">CUS Mnemonic &amp; Two-Challenge Rule</div>
                  <div className="text-slate-300 mt-1">&quot;I am Concerned... I am Uncomfortable... this is a Safety issue / Stop the Line!&quot; Team members are mandated to voice safety concerns at least twice when authority gradients threaten care.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Diagnostic Stewardship & EBM */}
          {activeMode === "ebm" && (
            <div className={styles.eceCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Diagnostic Decision Physics &amp; Likelihood Ratios
                </span>
                <span className="text-[11px] text-slate-400">Sensitivity &bull; Specificity &bull; LR+/LR- &bull; Fagan Nomogram</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">Likelihood Ratios &amp; Bayes Theorem</div>
                  <div className="text-slate-300 mt-1">LR+ = Sn / (1 - Sp); LR- = (1 - Sn) / Sp. Both are independent of disease prevalence. LR+ &gt; 10 rules IN disease; LR- &lt; 0.1 virtually rules OUT disease. Pre-test odds &times; LR = Post-test odds.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">Choosing Wisely &amp; Diagnostic Stewardship</div>
                  <div className="text-slate-300 mt-1">Eliminating low-value screening in low-prevalence populations avoids false-positive results that trigger harmful diagnostic cascades and invasive incidentaloma procedures.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Clinical Reasoning & Cognitive Biases */}
          {activeMode === "reasoning" && (
            <div className={styles.eceCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Dual-Process Theory &amp; Cognitive De-Biasing
                </span>
                <span className="text-[11px] text-slate-400">System 1/2 &bull; Anchoring &bull; Diagnostic Momentum &bull; Time-Outs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">Anchoring &amp; Diagnostic Momentum</div>
                  <div className="text-slate-300 mt-1">Anchoring on a preliminary triage label of &quot;panic attack&quot; or &quot;intoxication&quot; prevents clinicians from adjusting when vital signs reveal hypoxia, pulmonary embolism, or intracranial trauma.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">Metacognitive Diagnostic Time-Out</div>
                  <div className="text-slate-300 mt-1">Structured pause deliberately asking: &quot;What findings do NOT fit this diagnosis? What else could this be? What is the worst-case life threat?&quot; before finalizing clinical disposition.</div>
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
                    <span className="text-blue-400 font-bold">Safety:</span> {node.safetyProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Quality Tool</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Patient Safety Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Safety Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Safety Entity / Framework</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Mechanism &amp; Systems Theory</div>
            <div className="text-xs text-blue-300 font-semibold">{activeNode.safetyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Operations</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Safety Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("safety")}
          className={`${styles.modeTab} ${activeMode === "safety" ? styles.modeTabActive : ""}`}
        >
          🛡️ 1. Patient Safety &amp; RCA
        </button>
        <button
          onClick={() => setActiveMode("sbar")}
          className={`${styles.modeTab} ${activeMode === "sbar" ? styles.modeTabActive : ""}`}
        >
          👥 2. SBAR &amp; TeamSTEPPS
        </button>
        <button
          onClick={() => setActiveMode("ebm")}
          className={`${styles.modeTab} ${activeMode === "ebm" ? styles.modeTabActive : ""}`}
        >
          📈 3. Diagnostic EBM
        </button>
        <button
          onClick={() => setActiveMode("reasoning")}
          className={`${styles.modeTab} ${activeMode === "reasoning" ? styles.modeTabActive : ""}`}
        >
          🧠 4. Clinical Reasoning
        </button>
      </div>
    </div>
  );
}
