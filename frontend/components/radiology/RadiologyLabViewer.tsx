"use client";

import React, { useState, useMemo } from "react";
import styles from "./RadiologyLabViewer.module.css";
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
  Eye,
  Radio,
  Scan,
  Shield,
  Stethoscope,
} from "lucide-react";

export type RadiologyLabMode = "cxrAbcde" | "headCt" | "fastUltrasound" | "mriPhysics";

export interface RadiologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  radiologicalPattern: string;
  diagnosticCriteria: string;
  clinicalSignificance: string;
  highYieldPearl: string;
}

export const RADIOLOGY_NODES: Record<RadiologyLabMode, RadiologyLabNode[]> = {
  cxrAbcde: [
    {
      id: "cxr-silhouette-pneumonia",
      name: "1. The Silhouette Sign & Lobar Consolidation",
      category: "Thoracic Radiography",
      subType: "RML (Right Heart Border) • Lingula (Left Heart Border) • Lower Lobe (Diaphragm)",
      radiologicalPattern: "Loss of normal interface between structures of identical water density. RML consolidates -> effaces right heart border. Air bronchograms present.",
      diagnosticCriteria: "Opaque airspace consolidation with patent branching bronchial tree lucencies (Air Bronchogram Sign) in anatomic lobar distribution.",
      clinicalSignificance: "Differentiates middle vs lower lobe pneumonias and confirms alveolar consolidation requiring targeted antibiotic therapy.",
      highYieldPearl: "Right Middle Lobe (RML) consolidation effaces the right heart border while the right hemidiaphragm remains crisp; Lower lobe consolidation effaces the hemidiaphragm."
    },
    {
      id: "cxr-pneumothorax-chf",
      name: "2. Tension Pneumothorax & Congestive Heart Failure",
      category: "Thoracic Emergencies",
      subType: "Deep Sulcus Sign • Tracheal Shift • CTR >0.5 • Kerley B Lines",
      radiologicalPattern: "Tension Pneumothorax: Hyperlucent hemithorax, absent lung markings, contralateral tracheal push. CHF: Cardiomegaly CTR >0.5, Kerley B lines, Bat-wing edema.",
      diagnosticCriteria: "Deep sulcus sign on supine radiograph. Kerley B lines (short horizontal lines at lateral bases) indicating interlobular septal fluid engorgement.",
      clinicalSignificance: "Tension pneumothorax requires immediate needle decompression (14G in 2nd ICS MCL or 5th ICS AAL); acute pulmonary edema requires IV Furosemide.",
      highYieldPearl: "Tension pneumothorax shifts the trachea AWAY (contralateral) from the diseased hemithorax; Atelectasis pulls the trachea TOWARDS (ipsilateral) the lesion."
    }
  ],

  headCt: [
    {
      id: "ncct-epidural-subdural-hemorrhage",
      name: "1. Intracranial Hemorrhage: Epidural (EDH) vs Subdural (SDH)",
      category: "Neurotrauma Computed Tomography",
      subType: "EDH (Biconvex, Middle Meningeal Artery) • SDH (Crescentic, Bridging Veins)",
      radiologicalPattern: "EDH: Biconvex/lentiform hyperdense extra-axial mass, limited by cranial sutures. SDH: Crescentic concave hyperdensity crossing sutures.",
      diagnosticCriteria: "EDH: Middle meningeal artery laceration with temporal bone fracture and lucid interval. SDH: Bridging cortical vein tears in elderly/atrophy.",
      clinicalSignificance: "EDH with mass effect / midline shift >5mm requires emergency craniotomy; SDH chronicity: acute (hyperdense), subacute (isodense), chronic (hypodense).",
      highYieldPearl: "Epidural hematomas CANNOT cross cranial sutures because the periosteal dura is firmly adherent at suture lines; Subdural hematomas freely cross suture lines."
    },
    {
      id: "ncct-subarachnoid-ischemic-stroke",
      name: "2. Subarachnoid Hemorrhage (SAH) & Acute Ischemic Stroke",
      category: "Cerebrovascular Emergencies",
      subType: "SAH Star of Death • Hyperdense MCA Sign • Loss of Insular Ribbon",
      radiologicalPattern: "SAH: Hyperdense blood filling basal cisterns and sulci (star of death). Stroke: Hyperdense MCA sign, insular ribbon loss, cytotoxic edema.",
      diagnosticCriteria: "SAH: Saccular aneurysm rupture (anterior communicating 85%); thunderclap headache (LP for xanthochromia if CT negative). Stroke: Rule out hemorrhage for tPA.",
      clinicalSignificance: "Immediate NCCT rules out hemorrhage within 4.5h window for IV thrombolysis; SAH requires urgent endovascular coiling / surgical clipping.",
      highYieldPearl: "If non-contrast head CT is negative in a patient with a suspected thunderclap subarachnoid hemorrhage, a Lumbar Puncture is mandatory to detect CSF xanthochromia."
    }
  ],

  fastUltrasound: [
    {
      id: "fast-morison-pouch-tamponade",
      name: "1. FAST 4 Acoustic Windows & Hemoperitoneum Triage",
      category: "Trauma Resuscitation Ultrasound",
      subType: "Morison's Pouch (Hepatorenal) • Splenorenal • Pelvic Pouch of Douglas • Subxiphoid",
      radiologicalPattern: "Anechoic (black) fluid stripe separating echogenic liver and right kidney in Morison's pouch (most dependent space). Pericardial tamponade: RV diastolic collapse.",
      diagnosticCriteria: "Detection of free intraperitoneal fluid in blunt trauma. Positive FAST in hypotensive trauma patient = immediate emergency laparotomy.",
      clinicalSignificance: "Eliminates need for CT scan in unstable patients; expedites definitive surgical damage-control resuscitation.",
      highYieldPearl: "Morison's pouch (hepatorenal space) is the most dependent peritoneal space in the supine patient and the earliest site of free hemoperitoneum accumulation."
    },
    {
      id: "efast-lung-sliding-pneumothorax",
      name: "2. Extended FAST (E-FAST): Thoracic Scanning & M-Mode",
      category: "Point-of-Care Ultrasound",
      subType: "Normal (Seashore Sign) • Pneumothorax (Stratosphere/Barcode Sign) • Lung Point",
      radiologicalPattern: "Normal: Hyperechoic pleural line with shimmering lung sliding (M-mode seashore sign). Pneumothorax: Immobile pleural line (M-mode barcode/stratosphere sign).",
      diagnosticCriteria: "Loss of lung sliding + absence of B-lines + presence of Lung Point sign (100% specific for pneumothorax).",
      clinicalSignificance: "Rapid bedside diagnosis of occult and tension pneumothorax in trauma resuscitation before chest radiography.",
      highYieldPearl: "The Lung Point sign represents the exact physical boundary where pneumothorax transitions to normal lung sliding and is 100% specific for pneumothorax."
    }
  ],

  mriPhysics: [
    {
      id: "mri-t1-t2-flair-dwi",
      name: "1. MRI Tissue Sequences: T1, T2, FLAIR & DWI in Stroke",
      category: "Magnetic Resonance Imaging",
      subType: "T1 (Fluid Dark) • T2 (Fluid Bright) • FLAIR (CSF Suppressed) • DWI (Stroke)",
      radiologicalPattern: "T1: Fat bright, CSF dark. T2: CSF/Fluid bright. FLAIR: T2 with CSF suppressed (MS plaques bright). DWI: Hyperintense cytotoxic edema in acute stroke.",
      diagnosticCriteria: "DWI restriction (bright DWI + dark ADC map) is 100% sensitive for acute ischemic stroke within minutes of arterial occlusion.",
      clinicalSignificance: "Accurate sequence selection pinpoints multiple sclerosis demyelinating plaques, cerebral abscesses, and hyperacute ischemic strokes.",
      highYieldPearl: "Remember: 'T1 = Fluid is One / Dark' (best for anatomy), 'T2 = H2O is Bright' (best for edema/pathology), and DWI shows acute ischemic stroke within minutes."
    },
    {
      id: "radiation-safety-alara-inverse-square",
      name: "2. Radiation Safety, ALARA Principle & Inverse Square Law",
      category: "Radiation Physics & Safety",
      subType: "ALARA • Time, Distance, Shielding (Lead 0.5mm Pb) • Inverse Square (1/d^2)",
      radiologicalPattern: "Radiation intensity decreases with square of distance (I = 1/d^2). Doubling distance reduces radiation exposure by 75% (to 1/4).",
      diagnosticCriteria: "Deterministic effects (threshold exists, e.g. skin burns, cataracts) vs Stochastic effects (no threshold, e.g. cancer induction).",
      clinicalSignificance: "Ensures occupational protection for healthcare personnel using lead aprons (0.5mm Pb) and minimizing fluoroscopy exposure time.",
      highYieldPearl: "The Inverse Square Law dictates that doubling your distance from the radiation source reduces your radiation exposure to 1/4 (25%) of the initial dose."
    }
  ]
};

interface RadiologyLabViewerProps {
  initialMode?: RadiologyLabMode;
  height?: string;
  onNodeSelect?: (node: RadiologyLabNode) => void;
}

export default function RadiologyLabViewer({
  initialMode = "cxrAbcde",
  height = "560px",
  onNodeSelect,
}: RadiologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<RadiologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // CXR Simulation State
  const [cxrCondition, setCxrCondition] = useState<"normal" | "rmlPneumonia" | "rllPneumonia" | "pneumothorax" | "chf">("rmlPneumonia");
  const [cxrProjection, setCxrProjection] = useState<"pa" | "ap">("pa");

  // Head CT Hemorrhage State
  const [ctHemorrhageType, setCtHemorrhageType] = useState<"edh" | "sdh" | "sah" | "stroke">("edh");
  const [sdhChronicity, setSdhChronicity] = useState<"acute" | "subacute" | "chronic">("acute");

  // Radiation Distance State
  const [radiationDistanceMeters, setRadiationDistanceMeters] = useState<number>(2); // meters

  // Radiation Dose Calculation (Inverse Square Law: 1 / d^2)
  const radiationRelativeDose = useMemo(() => {
    const doseFraction = 100 / (radiationDistanceMeters * radiationDistanceMeters);
    return {
      percentage: doseFraction.toFixed(1),
      reduction: (100 - doseFraction).toFixed(1)
    };
  }, [radiationDistanceMeters]);

  const currentNodes = useMemo(() => {
    return RADIOLOGY_NODES[activeMode] || RADIOLOGY_NODES.cxrAbcde;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: RadiologyLabNode) => {
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
            <Scan size={14} /> RAD-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "cxrAbcde" && "Systematic Chest Radiography (CXR ABCDE) & Silhouette Sign Simulator"}
            {activeMode === "headCt" && "Non-Contrast Head CT Intracranial Hemorrhage Matrix (EDH vs SDH vs SAH)"}
            {activeMode === "fastUltrasound" && "Trauma Resuscitation E-FAST Ultrasound & M-Mode Lung Sliding Explorer"}
            {activeMode === "mriPhysics" && "MRI Sequences (T1, T2, FLAIR, DWI) & Radiation Safety ALARA Calculator"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Radiology Quiz"}
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
                <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Radiology Clinical Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Radiological Entity: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-sky-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-sky-950 text-xs rounded border border-sky-700 text-sky-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: CXR ABCDE Simulator */}
          {activeMode === "cxrAbcde" && (
            <div className={styles.radSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Chest Radiograph Projection &amp; Pathological Sign Simulator
                </span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    onClick={() => setCxrProjection("pa")}
                    className={`px-2 py-0.5 rounded font-bold border transition ${
                      cxrProjection === "pa"
                        ? "bg-sky-600 text-white border-sky-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    PA (Standard)
                  </button>
                  <button
                    onClick={() => setCxrProjection("ap")}
                    className={`px-2 py-0.5 rounded font-bold border transition ${
                      cxrProjection === "ap"
                        ? "bg-sky-600 text-white border-sky-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    AP (Portable Magnified)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <button
                  onClick={() => setCxrCondition("normal")}
                  className={`p-2 rounded font-bold border transition ${
                    cxrCondition === "normal"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Normal CXR
                </button>
                <button
                  onClick={() => setCxrCondition("rmlPneumonia")}
                  className={`p-2 rounded font-bold border transition ${
                    cxrCondition === "rmlPneumonia"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  RML Pneumonia
                </button>
                <button
                  onClick={() => setCxrCondition("rllPneumonia")}
                  className={`p-2 rounded font-bold border transition ${
                    cxrCondition === "rllPneumonia"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  RLL Pneumonia
                </button>
                <button
                  onClick={() => setCxrCondition("pneumothorax")}
                  className={`p-2 rounded font-bold border transition ${
                    cxrCondition === "pneumothorax"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Tension PTX
                </button>
                <button
                  onClick={() => setCxrCondition("chf")}
                  className={`p-2 rounded font-bold border transition ${
                    cxrCondition === "chf"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  CHF / Edema
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {cxrCondition === "rmlPneumonia" && (
                  <div>
                    <div className="text-sky-300 font-bold">Right Middle Lobe (RML) Pneumonia (Silhouette Sign)</div>
                    <div className="text-slate-300 mt-1">Effacement of the Right Heart Border with patent Air Bronchograms; Right Hemidiaphragm remains sharply delineated.</div>
                    <div className="text-emerald-300 font-bold mt-1">Key Diagnostic Sign: Positive Silhouette Sign of Right Atrial Contour.</div>
                  </div>
                )}
                {cxrCondition === "rllPneumonia" && (
                  <div>
                    <div className="text-sky-300 font-bold">Right Lower Lobe (RLL) Pneumonia</div>
                    <div className="text-slate-300 mt-1">Loss of the Right Hemidiaphragm contour; the Right Heart Border remains crisp and distinct.</div>
                  </div>
                )}
                {cxrCondition === "pneumothorax" && (
                  <div>
                    <div className="text-sky-300 font-bold">Left Tension Pneumothorax</div>
                    <div className="text-slate-300 mt-1">Hyperlucent left hemithorax with absent peripheral vascular markings; Deep Sulcus Sign on supine film; Trachea shifted to the RIGHT (contralateral).</div>
                  </div>
                )}
                {cxrCondition === "chf" && (
                  <div>
                    <div className="text-sky-300 font-bold">Congestive Heart Failure / Cardiogenic Pulmonary Edema</div>
                    <div className="text-slate-300 mt-1">Cardiomegaly (CTR &gt; 0.5 on PA view), horizontal Kerley B lines at lateral bases, Bat-wing perihilar alveolar haze, and bilateral pleural blunting.</div>
                  </div>
                )}
                {cxrCondition === "normal" && (
                  <div>
                    <div className="text-sky-300 font-bold">Normal Chest Radiograph</div>
                    <div className="text-slate-300 mt-1">Trachea midline, clear lung fields, sharp costophrenic angles, CTR &lt; 0.5, with 9–10 posterior ribs visible above diaphragm.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: Head CT Hemorrhage Matrix */}
          {activeMode === "headCt" && (
            <div className={styles.radSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scan size={14} /> Non-Contrast Head CT: Intracranial Hemorrhage Matrix
                </span>
                <span className="text-[11px] text-slate-400">Fresh Blood: +50 to +80 HU</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setCtHemorrhageType("edh")}
                  className={`p-2 rounded font-bold border transition ${
                    ctHemorrhageType === "edh"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Epidural (EDH)
                </button>
                <button
                  onClick={() => setCtHemorrhageType("sdh")}
                  className={`p-2 rounded font-bold border transition ${
                    ctHemorrhageType === "sdh"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Subdural (SDH)
                </button>
                <button
                  onClick={() => setCtHemorrhageType("sah")}
                  className={`p-2 rounded font-bold border transition ${
                    ctHemorrhageType === "sah"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Subarachnoid (SAH)
                </button>
                <button
                  onClick={() => setCtHemorrhageType("stroke")}
                  className={`p-2 rounded font-bold border transition ${
                    ctHemorrhageType === "stroke"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Acute Stroke
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {ctHemorrhageType === "edh" && (
                  <div>
                    <div className="text-sky-300 font-bold">Epidural Hematoma (EDH) — Middle Meningeal Artery</div>
                    <div className="text-slate-300 mt-1">Biconvex / Lentiform hyperdense extra-axial mass; CANNOT cross cranial sutures; classic Lucid Interval followed by uncal herniation (ipsilateral blown pupil). Emergency Craniotomy indicated.</div>
                  </div>
                )}
                {ctHemorrhageType === "sdh" && (
                  <div>
                    <div className="text-sky-300 font-bold">Subdural Hematoma (SDH) — Bridging Cortical Veins</div>
                    <div className="text-slate-300 mt-1">Crescentic / Sickle-shaped concave extra-axial collection; CROSSES cranial suture lines; common in elderly and alcoholics with cerebral atrophy.</div>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-[10px] text-sky-300">Acute: Hyperdense (+60 HU)</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300">Subacute: Isodense (+35 HU)</span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400">Chronic: Hypodense (+15 HU)</span>
                    </div>
                  </div>
                )}
                {ctHemorrhageType === "sah" && (
                  <div>
                    <div className="text-sky-300 font-bold">Subarachnoid Hemorrhage (SAH) — Berry Aneurysm Rupture</div>
                    <div className="text-slate-300 mt-1">Hyperdensity filling basal cisterns ("Star of Death" in suprasellar cistern) and cortical sulci; Thunderclap headache; Lumbar puncture for xanthochromia if CT is negative.</div>
                  </div>
                )}
                {ctHemorrhageType === "stroke" && (
                  <div>
                    <div className="text-sky-300 font-bold">Acute Ischemic Stroke — Early NCCT Signs</div>
                    <div className="text-slate-300 mt-1">Hyperdense Middle Cerebral Artery (MCA) sign, loss of insular ribbon, blurring of basal ganglia margins, and sulcal effacement. Rule out hemorrhage before tPA.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: E-FAST Ultrasound Explorer */}
          {activeMode === "fastUltrasound" && (
            <div className={styles.radSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> E-FAST 4 Acoustic Windows &amp; M-Mode Lung Sliding
                </span>
                <span className="text-[11px] text-slate-400">Point-of-Care Bedside Ultrasound</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Morison\'s Pouch (Hepatorenal Recess)</div>
                  <div className="text-slate-300 mt-1">Most dependent peritoneal space in the supine abdomen; anechoic black fluid stripe between liver and right kidney confirms hemoperitoneum.</div>
                  <div className="text-rose-400 font-bold mt-1">Unstable Trauma + Positive FAST = Immediate Laparotomy.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Thoracic E-FAST (Pneumothorax Detection)</div>
                  <div className="text-slate-300 mt-1">Normal: Shimmering lung sliding (M-mode Seashore Sign). Pneumothorax: Loss of sliding with M-mode Barcode / Stratosphere Sign.</div>
                  <div className="text-emerald-300 font-bold mt-1">Lung Point Sign = 100% Specific for Pneumothorax.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Radiation Safety ALARA Calculator */}
          {activeMode === "mriPhysics" && (
            <div className={styles.radSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Radiation Safety: Inverse Square Law Dose Calculator
                </span>
                <span className="text-[11px] text-slate-400">ALARA: Time, Distance, Shielding</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Distance from Radiation Source:</span>{" "}
                  <strong className="text-sky-400">{radiationDistanceMeters} Meters</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={radiationDistanceMeters}
                  onChange={(e) => setRadiationDistanceMeters(parseFloat(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div className={styles.radResultsGrid}>
                <div className={styles.radResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Relative Exposure Dose</div>
                  <div className="radResultVal text-sky-300 font-extrabold">{radiationRelativeDose.percentage}%</div>
                </div>
                <div className={styles.radResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Dose Reduction</div>
                  <div className="radResultVal text-emerald-400 font-extrabold">{radiationRelativeDose.reduction}%</div>
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
                    <span className="text-sky-400 font-bold">Pattern:</span> {node.radiologicalPattern}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect radiological protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Radiology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Radiology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Radiological Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Key Imaging Criteria &amp; Pattern</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Clinical Management Impact</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalSignificance}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Felson / Brant &amp; Helms Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("cxrAbcde")}
          className={`${styles.modeTab} ${activeMode === "cxrAbcde" ? styles.modeTabActive : ""}`}
        >
          🫁 1. CXR ABCDE &amp; Silhouette
        </button>
        <button
          onClick={() => setActiveMode("headCt")}
          className={`${styles.modeTab} ${activeMode === "headCt" ? styles.modeTabActive : ""}`}
        >
          🧠 2. Head CT (EDH/SDH)
        </button>
        <button
          onClick={() => setActiveMode("fastUltrasound")}
          className={`${styles.modeTab} ${activeMode === "fastUltrasound" ? styles.modeTabActive : ""}`}
        >
          📡 3. E-FAST Ultrasound
        </button>
        <button
          onClick={() => setActiveMode("mriPhysics")}
          className={`${styles.modeTab} ${activeMode === "mriPhysics" ? styles.modeTabActive : ""}`}
        >
          ☢️ 4. MRI &amp; Radiation Safety
        </button>
      </div>
    </div>
  );
}
