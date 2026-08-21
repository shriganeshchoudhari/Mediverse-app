"use client";

import React, { useState, useMemo } from "react";
import styles from "./CardiovascularLabViewer.module.css";
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
} from "lucide-react";

export type CardiovascularLabMode = "pvloop" | "jvp" | "shock" | "acls";

export interface CardiovascularLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  hemodynamicProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const CARDIOVASCULAR_LAB_NODES: Record<CardiovascularLabMode, CardiovascularLabNode[]> = {
  pvloop: [
    {
      id: "cardio-pv-aortic-stenosis",
      name: "Aortic Stenosis (High Peak Pressure & Afterload)",
      category: "Pressure Overload",
      subType: "Peak LV Pressure >200 mmHg • Increased Afterload • Concentric Hypertrophy • Narrow Loop",
      hemodynamicProfile: "High peak LV systolic pressure generating a large transvalvular gradient; increased ESV, decreased SV.",
      pathophysiology: "Fixed mechanical obstruction to LV outflow causes massive pressure overload, triggering concentric LV wall thickening.",
      clinicalHallmarks: "Pulsus parvus et tardus, harsh crescendo-decrescendo systolic murmur at 2nd right ICS radiating to carotids, soft S2.",
      highYieldPearls: "On PV loop, peak systolic pressure is markedly elevated, loop narrows with reduced SV, and diastolic compliance decreases."
    },
    {
      id: "cardio-pv-aortic-regurgitation",
      name: "Aortic Regurgitation (Loss of Isovolumetric Phases & High EDV)",
      category: "Volume Overload",
      subType: "No Isovolumetric Phases • Massive EDV • Wide Pulse Pressure • Eccentric Dilation",
      hemodynamicProfile: "Markedly increased EDV, increased total SV, wide pulse pressure (e.g. 150/40 mmHg); no true isovolumetric contraction/relaxation.",
      pathophysiology: "Retrograde diastolic blood flow from aorta into LV creates severe combined volume and pressure overload.",
      clinicalHallmarks: "Water-hammer / Corrigan pulse, early decrescendo diastolic murmur at left sternal border, head bobbing (de Musset sign).",
      highYieldPearls: "Because the incompetent aortic valve never seals in diastole, the PV loop loses its vertical isovolumetric boundaries entirely."
    }
  ],

  jvp: [
    {
      id: "cardio-jvp-constrictive-pericarditis",
      name: "Constrictive Pericarditis (Sharp 'y' & Kussmaul Sign)",
      category: "Pericardial Disease",
      subType: "Steep 'x' & Deep 'y' Descent • Dip-and-Plateau • Positive Kussmaul Sign • Pericardial Knock",
      hemodynamicProfile: "Elevated JVP with prominent rapid 'x' and sharp deep 'y' descent; dip-and-plateau (square-root sign) on ventricular tracing.",
      pathophysiology: "Rigid, calcified, fibrotic pericardial shell halts mid-diastolic ventricular filling after rapid early inflow.",
      clinicalHallmarks: "Elevated JVP that rises on inspiration (Kussmaul sign), early diastolic pericardial knock sound, hepatomegaly, ascites, minimal pulsus paradoxus.",
      highYieldPearls: "Contrasts with Cardiac Tamponade where the 'y' descent is BLUNTED or completely ABSENT and pulsus paradoxus is prominent."
    },
    {
      id: "cardio-jvp-cannon-a-waves",
      name: "Cannon 'a' Waves (AV Dissociation & Heart Block)",
      category: "Arrhythmia Hemodynamics",
      subType: "AV Dissociation • Complete Heart Block • Ventricular Tachycardia • Closed Tricuspid Valve",
      hemodynamicProfile: "Intermittent, giant presystolic pressure spikes (>20 mmHg) transmitted retrograde into jugular veins.",
      pathophysiology: "Right atrium depolarizes and contracts actively against a closed tricuspid valve during ventricular systole.",
      clinicalHallmarks: "Irregular, dramatic bounding venous surges in the neck; severe bradycardia (in 3rd-degree AV block) or wide-complex tachycardia.",
      highYieldPearls: "Intermittent cannon 'a' waves are pathognomonic of AV dissociation (Complete Heart Block or Ventricular Tachycardia)."
    }
  ],

  shock: [
    {
      id: "cardio-shock-cardiogenic",
      name: "Cardiogenic Shock (Congestion & Pump Failure)",
      category: "Circulatory Shock",
      subType: "High CVP (>15) • High PCWP (>18) • Low CI (<2.0) • High SVR (>1800) • Low SvO2 (<50%)",
      hemodynamicProfile: "Elevated biventricular filling pressures (CVP/PCWP), severely depressed Cardiac Index, high compensatory SVR, low SvO2.",
      pathophysiology: "Primary myocardial contractility failure (e.g. extensive anterior STEMI) results in forward low output and backward congestion.",
      clinicalHallmarks: "Hypotension, cold clammy extremities, oliguria, pulmonary rales, elevated JVP, S3 gallop; requires inotropes (Dobutamine) and IABP/Impella.",
      highYieldPearls: "Cardiogenic shock is the only shock type with BOTH elevated PCWP and severely low Cardiac Index with high SVR."
    },
    {
      id: "cardio-shock-distributive-septic",
      name: "Distributive / Septic Shock (Vasoplegia & High Output)",
      category: "Circulatory Shock",
      subType: "Low/Normal CVP • Low/Normal PCWP • High CI (>4.0) • Low SVR (<600) • High SvO2 (>75%)",
      hemodynamicProfile: "Low filling pressures, elevated Cardiac Index (hyperdynamic), severely depressed SVR, high mixed venous SvO2.",
      pathophysiology: "Widespread cytokine-mediated endothelial nitric oxide release causes severe peripheral vasodilation and vascular permeability.",
      clinicalHallmarks: "Warm flushed peripheries, bounding pulses, wide pulse pressure; resuscitated with IV balanced crystalloids (30 mL/kg) + Norepinephrine.",
      highYieldPearls: "Severely low SVR with a hyperdynamic Cardiac Index is unique to Distributive/Septic shock."
    }
  ],

  acls: [
    {
      id: "cardio-acls-shockable-arrest",
      name: "Shockable Pulseless Arrest (Defibrillation & Amiodarone)",
      category: "Cardiac Arrest",
      subType: "VF / Pulseless VT • Immediate 200 J Defib • 2 min CPR • Epinephrine 1 mg • Amiodarone 300 mg",
      hemodynamicProfile: "Zero cardiac output and absent cerebral perfusion pressure during chaotic ventricular fibrillation.",
      pathophysiology: "Reentrant ventricular arrhythmia produces mechanical arrest without coordinated ventricular contraction.",
      clinicalHallmarks: "Unresponsive, apnoeic, pulseless; immediate high-energy unsynchronized defibrillation (200 J biphasic) followed by 2 min continuous CPR.",
      highYieldPearls: "Never pause CPR immediately after shock delivery; resume chest compressions for 2 full minutes before rhythm/pulse re-check."
    },
    {
      id: "cardio-acls-unstable-tachycardia",
      name: "Unstable Tachycardia (Synchronized Cardioversion)",
      category: "Tachyarrhythmia",
      subType: "Hypotension • Altered Mentation • Shock • Ischemia • Synchronized Cardioversion",
      hemodynamicProfile: "Severe rate-dependent reduction in diastolic ventricular filling time producing acute hemodynamic compromise.",
      pathophysiology: "Heart rates >150 bpm severely reduce stroke volume and coronary perfusion, precipitating acute circulatory collapse.",
      clinicalHallmarks: "Hypotension (SBP <90 mmHg), acute pulmonary edema, angina, altered mental status; requires immediate Synchronized Cardioversion.",
      highYieldPearls: "Synchronized shock timing prevents delivery on the T wave, avoiding R-on-T degeneration into Ventricular Fibrillation."
    }
  ]
};

interface CardiovascularLabViewerProps {
  initialMode?: CardiovascularLabMode;
  height?: string;
  onNodeSelect?: (node: CardiovascularLabNode) => void;
}

export default function CardiovascularLabViewer({
  initialMode = "pvloop",
  height = "560px",
  onNodeSelect,
}: CardiovascularLabViewerProps) {
  const [activeMode, setActiveMode] = useState<CardiovascularLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Valvular PV Loop Selector State
  const [selectedPv, setSelectedPv] = useState<"as" | "ar" | "ms" | "mr">("as");

  // Shock Selector State
  const [selectedShock, setSelectedShock] = useState<"hypovolemic" | "cardiogenic" | "distributive" | "obstructive">("cardiogenic");

  const pvDetails = useMemo(() => {
    if (selectedPv === "as") {
      return {
        title: "Aortic Stenosis (Pressure Overload)",
        loopShift: "Marked increase in peak LV systolic pressure (>200 mmHg); tall narrow loop",
        volumes: "Increased ESV, Decreased Stroke Volume (SV), Concentric LV Hypertrophy",
        pearl: "Transvalvular systolic pressure gradient generates pulsus parvus et tardus."
      };
    } else if (selectedPv === "ar") {
      return {
        title: "Aortic Regurgitation (Volume Overload)",
        loopShift: "No isovolumetric relaxation or contraction phases; massive rightward shift",
        volumes: "Severely Elevated EDV, Elevated Total SV, Wide Pulse Pressure (150/40 mmHg)",
        pearl: "Aortic valve never seals in diastole, eliminating isovolumetric boundaries."
      };
    } else if (selectedPv === "ms") {
      return {
        title: "Mitral Stenosis (Impaired Diastolic Filling)",
        loopShift: "Leftward shift with marked reduction in width; small loop",
        volumes: "Markedly Decreased EDV, Decreased SV, Elevated LA and Pulmonary Venous Pressures",
        pearl: "Opening snap followed by low-pitched rumbling diastolic murmur."
      };
    } else {
      return {
        title: "Mitral Regurgitation (Volume Overload)",
        loopShift: "No true isovolumetric phases; triangular loop with early systolic backflow into LA",
        volumes: "Increased EDV, Decreased ESV, Increased Total SV with reduced forward SV",
        pearl: "Regurgitant flow into low-pressure left atrium begins immediately at onset of systole."
      };
    }
  }, [selectedPv]);

  const shockDetails = useMemo(() => {
    if (selectedShock === "hypovolemic") {
      return {
        title: "Hypovolemic Shock (Hemorrhage / Fluid Loss)",
        parameters: "CVP: Low (↓) • PCWP: Low (↓) • CI: Low (↓) • SVR: High (↑) • SvO2: Low (↓)",
        management: "Rapid IV balanced crystalloids (30 mL/kg) or emergency blood transfusion",
        pearl: "High SVR represents compensatory systemic vasoconstriction in response to low preload."
      };
    } else if (selectedShock === "cardiogenic") {
      return {
        title: "Cardiogenic Shock (Pump Failure / Acute MI)",
        parameters: "CVP: High (↑) • PCWP: High (↑) • CI: Severely Low (↓↓) • SVR: High (↑) • SvO2: Low (↓)",
        management: "Inotropes (Dobutamine / Milrinone), Norepinephrine, IABP, Impella mechanical support",
        pearl: "Cardiogenic shock has BOTH elevated PCWP (>18 mmHg) and severely depressed CI (<2.0 L/min/m2)."
      };
    } else if (selectedShock === "distributive") {
      return {
        title: "Distributive / Septic Shock (Vasoplegia)",
        parameters: "CVP: Low/Normal (↓) • PCWP: Low/Normal (↓) • CI: High (↑) • SVR: Severely Low (↓↓) • SvO2: High (↑)",
        management: "IV Balanced Crystalloids (30 mL/kg) + First-line IV Norepinephrine (target MAP >=65)",
        pearl: "Profoundly low SVR (<600 dynes) with warm extremities and hyperdynamic CI."
      };
    } else {
      return {
        title: "Obstructive Shock (Massive PE / Tamponade)",
        parameters: "CVP: Very High (↑↑) • PCWP: Low/Normal (↓) • CI: Low (↓) • SVR: High (↑) • SvO2: Low (↓)",
        management: "Immediate relief of mechanical obstruction: Pericardiocentesis, Thrombolysis, Embolectomy",
        pearl: "Elevated right-sided filling pressures with impaired left-sided diastolic filling."
      };
    }
  }, [selectedShock]);

  const currentNodes = useMemo(() => {
    return CARDIOVASCULAR_LAB_NODES[activeMode] || CARDIOVASCULAR_LAB_NODES.pvloop;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: CardiovascularLabNode) => {
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
            <HeartPulse size={14} /> CARD-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "pvloop" && "Wiggers Diagram & Valvular Pressure-Volume (PV) Loops"}
            {activeMode === "jvp" && "Jugular Venous Pressure (JVP) Waveforms & Pericardial Hemodynamics"}
            {activeMode === "shock" && "Invasive Shock Profiling (Swan-Ganz) & Heart Failure Phenotypes"}
            {activeMode === "acls" && "Advanced ACLS Resuscitation Algorithms & Arrhythmia Protocols"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Cardio Hemodynamics Quiz"}
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
                  Cardiovascular Hemodynamics Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Hemodynamic Entity: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: PV Loop Explorer */}
          {activeMode === "pvloop" && (
            <div className={styles.cardioCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Valvular Pressure-Volume (PV) Loop Simulator
                </span>
                <span className="text-[11px] text-slate-400">AS &bull; AR &bull; MS &bull; MR</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedPv("as")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPv === "as"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Aortic Stenosis (AS)
                </button>
                <button
                  onClick={() => setSelectedPv("ar")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPv === "ar"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌊 Aortic Regurgitation (AR)
                </button>
                <button
                  onClick={() => setSelectedPv("ms")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPv === "ms"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🚪 Mitral Stenosis (MS)
                </button>
                <button
                  onClick={() => setSelectedPv("mr")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPv === "mr"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔄 Mitral Regurgitation (MR)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-rose-300">{pvDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-rose-400">PV Loop Morphology:</strong> {pvDetails.loopShift}</div>
                <div className="text-rose-200 mt-1"><strong className="text-rose-400">Chamber Volumes:</strong> {pvDetails.volumes}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Auscultation &amp; Pearl:</strong> {pvDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: JVP Waveforms */}
          {activeMode === "jvp" && (
            <div className={styles.cardioCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio size={14} /> Jugular Venous Pressure (JVP) &amp; Pericardial Dynamics
                </span>
                <span className="text-[11px] text-slate-400">a &bull; c &bull; x &bull; v &bull; y &bull; Kussmaul</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Constrictive Pericarditis vs Tamponade</div>
                  <div className="text-slate-300 mt-1">Constriction: Sharp deep 'y' descent (dip-and-plateau), positive Kussmaul sign. Tamponade: BLUNTED/ABSENT 'y' descent, pulsus paradoxus &gt;10 mmHg, Beck triad.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Cannon 'a' Waves &amp; Giant 'v' Waves</div>
                  <div className="text-slate-300 mt-1">Cannon 'a': RA contracts against closed tricuspid in AV dissociation (Complete Heart Block, VT). Giant 'v': Tricuspid regurgitation systolic backjet.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Shock Profiling */}
          {activeMode === "shock" && (
            <div className={styles.cardioCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge size={14} /> Invasive Swan-Ganz Shock Profiling
                </span>
                <span className="text-[11px] text-slate-400">CVP &bull; PCWP &bull; CI &bull; SVR &bull; SvO2</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedShock("hypovolemic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedShock === "hypovolemic"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💧 Hypovolemic
                </button>
                <button
                  onClick={() => setSelectedShock("cardiogenic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedShock === "cardiogenic"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💔 Cardiogenic
                </button>
                <button
                  onClick={() => setSelectedShock("distributive")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedShock === "distributive"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔥 Distributive / Septic
                </button>
                <button
                  onClick={() => setSelectedShock("obstructive")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedShock === "obstructive"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🛑 Obstructive (PE)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-rose-300">{shockDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{shockDetails.parameters}</div>
                <div className="text-slate-300 mt-1"><strong className="text-rose-400">Targeted Protocol:</strong> {shockDetails.management}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Hemodynamic Pearl:</strong> {shockDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: ACLS Resuscitation */}
          {activeMode === "acls" && (
            <div className={styles.cardioCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> AHA ACLS Arrhythmia Algorithms &amp; Pharmacotherapy
                </span>
                <span className="text-[11px] text-slate-400">Cardioversion &bull; Defib 200 J &bull; Epinephrine &bull; Amiodarone</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Shockable Pulseless Arrest (VF/pVT)</div>
                  <div className="text-slate-300 mt-1">Defibrillation 200 J biphasic -&gt; CPR 2 min -&gt; Epinephrine 1 mg q3-5min -&gt; Amiodarone 300 mg bolus (then 150 mg). Do NOT pause CPR immediately after shock!</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Tachycardia with Pulse (Stable vs Unstable)</div>
                  <div className="text-slate-300 mt-1">Unstable (hypotension, altered mentation, shock, angina) -&gt; Synchronized Cardioversion. Stable SVT -&gt; Vagal maneuvers -&gt; IV Adenosine 6 mg / 12 mg.</div>
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
                    <span className="text-rose-400 font-bold">Hemodynamics:</span> {node.hemodynamicProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect dynamics</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Cardiovascular Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Cardio Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🫀 Lesion / Clinical Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📊 Pressure-Volume &amp; Hemodynamics</div>
            <div className="text-xs text-rose-300 font-semibold">{activeNode.hemodynamicProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Physical Exam &amp; Auscultation</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Hemodynamic Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("pvloop")}
          className={`${styles.modeTab} ${activeMode === "pvloop" ? styles.modeTabActive : ""}`}
        >
          🔄 1. Valvular PV Loops
        </button>
        <button
          onClick={() => setActiveMode("jvp")}
          className={`${styles.modeTab} ${activeMode === "jvp" ? styles.modeTabActive : ""}`}
        >
          📈 2. JVP Waveforms
        </button>
        <button
          onClick={() => setActiveMode("shock")}
          className={`${styles.modeTab} ${activeMode === "shock" ? styles.modeTabActive : ""}`}
        >
          🚨 3. Shock Profiling
        </button>
        <button
          onClick={() => setActiveMode("acls")}
          className={`${styles.modeTab} ${activeMode === "acls" ? styles.modeTabActive : ""}`}
        >
          ⚡ 4. ACLS Protocols
        </button>
      </div>
    </div>
  );
}
