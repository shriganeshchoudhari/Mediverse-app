"use client";

import React, { useState, useMemo } from "react";
import styles from "./EntLabViewer.module.css";
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
  Volume2,
  Headphones,
  Compass,
  Wind,
} from "lucide-react";

export type EntLabMode = "audiometry" | "otology" | "rhinology" | "airway";

export interface EntLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalAlgorithm: string;
  diagnosticCriteria: string;
  entManagement: string;
  highYieldPearl: string;
}

export const ENT_NODES: Record<EntLabMode, EntLabNode[]> = {
  audiometry: [
    {
      id: "tuning-fork-rinne-weber",
      name: "1. 512 Hz Tuning Fork Tests: Rinne, Weber & Schwabach",
      category: "Audiological Diagnostics",
      subType: "Rinne (AC vs BC) • Weber (Midline vs Lateralization) • Schwabach",
      clinicalAlgorithm: "CHL: Rinne negative (BC > AC) + Weber lateralizes to affected ear. SNHL: Rinne positive (AC > BC) + Weber lateralizes to unaffected better ear.",
      diagnosticCriteria: "Rinne negative indicates Air-Bone Gap > 15-20 dB. False negative Rinne occurs in severe unilateral dead ear (crossover to normal ear).",
      entManagement: "Confirm tuning fork findings with diagnostic Pure Tone Audiometry (PTA) and Impedance Tympanometry; rule out cerumen impaction or middle ear effusion.",
      highYieldPearl: "512 Hz is the ideal tuning fork frequency because lower frequencies (128/256 Hz) produce tactile vibration, while higher frequencies (1024/2048 Hz) have poor bone decay times."
    },
    {
      id: "pta-tympanometry-carhart",
      name: "2. Pure Tone Audiometry (ABG) & Jerger Tympanometry (A/As/Ad/B/C)",
      category: "Pure Tone Audiometry",
      subType: "Air-Bone Gap > 10 dB • 4 kHz Noise Dip • Carhart Notch (2 kHz) • Type B Glue Ear",
      clinicalAlgorithm: "PTA: ABG > 10 dB = Conductive. 4 kHz sensory notch = Noise-induced HL. 2 kHz bone notch = Carhart (Otosclerosis). Tympanogram: Type B = Glue ear / Perforation.",
      diagnosticCriteria: "Type As: Shallow compliance (Otosclerosis). Type Ad: Hypercompliant (Ossicular disruption). Type B: Flat (OME). Type C: Negative pressure (ET dysfunction).",
      entManagement: "Otosclerosis: Stapedotomy with Teflon piston. OME: Myringotomy + Grommet ventilation tube. Noise-induced HL: Hearing protection.",
      highYieldPearl: "Carhart's notch is a false dip in bone conduction thresholds at 2000 Hz (2 kHz) characteristic of stapedial footplate fixation in Otosclerosis."
    }
  ],

  otology: [
    {
      id: "csom-safe-vs-unsafe-cholesteatoma",
      name: "1. Chronic Otitis Media: Safe (Tubotympanic) vs Unsafe (Cholesteatoma)",
      category: "Middle Ear Pathology",
      subType: "Safe (Central Perforation) • Unsafe Cholesteatoma (Attic Defect, Foul Cheesy Discharge)",
      clinicalAlgorithm: "Safe CSOM: Central perforation, profuse mucoid non-foul discharge -> Tympanoplasty. Unsafe: Attic perforation, foul cheesy discharge, bone erosion -> MRM.",
      diagnosticCriteria: "Cholesteatoma osteolytic enzymes erode ossicles, facial canal (CN VII LMN palsy), and lateral semicircular canal (Fistula test positive, Hennebert sign).",
      entManagement: "Immediate high-resolution CT (HRCT) of temporal bone + Urgent Modified Radical Mastoidectomy (MRM) / Tympanomastoidectomy to prevent brain abscess.",
      highYieldPearl: "A positive Fistula Test (nystagmus and vertigo elicited by pneumatic otoscopy) indicates osteolytic erosion of the lateral horizontal semicircular canal by cholesteatoma."
    },
    {
      id: "vestibular-meniere-bppv",
      name: "2. Peripheral Vestibular Disorders: Ménière's Disease vs BPPV",
      category: "Neuro-Otology",
      subType: "Ménière (Endolymphatic Hydrops Tetrad) • BPPV (Dix-Hallpike & Epley Maneuver)",
      clinicalAlgorithm: "Ménière: Episodic vertigo (20m-12h) + fluctuating low-freq SNHL + tinnitus + fullness -> Low-salt + Betahistine. BPPV: Brief positional vertigo (<1m) -> Epley maneuver.",
      diagnosticCriteria: "BPPV: Canalithiasis in posterior semicircular canal; Dix-Hallpike induces torsional upbeating nystagmus with latency and fatigue. Vestibular Schwannoma: MRI brain/IAC.",
      entManagement: "BPPV: Epley canalith repositioning maneuver (curative in >90%). Ménière: Sodium restriction (<2g/d), hydrochlorothiazide, intratympanic dexamethasone.",
      highYieldPearl: "Ménière's disease is caused by endolymphatic hydrops, presenting with fluctuating low-frequency sensorineural hearing loss and roaring tinnitus."
    }
  ],

  rhinology: [
    {
      id: "epistaxis-kiesselbach-woodruff",
      name: "1. Epistaxis: Little's Area (Kiesselbach) vs Woodruff's Plexus",
      category: "Rhinology & Hemostasis",
      subType: "Kiesselbach 4-Artery Anastomosis (Anterior >90%) • Woodruff (Posterior <10%)",
      clinicalAlgorithm: "Anterior: Trotter pinch -> Oxymetazoline -> Silver nitrate cautery -> Merocel pack. Posterior (Elderly HTN): Foley catheter balloon pack -> ESPAL ligation.",
      diagnosticCriteria: "Kiesselbach plexus: Anterior Ethmoidal, Sphenopalatine, Greater Palatine, Superior Labial arteries. Woodruff: Posterior lateral nasal wall branches of sphenopalatine.",
      entManagement: "Trotter method (pinch soft nose leaning forward for 15 min); Chemical cautery with AgNO3 (never bilateral at once); Anterior Merocel pack for 24-48h.",
      highYieldPearl: "Never perform bilateral chemical cautery of the nasal septum simultaneously because it compromises septal cartilage blood supply, risking permanent septal perforation."
    },
    {
      id: "invasive-fungal-mucormycosis",
      name: "2. Acute Rhinosinusitis & Invasive Fungal Mucormycosis",
      category: "Sinonasal Pathology",
      subType: "Bacterial Sinusitis (Amoxicillin-Clav) • Mucormycosis (Black Eschar, DKA, Amphotericin)",
      clinicalAlgorithm: "Bacterial: Facial pain >10 days -> Amox-Clav. Mucormycosis (DKA): Proptosis, ophthalmoplegia, black necrotic eschar -> Emergency debridement + IV Amphotericin B.",
      diagnosticCriteria: "Rhino-orbital-cerebral mucormycosis: Angioinvasive Rhizopus/Mucor; biopsy shows broad, non-septate hyphae branching at 90-degree right angles with thrombosis.",
      entManagement: "Emergency radical surgical debridement of necrotic turbinates/palate + High-dose IV Liposomal Amphotericin B (5-10 mg/kg/d) + DKA metabolic control.",
      highYieldPearl: "The pathognomonic physical finding of invasive mucormycosis is a painless black necrotic eschar on the middle turbinate or hard palate in a patient with DKA."
    }
  ],

  airway: [
    {
      id: "quinsy-peritonsillar-ludwig",
      name: "1. Deep Neck Infections: Peritonsillar Abscess (Quinsy) vs Ludwig's Angina",
      category: "Pharyngology & Neck Spaces",
      subType: "Quinsy (Trismus, Hot Potato, Uvula Deviation) • Ludwig (Woody Floor of Mouth)",
      clinicalAlgorithm: "Quinsy: Medial pterygoid spasm (trismus) + muffled voice + uvula deviation -> Needle aspiration / I&D + IV Ceftriaxone. Ludwig: Submandibular cellulitis -> Airway control.",
      diagnosticCriteria: "Ludwig's Angina: Bilateral submandibular/sublingual woody induration from 2nd/3rd molar infection elevating tongue -> Asphyxiation emergency.",
      entManagement: "Quinsy: Needle aspiration or incisional drainage + IV antibiotics + single-dose dexamethasone. Ludwig's: Awake fiberoptic intubation / tracheostomy + IV broad spectrum.",
      highYieldPearl: "Trismus in peritonsillar abscess (Quinsy) is caused by direct inflammatory irritation and reflex spasm of the adjacent Medial (Internal) Pterygoid Muscle."
    },
    {
      id: "tracheostomy-surgical-technique",
      name: "2. Surgical Tracheostomy Principles & 2nd–3rd Tracheal Rings",
      category: "Emergency Airway",
      subType: "2nd–3rd Tracheal Ring Window • Avoid 1st Ring (Subglottic Stenosis Risk)",
      clinicalAlgorithm: "Upper airway obstruction / prolonged ventilation -> Surgical incision between 2nd & 3rd tracheal rings -> Insert cuffed tracheostomy cannula.",
      diagnosticCriteria: "Emergency Cricothyroidotomy through cricothyroid membrane in CICO crisis; must convert to formal tracheostomy within 48-72h to prevent chondritis.",
      entManagement: "Perform tracheostomy through 2nd-3rd or 3rd-4th rings; strict avoidance of 1st tracheal ring or cricoid cartilage prevents crippling subglottic stenosis.",
      highYieldPearl: "Injury or incision through the first tracheal ring or cricoid cartilage during tracheostomy leads to severe, irreversible subglottic stenosis."
    }
  ]
};

interface EntLabViewerProps {
  initialMode?: EntLabMode;
  height?: string;
  onNodeSelect?: (node: EntLabNode) => void;
}

export default function EntLabViewer({
  initialMode = "audiometry",
  height = "560px",
  onNodeSelect,
}: EntLabViewerProps) {
  const [activeMode, setActiveMode] = useState<EntLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Tuning Fork Simulator State
  const [rinneRight, setRinneRight] = useState<"positive" | "negative">("negative");
  const [rinneLeft, setRinneLeft] = useState<"positive" | "negative">("positive");
  const [weberResult, setWeberResult] = useState<"midline" | "right" | "left">("right");

  // Pure Tone Audiometry Curve State
  const [ptaCurveType, setPtaCurveType] = useState<"normal" | "chl" | "nihl" | "presbycusis" | "otosclerosis">("otosclerosis");

  // Tympanometry State
  const [tympanogramType, setTympanogramType] = useState<"typeA" | "typeAs" | "typeAd" | "typeB" | "typeC">("typeAs");

  // Otology State
  const [otologyType, setOtologyType] = useState<"aom" | "ome" | "safeCsom" | "unsafeCholesteatoma" | "meniere" | "bppv">("unsafeCholesteatoma");

  // Tuning Fork Triage Calculation
  const tuningForkTriage = useMemo(() => {
    if (rinneRight === "negative" && weberResult === "right") {
      return {
        dx: "Right Conductive Hearing Loss (CHL)",
        color: "text-purple-300 font-bold",
        cause: "Otosclerosis, Impacted Cerumen, or CSOM in Right Ear",
        action: "Perform Pure Tone Audiometry (assess Air-Bone Gap) and Tympanometry"
      };
    } else if (rinneLeft === "negative" && weberResult === "left") {
      return {
        dx: "Left Conductive Hearing Loss (CHL)",
        color: "text-purple-300 font-bold",
        cause: "Otosclerosis, Impacted Cerumen, or CSOM in Left Ear",
        action: "Perform Pure Tone Audiometry (assess Air-Bone Gap) and Tympanometry"
      };
    } else if (rinneRight === "positive" && rinneLeft === "positive" && weberResult === "left") {
      return {
        dx: "Right Sensorineural Hearing Loss (SNHL)",
        color: "text-rose-300 font-bold",
        cause: "Right Cochlear / CN VIII lesion (Weber lateralizes to better left ear)",
        action: "Perform Audiogram (acoustic dip / high frequency loss) + MRI Brain/IAC"
      };
    } else if (rinneRight === "positive" && rinneLeft === "positive" && weberResult === "right") {
      return {
        dx: "Left Sensorineural Hearing Loss (SNHL)",
        color: "text-rose-300 font-bold",
        cause: "Left Cochlear / CN VIII lesion (Weber lateralizes to better right ear)",
        action: "Perform Audiogram (acoustic dip / high frequency loss) + MRI Brain/IAC"
      };
    }
    return {
      dx: "Normal Symmetrical Hearing / Bilateral Rinne Positive",
      color: "text-emerald-400 font-bold",
      cause: "Air conduction exceeds Bone conduction normally in both ears",
      action: "Routine hearing screening; no significant air-bone gap"
    };
  }, [rinneRight, rinneLeft, weberResult]);

  const currentNodes = useMemo(() => {
    return ENT_NODES[activeMode] || ENT_NODES.audiometry;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: EntLabNode) => {
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
            <Headphones size={14} /> ENT-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "audiometry" && "512 Hz Tuning Fork Simulator, Pure Tone Audiogram & Tympanometry"}
            {activeMode === "otology" && "Otoscopy & Cholesteatoma (Safe vs Unsafe CSOM) Classifier"}
            {activeMode === "rhinology" && "Epistaxis Kiesselbach & Woodruff Plexus Vascular Cascade"}
            {activeMode === "airway" && "Deep Neck Space Infections (Quinsy vs Ludwig) & Tracheostomy"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "ENT Quiz"}
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
                  Otorhinolaryngology Clinical Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify ENT Entity: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: 512 Hz Tuning Fork Simulator & Audiogram */}
          {activeMode === "audiometry" && (
            <div className={styles.entSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 size={14} /> 512 Hz Tuning Fork Simulator (Rinne &amp; Weber)
                </span>
                <span className="text-[11px] text-slate-400">Air Conduction (AC) vs Bone Conduction (BC)</span>
              </div>

              {/* Tuning Fork Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-[11px] text-slate-300 font-semibold mb-1">Right Ear Rinne:</div>
                  <select
                    value={rinneRight}
                    onChange={(e) => setRinneRight(e.target.value as "positive" | "negative")}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                  >
                    <option value="positive">Positive (AC &gt; BC - Normal/SNHL)</option>
                    <option value="negative">Negative (BC &gt; AC - Conductive HL)</option>
                  </select>
                </div>

                <div>
                  <div className="text-[11px] text-slate-300 font-semibold mb-1">Left Ear Rinne:</div>
                  <select
                    value={rinneLeft}
                    onChange={(e) => setRinneLeft(e.target.value as "positive" | "negative")}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                  >
                    <option value="positive">Positive (AC &gt; BC - Normal/SNHL)</option>
                    <option value="negative">Negative (BC &gt; AC - Conductive HL)</option>
                  </select>
                </div>

                <div>
                  <div className="text-[11px] text-slate-300 font-semibold mb-1">Weber Test (Midline/Lateral):</div>
                  <select
                    value={weberResult}
                    onChange={(e) => setWeberResult(e.target.value as "midline" | "right" | "left")}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                  >
                    <option value="midline">Midline (No Lateralization)</option>
                    <option value="right">Lateralizes to Right Ear</option>
                    <option value="left">Lateralizes to Left Ear</option>
                  </select>
                </div>
              </div>

              <div className={styles.entResultsGrid}>
                <div className={styles.entResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Tuning Fork Diagnosis</div>
                  <div className={`text-xs font-bold mt-1 ${tuningForkTriage.color}`}>{tuningForkTriage.dx}</div>
                </div>
                <div className={styles.entResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Underlying Etiology</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{tuningForkTriage.cause}</div>
                </div>
                <div className={styles.entResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Next Diagnostic Step</div>
                  <div className="text-xs font-bold text-purple-300 mt-1">{tuningForkTriage.action}</div>
                </div>
              </div>

              {/* Pure Tone Audiogram Signatures */}
              <div className="mt-1">
                <div className="text-[11px] text-slate-400 font-semibold mb-1">Pure Tone Audiogram (PTA) Curve Signature:</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
                  <button
                    onClick={() => setPtaCurveType("normal")}
                    className={`p-1.5 rounded font-bold border transition ${
                      ptaCurveType === "normal"
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Normal (&le;25dB)
                  </button>
                  <button
                    onClick={() => setPtaCurveType("chl")}
                    className={`p-1.5 rounded font-bold border transition ${
                      ptaCurveType === "chl"
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Air-Bone Gap
                  </button>
                  <button
                    onClick={() => setPtaCurveType("otosclerosis")}
                    className={`p-1.5 rounded font-bold border transition ${
                      ptaCurveType === "otosclerosis"
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Carhart Notch (2kHz)
                  </button>
                  <button
                    onClick={() => setPtaCurveType("nihl")}
                    className={`p-1.5 rounded font-bold border transition ${
                      ptaCurveType === "nihl"
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Noise Dip (4kHz)
                  </button>
                  <button
                    onClick={() => setPtaCurveType("presbycusis")}
                    className={`p-1.5 rounded font-bold border transition ${
                      ptaCurveType === "presbycusis"
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    Presbycusis Slope
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Otoscopy & Cholesteatoma Classifier */}
          {activeMode === "otology" && (
            <div className={styles.entSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Headphones size={14} /> Otoscopic Findings &amp; Chronic Otitis Media Classification
                </span>
                <span className="text-[11px] text-slate-400">Safe vs Unsafe CSOM</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setOtologyType("aom")}
                  className={`p-2 rounded font-bold border transition ${
                    otologyType === "aom"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Acute Otitis Media (AOM)
                </button>
                <button
                  onClick={() => setOtologyType("ome")}
                  className={`p-2 rounded font-bold border transition ${
                    otologyType === "ome"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Glue Ear (OME)
                </button>
                <button
                  onClick={() => setOtologyType("safeCsom")}
                  className={`p-2 rounded font-bold border transition ${
                    otologyType === "safeCsom"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Safe CSOM (Tubotympanic)
                </button>
                <button
                  onClick={() => setOtologyType("unsafeCholesteatoma")}
                  className={`p-2 rounded font-bold border transition ${
                    otologyType === "unsafeCholesteatoma"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Unsafe Cholesteatoma
                </button>
                <button
                  onClick={() => setOtologyType("meniere")}
                  className={`p-2 rounded font-bold border transition ${
                    otologyType === "meniere"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Ménière's Disease
                </button>
                <button
                  onClick={() => setOtologyType("bppv")}
                  className={`p-2 rounded font-bold border transition ${
                    otologyType === "bppv"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  BPPV (Canalithiasis)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {otologyType === "unsafeCholesteatoma" && (
                  <div>
                    <div className="text-purple-300 font-bold">Atticoantral CSOM (Cholesteatoma - Unsafe Type)</div>
                    <div className="text-slate-300 mt-1">Attic/marginal perforation with foul-smelling cheesy discharge and bone erosion. Risks facial nerve palsy, labyrinthine fistula, and brain abscess.</div>
                    <div className="text-rose-400 font-bold mt-1">Management: Mandatory Modified Radical Mastoidectomy (MRM).</div>
                  </div>
                )}
                {otologyType === "safeCsom" && (
                  <div>
                    <div className="text-purple-300 font-bold">Tubotympanic CSOM (Safe / Mucosal Type)</div>
                    <div className="text-slate-300 mt-1">Central perforation in pars tensa with profuse, mucoid, non-foul discharge; no bone erosion. Elective Tympanoplasty.</div>
                  </div>
                )}
                {otologyType === "aom" && (
                  <div>
                    <div className="text-purple-300 font-bold">Acute Otitis Media (AOM)</div>
                    <div className="text-slate-300 mt-1">Bulging, erythematous eardrum with loss of landmarks, acute otalgia, and fever. 1st-line: High-dose Amoxicillin (80-90 mg/kg/d).</div>
                  </div>
                )}
                {otologyType === "ome" && (
                  <div>
                    <div className="text-purple-300 font-bold">Otitis Media with Effusion (Glue Ear / OME)</div>
                    <div className="text-slate-300 mt-1">Dull amber eardrum with air-fluid levels/bubbles; Type B flat tympanogram. Treat with Myringotomy + Grommet tube.</div>
                  </div>
                )}
                {otologyType === "meniere" && (
                  <div>
                    <div className="text-purple-300 font-bold">Ménière's Disease (Endolymphatic Hydrops)</div>
                    <div className="text-slate-300 mt-1">Tetrad: Episodic vertigo (20m–12h), fluctuating low-frequency SNHL, roaring tinnitus, aural fullness. Low-salt diet + Betahistine.</div>
                  </div>
                )}
                {otologyType === "bppv" && (
                  <div>
                    <div className="text-purple-300 font-bold">Benign Paroxysmal Positional Vertigo (BPPV)</div>
                    <div className="text-slate-300 mt-1">Dislodged otoconia in posterior semicircular canal; brief positional vertigo (&lt;1 min). Curative treatment: Epley Maneuver.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Epistaxis Kiesselbach & Woodruff Plexus */}
          {activeMode === "rhinology" && (
            <div className={styles.entSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Epistaxis Vascular Plexus &amp; Stepwise Hemostasis Cascade
                </span>
                <span className="text-[11px] text-slate-400">Little's Area (Kiesselbach) vs Woodruff</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-purple-300 font-bold">Little's Area / Kiesselbach's Plexus (Anterior &gt;90%)</div>
                <div className="text-slate-300 mt-1">
                  Formed by 4 arteries on anterior septum: <strong>Anterior Ethmoidal</strong>, <strong>Sphenopalatine</strong>, <strong>Greater Palatine</strong>, and <strong>Superior Labial</strong>.
                </div>
                <div className="text-emerald-300 font-bold mt-2">Stepwise Hemostasis Cascade:</div>
                <div className="text-slate-300 text-[11px] mt-0.5 space-y-1">
                  <div>1. <strong>Trotter's Method</strong>: Pinch soft cartilaginous nose for 15 min leaning forward.</div>
                  <div>2. <strong>Chemical Cautery</strong>: Silver Nitrate (AgNO3 75%) to bleeding vessel (never bilateral at once).</div>
                  <div>3. <strong>Anterior Pack</strong>: Merocel / Rapid Rhino tamponade for 24–48 hours.</div>
                  <div>4. <strong>Posterior Pack</strong>: Foley balloon catheter if posterior Woodruff bleeding persists.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Deep Neck Infections & Tracheostomy */}
          {activeMode === "airway" && (
            <div className={styles.entSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind size={14} /> Deep Neck Space Infections (Quinsy vs Ludwig) &amp; Tracheostomy
                </span>
                <span className="text-[11px] text-slate-400">2nd–3rd Tracheal Ring Window</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Peritonsillar Abscess (Quinsy)</div>
                  <div className="text-slate-300 mt-1">Trismus from Medial Pterygoid muscle spasm, muffled 'hot-potato' voice, and uvula deviation to the opposite side.</div>
                  <div className="text-emerald-300 font-bold mt-1">Treatment: Needle aspiration / I&amp;D + IV Ceftriaxone.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Ludwig's Angina &amp; Tracheostomy</div>
                  <div className="text-slate-300 mt-1">Bilateral woody floor-of-mouth induration elevating tongue. Immediate awake fiberoptic intubation or tracheostomy.</div>
                  <div className="text-amber-300 font-bold mt-1">Tracheostomy Site: 2nd–3rd rings (avoid 1st ring cricoid stenosis).</div>
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
                    <span className="text-purple-400 font-bold">Algorithm:</span> {node.clinicalAlgorithm}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect ENT protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield ENT Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              ENT Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Disease / Clinical Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Guideline-Directed Management</div>
            <div className={styles.inspectorBody}>{activeNode.entManagement}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Scott-Brown / Dhingra High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("audiometry")}
          className={`${styles.modeTab} ${activeMode === "audiometry" ? styles.modeTabActive : ""}`}
        >
          🔊 1. Audiometry &amp; Tuning Fork
        </button>
        <button
          onClick={() => setActiveMode("otology")}
          className={`${styles.modeTab} ${activeMode === "otology" ? styles.modeTabActive : ""}`}
        >
          👂 2. Otology &amp; Cholesteatoma
        </button>
        <button
          onClick={() => setActiveMode("rhinology")}
          className={`${styles.modeTab} ${activeMode === "rhinology" ? styles.modeTabActive : ""}`}
        >
          👃 3. Epistaxis &amp; Sinusitis
        </button>
        <button
          onClick={() => setActiveMode("airway")}
          className={`${styles.modeTab} ${activeMode === "airway" ? styles.modeTabActive : ""}`}
        >
          🫁 4. Quinsy &amp; Tracheostomy
        </button>
      </div>
    </div>
  );
}
