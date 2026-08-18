"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalInt3LabViewer.module.css";
import {
  Baby,
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
  Wind,
  Zap,
} from "lucide-react";

export type Int3LabMode = "pph" | "nrp" | "pals" | "seizure";

export interface Int3LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const INT3_LAB_NODES: Record<Int3LabMode, Int3LabNode[]> = {
  pph: [
    {
      id: "int3-ob-pph-4ts-atony",
      name: "Postpartum Hemorrhage 4 Ts Framework (Uterine Atony Tone 70-80% & Bimanual Compression)",
      category: "PPH 4 Ts",
      subType: "Tone (Atony 70-80%) • Tissue (Retained Placenta) • Trauma (Lacerations) • Thrombin (DIC)",
      proceduralProfile: "Primary cause of severe maternal obstetric hemorrhage requiring immediate bimanual massage.",
      proceduralMechanism: "Myometrial failure to constrict intramyometrial spiral arterioles leads to torrential blood loss.",
      clinicalHallmarks: "Soft, boggy, poorly contracted uterus extending above the umbilicus; start immediate bimanual uterine compression.",
      highYieldPearls: "Uterine Atony (Tone) causes 70-80% of PPH; physical exam reveals a soft, boggy, poorly contracted uterus."
    },
    {
      id: "int3-ob-uterotonic-escalation-hierarchy",
      name: "Uterotonic Escalation Hierarchy (Oxytocin 1st-Line, Methergine in Normotension & Misoprostol)",
      category: "Uterotonics",
      subType: "Oxytocin 10-40 U IV • Methylergonovine 0.2 mg IM • Misoprostol 800-1,000 mcg PR • TXA 1 g IV",
      proceduralProfile: "Systematic pharmacological step-up to achieve sustained myometrial tone and halt hemorrhage.",
      proceduralMechanism: "Gq-receptor activation, ergot alkaloid stimulation, and prostaglandin receptor binding promote contraction.",
      clinicalHallmarks: "Oxytocin 1st-line infusion; add Methylergonovine 0.2 mg IM (if normotensive) + Misoprostol + TXA 1 g within 3 hours.",
      highYieldPearls: "Oxytocin is first-line; Methylergonovine (0.2 mg IM) is added in normotensive patients; Misoprostol 800-1,000 mcg."
    },
    {
      id: "int3-ob-preeclampsia-eclampsia-mgso4",
      name: "Severe Preeclampsia & Eclampsia Protocols (MgSO4 Seizure Prophylaxis, Toxicity Reflexes & Calcium Gluconate)",
      category: "Hypertensive Crisis",
      subType: "MgSO4 4-6 g IV Load &rarr; 1-2 g/hr • Loss of Patellar Reflexes • Antidote: Calcium Gluconate 1 g IV",
      proceduralProfile: "Emergency neuroprotective and anticonvulsant stabilization in severe gestational hypertension.",
      proceduralMechanism: "Magnesium blocks NMDA receptors and reduces motor end-plate acetylcholine release, terminating cortical seizure spread.",
      clinicalHallmarks: "Loss of deep tendon reflexes (7-10 mEq/L) precedes respiratory arrest (10-13 mEq/L); antidote is Calcium Gluconate 1 g IV.",
      highYieldPearls: "MgSO4 is the drug of choice for eclamptic seizures; loss of patellar reflexes indicates toxicity; treat with Calcium Gluconate."
    },
    {
      id: "int3-ob-uterotonic-contraindications",
      name: "Uterotonic Safety Contraindications (Carboprost Asthma Contraindication & Methergine Hypertension Ban)",
      category: "Safety Protocols",
      subType: "Carboprost (Hemabate) BANNED in Asthma • Methylergonovine (Methergine) BANNED in Hypertension",
      proceduralProfile: "Critical pharmacovigilance rules preventing fatal bronchospasm and cerebrovascular hypertensive crises.",
      proceduralMechanism: "PGF2&alpha; stimulates airway smooth muscle bronchoconstriction; ergot alkaloids cause systemic arterial vasoconstriction.",
      clinicalHallmarks: "NEVER give Carboprost to an asthmatic patient; NEVER give Methylergonovine to a patient with preeclampsia/HTN.",
      highYieldPearls: "Carboprost (Hemabate) is STRICTLY CONTRAINDICATED in asthma; Methylergonovine is STRICTLY CONTRAINDICATED in hypertension."
    }
  ],

  nrp: [
    {
      id: "int3-nr-golden-minute-initial-steps",
      name: "NRP Golden Minute & Initial Assessment (Warm, Dry, Position & 40-60 bpm Positive Pressure Ventilation)",
      category: "Golden Minute",
      subType: "Term? Tone? Breathing? &bull; Warm, Dry, Stimulate, Position &bull; PPV at 40-60 breaths/min for HR <100",
      proceduralProfile: "First 60 seconds of neonatal life deciding whether positive pressure ventilation is required.",
      proceduralMechanism: "Clearance of fetal lung fluid and establishment of functional residual capacity triggers pulmonary vasodilation.",
      clinicalHallmarks: "If apneic, gasping, or HR <100 bpm at 30-60s &rarr; start PPV at 40-60 bpm with 21% O2 (&ge;35w) and pre-ductal SpO2.",
      highYieldPearls: "The Golden Minute: If HR <100 bpm or apneic at 30s &rarr; initiate PPV at 40-60 breaths/min with room air (21% O2 for &ge;35w)."
    },
    {
      id: "int3-nr-mr-sopa-corrective-steps",
      name: "MR SOPA Ventilation Corrective Steps (Mask Adjust, Reposition, Suction, Open Mouth & Pressure Increase)",
      category: "MR SOPA",
      subType: "M: Mask Adjust &bull; R: Reposition &bull; S: Suction &bull; O: Open Mouth &bull; P: Pressure Up &bull; A: Alt Airway",
      proceduralProfile: "Algorithmic trouble-shooting checklist executed whenever PPV fails to produce bilateral chest movement.",
      proceduralMechanism: "Overcomes anatomical and physiological airway obstructions to deliver alveolar tidal volumes.",
      clinicalHallmarks: "Never start chest compressions until effective PPV with visible chest rise has been achieved via MR SOPA.",
      highYieldPearls: "MR SOPA: Mask adjust, Reposition, Suction mouth/nose, Open mouth, Pressure increase (5-10 cm H2O), Alternative airway."
    },
    {
      id: "int3-nr-two-thumb-3to1-compressions",
      name: "Two-Thumb 3:1 Chest Compressions (90 Compressions + 30 Breaths with 100% Oxygen & ETT Intubation)",
      category: "Compressions",
      subType: "HR < 60 bpm despite 30s PPV &bull; 3:1 Ratio (120 events/min) &bull; Two-Thumb Encircling Technique &bull; 100% O2",
      proceduralProfile: "Circulatory resuscitation indicated for profound neonatal bradycardia persisting despite ventilation.",
      proceduralMechanism: "Two-thumb encircling generates higher coronary perfusion pressure than two-finger compression.",
      clinicalHallmarks: "Start 3:1 compressions with 100% O2 only if HR <60 bpm after 30s of effective PPV with chest movement; secure ETT.",
      highYieldPearls: "NRP Compressions: Indicated if HR <60 bpm after 30s PPV; use 3:1 ratio (90 compressions + 30 breaths/min) with 100% O2."
    },
    {
      id: "int3-nr-epinephrine-uvc-medications",
      name: "Neonatal Resuscitation Pharmacotherapy (Umbilical Venous Epinephrine 0.02 mg/kg & Normal Saline Volume)",
      category: "Emergency Drugs",
      subType: "Epinephrine 0.02 mg/kg (0.2 mL/kg of 1:10,000) IV/IO via UVC &bull; Normal Saline 10 mL/kg for Hypovolemia",
      proceduralProfile: "Emergency pharmacological support for persistent bradycardia after 60s of coordinated CPR and PPV.",
      proceduralMechanism: "Alpha-1 adrenoceptor vasoconstriction elevates aortic diastolic pressure, driving coronary perfusion.",
      clinicalHallmarks: "Administer Epinephrine 0.02 mg/kg IV via Umbilical Venous Catheter (UVC); flush with 3 mL NS; re-evaluate HR q60s.",
      highYieldPearls: "NRP Epinephrine dose: 0.02 mg/kg (0.2 mL/kg of 1:10,000) administered IV/IO via Umbilical Venous Catheter."
    }
  ],

  pals: [
    {
      id: "int3-pa-symptomatic-bradycardia-hypoxia",
      name: "Pediatric Symptomatic Bradycardia (Hypoxia Pathophysiology, Ventilation & CPR for HR <60 bpm)",
      category: "PALS Bradycardia",
      subType: "HR < 60 bpm with Poor Perfusion &bull; Hypoxia Cause &bull; Oxygenate/Ventilate &bull; Start CPR if HR <60 persists",
      proceduralProfile: "Most common pediatric pre-arrest rhythm driven by progressive respiratory compromise and hypoxemia.",
      proceduralMechanism: "Severe hypoxia leads to vagal hyperactivity and sinoatrial/atrioventricular nodal hypoperfusion.",
      clinicalHallmarks: "Ventilate first; if HR remains <60 bpm with poor perfusion despite oxygenation/ventilation &rarr; START CHEST COMPRESSIONS.",
      highYieldPearls: "In children, start CPR for HR <60 bpm with signs of poor perfusion persisting despite adequate oxygenation and ventilation."
    },
    {
      id: "int3-pa-pediatric-cardiac-arrest-defibrillation",
      name: "Pediatric Cardiac Arrest & Defibrillation (2 J/kg &rarr; 4 J/kg Energy Escalation & Epinephrine/Amiodarone)",
      category: "Defibrillation",
      subType: "Shockable VF/pVT: 2 J/kg 1st &rarr; 4 J/kg 2nd &rarr; &ge;4 J/kg &bull; Epinephrine 0.01 mg/kg &bull; Amiodarone 5 mg/kg",
      proceduralProfile: "Weight-based defibrillation and antiarrhythmic dosing algorithms for pediatric cardiac arrest.",
      proceduralMechanism: "Electrical depolarization syncs ventricular myocardium; Amiodarone suppresses polymorphic reentry.",
      clinicalHallmarks: "Defibrillate: 2 J/kg &rarr; CPR 2 min &rarr; 4 J/kg &rarr; CPR 2 min + Epinephrine 0.01 mg/kg &rarr; 4 J/kg + Amiodarone 5 mg/kg.",
      highYieldPearls: "PALS Defibrillation: 1st shock 2 J/kg; 2nd shock 4 J/kg; subsequent &ge;4 J/kg (max 10 J/kg); Epinephrine 0.01 mg/kg."
    },
    {
      id: "int3-pa-pediatric-shock-fluid-boluses",
      name: "Pediatric Shock Fluid Resuscitation (20 mL/kg Isotonic Crystalloid Boluses & Hepatomegaly Safety Check)",
      category: "Shock Fluids",
      subType: "20 mL/kg Normal Saline / LR Bolus over 10-20 min &bull; Repeat up to 40-60 mL/kg &bull; Check Liver Edge & Rales",
      proceduralProfile: "Rapid volumetric expansion for pediatric hypovolemic and distributive septic shock.",
      proceduralMechanism: "Restores intravascular effective circulating volume and end-diastolic ventricular filling (preload).",
      clinicalHallmarks: "Give 20 mL/kg isotonic crystalloid over 10-20 min; re-evaluate; STOP immediately if hepatomegaly or crackles appear.",
      highYieldPearls: "Pediatric fluid bolus: 20 mL/kg isotonic crystalloid over 10-20 minutes; monitor liver edge for early fluid overload."
    },
    {
      id: "int3-pa-pediatric-vasopressor-selection",
      name: "Pediatric Inotrope & Vasopressor Hierarchy (Epinephrine Cold Shock Inotropy vs Norepinephrine Warm Shock Vasoconstriction)",
      category: "Pediatric Pressors",
      subType: "Cold Shock (Low CO, High SVR): Epinephrine &bull; Warm Shock (High CO, Low SVR): Norepinephrine",
      proceduralProfile: "Hemodynamic vasoactive agent selection tailored to pediatric septic shock vascular phenotypes.",
      proceduralMechanism: "Epinephrine enhances beta-1 inotropy; Norepinephrine restores systemic vascular resistance via alpha-1 stimulation.",
      clinicalHallmarks: "Cold shock (cold extremities, delayed refill, weak pulses) &rarr; Epinephrine. Warm shock (bounding pulses, flash refill) &rarr; Norepinephrine.",
      highYieldPearls: "Pediatric septic shock: Epinephrine is first-line for cold shock; Norepinephrine is first-line for warm shock."
    }
  ],

  seizure: [
    {
      id: "int3-sz-status-epilepticus-phases",
      name: "Status Epilepticus Time-Sensitive Phases (0-5 min Glucose/ABCs, 5-10 min Benzodiazepines & 10-20 min Keppra)",
      category: "Status Epilepticus",
      subType: "Phase 1 (0-5m): D10W &bull; Phase 2 (5-10m): Lorazepam 0.1 mg/kg &bull; Phase 3 (10-20m): Levetiracetam 60 mg/kg",
      proceduralProfile: "Emergency algorithm for terminating convulsive status epilepticus before excitotoxic neuronal injury occurs.",
      proceduralMechanism: "GABA-A receptor internalizations decrease benzodiazepine responsiveness over time, requiring non-sedating AEDs.",
      clinicalHallmarks: "Phase 1: Check glucose (D10W 2 mL/kg if low). Phase 2: Lorazepam 0.1 mg/kg IV. Phase 3: Levetiracetam 60 mg/kg IV.",
      highYieldPearls: "Status Epilepticus: Phase 1 (0-5m) ABCs/glucose; Phase 2 (5-10m) Lorazepam 0.1 mg/kg; Phase 3 (10-20m) Levetiracetam 60 mg/kg."
    },
    {
      id: "int3-sz-non-iv-benzodiazepine-routes",
      name: "Emergency Non-IV Benzodiazepine Routes (IM/IN Midazolam 0.2 mg/kg & Rectal Diazepam Fast Absorption)",
      category: "Non-IV Anticonvulsants",
      subType: "IM Midazolam 0.2 mg/kg (max 10 mg) &bull; IN Midazolam 0.2 mg/kg &bull; Rectal Diazepam 0.2-0.5 mg/kg",
      proceduralProfile: "Rapid anticonvulsant administration routes when peripheral IV access cannot be immediately established.",
      proceduralMechanism: "Vascular mucosal and muscular capillary beds absorb lipophilic midazolam rapidly into systemic circulation.",
      clinicalHallmarks: "IM Midazolam (0.2 mg/kg) terminates status faster than waiting for IV access (RAMPART clinical trial evidence).",
      highYieldPearls: "When IV access is unavailable in status epilepticus, IM Midazolam (0.2 mg/kg, max 10 mg) is the preferred first-line agent."
    },
    {
      id: "int3-sz-croup-dexamethasone-epinephrine",
      name: "Acute Croup (Laryngotracheobronchitis) (Subglottic Steeple Sign, Dexamethasone 0.6 mg/kg & Racemic Epinephrine)",
      category: "Croup Airway",
      subType: "Parainfluenza &bull; Barking Cough & Inspiratory Stridor &bull; Steeple Sign &bull; Dexamethasone + Racemic Epinephrine",
      proceduralProfile: "Viral subglottic inflammation in young children presenting with characteristic seal-like barking cough.",
      proceduralMechanism: "Corticosteroids reduce subglottic mucosal edema; racemic epinephrine induces mucosal alpha-1 vasoconstriction.",
      clinicalHallmarks: "AP neck X-ray demonstrates subglottic tracheal narrowing (Steeple Sign); treat with oral Dexamethasone 0.6 mg/kg + nebulized Epinephrine.",
      highYieldPearls: "Croup (Steeple Sign on AP X-ray): Treat with single-dose Dexamethasone (0.6 mg/kg) PLUS Nebulized Racemic Epinephrine."
    },
    {
      id: "int3-sz-epiglottitis-safety-or-intubation",
      name: "Acute Epiglottitis Airway Emergency (Thumbprint Sign, Drooling Tripod Stance & NO-AGITATION OR Intubation)",
      category: "Epiglottitis Airway",
      subType: "H. influenzae / Strep &bull; Toxic, High Fever, Drooling, Tripod &bull; Thumbprint Sign &bull; DO NOT AGITATE &bull; OR Intubation",
      proceduralProfile: "Life-threatening supraglottic cellulitis carrying immediate risk of complete fatal airway obstruction.",
      proceduralMechanism: "Bacterial invasion produces massive edematous swelling of the epiglottis and aryepiglottic folds.",
      clinicalHallmarks: "DO NOT agitate the child; DO NOT use a tongue depressor; transfer immediately to the operating room for controlled intubation.",
      highYieldPearls: "Epiglottitis (Thumbprint Sign): DO NOT examine oropharynx with tongue blade; perform emergent OR intubation with ENT present."
    }
  ]
};

interface ClinicalInt3LabViewerProps {
  initialMode?: Int3LabMode;
  height?: string;
  onNodeSelect?: (node: Int3LabNode) => void;
}

export default function ClinicalInt3LabViewer({
  initialMode = "pph",
  height = "560px",
  onNodeSelect,
}: ClinicalInt3LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Int3LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return INT3_LAB_NODES[activeMode] || INT3_LAB_NODES.pph;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Int3LabNode) => {
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
            <Baby size={14} /> INT-503
          </span>
          <span className={styles.titleText}>
            {activeMode === "pph" && "Obstetric Emergencies: Postpartum Hemorrhage (4 Ts & Uterotonics) & Severe Preeclampsia"}
            {activeMode === "nrp" && "Neonatal Resuscitation (NRP 2025): The Golden Minute, MR SOPA Corrective Steps & 3:1 CPR"}
            {activeMode === "pals" && "Pediatric Advanced Life Support (PALS 2025): Bradycardia (HR <60 CPR), Defibrillation & Shock"}
            {activeMode === "seizure" && "Pediatric Status Epilepticus (AES Phases) & Acute Airway Obstruction (Croup vs Epiglottitis)"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Emergency Resuscitation Quiz"}
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
                  Maternal, Neonatal &amp; Pediatric Emergency Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Emergency Protocol: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: PPH & Eclampsia */}
          {activeMode === "pph" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Postpartum Hemorrhage 4 Ts &amp; Eclampsia Protocols
                </span>
                <span className="text-[11px] text-slate-400">Tone Atony 70-80% &bull; Methergine HTN Ban &bull; Carboprost Asthma Ban &bull; MgSO4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">PPH 4 Ts &amp; Uterotonic Escalation</div>
                  <div className="text-slate-300 mt-1">Uterine atony (Tone) causes 70-80% of PPH (soft, boggy uterus). Oxytocin 1st-line. Methylergonovine is STRICTLY CONTRAINDICATED in HTN. Carboprost (Hemabate) is STRICTLY CONTRAINDICATED in ASTHMA. Give TXA 1 g IV within 3h.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Severe Preeclampsia &amp; MgSO4 Seizure Care</div>
                  <div className="text-slate-300 mt-1">MgSO4: 4-6 g IV load over 20 min &rarr; 1-2 g/hr maintenance for 24h. Monitor patellar reflexes; loss of reflexes signals toxicity &rarr; give Calcium Gluconate 1 g IV stat. Treat BP &ge;160/110 with IV Labetalol or Hydralazine.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: NRP 2025 */}
          {activeMode === "nrp" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Baby size={14} /> Neonatal Resuscitation Program (NRP 2025 Golden Minute)
                </span>
                <span className="text-[11px] text-slate-400">PPV 40-60 bpm &bull; MR SOPA &bull; 3:1 Compressions (100% O2) &bull; UVC Epinephrine</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Golden Minute &amp; MR SOPA Corrective Steps</div>
                  <div className="text-slate-300 mt-1">At 30s, if apneic or HR &lt;100 bpm &rarr; start PPV at 40-60 bpm with 21% O2 (&ge;35w). If no chest rise, execute MR SOPA (Mask adjust, Reposition, Suction, Open mouth, Pressure up, Alt airway ETT/LMA).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">3:1 Compressions &amp; Umbilical Epinephrine</div>
                  <div className="text-slate-300 mt-1">If HR &lt;60 bpm persists after 30s of effective PPV with chest rise &rarr; start 3:1 compressions with 100% O2 (90 compressions + 30 breaths/min). If HR &lt;60 persists after 60s &rarr; Epinephrine 0.02 mg/kg IV via UVC.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: PALS 2025 */}
          {activeMode === "pals" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Pediatric Advanced Life Support (PALS 2025 Protocols)
                </span>
                <span className="text-[11px] text-slate-400">Bradycardia HR &lt;60 CPR &bull; Defibrillation 2 &rarr; 4 J/kg &bull; 20 mL/kg Fluid Bolus</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Symptomatic Bradycardia with Poor Perfusion</div>
                  <div className="text-slate-300 mt-1">Hypoxia is the primary cause. Oxygenate and ventilate first. If HR remains &lt;60 bpm with poor perfusion despite adequate ventilation &rarr; START CHEST COMPRESSIONS &rarr; Epinephrine 0.01 mg/kg IV/IO.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Defibrillation &amp; Shock Fluid Resuscitation</div>
                  <div className="text-slate-300 mt-1">Shockable arrest (VF/pVT): 1st shock 2 J/kg &rarr; 2nd shock 4 J/kg &rarr; subsequent &ge;4 J/kg. Shock: 20 mL/kg isotonic crystalloid bolus over 10-20 min; stop if hepatomegaly develops. Epinephrine for cold shock; Norepinephrine for warm shock.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Status Epilepticus & Airway */}
          {activeMode === "seizure" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Status Epilepticus &amp; Pediatric Airway Obstruction
                </span>
                <span className="text-[11px] text-slate-400">0-5m Glucose &bull; 5-10m Lorazepam / IM Midazolam &bull; 10-20m Keppra &bull; Croup vs Epiglottitis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Status Epilepticus Emergency Algorithm</div>
                  <div className="text-slate-300 mt-1">0-5 min: ABCs, check glucose (D10W 2 mL/kg). 5-10 min: Lorazepam 0.1 mg/kg IV (or IM/IN Midazolam 0.2 mg/kg if no IV). 10-20 min: Levetiracetam 60 mg/kg IV (or Fosphenytoin 20 mg PE/kg / Valproate 40 mg/kg).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Croup vs Acute Epiglottitis Airway</div>
                  <div className="text-slate-300 mt-1">Croup: Barking cough, steeple sign &rarr; Dexamethasone 0.6 mg/kg + Racemic Epinephrine. Epiglottitis: Toxic, drooling, tripod, thumbprint sign &rarr; DO NOT AGITATE, NO TONGUE BLADE &rarr; emergent OR intubation.</div>
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
                    <span>Inspect Emergency Station</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Emergency Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Emergency Station Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
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
            <div className="text-xs text-rose-300 font-semibold">{activeNode.proceduralProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Actions</div>
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
          onClick={() => setActiveMode("pph")}
          className={`${styles.modeTab} ${activeMode === "pph" ? styles.modeTabActive : ""}`}
        >
          🩸 1. PPH &amp; Eclampsia
        </button>
        <button
          onClick={() => setActiveMode("nrp")}
          className={`${styles.modeTab} ${activeMode === "nrp" ? styles.modeTabActive : ""}`}
        >
          👶 2. Neonatal NRP 2025
        </button>
        <button
          onClick={() => setActiveMode("pals")}
          className={`${styles.modeTab} ${activeMode === "pals" ? styles.modeTabActive : ""}`}
        >
          ❤️ 3. Pediatric PALS 2025
        </button>
        <button
          onClick={() => setActiveMode("seizure")}
          className={`${styles.modeTab} ${activeMode === "seizure" ? styles.modeTabActive : ""}`}
        >
          🧠 4. Seizures &amp; Airway
        </button>
      </div>
    </div>
  );
}
