"use client";

import React, { useState, useMemo } from "react";
import styles from "./ForensicLabViewer.module.css";
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
  Scale,
  Clock,
  Skull,
  Crosshair,
  TrendingDown,
} from "lucide-react";

export type ForensicLabMode = "thanatology" | "traumatology" | "toxicology" | "jurisprudence";

export interface ForensicLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  pathologyOrMechanism: string;
  medicolegalSignificance: string;
  autopsyFindingOrSigns: string;
  highYieldPearl: string;
}

export const FORENSIC_NODES: Record<ForensicLabMode, ForensicLabNode[]> = {
  thanatology: [
    {
      id: "rigor-mortis",
      name: "1. Rigor Mortis & Nysten's Law",
      category: "Post-Mortem Stiffening",
      subType: "ATP Depletion • Actin-Myosin Crosslink Rigidity",
      pathologyOrMechanism: "Cellular ATP depletion prevents detachment of myosin heads from actin filaments, locking muscle fibers in permanent contraction.",
      medicolegalSignificance: "Establishes Post-Mortem Interval (PMI); Rule of 12s (12h to develop, 12h present, 12h to disappear in temperate climates).",
      autopsyFindingOrSigns: "Nysten's Law: spreads from small to large muscles (Jaw/eyelids 1-2h -> Upper limbs 4-6h -> Lower limbs 8-12h). Differentiate from Cadaveric Spasm.",
      highYieldPearl: "Cadaveric spasm is instantaneous stiffening at the moment of death without a preceding flaccid phase, proving the last physical act (e.g. grasping a weapon)."
    },
    {
      id: "livor-mortis",
      name: "2. Livor Mortis (Hypostasis) & Color Variants",
      category: "Gravitational Capillary Settling",
      subType: "Fixed vs Blanchable Lividity",
      pathologyOrMechanism: "Gravitational pooling of deoxygenated blood in dependent capillaries. Fixed (non-blanchable) after 6-8 hours due to hemolysis.",
      medicolegalSignificance: "Determines position of the body and indicates whether the body was moved after death; reveals specific poisons by color.",
      autopsyFindingOrSigns: "Cherry-red in Carbon Monoxide; Bright pink in Cyanide/Hypothermia; Chocolate brown in Methemoglobinemia; Purple-blue in Asphyxia.",
      highYieldPearl: "Incision through livor mortis washes clean with water; incision into a contusion/bruise reveals clotted extravasated blood in tissue."
    },
    {
      id: "decomposition-adipocere",
      name: "3. Decomposition, Marbling & Adipocere",
      category: "Late Post-Mortem Changes",
      subType: "Putrefaction • Saponification vs Mummification",
      pathologyOrMechanism: "Putrefaction driven by Clostridium welchii forming sulfhemoglobin (green RIF at 24-36h; marbling at 36-48h). Casper's Dictum (1 air = 2 water = 8 earth).",
      medicolegalSignificance: "Adipocere occurs in warm moist anaerobic environments; preserves facial features and stab wound morphology for years.",
      autopsyFindingOrSigns: "Greenish discoloration in Right Iliac Fossa; cutaneous marbling arborization; Adipocere waxy yellow-white fatty acid conversion.",
      highYieldPearl: "Casper's dictum states that a body decomposes at the same rate in 1 week of air as 2 weeks of water and 8 weeks of underground burial (1:2:8)."
    }
  ],

  traumatology: [
    {
      id: "incised-vs-lacerated",
      name: "1. Incised Wound vs Laceration",
      category: "Mechanical Traumatology",
      subType: "Sharp Force vs Blunt Mechanical Trauma",
      pathologyOrMechanism: "Incised: sharp edge divides tissue cleanly with no tissue bridges. Laceration: blunt crushing tears skin, preserving fibrous tissue bridges.",
      medicolegalSignificance: "Differentiates assault weapon (knife vs blunt heavy pipe/rod) and directionality (tailing at exit of incised cut).",
      autopsyFindingOrSigns: "Incised: clean-cut sharp margins, hair cleanly divided. Laceration: ragged abraded contused margins, intact nerve/vessel tissue bridges, crushed hair bulbs.",
      highYieldPearl: "The single most reliable hallmark distinguishing a laceration from an incised wound is the presence of intact tissue bridges across the wound bed."
    },
    {
      id: "firearm-contact-distant",
      name: "2. Firearm Wounds: Contact vs Distant",
      category: "Forensic Ballistics",
      subType: "Muzzle Contact • Tattooing • Abrasion Collar",
      pathologyOrMechanism: "Contact: expanding propellant gases between scalp and bone produce star-shaped stellate laceration. Close (<60cm): unburnt powder tattooing.",
      medicolegalSignificance: "Establishes firing distance, trajectory, and rules out suicide if distant entry wound is present.",
      autopsyFindingOrSigns: "Contact: stellate laceration with muzzle stamp; Close: singeing + blackening + permanent tattooing; Distant: round entry hole with abrasion & grease collar.",
      highYieldPearl: "Gunpowder tattooing consists of unburnt powder grains driven into the dermis that CANNOT be washed away, proving close-range discharge."
    },
    {
      id: "hanging-vs-strangulation",
      name: "3. Hanging vs Ligature Strangulation",
      category: "Asphyxial Deaths",
      subType: "Ante-Mortem Suspension vs Homicidal Strangulation",
      pathologyOrMechanism: "Hanging: body weight constricts neck (oblique, high, non-continuous inverted-V). Strangulation: external force (horizontal, low, continuous circular).",
      medicolegalSignificance: "Differentiates suicidal suspension from homicidal ligature strangulation.",
      autopsyFindingOrSigns: "Hanging: pale dry parchment-like mark above thyroid cartilage, pale face. Strangulation: horizontal continuous mark, intense cyanosis, facial petechiae.",
      highYieldPearl: "Throttling (manual strangulation) frequently fractures the greater cornu of the hyoid bone, whereas suicidal hanging rarely fractures the hyoid in youth."
    }
  ],

  toxicology: [
    {
      id: "cyanide-poisoning",
      name: "1. Cyanide (HCN / Potassium Cyanide)",
      category: "Histotoxic Asphyxiant",
      subType: "Cytochrome c Oxidase Inhibition",
      pathologyOrMechanism: "Inhibits mitochondrial Cytochrome c Oxidase (complex IV), halting ATP synthesis and causing cellular histotoxic anoxia.",
      medicolegalSignificance: "Rapid homicidal/suicidal poison; electroplating/jewelry industry exposures.",
      autopsyFindingOrSigns: "Bitter almond scent on opening body cavities; bright pink/red post-mortem lividity; bright red venous blood with profound lactic acidosis.",
      highYieldPearl: "First-line antidote is Hydroxocobalamin (forms non-toxic cyanocobalamin/B12) or Amyl/Sodium Nitrite + Sodium Thiosulfate."
    },
    {
      id: "carbon-monoxide",
      name: "2. Carbon Monoxide (CO)",
      category: "Chemical Asphyxiant",
      subType: "Carboxyhemoglobin (200-250x Affinity for Hb)",
      pathologyOrMechanism: "Binds Hemoglobin with 200-250x higher affinity than oxygen, forming Carboxyhemoglobin and shifting oxy-Hb curve to the left.",
      medicolegalSignificance: "Smoke inhalation, closed-room coal fires, faulty geysers, motor exhaust suicides.",
      autopsyFindingOrSigns: "Cherry-red post-mortem lividity and musculature; bilateral symmetrical necrosis of the Globus Pallidus in basal ganglia.",
      highYieldPearl: "Administer 100% High-Flow Oxygen or Hyperbaric Oxygen (HBO), reducing the elimination half-life of carboxyhemoglobin from 300 to 30 minutes."
    },
    {
      id: "arsenic-poisoning",
      name: "3. Arsenic (Arsenic Trioxide / As2O3)",
      category: "Heavy Metal Poison",
      subType: "Lipoic Acid & Pyruvate Dehydrogenase Inhibition",
      pathologyOrMechanism: "Inhibits lipoic acid, disrupting pyruvate dehydrogenase and cellular respiration; mimics cholera in acute overdose.",
      medicolegalSignificance: "Classic historical homicidal poison ('inheritance powder'); chronic groundwater contamination.",
      autopsyFindingOrSigns: "Acute: rice-water diarrhea, garlic breath. Chronic: Raindrop hyperpigmentation, Aldrich-Mees white transverse nail lines, hyperkeratosis of palms/soles.",
      highYieldPearl: "Arsenic is detected in hair, nails, and bones decades after burial due to strong affinity for keratin sulfhydryl groups."
    },
    {
      id: "aluminum-phosphide",
      name: "4. Aluminum Phosphide (Celphos)",
      category: "Agricultural Grain Preservative",
      subType: "Phosphine Gas (PH3) Release",
      pathologyOrMechanism: "Releases lethal phosphine gas on contact with stomach acid/moisture -> inhibits cytochrome oxidase -> fatal refractory cardiogenic shock.",
      medicolegalSignificance: "Most common suicidal poison in agricultural northern India.",
      autopsyFindingOrSigns: "Pungent garlic / decaying fish odor; Silver nitrate paper test over gastric contents turns dark black.",
      highYieldPearl: "No specific antidote exists for Celphos; management is supportive with gastric lavage (potassium permanganate/coconut oil) and ICU care."
    }
  ],

  jurisprudence: [
    {
      id: "inquests-crpc",
      name: "1. Legal Inquests: Section 174 vs 176 CrPC",
      category: "Medical Jurisprudence",
      subType: "Police Inquest vs Magistrate Inquest",
      pathologyOrMechanism: "Police Inquest (174 CrPC) conducts routine unnatural death investigations. Magistrate Inquest (176 CrPC) is legally mandatory in 4 high-stakes cases.",
      medicolegalSignificance: "Magistrate Inquest mandatory for: 1. Custodial deaths, 2. Police firing, 3. Dowry death of a woman within 7 years of marriage (304B IPC), 4. Exhumation.",
      autopsyFindingOrSigns: "Failure to follow Section 176 CrPC renders subsequent legal proceedings defective.",
      highYieldPearl: "All unnatural deaths of married women within 7 years of marriage require a Magistrate Inquest (Section 176 CrPC) by law."
    },
    {
      id: "autopsy-viscera",
      name: "2. Autopsy Dissections & Viscera Preservation",
      category: "Forensic Pathology Protocol",
      subType: "Virchow / Letulle Techniques • Saturated NaCl Preservation",
      pathologyOrMechanism: "Virchow: organ by organ. Letulle: en masse. Ghon: en bloc. Saturated NaCl is the preservative of choice for toxicology viscera.",
      medicolegalSignificance: "Preserves chemical toxins for forensic laboratory analysis without chemical degradation.",
      autopsyFindingOrSigns: "Never use Formalin for toxicological viscera because it destroys alkaloids and volatile poisons.",
      highYieldPearl: "Saturated Sodium Chloride is the gold-standard forensic preservative for viscera; Formalin is strictly contraindicated in toxicology."
    }
  ]
};

interface ForensicLabViewerProps {
  initialMode?: ForensicLabMode;
  height?: string;
  onNodeSelect?: (node: ForensicLabNode) => void;
}

export default function ForensicLabViewer({
  initialMode = "thanatology",
  height = "560px",
  onNodeSelect,
}: ForensicLabViewerProps) {
  const [activeMode, setActiveMode] = useState<ForensicLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Thanatology Interactive PMI Sliders State
  const [rectalTempC, setRectalTempC] = useState<number>(31.0); // C
  const [ambientTempC, setAmbientTempC] = useState<number>(22.0); // C
  const [rigorState, setRigorState] = useState<number>(2); // 0=None, 1=Jaw/Neck, 2=Full, 3=Passing Off
  const [lividityFixed, setLividityFixed] = useState<boolean>(true);
  const [marblingPresent, setMarblingPresent] = useState<boolean>(false);

  // Estimated PMI Calculation (Henssge rule of thumb + staging)
  const estimatedPmiHours = useMemo(() => {
    // Normal body temp = 37.0 C
    const tempDrop = Math.max(0, 37.0 - rectalTempC);
    // Rate of cooling ~ 0.75 C per hour in temperate room
    const pmiFromCooling = tempDrop / 0.75;

    let baselinePmi = pmiFromCooling;
    if (rigorState === 2 && lividityFixed) {
      baselinePmi = Math.max(12, Math.min(24, (pmiFromCooling + 16) / 2));
    }
    if (marblingPresent) {
      baselinePmi = Math.max(36, baselinePmi + 24);
    }
    return baselinePmi;
  }, [rectalTempC, rigorState, lividityFixed, marblingPresent]);

  const pmiRange = useMemo(() => {
    const low = Math.max(1, Math.round(estimatedPmiHours * 0.8));
    const high = Math.round(estimatedPmiHours * 1.2);
    return `${low} – ${high} hours`;
  }, [estimatedPmiHours]);

  const currentNodes = useMemo(() => {
    return FORENSIC_NODES[activeMode] || FORENSIC_NODES.thanatology;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: ForensicLabNode) => {
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
            <Scale size={14} /> FOR-201
          </span>
          <span className={styles.titleText}>
            {activeMode === "thanatology" && "Thanatology & Post-Mortem Interval (PMI) Calculator"}
            {activeMode === "traumatology" && "Traumatology, Mechanical Wounds & Firearms"}
            {activeMode === "toxicology" && "Forensic Toxicology & Poison Diagnostic Matrix"}
            {activeMode === "jurisprudence" && "Medical Jurisprudence, Inquests & Autopsy"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Forensic Quiz"}
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
                <div className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                  Medicolegal Autopsy Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Case / Entity: {quizTargetNode.medicolegalSignificance}
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

          {/* Thanatology Interactive PMI Calculator Sliders */}
          {activeMode === "thanatology" && (
            <div className={styles.pmiSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} /> Interactive Post-Mortem Interval (PMI) Calculator
                </span>
                <span className="text-[11px] text-slate-400">Algor, Rigor & Livor Mortis Staging</span>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Rectal Temp:</span> <strong className="text-pink-400">{rectalTempC.toFixed(1)} °C</strong>
                  </div>
                  <input
                    type="range"
                    min="20.0"
                    max="37.0"
                    step="0.5"
                    value={rectalTempC}
                    onChange={(e) => setRectalTempC(parseFloat(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Ambient Temp:</span> <strong className="text-pink-400">{ambientTempC.toFixed(1)} °C</strong>
                  </div>
                  <input
                    type="range"
                    min="10.0"
                    max="40.0"
                    step="1.0"
                    value={ambientTempC}
                    onChange={(e) => setAmbientTempC(parseFloat(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Rigor Mortis:</span>{" "}
                    <strong className="text-pink-400">
                      {rigorState === 0 && "Absent"}
                      {rigorState === 1 && "Jaw/Neck (1-4h)"}
                      {rigorState === 2 && "Full Body (12-24h)"}
                      {rigorState === 3 && "Passing Off (>24h)"}
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={rigorState}
                    onChange={(e) => setRigorState(parseInt(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>

              {/* Real-time PMI Outputs */}
              <div className={styles.pmiResultsGrid}>
                <div className={styles.pmiResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Estimated PMI</div>
                  <div className={styles.pmiResultVal}>{estimatedPmiHours.toFixed(1)} hrs</div>
                </div>
                <div className={styles.pmiResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Confidence Range</div>
                  <div className={styles.pmiResultVal}>{pmiRange}</div>
                </div>
                <div className={styles.pmiResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Livor Mortis</div>
                  <div className="text-sm font-bold text-pink-300 mt-1">
                    {lividityFixed ? "Fixed (Non-Blanchable)" : "Blanchable (<6h)"}
                  </div>
                </div>
                <div className={styles.pmiResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Putrefaction</div>
                  <div className="text-sm font-bold text-pink-300 mt-1">
                    {marblingPresent ? "Marbling / Bloating (>36h)" : "Early / No Marbling"}
                  </div>
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
                    <span className="text-pink-400 font-bold">Hallmark:</span> {node.pathologyOrMechanism}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect medicolegal autopsy findings</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Forensic Autopsy Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Autopsy Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Identity & Subtype</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Mechanism / Pathology</div>
            <div className={styles.inspectorBody}>{activeNode.pathologyOrMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚖️ Medicolegal Significance</div>
            <div className={styles.inspectorBody}>{activeNode.medicolegalSignificance}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Autopsy Findings & Signs</div>
            <div className={styles.inspectorBody}>{activeNode.autopsyFindingOrSigns}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 High-Yield Forensic Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("thanatology")}
          className={`${styles.modeTab} ${activeMode === "thanatology" ? styles.modeTabActive : ""}`}
        >
          ⏱️ 1. Thanatology & PMI
        </button>
        <button
          onClick={() => setActiveMode("traumatology")}
          className={`${styles.modeTab} ${activeMode === "traumatology" ? styles.modeTabActive : ""}`}
        >
          🔪 2. Traumatology & Wounds
        </button>
        <button
          onClick={() => setActiveMode("toxicology")}
          className={`${styles.modeTab} ${activeMode === "toxicology" ? styles.modeTabActive : ""}`}
        >
          ☠️ 3. Forensic Toxicology
        </button>
        <button
          onClick={() => setActiveMode("jurisprudence")}
          className={`${styles.modeTab} ${activeMode === "jurisprudence" ? styles.modeTabActive : ""}`}
        >
          ⚖️ 4. Jurisprudence & Autopsy
        </button>
      </div>
    </div>
  );
}
