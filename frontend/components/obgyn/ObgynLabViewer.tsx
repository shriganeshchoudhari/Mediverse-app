"use client";

import React, { useState, useMemo } from "react";
import styles from "./ObgynLabViewer.module.css";
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
  Baby,
  Stethoscope,
} from "lucide-react";

export type ObgynLabMode = "partogram" | "pph" | "preeclampsia" | "ctgEmergencies";

export interface ObgynLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalAlgorithm: string;
  diagnosticCriteria: string;
  obstetricManagement: string;
  highYieldPearl: string;
}

export const OBGYN_NODES: Record<ObgynLabMode, ObgynLabNode[]> = {
  partogram: [
    {
      id: "cardinal-movements",
      name: "1. Cardinal Movements of Normal Labor (LOA)",
      category: "Labor & Delivery Mechanics",
      subType: "Engagement • Descent • Flexion • Internal Rotation • Extension • Restitution • External Rotation",
      clinicalAlgorithm: "Engagement at Station 0 (ischial spines) -> Flexion (suboccipitobregmatic 9.5 cm) -> Extension beneath pubic arch -> Restitution & Expulsion.",
      diagnosticCriteria: "Onset of regular painful uterine contractions with progressive cervical effacement and dilation in vertex presentation.",
      obstetricManagement: "Continuous maternal-fetal monitoring; active management of the third stage of labor (AMTSL: Oxytocin 10 IU IM + controlled cord traction).",
      highYieldPearl: "Engagement occurs when the biparietal diameter (9.5 cm) passes through the pelvic inlet, corresponding to Station 0 at the level of the ischial spines."
    },
    {
      id: "who-partograph",
      name: "2. Modified WHO Partograph: Alert vs Action Lines",
      category: "Intrapartum Monitoring",
      subType: "Active Phase (>= 5 cm) • 1.0 cm/h Dilation • CPD Detection",
      clinicalAlgorithm: "Plotting starts at 5 cm dilation. Normal dilation stays to left of Alert Line. Reaching Action Line (4h delay) -> Emergency Cesarean Section.",
      diagnosticCriteria: "Protracted active phase: dilation < 1.0 cm/h; Arrest of dilation: no cervical change for >= 4 hours with adequate contractions or >= 6 hours with oxytocin.",
      obstetricManagement: "Alert Line crossed -> Amniotomy +/- Oxytocin augmentation if contractions inadequate; Action Line reached -> Immediate Cesarean Delivery for CPD.",
      highYieldPearl: "Oxytocin augmentation is strictly contraindicated in obstructed labor / cephalopelvic disproportion due to the imminent risk of uterine rupture."
    }
  ],

  pph: [
    {
      id: "pph-4ts-atony",
      name: "1. Postpartum Hemorrhage & The 4Ts Framework",
      category: "Obstetric Hemorrhage",
      subType: "Tone (Atony 80%) • Trauma (20%) • Tissue (10%) • Thrombin (1%)",
      clinicalAlgorithm: "Blood loss >= 500 mL (vaginal) or >= 1000 mL (c-section) -> Uterine fundal massage + Stepwise Uterotonic Cascade + Tranexamic Acid (TXA 1g).",
      diagnosticCriteria: "Uterine Atony: Soft, boggy, enlarged uterus above umbilicus with continuous dark red bleeding. Trauma: Firm uterus with bright red bleeding.",
      obstetricManagement: "1. Oxytocin -> 2. Ergometrine (avoid in HTN) -> 3. Carboprost (avoid in Asthma) -> 4. Misoprostol -> 5. Bakri Balloon / B-Lynch suture.",
      highYieldPearl: "Methylergonovine is strictly contraindicated in preeclampsia/hypertension (hypertensive crisis risk); Carboprost is contraindicated in asthma (bronchospasm risk)."
    },
    {
      id: "mechanical-surgical-tamponade",
      name: "2. Mechanical Balloon Tamponade (Bakri) & B-Lynch Suture",
      category: "Refractory PPH Management",
      subType: "Bakri Balloon (300-500 mL) • B-Lynch Brace Suture • Hysterectomy",
      clinicalAlgorithm: "Medical uterotonics fail -> Intrauterine Bakri Balloon Tamponade -> Laparotomy B-Lynch suture -> Internal Iliac ligation -> Peripartum Hysterectomy.",
      diagnosticCriteria: "Ongoing severe uterine bleeding despite maximal pharmacological uterotonics with evolving hemorrhagic shock.",
      obstetricManagement: "Bakri balloon inflated with 300-500 mL sterile saline; B-Lynch brace compression suture compressing anterior and posterior uterine walls.",
      highYieldPearl: "A positive 'tamponade test' (cessation of bleeding after Bakri balloon inflation) avoids the necessity of an emergency peripartum hysterectomy."
    }
  ],

  preeclampsia: [
    {
      id: "preeclampsia-severe-features",
      name: "1. Preeclampsia with Severe Features & HELLP",
      category: "Hypertensive Disorders of Pregnancy",
      subType: "BP >= 160/110 • Thrombocytopenia • Elevated LFTs • Pulmonary Edema",
      clinicalAlgorithm: "BP >= 160/110 or severe features -> Immediate IV Labetalol / Hydralazine + IV MgSO4 seizure prophylaxis + Delivery at 34 weeks.",
      diagnosticCriteria: "HELLP syndrome: Hemolysis (schistocytes, LDH > 600 U/L) + Elevated Liver transaminases (AST/ALT >= 2x) + Low Platelets (< 100,000/uL).",
      obstetricManagement: "IV Labetalol (20-80 mg) or IV Hydralazine (5-10 mg); IV Magnesium Sulfate 4-6 g loading dose followed by 1-2 g/h continuous infusion.",
      highYieldPearl: "ACE inhibitors and ARBs are strictly contraindicated in all trimesters of pregnancy due to fetal renal dysgenesis and oligohydramnios sequence."
    },
    {
      id: "mgso4-toxicity-calcium",
      name: "2. Magnesium Sulfate (MgSO4) Dosing & Toxicity Monitor",
      category: "Obstetric Critical Care",
      subType: "Therapeutic Window (4-7 mEq/L) • Patellar Reflex Loss • Calcium Antidote",
      clinicalAlgorithm: "Zuspan: 4-6 g IV loading over 20 min -> 1-2 g/h maintenance. Monitor patellar reflexes, respiratory rate >= 12, and urine output >= 25 mL/h.",
      diagnosticCriteria: "Toxicity levels: Reflex loss at 8-10 mEq/L; Respiratory depression at > 12 mEq/L; Cardiac arrest at > 15 mEq/L.",
      obstetricManagement: "Toxicity management: Stop MgSO4 infusion immediately and administer IV Calcium Gluconate 10% (10 mL slow IV over 3-5 minutes).",
      highYieldPearl: "Loss of the deep tendon (patellar) reflex is the earliest and most reliable clinical warning sign of impending magnesium toxicity."
    }
  ],

  ctgEmergencies: [
    {
      id: "ctg-deceleration-classifier",
      name: "1. CTG Deceleration Patterns: Early, Late & Variable",
      category: "Fetal Heart Rate Monitoring",
      subType: "Head Compression vs Uteroplacental Hypoxia vs Cord Compression",
      clinicalAlgorithm: "Early (nadir matches contraction peak) = Benign head compression. Late (nadir after peak) = Fetal hypoxia -> Urgent Intrauterine Resuscitation.",
      diagnosticCriteria: "Variable decelerations (abrupt 'V' shape) = Umbilical cord compression. Sinusoidal pattern = Severe fetal anemia / terminal hypoxia.",
      obstetricManagement: "Late decelerations: Turn to Left Lateral position, IV fluid bolus, 100% O2, stop oxytocin; prepare for emergency cesarean if non-reassuring.",
      highYieldPearl: "Late decelerations reflect uteroplacental insufficiency and fetal myocardial hypoxia, mandating immediate intrauterine resuscitation."
    },
    {
      id: "antepartum-hemorrhage-aph",
      name: "2. Antepartum Hemorrhage: Placenta Previa vs Abruption",
      category: "Obstetric Emergencies",
      subType: "Painless Bright Red (Previa) vs Painful Woody Tense Uterus (Abruptio)",
      clinicalAlgorithm: "Previa: Painless bleeding, soft non-tender uterus -> TVUS gold standard (NO digital exam!). Abruption: Painful bleeding, hard woody uterus -> Emergency delivery.",
      diagnosticCriteria: "Placental abruption triggers massive release of decidual tissue factor, leading to acute consumptive coagulopathy and DIC.",
      obstetricManagement: "Placenta Previa: Planned Cesarean Section at 36-37 weeks; Placental Abruption: Immediate emergency Cesarean delivery if maternal/fetal distress.",
      highYieldPearl: "Digital vaginal examination is strictly contraindicated in third-trimester bleeding until placenta previa is definitively excluded by ultrasound."
    }
  ]
};

interface ObgynLabViewerProps {
  initialMode?: ObgynLabMode;
  height?: string;
  onNodeSelect?: (node: ObgynLabNode) => void;
}

export default function ObgynLabViewer({
  initialMode = "partogram",
  height = "560px",
  onNodeSelect,
}: ObgynLabViewerProps) {
  const [activeMode, setActiveMode] = useState<ObgynLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Partogram State Sliders
  const [elapsedHours, setElapsedHours] = useState<number>(4); // hours in active phase
  const [cervicalDilationCm, setCervicalDilationCm] = useState<number>(6); // cm

  // PPH State Sliders & Comorbidities
  const [pphBloodLossMl, setPphBloodLossMl] = useState<number>(850); // mL
  const [hasHypertension, setHasHypertension] = useState<boolean>(true);
  const [hasAsthma, setHasAsthma] = useState<boolean>(false);

  // MgSO4 Toxicity Slider
  const [serumMgLevel, setSerumMgLevel] = useState<number>(5.5); // mEq/L

  // CTG Pattern State
  const [selectedCtgPattern, setSelectedCtgPattern] = useState<"early" | "late" | "variable" | "sinusoidal">("late");

  // Partogram Calculations
  const partogramStatus = useMemo(() => {
    const alertDilation = Math.min(10, 5 + elapsedHours * 1.0);
    const actionDilation = Math.min(10, Math.max(5, 5 + (elapsedHours - 4) * 1.0));

    if (cervicalDilationCm >= alertDilation) {
      return { status: "Normal Labor Progression", color: "text-emerald-400", action: "Continue routine partographic observation" };
    } else if (elapsedHours >= 4 && cervicalDilationCm <= actionDilation) {
      return { status: "Action Line Reached / Crossed (Obstructed Labor)", color: "text-rose-400 font-bold", action: "Immediate Emergency Cesarean Delivery for CPD!" };
    }
    return { status: "Alert Line Crossed (Protracted Active Phase)", color: "text-amber-400", action: "Assess contractions; consider amniotomy +/- oxytocin" };
  }, [elapsedHours, cervicalDilationCm]);

  // MgSO4 Toxicity Safety Staging
  const mgToxicityStaging = useMemo(() => {
    if (serumMgLevel < 4.0) {
      return { stage: "Subtherapeutic", color: "text-amber-300", reflex: "Normal (+2)", action: "Increase maintenance infusion rate" };
    } else if (serumMgLevel <= 7.0) {
      return { stage: "Therapeutic Seizure Prophylaxis", color: "text-emerald-400", reflex: "Normal (+2)", action: "Continue maintenance protocol; monitor vitals" };
    } else if (serumMgLevel <= 10.0) {
      return { stage: "Early Toxicity: Loss of Deep Tendon Reflexes", color: "text-amber-400 font-bold", reflex: "ABSENT (0)", action: "HOLD MgSO4 infusion; check renal function" };
    } else if (serumMgLevel <= 12.0) {
      return { stage: "Moderate Toxicity: Muscle Paralysis & Somnolence", color: "text-rose-400 font-bold", reflex: "ABSENT (0)", action: "Stop infusion; administer O2; prepare antidote" };
    }
    return { stage: "Severe Toxicity: Respiratory Arrest / Cardiac Block", color: "text-rose-500 font-extrabold", reflex: "ABSENT (0)", action: "GIVE IV CALCIUM GLUCONATE 10% (10 mL) STAT!" };
  }, [serumMgLevel]);

  const currentNodes = useMemo(() => {
    return OBGYN_NODES[activeMode] || OBGYN_NODES.partogram;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: ObgynLabNode) => {
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
            <Baby size={14} /> OBG-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "partogram" && "WHO Partograph & Cervical Dilation Labor Progression Simulator"}
            {activeMode === "pph" && "Postpartum Hemorrhage 4Ts & Stepwise Uterotonic Escalation Cascade"}
            {activeMode === "preeclampsia" && "Preeclampsia MgSO4 Seizure Prophylaxis & Toxicity Safety Monitor"}
            {activeMode === "ctgEmergencies" && "Cardiotocography (CTG) Fetal Heart Decelerations & APH Classifier"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "OB/GYN Quiz"}
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
                <div className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider">
                  Obstetrics & Gynecology Clinical Case Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Obstetric Entity: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-emerald-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-fuchsia-950 text-xs rounded border border-fuchsia-700 text-fuchsia-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: WHO Partograph Simulator */}
          {activeMode === "partogram" && (
            <div className={styles.obgSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Modified WHO Partograph & Cervical Dilation Simulator (Alert vs Action Line)
                </span>
                <span className="text-[11px] text-slate-400">Normal Active Rate: &gt;= 1.0 cm/hour</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Active Phase Elapsed Time:</span>{" "}
                    <strong className="text-fuchsia-400">{elapsedHours} hours</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={elapsedHours}
                    onChange={(e) => setElapsedHours(parseInt(e.target.value))}
                    className="w-full accent-fuchsia-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Cervical Dilation:</span>{" "}
                    <strong className="text-fuchsia-400">{cervicalDilationCm} cm</strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="1"
                    value={cervicalDilationCm}
                    onChange={(e) => setCervicalDilationCm(parseInt(e.target.value))}
                    className="w-full accent-fuchsia-500"
                  />
                </div>
              </div>

              <div className={styles.obgResultsGrid}>
                <div className={styles.obgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Partograph Status</div>
                  <div className={`text-xs font-bold mt-1 ${partogramStatus.color}`}>
                    {partogramStatus.status}
                  </div>
                </div>
                <div className={styles.obgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Alert Line Target</div>
                  <div className={styles.obgResultVal}>{Math.min(10, 5 + elapsedHours)} cm</div>
                </div>
                <div className={styles.obgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Recommended Management</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{partogramStatus.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: PPH 4Ts & Uterotonic Cascade */}
          {activeMode === "pph" && (
            <div className={styles.obgSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> PPH 4Ts & Algorithmic Uterotonic Escalation Cascade
                </span>
                <span className="text-[11px] text-slate-400">PPH Threshold: &gt;= 500 mL</span>
              </div>

              <div className="text-xs">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Estimated Vaginal Blood Loss:</span>{" "}
                  <strong className="text-fuchsia-400 text-sm">{pphBloodLossMl} mL</strong>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2500"
                  step="50"
                  value={pphBloodLossMl}
                  onChange={(e) => setPphBloodLossMl(parseInt(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>

              {/* Comorbidity Toggles */}
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHypertension}
                    onChange={(e) => setHasHypertension(e.target.checked)}
                    className="accent-fuchsia-500"
                  />
                  <span>Comorbidity: Hypertension / Preeclampsia</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAsthma}
                    onChange={(e) => setHasAsthma(e.target.checked)}
                    className="accent-fuchsia-500"
                  />
                  <span>Comorbidity: Bronchial Asthma</span>
                </label>
              </div>

              {/* Pharmacological Uterotonic Cascade Alerts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-emerald-950/40 border border-emerald-700/60 rounded text-center">
                  <div className="text-[10px] text-slate-400">1st-Line Uterotonic</div>
                  <div className="font-bold text-emerald-300 mt-0.5">IV Oxytocin (40 IU)</div>
                  <div className="text-[10px] text-emerald-400">Safe in all patients</div>
                </div>

                <div
                  className={`p-2 border rounded text-center ${
                    hasHypertension
                      ? "bg-rose-950/60 border-rose-500 text-rose-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-[10px] text-slate-400">2nd-Line Ergot</div>
                  <div className="text-xs font-bold mt-0.5">IM Ergometrine</div>
                  <div className="text-[10px]">
                    {hasHypertension ? "⚠️ CONTRAINDICATED (HTN Crisis)" : "Indicated for Atony"}
                  </div>
                </div>

                <div
                  className={`p-2 border rounded text-center ${
                    hasAsthma
                      ? "bg-rose-950/60 border-rose-500 text-rose-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-[10px] text-slate-400">3rd-Line Prostaglandin</div>
                  <div className="text-xs font-bold mt-0.5">IM Carboprost (PGF2a)</div>
                  <div className="text-[10px]">
                    {hasAsthma ? "⚠️ CONTRAINDICATED (Bronchospasm)" : "Indicated for Atony"}
                  </div>
                </div>

                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-center">
                  <div className="text-[10px] text-slate-400">4th-Line Adjunct</div>
                  <div className="font-bold text-fuchsia-300 mt-0.5">Misoprostol + TXA</div>
                  <div className="text-[10px] text-slate-400">Safe in HTN & Asthma</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: MgSO4 Seizure Prophylaxis & Toxicity Monitor */}
          {activeMode === "preeclampsia" && (
            <div className={styles.obgSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Magnesium Sulfate (MgSO4) Protocol & Toxicity Safety Monitor
                </span>
                <span className="text-[11px] text-slate-400">Excreted 100% via Kidneys</span>
              </div>

              <div className="text-xs">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Serum Magnesium Level:</span>{" "}
                  <strong className="text-fuchsia-400 text-sm">{serumMgLevel.toFixed(1)} mEq/L ({ (serumMgLevel * 1.2).toFixed(1) } mg/dL)</strong>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="15.0"
                  step="0.5"
                  value={serumMgLevel}
                  onChange={(e) => setSerumMgLevel(parseFloat(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>

              <div className={styles.obgResultsGrid}>
                <div className={styles.obgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Toxicity Stage</div>
                  <div className={`text-xs font-bold mt-1 ${mgToxicityStaging.color}`}>
                    {mgToxicityStaging.stage}
                  </div>
                </div>
                <div className={styles.obgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Patellar Reflex</div>
                  <div className="text-sm font-bold text-fuchsia-300 mt-1">{mgToxicityStaging.reflex}</div>
                </div>
                <div className={styles.obgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Safety Action</div>
                  <div className="text-xs font-bold text-amber-300 mt-1">{mgToxicityStaging.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: CTG Deceleration Patterns */}
          {activeMode === "ctgEmergencies" && (
            <div className={styles.obgSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} /> Cardiotocography (CTG) FHR Deceleration & APH Classifier
                </span>
                <span className="text-[11px] text-slate-400">Baseline FHR: 110–160 bpm</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedCtgPattern("early")}
                  className={`p-2 rounded text-xs font-bold border transition ${
                    selectedCtgPattern === "early"
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  Early Deceleration
                </button>
                <button
                  onClick={() => setSelectedCtgPattern("late")}
                  className={`p-2 rounded text-xs font-bold border transition ${
                    selectedCtgPattern === "late"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  Late Deceleration
                </button>
                <button
                  onClick={() => setSelectedCtgPattern("variable")}
                  className={`p-2 rounded text-xs font-bold border transition ${
                    selectedCtgPattern === "variable"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  Variable Deceleration
                </button>
                <button
                  onClick={() => setSelectedCtgPattern("sinusoidal")}
                  className={`p-2 rounded text-xs font-bold border transition ${
                    selectedCtgPattern === "sinusoidal"
                      ? "bg-red-700 text-white border-red-500"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  Sinusoidal Pattern
                </button>
              </div>

              {/* CTG Diagnostic Explanation Box */}
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {selectedCtgPattern === "early" && (
                  <div className="text-emerald-300">
                    <strong>Early Deceleration:</strong> Nadir mirrors peak of contraction. <em>Mechanism:</em> Fetal head compression causing benign vagal stimulation. <strong>Management:</strong> Physiological; continue routine labor observation.
                  </div>
                )}
                {selectedCtgPattern === "late" && (
                  <div className="text-rose-300">
                    <strong>Late Deceleration:</strong> Nadir occurs after peak of contraction. <em>Mechanism:</em> Uteroplacental insufficiency & fetal hypoxemia. <strong>Management:</strong> Turn mother to left lateral, IV fluids, 100% O2, stop oxytocin, urgent delivery if persistent.
                  </div>
                )}
                {selectedCtgPattern === "variable" && (
                  <div className="text-amber-300">
                    <strong>Variable Deceleration:</strong> Abrupt 'V' shaped drop. <em>Mechanism:</em> Umbilical cord compression. <strong>Management:</strong> Reposition mother, perform vaginal exam to rule out cord prolapse.
                  </div>
                )}
                {selectedCtgPattern === "sinusoidal" && (
                  <div className="text-red-400 font-bold">
                    <strong>Sinusoidal Pattern:</strong> Undulating smooth wave. <em>Mechanism:</em> Severe fetal anemia or terminal hypoxia. <strong>Management:</strong> CRITICAL SURGICAL EMERGENCY &rarr; Immediate Emergency Cesarean Section.
                  </div>
                )}
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
                    <span className="text-fuchsia-400 font-bold">Algorithm:</span> {node.clinicalAlgorithm}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect obstetric clinical protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Obstetrics & Gynecology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
              Obstetric Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Obstetric Entity / Syndrome</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria & Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>👶 Obstetric & Resuscitation Management</div>
            <div className={styles.inspectorBody}>{activeNode.obstetricManagement}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Williams / ACOG High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("partogram")}
          className={`${styles.modeTab} ${activeMode === "partogram" ? styles.modeTabActive : ""}`}
        >
          👶 1. Labor & Partogram
        </button>
        <button
          onClick={() => setActiveMode("pph")}
          className={`${styles.modeTab} ${activeMode === "pph" ? styles.modeTabActive : ""}`}
        >
          🩸 2. PPH & Uterotonics
        </button>
        <button
          onClick={() => setActiveMode("preeclampsia")}
          className={`${styles.modeTab} ${activeMode === "preeclampsia" ? styles.modeTabActive : ""}`}
        >
          ⚡ 3. Preeclampsia & MgSO4
        </button>
        <button
          onClick={() => setActiveMode("ctgEmergencies")}
          className={`${styles.modeTab} ${activeMode === "ctgEmergencies" ? styles.modeTabActive : ""}`}
        >
          📈 4. CTG & Emergencies
        </button>
      </div>
    </div>
  );
}
