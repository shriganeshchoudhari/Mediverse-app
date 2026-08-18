"use client";

import React, { useState, useMemo } from "react";
import styles from "./OrthopedicsLabViewer.module.css";
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
  Bone,
  Scissors,
  Crosshair,
  Compass,
} from "lucide-react";

export type OrthopedicsLabMode = "fractures" | "compartment" | "dislocations" | "tumors";

export interface OrthopedicsLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalAlgorithm: string;
  diagnosticCriteria: string;
  orthopedicManagement: string;
  highYieldPearl: string;
}

export const ORTHOPEDICS_NODES: Record<OrthopedicsLabMode, OrthopedicsLabNode[]> = {
  fractures: [
    {
      id: "salter-harris-matrix",
      name: "1. Salter-Harris Physeal Fractures (SALTR I–V)",
      category: "Pediatric Trauma",
      subType: "Type I (Physis) • Type II (Metaphysis Thurston-Holland) • Type III–V (Growth Arrest)",
      clinicalAlgorithm: "Type I: Slipped. Type II: Above (Thurston-Holland fragment). Type III: Lower (Epiphysis). Type IV: Through all 3. Type V: Rammed (cRush).",
      diagnosticCriteria: "Type II is most common (75%). Types III and IV involve the articular surface and require anatomical reduction. Type V has worst prognosis (>80% growth arrest).",
      orthopedicManagement: "Types I/II: Closed reduction + casting. Types III/IV: Anatomical ORIF with smooth K-wires/screws avoiding physeal cross-compression.",
      highYieldPearl: "The Thurston-Holland sign is the pathognomonic triangular metaphyseal bone fragment characteristic of Salter-Harris Type II physeal fractures."
    },
    {
      id: "gustilo-anderson-open",
      name: "2. Gustilo-Anderson Open Fractures & Antibiotic Protocol",
      category: "Trauma Orthopedics",
      subType: "Type I (<1 cm) • Type II (1-10 cm) • Type III (Severe / Arterial Injury)",
      clinicalAlgorithm: "Type I/II: Cefazolin. Type IIIA/B: Cefazolin + Gentamicin. Barnyard/Soil: + Penicillin G. Type IIIC: Emergency arterial repair + External Fixator.",
      diagnosticCriteria: "Type IIIB: Extensive soft tissue loss with periosteal stripping and exposed bone. Type IIIC: Associated arterial injury requiring vascular repair.",
      orthopedicManagement: "Immediate tetanus toxoid, systemic IV antibiotics within 1 hour, sterile saline dressing, emergent OR debridement within 6 hours, rigid skeletal stabilization.",
      highYieldPearl: "Barnyard, soil, or agricultural farm injuries require high-dose IV Penicillin G or Metronidazole for Clostridium perfringens gas gangrene coverage."
    }
  ],

  compartment: [
    {
      id: "compartment-6ps-stryker",
      name: "1. Acute Compartment Syndrome (The 6 Ps) & Delta Pressure (ΔP)",
      category: "Orthopedic Surgical Emergency",
      subType: "Pain on Passive Stretch (Earliest) • Delta P <= 30 mmHg (Gold Standard)",
      clinicalAlgorithm: "6 Ps: Pain out of proportion, Pain on passive stretch, Paresthesia, Pressure, Pallor, Pulselessness (extremely late!). Delta P = DBP - Compartment Pressure.",
      diagnosticCriteria: "Diagnostic threshold: Absolute pressure > 30 mmHg OR Delta Pressure (DBP - Pcomp) <= 30 mmHg indicates critical capillary shutdown.",
      orthopedicManagement: "Immediate release of all constrictive casts/dressings down to skin + Emergency Double-Incision 4-Compartment Fasciotomy of the lower leg.",
      highYieldPearl: "Pain on passive stretch of the ischemic muscle group is the most sensitive early clinical sign of acute compartment syndrome; distal pulses are typically intact!"
    },
    {
      id: "fasciotomy-4compartment-volkmann",
      name: "2. 4-Compartment Fasciotomy & Volkmann Ischemic Contracture",
      category: "Surgical Decompression",
      subType: "Anterolateral (Anterior/Lateral) • Posteromedial (Sup/Deep Post) • Volkmann Contracture",
      clinicalAlgorithm: "Anterolateral incision: Releases Anterior (Deep Peroneal N) & Lateral (Superficial Peroneal N). Posteromedial incision: Releases Superficial & Deep Posterior compartments.",
      diagnosticCriteria: "Untreated forearm compartment syndrome leads to Volkmann Ischemic Contracture: claw-like flexion deformity of wrist and fingers with intrinsic paralysis.",
      orthopedicManagement: "Leave fasciotomy wounds open; apply negative-pressure wound therapy (wound VAC); delayed primary closure or skin graft at 48-72 hours.",
      highYieldPearl: "In the lower leg, the Deep Posterior Compartment (containing the Tibial nerve and Posterior Tibial vessels) must be fully decompressed by releasing the tibialis posterior fascia."
    }
  ],

  dislocations: [
    {
      id: "shoulder-dislocations-axillary",
      name: "1. Shoulder Dislocations (Anterior vs Posterior) & Axillary Nerve",
      category: "Joint Dislocations",
      subType: "Anterior (Bankart/Hill-Sachs, Axillary N) • Posterior (Lightbulb Sign, Seizures)",
      clinicalAlgorithm: "Anterior (>95%): Squared-off shoulder, arm abducted/externally rotated, Axillary nerve injury. Posterior (<5%): Lightbulb sign, seizures/electrocution.",
      diagnosticCriteria: "Anterior: Bankart lesion (anteroinferior labrum tear) & Hill-Sachs (posterolateral humeral head compression). Axillary nerve: Regimental badge area sensory loss.",
      orthopedicManagement: "Emergency closed reduction (Stimson, Milch, or Traction-Countertraction) + immobilization in internal rotation for 2-3 weeks.",
      highYieldPearl: "Posterior shoulder dislocation is the classic orthopedic injury following severe epileptic grand mal seizures or electrical shock / lightning strike."
    },
    {
      id: "hip-dislocation-sciatic-avn",
      name: "2. Hip Dislocations (Posterior vs Anterior) & Sciatic Nerve (AVN)",
      category: "Trauma Orthopedics",
      subType: "Posterior Dashboard (Flexed/Adducted/Internally Rotated) • AVN Window < 6h",
      clinicalAlgorithm: "Posterior (>90%): Dashboard MVA -> Flexed, adducted, internally rotated, shortened leg -> Sciatic nerve (foot drop) -> Closed reduction < 6 hours.",
      diagnosticCriteria: "Anterior (<10%): Abducted, externally rotated, extended leg -> Femoral nerve at risk. Posterior: Risk of Avascular Necrosis (AVN) of femoral head.",
      orthopedicManagement: "Emergency closed reduction within 6 hours under conscious sedation (Allis or Captain Morgan maneuver) to prevent femoral head osteonecrosis.",
      highYieldPearl: "Closed reduction of a dislocated hip must be achieved within 6 hours of trauma to restore medial circumflex femoral arterial perfusion and prevent AVN."
    }
  ],

  tumors: [
    {
      id: "osteosarcoma-ewing-sarcoma",
      name: "1. Primary Bone Sarcomas: Osteosarcoma vs Ewing Sarcoma",
      category: "Orthopedic Oncology",
      subType: "Osteosarcoma (Metaphysis, Sunburst/Codman) • Ewing (Diaphysis, Onion-Skin)",
      clinicalAlgorithm: "Osteosarcoma (10-20y): Metaphysis (around knee), Sunburst spicules & Codman's triangle, spreads to lungs. Ewing (5-15y): Diaphysis, Onion-skin, t(11;22), CD99+.",
      diagnosticCriteria: "Osteosarcoma produces malignant osteoid bone; Ewing sarcoma is a small round blue cell tumor mimicking osteomyelitis with systemic fever and elevated ESR.",
      orthopedicManagement: "Multi-agent neoadjuvant chemotherapy + limb-salvage wide en-bloc resection (or amputation) + post-op chemotherapy.",
      highYieldPearl: "Osteosarcoma characteristically metastasizes hematogenously to the lungs; a staging CT scan of the chest is mandatory at initial diagnosis."
    },
    {
      id: "osteoid-osteoma-osteomyelitis",
      name: "2. Osteoid Osteoma (Aspirin Nidus) & Acute Osteomyelitis (Kocher)",
      category: "Bone Lesions & Infections",
      subType: "Osteoid Osteoma (Aspirin Relief) • Osteomyelitis (S. aureus, Sickle Salmonella)",
      clinicalAlgorithm: "Osteoid Osteoma: Radiolucent nidus (<1.5 cm) with nocturnal pain relieved by Aspirin. Osteomyelitis: S. aureus (overall), Salmonella (Sickle cell), Pseudomonas (sneakers).",
      diagnosticCriteria: "Kocher Criteria for Septic Arthritis: Non-weight bearing, Fever >38.5°C, ESR >40 mm/h, WBC >12,000 (4 criteria = 99% probability -> Joint Washout).",
      orthopedicManagement: "Osteoid Osteoma: CT-guided radiofrequency ablation. Osteomyelitis: IV antibiotics (Vancomycin/Cefazolin) + surgical debridement of sequestrum.",
      highYieldPearl: "Severe nocturnal bone pain dramatically and completely relieved by Aspirin or NSAIDs is pathognomonic of an Osteoid Osteoma (due to high PGE2 production)."
    }
  ]
};

interface OrthopedicsLabViewerProps {
  initialMode?: OrthopedicsLabMode;
  height?: string;
  onNodeSelect?: (node: OrthopedicsLabNode) => void;
}

export default function OrthopedicsLabViewer({
  initialMode = "fractures",
  height = "560px",
  onNodeSelect,
}: OrthopedicsLabViewerProps) {
  const [activeMode, setActiveMode] = useState<OrthopedicsLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Salter-Harris Selector State
  const [salterType, setSalterType] = useState<"type1" | "type2" | "type3" | "type4" | "type5">("type2");

  // Compartment Syndrome Delta Pressure State
  const [diastolicBp, setDiastolicBp] = useState<number>(75); // mmHg
  const [compartmentPressure, setCompartmentPressure] = useState<number>(50); // mmHg

  // Dislocation Joint Selector State
  const [dislocationType, setDislocationType] = useState<"antShoulder" | "postShoulder" | "postHip" | "radialMidshaft">("postHip");

  // Bone Tumor Selector State
  const [tumorType, setTumorType] = useState<"osteosarcoma" | "ewing" | "osteoidOsteoma" | "giantCell">("osteosarcoma");

  // Delta Pressure Calculation
  const deltaPressure = useMemo(() => {
    return diastolicBp - compartmentPressure;
  }, [diastolicBp, compartmentPressure]);

  const compartmentTriage = useMemo(() => {
    if (deltaPressure <= 30 || compartmentPressure > 30) {
      return {
        status: "EMERGENCY 4-COMPARTMENT FASCIOTOMY INDICATED",
        color: "text-rose-400 font-extrabold",
        action: "Immediate double-incision fasciotomy (Anterior, Lateral, Superficial Post, Deep Post) to prevent muscle necrosis"
      };
    }
    return {
      status: "Adequately Perfused Compartment (Low Risk)",
      color: "text-emerald-400 font-bold",
      action: "Remove constrictive casts, keep limb at heart level, and perform serial neurovascular exams"
    };
  }, [deltaPressure, compartmentPressure]);

  // Salter-Harris Data
  const salterData = useMemo(() => {
    switch (salterType) {
      case "type1":
        return { name: "Type I (S - Straight Across)", sign: "Widened Physis alone", risk: "Low (< 1%)", mgmt: "Closed reduction + Cast" };
      case "type2":
        return { name: "Type II (A - Above Physis)", sign: "Thurston-Holland Metaphyseal Fragment", risk: "Low (Most Common 75%)", mgmt: "Closed reduction + Cast" };
      case "type3":
        return { name: "Type III (L - Lower Epiphysis)", sign: "Intra-articular Epiphyseal Fracture", risk: "Moderate (Articular step-off)", mgmt: "Anatomical ORIF" };
      case "type4":
        return { name: "Type IV (T - Through All 3)", sign: "Metaphysis + Physis + Epiphysis", risk: "High (Growth Arrest / Deformity)", mgmt: "Anatomical ORIF + Pins" };
      case "type5":
      default:
        return { name: "Type V (R - Rammed / cRush)", sign: "Severe Axial Physeal Crush", risk: "Severe (> 80% Growth Arrest)", mgmt: "Protected Cast + Long-term Monitoring" };
    }
  }, [salterType]);

  const currentNodes = useMemo(() => {
    return ORTHOPEDICS_NODES[activeMode] || ORTHOPEDICS_NODES.fractures;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: OrthopedicsLabNode) => {
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
            <Bone size={14} /> ORTH-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "fractures" && "Salter-Harris Physeal & Gustilo-Anderson Open Fracture Classifier"}
            {activeMode === "compartment" && "Acute Compartment Syndrome Delta Pressure (ΔP) Emergency Calculator"}
            {activeMode === "dislocations" && "Joint Dislocations & Peripheral Nerve Injury Visualizer"}
            {activeMode === "tumors" && "Bone Tumor & Osteomyelitis Radiographic Signature Explorer"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Orthopedics Quiz"}
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
                <div className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                  Orthopedics & Traumatology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Orthopedic Entity: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-orange-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-orange-950 text-xs rounded border border-orange-700 text-orange-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Salter-Harris Physeal Matrix */}
          {activeMode === "fractures" && (
            <div className={styles.orthSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bone size={14} /> Salter-Harris Physeal Fracture Matrix (SALTR Types I–V)
                </span>
                <span className="text-[11px] text-slate-400">Pediatric Physis Growth Plate</span>
              </div>

              {/* Salter Type Selector Buttons */}
              <div className="grid grid-cols-5 gap-2 text-xs">
                {(["type1", "type2", "type3", "type4", "type5"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSalterType(type)}
                    className={`py-2 rounded font-bold border transition ${
                      salterType === type
                        ? "bg-orange-600 text-white border-orange-400"
                        : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className={styles.orthResultsGrid}>
                <div className={styles.orthResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Classification & Mnemonic</div>
                  <div className="text-xs font-bold text-orange-300 mt-1">{salterData.name}</div>
                </div>
                <div className={styles.orthResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Pathognomonic X-ray Sign</div>
                  <div className="text-xs font-bold text-white mt-1">{salterData.sign}</div>
                </div>
                <div className={styles.orthResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Growth Arrest Risk</div>
                  <div className="text-xs font-bold text-rose-300 mt-1">{salterData.risk}</div>
                </div>
                <div className={styles.orthResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Orthopedic Management</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">{salterData.mgmt}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Acute Compartment Syndrome Delta Pressure Calculator */}
          {activeMode === "compartment" && (
            <div className={styles.orthSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors size={14} /> Acute Compartment Syndrome Delta Pressure (ΔP) Stryker Calculator
                </span>
                <span className="text-[11px] text-slate-400">ΔP = DBP - Pcomp &le; 30 mmHg</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Patient Diastolic Blood Pressure (DBP):</span>{" "}
                    <strong className="text-orange-400">{diastolicBp} mmHg</strong>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={diastolicBp}
                    onChange={(e) => setDiastolicBp(parseInt(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Intracompartmental Tissue Pressure (Pcomp):</span>{" "}
                    <strong className="text-orange-400">{compartmentPressure} mmHg</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="65"
                    step="1"
                    value={compartmentPressure}
                    onChange={(e) => setCompartmentPressure(parseInt(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              </div>

              <div className={styles.orthResultsGrid}>
                <div className={styles.orthResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Calculated Delta Pressure (ΔP)</div>
                  <div className={styles.orthResultVal}>{deltaPressure} mmHg</div>
                </div>
                <div className={styles.orthResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Emergency Triage Status</div>
                  <div className={`text-xs font-bold mt-1 ${compartmentTriage.color}`}>{compartmentTriage.status}</div>
                </div>
                <div className={styles.orthResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Surgical / Clinical Action</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{compartmentTriage.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Joint Dislocation & Nerve Injury Visualizer */}
          {activeMode === "dislocations" && (
            <div className={styles.orthSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} /> Joint Dislocations & Peripheral Nerve Injury Visualizer
                </span>
                <span className="text-[11px] text-slate-400">Emergent Reduction &lt; 6 Hours</span>
              </div>

              {/* Dislocation Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setDislocationType("antShoulder")}
                  className={`p-2 rounded font-bold border transition ${
                    dislocationType === "antShoulder"
                      ? "bg-orange-600 text-white border-orange-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Anterior Shoulder
                </button>
                <button
                  onClick={() => setDislocationType("postShoulder")}
                  className={`p-2 rounded font-bold border transition ${
                    dislocationType === "postShoulder"
                      ? "bg-orange-600 text-white border-orange-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Posterior Shoulder
                </button>
                <button
                  onClick={() => setDislocationType("postHip")}
                  className={`p-2 rounded font-bold border transition ${
                    dislocationType === "postHip"
                      ? "bg-orange-600 text-white border-orange-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Posterior Hip (Dashboard)
                </button>
                <button
                  onClick={() => setDislocationType("radialMidshaft")}
                  className={`p-2 rounded font-bold border transition ${
                    dislocationType === "radialMidshaft"
                      ? "bg-orange-600 text-white border-orange-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Midshaft Humerus
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {dislocationType === "antShoulder" && (
                  <div>
                    <div className="text-orange-300 font-bold">Anterior Shoulder Dislocation (&gt;95%)</div>
                    <div className="text-slate-300 mt-1">Arm held abducted/externally rotated with squared-off shoulder. Bankart and Hill-Sachs lesions on X-ray.</div>
                    <div className="text-emerald-300 font-bold mt-1">Vulnerable Nerve: Axillary Nerve (loss of regimental badge sensation).</div>
                  </div>
                )}
                {dislocationType === "postShoulder" && (
                  <div>
                    <div className="text-orange-300 font-bold">Posterior Shoulder Dislocation (&lt;5%)</div>
                    <div className="text-slate-300 mt-1">Caused by violent epileptic grand mal seizures or electrocution/lightning strike. Fixed internal rotation.</div>
                    <div className="text-amber-300 font-bold mt-1">X-ray Hallmark: 'Lightbulb Sign' on AP shoulder radiograph.</div>
                  </div>
                )}
                {dislocationType === "postHip" && (
                  <div>
                    <div className="text-orange-300 font-bold">Posterior Hip Dislocation (&gt;90% - Dashboard Injury)</div>
                    <div className="text-slate-300 mt-1">Lower limb held flexed, adducted, internally rotated, and shortened. Sciatic nerve foot drop risk.</div>
                    <div className="text-rose-300 font-bold mt-1">AVN Prevention: Mandatory closed reduction within 6 hours of injury.</div>
                  </div>
                )}
                {dislocationType === "radialMidshaft" && (
                  <div>
                    <div className="text-orange-300 font-bold">Midshaft Humeral Fracture &amp; Radial Nerve Injury</div>
                    <div className="text-slate-300 mt-1">Radial nerve entrapment in spiral groove causes Wrist Drop (loss of wrist/finger extension).</div>
                    <div className="text-emerald-300 font-bold mt-1">Sensory Deficit: Numbness over dorsal first web space.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 4: Bone Tumor & Infection Matrix */}
          {activeMode === "tumors" && (
            <div className={styles.orthSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crosshair size={14} /> Primary Bone Tumors &amp; Radiographic Signatures
                </span>
                <span className="text-[11px] text-slate-400">Sunburst • Onion-Skin • Nidus • Soap-Bubble</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setTumorType("osteosarcoma")}
                  className={`p-2 rounded font-bold border transition ${
                    tumorType === "osteosarcoma"
                      ? "bg-orange-600 text-white border-orange-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Osteosarcoma
                </button>
                <button
                  onClick={() => setTumorType("ewing")}
                  className={`p-2 rounded font-bold border transition ${
                    tumorType === "ewing"
                      ? "bg-orange-600 text-white border-orange-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Ewing Sarcoma
                </button>
                <button
                  onClick={() => setTumorType("osteoidOsteoma")}
                  className={`p-2 rounded font-bold border transition ${
                    tumorType === "osteoidOsteoma"
                      ? "bg-orange-600 text-white border-orange-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Osteoid Osteoma
                </button>
                <button
                  onClick={() => setTumorType("giantCell")}
                  className={`p-2 rounded font-bold border transition ${
                    tumorType === "giantCell"
                      ? "bg-orange-600 text-white border-orange-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Giant Cell Tumor
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {tumorType === "osteosarcoma" && (
                  <div>
                    <div className="text-orange-300 font-bold">Osteosarcoma (Adolescents 10–20 years)</div>
                    <div className="text-slate-300 mt-1">Location: Metaphysis around the knee (distal femur, proximal tibia). Produces osteoid.</div>
                    <div className="text-rose-300 font-bold mt-1">Radiography: 'Sunburst' periosteal reaction &amp; Codman's triangle; spreads to Lungs.</div>
                  </div>
                )}
                {tumorType === "ewing" && (
                  <div>
                    <div className="text-orange-300 font-bold">Ewing Sarcoma (Children 5–15 years)</div>
                    <div className="text-slate-300 mt-1">Location: Diaphysis of long bones and pelvis. Translocation t(11;22); CD99+ small round blue cells.</div>
                    <div className="text-amber-300 font-bold mt-1">Radiography: 'Onion-Skin' multilayered lamellated periosteal reaction.</div>
                  </div>
                )}
                {tumorType === "osteoidOsteoma" && (
                  <div>
                    <div className="text-orange-300 font-bold">Osteoid Osteoma (Young adults 10–25 years)</div>
                    <div className="text-slate-300 mt-1">Location: Proximal femur cortex. Radiolucent nidus (&lt;1.5 cm) surrounded by dense sclerotic bone.</div>
                    <div className="text-emerald-300 font-bold mt-1">Pathognomonic: Severe nocturnal bone pain dramatically relieved by Aspirin/NSAIDs.</div>
                  </div>
                )}
                {tumorType === "giantCell" && (
                  <div>
                    <div className="text-orange-300 font-bold">Giant Cell Tumor / Osteoclastoma (20–40 years)</div>
                    <div className="text-slate-300 mt-1">Location: Epiphysis of mature long bone extending to articular surface. Multinucleated giant cells.</div>
                    <div className="text-amber-300 font-bold mt-1">Radiography: Expansile 'Soap-Bubble' osteolytic lesion.</div>
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
                    <span className="text-orange-400 font-bold">Algorithm:</span> {node.clinicalAlgorithm}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect orthopedic protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Orthopedics Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Orthopedic Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Disease / Clinical Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria & Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Guideline-Directed Management</div>
            <div className={styles.inspectorBody}>{activeNode.orthopedicManagement}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Rockwood / Apley High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("fractures")}
          className={`${styles.modeTab} ${activeMode === "fractures" ? styles.modeTabActive : ""}`}
        >
          🦴 1. Salter-Harris &amp; Gustilo
        </button>
        <button
          onClick={() => setActiveMode("compartment")}
          className={`${styles.modeTab} ${activeMode === "compartment" ? styles.modeTabActive : ""}`}
        >
          ✂️ 2. Compartment Syndrome (ΔP)
        </button>
        <button
          onClick={() => setActiveMode("dislocations")}
          className={`${styles.modeTab} ${activeMode === "dislocations" ? styles.modeTabActive : ""}`}
        >
          🧭 3. Dislocations &amp; Nerves
        </button>
        <button
          onClick={() => setActiveMode("tumors")}
          className={`${styles.modeTab} ${activeMode === "tumors" ? styles.modeTabActive : ""}`}
        >
          🎯 4. Bone Tumors &amp; Infections
        </button>
      </div>
    </div>
  );
}
