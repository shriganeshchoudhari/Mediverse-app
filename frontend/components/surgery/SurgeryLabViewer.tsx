"use client";

import React, { useState, useMemo } from "react";
import styles from "./SurgeryLabViewer.module.css";
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
  Scissors,
  Droplet,
  Heart,
  Wind,
  Calculator,
  TrendingUp,
} from "lucide-react";

export type SurgeryLabMode = "acuteAbdomen" | "traumaAtls" | "burnsParkland" | "laparoscopyHernias";

export interface SurgeryLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalAlgorithm: string;
  diagnosticCriteria: string;
  operativeManagement: string;
  highYieldPearl: string;
}

export const SURGERY_NODES: Record<SurgeryLabMode, SurgeryLabNode[]> = {
  acuteAbdomen: [
    {
      id: "acute-appendicitis",
      name: "1. Acute Appendicitis & Alvarado (MANTRELS) Scoring",
      category: "Gastrointestinal Emergencies",
      subType: "Luminal Obstruction • McBurney / Rovsing / Psoas Signs",
      clinicalAlgorithm: "Alvarado Score >= 7 -> Urgent Laparoscopic Appendectomy. Score 5-6 -> Observation + Contrast CT / Ultrasound. Score < 5 -> Unlikely.",
      diagnosticCriteria: "MANTRELS: Migration (1), Anorexia (1), Nausea (1), Tenderness RIF (2), Rebound (1), Elevated Temp (1), Leukocytosis (2), Shift left (1). Total = 10.",
      operativeManagement: "3-Port Laparoscopic Appendectomy; identify base of appendix at convergence of taeniae coli; double-ligate base; prophylactic IV Ceftriaxone + Metronidazole.",
      highYieldPearl: "Psoas sign (pain on passive hip extension) indicates a retrocecal appendix; Obturator sign (pain on internal hip rotation) indicates a pelvic appendix."
    },
    {
      id: "cholecystitis-cholangitis",
      name: "2. Acute Cholecystitis & Acute Suppurative Cholangitis",
      category: "Hepatobiliary Surgery",
      subType: "Murphy's Sign • Charcot's Triad • Reynolds' Pentad",
      clinicalAlgorithm: "Cholecystitis: RUQ ultrasound (wall > 3mm, pericholecystic fluid, sonographic Murphy's) -> Early Laparoscopic Cholecystectomy (< 72h).",
      diagnosticCriteria: "Cholangitis: Charcot's Triad (Fever + RUQ pain + Jaundice); Reynolds' Pentad (+ Hypotension + Confusion -> Suppurative Cholangitis).",
      operativeManagement: "Acute Cholangitis requires emergency ERCP biliary decompression and stenting; Laparoscopic Cholecystectomy scheduled after sepsis resolves.",
      highYieldPearl: "Reynolds' pentad signifies acute toxic suppurative cholangitis with high mortality requiring emergency emergent ERCP biliary drainage."
    },
    {
      id: "perforated-ulcer-sbo",
      name: "3. Peptic Ulcer Perforation & Small Bowel Obstruction",
      category: "Peritoneal Emergencies",
      subType: "Pneumoperitoneum (Graham Patch) • SBO Adhesions",
      clinicalAlgorithm: "Perforation: Sudden severe agony + board-like rigidity -> Erect CXR (Free air under diaphragm) -> Emergency Exploratory Laparotomy + Graham Patch.",
      diagnosticCriteria: "SBO: Colicky pain, bilious vomiting, obstipation, distension; X-ray shows dilated central loops with plicae circulares crossing complete lumen width.",
      operativeManagement: "Perforation: 3-suture Graham omental patch over perforation; SBO: Conservative NG suction/IV fluids for 48h, laparotomy if peritonitis or strangulation.",
      highYieldPearl: "Erect chest X-ray is the single most sensitive initial radiograph to detect pneumoperitoneum (subdiaphragmatic crescent sign) in suspected perforation."
    }
  ],

  traumaAtls: [
    {
      id: "atls-primary-survey",
      name: "1. ATLS Primary Survey: ABCDE Protocol",
      category: "Trauma Resuscitation",
      subType: "Airway / C-Spine • Breathing • Circulation • Disability • Exposure",
      clinicalAlgorithm: "A: Intubation / C-spine collar -> B: Needle decompression for Tension Pneumo -> C: 1:1:1 Blood Transfusion -> D: GCS -> E: Prevent Hypothermia.",
      diagnosticCriteria: "GCS <= 8 mandates immediate definitive endotracheal airway; prevent secondary brain injury by avoiding hypotension (SBP < 90) and hypoxia.",
      operativeManagement: "Surgical Cricothyroidotomy for failed intubation; Emergency thoracotomy for massive hemothorax (> 1500 mL initial drainage).",
      highYieldPearl: "The lethal triad of trauma comprises Hypothermia (< 35 C), Metabolic Acidosis (pH < 7.20), and Coagulopathy (INR > 1.5)."
    },
    {
      id: "hemorrhagic-shock-mtp",
      name: "2. ATLS Hemorrhagic Shock Classes & 1:1:1 MTP",
      category: "Damage Control Resuscitation",
      subType: "Shock Classes I-IV • Balanced Blood Component Therapy",
      clinicalAlgorithm: "Class I (< 15% loss) -> Crystalloid; Class II (15-30% loss) -> Crystalloid; Class III (30-40% loss, hypotension) & Class IV (> 40% loss) -> Activate MTP.",
      diagnosticCriteria: "Class III shock is defined by the onset of measurable Hypotension, Tachycardia (> 120 bpm), Tachypnea (> 30 bpm), and Oliguria.",
      operativeManagement: "Massive Transfusion Protocol (MTP): 1:1:1 ratio of Packed Red Blood Cells (PRBC) : Fresh Frozen Plasma (FFP) : Platelets + Tranexamic Acid (TXA < 3h).",
      highYieldPearl: "Permissive hypotension (target SBP 80-90 mmHg) is maintained until surgical mechanical hemostasis is achieved, preventing clot dislodgement."
    },
    {
      id: "fast-exam-windows",
      name: "3. FAST Exam: 4 Acoustic Peritoneal Windows",
      category: "Trauma Diagnostics",
      subType: "Morison's Pouch • Splenorenal • Pelvic • Pericardial",
      clinicalAlgorithm: "Unstable patient with positive FAST -> Immediate Emergency Exploratory Laparotomy. Stable patient -> Contrast-enhanced Abdominal CT.",
      diagnosticCriteria: "Detection of anechoic (black) fluid in Morison's pouch (hepatorenal recess), splenorenal recess, rectovesical pouch, or subxiphoid pericardium.",
      operativeManagement: "Damage Control Laparotomy: 4-quadrant abdominal packing, control of major vascular bleeding, simple closure of bowel defects, temporary vacuum closure.",
      highYieldPearl: "Morison's pouch (hepatorenal recess) is the most dependent anatomical space in the supine upper abdomen and the most sensitive site for hemoperitoneum."
    }
  ],

  burnsParkland: [
    {
      id: "parkland-formula-dosing",
      name: "1. Parkland Formula & Chronological Fluid Titration",
      category: "Burn Resuscitation",
      subType: "4 mL * Weight (kg) * % TBSA (2nd/3rd Degree)",
      clinicalAlgorithm: "Total 24h Ringer's Lactate = 4 mL * kg * %TBSA. Give 50% in first 8 hours (from time of burn injury), remaining 50% over next 16 hours.",
      diagnosticCriteria: "Indicated for second- and third-degree thermal burns >= 20% TBSA in adults. Wallace Rule of Nines determines % TBSA.",
      operativeManagement: "Indwelling Foley catheter for hourly urine output titration (target 0.5 - 1.0 mL/kg/hour in adults, 1.0 - 2.0 mL/kg/hour in children).",
      highYieldPearl: "The Parkland 8-hour clock starts from the exact moment of the burn injury, NOT from the time of hospital arrival."
    },
    {
      id: "escharotomy-inhalation",
      name: "2. Circumferential Burns & Emergency Escharotomy",
      category: "Burn Surgical Emergencies",
      subType: "Compartment Syndrome • Thoracic Restriction • Airway Inhalation",
      clinicalAlgorithm: "Circumferential chest burn with high ventilatory pressures or limb burn with loss of Doppler pulses -> Immediate Emergency Escharotomy.",
      diagnosticCriteria: "Deep full-thickness leathery eschar with compartment pressure > 30 mmHg or absent distal arterial pulses.",
      operativeManagement: "Longitudinal full-thickness incisions through eschar into subcutaneous fat along mid-medial and mid-lateral lines; no local anesthesia needed.",
      highYieldPearl: "Inhalation injury (facial burns, singed nasal hairs, carbonaceous sputum) causes rapid upper airway edema; perform immediate prophylactic endotracheal intubation."
    }
  ],

  laparoscopyHernias: [
    {
      id: "laparoscopy-co2-mechanics",
      name: "1. Laparoscopy Mechanics & CO2 Pneumoperitoneum",
      category: "Minimally Invasive Surgery",
      subType: "Veress vs Hasson • 12-15 mmHg Pressure • Durant Maneuver",
      clinicalAlgorithm: "Veress needle (closed infraumbilical) or Hasson cannula (open cutdown in prior laparotomy) -> CO2 insufflation to 12-15 mmHg.",
      diagnosticCriteria: "Physiologic changes: elevated SVR, decreased venous return, elevated peak airway pressure, hypercapnia and respiratory acidosis.",
      operativeManagement: "Venous Gas Embolism treatment: Durant Maneuver (Left Lateral Decubitus + Trendelenburg position) + 100% FiO2 + aspirate gas via central line.",
      highYieldPearl: "Carbon dioxide (CO2) is the preferred insufflation gas because it is non-flammable and has high blood solubility, reducing gas embolism lethality."
    },
    {
      id: "inguinal-femoral-hernias",
      name: "2. Inguinal Hernias & Hesselbach's Triangle",
      category: "Abdominal Wall Surgery",
      subType: "Indirect (Lateral) vs Direct (Medial) vs Femoral Ring",
      clinicalAlgorithm: "Indirect: Deep ring lateral to inferior epigastric vessels. Direct: Hesselbach triangle medial to inferior epigastric vessels. Femoral: Sub-inguinal.",
      diagnosticCriteria: "Internal Ring Occlusion Test (Zieman): occluding deep ring prevents indirect hernia bulge on coughing, but direct hernia still protrudes.",
      operativeManagement: "Lichtenstein Tension-Free Mesh Repair (gold standard open) or Laparoscopic TAPP / TEP repair with polypropylene mesh.",
      highYieldPearl: "Femoral hernias have the highest rate of incarceration and strangulation (> 40%) due to unyielding boundaries (lacunar ligament medially)."
    }
  ]
};

interface SurgeryLabViewerProps {
  initialMode?: SurgeryLabMode;
  height?: string;
  onNodeSelect?: (node: SurgeryLabNode) => void;
}

export default function SurgeryLabViewer({
  initialMode = "acuteAbdomen",
  height = "560px",
  onNodeSelect,
}: SurgeryLabViewerProps) {
  const [activeMode, setActiveMode] = useState<SurgeryLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Alvarado Score Checklist State
  const [alvaradoState, setAlvaradoState] = useState<{
    migration: boolean;
    anorexia: boolean;
    nausea: boolean;
    tenderness: boolean;
    rebound: boolean;
    elevatedTemp: boolean;
    leukocytosis: boolean;
    shiftLeft: boolean;
  }>({
    migration: true,
    anorexia: true,
    nausea: true,
    tenderness: true,
    rebound: true,
    elevatedTemp: true,
    leukocytosis: true,
    shiftLeft: false,
  });

  // Trauma Shock State Slider
  const [bloodLossPct, setBloodLossPct] = useState<number>(35); // 0 to 50%

  // Parkland Burn Sliders State
  const [patientWeightKg, setPatientWeightKg] = useState<number>(70); // kg
  const [tbsaBurnPct, setTbsaBurnPct] = useState<number>(36); // %

  // Alvarado Score Calculation
  const alvaradoTotal = useMemo(() => {
    let score = 0;
    if (alvaradoState.migration) score += 1;
    if (alvaradoState.anorexia) score += 1;
    if (alvaradoState.nausea) score += 1;
    if (alvaradoState.tenderness) score += 2; // 2 points
    if (alvaradoState.rebound) score += 1;
    if (alvaradoState.elevatedTemp) score += 1;
    if (alvaradoState.leukocytosis) score += 2; // 2 points
    if (alvaradoState.shiftLeft) score += 1;
    return score;
  }, [alvaradoState]);

  const alvaradoTriage = useMemo(() => {
    if (alvaradoTotal >= 7) {
      return { level: "Definite Appendicitis", action: "Urgent Laparoscopic Appendectomy", color: "text-rose-400" };
    } else if (alvaradoTotal >= 5) {
      return { level: "Possible / Equivocal", action: "Admit for Active Observation & Contrast CT / US", color: "text-amber-400" };
    }
    return { level: "Unlikely Appendicitis", action: "Discharge with Warning Signs Advice", color: "text-emerald-400" };
  }, [alvaradoTotal]);

  // Trauma Shock Calculations
  const shockStaging = useMemo(() => {
    const lossMl = (bloodLossPct / 100) * 5000;
    if (bloodLossPct < 15) {
      return { stage: "Class I Shock", hr: "< 100 bpm", bp: "Normal", lossMl: `${lossMl.toFixed(0)} mL`, fluid: "Crystalloid Fluid" };
    } else if (bloodLossPct < 30) {
      return { stage: "Class II Shock", hr: "100–120 bpm", bp: "Normal (SVR maintained)", lossMl: `${lossMl.toFixed(0)} mL`, fluid: "Crystalloid Fluid" };
    } else if (bloodLossPct < 40) {
      return { stage: "Class III Shock (Decompensated)", hr: "120–140 bpm", bp: "HYPOTENSIVE (SBP < 90)", lossMl: `${lossMl.toFixed(0)} mL`, fluid: "Crystalloid + Blood (PRBC)" };
    }
    return { stage: "Class IV Shock (Pre-Terminal)", hr: "> 140 bpm", bp: "Severe Hypotension", lossMl: `${lossMl.toFixed(0)} mL`, fluid: "Activate 1:1:1 MTP Protocol" };
  }, [bloodLossPct]);

  // Parkland Burn Calculations
  const parklandTotal24hMl = useMemo(() => {
    return 4 * patientWeightKg * tbsaBurnPct;
  }, [patientWeightKg, tbsaBurnPct]);

  const parklandFirst8hRate = useMemo(() => {
    return (parklandTotal24hMl * 0.5) / 8;
  }, [parklandTotal24hMl]);

  const parklandNext16hRate = useMemo(() => {
    return (parklandTotal24hMl * 0.5) / 16;
  }, [parklandTotal24hMl]);

  const currentNodes = useMemo(() => {
    return SURGERY_NODES[activeMode] || SURGERY_NODES.acuteAbdomen;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: SurgeryLabNode) => {
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
            <Scissors size={14} /> SURG-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "acuteAbdomen" && "Acute Abdomen & Alvarado (MANTRELS) Appendicitis Engine"}
            {activeMode === "traumaAtls" && "ATLS Trauma Hemorrhagic Shock & Balanced 1:1:1 MTP Protocol"}
            {activeMode === "burnsParkland" && "Parkland Burn Fluid Resuscitation & Rule of Nines Calculator"}
            {activeMode === "laparoscopyHernias" && "Minimally Invasive Laparoscopy & Inguinal Hernia Anatomy"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Surgery Quiz"}
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
                  General Surgery Case Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Operative Entity: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-emerald-300 font-medium mt-1">{quizFeedback}</div>
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

          {/* Mode 1: Alvarado Appendicitis Checklist */}
          {activeMode === "acuteAbdomen" && (
            <div className={styles.surgSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Alvarado (MANTRELS) Appendicitis Diagnostic Scoring Engine
                </span>
                <span className="text-[11px] font-bold text-rose-300">Score: {alvaradoTotal} / 10</span>
              </div>

              {/* Checklist Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alvaradoState.migration}
                    onChange={(e) => setAlvaradoState({ ...alvaradoState, migration: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Migration (+1)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alvaradoState.anorexia}
                    onChange={(e) => setAlvaradoState({ ...alvaradoState, anorexia: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Anorexia (+1)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alvaradoState.nausea}
                    onChange={(e) => setAlvaradoState({ ...alvaradoState, nausea: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Nausea/Vomiting (+1)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-rose-950/40 rounded border border-rose-800/80 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={alvaradoState.tenderness}
                    onChange={(e) => setAlvaradoState({ ...alvaradoState, tenderness: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span className="text-rose-300">RIF Tenderness (+2)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alvaradoState.rebound}
                    onChange={(e) => setAlvaradoState({ ...alvaradoState, rebound: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Rebound Pain (+1)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alvaradoState.elevatedTemp}
                    onChange={(e) => setAlvaradoState({ ...alvaradoState, elevatedTemp: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Temp &gt;= 37.3°C (+1)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-rose-950/40 rounded border border-rose-800/80 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={alvaradoState.leukocytosis}
                    onChange={(e) => setAlvaradoState({ ...alvaradoState, leukocytosis: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span className="text-rose-300">WBC &gt; 10k (+2)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alvaradoState.shiftLeft}
                    onChange={(e) => setAlvaradoState({ ...alvaradoState, shiftLeft: e.target.checked })}
                    className="accent-rose-500"
                  />
                  <span>Shift Left (+1)</span>
                </label>
              </div>

              {/* Triage Decision Card */}
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">Alvarado Clinical Triage</div>
                  <div className={`text-sm font-bold ${alvaradoTriage.color}`}>{alvaradoTriage.level}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-semibold">Recommended Surgical Action</div>
                  <div className="text-xs font-bold text-slate-200">{alvaradoTriage.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: ATLS Hemorrhagic Shock Simulator */}
          {activeMode === "traumaAtls" && (
            <div className={styles.surgSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={14} /> ATLS Hemorrhagic Shock Staging & 1:1:1 MTP Transfusion Simulator
                </span>
                <span className="text-[11px] text-slate-400">Total Blood Volume: 5,000 mL (70kg)</span>
              </div>

              <div className="text-xs">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Estimated Blood Loss (%):</span>{" "}
                  <strong className="text-rose-400 text-sm">{bloodLossPct}% ({shockStaging.lossMl})</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={bloodLossPct}
                  onChange={(e) => setBloodLossPct(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className={styles.surgResultsGrid}>
                <div className={styles.surgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">ATLS Shock Class</div>
                  <div className={styles.surgResultVal}>{shockStaging.stage}</div>
                </div>
                <div className={styles.surgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Heart Rate</div>
                  <div className="text-sm font-bold text-rose-300 mt-1">{shockStaging.hr}</div>
                </div>
                <div className={styles.surgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Blood Pressure</div>
                  <div className="text-sm font-bold text-rose-300 mt-1">{shockStaging.bp}</div>
                </div>
                <div className={styles.surgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Resuscitation Protocol</div>
                  <div className="text-xs font-bold text-amber-300 mt-1">{shockStaging.fluid}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Parkland Burn Formula Calculator */}
          {activeMode === "burnsParkland" && (
            <div className={styles.surgSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Parkland Burn Resuscitation Formula (4 mL * kg * %TBSA)
                </span>
                <span className="text-[11px] text-slate-400">Ringer's Lactate (Hartmann's)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Patient Weight:</span> <strong className="text-rose-400">{patientWeightKg} kg</strong>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="120"
                    step="5"
                    value={patientWeightKg}
                    onChange={(e) => setPatientWeightKg(parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>2nd/3rd Degree % TBSA:</span> <strong className="text-rose-400">{tbsaBurnPct}% TBSA</strong>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="1"
                    value={tbsaBurnPct}
                    onChange={(e) => setTbsaBurnPct(parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>

              <div className={styles.surgResultsGrid}>
                <div className={styles.surgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Total 24h Ringer's</div>
                  <div className={styles.surgResultVal}>{parklandTotal24hMl.toLocaleString()} mL</div>
                </div>
                <div className={styles.surgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">First 8 Hours Rate</div>
                  <div className="text-sm font-bold text-amber-300 mt-1">{parklandFirst8hRate.toFixed(0)} mL/hour</div>
                </div>
                <div className={styles.surgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Next 16 Hours Rate</div>
                  <div className="text-sm font-bold text-slate-300 mt-1">{parklandNext16hRate.toFixed(0)} mL/hour</div>
                </div>
                <div className={styles.surgResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Target Urine Output</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">{(patientWeightKg * 0.5).toFixed(0)} – {patientWeightKg.toFixed(0)} mL/h</div>
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
                    <span className="text-rose-400 font-bold">Algorithm:</span> {node.clinicalAlgorithm}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect surgical operative protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield General Surgery Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Surgical Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Disease / Surgical Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria & Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔪 Operative & Emergency Management</div>
            <div className={styles.inspectorBody}>{activeNode.operativeManagement}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Bailey & Love / ATLS High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("acuteAbdomen")}
          className={`${styles.modeTab} ${activeMode === "acuteAbdomen" ? styles.modeTabActive : ""}`}
        >
          🔪 1. Acute Abdomen & Alvarado
        </button>
        <button
          onClick={() => setActiveMode("traumaAtls")}
          className={`${styles.modeTab} ${activeMode === "traumaAtls" ? styles.modeTabActive : ""}`}
        >
          🩸 2. Trauma ATLS & Shock
        </button>
        <button
          onClick={() => setActiveMode("burnsParkland")}
          className={`${styles.modeTab} ${activeMode === "burnsParkland" ? styles.modeTabActive : ""}`}
        >
          🔥 3. Burns & Parkland Formula
        </button>
        <button
          onClick={() => setActiveMode("laparoscopyHernias")}
          className={`${styles.modeTab} ${activeMode === "laparoscopyHernias" ? styles.modeTabActive : ""}`}
        >
          🔬 4. Laparoscopy & Hernias
        </button>
      </div>
    </div>
  );
}
