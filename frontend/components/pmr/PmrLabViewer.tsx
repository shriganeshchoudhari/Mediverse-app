"use client";

import React, { useState, useMemo } from "react";
import styles from "./PmrLabViewer.module.css";
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
  Stethoscope,
  Crosshair,
  Pill,
  Accessibility,
  HeartPulse,
} from "lucide-react";

export type PmrLabMode = "stroke" | "sci" | "prosthetics" | "gait";

export interface PmrLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalProtocol: string;
  diagnosticCriteria: string;
  emergencyAction: string;
  highYieldPearl: string;
}

export const PMR_NODES: Record<PmrLabMode, PmrLabNode[]> = {
  stroke: [
    {
      id: "stroke-brunnstrom-stages-mas",
      name: "1. Brunnstrom Motor Recovery (Stages 1–6) & Spasticity (MAS)",
      category: "Stroke Neuro-Rehab",
      subType: "Stage 1 (Flaccid) -> Stage 3 (Synergies / Peak Tone) -> Stage 6 (Isolated) • MAS 0–4",
      clinicalProtocol: "Stage 1: Flaccid paralysis. Stage 2: Synergies emerge. Stage 3: Voluntary synergy control (peak spasticity). Stage 4-6: Breaking synergy to isolated control.",
      diagnosticCriteria: "Modified Ashworth Scale: Grade 1 (catch & release), Grade 1+ (catch with resistance <50% ROM), Grade 2 (marked resistance), Grade 3 (passive movement difficult), Grade 4 (rigid).",
      emergencyAction: "In focal spasticity (e.g. elbow flexors), inject intramuscular Botulinum Toxin A (cleaves SNAP-25, blocking ACh release for 3–6 months).",
      highYieldPearl: "Post-stroke motor recovery progresses sequentially through Brunnstrom stages; peak spasticity occurs in Stage 3 where voluntary movement is confined to obligatory synergy patterns."
    },
    {
      id: "stroke-cimt-neuroplasticity",
      name: "2. Constraint-Induced Movement Therapy (CIMT) & Task Training",
      category: "Neuroplasticity Paradigms",
      subType: "Restrain Unaffected Limb >=90% Waking Hours • 2 Weeks • Active Wrist/Finger Ext >=10 deg",
      clinicalProtocol: "CIMT protocol: Restrain healthy upper limb in a mitt for >=90% of waking hours for 2 consecutive weeks while performing intensive task-oriented training of paretic arm.",
      diagnosticCriteria: "Eligibility: At least 10 degrees of active wrist extension and 10 degrees of active finger extension. Overcomes 'learned non-use'.",
      emergencyAction: "Oral Baclofen (GABA-B agonist) or Tizanidine (alpha-2 agonist) for generalized spasticity; avoid abrupt baclofen withdrawal (risks seizures/hyperthermia).",
      highYieldPearl: "Constraint-Induced Movement Therapy (CIMT) drives cortical map reorganization by overcoming learned non-use through intensive repetitive paretic limb training."
    }
  ],

  sci: [
    {
      id: "sci-asia-impairment-scale",
      name: "1. ASIA / ISNCSCI Impairment Scale (AIS Grades A–E)",
      category: "Spinal Cord Injury",
      subType: "Grade A (Complete) • Grade B (Sensory Incomplete) • Grade C/D (Motor Incomplete) • S4-S5 Sparing",
      clinicalProtocol: "NLI is most caudal level with motor >=3/5 (5/5 above) and sensory 2/2. Grade A: No S4-S5 sparing. Grade B: Sensory S4-S5 sparing, no motor. Grade C: <50% key muscles >=3/5. Grade D: >=50% key muscles >=3/5.",
      diagnosticCriteria: "Sacral sparing assessed by Deep Anal Pressure (DAP) and Voluntary Anal Contraction (VAC). Grade D carries >90% community ambulation prognosis.",
      emergencyAction: "Neurogenic bladder: Initiate Clean Intermittent Catheterization (CIC) every 4–6 hours + anticholinergics (Oxybutynin) for spastic reflex bladder.",
      highYieldPearl: "The presence of sacral sparing (sensory DAP or motor VAC at S4-S5) is the single most critical prognostic determinant separating complete from incomplete spinal cord injuries."
    },
    {
      id: "sci-autonomic-dysreflexia-protocol",
      name: "2. Autonomic Dysreflexia (AD) Emergency Resuscitation (T6 & Above)",
      category: "SCI Emergency Care",
      subType: "T6 Lesions • SBP >20-40 mmHg Rise • Reflex Bradycardia • Flushing Above / Pallor Below",
      clinicalProtocol: "Step 1: Sit patient upright (90 deg) & loosen clothing. Step 2: Unblock/catheterize bladder (85% cause). Step 3: Check bowel. Step 4: Apply 2% Nitroglycerin paste if SBP >150 mmHg.",
      diagnosticCriteria: "Triggered by noxious visceral stimuli below T6 (blocked Foley >85%, bowel impaction). Baroreceptors cause CN X vagal reflex bradycardia, but sympathetic block persists below T6.",
      emergencyAction: "Never lie the patient flat! Sitting upright produces orthostatic pooling to immediately lower arterial pressure while searching for blocked catheter.",
      highYieldPearl: "Autonomic Dysreflexia is an acute medical emergency in injuries at T6 and above; immediate 90-degree upright positioning and urinary bladder decompression are life-saving."
    }
  ],

  prosthetics: [
    {
      id: "prosthetics-k-levels-components",
      name: "1. Medicare Functional K-Levels (K0–K4) & Prosthetic Componentry",
      category: "Prosthetics Prescription",
      subType: "K1 (SACH Foot) • K2 (Flexible Keel) • K3 (Dynamic Carbon Energy-Storing Foot / MPK) • K4 (Athlete)",
      clinicalProtocol: "K0: Non-ambulator (no prosthesis). K1: Household fixed cadence (SACH foot). K2: Limited community barriers (flexible keel). K3: Variable cadence community (Dynamic response carbon foot + Microprocessor knee).",
      diagnosticCriteria: "Transtibial (BKA) preserves biological knee (+10–40% energy cost) vs Transfemoral (AKA) requiring mechanical knee (+60–100% energy cost).",
      emergencyAction: "Check socket fit: Patellar Tendon Bearing (PTB) loads patellar tendon and medial tibial flare, relieving tibial crest and fibular head.",
      highYieldPearl: "Dynamic response carbon fiber feet absorb energy during stance and return it at push-off, indicated for K3 community ambulators with variable cadence."
    },
    {
      id: "orthotics-afo-kafo-prescriptions",
      name: "2. Lower Limb Orthoses: AFO & KAFO Prescriptions",
      category: "Orthotics Biomechanics",
      subType: "Posterior Leaf Spring (PLS AFO) • Solid Ankle AFO • Articulated AFO • KAFO (Quad <3/5)",
      clinicalProtocol: "Isolated Foot Drop (Tibialis anterior weakness, quad >=3/5) -> Posterior Leaf Spring (PLS) AFO. Severe spasticity / Genu Recurvatum -> Solid AFO. Quadriceps weakness <3/5 -> KAFO.",
      diagnosticCriteria: "PLS AFO provides swing-phase dorsiflexion assist. Solid AFO locks ankle at 90 deg, providing stance-phase knee stability.",
      emergencyAction: "In severe knee buckling during stance due to quadriceps weakness (<3/5), prescribe a Knee-Ankle-Foot Orthosis (KAFO) to lock the knee.",
      highYieldPearl: "A Posterior Leaf Spring AFO is the brace of choice for isolated foot drop with intact knee stability, providing elastic swing-phase toe clearance."
    }
  ],

  gait: [
    {
      id: "gait-trendelenburg-biomechanics",
      name: "1. Trendelenburg Gait: Hip Abductor Biomechanics & Cane Offloading",
      category: "Pathological Gait Analysis",
      subType: "Superior Gluteal Nerve (L4–S1) • Gluteus Medius Weakness • Contralateral Pelvic Drop • Cane in Opposite Hand",
      clinicalProtocol: "Weak right gluteus medius -> During right single-leg stance, pelvis drops on LEFT (contralateral) swing side. Compensated: Trunk leans to RIGHT (ipsilateral side).",
      diagnosticCriteria: "Etiology: Superior gluteal nerve palsy, lateral hip surgical approach, developmental dysplasia. Cane held in OPPOSITE hand reduces abductor muscle force by >50%.",
      emergencyAction: "Prescribe single-point cane held in CONTRALATERAL hand to create a long mechanical lever arm supporting the pelvis.",
      highYieldPearl: "Holding a cane in the hand opposite the affected hip dramatically reduces the required gluteus medius force by providing a wide supportive base and counter-moment."
    },
    {
      id: "gait-steppage-circumduction-parkinsonian",
      name: "2. Steppage, Hemiplegic Circumduction & Parkinsonian Gaits",
      category: "Neurological Gait Patterns",
      subType: "Steppage (Deep Peroneal N / Foot Slap) • Circumduction (Extensor Synergy) • Festinating (Short Shuffling)",
      clinicalProtocol: "Steppage: Deep peroneal palsy -> high hip/knee flexion to clear foot + foot slap. Circumduction: Stroke spastic extensor synergy -> lateral leg arc. Parkinsonian: Stooped, shuffling, festination.",
      diagnosticCriteria: "Normal gait: 60% Stance (Initial contact, Loading, Mid-stance, Terminal stance, Pre-swing) + 40% Swing. Double limb support is 20%.",
      emergencyAction: "For steppage foot drop: Prescribe PLS AFO. For Parkinsonian festination: Initiate auditory/visual cueing and physical therapy.",
      highYieldPearl: "Steppage gait is characterized by excessive hip and knee flexion during swing phase to compensate for foot drop caused by deep peroneal nerve or L5 nerve root injury."
    }
  ]
};

interface PmrLabViewerProps {
  initialMode?: PmrLabMode;
  height?: string;
  onNodeSelect?: (node: PmrLabNode) => void;
}

export default function PmrLabViewer({
  initialMode = "stroke",
  height = "560px",
  onNodeSelect,
}: PmrLabViewerProps) {
  const [activeMode, setActiveMode] = useState<PmrLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Stroke Brunnstrom State
  const [brunnstromStage, setBrunnstromStage] = useState<number>(3); // Stage 3
  const [masScore, setMasScore] = useState<string>("2"); // MAS 2

  // SCI ASIA State
  const [asiaGrade, setAsiaGrade] = useState<"A" | "B" | "C" | "D" | "E">("C");
  const [autonomicSystolicBp, setAutonomicSystolicBp] = useState<number>(186); // mmHg

  // Prosthetics K-Level State
  const [kLevel, setKLevel] = useState<"K0" | "K1" | "K2" | "K3" | "K4">("K3");

  // Brunnstrom Interpretation
  const brunnstromTriage = useMemo(() => {
    let stageName = "";
    let motorStatus = "";
    let toneStatus = "";
    let color = "text-purple-300 font-bold";

    switch (brunnstromStage) {
      case 1:
        stageName = "Stage 1: Flaccidity";
        motorStatus = "Complete absence of voluntary movement on hemiplegic side.";
        toneStatus = "Atonic / Flaccid (MAS 0)";
        color = "text-slate-400 font-medium";
        break;
      case 2:
        stageName = "Stage 2: Emergence of Synergies";
        motorStatus = "Minimal voluntary movement in gross synergy patterns.";
        toneStatus = "Spasticity begins to develop (MAS 1)";
        color = "text-amber-300 font-medium";
        break;
      case 3:
        stageName = "Stage 3: Voluntary Synergy Control (PEAK SPASTICITY)";
        motorStatus = "Voluntary movement confined to obligatory stereotypic synergies.";
        toneStatus = "Peak Spasticity (MAS 2–3)";
        color = "text-rose-400 font-extrabold";
        break;
      case 4:
        stageName = "Stage 4: Deviating from Synergies";
        motorStatus = "Movement combinations begin to break out of basic synergy.";
        toneStatus = "Spasticity begins to decline (MAS 1–1+)";
        color = "text-purple-300 font-bold";
        break;
      case 5:
        stageName = "Stage 5: Independent Out-of-Synergy Movement";
        motorStatus = "Difficult movement combinations independent of synergy.";
        toneStatus = "Spasticity significantly reduced";
        color = "text-sky-300 font-bold";
        break;
      case 6:
        stageName = "Stage 6: Isolated Joint Coordination";
        motorStatus = "Individual joint movements performed with near-normal coordination.";
        toneStatus = "Normal tone (MAS 0)";
        color = "text-emerald-400 font-bold";
        break;
    }

    return { stageName, motorStatus, toneStatus, color };
  }, [brunnstromStage]);

  // SCI ASIA Interpretation
  const asiaTriage = useMemo(() => {
    let classification = "";
    let prognosis = "";
    let color = "text-purple-300 font-bold";

    switch (asiaGrade) {
      case "A":
        classification = "AIS Grade A: COMPLETE (No S4–S5 sacral sparing)";
        prognosis = "Minimal recovery below NLI (<3% ambulation); wheelchair dependent.";
        color = "text-rose-400 font-extrabold";
        break;
      case "B":
        classification = "AIS Grade B: SENSORY INCOMPLETE (Sensory S4–S5 present, no motor)";
        prognosis = "Sensory preservation predicts 30–40% motor recovery potential.";
        color = "text-amber-300 font-bold";
        break;
      case "C":
        classification = "AIS Grade C: MOTOR INCOMPLETE (>50% key muscles <3/5)";
        prognosis = "~50% achieve household/community ambulation with braces.";
        color = "text-purple-300 font-bold";
        break;
      case "D":
        classification = "AIS Grade D: MOTOR INCOMPLETE (>=50% key muscles >=3/5)";
        prognosis = "EXCELLENT: >90% achieve functional community ambulation.";
        color = "text-emerald-400 font-bold";
        break;
      case "E":
        classification = "AIS Grade E: NORMAL (Fully intact motor/sensory)";
        prognosis = "Full functional recovery.";
        color = "text-emerald-300 font-bold";
        break;
    }

    return { classification, prognosis, color };
  }, [asiaGrade]);

  // Autonomic Dysreflexia SBP Check
  const adStatus = useMemo(() => {
    const isCrisis = autonomicSystolicBp >= 150;
    return {
      isCrisis,
      status: isCrisis ? "HYPERTENSIVE AUTONOMIC CRISIS (SBP >= 150 mmHg)" : "Stable Blood Pressure",
      action: isCrisis ? "Sit 90 deg upright -> Empty bladder -> Apply 2% Nitroglycerin Paste" : "Routine SCI monitoring",
      color: isCrisis ? "text-rose-400 font-extrabold" : "text-emerald-400 font-bold"
    };
  }, [autonomicSystolicBp]);

  // Prosthetics K-Level Interpretation
  const kLevelTriage = useMemo(() => {
    let component = "";
    let ambulation = "";

    switch (kLevel) {
      case "K0":
        ambulation = "Non-Ambulator (No prosthesis)";
        component = "Wheelchair mobility & transfer assistance.";
        break;
      case "K1":
        ambulation = "Household Ambulator (Fixed cadence)";
        component = "SACH (Solid Ankle Cushion Heel) foot / Single-axis constant friction knee.";
        break;
      case "K2":
        ambulation = "Limited Community Ambulator (Low environmental barriers)";
        component = "Flexible Keel foot / Polycentric stance-stability knee.";
        break;
      case "K3":
        ambulation = "Unlimited Community Ambulator (Variable cadence)";
        component = "Dynamic Response / Energy-Storing Carbon Fiber Foot + Microprocessor Knee.";
        break;
      case "K4":
        ambulation = "High-Impact / Active Child / Athlete";
        component = "Specialty energy-storing carbon blade / sports prosthetics.";
        break;
    }

    return { ambulation, component };
  }, [kLevel]);

  const currentNodes = useMemo(() => {
    return PMR_NODES[activeMode] || PMR_NODES.stroke;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: PmrLabNode) => {
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
            <Accessibility size={14} /> PMR-401
          </span>
          <span className={styles.titleText}>
            {activeMode === "stroke" && "Stroke Neuro-Rehab & Brunnstrom Motor Recovery Simulator"}
            {activeMode === "sci" && "Spinal Cord Injury ASIA Scale & Autonomic Dysreflexia Engine"}
            {activeMode === "prosthetics" && "Lower Limb Prosthetics K-Levels & AFO Orthotic Prescriber"}
            {activeMode === "gait" && "Gait Cycle Biomechanics & Pathological Gait Diagnostic Engine"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "PMR Quiz"}
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
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  PMR Clinical Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Rehabilitation Protocol: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-purple-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-purple-950 text-xs rounded border border-purple-700 text-purple-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Stroke Brunnstrom Stages */}
          {activeMode === "stroke" && (
            <div className={styles.pmrSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Brunnstrom Motor Recovery &amp; Spasticity Evolution
                </span>
                <span className="text-[11px] text-slate-400">Stages 1 to 6</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Brunnstrom Motor Recovery Stage:</span>{" "}
                  <strong className="text-purple-300">{brunnstromTriage.stageName}</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={brunnstromStage}
                  onChange={(e) => setBrunnstromStage(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className={styles.pmrResultsGrid}>
                <div className={styles.pmrResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Motor Control</div>
                  <div className={`text-xs font-bold mt-1 ${brunnstromTriage.color}`}>{brunnstromTriage.motorStatus}</div>
                </div>
                <div className={styles.pmrResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Muscle Tone &amp; Spasticity</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{brunnstromTriage.toneStatus}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: SCI ASIA & Autonomic Dysreflexia */}
          {activeMode === "sci" && (
            <div className={styles.pmrSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> ASIA Impairment Scale &amp; Autonomic Dysreflexia
                </span>
                <span className="text-[11px] text-slate-400">T6 and Above</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-xs">
                {(["A", "B", "C", "D", "E"] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setAsiaGrade(grade)}
                    className={`p-2 rounded font-bold border transition ${
                      asiaGrade === grade
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Grade {grade}
                  </button>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Systolic Blood Pressure (T6 Lesion):</span>{" "}
                  <strong className="text-purple-300">{autonomicSystolicBp} mmHg (Crisis &ge; 150 mmHg)</strong>
                </div>
                <input
                  type="range"
                  min="90"
                  max="220"
                  step="2"
                  value={autonomicSystolicBp}
                  onChange={(e) => setAutonomicSystolicBp(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className={styles.pmrResultsGrid}>
                <div className={styles.pmrResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">ASIA Scale Prognosis</div>
                  <div className={`text-xs font-bold mt-1 ${asiaTriage.color}`}>{asiaTriage.classification}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{asiaTriage.prognosis}</div>
                </div>

                <div className={styles.pmrResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Autonomic Dysreflexia Status</div>
                  <div className={`text-xs font-bold mt-1 ${adStatus.color}`}>{adStatus.status}</div>
                  <div className="text-[10px] text-slate-200 mt-0.5">{adStatus.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Lower Limb Prosthetics K-Levels */}
          {activeMode === "prosthetics" && (
            <div className={styles.pmrSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Accessibility size={14} /> Medicare Functional K-Levels (K0–K4)
                </span>
                <span className="text-[11px] text-slate-400">Prosthetic Foot &amp; Knee Selection</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-xs">
                {(["K0", "K1", "K2", "K3", "K4"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setKLevel(lvl)}
                    className={`p-2 rounded font-bold border transition ${
                      kLevel === lvl
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>

              <div className={styles.pmrResultsGrid}>
                <div className={styles.pmrResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Functional Ambulation Potential</div>
                  <div className="text-xs font-bold text-purple-300 mt-1">{kLevelTriage.ambulation}</div>
                </div>

                <div className={styles.pmrResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Prescribed Prosthetic Components</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{kLevelTriage.component}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Gait Biomechanics */}
          {activeMode === "gait" && (
            <div className={styles.pmrSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Gait Cycle Biomechanics (Stance 60% vs Swing 40%)
                </span>
                <span className="text-[11px] text-slate-400">Pathological Gaits</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Trendelenburg Gait (Gluteus Medius Weakness)</div>
                  <div className="text-slate-300 mt-1">Pelvis drops on contralateral swing side. Compensated: Lateral trunk lean over affected stance hip. Cane in OPPOSITE hand.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Steppage Foot Drop Gait (Deep Peroneal Nerve)</div>
                  <div className="text-slate-300 mt-1">Excessive hip/knee flexion to clear toes + foot slap at initial contact. Posterior Leaf Spring (PLS) AFO indicated.</div>
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
                    <span className="text-purple-400 font-bold">Protocol:</span> {node.clinicalProtocol}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect PMR protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield PMR Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              PMR Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Rehabilitation Focus / Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Scale</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Therapeutic Interventions &amp; Bracing</div>
            <div className={styles.inspectorBody}>{activeNode.emergencyAction}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Braddom &amp; DeLisa Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("stroke")}
          className={`${styles.modeTab} ${activeMode === "stroke" ? styles.modeTabActive : ""}`}
        >
          🧠 1. Stroke &amp; Brunnstrom
        </button>
        <button
          onClick={() => setActiveMode("sci")}
          className={`${styles.modeTab} ${activeMode === "sci" ? styles.modeTabActive : ""}`}
        >
          ⚡ 2. SCI ASIA &amp; Autonomic
        </button>
        <button
          onClick={() => setActiveMode("prosthetics")}
          className={`${styles.modeTab} ${activeMode === "prosthetics" ? styles.modeTabActive : ""}`}
        >
          🦿 3. Prosthetics &amp; Orthotics
        </button>
        <button
          onClick={() => setActiveMode("gait")}
          className={`${styles.modeTab} ${activeMode === "gait" ? styles.modeTabActive : ""}`}
        >
          🚶 4. Gait Biomechanics
        </button>
      </div>
    </div>
  );
}
