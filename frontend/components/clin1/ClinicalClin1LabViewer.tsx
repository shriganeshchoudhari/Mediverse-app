"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalClin1LabViewer.module.css";
import {
  Stethoscope,
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
  Activity,
  ClipboardList,
} from "lucide-react";

export type Clin1LabMode = "rounds" | "cardio" | "pulmAbdNeuro" | "fluids";

export interface Clin1LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const CLIN1_LAB_NODES: Record<Clin1LabMode, Clin1LabNode[]> = {
  rounds: [
    {
      id: "clin1-rd-morning-case-presentation",
      name: "Morning Case Presentation Sequence (One-Liner Summary, Overnight Trajectory & 24h Hemodynamics)",
      category: "Inpatient Presentation",
      subType: "One-Liner Identifier • Overnight Nursing Events • 24h Vital Ranges & Strict I/Os • Problem-Based Synthesis",
      clinicalProfile: "Standardized structure for morning inpatient case presentations to attending physicians.",
      proceduralMechanism: "Succinctly synthesizes 24h vitals, strict intake/outputs, lab trends, and active problem-based plans.",
      clinicalHallmarks: "Opens with age/hospital day/diagnosis &rarr; overnight events &rarr; 24h vitals/net I/Os &rarr; focused exam &rarr; system plan.",
      highYieldPearls: "Morning rounds require presenting 24-hour vital ranges, strict I/Os, daily weight trends, and problem-based plans."
    },
    {
      id: "clin1-rd-problem-based-soap-note",
      name: "Problem-Based SOAP Progress Note (Subjective Trajectory, Strict I/Os, Assessment & Systems Plan)",
      category: "Clinical Documentation",
      subType: "S (Subjective / Functional) • O (Objective Vitals / Labs / I/Os) • A (Trajectory) • P (Problem List & Prophylaxis)",
      clinicalProfile: "Daily legal and medical communication progress note documenting inpatient clinical care.",
      proceduralMechanism: "Organizes daily care into Subjective, Objective, Assessment, and prioritized Problem/System Plan.",
      clinicalHallmarks: "Always includes DVT prophylaxis (Enoxaparin/Heparin), GI prophylaxis, line reconciliation, and discharge plan.",
      highYieldPearls: "The SOAP note must include daily fluid balance (I/Os), active problem lists, DVT prophylaxis, and disposition barriers."
    },
    {
      id: "clin1-rd-inpatient-med-reconciliation",
      name: "Inpatient Medication Reconciliation (Home Regimens, Inpatient Adjustments & High-Risk Discharges)",
      category: "Medication Safety",
      subType: "Admission Med Rec • Inpatient Dose Holds / Titrations • Discharge Med Summary • High-Risk Drug Counseling",
      clinicalProfile: "Systematic comparison of home medications with active inpatient orders to eliminate omissions and errors.",
      proceduralMechanism: "Identifies held home antihypertensives, anticoagulants, or diabetes regimens requiring safe discharge restart.",
      clinicalHallmarks: "Prevents duplicate therapies, accidental drug discontinuations, and lethal drug-drug interaction discharges.",
      highYieldPearls: "Medication reconciliation at admission and discharge prevents post-hospitalization adverse drug events."
    },
    {
      id: "clin1-rd-discharge-safety-netting",
      name: "Discharge Planning & Safety Netting (Diagnostic Tracking, Follow-Up Timelines & Red Flag Warnings)",
      category: "Care Transitions",
      subType: "Pending Culture Tracking • Outpatient Specialist Appointments • Red Flag Warning Signs • Teach-Back",
      clinicalProfile: "Multi-step discharge protocol ensuring safe transition from hospital to outpatient care.",
      proceduralMechanism: "Establishes pending test tracking systems, early 7-day follow-up visits, and clear return-to-ED precautions.",
      clinicalHallmarks: "Uses teach-back verification to ensure the patient understands new medications and red flag symptoms.",
      highYieldPearls: "Discharge planning must identify pending lab/culture results and provide explicit red flag return precautions."
    }
  ],

  cardio: [
    {
      id: "clin1-cd-jvp-waveform-morphology",
      name: "JVP Waveform Morphology (Cannon a Waves, Holosystolic v Waves & Friedreich Steep y Descents)",
      category: "Jugular Venous Physics",
      subType: "a Wave (Atrial Kick) • c Wave (Tricuspid Bulge) • x Descent • v Wave (Filling) • y Descent (Rapid Emptying)",
      clinicalProfile: "Inspection of internal jugular venous pulsations reflecting right atrial and central venous pressures.",
      proceduralMechanism: "Cannon a waves occur with AV dissociation; giant v waves with severe TR; steep y descents with constrictive pericarditis.",
      clinicalHallmarks: "Measured at 45&deg; angle; normal JVP is &le;3 cm above sternal angle of Louis (&le;8 cm H2O total).",
      highYieldPearls: "Cannon a waves = AV dissociation/VT; Giant v waves = Tricuspid Regurgitation; Steep y descent = Constrictive Pericarditis."
    },
    {
      id: "clin1-cd-kussmaul-paradoxical-sign",
      name: "Kussmaul Paradoxical Sign (Inspiratory JVP Elevation in Constrictive Pericarditis & RV Infarction)",
      category: "Pericardial / RV Physics",
      subType: "Normal Inspiratory Drop vs Paradoxical Inspiratory JVP Elevation • Constrictive Pericarditis • RV Infarction",
      clinicalProfile: "Paradoxical rise or lack of normal fall in jugular venous pressure during deep inspiration.",
      proceduralMechanism: "Rigid non-compliant pericardium or RV failure prevents right ventricular accommodation of inspiratory venous return.",
      clinicalHallmarks: "Classic in Constrictive Pericarditis and RV Myocardial Infarction; absent in pure uncomplicated cardiac tamponade.",
      highYieldPearls: "Kussmaul sign is an inspiratory RISE in JVP, classically seen in Constrictive Pericarditis and RV Infarction."
    },
    {
      id: "clin1-cd-hepatojugular-reflux-test",
      name: "Hepatojugular Reflux Maneuver (Right Upper Quadrant Compression & Central Venous Congestion)",
      category: "Hemodynamic Maneuvers",
      subType: "RUQ Compression (15 Seconds) • Sustained &ge;3 cm JVP Elevation • Right Heart Failure & Fluid Overload",
      clinicalProfile: "Bedside physical exam test detecting subclinical right ventricular congestion and elevated filling pressures.",
      proceduralMechanism: "Firm sustained compression over the liver mobilizes venous blood; failing RV cannot accommodate the increased venous return.",
      clinicalHallmarks: "Positive if JVP remains elevated by &ge;3 cm for the entire 15 seconds of compression.",
      highYieldPearls: "A positive hepatojugular reflux is a sustained &ge;3 cm rise in JVP for &ge;15s during firm RUQ compression."
    },
    {
      id: "clin1-cd-pulsus-paradoxus-sphygmomanometry",
      name: "Pulsus Paradoxus Sphygmomanometry (Inspiratory Systolic Drop >10 mmHg in Cardiac Tamponade)",
      category: "Arterial Hemodynamics",
      subType: "Inspiratory Systolic BP Drop > 10 mmHg • Ventricular Interdependence • Cardiac Tamponade • Severe Asthma",
      clinicalProfile: "Exaggerated physiological decrease in arterial systolic blood pressure during normal inspiration.",
      proceduralMechanism: "Inspiration expands RV within tense pericardium, shifting interventricular septum leftward and reducing LV stroke volume.",
      clinicalHallmarks: "Measured by cuff deflation: difference between systolic sounds during expiration only vs throughout respiration >10 mmHg.",
      highYieldPearls: "Pulsus paradoxus is a >10 mmHg drop in systolic BP during inspiration, pathognomonic for Cardiac Tamponade."
    }
  ],

  pulmAbdNeuro: [
    {
      id: "clin1-pan-pulmonary-exam-fremitus-egophony",
      name: "Pulmonary Physical Examination (Tactile Fremitus, Stony Dullness, Egophony & Bronchial Sounds)",
      category: "Pulmonary Examination",
      subType: "Tactile Fremitus (&uarr; in Consolidation, &darr; in Effusion) • Stony Dullness • Egophony ('E' to 'A') • Pectoriloquy",
      clinicalProfile: "Acoustic and tactile bedside assessment differentiating solid lung consolidation from pleural fluid.",
      proceduralMechanism: "Solid consolidated lung tissue conducts high-frequency sound vibrations faster and clearer than air or pleural fluid.",
      clinicalHallmarks: "Consolidation: &uarr; fremitus, dullness, bronchial sounds, egophony. Effusion: &darr; fremitus, stony dullness, absent sounds.",
      highYieldPearls: "Tactile fremitus is INCREASED in consolidation (pneumonia) but DECREASED in pleural effusion and pneumothorax."
    },
    {
      id: "clin1-pan-ascites-shifting-dullness-fluid-wave",
      name: "Peritoneal Ascites Maneuvers (Shifting Dullness >1,500 mL & Dynamic Fluid Wave Transmission)",
      category: "Abdominal Signs",
      subType: "Shifting Dullness (>1,500 mL Free Fluid) • Fluid Wave (>2,000 mL) • Flank Dullness • Portal Hypertension",
      clinicalProfile: "Bedside physical examination maneuvers detecting free intraperitoneal peritoneal fluid collection.",
      proceduralMechanism: "Free fluid pools gravitationally in dependent flanks; repositioning shifts fluid dullness while air-filled bowel floats up.",
      clinicalHallmarks: "Shifting dullness is more sensitive (>1,500 mL); fluid wave requires an assistant's hand on the midline (>2,000 mL).",
      highYieldPearls: "Shifting dullness detects >1,500 mL of ascites; fluid wave detects >2,000 mL of tense ascites."
    },
    {
      id: "clin1-pan-asterixis-toxic-metabolic-flapping",
      name: "Asterixis Toxic-Metabolic Flapping (Sudden Brief Postural Tone Loss in Hepatic Failure & Uremia)",
      category: "Metabolic Neuro Signs",
      subType: "Negative Myoclonus • Outstretched Wrists Dorsiflexed • Hepatic Encephalopathy • Uremia • CO2 Retention",
      clinicalProfile: "Involuntary, rhythmic, intermittent lapses of posture during sustained dorsiflexion of hands and wrists.",
      proceduralMechanism: "Toxic-metabolic impairment of diencephalic motor tone regulation causes sudden intermittent loss of muscular contraction.",
      clinicalHallmarks: "Seen in Hepatic Encephalopathy (elevated ammonia), Uremic Encephalopathy (severe azotemia), and severe CO2 retention.",
      highYieldPearls: "Asterixis ('flapping tremor') is a negative myoclonus seen in Hepatic Encephalopathy, Uremia, and Hypercapnia."
    },
    {
      id: "clin1-pan-peritoneal-neuromuscular-signs",
      name: "Peritoneal & Neuromuscular Signs (Involuntary Guarding, Rebound Tenderness & Sustained Ankle Clonus)",
      category: "Acute Abdomen & UMN",
      subType: "Involuntary Board-Like Rigidity • Rebound Tenderness (Blumberg) • Murphy Sign • Sustained Clonus (&ge;5 Beats)",
      clinicalProfile: "Critical bedside signs indicating surgical peritonitis or upper motor neuron disinhibition.",
      proceduralMechanism: "Parietal peritoneal inflammation triggers involuntary abdominal wall reflex spasm; UMN injury causes hyperreflexic clonus.",
      clinicalHallmarks: "Involuntary rigidity persists despite distraction; sustained clonus (&ge;5 beats) confirms UMN disease or Serotonin Syndrome.",
      highYieldPearls: "Involuntary guarding and rebound tenderness indicate acute peritonitis; sustained clonus indicates UMN lesions."
    }
  ],

  fluids: [
    {
      id: "clin1-fl-holiday-segar-maintenance-fluids",
      name: "Holiday-Segar 4-2-1 Fluid Physics (Weight-Based Maintenance Crystalloid Prescribing & Tonicity)",
      category: "Maintenance Hydration",
      subType: "4-2-1 Rule (100/50/20 mL/kg/day) • Weight + 40 mL/hr Rule • Basal Water & Electrolyte Requirements",
      clinicalProfile: "Physiological formula for calculating basal maintenance water and electrolyte requirements in NPO patients.",
      proceduralMechanism: "1st 10 kg: 4 mL/kg/hr; 2nd 10 kg: 2 mL/kg/hr; each kg above 20 kg: 1 mL/kg/hr (70 kg adult = 70 + 40 = 110 mL/hr).",
      clinicalHallmarks: "Add 20 mEq/L KCl to maintenance fluids if renal function and urine output are adequate.",
      highYieldPearls: "Standard adult maintenance fluid rate is Weight (kg) + 40 mL/hr (e.g. 70 kg = 110 mL/hr) via the 4-2-1 rule."
    },
    {
      id: "clin1-fl-normal-saline-balanced-crystalloids",
      name: "Normal Saline vs Balanced Crystalloids (Supraphysiological Chloride vs Physiological Buffering)",
      category: "Crystalloid Selection",
      subType: "0.9% NaCl (154 mEq/L Na & Cl) • Hyperchloremic Metabolic Acidosis • Lactated Ringer's / Plasma-Lyte",
      clinicalProfile: "Comparison of crystalloid fluid compositions and their pathophysiological acid-base consequences.",
      proceduralMechanism: "0.9% Saline has supraphysiological chloride (154 mEq/L), causing renal vasoconstriction and non-anion gap metabolic acidosis.",
      clinicalHallmarks: "Balanced crystalloids (Lactated Ringer's, Plasma-Lyte) have lower chloride (109 mEq/L) and physiological buffer anions.",
      highYieldPearls: "High-volume 0.9% Normal Saline causes Hyperchloremic Metabolic Acidosis; balanced crystalloids prevent AKI."
    },
    {
      id: "clin1-fl-hyponatremia-correction-limits",
      name: "Hyponatremia Correction Constraints (6-8 mEq/L/24h Limit & Osmotic Demyelination Syndrome Prevention)",
      category: "Electrolyte Velocity",
      subType: "Chronic Hyponatremia (>48h) • Safe Correction Limit (6-8 mEq/L in 24h) • 3% Hypertonic Saline • ODS / CPM",
      clinicalProfile: "Strict velocity constraints when correcting chronic serum sodium to prevent fatal brainstem demyelination.",
      proceduralMechanism: "Rapid sodium elevation draws water out of brain cells, causing oligodendrocyte shrinkage and central pontine myelinolysis.",
      clinicalHallmarks: "For severe acute symptomatic hyponatremia (seizures), give 100 mL boluses of 3% Hypertonic Saline to raise Na by 4-6 mEq/L.",
      highYieldPearls: "Never correct chronic hyponatremia faster than 6-8 mEq/L in 24 hours to prevent Osmotic Demyelination Syndrome."
    },
    {
      id: "clin1-fl-emergency-hyperkalemia-3step-protocol",
      name: "Emergency Hyperkalemia 3-Step Protocol (Membrane Calcium Stabilization, Insulin Shift & Elimination)",
      category: "Cardiac Emergency",
      subType: "Step 1: IV Calcium Gluconate (10%) • Step 2: Regular Insulin + D50W • Step 3: Lokelma / Furosemide / Dialysis",
      clinicalProfile: "Standardized 3-step resuscitation protocol for life-threatening hyperkalemia with ECG changes.",
      proceduralMechanism: "Calcium immediately stabilizes cardiac myocyte resting potential; insulin shifts K+ intracellularly; binders/dialysis eliminate K+.",
      clinicalHallmarks: "Peaked T waves &rarr; widened QRS &rarr; sine wave &rarr; VFib/asystole. Calcium does NOT lower potassium levels.",
      highYieldPearls: "Step 1: IV Calcium Gluconate (membrane stabilization); Step 2: Insulin + D50W (intracellular shift); Step 3: Dialysis/binders."
    }
  ]
};

interface ClinicalClin1LabViewerProps {
  initialMode?: Clin1LabMode;
  height?: string;
  onNodeSelect?: (node: Clin1LabNode) => void;
}

export default function ClinicalClin1LabViewer({
  initialMode = "rounds",
  height = "560px",
  onNodeSelect,
}: ClinicalClin1LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Clin1LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return CLIN1_LAB_NODES[activeMode] || CLIN1_LAB_NODES.rounds;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Clin1LabNode) => {
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
            <Stethoscope size={14} /> CLIN-201
          </span>
          <span className={styles.titleText}>
            {activeMode === "rounds" && "Inpatient Ward Rounds & SOAP Documentation: Case Presentation & Progress Notes"}
            {activeMode === "cardio" && "Bedside Cardiovascular Signs: JVP Waveforms, Kussmaul Sign & Pulsus Paradoxus"}
            {activeMode === "pulmAbdNeuro" && "Bedside Physical Signs: Tactile Fremitus, Egophony, Ascites & Asterixis"}
            {activeMode === "fluids" && "Inpatient Fluid & Electrolyte Resuscitation: Holiday-Segar Rule & Hyperkalemia"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Clinical Postings Quiz"}
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
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Bedside Clinical Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Inpatient Maneuver / Sign: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-emerald-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-emerald-950 text-xs rounded border border-emerald-700 text-emerald-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Ward Rounds & SOAP */}
          {activeMode === "rounds" && (
            <div className={styles.clinCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList size={14} /> Inpatient Presentation Architecture &amp; SOAP Progress Notes
                </span>
                <span className="text-[11px] text-slate-400">One-Liner &bull; 24h Vitals &bull; Net I/Os &bull; Systems Plan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Morning Case Presentation Sequence</div>
                  <div className="text-slate-300 mt-1">One-liner identifier &rarr; overnight events/PRNs &rarr; 24-hour vital ranges (Tmax, BP/HR/RR ranges, strict net I/Os) &rarr; focused physical exam &rarr; lab/imaging trends &rarr; problem-based plan.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">SOAP Progress Note Architecture</div>
                  <div className="text-slate-300 mt-1">S (Subjective trajectory, functional status) &rarr; O (24h vitals, strict I/Os, exam, labs) &rarr; A (Clinical trajectory synthesis) &rarr; P (Problem-based plan, lines, DVT/GI prophylaxis, disposition).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Bedside Cardiovascular Signs */}
          {activeMode === "cardio" && (
            <div className={styles.clinCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> JVP Waveform Dynamics &amp; Pulsus Paradoxus Physics
                </span>
                <span className="text-[11px] text-slate-400">Cannon a Waves &bull; Giant v Waves &bull; Kussmaul Sign &bull; Tamponade</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">JVP Waveform Interpretation</div>
                  <div className="text-slate-300 mt-1">a wave (atrial kick; cannon a waves in AV dissociation); v wave (atrial filling; giant holosystolic v wave in TR); steep y descent in Constrictive Pericarditis vs blunted y descent in Cardiac Tamponade.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Kussmaul Sign &amp; Pulsus Paradoxus</div>
                  <div className="text-slate-300 mt-1">Kussmaul sign: Paradoxical inspiratory rise in JVP (Constrictive Pericarditis, RV Infarction). Pulsus Paradoxus: Drop in SBP &gt;10 mmHg during inspiration (Cardiac Tamponade, severe asthma).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Bedside Pulmonary, Abdominal & Neuro */}
          {activeMode === "pulmAbdNeuro" && (
            <div className={styles.clinCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Pulmonary Consolidation, Ascites &amp; Asterixis Signs
                </span>
                <span className="text-[11px] text-slate-400">Fremitus &bull; Stony Dullness &bull; Shifting Dullness &bull; Asterixis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Consolidation vs Pleural Effusion</div>
                  <div className="text-slate-300 mt-1">Consolidation (Pneumonia): Increased tactile fremitus, dullness, bronchial breath sounds, egophony ('E' to 'A'). Pleural Effusion: Decreased tactile fremitus, stony dullness, absent breath sounds.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Ascites &amp; Asterixis Flapping Tremor</div>
                  <div className="text-slate-300 mt-1">Shifting dullness detects &gt;1,500 mL ascites; fluid wave detects &gt;2,000 mL. Asterixis (negative myoclonus of outstretched wrists) is pathognomonic for Hepatic Encephalopathy, Uremia, and CO2 retention.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Fluid & Electrolyte Emergency */}
          {activeMode === "fluids" && (
            <div className={styles.clinCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Maintenance Crystalloids &amp; Emergency Electrolytes
                </span>
                <span className="text-[11px] text-slate-400">Holiday-Segar 4-2-1 &bull; Hyponatremia ODS &bull; Hyperkalemia Calcium</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Holiday-Segar Rule &amp; Crystalloid Selection</div>
                  <div className="text-slate-300 mt-1">Adult maintenance: Weight (kg) + 40 mL/hr (70 kg = 110 mL/hr). High-volume 0.9% Normal Saline (154 mEq/L Cl) causes hyperchloremic non-anion gap metabolic acidosis; prefer balanced crystalloids.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Hyponatremia &amp; Hyperkalemia Algorithms</div>
                  <div className="text-slate-300 mt-1">Hyponatremia correction limit: &le;6-8 mEq/L in 24h to prevent Osmotic Demyelination Syndrome (ODS). Severe Hyperkalemia: Step 1 = IV Calcium Gluconate (stabilize membrane); Step 2 = Insulin/D50W; Step 3 = Dialysis.</div>
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
                    <span className="text-emerald-400 font-bold">Clinical:</span> {node.clinicalProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Bedside Maneuver</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Postings Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Bedside Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Maneuver / Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Physiological Mechanism</div>
            <div className="text-xs text-emerald-300 font-semibold">{activeNode.clinicalProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Maneuvers</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Inpatient Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("rounds")}
          className={`${styles.modeTab} ${activeMode === "rounds" ? styles.modeTabActive : ""}`}
        >
          📋 1. Ward Rounds &amp; SOAP
        </button>
        <button
          onClick={() => setActiveMode("cardio")}
          className={`${styles.modeTab} ${activeMode === "cardio" ? styles.modeTabActive : ""}`}
        >
          ❤️ 2. Bedside Cardio &amp; JVP
        </button>
        <button
          onClick={() => setActiveMode("pulmAbdNeuro")}
          className={`${styles.modeTab} ${activeMode === "pulmAbdNeuro" ? styles.modeTabActive : ""}`}
        >
          🩺 3. Pulmonary, Abd &amp; Neuro
        </button>
        <button
          onClick={() => setActiveMode("fluids")}
          className={`${styles.modeTab} ${activeMode === "fluids" ? styles.modeTabActive : ""}`}
        >
          💧 4. Fluids &amp; Electrolytes
        </button>
      </div>
    </div>
  );
}
