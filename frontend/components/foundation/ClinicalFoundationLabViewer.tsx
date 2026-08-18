"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalFoundationLabViewer.module.css";
import {
  HeartHandshake,
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
} from "lucide-react";

export type FoundationLabMode = "communication" | "ethics" | "infection" | "vitals";

export interface FoundationLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const FOUNDATION_LAB_NODES: Record<FoundationLabMode, FoundationLabNode[]> = {
  communication: [
    {
      id: "fnd-comm-spikes-bad-news",
      name: "SPIKES Protocol for Breaking Bad News (Setting, Perception, Invitation, Knowledge, Empathy & Strategy)",
      category: "Clinical Communication",
      subType: "Step 1-6 Framework • Privacy Setting • Warning Shot • Empathetic Validation (NURSE) • Actionable Plan",
      clinicalProfile: "Structured 6-step protocol optimized for delivering grave diagnoses with compassion and clarity.",
      proceduralMechanism: "Gauging baseline patient perception prevents shock; addressing acute emotions unblocks cognitive processing.",
      clinicalHallmarks: "Sit at eye level, silence pagers, explore patient baseline perception, deliver clear news, validate emotions.",
      highYieldPearls: "In SPIKES protocol, address emotional distress with empathy (NURSE) before explaining detailed treatment plans."
    },
    {
      id: "fnd-comm-calgary-cambridge-interview",
      name: "Calgary-Cambridge Interview Model (Open-to-Closed Cone, ICE Exploration & Chunk-and-Check)",
      category: "History-Taking Architecture",
      subType: "Initiating -> Gathering Info -> Building Relationship -> Explanation/Planning -> Closing",
      clinicalProfile: "Evidence-based framework integrating biomedical history with patient illness perspective.",
      proceduralMechanism: "Begins with broad open-ended questions before narrowing; explores ICE (Ideas, Concerns, Expectations).",
      clinicalHallmarks: "Active listening, avoiding early interruption (average patient speaks uninterrupted for 18-22 seconds), chunking and checking.",
      highYieldPearls: "The Calgary-Cambridge model emphasizes exploring patient Ideas, Concerns, and Expectations (ICE)."
    },
    {
      id: "fnd-comm-nurse-empathy-skills",
      name: "NURSE Empathetic Communication Skills (Name, Understand, Respect, Support & Explore Emotional Responses)",
      category: "Empathetic Tools",
      subType: "N (Name) • U (Understand) • R (Respect) • S (Support) • E (Explore Emotions)",
      clinicalProfile: "Core micro-communication verbal skills used to legitimize patient distress and strengthen alliance.",
      proceduralMechanism: "Explicit verbal naming of observed emotional affect reduces limbic amygdala activation in anxious patients.",
      clinicalHallmarks: "Validates fear, avoids false reassurance ('everything will be fine'), acknowledges patient fortitude and resilience.",
      highYieldPearls: "NURSE mnemonic: Name the emotion, Understand/validate, Respect patient effort, Support team presence, Explore worries."
    },
    {
      id: "fnd-comm-deescalation-difficult-encounters",
      name: "De-Escalation & Difficult Encounters (Angry Patient De-escalation & Professional Interpreter Utilization)",
      category: "Special Encounters",
      subType: "De-Escalation of Anger • Non-Defensive Posture • Certified Medical Interpreters (No Family Translators)",
      clinicalProfile: "Protocols for managing volatile interactions, communication barriers, and intense emotional states.",
      proceduralMechanism: "Acknowledges underlying frustration without arguing; uses professional medical interpreters to ensure precision.",
      clinicalHallmarks: "Maintain open posture, exit route access, non-judgmental tone; never use minor children for medical translation.",
      highYieldPearls: "Always utilize certified medical interpreters for non-native speakers; never rely on family members or ad-hoc staff."
    }
  ],

  ethics: [
    {
      id: "fnd-eth-autonomy-informed-consent",
      name: "Autonomy & Informed Consent Hierarchy (Self-Determination, Decisional Capacity 4 Criteria & Informed Refusal)",
      category: "Core Bioethics",
      subType: "Autonomy Supersedes Beneficence • 4 Decisional Capacity Criteria • Informed Refusal (Jehovah's Witness)",
      clinicalProfile: "Primary ethical principle establishing a competent patient's absolute right to bodily self-determination.",
      proceduralMechanism: "Decisional capacity requires understanding facts, appreciating consequences, reasoning options, and communicating a choice.",
      clinicalHallmarks: "Competent adults may refuse any treatment including blood products; paternalistic override constitutes legal battery.",
      highYieldPearls: "Patient autonomy supersedes medical beneficence; competent adults have the right to refuse life-saving blood products."
    },
    {
      id: "fnd-eth-tarasoff-duty-exceptions",
      name: "Tarasoff Duty to Protect & Exceptions (Imminent Identified Violence, Abuse Reporting & Public Health Mandates)",
      category: "Confidentiality Exceptions",
      subType: "Tarasoff Duty to Warn/Protect • Mandatory Child/Elder Abuse Reporting • Reportable Infectious Diseases",
      clinicalProfile: "Legally and ethically mandated breaches of patient confidentiality to protect innocent third parties from harm.",
      proceduralMechanism: "Triggered by explicit, credible threats of severe physical violence against specific identifiable individuals.",
      clinicalHallmarks: "Must notify both the threatened individual and law enforcement; mandatory reporting of child abuse and tuberculosis.",
      highYieldPearls: "The Tarasoff ruling mandates breaching confidentiality to warn and protect an identifiable intended victim from violent harm."
    },
    {
      id: "fnd-eth-beneficence-nonmaleficence-double-effect",
      name: "Beneficence vs Non-Maleficence Balancing (Primum Non Nocere, Duty of Care & Rule of Double Effect Palliative Sedation)",
      category: "Harm vs Benefit",
      subType: "Primum Non Nocere • Risk-to-Benefit Calculation • Rule of Double Effect (Palliative Opioids/Sedation)",
      clinicalProfile: "Ethical doctrine governing actions that produce both an intended therapeutic benefit and an unintended side effect.",
      proceduralMechanism: "High-dose opioids to relieve intractable terminal pain are ethical even if respiratory depression foreseeably occurs.",
      clinicalHallmarks: "Primary intent must be symptom relief, not hastening death; proportional dosing avoids euthanasia.",
      highYieldPearls: "Under the Rule of Double Effect, administering high-dose palliative analgesia is ethical if the primary intent is pain relief."
    },
    {
      id: "fnd-eth-justice-resource-allocation-triage",
      name: "Distributive Justice & Resource Allocation (Equal Access, Mass Casualty Triage & Organ Transplant Allocation)",
      category: "Justice & Equity",
      subType: "Fair Resource Distribution • Non-Discrimination • Mass Casualty Utilitarian Triage • UNOS Transplant Rules",
      clinicalProfile: "Fair and equitable distribution of scarce healthcare resources without bias toward social worth or status.",
      proceduralMechanism: "Applies objective clinical criteria (MELD score, HLA compatibility) to allocate organs; triage maximizes lives saved.",
      clinicalHallmarks: "Non-discrimination across race, gender, incarceration status, or substance use history in emergency care.",
      highYieldPearls: "Distributive justice mandates treating equal clinical needs equally without bias toward socioeconomic status."
    }
  ],

  infection: [
    {
      id: "fnd-inf-transmission-isolation-precautions",
      name: "Transmission-Based Isolation Precautions (Contact C.diff Soap, Droplet Surgical Mask & Airborne TB N95 AIIR)",
      category: "Hospital Epidemiology",
      subType: "Contact (Gown/Gloves) • Droplet (Surgical Mask) • Airborne (N95 Respirator + AIIR Negative Pressure)",
      clinicalProfile: "Stratified infection control protocols designed to halt transmission of nosocomial pathogens.",
      proceduralMechanism: "Airborne AIIR rooms maintain negative pressure with >=12 air changes/hour and HEPA exhaust filtration.",
      clinicalHallmarks: "Wash with soap and water for C. difficile spores (alcohol rubs ineffective); N95 mask for active pulmonary tuberculosis.",
      highYieldPearls: "C. difficile spores require physical handwashing with soap and water; Airborne isolation (TB) requires N95 respirator + AIIR."
    },
    {
      id: "fnd-inf-who-5-moments-hand-hygiene",
      name: "WHO 5 Moments for Hand Hygiene (Crucial Clinical Touchpoints & Nosocomial Cross-Contamination Prevention)",
      category: "Standard Precautions",
      subType: "Moment 1: Before Patient • Moment 2: Before Aseptic • Moment 3: After Fluid • Moment 4: After Patient • Moment 5: Surroundings",
      clinicalProfile: "Global evidence-based standard establishing exact touchpoints requiring alcohol hand rub or handwashing.",
      proceduralMechanism: "Interrupts transient microbial flora transfer from contaminated environment to vulnerable patient portals.",
      clinicalHallmarks: "Reduces central line-associated bloodstream infections (CLABSI) and catheter-associated urinary tract infections (CAUTI).",
      highYieldPearls: "The WHO 5 Moments include touching the patient's immediate surroundings even if the patient was not directly touched."
    },
    {
      id: "fnd-inf-ppe-donning-doffing-sequence",
      name: "Personal Protective Equipment Donning/Doffing (Strict Contamination Sequence: Gloves First Doffing & Respiratory Protection)",
      category: "PPE Mechanics",
      subType: "Donning: Gown -> Mask -> Shield -> Gloves • Doffing: Gloves -> Shield -> Gown -> Mask (Most Contaminated First)",
      clinicalProfile: "Meticulous sequencing of donning and doffing to prevent self-contamination during high-consequence disease care.",
      proceduralMechanism: "Gloves harbor the highest pathogen bioburden and must be removed first without touching bare skin.",
      clinicalHallmarks: "Remove respirator outside the patient room by grasping rear elastic straps; perform immediate hand hygiene.",
      highYieldPearls: "PPE Doffing order (most contaminated first): Gloves -> Face Shield -> Gown -> Mask/N95 -> Immediate Hand Hygiene."
    },
    {
      id: "fnd-inf-needle-stick-pep-protocols",
      name: "Needle-Stick Injury & Occupational PEP (Hollow-Bore HIV 3-Drug 28-Day Prophylaxis & HBV Immunoglobulin Algorithm)",
      category: "Occupational Safety",
      subType: "Immediate Soap/Water Wash • HIV 3-Drug PEP <=72h for 28 Days • HBV HBIG + Vaccine for Non-Immune Staff",
      clinicalProfile: "Urgent management of percutaneous hollow-bore blood exposures to prevent HIV, HBV, and HCV transmission.",
      proceduralMechanism: "Early antiretroviral viral suppression within 2 hours prevents establishment of latent reservoir in dendritic cells.",
      clinicalHallmarks: "Wash under running water; do not squeeze or scrub; start Tenofovir + Emtricitabine + Dolutegravir for 28 days.",
      highYieldPearls: "Needle-stick HIV PEP should be initiated within 2 hours (maximum 72 hours) and continued for 28 days."
    }
  ],

  vitals: [
    {
      id: "fnd-vit-blood-pressure-korotkoff-orthostatics",
      name: "Blood Pressure Physics & Korotkoff Mechanics (Cuff Bladder 40%x80% Sizing, Phase I/V Sounds & Orthostatic Reflexes)",
      category: "Hemodynamic Vitals",
      subType: "Bladder 40% Width x 80% Length • Korotkoff I (Systolic) & V (Diastolic) • Orthostatic Drop >=20/10 mmHg",
      clinicalProfile: "Physics and diagnostic criteria for accurate indirect sphygmomanometry and postural volume depletion.",
      proceduralMechanism: "Turbulent flow through compressed brachial artery creates tapping Korotkoff sounds; phase V marks laminar restoration.",
      clinicalHallmarks: "Under-cuffing (too small bladder) creates falsely elevated BP; orthostatic drop >=20 systolic or >=10 diastolic indicates hypovolemia.",
      highYieldPearls: "Cuff bladder must encircle >=80% arm length; orthostatic hypotension is a drop >=20 mmHg systolic or >=10 mmHg diastolic."
    },
    {
      id: "fnd-vit-gcs-neurological-triage-intubation",
      name: "Glasgow Coma Scale GCS Neurological Triage (Eye 1-4, Verbal 1-5, Motor 1-6 & Severe GCS <=8 Airway Protection)",
      category: "Neurological Coma Scoring",
      subType: "Eye Opening (1-4) • Verbal Response (1-5) • Motor Response (1-6) • Severe Traumatic Brain Injury (GCS <= 8)",
      clinicalProfile: "Universal objective neurological scale evaluating level of consciousness in trauma and acute illness.",
      proceduralMechanism: "Motor scoring is the most predictive component; abnormal extension (decerebrate M2) indicates midbrain/pontine injury.",
      clinicalHallmarks: "GCS <= 8 mandates immediate endotracheal intubation for airway protection ('GCS <= 8, INTUBATE').",
      highYieldPearls: "GCS components: Eye (1-4), Verbal (1-5), Motor (1-6); Total 3 to 15; a score <= 8 mandates immediate intubation."
    },
    {
      id: "fnd-vit-respiratory-patterns-temperature",
      name: "Respiratory Dynamics & Temperature Profiling (Kussmaul Acidosis, Cheyne-Stokes Apnea & Hypothermia Rewarming Stages)",
      category: "Physiological Patterns",
      subType: "Kussmaul (Rapid Deep Hyperventilation) • Cheyne-Stokes (Crescendo-Decrescendo Apnea) • Core Temp <35°C",
      clinicalProfile: "Pattern recognition of pathological breathing and core body thermal dysregulation.",
      proceduralMechanism: "Kussmaul breathing eliminates volatile CO2 in severe metabolic acidosis; Cheyne-Stokes reflects delayed medullary CO2 sensing in heart failure.",
      clinicalHallmarks: "Kussmaul breathing in diabetic ketoacidosis; core temperature <35°C defines accidental hypothermia.",
      highYieldPearls: "Kussmaul breathing is deep, rapid hyperventilation seen in severe metabolic acidosis (DKA, uremia)."
    },
    {
      id: "fnd-vit-news2-early-warning-score",
      name: "National Early Warning Score NEWS2 (Inpatient Physiological Deterioration Trigger & Rapid Response Escalation)",
      category: "Inpatient Triage",
      subType: "Aggregate Score (0-20) • RR, SpO2, Temp, SBP, Pulse, Consciousness • Rapid Response Team (RRT) Trigger",
      clinicalProfile: "Standardized physiological track-and-trigger tool detecting early inpatient clinical deterioration.",
      proceduralMechanism: "Aggregates deviations across 6 vital parameters; score >=5 or single score of 3 triggers urgent medical review.",
      clinicalHallmarks: "Enables early sepsis recognition, shock intervention, and prevention of unexpected in-hospital cardiac arrests.",
      highYieldPearls: "NEWS2 aggregates 6 physiological parameters; a score >= 5 triggers an immediate emergency Medical Rapid Response Team."
    }
  ]
};

interface ClinicalFoundationLabViewerProps {
  initialMode?: FoundationLabMode;
  height?: string;
  onNodeSelect?: (node: FoundationLabNode) => void;
}

export default function ClinicalFoundationLabViewer({
  initialMode = "communication",
  height = "560px",
  onNodeSelect,
}: ClinicalFoundationLabViewerProps) {
  const [activeMode, setActiveMode] = useState<FoundationLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return FOUNDATION_LAB_NODES[activeMode] || FOUNDATION_LAB_NODES.communication;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: FoundationLabNode) => {
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
            <HeartHandshake size={14} /> FND-101 / ECE
          </span>
          <span className={styles.titleText}>
            {activeMode === "communication" && "Doctor-Patient Communication: Calgary-Cambridge, SPIKES Protocol & Empathy (NURSE)"}
            {activeMode === "ethics" && "Medical Ethics & Bioethics: The Four Principles (Beauchamp & Childress) & Tarasoff Ruling"}
            {activeMode === "infection" && "Hospital Infection Control: WHO 5 Moments, Isolation Precautions, PPE & Needle-Stick PEP"}
            {activeMode === "vitals" && "Vital Signs & Clinical Triage: Blood Pressure Physics, Orthostatics, GCS (3-15) & NEWS2"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Clinical Foundation Quiz"}
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
                  Clinical Foundation Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Protocol / Principle: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Communication & SPIKES */}
          {activeMode === "communication" && (
            <div className={styles.fndCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake size={14} /> Medical Interview &amp; Breaking Bad News Matrix
                </span>
                <span className="text-[11px] text-slate-400">SPIKES &bull; Calgary-Cambridge &bull; NURSE Empathy &bull; ICE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">The SPIKES 6-Step Protocol</div>
                  <div className="text-slate-300 mt-1">Setting (privacy/eye-level) &rarr; Perception (explore baseline understanding) &rarr; Invitation (ask detail level) &rarr; Knowledge (clear warning shot and diagnosis) &rarr; Empathy (NURSE validation of emotion) &rarr; Strategy/Summary.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">Calgary-Cambridge &amp; NURSE Mnemonic</div>
                  <div className="text-slate-300 mt-1">Open-to-closed questioning cone exploring Ideas, Concerns, and Expectations (ICE). NURSE skills (Name emotion, Understand reaction, Respect effort, Support presence, Explore worries) strengthen therapeutic alliance.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Medical Ethics & Bioethics */}
          {activeMode === "ethics" && (
            <div className={styles.fndCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Biomedical Ethics Principles &amp; Legal Frameworks
                </span>
                <span className="text-[11px] text-slate-400">Autonomy &bull; Beneficence &bull; Non-Maleficence &bull; Tarasoff</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">Patient Autonomy &amp; Informed Refusal</div>
                  <div className="text-slate-300 mt-1">Autonomy supersedes medical beneficence. A competent adult has the absolute legal right to refuse any medical intervention, including life-saving blood products in Jehovah&apos;s Witnesses or mechanical ventilation.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">Tarasoff Duty &amp; Confidentiality Exceptions</div>
                  <div className="text-slate-300 mt-1">The Tarasoff ruling mandates breaching doctor-patient confidentiality when there is an explicit, credible threat of severe physical harm against an identifiable third party, requiring notification of the victim and police.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Infection Control & Universal Precautions */}
          {activeMode === "infection" && (
            <div className={styles.fndCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Isolation Precautions, PPE &amp; Needle-Stick Protocols
                </span>
                <span className="text-[11px] text-slate-400">Contact &bull; Droplet &bull; Airborne (AIIR) &bull; HIV/HBV PEP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">Transmission Precautions &amp; Hand Hygiene</div>
                  <div className="text-slate-300 mt-1">Contact (Gown/Gloves; C. difficile requires soap and water), Droplet (Surgical Mask for Meningococcus/Flu), Airborne (N95 respirator + Negative-Pressure AIIR room for TB/Measles). WHO 5 Moments protect portals.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">Needle-Stick Injury (NSI) &amp; PEP</div>
                  <div className="text-slate-300 mt-1">Wash immediately with soap and water (do not squeeze). 3-drug HIV PEP (Tenofovir + Emtricitabine + Dolutegravir) must be started within 2 hours (max 72h) for 28 days. Check HBV antibody status (&gt;10 mIU/mL is immune).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Vital Signs & Clinical Triage */}
          {activeMode === "vitals" && (
            <div className={styles.fndCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Vital Signs Standardization &amp; Glasgow Coma Scale
                </span>
                <span className="text-[11px] text-slate-400">Korotkoff BP &bull; Orthostatics &bull; GCS (3-15) &bull; NEWS2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">Blood Pressure Physics &amp; Orthostatics</div>
                  <div className="text-slate-300 mt-1">Cuff bladder width &ge;40% and length &ge;80% arm circumference. Korotkoff I = Systolic, Phase V = Diastolic. Orthostatic hypotension: drop in Systolic &ge;20 mmHg or Diastolic &ge;10 mmHg within 3 minutes standing.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-teal-300 font-bold">Glasgow Coma Scale &amp; Intubation Rule</div>
                  <div className="text-slate-300 mt-1">GCS evaluates Eye Opening (1-4), Verbal Response (1-5), and Motor Response (1-6). Total ranges from 3 to 15. A score &le;8 defines Severe Traumatic Brain Injury requiring immediate endotracheal intubation.</div>
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
                    <span className="text-teal-400 font-bold">Core:</span> {node.clinicalProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Foundation Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Clinical Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Domain / Principle</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Procedural Architecture</div>
            <div className="text-xs text-teal-300 font-semibold">{activeNode.clinicalProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Rules</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Clinical Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("communication")}
          className={`${styles.modeTab} ${activeMode === "communication" ? styles.modeTabActive : ""}`}
        >
          🤝 1. Communication &amp; SPIKES
        </button>
        <button
          onClick={() => setActiveMode("ethics")}
          className={`${styles.modeTab} ${activeMode === "ethics" ? styles.modeTabActive : ""}`}
        >
          ⚖️ 2. Ethics &amp; Autonomy
        </button>
        <button
          onClick={() => setActiveMode("infection")}
          className={`${styles.modeTab} ${activeMode === "infection" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. Infection Control &amp; PPE
        </button>
        <button
          onClick={() => setActiveMode("vitals")}
          className={`${styles.modeTab} ${activeMode === "vitals" ? styles.modeTabActive : ""}`}
        >
          📊 4. Vital Signs &amp; GCS
        </button>
      </div>
    </div>
  );
}
