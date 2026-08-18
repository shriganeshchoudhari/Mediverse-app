"use client";

import React, { useState, useMemo } from "react";
import styles from "./NuclearMedicineLabViewer.module.css";
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
} from "lucide-react";

export type NuclearMedicineLabMode = "physics" | "spect" | "pet" | "theranostics";

export interface NuclearMedicineLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  physicsMechanism: string;
  diagnosticCriteria: string;
  clinicalProtocol: string;
  highYieldPearl: string;
}

export const NUCLEAR_MEDICINE_NODES: Record<NuclearMedicineLabMode, NuclearMedicineLabNode[]> = {
  physics: [
    {
      id: "nucl-tc99m-mo99-generator-physics",
      name: "Technetium-99m & Mo-99/Tc-99m Generator",
      category: "Radionuclide Physics",
      subType: "T1/2 = 6.02 hours • 140 keV Pure Gamma • Mo-99 Fission Generator ('Moly Cow')",
      physicsMechanism: "Isomeric transition from meta-stable Tc-99m to ground Tc-99. Emits a 140 keV monochromatic gamma photon ideal for NaI(Tl) scintillation crystals.",
      diagnosticCriteria: "Moly breakthrough limit: <0.15 uCi Mo-99 per 1 mCi Tc-99m at the time of administration.",
      clinicalProtocol: "Eluted daily with 0.9% normal saline. Formulated into MDP (bones), Sestamibi (myocardium/parathyroid), MAG3 (kidneys), and Mebrofenin (HIDA).",
      highYieldPearl: "Technetium-99m has an ideal physical half-life of 6 hours and a 140 keV gamma photon that perfectly matches the peak detection efficiency of standard gamma cameras."
    },
    {
      id: "nucl-f18-positron-cyclotron-physics",
      name: "Fluorine-18 & Positron Annihilation Physics",
      category: "PET Physics",
      subType: "T1/2 = 110 minutes • Beta+ Positron Emission • 511 keV Coincident Photons at 180°",
      physicsMechanism: "Positron emitted by F-18 travels <1 mm before annihilating with an electron, producing two 511 keV gamma photons emitted in precisely opposite directions (180°).",
      diagnosticCriteria: "True coincidence event timing window (4-10 ns) on PET detector ring without physical collimation (electronic collimation).",
      clinicalProtocol: "Produced in medical cyclotrons via 18O(p,n)18F reaction. Synthesized into 18F-FDG for oncology and 18F-DCFPyL for prostate PSMA PET.",
      highYieldPearl: "Positron emission tomography uses electronic collimation by detecting coincident 511 keV annihilation photons traveling 180° apart within nanosecond timing windows."
    }
  ],

  spect: [
    {
      id: "nucl-hida-cholecystitis-morphine",
      name: "HIDA Scan & Acute Cholecystitis with Morphine",
      category: "Hepatobiliary Scintigraphy",
      subType: "99mTc-Mebrofenin • Non-Visualization of Gallbladder at 60 min • Morphine Augmentation",
      physicsMechanism: "Hepatocyte extraction of radiotracer into bile. Obstruction of cystic duct prevents tracer entry into gallbladder lumen.",
      diagnosticCriteria: "Acute Cholecystitis: Gallbladder fails to visualize at 60 min (and persists non-visualized 30 min post-morphine 0.04 mg/kg) with patent CBD and bowel excretion.",
      clinicalProtocol: "Fasting 2-4 hours prior (prolonged fasting >24h requires CCK pretreatment to empty sludge). 'Rim sign' indicates severe gangrenous inflammation.",
      highYieldPearl: "Persistent non-visualization of the gallbladder on HIDA scan after morphine augmentation despite prompt common bile duct and duodenal filling confirms acute cholecystitis."
    },
    {
      id: "nucl-vq-lung-scan-pioped-mismatch",
      name: "V/Q Lung Scintigraphy & PIOPED II PE Criteria",
      category: "Pulmonary Scintigraphy",
      subType: "99mTc-MAA Perfusion • 99mTc-DTPA / Xe-133 Ventilation • Wedge-Shaped V/Q Mismatch",
      physicsMechanism: "99mTc-MAA particles (20-40 um) microembolize in pulmonary capillaries. Thromboembolism occludes perfusion without affecting alveolar ventilation.",
      diagnosticCriteria: "High-Probability PE: >=2 large (or equivalent moderate) wedge-shaped segmental perfusion defects with normal ventilation (V/Q mismatch).",
      clinicalProtocol: "Preferred in patients with renal failure (GFR <30), severe contrast allergy, or pregnancy where CTPA is contraindicated.",
      highYieldPearl: "A high-probability V/Q scan requires two or more segmental wedge-shaped perfusion defects with completely normal ventilation (V/Q mismatch)."
    }
  ],

  pet: [
    {
      id: "nucl-fdg-warburg-suv-quantitation",
      name: "18F-FDG Warburg Glycolysis & SUV Quantitation",
      category: "Molecular Oncology PET",
      subType: "Hexokinase Trapping • GLUT Upregulation • Fasting >=4-6h • Brown Fat Warming Protocol",
      physicsMechanism: "Hexokinase phosphorylates 18F-FDG to 18F-FDG-6-phosphate, which cannot be isomerized or metabolized further, trapping it in cancer cells.",
      diagnosticCriteria: "Standardized Uptake Value (SUV): Target tissue activity (kBq/mL) / [Injected dose (kBq) / Body weight (g)]. Blood glucose must be <150-200 mg/dL.",
      clinicalProtocol: "Patient in warm room (21-24°C) + oral propranolol to prevent brown fat activation. Staging for lymphoma, lung, colorectal, melanoma, and esophageal cancers.",
      highYieldPearl: "Serum hyperglycemia competitively blocks 18F-FDG uptake through GLUT transporters; patients must fast >=4-6 hours with blood glucose <150-200 mg/dL before PET."
    },
    {
      id: "nucl-brain-pet-dementia-cingulate-island",
      name: "Brain FDG PET: Alzheimer vs FTD vs Lewy Body",
      category: "Neuro-Nuclear Imaging",
      subType: "Alzheimer (Temporoparietal) • FTD (Frontal) • Lewy Body (Occipital + Cingulate Island)",
      physicsMechanism: "Regional neuronal and synaptic loss results in localized cortical glucose hypometabolism.",
      diagnosticCriteria: "Alzheimer: Symmetric temporoparietal & posterior cingulate hypometabolism. FTD: Frontal & anterior temporal. DLB: Occipital with preserved posterior cingulate ('Cingulate Island Sign').",
      clinicalProtocol: "Patient rests in quiet, dimly lit room with eyes open without speaking during tracer uptake phase.",
      highYieldPearl: "Preservation of the posterior cingulate cortex amidst severe occipital visual hypometabolism ('Cingulate Island Sign') distinguishes Dementia with Lewy Bodies from Alzheimer disease."
    }
  ],

  theranostics: [
    {
      id: "nucl-lu177-dotatate-prrt-renoprotection",
      name: "177Lu-DOTATATE (Lutathera) PRRT in NETs",
      category: "Peptide Receptor Radionuclide Therapy",
      subType: "68Ga-DOTATATE Diagnostic -> 177Lu-DOTATATE Beta Therapy • SSTR2 Target • Lysine/Arginine",
      physicsMechanism: "Lutetium-177 emits beta-minus particles (range ~2 mm) targeting SSTR2-expressing tumor cells. 68Ga PET confirms high SSTR2 avidity first.",
      diagnosticCriteria: "Well-differentiated metastatic gastroenteropancreatic neuroendocrine tumors (NETTER-1 trial). Four cycles of 7.4 GBq (200 mCi) q8w.",
      clinicalProtocol: "Mandatory co-infusion of basic amino acids (L-lysine and L-arginine) for 4 hours to competitively block proximal renal tubular reabsorption and prevent radiation nephritis.",
      highYieldPearl: "Co-infusion of basic amino acids (L-lysine and L-arginine) is mandatory during 177Lu-DOTATATE PRRT to competitively inhibit renal tubular reabsorption and prevent nephrotoxicity."
    },
    {
      id: "nucl-lu177-psma-pluvicto-i131-ablation",
      name: "177Lu-PSMA-617 (Pluvicto) & I-131 Thyroid Ablation",
      category: "Targeted Radionuclide Therapies",
      subType: "177Lu-PSMA-617 (mCRPC) • I-131 (Graves & Thyroid Cancer) • 223Ra Alpha (Xofigo Bone)",
      physicsMechanism: "PSMA targeting delivers beta radiation to prostate metastases. I-131 delivers beta radiation via Sodium-Iodide Symporter (NIS) to thyroid folicular cells.",
      diagnosticCriteria: "Pluvicto: PSMA-positive metastatic CRPC (VISION trial). I-131: Graves (10-15 mCi), Papillary/Follicular thyroid cancer ablation (30-150 mCi after TSH >30 uIU/mL).",
      clinicalProtocol: "Low-iodine diet for 1-2 weeks before I-131; sour lemon candies at 24h to prevent sialadenitis; negative pregnancy test mandatory.",
      highYieldPearl: "Patients receiving I-131 radioablation must achieve a stimulated TSH >30 uIU/mL (via thyroid hormone withdrawal or recombinant TSH) to maximally upregulate the Sodium-Iodide Symporter."
    }
  ]
};

interface NuclearMedicineLabViewerProps {
  initialMode?: NuclearMedicineLabMode;
  height?: string;
  onNodeSelect?: (node: NuclearMedicineLabNode) => void;
}

export default function NuclearMedicineLabViewer({
  initialMode = "physics",
  height = "560px",
  onNodeSelect,
}: NuclearMedicineLabViewerProps) {
  const [activeMode, setActiveMode] = useState<NuclearMedicineLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Radionuclide Physics State
  const [selectedIsotope, setSelectedIsotope] = useState<"tc99m" | "f18" | "i131" | "lu177" | "ga68">("tc99m");

  // Dementia Brain Pattern State
  const [selectedDementia, setSelectedDementia] = useState<"ad" | "ftd" | "dlb">("ad");

  // Radionuclide Details
  const isotopeDetails = useMemo(() => {
    if (selectedIsotope === "tc99m") {
      return {
        name: "Technetium-99m (99mTc)",
        halfLife: "6.02 Hours",
        decayMode: "Isomeric Transition (IT)",
        photonEnergy: "140 keV Pure Gamma",
        production: "Mo-99 / Tc-99m Fission Generator ('Moly Cow')",
        color: "text-amber-400 font-bold"
      };
    } else if (selectedIsotope === "f18") {
      return {
        name: "Fluorine-18 (18F)",
        halfLife: "109.7 Minutes (~110 min)",
        decayMode: "Positron (Beta+) Emission",
        photonEnergy: "Two 511 keV Annihilation Photons (180°)",
        production: "Medical Cyclotron (18O(p,n)18F)",
        color: "text-yellow-400 font-bold"
      };
    } else if (selectedIsotope === "i131") {
      return {
        name: "Iodine-131 (131I)",
        halfLife: "8.02 Days",
        decayMode: "Beta-Minus (Beta-) + Gamma (364 keV)",
        photonEnergy: "Beta max 0.606 MeV (Range 0.8 mm in tissue)",
        production: "Nuclear Reactor Fission",
        color: "text-orange-400 font-bold"
      };
    } else if (selectedIsotope === "lu177") {
      return {
        name: "Lutetium-177 (177Lu)",
        halfLife: "6.65 Days",
        decayMode: "Beta-Minus (Beta-) + Low Gamma (113/208 keV)",
        photonEnergy: "Beta max 0.498 MeV (Range ~2 mm in tissue)",
        production: "Nuclear Reactor Neutron Capture",
        color: "text-lime-400 font-bold"
      };
    } else {
      return {
        name: "Gallium-68 (68Ga)",
        halfLife: "67.7 Minutes (~68 min)",
        decayMode: "Positron (Beta+) Emission",
        photonEnergy: "511 keV Annihilation Photons",
        production: "Ge-68 / Ga-68 Generator",
        color: "text-emerald-400 font-bold"
      };
    }
  }, [selectedIsotope]);

  const dementiaDetails = useMemo(() => {
    if (selectedDementia === "ad") {
      return {
        title: "Alzheimer Disease (AD)",
        hypometabolism: "Symmetric Bilateral Temporoparietal & Posterior Cingulate Cortex",
        sparedRegions: "Primary Sensorimotor Cortex, Visual Cortex, Basal Ganglia, Cerebellum",
        sign: "Early Posterior Cingulate Cortex hypometabolism on 18F-FDG PET"
      };
    } else if (selectedDementia === "ftd") {
      return {
        title: "Frontotemporal Dementia (FTD)",
        hypometabolism: "Bilateral Frontal Lobes & Anterior Temporal Lobes",
        sparedRegions: "Parietal Cortex and Occipital Visual Cortex preserved",
        sign: "Marked anterior frontotemporal metabolic shutdown matching behavioral/language deficits"
      };
    } else {
      return {
        title: "Dementia with Lewy Bodies (DLB)",
        hypometabolism: "Bilateral Occipital Primary Visual Cortex & Temporoparietal Cortex",
        sparedRegions: "Relative preservation of the Posterior Cingulate Cortex",
        sign: "Pathognomonic 'Cingulate Island Sign' distinguishing DLB from Alzheimer disease"
      };
    }
  }, [selectedDementia]);

  const currentNodes = useMemo(() => {
    return NUCLEAR_MEDICINE_NODES[activeMode] || NUCLEAR_MEDICINE_NODES.physics;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: NuclearMedicineLabNode) => {
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
            <Award size={14} /> NUCL-401
          </span>
          <span className={styles.titleText}>
            {activeMode === "physics" && "Radiopharmaceutical Decay Physics, Half-Lives & ALARA Shielding"}
            {activeMode === "spect" && "Planar Scintigraphy & SPECT-CT (HIDA, V/Q Mismatch, Bone & MAG3)"}
            {activeMode === "pet" && "18F-FDG PET-CT Oncology SUV & Brain Dementia Metabolic Patterns"}
            {activeMode === "theranostics" && "Molecular Theranostics: 177Lu-DOTATATE, 177Lu-PSMA-617 & I-131"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Nuclear Med Quiz"}
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
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Nuclear Medicine Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Examination / Tracer: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-amber-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-amber-950 text-xs rounded border border-amber-700 text-amber-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Radionuclide Physics Simulator */}
          {activeMode === "physics" && (
            <div className={styles.nuclSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Diagnostic &amp; Therapeutic Radionuclide Physics
                </span>
                <span className="text-[11px] text-slate-400">Half-Life &bull; Radiation Emissions</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <button
                  onClick={() => setSelectedIsotope("tc99m")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedIsotope === "tc99m"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  99mTc (6h)
                </button>
                <button
                  onClick={() => setSelectedIsotope("f18")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedIsotope === "f18"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  18F (110m)
                </button>
                <button
                  onClick={() => setSelectedIsotope("i131")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedIsotope === "i131"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  131I (8.0d)
                </button>
                <button
                  onClick={() => setSelectedIsotope("lu177")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedIsotope === "lu177"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  177Lu (6.7d)
                </button>
                <button
                  onClick={() => setSelectedIsotope("ga68")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedIsotope === "ga68"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  68Ga (68m)
                </button>
              </div>

              <div className={styles.nuclResultsGrid}>
                <div className={styles.nuclResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Physical Half-Life</div>
                  <div className={`text-xs font-bold mt-1 ${isotopeDetails.color}`}>{isotopeDetails.halfLife}</div>
                </div>
                <div className={styles.nuclResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Decay Mechanism</div>
                  <div className="text-xs font-bold text-yellow-300 mt-1">{isotopeDetails.decayMode}</div>
                </div>
                <div className={styles.nuclResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Principal Emission</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">{isotopeDetails.photonEnergy}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div><strong className="text-yellow-400">Production Source:</strong> {isotopeDetails.production}</div>
                <div className="mt-1"><strong className="text-yellow-400">ALARA Safety Rule:</strong> Use Lucite/plastic shielding for pure beta emitters to prevent high-Z Bremsstrahlung X-rays!</div>
              </div>
            </div>
          )}

          {/* Mode 2: SPECT & Planar Scintigraphy */}
          {activeMode === "spect" && (
            <div className={styles.nuclSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Planar &amp; SPECT-CT Scintigraphic Matrix
                </span>
                <span className="text-[11px] text-slate-400">HIDA &bull; V/Q &bull; Bone &bull; MAG3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-yellow-300 font-bold">HIDA Acute Cholecystitis</div>
                  <div className="text-slate-300 mt-1">Non-visualization of gallbladder at 60 min (and post-morphine) with patent CBD and bowel excretion confirms cystic duct obstruction.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-yellow-300 font-bold">High-Probability V/Q Mismatch PE</div>
                  <div className="text-slate-300 mt-1">&ge;2 wedge-shaped segmental perfusion defects (99mTc-MAA) with completely normal ventilation (99mTc-DTPA aerosol).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: PET-CT Oncology & Brain Dementia */}
          {activeMode === "pet" && (
            <div className={styles.nuclSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Brain 18F-FDG PET Neurodegenerative Classifier
                </span>
                <span className="text-[11px] text-slate-400">Alzheimer &bull; FTD &bull; Lewy Body</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setSelectedDementia("ad")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDementia === "ad"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Alzheimer (AD)
                </button>
                <button
                  onClick={() => setSelectedDementia("ftd")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDementia === "ftd"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Frontotemporal (FTD)
                </button>
                <button
                  onClick={() => setSelectedDementia("dlb")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDementia === "dlb"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Lewy Body (DLB)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-yellow-300">{dementiaDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-yellow-400">Hypometabolic Territory:</strong> {dementiaDetails.hypometabolism}</div>
                <div className="text-slate-300 mt-1"><strong className="text-yellow-400">Spared Cortical Areas:</strong> {dementiaDetails.sparedRegions}</div>
                <div className="text-emerald-300 font-bold mt-1.5">{dementiaDetails.sign}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Molecular Theranostics */}
          {activeMode === "theranostics" && (
            <div className={styles.nuclSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> Molecular Theranostics &amp; Targeted PRRT
                </span>
                <span className="text-[11px] text-slate-400">Lutathera &bull; Pluvicto &bull; I-131</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-yellow-300 font-bold">177Lu-DOTATATE PRRT in NETs</div>
                  <div className="text-slate-300 mt-1">Targets SSTR2. Mandatory co-infusion of L-lysine and L-arginine amino acids for 4 hours to prevent radiation nephropathy.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-yellow-300 font-bold">177Lu-PSMA-617 in mCRPC</div>
                  <div className="text-slate-300 mt-1">Targets PSMA on metastatic prostate cancer cells (VISION trial), delivering targeted beta radiation to bone and soft-tissue lesions.</div>
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
                    <span className="text-yellow-400 font-bold">Protocol:</span> {node.clinicalProtocol}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Nuclear Medicine Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
              Nuclear Med Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>☢️ Topic &amp; Focus</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Physical &amp; Molecular Mechanism</div>
            <div className={styles.inspectorBody}>{activeNode.physicsMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Presentation</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Nuclear Medicine Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("physics")}
          className={`${styles.modeTab} ${activeMode === "physics" ? styles.modeTabActive : ""}`}
        >
          ☢️ 1. Isotopes &amp; Decay
        </button>
        <button
          onClick={() => setActiveMode("spect")}
          className={`${styles.modeTab} ${activeMode === "spect" ? styles.modeTabActive : ""}`}
        >
          📷 2. Scintigraphy &amp; SPECT
        </button>
        <button
          onClick={() => setActiveMode("pet")}
          className={`${styles.modeTab} ${activeMode === "pet" ? styles.modeTabActive : ""}`}
        >
          🧠 3. PET-CT &amp; Dementia
        </button>
        <button
          onClick={() => setActiveMode("theranostics")}
          className={`${styles.modeTab} ${activeMode === "theranostics" ? styles.modeTabActive : ""}`}
        >
          🎯 4. Theranostics &amp; PRRT
        </button>
      </div>
    </div>
  );
}
