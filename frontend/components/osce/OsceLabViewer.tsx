"use client";

import React, { useState, useMemo } from "react";
import styles from "./OsceLabViewer.module.css";
import {
  Activity,
  Heart,
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
  Brain,
  Scissors,
  MessageSquare,
  Award,
} from "lucide-react";

export type OsceLabMode = "precordial" | "neuro" | "acls" | "surgical";

export interface OsceLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalProtocol: string;
  diagnosticCriteria: string;
  emergencyAction: string;
  highYieldPearl: string;
}

export const OSCE_NODES: Record<OsceLabMode, OsceLabNode[]> = {
  precordial: [
    {
      id: "osce-aortic-stenosis-murmurs",
      name: "Station 1: Precordial Auscultation & Dynamic Murmur Maneuvers",
      category: "Cardiovascular OSCE",
      subType: "Aortic Stenosis (Cresc-Decresc -> Carotids) • Mitral Regurg (Axilla) • Dynamic Maneuvers",
      clinicalProtocol: "Systematic sequence: Aortic (2nd RICS) -> Pulmonic (2nd LICS) -> Tricuspid (4th LICS) -> Mitral/Apex (5th LICS MCL). Use bell at apex in left lateral decubitus.",
      diagnosticCriteria: "Valsalva DECREASES most murmurs (AS, MR) but INCREASES Hypertrophic Cardiomyopathy (HCM) & MVP. Squatting INCREASES AS/MR but DECREASES HCM.",
      emergencyAction: "In severe AS (pulsus parvus et tardus, single S2, valve area <1.0 cm2), avoid high-dose vasodilators and refer for SAVR / TAVR.",
      highYieldPearl: "Valsalva strain reduces left ventricular preload, worsening left ventricular outflow obstruction in HCM (louder murmur) while softening almost all other valvular murmurs."
    },
    {
      id: "osce-mitral-stenosis-opening-snap",
      name: "Station 2: Mitral Stenosis Opening Snap & Carvallo Sign",
      category: "Valvular Auscultation",
      subType: "Mitral Stenosis (Rumble + Opening Snap) • Tricuspid Regurg (Carvallo Sign -> Incr with Insp)",
      clinicalProtocol: "Mitral Stenosis: Low-pitch rumbling mid-diastolic murmur at apex using bell in left lateral position. Tricuspid Regurgitation increases with inspiration (Carvallo sign).",
      diagnosticCriteria: "Opening Snap occurs earlier in diastole (shorter A2-OS interval) as mitral stenosis severity worsens due to higher left atrial pressure.",
      emergencyAction: "Assess for atrial fibrillation in severe MS and initiate anticoagulation (Warfarin/DOAC) to prevent thromboembolic stroke.",
      highYieldPearl: "The shorter the time interval between the aortic second heart sound (A2) and the opening snap (OS), the more severe the mitral stenosis."
    }
  ],

  neuro: [
    {
      id: "osce-cranial-nerves-ii-xii",
      name: "Station 3: Systematic Cranial Nerve Examination (CN II–XII)",
      category: "Neurological OSCE",
      subType: "CN II (RAPD / Fundus) • CN III/IV/VI (H-Pattern) • CN VII (UMN vs Bell's) • CN VIII (Rinne/Weber)",
      clinicalProtocol: "CN II (Acuity/Fields/Pupils) -> CN III/IV/VI (Extraocular H-pattern) -> CN V (Sensation/Masseter) -> CN VII (Forehead vs Smile) -> CN VIII (Tuning forks) -> CN XII (Tongue).",
      diagnosticCriteria: "Marcus Gunn pupil: Paradoxical dilation on swinging flashlight (optic neuritis). CN VII UMN (stroke): Forehead spared. CN VII LMN (Bell's): Entire hemiface paralyzed.",
      emergencyAction: "In acute CN III palsy with fixed dilated pupil, immediately order CT Angiography to rule out compressive Posterior Communicating Artery (PCOM) aneurysm.",
      highYieldPearl: "In upper motor neuron (UMN) facial weakness (e.g. cortical stroke), the forehead is spared due to bilateral cortical motor innervation; in LMN Bell's palsy, the entire hemiface is paralyzed."
    },
    {
      id: "osce-tuning-forks-rinne-weber",
      name: "Station 4: Tuning Fork Tests: Rinne & Weber Interpretation",
      category: "Otological Examination",
      subType: "512 Hz Tuning Fork • Rinne (AC vs BC) • Weber (Lateralization to Affected vs Healthy Ear)",
      clinicalProtocol: "Rinne: 512 Hz fork on mastoid (BC) -> move to ear canal (AC). Normal/Sensorineural is Rinne positive (AC > BC). Conductive loss is Rinne negative (BC > AC).",
      diagnosticCriteria: "Weber: Lateralizes to AFFECTED ear in Conductive loss (e.g. otosclerosis/wax); Lateralizes to HEALTHY (contralateral) ear in Sensorineural loss.",
      emergencyAction: "In sudden sensorineural hearing loss (SSNHL), initiate urgent high-dose oral corticosteroids (Prednisone 60 mg/day) within 72 hours.",
      highYieldPearl: "In conductive hearing loss, Rinne is negative (Bone Conduction > Air Conduction) in the affected ear, and the Weber test lateralizes toward the affected ear."
    }
  ],

  acls: [
    {
      id: "osce-atls-primary-survey-decompression",
      name: "Station 5: ATLS Trauma Primary Survey & Needle Decompression",
      category: "Trauma Emergency",
      subType: "ABCDE Hierarchy • Tension Pneumothorax 14G Needle • 28–32 Fr Chest Tube • Pelvic Binder",
      clinicalProtocol: "A: Airway + C-spine. B: Tension pneumothorax -> Immediate 14G needle decompression in 5th ICS AAL / 2nd ICS MCL -> Chest tube in Safe Triangle. C: Pelvic binder + MTP 1:1:1 + TXA.",
      diagnosticCriteria: "Tension pneumothorax: Hyper-resonance, absent breath sounds, tracheal deviation, JVD, shock. NEVER DELAY FOR CHEST X-RAY!",
      emergencyAction: "Insert immediate 14G catheter, then place chest tube. Activate MTP (1:1:1 PRBC:FFP:Platelets) and inject IV Tranexamic Acid 1g within 3 hours.",
      highYieldPearl: "Tension pneumothorax is an absolute clinical diagnosis; delaying needle decompression to order a chest X-ray in an unstable patient is a critical OSCE failure."
    },
    {
      id: "osce-acls-megacode-defibrillation",
      name: "Station 6: AHA ACLS MegaCode Cardiac Arrest Simulation",
      category: "Resuscitation MegaCode",
      subType: "Shockable (VF/pVT) 200J Biphasic • CPR 2 min No Pulse Check • Epinephrine 1 mg • Amiodarone 300 mg",
      clinicalProtocol: "Shockable (VF/pVT): 200J Shock -> Resume CPR 2 min immediately -> 2nd Shock -> CPR + Epi 1 mg q3-5m -> 3rd Shock -> Amiodarone 300 mg. EtCO2 >=35 mmHg indicates ROSC.",
      diagnosticCriteria: "Non-shockable (PEA/Asystole): DO NOT SHOCK. Early CPR + Epinephrine 1 mg ASAP + Search reversible 5 Hs and 5 Ts.",
      emergencyAction: "Immediately resume high-quality chest compressions for 2 minutes following every defibrillation shock without pausing for a pulse check.",
      highYieldPearl: "Never pause chest compressions for a rhythm or pulse check immediately following a defibrillation shock; deliver CPR instantly for 2 full minutes."
    }
  ],

  surgical: [
    {
      id: "osce-suture-materials-knot-tying",
      name: "Station 7: Suture Selection, Instrument Knot Tying & Wound Closure",
      category: "Surgical Skills",
      subType: "Nylon (Skin) • Vicryl (Deep Dermis) • PDS (Fascia) • Vertical Mattress ('Far-Far Near-Near')",
      clinicalProtocol: "Skin: Non-absorbable Nylon/Prolene (5-0/6-0 face, 3-0/4-0 body). Deep dermis: Absorbable Vicryl. Abdominal fascia: PDS. Vertical mattress for skin eversion.",
      diagnosticCriteria: "Instrument tie: Double throw forward (surgeon's knot) -> single throw backward -> square knot. Minimum 3–4 throws braided, 5–6 throws monofilament.",
      emergencyAction: "For contaminated dirty wounds (>8–12 hours old or animal bites), avoid primary closure; perform thorough irrigation and delayed primary closure.",
      highYieldPearl: "The vertical mattress suture ('far-far, near-near') is the premier technique for achieving excellent skin edge eversion in high-tension or deep lacerations."
    },
    {
      id: "osce-abg-acid-base-interpretation",
      name: "Station 8: Stepwise Arterial Blood Gas (ABG) & Winter's Formula",
      category: "Acid-Base Diagnostics",
      subType: "pH -> PaCO2 / HCO3- -> Anion Gap = Na - (Cl + HCO3) -> Winter's Formula: 1.5[HCO3] + 8 +/- 2",
      clinicalProtocol: "Step 1: Acidemia (pH <7.35) vs Alkalemia (>7.45). Step 2: Metabolic vs Respiratory. Step 3: Anion Gap (Normal 8–12). Step 4: Winter's formula expected PaCO2.",
      diagnosticCriteria: "HAGMA: DKA, Lactic acidosis, Uremia, Toxic alcohols. Winter's formula: If measured PaCO2 > expected -> coexisting Respiratory Acidosis.",
      emergencyAction: "In severe DKA (pH <7.20, AG >25): Administer aggressive IV isotonic crystalloids, regular insulin infusion (0.1 U/kg/h), and monitor potassium.",
      highYieldPearl: "Winter's formula determines expected respiratory compensation in metabolic acidosis; if measured PaCO2 exceeds expected, a coexisting respiratory acidosis is present."
    }
  ]
};

interface OsceLabViewerProps {
  initialMode?: OsceLabMode;
  height?: string;
  onNodeSelect?: (node: OsceLabNode) => void;
}

export default function OsceLabViewer({
  initialMode = "precordial",
  height = "560px",
  onNodeSelect,
}: OsceLabViewerProps) {
  const [activeMode, setActiveMode] = useState<OsceLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Precordial Station State
  const [selectedMurmur, setSelectedMurmur] = useState<"as" | "mr" | "hcm" | "ms">("as");
  const [dynamicManeuver, setDynamicManeuver] = useState<"rest" | "valsalva" | "squatting">("rest");

  // ABG Calculator State
  const [abgPh, setAbgPh] = useState<number>(7.18);
  const [abgHco3, setAbgHco3] = useState<number>(8); // mEq/L
  const [abgPaco2, setAbgPaco2] = useState<number>(20); // mmHg
  const [abgNa, setAbgNa] = useState<number>(136); // mEq/L
  const [abgCl, setAbgCl] = useState<number>(98); // mEq/L

  // Murmur Dynamic Interpretation
  const murmurDynamicTriage = useMemo(() => {
    let effect = "";
    let intensity = "Grade 3/6";
    let color = "text-indigo-300 font-bold";

    if (selectedMurmur === "as") {
      if (dynamicManeuver === "valsalva") {
        effect = "DECREASES intensity (reduced preload reduces flow across stenotic valve).";
        intensity = "Grade 1/6 (Softer)";
        color = "text-amber-300 font-bold";
      } else if (dynamicManeuver === "squatting") {
        effect = "INCREASES intensity (increased venous return increases transvalvular flow).";
        intensity = "Grade 4/6 with Thrill";
        color = "text-rose-400 font-extrabold";
      } else {
        effect = "Harsh systolic crescendo-decrescendo murmur loudest at 2nd RICS radiating to carotids.";
      }
    } else if (selectedMurmur === "hcm") {
      if (dynamicManeuver === "valsalva") {
        effect = "INCREASES DRAMATICALLY (reduced LV volume worsens dynamic subaortic obstruction!).";
        intensity = "Grade 5/6 (Much Louder)";
        color = "text-rose-400 font-extrabold";
      } else if (dynamicManeuver === "squatting") {
        effect = "DECREASES intensity (increased preload and afterload expands LV cavity, reducing obstruction).";
        intensity = "Grade 1/6 (Much Softer)";
        color = "text-emerald-400 font-bold";
      } else {
        effect = "Systolic ejection murmur along left sternal border without carotid radiation.";
      }
    } else if (selectedMurmur === "mr") {
      if (dynamicManeuver === "valsalva") {
        effect = "DECREASES intensity (reduced ventricular filling).";
        intensity = "Grade 2/6";
      } else if (dynamicManeuver === "squatting") {
        effect = "INCREASES intensity (increased afterload increases regurgitant fraction).";
        intensity = "Grade 4/6";
      } else {
        effect = "Blowing holosystolic murmur at apex radiating to left axilla.";
      }
    } else {
      effect = "Low-pitched rumbling mid-diastolic murmur at apex with presystolic accentuation and opening snap.";
    }

    return { effect, intensity, color };
  }, [selectedMurmur, dynamicManeuver]);

  // ABG Multi-step Analysis
  const abgTriage = useMemo(() => {
    const anionGap = abgNa - (abgCl + abgHco3);
    const expectedPaco2 = Math.round(1.5 * abgHco3 + 8);
    const isHagma = anionGap > 12;

    let diagnosis = "";
    let compensation = "";

    if (abgPh < 7.35) {
      if (isHagma) {
        diagnosis = `Primary High Anion Gap Metabolic Acidosis (AG = ${anionGap} mEq/L)`;
      } else {
        diagnosis = `Primary Normal Anion Gap Metabolic Acidosis (AG = ${anionGap} mEq/L)`;
      }

      if (Math.abs(abgPaco2 - expectedPaco2) <= 2) {
        compensation = `Appropriate Respiratory Compensation (Winter's formula: expected PaCO2 = ${expectedPaco2} +/- 2 mmHg)`;
      } else if (abgPaco2 > expectedPaco2 + 2) {
        compensation = `Coexisting Respiratory Acidosis (Measured PaCO2 ${abgPaco2} > Expected ${expectedPaco2})`;
      } else {
        compensation = `Coexisting Respiratory Alkalosis (Measured PaCO2 ${abgPaco2} < Expected ${expectedPaco2})`;
      }
    } else if (abgPh > 7.45) {
      diagnosis = "Primary Alkalemia";
      compensation = "Evaluate metabolic vs respiratory etiology";
    } else {
      diagnosis = "Normal pH or Mixed compensated disorder";
    }

    return { anionGap, expectedPaco2, diagnosis, compensation };
  }, [abgPh, abgHco3, abgPaco2, abgNa, abgCl]);

  const currentNodes = useMemo(() => {
    return OSCE_NODES[activeMode] || OSCE_NODES.precordial;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: OsceLabNode) => {
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
            <Award size={14} /> OSCE-403
          </span>
          <span className={styles.titleText}>
            {activeMode === "precordial" && "Cardiovascular Precordial & Dynamic Murmur Auscultation Station"}
            {activeMode === "neuro" && "Cranial Nerve II–XII Systematic Examination & Reflex Station"}
            {activeMode === "acls" && "ATLS Trauma Primary Survey & ACLS MegaCode Simulation Station"}
            {activeMode === "surgical" && "Surgical Suture Selection, Knot Tying & ABG Interpretation Station"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "OSCE Exam Quiz"}
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
                  OSCE Station Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Station Protocol: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: Precordial Murmur Dynamic Simulator */}
          {activeMode === "precordial" && (
            <div className={styles.osceSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={14} /> Precordial Auscultation &amp; Dynamic Maneuvers
                </span>
                <span className="text-[11px] text-slate-400">Valsalva vs Squatting</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedMurmur("as")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedMurmur === "as"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Aortic Stenosis (AS)
                </button>
                <button
                  onClick={() => setSelectedMurmur("hcm")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedMurmur === "hcm"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Hypertrophic Card (HCM)
                </button>
                <button
                  onClick={() => setSelectedMurmur("mr")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedMurmur === "mr"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Mitral Regurg (MR)
                </button>
                <button
                  onClick={() => setSelectedMurmur("ms")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedMurmur === "ms"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Mitral Stenosis (MS)
                </button>
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setDynamicManeuver("rest")}
                  className={`px-3 py-1.5 rounded font-semibold border ${
                    dynamicManeuver === "rest"
                      ? "bg-indigo-700 text-white border-indigo-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  Resting Baseline
                </button>
                <button
                  onClick={() => setDynamicManeuver("valsalva")}
                  className={`px-3 py-1.5 rounded font-semibold border ${
                    dynamicManeuver === "valsalva"
                      ? "bg-indigo-700 text-white border-indigo-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  Valsalva Strain (Preload &darr;)
                </button>
                <button
                  onClick={() => setDynamicManeuver("squatting")}
                  className={`px-3 py-1.5 rounded font-semibold border ${
                    dynamicManeuver === "squatting"
                      ? "bg-indigo-700 text-white border-indigo-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  Squatting (Preload/Afterload &uarr;)
                </button>
              </div>

              <div className={styles.osceResultsGrid}>
                <div className={styles.osceResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Auscultated Intensity</div>
                  <div className={`text-xs font-bold mt-1 ${murmurDynamicTriage.color}`}>{murmurDynamicTriage.intensity}</div>
                </div>
                <div className={styles.osceResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Dynamic Maneuver Response</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{murmurDynamicTriage.effect}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Cranial Nerve Station */}
          {activeMode === "neuro" && (
            <div className={styles.osceSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Cranial Nerve (CN II–XII) Examiner Checklist
                </span>
                <span className="text-[11px] text-slate-400">Marcus Gunn &amp; Bell's Palsy</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">CN VII: UMN vs LMN (Bell's) Facial Palsy</div>
                  <div className="text-slate-300 mt-1">UMN (Stroke): Contralateral lower face weakness with FOREHEAD SPARING. LMN (Bell's): ENTIRE hemiface paralyzed.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">CN VIII: Rinne &amp; Weber Tuning Forks</div>
                  <div className="text-slate-300 mt-1">Conductive: Rinne negative (BC &gt; AC); Weber lateralizes to AFFECTED ear. Sensorineural: Rinne positive; Weber to HEALTHY ear.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: ATLS Trauma & ACLS MegaCode */}
          {activeMode === "acls" && (
            <div className={styles.osceSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> ATLS Primary Survey &amp; ACLS MegaCode Resuscitation
                </span>
                <span className="text-[11px] text-slate-400">Timed 8-Minute Station</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Tension Pneumothorax (Clinical Diagnosis)</div>
                  <div className="text-slate-300 mt-1">Immediate 14G needle in 5th ICS anterior axillary line or 2nd ICS MCL &rarr; 28–32 Fr chest tube in Safe Triangle. NEVER wait for CXR!</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Shockable VF/pVT MegaCode Protocol</div>
                  <div className="text-slate-300 mt-1">200J Biphasic Shock &rarr; CPR 2 min without pulse check &rarr; Epinephrine 1 mg after 2nd shock &rarr; Amiodarone 300 mg after 3rd shock.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Surgical Suturing & ABG Calculator */}
          {activeMode === "surgical" && (
            <div className={styles.osceSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Arterial Blood Gas (ABG) &amp; Winter's Formula Engine
                </span>
                <span className="text-[11px] text-slate-400">Anion Gap = Na - (Cl + HCO3)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Arterial pH:</span>{" "}
                    <strong className="text-indigo-400">{abgPh.toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min="6.90"
                    max="7.60"
                    step="0.01"
                    value={abgPh}
                    onChange={(e) => setAbgPh(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Serum HCO3- (mEq/L):</span>{" "}
                    <strong className="text-indigo-400">{abgHco3} mEq/L</strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="35"
                    step="1"
                    value={abgHco3}
                    onChange={(e) => setAbgHco3(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Arterial PaCO2 (mmHg):</span>{" "}
                    <strong className="text-indigo-400">{abgPaco2} mmHg</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    step="1"
                    value={abgPaco2}
                    onChange={(e) => setAbgPaco2(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              <div className={styles.osceResultsGrid}>
                <div className={styles.osceResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Anion Gap</div>
                  <div className="text-xs font-bold text-indigo-300 mt-1">{abgTriage.anionGap} mEq/L (Normal 8–12)</div>
                </div>

                <div className={styles.osceResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Acid-Base Diagnosis</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{abgTriage.diagnosis}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{abgTriage.compensation}</div>
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
                    <span className="text-indigo-400 font-bold">OSCE Checklist:</span> {node.clinicalProtocol}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect station rubric</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield OSCE Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              OSCE Station Rubric
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Station Focus &amp; Objective</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Step-by-Step Candidate Checklist</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalProtocol}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Key Findings &amp; Clinical Criteria</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Examiner Gold Standard Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("precordial")}
          className={`${styles.modeTab} ${activeMode === "precordial" ? styles.modeTabActive : ""}`}
        >
          🫀 1. Precordial &amp; Murmurs
        </button>
        <button
          onClick={() => setActiveMode("neuro")}
          className={`${styles.modeTab} ${activeMode === "neuro" ? styles.modeTabActive : ""}`}
        >
          🧠 2. Cranial Nerves II–XII
        </button>
        <button
          onClick={() => setActiveMode("acls")}
          className={`${styles.modeTab} ${activeMode === "acls" ? styles.modeTabActive : ""}`}
        >
          ⚡ 3. ATLS &amp; ACLS MegaCode
        </button>
        <button
          onClick={() => setActiveMode("surgical")}
          className={`${styles.modeTab} ${activeMode === "surgical" ? styles.modeTabActive : ""}`}
        >
          ✂️ 4. Suturing &amp; ABG
        </button>
      </div>
    </div>
  );
}
