"use client";

import React, { useState, useMemo } from "react";
import styles from "./EmergencyMedicineLabViewer.module.css";
import {
  Activity,
  Heart,
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
  Flame,
  Droplet,
  Calculator,
  TrendingUp,
  Wind,
  Gauge,
  Thermometer,
  Shield,
  Stethoscope,
  Crosshair,
  Pill,
} from "lucide-react";

export type EmergencyMedicineLabMode = "acls" | "shock" | "toxicology" | "trauma";

export interface EmergencyMedicineLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalProtocol: string;
  diagnosticCriteria: string;
  emergencyAction: string;
  highYieldPearl: string;
}

export const EMERGENCY_MEDICINE_NODES: Record<EmergencyMedicineLabMode, EmergencyMedicineLabNode[]> = {
  acls: [
    {
      id: "acls-shockable-vf-pvt",
      name: "1. Shockable Arrest: Ventricular Fibrillation (VF) & Pulseless VT",
      category: "ACLS Cardiac Arrest",
      subType: "VF / Pulseless VT • Defibrillation (120–200J Biphasic) • Epinephrine 1 mg • Amiodarone 300 mg",
      clinicalProtocol: "Immediate Shock -> Resume CPR 2 min -> Check rhythm -> 2nd Shock -> CPR + Epinephrine 1 mg q3-5m -> 3rd Shock -> Amiodarone 300 mg (then 150 mg).",
      diagnosticCriteria: "Unresponsive, pulseless patient with chaotic undulations (VF) or wide monomorphic tachycardia without carotid pulse (pVT).",
      emergencyAction: "Deliver immediate biphasic shock (120–200 J), resume chest compressions for 2 minutes WITHOUT pause for pulse check, and push Epinephrine 1 mg.",
      highYieldPearl: "Never pause chest compressions for a pulse check immediately following a defibrillation shock; resume high-quality CPR instantly for 2 full minutes."
    },
    {
      id: "acls-nonshockable-pea-asystole-5hs-5ts",
      name: "2. Non-Shockable Arrest: PEA / Asystole & The 5 Hs and 5 Ts",
      category: "ACLS Resuscitation",
      subType: "PEA / Asystole • Early Epinephrine 1 mg • The 5 Hs & 5 Ts • Waveform Capnography (EtCO2)",
      clinicalProtocol: "DO NOT SHOCK. Immediate high-quality CPR + Epinephrine 1 mg IV/IO ASAP q3-5m. Aggressively search and reverse the 5 Hs and 5 Ts.",
      diagnosticCriteria: "5 Hs: Hypovolemia, Hypoxia, Hydrogen ion (Acidosis), Hypo/Hyperkalemia, Hypothermia. 5 Ts: Tension pneumo, Tamponade, Toxins, Thrombosis (PE), Thrombosis (MI).",
      emergencyAction: "EtCO2 >= 35–40 mmHg indicates ROSC. If tension pneumo: needle decompression. If hyperkalemia: IV Calcium gluconate + Insulin/Dextrose.",
      highYieldPearl: "In non-shockable cardiac arrest (PEA/Asystole), early intravenous Epinephrine administered as soon as feasible significantly improves return of spontaneous circulation."
    }
  ],

  shock: [
    {
      id: "shock-hemodynamics-classification",
      name: "1. Shock Classification & Hemodynamic Profiling",
      category: "Hemodynamic Monitoring",
      subType: "Hypovolemic • Cardiogenic • Septic • Anaphylactic • Neurogenic • Obstructive",
      clinicalProtocol: "Hypovolemic: CVP low, CO low, SVR high. Cardiogenic: CVP high, CO low, SVR high. Septic: CVP low/normal, CO high->low, SVR profoundly low.",
      diagnosticCriteria: "Target MAP >= 65 mmHg. Septic shock defined by persistent hypotension requiring vasopressors + serum lactate > 2 mmol/L despite fluid resuscitation.",
      emergencyAction: "Septic shock: 30 mL/kg balanced crystalloids within 1 hour + initiate Norepinephrine first-line vasopressor.",
      highYieldPearl: "Norepinephrine is the first-line vasopressor of choice in septic shock due to potent alpha-1 vasoconstriction with modest beta-1 inotropic support."
    },
    {
      id: "anaphylactic-shock-epinephrine",
      name: "2. Severe Anaphylactic Shock & Resuscitation",
      category: "Emergency Resuscitation",
      subType: "IM Epinephrine 0.5 mg (1:1000) • Mid-Anterolateral Thigh • IV Fluids • Glucagon in Beta-Blockers",
      clinicalProtocol: "Immediate IM Epinephrine 0.5 mg (1:1000) anterolateral thigh q5-15m + High-flow O2 + 1–2 L IV NS bolus + H1/H2 blockers + IV Methylprednisolone.",
      diagnosticCriteria: "Acute onset urticaria/angioedema PLUS respiratory compromise (stridor/wheeze) OR sudden hypotension (SBP < 90 mmHg).",
      emergencyAction: "Inject IM Epinephrine immediately. If patient on beta-blockers has refractory hypotension, administer IV Glucagon 1–5 mg.",
      highYieldPearl: "Intramuscular Epinephrine in the mid-anterolateral thigh achieves significantly faster and higher peak plasma concentrations than subcutaneous or deltoid injection."
    }
  ],

  toxicology: [
    {
      id: "toxicology-five-toxidromes",
      name: "1. The 5 Classic Toxidromes: Recognition & Antidotes",
      category: "Clinical Toxicology",
      subType: "Cholinergic (Atropine/2-PAM) • Anticholinergic (Physostigmine) • Sympathomimetic • Opioid (Naloxone)",
      clinicalProtocol: "Cholinergic (DUMBELS, miosis, wet) -> Atropine. Anticholinergic (mydriasis, dry, delirium) -> Physostigmine. Opioid (miosis, bradypnea) -> Naloxone.",
      diagnosticCriteria: "Sympathomimetic (sweaty, dilated pupils, severe HTN) -> IV Benzodiazepines (AVOID pure beta-blockers due to unopposed alpha-vasoconstriction).",
      emergencyAction: "In opioid overdose with respiratory depression (RR <8), titrate IV/IM/IN Naloxone to restore spontaneous respiration without precipitating acute withdrawal.",
      highYieldPearl: "In sympathomimetic cocaine toxicity, never administer pure beta-blockers because unopposed alpha-1 stimulation triggers catastrophic coronary spasm and stroke."
    },
    {
      id: "acetaminophen-rumack-snakebite",
      name: "2. Acetaminophen (Rumack-Matthew NAC) & Snakebite Envenomation",
      category: "Targeted Antidotes",
      subType: "APAP 4h Nomogram • IV N-Acetylcysteine (NAC) • Viperidae 20WBCT • Polyvalent ASV 10 Vials",
      clinicalProtocol: "Plot 4-hour APAP level on Rumack-Matthew nomogram (treatment line >=150 ug/mL at 4h) -> IV NAC 3-bag regimen. Snakebite 20WBCT -> 10 vials ASV in NS.",
      diagnosticCriteria: "NAPQI depletes glutathione -> centrilobular liver necrosis. Viper bite: hemotoxic, 20WBCT uncoagulated at 20 min. Elapid (krait/cobra): neurotoxic ptosis.",
      emergencyAction: "Administer IV NAC loading dose (150 mg/kg over 1h). For viper bite: infuse 10 vials polyvalent ASV over 1 hour; repeat at 6h if 20WBCT uncoagulated.",
      highYieldPearl: "N-Acetylcysteine (NAC) is virtually 100% effective in preventing fulminant hepatic necrosis when initiated within 8 hours of acute acetaminophen ingestion."
    }
  ],

  trauma: [
    {
      id: "atls-primary-survey-abcde",
      name: "1. ATLS Primary Survey (ABCDE) & Tension Pneumothorax",
      category: "Trauma Resuscitation",
      subType: "Airway (C-Spine) • Needle Decompression (5th ICS AAL / 2nd ICS MCL) • Chest Tube • Pelvic Binder",
      clinicalProtocol: "A: Airway + C-spine. B: Tension pneumo -> Immediate needle decompression -> Chest tube (28-32 Fr). C: Hemorrhage control + Pelvic binder.",
      diagnosticCriteria: "Tension pneumothorax: Hyper-resonance, absent breath sounds, tracheal deviation, JVD, shock. NEVER WAIT FOR CHEST X-RAY!",
      emergencyAction: "Insert 14G cannula in 5th ICS anterior axillary line or 2nd ICS MCL, then insert chest tube in the Safe Triangle.",
      highYieldPearl: "Tension pneumothorax is an absolute clinical diagnosis; delaying needle decompression to obtain a chest radiograph is a catastrophic medical error."
    },
    {
      id: "massive-transfusion-lethal-triad",
      name: "2. Massive Transfusion Protocol (MTP 1:1:1), TXA & Lethal Triad",
      category: "Damage Control Resuscitation",
      subType: "MTP 1:1:1 (PRBC:FFP:Platelets) • Tranexamic Acid (TXA 1g) • Lethal Triad (Hypothermia, Acidosis, Coagulopathy)",
      clinicalProtocol: "Activate MTP for severe bleeding: Transfuse 1:1:1 PRBC:FFP:Platelets. Administer IV TXA 1g bolus within 3 hours + 1g over 8h (CRASH-2 trial).",
      diagnosticCriteria: "Lethal trauma triad: Hypothermia (<35C) + Acidosis (pH <7.20) + Trauma-induced coagulopathy. Massive Hemothorax: >1500 mL initial chest tube drainage -> Thoracotomy.",
      emergencyAction: "Warm all transfused blood and fluids, apply pelvic binder, inject IV TXA within 3 hours, and transfer to operating room for damage control laparotomy.",
      highYieldPearl: "Early administration of Tranexamic Acid (TXA 1g IV within 3 hours of injury) significantly reduces bleeding mortality in trauma with no increase in thromboembolism."
    }
  ]
};

interface EmergencyMedicineLabViewerProps {
  initialMode?: EmergencyMedicineLabMode;
  height?: string;
  onNodeSelect?: (node: EmergencyMedicineLabNode) => void;
}

export default function EmergencyMedicineLabViewer({
  initialMode = "acls",
  height = "560px",
  onNodeSelect,
}: EmergencyMedicineLabViewerProps) {
  const [activeMode, setActiveMode] = useState<EmergencyMedicineLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // ACLS Simulator State
  const [selectedRhythm, setSelectedRhythm] = useState<"vf" | "pvt" | "pea" | "asystole">("vf");
  const [etco2Level, setEtco2Level] = useState<number>(38); // mmHg

  // Shock State
  const [shockType, setShockType] = useState<"septic" | "cardiogenic" | "hypovolemic" | "anaphylactic">("septic");
  const [meanArterialPressure, setMeanArterialPressure] = useState<number>(54); // mmHg
  const [norepinephrineDose, setNorepinephrineDose] = useState<number>(12); // mcg/min

  // Toxicology Rumack-Matthew APAP State
  const [apapIngestionHours, setApapIngestionHours] = useState<number>(4); // hours
  const [apapConcentration, setApapConcentration] = useState<number>(195); // ug/mL

  // ACLS Analysis
  const aclsTriage = useMemo(() => {
    const isShockable = selectedRhythm === "vf" || selectedRhythm === "pvt";
    const hasRosc = etco2Level >= 35;

    let guidance = "";
    let color = "text-rose-400 font-extrabold";

    if (isShockable) {
      guidance = "SHOCKABLE RHYTHM: Deliver 200J Biphasic Shock -> Resume CPR 2 min -> Epinephrine 1 mg q3-5m -> Amiodarone 300 mg.";
    } else {
      guidance = "NON-SHOCKABLE RHYTHM: DO NOT SHOCK. Immediate CPR + Epinephrine 1 mg IV/IO ASAP + Search 5 Hs & 5 Ts.";
    }

    return {
      isShockable,
      hasRosc,
      guidance,
      color: isShockable ? "text-rose-400 font-extrabold" : "text-amber-300 font-bold",
      etco2Status: hasRosc ? "ROSC PROBABLE (EtCO2 >= 35 mmHg)" : "Adequate CPR Quality"
    };
  }, [selectedRhythm, etco2Level]);

  // APAP Nomogram Calculation
  const apapToxicityTriage = useMemo(() => {
    // Rumack-Matthew treatment line: 150 ug/mL at 4h, halving every 4h (150 * (0.5)^((h-4)/4))
    const treatmentThreshold = 150 * Math.pow(0.5, (apapIngestionHours - 4) / 4);
    const isToxic = apapConcentration >= treatmentThreshold;

    return {
      threshold: Math.round(treatmentThreshold),
      isToxic,
      status: isToxic ? "ABOVE TREATMENT LINE (Hepatotoxicity Likely)" : "BELOW TREATMENT LINE (Low Toxicity Risk)",
      action: isToxic ? "START IV N-ACETYLCYSTEINE (NAC) IMMEDIATELY" : "Supportive observation / No NAC required",
      color: isToxic ? "text-rose-400 font-extrabold" : "text-emerald-400 font-bold"
    };
  }, [apapIngestionHours, apapConcentration]);

  const currentNodes = useMemo(() => {
    return EMERGENCY_MEDICINE_NODES[activeMode] || EMERGENCY_MEDICINE_NODES.acls;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: EmergencyMedicineLabNode) => {
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
            <Activity size={14} /> EM-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "acls" && "ACLS Cardiac Arrest & Defibrillation Resuscitation Simulator"}
            {activeMode === "shock" && "Shock Hemodynamics, Surviving Sepsis & Vasoactive Inotropes"}
            {activeMode === "toxicology" && "Toxicology Toxidromes & Rumack-Matthew APAP Nomogram Calculator"}
            {activeMode === "trauma" && "ATLS Primary Survey (ABCDE) & Emergency Trauma Procedures"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Emergency Quiz"}
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
                  Emergency Medicine Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Resuscitation Protocol: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: ACLS Arrest Simulator */}
          {activeMode === "acls" && (
            <div className={styles.emSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> AHA ACLS Cardiac Arrest Algorithm &amp; Defibrillation
                </span>
                <span className="text-[11px] text-slate-400">CPR Rate: 100–120 cpm</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedRhythm("vf")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedRhythm === "vf"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  VF (Ventricular Fib)
                </button>
                <button
                  onClick={() => setSelectedRhythm("pvt")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedRhythm === "pvt"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  pVT (Pulseless VT)
                </button>
                <button
                  onClick={() => setSelectedRhythm("pea")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedRhythm === "pea"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  PEA (Pulseless Elec)
                </button>
                <button
                  onClick={() => setSelectedRhythm("asystole")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedRhythm === "asystole"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Asystole (Flatline)
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>End-Tidal CO2 (EtCO2 Capnography):</span>{" "}
                  <strong className="text-rose-400">{etco2Level} mmHg (ROSC Target: &ge; 35 mmHg)</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={etco2Level}
                  onChange={(e) => setEtco2Level(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className={styles.emResultsGrid}>
                <div className={styles.emResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">ACLS Pathway</div>
                  <div className={`text-xs font-bold mt-1 ${aclsTriage.color}`}>
                    {aclsTriage.isShockable ? "⚡ SHOCKABLE (200J Biphasic)" : "⛔ NON-SHOCKABLE (Epi + CPR)"}
                  </div>
                </div>
                <div className={styles.emResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">ROSC Indicator</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{aclsTriage.etco2Status}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Shock Hemodynamics & Inotropes */}
          {activeMode === "shock" && (
            <div className={styles.emSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Shock Hemodynamics &amp; Norepinephrine Titration
                </span>
                <span className="text-[11px] text-slate-400">Target MAP &ge; 65 mmHg</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setShockType("septic")}
                  className={`p-2 rounded font-bold border transition ${
                    shockType === "septic"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Septic Shock
                </button>
                <button
                  onClick={() => setShockType("cardiogenic")}
                  className={`p-2 rounded font-bold border transition ${
                    shockType === "cardiogenic"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Cardiogenic Shock
                </button>
                <button
                  onClick={() => setShockType("hypovolemic")}
                  className={`p-2 rounded font-bold border transition ${
                    shockType === "hypovolemic"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Hypovolemic Shock
                </button>
                <button
                  onClick={() => setShockType("anaphylactic")}
                  className={`p-2 rounded font-bold border transition ${
                    shockType === "anaphylactic"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Anaphylactic Shock
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {shockType === "septic" && (
                  <div>
                    <div className="text-rose-400 font-bold">Septic Shock (Distributive Vasodilation)</div>
                    <div className="text-slate-300 mt-1">CVP normal/low, CO high &rarr; low, SVR profoundly low. 30 mL/kg crystalloids within 1 hour + Norepinephrine first-line.</div>
                  </div>
                )}
                {shockType === "cardiogenic" && (
                  <div>
                    <div className="text-rose-400 font-bold">Cardiogenic Shock (Pump Failure)</div>
                    <div className="text-slate-300 mt-1">CVP/PCWP elevated (&gt;18 mmHg), CO low (&lt;2.2 L/min/m2), SVR high. Dobutamine + Norepinephrine + Emergency PCI. Avoid fluid boluses!</div>
                  </div>
                )}
                {shockType === "hypovolemic" && (
                  <div>
                    <div className="text-rose-400 font-bold">Hypovolemic Shock (Volume Loss)</div>
                    <div className="text-slate-300 mt-1">CVP low, PCWP low, CO low, SVR high. 30 mL/kg crystalloids or MTP 1:1:1 blood components for hemorrhage.</div>
                  </div>
                )}
                {shockType === "anaphylactic" && (
                  <div>
                    <div className="text-rose-400 font-bold">Anaphylactic Shock (IgE Degranulation)</div>
                    <div className="text-slate-300 mt-1">IM Epinephrine 0.5 mg (1:1000) mid-anterolateral thigh immediately + IV fluids + H1/H2 blockers + Steroids.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Toxicology & Rumack-Matthew APAP Nomogram */}
          {activeMode === "toxicology" && (
            <div className={styles.emSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill size={14} /> Acetaminophen Rumack-Matthew Nomogram Calculator
                </span>
                <span className="text-[11px] text-slate-400">NAC 3-Bag Infusion</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Hours Post-Ingestion:</span>{" "}
                    <strong className="text-rose-400">{apapIngestionHours} hours</strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    step="1"
                    value={apapIngestionHours}
                    onChange={(e) => setApapIngestionHours(parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Serum APAP Level:</span>{" "}
                    <strong className="text-rose-400">{apapConcentration} &mu;g/mL</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="350"
                    step="5"
                    value={apapConcentration}
                    onChange={(e) => setApapConcentration(parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>

              <div className={styles.emResultsGrid}>
                <div className={styles.emResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Treatment Threshold at {apapIngestionHours}h</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{apapToxicityTriage.threshold} &mu;g/mL</div>
                </div>

                <div className={styles.emResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Toxicity Risk</div>
                  <div className={`text-xs font-bold mt-1 ${apapToxicityTriage.color}`}>{apapToxicityTriage.status}</div>
                </div>

                <div className={styles.emResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Antidote Action</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{apapToxicityTriage.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: ATLS Trauma & Emergency Decompression */}
          {activeMode === "trauma" && (
            <div className={styles.emSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> ATLS Primary Survey (ABCDE) &amp; Emergency Procedures
                </span>
                <span className="text-[11px] text-slate-400">MTP 1:1:1 + TXA 1g</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-400 font-bold">Tension Pneumothorax Decompression</div>
                  <div className="text-slate-300 mt-1">14G needle in 5th ICS anterior axillary line or 2nd ICS MCL &rarr; Chest tube (28–32 Fr) in Safe Triangle.</div>
                  <div className="text-emerald-400 font-bold mt-1">Clinical diagnosis: NEVER wait for chest X-ray!</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-400 font-bold">Massive Transfusion Protocol (MTP)</div>
                  <div className="text-slate-300 mt-1">1:1:1 ratio PRBCs : FFP : Platelets. Administer IV Tranexamic Acid (TXA 1g) within 3 hours.</div>
                  <div className="text-sky-400 font-bold mt-1">Lethal Triad: Hypothermia + Acidosis + Coagulopathy.</div>
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
                    <span className="text-rose-400 font-bold">Protocol:</span> {node.clinicalProtocol}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect resuscitation protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Emergency Medicine Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Emergency Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Emergency Focus / Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Immediate Resuscitation &amp; Dosing</div>
            <div className={styles.inspectorBody}>{activeNode.emergencyAction}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Rosen &amp; Tintinalli Gold Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("acls")}
          className={`${styles.modeTab} ${activeMode === "acls" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. ACLS Cardiac Arrest
        </button>
        <button
          onClick={() => setActiveMode("shock")}
          className={`${styles.modeTab} ${activeMode === "shock" ? styles.modeTabActive : ""}`}
        >
          🩸 2. Shock &amp; Inotropes
        </button>
        <button
          onClick={() => setActiveMode("toxicology")}
          className={`${styles.modeTab} ${activeMode === "toxicology" ? styles.modeTabActive : ""}`}
        >
          🧪 3. Toxicology &amp; Antidotes
        </button>
        <button
          onClick={() => setActiveMode("trauma")}
          className={`${styles.modeTab} ${activeMode === "trauma" ? styles.modeTabActive : ""}`}
        >
          🛡️ 4. ATLS Trauma &amp; MTP
        </button>
      </div>
    </div>
  );
}
