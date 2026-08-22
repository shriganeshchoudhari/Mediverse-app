"use client";

import React, { useState, useMemo } from "react";
import styles from "./PathologySlideViewer.module.css";
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
  Eye,
  Sun,
  Moon,
} from "lucide-react";

export type SlideCollectionType = "cell-injury" | "neoplasia" | "hemodynamics" | "histopathology";
export type MicroscopeObjective = "4x" | "10x" | "40x" | "100x";
export type HistologicalStain = "HE" | "Masson" | "CongoRed" | "PAS" | "PrussianBlue" | "ZiehlNeelsen";

export interface PathologySlide {
  id: string;
  name: string;
  organ: string;
  diagnosis: string;
  etiology: string;
  lowPowerDescription: string;
  highPowerDescription: string;
  pathognomonicFinding: string;
  recommendedStain: HistologicalStain;
  hasPolarizedFeature?: boolean;
  polarizedDescription?: string;
  clinicalPresentation: string;
  highYieldPearl: string;
}

export const PATHOLOGY_SLIDES: Record<SlideCollectionType, PathologySlide[]> = {
  "cell-injury": [
    {
      id: "coagulative-mi",
      name: "1. Coagulative Necrosis (Myocardium)",
      organ: "Heart",
      diagnosis: "Acute Myocardial Infarction (12-24 Hours)",
      etiology: "Coronary artery thrombosis causing severe ischemic hypoxia and protein denaturation.",
      lowPowerDescription: "Preserved architectural tissue outline with hypereosinophilic, deeply stained anucleate myocytes.",
      highPowerDescription: "Ghost cell outlines of cardiomyocytes lacking nuclei (pyknosis, karyolysis), loss of cross-striations, and early marginating neutrophils.",
      pathognomonicFinding: "Anucleate 'tombstone' ghost myocytes with preserved cellular borders and hypereosinophilic cytoplasm.",
      recommendedStain: "HE",
      clinicalPresentation: "Crushing retrosternal chest pain radiating to left arm with ST elevations in leads V1-V4 and elevated cardiac troponin I/T.",
      highYieldPearl: "Coagulative necrosis occurs in all solid organ ischemic infarctions except the brain."
    },
    {
      id: "liquefactive-brain",
      name: "2. Liquefactive Necrosis (Cerebral Infarction)",
      organ: "Brain",
      diagnosis: "Ischemic Cerebral Infarction / Stroke",
      etiology: "Middle cerebral artery thromboembolism; enzymatic digestion by microglial lysosomal enzymes.",
      lowPowerDescription: "Soft, cystic cavitation containing acellular fluid and necrotic liquefactive debris.",
      highPowerDescription: "Abundant lipid-laden foamy macrophages (gitter cells) clearing myelin debris, surrounded by reactive gemistocytic astrocytes (gliosis).",
      pathognomonicFinding: "Cystic cavitary space bordered by proliferating gemistocytic astrocytes and foamy gitter macrophages.",
      recommendedStain: "HE",
      clinicalPresentation: "Acute onset right-sided hemiplegia and motor (Broca) aphasia in a patient with atrial fibrillation.",
      highYieldPearl: "Brain ischemia uniquely undergoes liquefactive necrosis due to high lipid content and abundant hydrolytic enzymes."
    },
    {
      id: "caseous-tb",
      name: "3. Caseating Granuloma (Tuberculosis)",
      organ: "Lung / Lymph Node",
      diagnosis: "Pulmonary Tuberculosis (Mycobacterium tuberculosis)",
      etiology: "Type IV delayed-type hypersensitivity reaction to mycobacterial cord factor and antigens.",
      lowPowerDescription: "Nodular granuloma with central amorphous, cheese-like eosinophilic granular debris.",
      highPowerDescription: "Central acellular caseous necrosis enclosed by a palisade of epithelioid histiocytes, Langhans horseshoe-multinucleated giant cells, and peripheral CD4+ T-cell rim.",
      pathognomonicFinding: "Langhans multinucleated giant cells with peripheral horseshoe nuclei encircling amorphous caseous necrosis.",
      recommendedStain: "ZiehlNeelsen",
      clinicalPresentation: "Chronic cough, night sweats, hemoptysis, and cavitary lesion in the right upper lobe apex.",
      highYieldPearl: "Ziehl-Neelsen stain demonstrates bright red acid-fast bacilli within macrophages and caseous debris."
    },
    {
      id: "fat-necrosis-pancreatitis",
      name: "4. Enzymatic Fat Necrosis (Saponification)",
      organ: "Peripancreatic Adipose Tissue",
      diagnosis: "Acute Necrotizing Pancreatitis",
      etiology: "Premature intra-acinar activation of pancreatic lipase and colipase, digesting retroperitoneal fat.",
      lowPowerDescription: "Foci of shadowy, cloudy necrotic adipocytes surrounded by a basophilic calcium precipitate rim.",
      highPowerDescription: "Phantom necrotic fat cells with faint outlines, filled with amorphous basophilic calcium soaps (**Saponification**) and inflammatory neutrophils.",
      pathognomonicFinding: "Chalky-white gross deposits corresponding microscopically to basophilic calcium soaps in dead fat.",
      recommendedStain: "HE",
      clinicalPresentation: "Severe epigastric pain radiating directly to the back, nausea, vomiting, and elevated serum lipase (>3x upper limit).",
      highYieldPearl: "Extensive fat saponification consumes serum ionic calcium, producing hypocalcemia (a poor prognostic indicator in Ranson criteria)."
    }
  ],

  neoplasia: [
    {
      id: "breast-idc",
      name: "1. Invasive Ductal Carcinoma (Desmoplasia)",
      organ: "Breast",
      diagnosis: "Invasive Breast Adenocarcinoma (HER2+)",
      etiology: "Clonal expansion of malignant ductal epithelial cells invading through the basement membrane into the stroma.",
      lowPowerDescription: "Irregular, stellate, infiltrative nests and cords of atypical epithelial cells embedded in a dense, fibrotic stroma.",
      highPowerDescription: "Marked nuclear pleomorphism, hyperchromasia, prominent nucleoli, frequent atypical mitotic figures, and intense **desmoplastic (fibroblastic) stromal response**.",
      pathognomonicFinding: "Infiltrating cords and nests of pleomorphic neoplastic cells surrounded by dense collagenous desmoplasia.",
      recommendedStain: "HE",
      clinicalPresentation: "Hard, fixed, non-tender palpable mass in the upper outer quadrant with nipple retraction and skin dimpling (peau d'orange).",
      highYieldPearl: "E-cadherin expression is preserved in ductal carcinoma (forming nests/cords) but lost in lobular carcinoma (producing single-file 'Indian file' rows)."
    },
    {
      id: "burkitt-lymphoma",
      name: "2. Burkitt Lymphoma (Starry-Sky Pattern)",
      organ: "Lymph Node / Jaw",
      diagnosis: "Burkitt Lymphoma ($t(8;14)$ $c\\text{-}MYC$)",
      etiology: "Translocation $t(8;14)$ placing the $c-MYC$ oncogene under the high-expression immunoglobulin heavy chain enhancer.",
      lowPowerDescription: "Diffuse, monomorphic, sheet-like infiltrate of medium-sized mature B-lymphocytes with interspersed pale spaces (**Starry-Sky**).",
      highPowerDescription: "Monomorphic lymphoid cells with basophilic cytoplasm and lipid droplets, exceedingly high mitotic index (~100% Ki-67), and interspersed tingible body macrophages containing apoptotic debris.",
      pathognomonicFinding: "'Starry-sky' appearance produced by pale tingible-body macrophages ingestion of rapidly dying apoptotic tumor cells.",
      recommendedStain: "HE",
      clinicalPresentation: "Rapidly enlarging mandibular mass in an endemic African child (or ileocecal mass in sporadic cases).",
      highYieldPearl: "Burkitt lymphoma has one of the highest proliferative rates of any human malignancy with ~100% Ki-67 growth fraction."
    },
    {
      id: "colon-adenocarcinoma",
      name: "3. Colorectal Adenocarcinoma",
      organ: "Colon",
      diagnosis: "Moderately Differentiated Colonic Adenocarcinoma",
      etiology: "Chromosomal instability pathway (APC → KRAS → TP53) or microsatellite instability (MSH2/MLH1).",
      lowPowerDescription: "Infiltrative atypical glandular architecture penetrating through muscularis mucosae and muscularis propria.",
      highPowerDescription: "Crowded, back-to-back, cribriform malignant glands lined by pseudostratified columnar cells with 'dirty necrosis' (intraluminal necrotic debris).",
      pathognomonicFinding: "Gland-in-gland (cribriform) architectural complexity with luminal necrotic cellular debris ('dirty necrosis').",
      recommendedStain: "HE",
      clinicalPresentation: "Elderly patient presenting with unexplained iron-deficiency anemia, occult blood in stool, and altered bowel habits.",
      highYieldPearl: "Right-sided (ascending) colon cancers present as exophytic masses with occult bleeding and anemia; left-sided present as annular 'apple-core' constrictions."
    }
  ],

  hemodynamics: [
    {
      id: "lines-of-zahn",
      name: "1. Arterial Thrombus (Lines of Zahn)",
      organ: "Coronary / Femoral Artery",
      diagnosis: "Mural Thrombus with Lines of Zahn",
      etiology: "Atherosclerotic plaque rupture exposing thrombogenic subendothelial collagen under high shear flow.",
      lowPowerDescription: "Laminated intravascular mass with distinct alternating light and dark parallel bands.",
      highPowerDescription: "Pale eosinophilic laminations composed of aggregated platelets and fibrin network, alternating with dark red layers of trapped erythrocytes.",
      pathognomonicFinding: "Alternating pale platelet/fibrin and dark red erythrocyte bands (**Lines of Zahn**), proving formation in a flowing, living circulation.",
      recommendedStain: "HE",
      clinicalPresentation: "Acute arterial occlusion causing the '6 P's': Pain, Pallor, Pulselessness, Paresthesias, Poikilothermia, and Paralysis.",
      highYieldPearl: "Lines of Zahn are prominent in rapid-flow arterial thrombi and heart chambers, distinguishing true pre-mortem thrombi from post-mortem clots."
    },
    {
      id: "fat-embolism-slide",
      name: "2. Pulmonary Fat Microembolism",
      organ: "Lung",
      diagnosis: "Fat Embolism Syndrome",
      etiology: "Traumatic fracture of long bone (femur/tibia) releasing marrow fat into venous sinusoids.",
      lowPowerDescription: "Pulmonary alveolar capillaries distended with clear circular microvacuolar spaces.",
      highPowerDescription: "Intravascular clear lipid droplets within alveolar septal capillaries causing microvascular occlusion, intra-alveolar hemorrhage, and diffuse alveolar damage.",
      pathognomonicFinding: "Circular empty vacuoles within microvessels that stain bright orange-red on frozen sections with Oil Red O stain.",
      recommendedStain: "HE",
      clinicalPresentation: "Patient 48 hours post-femur fracture developing the triad of dyspnea/hypoxemia, confusion, and petechial axillary rash.",
      highYieldPearl: "Standard paraffin processing washes out lipid, leaving clear round vacuoles; frozen tissue stained with Oil Red O or Sudan Black confirms fat."
    }
  ],

  histopathology: [
    {
      id: "post-mi-stage",
      name: "1. Post-MI Chronological Evolution (Day 5)",
      organ: "Heart",
      diagnosis: "Subacute Myocardial Infarction (Day 4-7: Rupture Window)",
      etiology: "Extensive macrophage phagocytosis causing enzymatic lysis and structural weakening of the ventricular wall.",
      lowPowerDescription: "Soft, yellow-tan necrotic myocardial zone demarcated by a hyperemic border of early capillary buds.",
      highPowerDescription: "Dense sheet of foamy phagocytic macrophages and early fibroblasts engulfing disintegrating myocyte fragments; marked loss of tensile strength.",
      pathognomonicFinding: "Peak macrophage predominance with total myocyte breakdown, representing the maximal vulnerable window for myocardial free wall rupture.",
      recommendedStain: "Masson",
      clinicalPresentation: "Day 5 post-MI patient with sudden electromechanical dissociation, distant heart sounds, and cardiac tamponade from free wall blowout.",
      highYieldPearl: "Between days 4-7, myocardium has the highest risk of mechanical rupture (free wall, septum, or papillary muscle)."
    },
    {
      id: "amyloidosis-congo",
      name: "2. Renal Amyloidosis (Polarized Birefringence)",
      organ: "Kidney / Glomerulus",
      diagnosis: "Primary AL / Secondary AA Amyloidosis",
      etiology: "Extracellular deposition of insoluble fibrillar proteins in beta-pleated sheet conformation.",
      lowPowerDescription: "Glomeruli expanded by amorphous, acellular, glassy eosinophilic material in the mesangium and capillary loops.",
      highPowerDescription: "Obliteration of normal capillary architecture by homogeneous amyloid deposits, extending into arteriolar walls and tubular basement membranes.",
      pathognomonicFinding: "Congo Red stain shows salmon-pink coloration under standard light, transforming into pathognomonic **Apple-Green Birefringence** under Polarized Light.",
      recommendedStain: "CongoRed",
      hasPolarizedFeature: true,
      polarizedDescription: "Under cross-polarized light microscopy, the structured beta-pleated sheets produce brilliant emerald apple-green birefringence.",
      clinicalPresentation: "Patient with multiple myeloma or chronic rheumatoid arthritis presenting with heavy nephrotic-range proteinuria and enlarged kidneys.",
      highYieldPearl: "Congo Red with polarized apple-green birefringence is the definitive diagnostic gold standard for tissue amyloidosis."
    },
    {
      id: "crescentic-rpgn",
      name: "3. Crescentic Rapidly Progressive Glomerulonephritis",
      organ: "Kidney",
      diagnosis: "RPGN (Crescentic Glomerulonephritis)",
      etiology: "Severe glomerular capillary loop rupture releasing fibrin and plasma into Bowman's space.",
      lowPowerDescription: "Glomerular tufts compressed and encircled by large cellular crescents filling Bowman's capsule space.",
      highPowerDescription: "Proliferating parietal epithelial cells, infiltrating monocytes/macrophages, and dense strands of fibrin compressing the glomerular capillary tuft.",
      pathognomonicFinding: "Cellular/fibrocellular crescents filling $>50\\%$ of glomeruli on renal biopsy.",
      recommendedStain: "PAS",
      clinicalPresentation: "Patient with Goodpasture syndrome or ANCA vasculitis with rapid progression to anuria and renal failure over weeks.",
      highYieldPearl: "Crescents are composed of proliferating parietal epithelial cells and macrophages along with fibrin leakage."
    }
  ]
};

interface PathologySlideViewerProps {
  initialCollection?: SlideCollectionType;
  height?: string;
  onSlideSelect?: (slide: PathologySlide) => void;
}

export default function PathologySlideViewer({
  initialCollection = "cell-injury",
  height = "560px",
  onSlideSelect,
}: PathologySlideViewerProps) {
  const [activeCollection, setActiveCollection] = useState<SlideCollectionType>(initialCollection);
  const [objective, setObjective] = useState<MicroscopeObjective>("10x");
  const [activeStain, setActiveStain] = useState<HistologicalStain>("HE");
  const [isPolarized, setIsPolarized] = useState<boolean>(false);
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetSlideId, setQuizTargetSlideId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentSlides = useMemo(() => {
    return PATHOLOGY_SLIDES[activeCollection] || PATHOLOGY_SLIDES["cell-injury"];
  }, [activeCollection]);

  const activeSlide = useMemo(() => {
    return currentSlides.find((s) => s.id === activeSlideId) || currentSlides[0];
  }, [currentSlides, activeSlideId]);

  const handleSlideClick = (slide: PathologySlide) => {
    if (isQuizMode && quizTargetSlideId) {
      if (slide.id === quizTargetSlideId) {
        setQuizScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        setQuizFeedback(`Correct! You diagnosed ${slide.diagnosis}.`);
        setTimeout(() => nextQuizQuestion(), 1500);
      } else {
        setQuizScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
        setQuizFeedback(`Incorrect. Identify ${currentSlides.find((s) => s.id === quizTargetSlideId)?.name}.`);
      }
    } else {
      setActiveSlideId(slide.id);
      setActiveStain(slide.recommendedStain);
      setIsPolarized(false);
      if (onSlideSelect) {
        onSlideSelect(slide);
      }
    }
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    const randomSlide = currentSlides[Math.floor(Math.random() * currentSlides.length)];
    setQuizTargetSlideId(randomSlide.id);
    setQuizFeedback(null);
  };

  const nextQuizQuestion = () => {
    const randomSlide = currentSlides[Math.floor(Math.random() * currentSlides.length)];
    setQuizTargetSlideId(randomSlide.id);
    setQuizFeedback(null);
  };

  const toggleQuizMode = () => {
    if (!isQuizMode) {
      startQuiz();
    } else {
      setIsQuizMode(false);
      setQuizTargetSlideId(null);
      setQuizFeedback(null);
    }
  };

  const quizTargetSlide = useMemo(() => {
    return currentSlides.find((s) => s.id === quizTargetSlideId) || null;
  }, [currentSlides, quizTargetSlideId]);

  // Color simulation based on active stain & polarized light
  const getViewportBackground = () => {
    if (isPolarized && activeSlide.hasPolarizedFeature) {
      return "radial-gradient(circle at 50% 50%, #064e3b 0%, #022c22 40%, #000000 100%)";
    }
    switch (activeStain) {
      case "Masson":
        return "radial-gradient(circle at 50% 50%, #0369a1 0%, #0c4a6e 50%, #020617 100%)";
      case "CongoRed":
        return "radial-gradient(circle at 50% 50%, #e11d48 0%, #881337 50%, #020617 100%)";
      case "PAS":
        return "radial-gradient(circle at 50% 50%, #c026d3 0%, #701a75 50%, #020617 100%)";
      case "PrussianBlue":
        return "radial-gradient(circle at 50% 50%, #2563eb 0%, #1e3a8a 50%, #020617 100%)";
      case "ZiehlNeelsen":
        return "radial-gradient(circle at 50% 50%, #be123c 0%, #4c0519 50%, #020617 100%)";
      case "HE":
      default:
        return "radial-gradient(circle at 50% 50%, #831843 0%, #4c0519 40%, #0f172a 100%)";
    }
  };

  return (
    <div
      className={styles.container}
      style={{ height: isFullscreen ? "100vh" : "auto" }}
    >
      {/* Top Header Controls */}
      <div className={styles.headerBar}>
        <div className={styles.titleArea}>
          <span className={styles.modeBadge}>
            <Sparkles size={14} /> PATH-201
          </span>
          <span className={styles.titleText}>
            {activeCollection === "cell-injury" && "Cellular Injury, Adaptations & Necrosis"}
            {activeCollection === "neoplasia" && "Neoplasia, Carcinogenesis & Oncogenes"}
            {activeCollection === "hemodynamics" && "Hemodynamics, Virchow Triad & Thrombosis"}
            {activeCollection === "histopathology" && "Organ Histopathology & MI Chronology"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Histopathology Quiz"}
          </button>

          {activeSlide.hasPolarizedFeature && (
            <button
              className={`${styles.btn} ${isPolarized ? styles.btnPolarizedActive : ""}`}
              onClick={() => setIsPolarized(!isPolarized)}
              title="Toggle Polarized Light Microscopy"
            >
              <Sun size={15} /> {isPolarized ? "Polarized Light: ON (Apple-Green)" : "Polarized Light: OFF"}
            </button>
          )}

          <button
            className={styles.btn}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main Interactive Microscope Workspace */}
      <div className={styles.mainLayout}>
        {/* Left Side: Virtual Microscope & Slide Grid */}
        <div className={styles.microscopeCanvas}>
          {/* Turret Bar: Objectives & Stains */}
          <div className={styles.turretBar}>
            <div className={styles.turretGroup}>
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Search size={12} /> Objective:
              </span>
              {(["4x", "10x", "40x", "100x"] as MicroscopeObjective[]).map((mag) => (
                <button
                  key={mag}
                  onClick={() => setObjective(mag)}
                  className={`${styles.turretLens} ${objective === mag ? styles.turretLensActive : ""}`}
                >
                  {mag} {mag === "100x" ? "(Oil)" : ""}
                </button>
              ))}
            </div>

            <div className={styles.turretGroup}>
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Eye size={12} /> Stain:
              </span>
              <div className={styles.stainSelector}>
                {(["HE", "Masson", "CongoRed", "PAS", "PrussianBlue", "ZiehlNeelsen"] as HistologicalStain[]).map((stain) => (
                  <button
                    key={stain}
                    onClick={() => {
                      setActiveStain(stain);
                      if (stain !== "CongoRed") setIsPolarized(false);
                    }}
                    className={`${styles.stainTab} ${activeStain === stain ? styles.stainTabActive : ""}`}
                  >
                    {stain}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quiz Prompt Banner */}
          {isQuizMode && quizTargetSlide && (
            <div className={styles.quizBanner}>
              <div>
                <div className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                  Histopathology Case Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify the Slide / Pathology: {quizTargetSlide.clinicalPresentation}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-emerald-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-slate-800 text-xs rounded border border-slate-700 text-slate-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Simulated Optical Microscope Viewport */}
          <div
            className={styles.microscopeViewport}
            style={{
              background: getViewportBackground(),
              borderColor: isPolarized ? "#10b981" : "rgba(255, 255, 255, 0.2)",
            }}
          >
            <div className="absolute top-2 left-3 text-[11px] font-mono text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
              MAG: {objective} • STAIN: {activeStain} {isPolarized ? "• POLARIZED: APPLE-GREEN" : ""}
            </div>

            <div className="max-w-md bg-black/70 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
              <div className="text-sm font-bold text-white mb-1">{activeSlide.diagnosis}</div>
              <div className="text-xs text-slate-300 leading-relaxed">
                {objective === "4x" || objective === "10x"
                  ? activeSlide.lowPowerDescription
                  : activeSlide.highPowerDescription}
              </div>
              {isPolarized && activeSlide.hasPolarizedFeature && (
                <div className="text-xs text-emerald-300 font-bold mt-2 flex items-center justify-center gap-1">
                  <Sparkles size={14} /> {activeSlide.polarizedDescription}
                </div>
              )}
            </div>
          </div>

          {/* Slide Selection Grid */}
          <div className={styles.slideGrid}>
            {currentSlides.map((slide) => {
              const isSelected = activeSlide.id === slide.id;

              return (
                <div
                  key={slide.id}
                  onClick={() => handleSlideClick(slide)}
                  className={`${styles.slideCard} ${isSelected ? styles.slideCardSelected : ""}`}
                >
                  <div className={styles.slideHeader}>
                    <span className={styles.organBadge}>{slide.organ}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Stain: {slide.recommendedStain}</span>
                  </div>

                  <div>
                    <div className={styles.slideTitle}>{slide.name}</div>
                    <div className={styles.slideDiagnosis}>{slide.diagnosis}</div>
                  </div>

                  <div className="text-[11px] text-slate-300 font-medium bg-slate-950/60 p-2 rounded border border-slate-800">
                    <span className="text-amber-400 font-bold">Hallmark:</span> {slide.pathognomonicFinding}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Click to inspect under lens</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical & Histopathological Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Histopathological Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              {activeSlide.organ}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Definitive Diagnosis</div>
            <div className="text-xs font-bold text-white">{activeSlide.diagnosis}</div>
            <div className={styles.inspectorBody}>{activeSlide.etiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Microscopic Architecture</div>
            <div className="text-xs text-slate-300">
              <strong>Low-Power (4x/10x):</strong> {activeSlide.lowPowerDescription}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              <strong>High-Power (40x/100x):</strong> {activeSlide.highPowerDescription}
            </div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⭐ Pathognomonic Finding</div>
            <div className="text-xs font-bold text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-800/40">
              {activeSlide.pathognomonicFinding}
            </div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🏥 Clinical Vignette Correlation</div>
            <div className={styles.inspectorBody}>{activeSlide.clinicalPresentation}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 USMLE / NMC High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeSlide.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Collection Switcher Tabs */}
      <div className={styles.collectionTabsGrid}>
        <button
          onClick={() => setActiveCollection("cell-injury")}
          className={`${styles.collectionTab} ${activeCollection === "cell-injury" ? styles.collectionTabActive : ""}`}
        >
          🩸 1. Cell Injury & Necrosis
        </button>
        <button
          onClick={() => setActiveCollection("neoplasia")}
          className={`${styles.collectionTab} ${activeCollection === "neoplasia" ? styles.collectionTabActive : ""}`}
        >
          🦀 2. Neoplasia & Carcinoma
        </button>
        <button
          onClick={() => setActiveCollection("hemodynamics")}
          className={`${styles.collectionTab} ${activeCollection === "hemodynamics" ? styles.collectionTabActive : ""}`}
        >
          🫀 3. Hemodynamics & Thrombi
        </button>
        <button
          onClick={() => setActiveCollection("histopathology")}
          className={`${styles.collectionTab} ${activeCollection === "histopathology" ? styles.collectionTabActive : ""}`}
        >
          🔬 4. Systemic & MI Chronology
        </button>
      </div>
    </div>
  );
}
