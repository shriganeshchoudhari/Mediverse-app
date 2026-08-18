"use client";

import React, { useState, useMemo } from "react";
import styles from "./PediatricsLabViewer.module.css";
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
  Smile,
  Sun,
  Wind,
} from "lucide-react";

export type PediatricsLabMode = "milestones" | "jaundice" | "nrpRds" | "dehydration";

export interface PediatricsLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalAlgorithm: string;
  diagnosticCriteria: string;
  pediatricManagement: string;
  highYieldPearl: string;
}

export const PEDIATRICS_NODES: Record<PediatricsLabMode, PediatricsLabNode[]> = {
  milestones: [
    {
      id: "milestones-matrix",
      name: "1. Developmental Milestones (Gross/Fine/Language/Social)",
      category: "Developmental Pediatrics",
      subType: "Head Control (4m) • Sit (6m) • Walk (12m) • Tricycle (3y)",
      clinicalAlgorithm: "Gross Motor: Sit 6m -> Walk 12m -> Tricycle 3y -> Hop 4y. Fine Motor: Palmar 6m -> Pincer 9-12m -> Circle 3y -> Cross/Square 4y -> Triangle 5y.",
      diagnosticCriteria: "Language: Coo 2m -> Babble 6m -> Single words 12m -> 2-word phrase 2y -> 3-word sentence 3y. Social: Smile 2m -> Stranger anxiety 9m -> Parallel 2y -> Cooperative 3y.",
      pediatricManagement: "Routine developmental screening at 9, 18, and 30 months; early intervention therapy for documented developmental delay in any domain.",
      highYieldPearl: "Geometric drawing progression: Vertical line at 2y -> Circle at 3y -> Cross (+) and Square at 4y -> Triangle at 5y."
    },
    {
      id: "growth-velocity-fontanelles",
      name: "2. Pediatric Anthropometry, Growth Rules & Fontanelles",
      category: "Growth & Nutrition",
      subType: "Weight Doubles (5m) & Triples (1y) • Anterior Fontanelle (9-18m)",
      clinicalAlgorithm: "Weight: 2x birth at 5m, 3x at 1y, 4x at 2y. Length: 75 cm at 1y, 2x birth (100 cm) at 4y. Head Circ: 35 cm at birth, 45 cm at 1y.",
      diagnosticCriteria: "Anterior fontanelle closes at 9-18 months (delayed in Rickets/Hypothyroidism); Posterior fontanelle closes at 2-3 months.",
      pediatricManagement: "Plot weight, height, and head circumference on WHO/CDC Z-score growth charts; exclusive breastfeeding for first 6 months.",
      highYieldPearl: "Failure to regain birth weight by 10 to 14 days of life indicates significant feeding insufficiency requiring lactation evaluation."
    }
  ],

  jaundice: [
    {
      id: "jaundice-bhutani-nomogram",
      name: "1. Neonatal Hyperbilirubinemia & Bhutani Phototherapy Nomogram",
      category: "Neonatal Jaundice",
      subType: "Onset < 24h (Always Pathologic) • Phototherapy (460-490 nm) • Lumirubin",
      clinicalAlgorithm: "Jaundice < 24h -> Coombs test, blood group, CBC, reticulocyte count, TSB. Check AAP Bhutani hour-specific nomogram.",
      diagnosticCriteria: "Pathological signs: onset in first 24h, rate of rise > 0.2 mg/dL/h (> 5 mg/dL/d), direct bilirubin > 1.0 mg/dL, persistence > 14 days in term.",
      pediatricManagement: "Intensive Blue-Green Phototherapy (460-490 nm); Double-Volume Exchange Transfusion (160 mL/kg) if TSB exceeds exchange threshold or ABE signs.",
      highYieldPearl: "Phototherapy converts lipid-soluble unconjugated bilirubin into water-soluble Lumirubin via structural photoisomerization, excreted without conjugation."
    },
    {
      id: "kernicterus-abo-rh",
      name: "2. Isoimmune Hemolysis (ABO / Rh) & Kernicterus (Basal Ganglia)",
      category: "Isoimmune Hemolytic Disease",
      subType: "ABO (O Mother, A/B Infant) • Kernicterus (Globus Pallidus)",
      clinicalAlgorithm: "ABO incompatibility (microspherocytes, Coombs +) -> early phototherapy. Kernicterus risk: unbound bilirubin deposits in Globus Pallidus.",
      diagnosticCriteria: "Acute Bilirubin Encephalopathy (ABE): Lethargy, poor suck -> High-pitched cry, retrocollis, opisthotonus -> Choreoathetoid CP and sensorineural deafness.",
      pediatricManagement: "Immediate double-volume exchange transfusion (160 mL/kg) + IVIG (0.5-1.0 g/kg) for isoimmune hemolytic disease.",
      highYieldPearl: "The basal ganglia (particularly the Globus Pallidus and subthalamic nuclei) are the most vulnerable cerebral targets of bilirubin neurotoxicity."
    }
  ],

  nrpRds: [
    {
      id: "nrp-resuscitation-algorithm",
      name: "1. NRP 8th Edition Resuscitation Flowchart & MR. SOPA",
      category: "Neonatal Resuscitation",
      subType: "Golden Minute • PPV in 21% O2 • MR. SOPA • 3:1 Compressions",
      clinicalAlgorithm: "Apnea / HR < 100 -> PPV in 21% O2 (40-60/min) + Pre-ductal pulse ox -> If HR < 100: MR. SOPA -> If HR < 60 despite 30s effective PPV: 3:1 Compressions + 100% O2.",
      diagnosticCriteria: "APGAR at 1 and 5 min (Appearance, Pulse, Grimace, Activity, Respiration). Score 0-3 = severe depression.",
      pediatricManagement: "MR. SOPA: Mask, Reposition, Suction, Open mouth, Pressure increase, Alternative airway (ETT). IV Epinephrine (0.02 mg/kg) via UVC if HR < 60.",
      highYieldPearl: "In term neonates, positive pressure ventilation must be initiated in 21% O2 (room air); 100% oxygen increases oxidative mortality."
    },
    {
      id: "rds-surfactant-prematurity",
      name: "2. Respiratory Distress Syndrome (RDS / Hyaline Membrane Disease)",
      category: "Neonatal Pulmonology",
      subType: "Surfactant Deficiency • Ground-Glass CXR • Antenatal Steroids",
      clinicalAlgorithm: "Prematurity (< 34 wks) + tachypnea + expiratory grunting + retractions -> CXR (Ground-glass opacities + air bronchograms) -> Early nCPAP + Surfactant.",
      diagnosticCriteria: "Deficiency of dipalmitoylphosphatidylcholine produced by Type II pneumocytes leading to microatelectasis and intrapulmonary shunting.",
      pediatricManagement: "Antenatal Betamethasone to mother; Early Nasal CPAP (5-7 cmH2O); Intratracheal Exogenous Surfactant (Poractant alfa) via LISA/InSurE.",
      highYieldPearl: "Expiratory grunting in neonatal RDS is a protective auto-PEEP mechanism by the infant to maintain functional residual capacity (FRC)."
    }
  ],

  dehydration: [
    {
      id: "who-dehydration-plans",
      name: "1. WHO Dehydration Assessment & Plan A, B, C",
      category: "Pediatric Gastroenteritis",
      subType: "Plan A (Home ORS) • Plan B (75 mL/kg ORS in 4h) • Plan C (100 mL/kg IV)",
      clinicalAlgorithm: "No dehydration -> Plan A (10 mL/kg per stool). Some dehydration -> Plan B (75 mL/kg ORS over 4h). Severe dehydration -> Plan C (100 mL/kg IV Ringer's).",
      diagnosticCriteria: "Severe Dehydration: Lethargic/comatose, sunken eyes, unable to drink, skin pinch goes back very slowly (> 2 seconds).",
      pediatricManagement: "Plan C IV: Infants < 12m give 30 mL/kg in 1h, then 70 mL/kg in 5h; Children > 12m give 30 mL/kg in 30min, then 70 mL/kg in 2.5h. Add Zinc 20mg/d.",
      highYieldPearl: "Oral Zinc supplementation (20 mg/day for 14 days) shortens diarrhea duration and reduces recurrence over the subsequent 3 months."
    },
    {
      id: "croup-vs-epiglottitis",
      name: "2. Upper Airway Obstruction: Croup vs Acute Epiglottitis",
      category: "Pediatric Respiratory Emergencies",
      subType: "Barking Cough (Steeple Sign) vs Tripod/Drooling (Thumbprint Sign)",
      clinicalAlgorithm: "Croup (Parainfluenza): Barking cough, steeple sign -> Dexamethasone 0.6 mg/kg +/- Racemic Epi. Epiglottitis (Hib): Drooling, tripod -> OR Intubation.",
      diagnosticCriteria: "Acute Epiglottitis: High fever, 3Ds (Dysphagia, Drooling, Distress), muffled voice. Strictly avoid tongue blade in epiglottitis!",
      pediatricManagement: "Epiglottitis: Transport calmly to Operating Room for definitive endotracheal intubation by pediatric anesthesiology/ENT + IV Ceftriaxone.",
      highYieldPearl: "Never inspect the posterior pharynx with a tongue blade in suspected acute epiglottitis, as it can trigger fatal complete laryngospasm."
    }
  ]
};

interface PediatricsLabViewerProps {
  initialMode?: PediatricsLabMode;
  height?: string;
  onNodeSelect?: (node: PediatricsLabNode) => void;
}

export default function PediatricsLabViewer({
  initialMode = "milestones",
  height = "560px",
  onNodeSelect,
}: PediatricsLabViewerProps) {
  const [activeMode, setActiveMode] = useState<PediatricsLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Milestones Age Selector State
  const [selectedAge, setSelectedAge] = useState<string>("3y");

  // Jaundice Bhutani Nomogram State
  const [postnatalHours, setPostnatalHours] = useState<number>(48); // hours
  const [tsbBilirubin, setTsbBilirubin] = useState<number>(14.5); // mg/dL
  const [jaundiceRiskTier, setJaundiceRiskTier] = useState<"low" | "medium" | "high">("medium");

  // APGAR Calculator State
  const [apgar, setApgar] = useState<{
    appearance: number;
    pulse: number;
    grimace: number;
    activity: number;
    respiration: number;
  }>({
    appearance: 1, // acrocyanosis
    pulse: 2, // >= 100
    grimace: 2, // vigorous cry
    activity: 2, // active motion
    respiration: 2, // good cry
  });

  // Dehydration Weight & Plan State
  const [childWeightKg, setChildWeightKg] = useState<number>(10); // kg
  const [dehydrationPlan, setDehydrationPlan] = useState<"planA" | "planB" | "planC">("planB");

  // APGAR Total
  const apgarTotal = useMemo(() => {
    return apgar.appearance + apgar.pulse + apgar.grimace + apgar.activity + apgar.respiration;
  }, [apgar]);

  const apgarTriage = useMemo(() => {
    if (apgarTotal >= 7) {
      return { status: "Normal Vigorous Infant", color: "text-emerald-400", nrp: "Routine post-delivery care with mother (warm, skin-to-skin)" };
    } else if (apgarTotal >= 4) {
      return { status: "Moderately Depressed Infant", color: "text-amber-400 font-bold", nrp: "Tactile stimulation, clear airway, initiate PPV in 21% O2 if HR < 100" };
    }
    return { status: "Severely Depressed Infant (High Mortality)", color: "text-rose-400 font-extrabold", nrp: "Full NRP Protocol: PPV -> MR. SOPA -> 3:1 Compressions -> IV Epinephrine" };
  }, [apgarTotal]);

  // Jaundice Bhutani Calculation
  const jaundiceStatus = useMemo(() => {
    let photoThreshold = 12;
    let exchangeThreshold = 19;

    if (postnatalHours < 24) {
      photoThreshold = 8;
      exchangeThreshold = 14;
    } else if (postnatalHours < 48) {
      photoThreshold = jaundiceRiskTier === "high" ? 11 : jaundiceRiskTier === "medium" ? 13 : 15;
      exchangeThreshold = jaundiceRiskTier === "high" ? 16 : jaundiceRiskTier === "medium" ? 18 : 20;
    } else {
      photoThreshold = jaundiceRiskTier === "high" ? 13 : jaundiceRiskTier === "medium" ? 15 : 17;
      exchangeThreshold = jaundiceRiskTier === "high" ? 18 : jaundiceRiskTier === "medium" ? 21 : 24;
    }

    if (tsbBilirubin >= exchangeThreshold) {
      return { level: "EXCHANGE TRANSFUSION EMERGENCY", color: "text-rose-400 font-bold", action: "Immediate Double-Volume Exchange Transfusion (160 mL/kg) + Intensive Phototherapy" };
    } else if (tsbBilirubin >= photoThreshold) {
      return { level: "Phototherapy Indicated", color: "text-amber-300 font-bold", action: "Start Intensive Blue-Green Phototherapy (460-490 nm) -> Lumirubin excretion" };
    }
    return { level: "Physiological / Low Risk", color: "text-emerald-400", action: "Continue regular breastfeeding (10-12 times/24h) & monitor TSB" };
  }, [postnatalHours, tsbBilirubin, jaundiceRiskTier]);

  // Milestone Matrix Lookup
  const milestoneData = useMemo(() => {
    switch (selectedAge) {
      case "2m":
        return { gross: "Lifts head 45° prone", fine: "Hands unfisted 50%", lang: "Coos / vowel sounds", social: "Social Smile (responds to face)", shape: "Follows past midline" };
      case "4m":
        return { gross: "No head lag; rolls prone to supine", fine: "Bidextrous reach; hands to mouth", lang: "Laughs aloud & squeals", social: "Enjoys social contact", shape: "Reaches for rattle" };
      case "6m":
        return { gross: "Sits with support (tripod); rolls supine to prone", fine: "Transfers hand to hand; Palmar grasp", lang: "Monosyllabic babbling (ba, da)", social: "Recognizes familiar faces", shape: "Reaches with one hand" };
      case "9m":
        return { gross: "Sits unsupported; crawls; pulls to stand", fine: "Immature / Crude Pincer Grasp", lang: "Bisyllabic babbling (mama, dada non-specific)", social: "Stranger Anxiety; waves bye-bye", shape: "Explores objects in 3D" };
      case "12m":
        return { gross: "Walks with one hand held; stands alone", fine: "Neat / Fine Pincer Grasp (tips)", lang: "First true word (Mama specific)", social: "Pat-a-cake; imitates actions", shape: "Releases block into cup" };
      case "18m":
        return { gross: "Runs stiffly; walks up stairs held", fine: "Tower of 3-4 cubes; turns pages", lang: "10-25 single words; names 1 body part", social: "Uses spoon/fork; removes shoes", shape: "Scribbles spontaneously" };
      case "2y":
        return { gross: "Walks stairs 2 feet/step; kicks ball", fine: "Tower of 6 cubes; copies vertical line (|)", lang: "2-word phrases; 50% understood", social: "Parallel Play; daytime dry", shape: "Vertical Line (|)" };
      case "3y":
        return { gross: "Rides a tricycle; stairs alternating feet", fine: "Tower of 9-10 cubes; copies circle (○)", lang: "3-word sentences; 75% understood", social: "Cooperative group play; shares", shape: "Circle (○)" };
      case "4y":
        return { gross: "Hops on one foot; stairs down alternating", fine: "Copies cross (+) and square (□)", lang: "4-word complex sentences; 100% understood", social: "Role play; imaginary friends", shape: "Cross (+) & Square (□)" };
      case "5y":
      default:
        return { gross: "Skips alternating feet; catches ball", fine: "Copies triangle (△); ties shoelaces", lang: "Fluent speech; colors/numbers", social: "Follows game rules; comforts others", shape: "Triangle (△)" };
    }
  }, [selectedAge]);

  const currentNodes = useMemo(() => {
    return PEDIATRICS_NODES[activeMode] || PEDIATRICS_NODES.milestones;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: PediatricsLabNode) => {
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
            <Baby size={14} /> PED-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "milestones" && "Developmental Milestones Age Explorer & Shape Drawing Progression"}
            {activeMode === "jaundice" && "AAP Neonatal Jaundice Phototherapy & Exchange Transfusion Nomogram"}
            {activeMode === "nrpRds" && "APGAR Score Calculator & NRP 8th Edition Resuscitation Flowchart"}
            {activeMode === "dehydration" && "WHO Pediatric Dehydration & Fluid Deficit Calculator (Plan A/B/C)"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Pediatrics Quiz"}
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
                  Pediatrics & Neonatology Case Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Pediatric Entity: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: Developmental Milestones Age Explorer */}
          {activeMode === "milestones" && (
            <div className={styles.pedSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smile size={14} /> Chronological Age Milestone Explorer (4 Core Domains)
                </span>
                <span className="text-[11px] text-slate-400">Cephalocaudal & Proximodistal Sequence</span>
              </div>

              {/* Age Buttons Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-xs">
                {["2m", "4m", "6m", "9m", "12m", "18m", "2y", "3y", "4y", "5y"].map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`py-1.5 rounded font-bold border transition ${
                      selectedAge === age
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>

              {/* Milestone Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">🏃 Gross Motor</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">{milestoneData.gross}</div>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">✍️ Fine Motor & Shapes</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">{milestoneData.fine}</div>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">🗣️ Language & Hearing</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">{milestoneData.lang}</div>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">🤝 Social & Emotional</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">{milestoneData.social}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: AAP Neonatal Jaundice Phototherapy Nomogram */}
          {activeMode === "jaundice" && (
            <div className={styles.pedSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sun size={14} /> AAP Bhutani Neonatal Jaundice Phototherapy & Exchange Nomogram
                </span>
                <span className="text-[11px] text-slate-400">Blue-Green Light (460–490 nm)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Postnatal Age:</span>{" "}
                    <strong className="text-emerald-400">{postnatalHours} hours ({ (postnatalHours/24).toFixed(1) } days)</strong>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    step="6"
                    value={postnatalHours}
                    onChange={(e) => setPostnatalHours(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Total Serum Bilirubin (TSB):</span>{" "}
                    <strong className="text-emerald-400">{tsbBilirubin.toFixed(1)} mg/dL</strong>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="28.0"
                    step="0.5"
                    value={tsbBilirubin}
                    onChange={(e) => setTsbBilirubin(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Risk Stratum Buttons */}
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setJaundiceRiskTier("low")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition ${
                    jaundiceRiskTier === "low"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Low Risk (&gt;= 38 wks well)
                </button>
                <button
                  onClick={() => setJaundiceRiskTier("medium")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition ${
                    jaundiceRiskTier === "medium"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Medium Risk (35–37 wks)
                </button>
                <button
                  onClick={() => setJaundiceRiskTier("high")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition ${
                    jaundiceRiskTier === "high"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  High Risk (&lt; 35 wks or Isoimmune)
                </button>
              </div>

              <div className={styles.pedResultsGrid}>
                <div className={styles.pedResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Diagnostic Classification</div>
                  <div className={`text-xs font-bold mt-1 ${jaundiceStatus.color}`}>{jaundiceStatus.level}</div>
                </div>
                <div className={styles.pedResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Phototherapy Mechanism</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">Photoisomerization &rarr; Lumirubin</div>
                </div>
                <div className={styles.pedResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Recommended Action</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{jaundiceStatus.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: APGAR Calculator & NRP Flowchart */}
          {activeMode === "nrpRds" && (
            <div className={styles.pedSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Baby size={14} /> APGAR Score (1 & 5 min) & NRP 8th Edition Resuscitation Flowchart
                </span>
                <span className="text-xs font-bold text-emerald-300">Score: {apgarTotal} / 10</span>
              </div>

              {/* APGAR 5 Criteria Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">Appearance (Color)</div>
                  <select
                    value={apgar.appearance}
                    onChange={(e) => setApgar({ ...apgar, appearance: parseInt(e.target.value) })}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                  >
                    <option value={0}>0: Blue / Pale</option>
                    <option value={1}>1: Acrocyanosis</option>
                    <option value={2}>2: Completely Pink</option>
                  </select>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">Pulse (HR)</div>
                  <select
                    value={apgar.pulse}
                    onChange={(e) => setApgar({ ...apgar, pulse: parseInt(e.target.value) })}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                  >
                    <option value={0}>0: Absent</option>
                    <option value={1}>1: &lt; 100 bpm</option>
                    <option value={2}>2: &gt;= 100 bpm</option>
                  </select>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">Grimace (Reflex)</div>
                  <select
                    value={apgar.grimace}
                    onChange={(e) => setApgar({ ...apgar, grimace: parseInt(e.target.value) })}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                  >
                    <option value={0}>0: Flaccid</option>
                    <option value={1}>1: Weak Grimace</option>
                    <option value={2}>2: Vigorous Cry</option>
                  </select>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">Activity (Tone)</div>
                  <select
                    value={apgar.activity}
                    onChange={(e) => setApgar({ ...apgar, activity: parseInt(e.target.value) })}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                  >
                    <option value={0}>0: Limp</option>
                    <option value={1}>1: Some Flexion</option>
                    <option value={2}>2: Active Motion</option>
                  </select>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">Respiration (Effort)</div>
                  <select
                    value={apgar.respiration}
                    onChange={(e) => setApgar({ ...apgar, respiration: parseInt(e.target.value) })}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                  >
                    <option value={0}>0: Apnea</option>
                    <option value={1}>1: Slow / Weak</option>
                    <option value={2}>2: Good Cry</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">APGAR Interpretation</div>
                  <div className={`text-sm font-bold ${apgarTriage.color}`}>{apgarTriage.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-semibold">NRP Resuscitation Action</div>
                  <div className="text-xs font-bold text-slate-200">{apgarTriage.nrp}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: WHO Dehydration Calculator */}
          {activeMode === "dehydration" && (
            <div className={styles.pedSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> WHO Pediatric Dehydration Assessment & Fluid Calculator (Plan A, B, C)
                </span>
                <span className="text-[11px] text-slate-400">Oral Zinc (20 mg/d x 14 days)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Child Weight:</span> <strong className="text-emerald-400">{childWeightKg} kg</strong>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="25"
                    step="1"
                    value={childWeightKg}
                    onChange={(e) => setChildWeightKg(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Plan Selection Buttons */}
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setDehydrationPlan("planA")}
                    className={`flex-1 py-2 rounded text-xs font-bold border transition ${
                      dehydrationPlan === "planA"
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Plan A (No Dehydration)
                  </button>
                  <button
                    onClick={() => setDehydrationPlan("planB")}
                    className={`flex-1 py-2 rounded text-xs font-bold border transition ${
                      dehydrationPlan === "planB"
                        ? "bg-amber-600 text-white border-amber-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Plan B (Some Dehydration)
                  </button>
                  <button
                    onClick={() => setDehydrationPlan("planC")}
                    className={`flex-1 py-2 rounded text-xs font-bold border transition ${
                      dehydrationPlan === "planC"
                        ? "bg-rose-600 text-white border-rose-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Plan C (Severe Shock)
                  </button>
                </div>
              </div>

              <div className={styles.pedResultsGrid}>
                {dehydrationPlan === "planA" && (
                  <>
                    <div className={styles.pedResultBox}>
                      <div className="text-[11px] text-slate-400 font-semibold">Home ORS per Stool</div>
                      <div className={styles.pedResultVal}>{childWeightKg * 10} mL</div>
                    </div>
                    <div className={styles.pedResultBox}>
                      <div className="text-[11px] text-slate-400 font-semibold">Zinc Supplementation</div>
                      <div className="text-sm font-bold text-emerald-300 mt-1">20 mg/day x 14 days</div>
                    </div>
                    <div className={styles.pedResultBox}>
                      <div className="text-[11px] text-slate-400 font-semibold">Management Advice</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">Continue normal feeding; return if danger signs</div>
                    </div>
                  </>
                )}

                {dehydrationPlan === "planB" && (
                  <>
                    <div className={styles.pedResultBox}>
                      <div className="text-[11px] text-slate-400 font-semibold">4-Hour Clinic ORS Volume</div>
                      <div className={styles.pedResultVal}>{childWeightKg * 75} mL</div>
                    </div>
                    <div className={styles.pedResultBox}>
                      <div className="text-[11px] text-slate-400 font-semibold">Hourly Ingestion Rate</div>
                      <div className="text-sm font-bold text-amber-300 mt-1">{((childWeightKg * 75) / 4).toFixed(0)} mL/hour</div>
                    </div>
                    <div className={styles.pedResultBox}>
                      <div className="text-[11px] text-slate-400 font-semibold">Reassessment Timeline</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">Reassess hydration status at 4 hours</div>
                    </div>
                  </>
                )}

                {dehydrationPlan === "planC" && (
                  <>
                    <div className={styles.pedResultBox}>
                      <div className="text-[11px] text-slate-400 font-semibold">Total IV Ringer's Volume</div>
                      <div className={styles.pedResultVal}>{childWeightKg * 100} mL</div>
                    </div>
                    <div className={styles.pedResultBox}>
                      <div className="text-[11px] text-slate-400 font-semibold">Initial Rapid Bolus (30%)</div>
                      <div className="text-sm font-bold text-rose-300 mt-1">{childWeightKg * 30} mL (in 30–60 min)</div>
                    </div>
                    <div className={styles.pedResultBox}>
                      <div className="text-[11px] text-slate-400 font-semibold">Remaining Infusion (70%)</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">{childWeightKg * 70} mL over 2.5–5 hours</div>
                    </div>
                  </>
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
                    <span className="text-emerald-400 font-bold">Algorithm:</span> {node.clinicalAlgorithm}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect pediatric protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Pediatrics Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Pediatric Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
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
            <div className={styles.inspectorLabel}>💊 Guideline-Directed Management</div>
            <div className={styles.inspectorBody}>{activeNode.pediatricManagement}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Nelson / AAP High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("milestones")}
          className={`${styles.modeTab} ${activeMode === "milestones" ? styles.modeTabActive : ""}`}
        >
          👶 1. Developmental Milestones
        </button>
        <button
          onClick={() => setActiveMode("jaundice")}
          className={`${styles.modeTab} ${activeMode === "jaundice" ? styles.modeTabActive : ""}`}
        >
          ☀️ 2. Neonatal Jaundice (AAP)
        </button>
        <button
          onClick={() => setActiveMode("nrpRds")}
          className={`${styles.modeTab} ${activeMode === "nrpRds" ? styles.modeTabActive : ""}`}
        >
          🫁 3. APGAR & NRP Resuscitation
        </button>
        <button
          onClick={() => setActiveMode("dehydration")}
          className={`${styles.modeTab} ${activeMode === "dehydration" ? styles.modeTabActive : ""}`}
        >
          💧 4. WHO Dehydration Plans
        </button>
      </div>
    </div>
  );
}
