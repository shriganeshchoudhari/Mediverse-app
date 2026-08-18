"use client";

import React, { useState, useMemo } from "react";
import styles from "./OphthalmologyLabViewer.module.css";
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
  Sun,
  Camera,
  Target,
} from "lucide-react";

export type OphthalmologyLabMode = "glaucoma" | "slitLamp" | "cataract" | "retina";

export interface OphthalmologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalAlgorithm: string;
  diagnosticCriteria: string;
  ophthalmicManagement: string;
  highYieldPearl: string;
}

export const OPHTHALMOLOGY_NODES: Record<OphthalmologyLabMode, OphthalmologyLabNode[]> = {
  glaucoma: [
    {
      id: "poag-optic-cupping",
      name: "1. Primary Open-Angle Glaucoma (POAG) & Optic Cupping",
      category: "Chronic Glaucoma",
      subType: "Open Angle (Shaffer 4) • C:D > 0.5 • ISNT Rule • Arcuate Scotoma",
      clinicalAlgorithm: "Painless, insidious vision loss -> Elevated IOP (>21 mmHg) -> C:D ratio >0.5 & ISNT rule violation -> Arcuate Bjerrum scotoma -> Latanoprost 1st-line.",
      diagnosticCriteria: "Normal neuroretinal rim obeys ISNT (Inferior >= Superior >= Nasal >= Temporal); in POAG, inferior/superior rims thin first. Drance disc hemorrhages.",
      ophthalmicManagement: "1st-line Prostaglandin Analogs (Latanoprost) -> Topical Beta-Blockers (Timolol 0.5% - avoid in asthma/bradycardia) -> Alpha-2 Agonists (Brimonidine) -> Trabeculectomy.",
      highYieldPearl: "Latanoprost increases uveoscleral outflow; classic cosmetic side effects include irreversible iris hyperpigmentation and eyelash hypertrichosis."
    },
    {
      id: "acute-angle-closure-emergency",
      name: "2. Acute Angle-Closure Glaucoma (AACG Emergency) & Laser Iridotomy",
      category: "Ophthalmic Surgical Emergency",
      subType: "Pupillary Block • Steamy Cornea • Mid-Dilated Oval Pupil • IOP > 50 mmHg",
      clinicalAlgorithm: "Sudden severe eye pain + halos + nausea -> Steamy cornea + Mid-dilated oval pupil + IOP 50-70 mmHg -> IV Mannitol + Acetazolamide -> Bilateral LPI.",
      diagnosticCriteria: "Gonioscopy: Shaffer Grade 0 (closed angle with Iris bombé). Rock-hard globe on palpation, ciliary flush, shallow anterior chamber.",
      ophthalmicManagement: "IV 20% Mannitol (1-2 g/kg) + IV Acetazolamide 500mg + Topical Timolol/Pilocarpine -> Bilateral Laser Peripheral Iridotomy (LPI) to cure & prevent fellow eye attack.",
      highYieldPearl: "Prophylactic Laser Peripheral Iridotomy (LPI) must ALWAYS be performed in the contralateral fellow eye because it shares the same narrow-angle anatomy!"
    }
  ],

  slitLamp: [
    {
      id: "slit-lamp-illumination-cornea",
      name: "1. Slit-Lamp Biomicroscopy Illumination Techniques",
      category: "Diagnostic Biomicroscopy",
      subType: "Optical Section (Direct Focal) • Sclerotic Scatter • Specular Reflection",
      clinicalAlgorithm: "Direct Focal Slit: 5 corneal layers depth. Sclerotic scatter: Stromal edema. Specular reflection: Endothelial mosaic. Retroillumination: Lens/iris defects.",
      diagnosticCriteria: "Optical sectioning allows micron-level localization of infiltrates, corneal foreign bodies, anterior chamber cells/flare, and lens opacities.",
      ophthalmicManagement: "Use cobalt blue filter with sodium fluorescein to assess epithelial defects and break-up time (TBUT); evaluate endothelial cell density before phaco.",
      highYieldPearl: "Specular reflection is the standard clinical technique for visualizing corneal endothelial guttata in Fuchs endothelial dystrophy."
    },
    {
      id: "hsv-microbial-keratitis",
      name: "2. Microbial Keratitis: HSV Dendritic Ulcers vs Bacterial Hypopyon",
      category: "Corneal Pathology",
      subType: "HSV (Dendritic Terminal Bulbs) • Bacterial (Dense Infiltrate + Hypopyon)",
      clinicalAlgorithm: "HSV: Dendritic ulcer with terminal bulbs on fluorescein -> Topical Ganciclovir 0.15% (STEROIDS CONTRAINDICATED). Bacterial: Pseudomonas -> Fortified Moxifloxacin.",
      diagnosticCriteria: "HSV epithelial keratitis: Branching dendritic ulcer with reduced corneal sensation. Fungal: Feathery borders + satellite lesions. Acanthamoeba: Ring infiltrate.",
      ophthalmicManagement: "HSV: Topical Ganciclovir / Oral Acyclovir (avoid steroids -> geographic ulcer). Bacterial: Intensive fortified topical fluoroquinolones. Fungal: Natamycin 5%.",
      highYieldPearl: "Topical corticosteroids are strictly contraindicated in active HSV epithelial keratitis as they trigger rapid progression to an invasive geographic ulcer."
    }
  ],

  cataract: [
    {
      id: "cataract-morphology-subtypes",
      name: "1. Cataract Morphologies: Nuclear Sclerotic vs Posterior Subcapsular",
      category: "Lens Pathology",
      subType: "Nuclear (Myopic Shift / Second Sight) • Posterior Subcapsular (Steroids / Glare)",
      clinicalAlgorithm: "Nuclear: Central yellow/brown opacification -> temporary improvement in near vision (second sight). PSC: Posterior plaque -> severe night glare & steroid use.",
      diagnosticCriteria: "Cortical: Spoke-wheel cuneiform opacities. Diabetic: 'Snowflake' cataracts (sorbitol). Galactosemic: 'Oil-Drop' cataracts (galactitol).",
      ophthalmicManagement: "Definitive cure is micro-incision ultrasonic Phacoemulsification with in-the-bag implantation of a foldable Posterior Chamber Intraocular Lens (PCIOL).",
      highYieldPearl: "Posterior subcapsular cataract is the most common cataract morphology induced by chronic systemic or topical corticosteroid therapy."
    },
    {
      id: "phacoemulsification-endophthalmitis",
      name: "2. Phacoemulsification Steps & Postoperative Endophthalmitis",
      category: "Cataract Surgery",
      subType: "Continuous Curvilinear Capsulorhexis (CCC) • Endophthalmitis (Vancomycin + Ceftazidime)",
      clinicalAlgorithm: "Phaco: Clear corneal incision -> CCC -> Hydrodissection -> Ultrasonic fragmentation -> Foldable PCIOL. Endophthalmitis (days 1-7): Pain, hypopyon, vitritis.",
      diagnosticCriteria: "Acute postoperative endophthalmitis (S. epidermidis 70%, S. aureus): Marked pain, vision loss, hypopyon, vitritis. Vitreous tap + intravitreal antibiotics.",
      ophthalmicManagement: "Intravitreal Vancomycin (1.0 mg) + Ceftazidime (2.25 mg); Emergency Pars Plana Vitrectomy (PPV) if initial vision is Light Perception (LP) only.",
      highYieldPearl: "According to the Endophthalmitis Vitrectomy Study (EVS), immediate Pars Plana Vitrectomy is indicated when presenting visual acuity is reduced to Light Perception only."
    }
  ],

  retina: [
    {
      id: "crao-cherry-red-spot",
      name: "1. Central Retinal Artery Occlusion (CRAO) & Cherry-Red Spot",
      category: "Retinal Vascular Emergency",
      subType: "Sudden Painless Vision Loss • Cherry-Red Spot at Fovea • Boxcarring",
      clinicalAlgorithm: "Sudden catastrophic monocular vision loss + RAPD -> Diffuse pale milky retina + Cherry-Red Spot at fovea -> Emergency ocular massage + AC paracentesis.",
      diagnosticCriteria: "Thin fovea allows underlying vascular choroid to show through opaque ischemic inner retina. Boxcarring (segmented RBC flow) in retinal arterioles.",
      ophthalmicManagement: "Emergency treatment within 4-6 hours: Ocular digital massage, anterior chamber paracentesis, sublingual isosorbide dinitrate, hyperbaric O2, urgent GCA workup.",
      highYieldPearl: "The cherry-red spot in CRAO occurs because the fovea lacks inner retinal layers, allowing the underlying rich choroidal circulation to remain visible."
    },
    {
      id: "crvo-retinal-detachment-pdr",
      name: "2. CRVO (Blood & Thunder), Retinal Detachment & PDR (PRP Laser)",
      category: "Vitreoretinal Pathology",
      subType: "CRVO (Blood & Thunder) • Detachment (Grey Veil Curtain) • PDR (Neovascularization)",
      clinicalAlgorithm: "CRVO: 'Blood and thunder' hemorrhages -> Anti-VEGF. Retinal Detachment: Flashes, floaters, dark curtain -> Vitrectomy. PDR: NVD/NVE -> Panretinal Photocoagulation.",
      diagnosticCriteria: "Rhegmatogenous RD: Billowing corrugated grey-white detached retina + Shafer's sign (tobacco dust in vitreous). CRVO: Risk of 90-day neovascular glaucoma.",
      ophthalmicManagement: "Retinal detachment: Emergency Vitrectomy / Scleral Buckling. PDR: Panretinal Photocoagulation (PRP Laser) + Intravitreal Anti-VEGF (Aflibercept).",
      highYieldPearl: "The classic symptom triad of Rhegmatogenous Retinal Detachment is Photopsia (flashes of light), sudden floaters ('shower of pepper'), and a dark descending curtain."
    }
  ]
};

interface OphthalmologyLabViewerProps {
  initialMode?: OphthalmologyLabMode;
  height?: string;
  onNodeSelect?: (node: OphthalmologyLabNode) => void;
}

export default function OphthalmologyLabViewer({
  initialMode = "glaucoma",
  height = "560px",
  onNodeSelect,
}: OphthalmologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<OphthalmologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Glaucoma IOP & Gonioscopy State
  const [iopMmHg, setIopMmHg] = useState<number>(48); // mmHg
  const [cupToDiscRatio, setCupToDiscRatio] = useState<number>(0.7);
  const [shafferAngleGrade, setShafferAngleGrade] = useState<number>(0); // 0 = closed, 4 = wide open

  // Slit Lamp Pathology State
  const [cornealPathology, setCornealPathology] = useState<"hsv" | "bacterial" | "fungal" | "acanthamoeba">("hsv");

  // Cataract Type State
  const [cataractType, setCataractType] = useState<"nuclear" | "cortical" | "psc" | "diabetic">("psc");

  // Retina Emergency State
  const [retinaEmergency, setRetinaEmergency] = useState<"crao" | "crvo" | "rrd" | "pdr">("crao");

  // Glaucoma Triage Calculation
  const glaucomaTriage = useMemo(() => {
    if (shafferAngleGrade <= 1 && iopMmHg >= 35) {
      return {
        level: "ACUTE ANGLE-CLOSURE GLAUCOMA EMERGENCY",
        color: "text-rose-400 font-extrabold",
        action: "Immediate IV 20% Mannitol + IV Acetazolamide 500mg + Topical Timolol -> Bilateral Laser Peripheral Iridotomy (LPI)"
      };
    } else if (iopMmHg > 21 || cupToDiscRatio >= 0.6) {
      return {
        level: "Primary Open-Angle Glaucoma (POAG)",
        color: "text-amber-300 font-bold",
        action: "Start 1st-line Prostaglandin Analog (Latanoprost) at bedtime; perform visual field Humphrey perimetry"
      };
    }
    return {
      level: "Normal Physiological Intraocular Pressure (10–21 mmHg)",
      color: "text-emerald-400 font-bold",
      action: "Routine annual ophthalmic examination; healthy optic nerve head"
    };
  }, [shafferAngleGrade, iopMmHg, cupToDiscRatio]);

  const currentNodes = useMemo(() => {
    return OPHTHALMOLOGY_NODES[activeMode] || OPHTHALMOLOGY_NODES.glaucoma;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: OphthalmologyLabNode) => {
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
            <Eye size={14} /> OPHTH-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "glaucoma" && "Intraocular Pressure (IOP) & Glaucoma Emergency Triage Engine"}
            {activeMode === "slitLamp" && "Slit-Lamp Biomicroscopy & Corneal Staining Diagnostic Simulator"}
            {activeMode === "cataract" && "Cataract Morphology, Phacoemulsification & Endophthalmitis Explorer"}
            {activeMode === "retina" && "Retinal Vascular & Neurological Emergency Funduscopy Visualizer"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Ophthalmology Quiz"}
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
                  Ophthalmology Clinical Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Ophthalmic Entity: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: Intraocular Pressure & Glaucoma Triage */}
          {activeMode === "glaucoma" && (
            <div className={styles.ophSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Intraocular Pressure (Goldmann Tonometry) &amp; Angle Classification
                </span>
                <span className="text-[11px] text-slate-400">Normal IOP: 10–21 mmHg</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Intraocular Pressure:</span>{" "}
                    <strong className="text-sky-400">{iopMmHg} mmHg</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    step="2"
                    value={iopMmHg}
                    onChange={(e) => setIopMmHg(parseInt(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Cup-to-Disc (C:D) Ratio:</span>{" "}
                    <strong className="text-sky-400">{cupToDiscRatio.toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.95"
                    step="0.05"
                    value={cupToDiscRatio}
                    onChange={(e) => setCupToDiscRatio(parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Gonioscopy Angle:</span>{" "}
                    <strong className="text-sky-400">Shaffer Grade {shafferAngleGrade} ({shafferAngleGrade === 0 ? "Closed" : "Open"})</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={shafferAngleGrade}
                    onChange={(e) => setShafferAngleGrade(parseInt(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>

              <div className={styles.ophResultsGrid}>
                <div className={styles.ophResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Diagnostic Classification</div>
                  <div className={`text-xs font-bold mt-1 ${glaucomaTriage.color}`}>{glaucomaTriage.level}</div>
                </div>
                <div className={styles.ophResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Optic Disc ISNT Rule</div>
                  <div className="text-xs font-bold text-sky-300 mt-1">
                    {cupToDiscRatio > 0.5 ? "ISNT Rule Violated (Rim Thinning)" : "Normal Intact Neuroretinal Rim"}
                  </div>
                </div>
                <div className={styles.ophResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Guideline Management</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{glaucomaTriage.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Slit-Lamp Biomicroscopy & Corneal Staining */}
          {activeMode === "slitLamp" && (
            <div className={styles.ophSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera size={14} /> Slit-Lamp Biomicroscopy &amp; Cobalt Blue Corneal Ulcer Staining
                </span>
                <span className="text-[11px] text-slate-400">Sodium Fluorescein Staining</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setCornealPathology("hsv")}
                  className={`p-2 rounded font-bold border transition ${
                    cornealPathology === "hsv"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  HSV Dendritic Ulcer
                </button>
                <button
                  onClick={() => setCornealPathology("bacterial")}
                  className={`p-2 rounded font-bold border transition ${
                    cornealPathology === "bacterial"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Bacterial Hypopyon
                </button>
                <button
                  onClick={() => setCornealPathology("fungal")}
                  className={`p-2 rounded font-bold border transition ${
                    cornealPathology === "fungal"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Fungal Satellite
                </button>
                <button
                  onClick={() => setCornealPathology("acanthamoeba")}
                  className={`p-2 rounded font-bold border transition ${
                    cornealPathology === "acanthamoeba"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Acanthamoeba Ring
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {cornealPathology === "hsv" && (
                  <div>
                    <div className="text-sky-300 font-bold">Herpes Simplex Virus (HSV) Epithelial Keratitis</div>
                    <div className="text-slate-300 mt-1">Branching dendritic ulcer with terminal end-bulbs; stains bright green with Fluorescein. Reduced corneal sensation.</div>
                    <div className="text-rose-400 font-bold mt-1">CRITICAL WARNING: Topical steroids are STRICTLY CONTRAINDICATED (triggers geographic ulceration).</div>
                  </div>
                )}
                {cornealPathology === "bacterial" && (
                  <div>
                    <div className="text-sky-300 font-bold">Bacterial Keratitis (Pseudomonas / S. aureus)</div>
                    <div className="text-slate-300 mt-1">Dense white suppurative stromal infiltrate with overlying epithelial defect and sterile Hypopyon (pus layer in anterior chamber).</div>
                    <div className="text-emerald-300 font-bold mt-1">Management: Intensive fortified topical Moxifloxacin / Tobramycin hourly.</div>
                  </div>
                )}
                {cornealPathology === "fungal" && (
                  <div>
                    <div className="text-sky-300 font-bold">Fungal Keratitis (Fusarium / Aspergillus)</div>
                    <div className="text-slate-300 mt-1">Trauma from vegetative matter. Greyish-white stromal infiltrate with feathery serrated margins and satellite lesions.</div>
                    <div className="text-amber-300 font-bold mt-1">Management: Topical Natamycin 5% suspension.</div>
                  </div>
                )}
                {cornealPathology === "acanthamoeba" && (
                  <div>
                    <div className="text-sky-300 font-bold">Acanthamoeba Keratitis (Contact Lens Tap Water)</div>
                    <div className="text-slate-300 mt-1">Severe excruciating pain out of proportion to physical signs; radial keratoneuritis leading to classic Ring Infiltrate.</div>
                    <div className="text-sky-300 font-bold mt-1">Management: Topical PHMB 0.02% or Chlorhexidine 0.02%.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Cataract Morphology & Phacoemulsification */}
          {activeMode === "cataract" && (
            <div className={styles.ophSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sun size={14} /> Cataract Morphology &amp; Ultrasonic Phacoemulsification
                </span>
                <span className="text-[11px] text-slate-400">Foldable PCIOL Implantation</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setCataractType("nuclear")}
                  className={`p-2 rounded font-bold border transition ${
                    cataractType === "nuclear"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Nuclear Sclerotic
                </button>
                <button
                  onClick={() => setCataractType("cortical")}
                  className={`p-2 rounded font-bold border transition ${
                    cataractType === "cortical"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Cortical Spoke
                </button>
                <button
                  onClick={() => setCataractType("psc")}
                  className={`p-2 rounded font-bold border transition ${
                    cataractType === "psc"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Posterior Subcapsular
                </button>
                <button
                  onClick={() => setCataractType("diabetic")}
                  className={`p-2 rounded font-bold border transition ${
                    cataractType === "diabetic"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Diabetic Snowflake
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {cataractType === "nuclear" && (
                  <div>
                    <div className="text-sky-300 font-bold">Nuclear Sclerotic Cataract</div>
                    <div className="text-slate-300 mt-1">Yellow-brown nuclear hardening. Increases lens refractive power, producing a temporary myopic shift ('Second Sight' for near vision).</div>
                  </div>
                )}
                {cataractType === "cortical" && (
                  <div>
                    <div className="text-sky-300 font-bold">Cortical Cataract</div>
                    <div className="text-slate-300 mt-1">Radial cuneiform 'spoke-wheel' opacities extending inward from the periphery; causes night driving glare and monocular diplopia.</div>
                  </div>
                )}
                {cataractType === "psc" && (
                  <div>
                    <div className="text-sky-300 font-bold">Posterior Subcapsular Cataract (PSC)</div>
                    <div className="text-slate-300 mt-1">Granular plaque directly anterior to posterior capsule. Highly associated with systemic Corticosteroid use and diabetes; causes severe daytime/nighttime glare.</div>
                  </div>
                )}
                {cataractType === "diabetic" && (
                  <div>
                    <div className="text-sky-300 font-bold">Diabetic 'Snowflake' Cataract</div>
                    <div className="text-slate-300 mt-1">Osmotic lens swelling from intracellular Sorbitol accumulation via the Aldose Reductase pathway in poorly controlled diabetes.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 4: Retinal Vascular Emergencies & Detachment */}
          {activeMode === "retina" && (
            <div className={styles.ophSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target size={14} /> Retinal Vascular Emergencies &amp; Detachment Funduscopy
                </span>
                <span className="text-[11px] text-slate-400">Cherry-Red Spot • Blood &amp; Thunder</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setRetinaEmergency("crao")}
                  className={`p-2 rounded font-bold border transition ${
                    retinaEmergency === "crao"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  CRAO (Cherry-Red)
                </button>
                <button
                  onClick={() => setRetinaEmergency("crvo")}
                  className={`p-2 rounded font-bold border transition ${
                    retinaEmergency === "crvo"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  CRVO (Blood &amp; Thunder)
                </button>
                <button
                  onClick={() => setRetinaEmergency("rrd")}
                  className={`p-2 rounded font-bold border transition ${
                    retinaEmergency === "rrd"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Retinal Detachment
                </button>
                <button
                  onClick={() => setRetinaEmergency("pdr")}
                  className={`p-2 rounded font-bold border transition ${
                    retinaEmergency === "pdr"
                      ? "bg-sky-600 text-white border-sky-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Diabetic (PDR)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {retinaEmergency === "crao" && (
                  <div>
                    <div className="text-sky-300 font-bold">Central Retinal Artery Occlusion (CRAO - Ocular Stroke)</div>
                    <div className="text-slate-300 mt-1">Sudden painless profound vision loss + RAPD. Diffuse pale milky retina with pathognomonic 'Cherry-Red Spot' at fovea.</div>
                    <div className="text-rose-400 font-bold mt-1">Emergency window &lt; 4-6 hours: Ocular digital massage, AC paracentesis, GCA workup.</div>
                  </div>
                )}
                {retinaEmergency === "crvo" && (
                  <div>
                    <div className="text-sky-300 font-bold">Central Retinal Vein Occlusion (CRVO)</div>
                    <div className="text-slate-300 mt-1">Dramatic 'Blood and Thunder' fundus with extensive flame hemorrhages in all 4 quadrants and tortuous veins.</div>
                    <div className="text-amber-300 font-bold mt-1">Complication: 90-Day Neovascular Glaucoma; treat with intravitreal Anti-VEGF.</div>
                  </div>
                )}
                {retinaEmergency === "rrd" && (
                  <div>
                    <div className="text-sky-300 font-bold">Rhegmatogenous Retinal Detachment (RRD)</div>
                    <div className="text-slate-300 mt-1">Photopsia (flashes), floaters (shower of pepper), and a dark descending curtain. Billowing corrugated grey-white detached retina with Shafer sign.</div>
                    <div className="text-emerald-300 font-bold mt-1">Management: Emergency Pars Plana Vitrectomy / Scleral Buckling.</div>
                  </div>
                )}
                {retinaEmergency === "pdr" && (
                  <div>
                    <div className="text-sky-300 font-bold">Proliferative Diabetic Retinopathy (PDR)</div>
                    <div className="text-slate-300 mt-1">Retinal ischemia triggers VEGF-mediated Neovascularization of Disc (NVD) or Elsewhere (NVE).</div>
                    <div className="text-emerald-300 font-bold mt-1">Management: Panretinal Photocoagulation (PRP Laser) + Anti-VEGF.</div>
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
                    <span className="text-sky-400 font-bold">Algorithm:</span> {node.clinicalAlgorithm}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect ophthalmic protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Ophthalmology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Ophthalmic Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
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
            <div className={styles.inspectorBody}>{activeNode.ophthalmicManagement}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Kanski / Khurana High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("glaucoma")}
          className={`${styles.modeTab} ${activeMode === "glaucoma" ? styles.modeTabActive : ""}`}
        >
          👁️ 1. Glaucoma &amp; IOP (AACG)
        </button>
        <button
          onClick={() => setActiveMode("slitLamp")}
          className={`${styles.modeTab} ${activeMode === "slitLamp" ? styles.modeTabActive : ""}`}
        >
          🔬 2. Slit-Lamp &amp; Cornea
        </button>
        <button
          onClick={() => setActiveMode("cataract")}
          className={`${styles.modeTab} ${activeMode === "cataract" ? styles.modeTabActive : ""}`}
        >
          ☀️ 3. Cataract &amp; Phaco
        </button>
        <button
          onClick={() => setActiveMode("retina")}
          className={`${styles.modeTab} ${activeMode === "retina" ? styles.modeTabActive : ""}`}
        >
          🎯 4. Retinal Emergencies
        </button>
      </div>
    </div>
  );
}
