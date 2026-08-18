"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalForensicLabViewer.module.css";
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
  Flame,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
} from "lucide-react";

export type ForensicLabMode = "thanatology" | "ballistics" | "asphyxia" | "toxicology";

export interface ForensicLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  forensicProfile: string;
  pathologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const FORENSIC_LAB_NODES: Record<ForensicLabMode, ForensicLabNode[]> = {
  thanatology: [
    {
      id: "for-than-algor-cooling",
      name: "Algor Mortis Cooling Dynamics (Henssge Nomogram & Core Temp)",
      category: "Postmortem Interval",
      subType: "Cooling Rate ~1.5°F (0.8°C) per Hour • Henssge Nomogram Rectal Temp • Body Weight & Ambient Factors",
      forensicProfile: "Progressive physical equilibration of body temperature with the surrounding ambient environment.",
      pathologyMechanism: "Newtonian radiative, convective, and conductive heat loss following cessation of metabolic thermogenesis.",
      clinicalHallmarks: "Linear rate of cooling in temperate climates; Henssge nomogram calculates 95% confidence interval for PMI.",
      highYieldPearls: "Algor mortis cools at ~1.5°F/hour in temperate conditions; Henssge nomogram is the gold-standard estimation tool."
    },
    {
      id: "for-than-rigor-mortis",
      name: "Rigor Mortis Myofibrillar Rigidity (ATP Depletion & Nysten Law)",
      category: "Early Thanatology",
      subType: "1-2h Heart -> 2-4h Jaw -> 12h Complete Rigidity -> Maintained 12-24h -> Passes 36-48h (Autolysis)",
      forensicProfile: "Physicochemical stiffening of skeletal and involuntary muscles without cellular shortening.",
      pathologyMechanism: "Postmortem ATP depletion prevents dissociation of actin-myosin cross-bridges, locking myofibrils in contraction.",
      clinicalHallmarks: "Follows Nysten's law (jaw -> neck -> upper limbs -> trunk -> lower limbs); broken rigidity does NOT return.",
      highYieldPearls: "Rigor mortis is caused by cellular ATP depletion; it appears in the jaw in 2-4h, is fully fixed at 12h, and passes off by 36-48h."
    },
    {
      id: "for-than-livor-mortis",
      name: "Livor Mortis Hypostasis & Fixation (Capillary Pooling & Signatures)",
      category: "Early Thanatology",
      subType: "Onset 30-60 min • Fully Fixed 8-12h • Cherry-Red (CO/Cyanide) • Chocolate-Brown (Methemoglobin)",
      forensicProfile: "Gravitational pooling of deoxygenated blood in dependent, uncompressed post-capillary venules and dermal plexuses.",
      pathologyMechanism: "Loss of hydrostatic propulsion allows erythrocytes to settle; completely fixed at 8-12h due to hemoconcentration and hemolysis.",
      clinicalHallmarks: "Pressure blanching indicates PMI <8-12h; cherry-red lividity in CO (COHb) and cyanide (histotoxic hypoxia); chocolate in Met-Hb.",
      highYieldPearls: "Livor mortis fixes at 8-12 hours (cannot be shifted by body repositioning); cherry-red color indicates CO or Cyanide."
    },
    {
      id: "for-than-putrefaction-casper",
      name: "Putrefactive Decomposition & Marbling (Sulfhemoglobin & Casper Ratio)",
      category: "Late Thanatology",
      subType: "24-36h RIF Green Discoloration • 36-48h Marbling • Casper's Dictum (1 week Air = 2 weeks Water = 8 weeks Soil)",
      forensicProfile: "Microbial liquefaction and autolysis of soft tissues driven by endogenous enteric bacteria.",
      pathologyMechanism: "Cecal Clostridium welchii converts hemoglobin to sulfhemoglobin (green RIF); bacterial gas creates venous marbling.",
      clinicalHallmarks: "Greenish RIF discoloration (24-36h), venous marbling (36-48h), bloat/purging (48-72h); Casper's dictum (1:2:8 air/water/soil).",
      highYieldPearls: "Green discoloration of the right iliac fossa (24-36h) is the earliest visible external sign of putrefaction."
    }
  ],

  ballistics: [
    {
      id: "for-bal-contact-stellate",
      name: "Hard Contact Cranial Stellate Wounds (Subgaleal Gas Expansion)",
      category: "Contact Ballistics",
      subType: "Muzzle Against Skin Over Bone • Stellate / Cruciform Tearing • Muzzle Impression / Stamp • Cherry-Red Tract",
      forensicProfile: "Direct physical contact between firearm muzzle and cutaneous surface overlying flat cranial bone.",
      pathologyMechanism: "High-pressure propellant gases enter the subgaleal space, rebound off the calvarium, and violently tear the scalp outward.",
      clinicalHallmarks: "Cruciform/stellate tears, internal beveling of entrance skull defect, muzzle stamp abrasion, carboxyhemoglobin track.",
      highYieldPearls: "Hard contact gunshot wounds over the skull produce characteristic stellate/cruciform tearing due to expanding gas rebound."
    },
    {
      id: "for-bal-close-flame-soot",
      name: "Close Range Flame Burns & Soot (Thermal Singeing & Washable Smudging)",
      category: "Close Ballistics",
      subType: "Muzzle Within Inches • Thermal Flame Singeing / Charring • Carbonaceous Soot / Fouling (EASILY WASHED OFF)",
      forensicProfile: "Muzzle positioned within a few inches of target, exposing tissue to burning propellant gases and carbon soot.",
      pathologyMechanism: "Thermal energy burns skin and singes hairs; dense cloud of vaporized carbon deposits as superficial fouling.",
      clinicalHallmarks: "Muzzle flame burn around entrance hole; dense black soot halo on skin or clothing that wipes away with wet saline gauze.",
      highYieldPearls: "Soot (fouling) is superficial and easily washed off; its presence signifies close-range fire (within inches)."
    },
    {
      id: "for-bal-intermediate-stippling",
      name: "Intermediate Range Gunpowder Tattooing (Dermal Stippling Abrasions)",
      category: "Intermediate Ballistics",
      subType: "Range 1-3 Feet • Unburnt Powder Grains Embedded in Viable Dermis • CANNOT BE WASHED OFF • Abrasion Ring",
      forensicProfile: "Muzzle positioned 1 to 3 feet from target; propellant particles travel independently of muzzle flame.",
      pathologyMechanism: "Unburnt and partially burnt gunpowder grains strike the skin at high velocity, causing punctate intra-dermal abrasive tattoos.",
      clinicalHallmarks: "Dispersed pinpoint reddish-brown punctate lesions around central entrance hole; resistant to vigorous surgical scrubbing.",
      highYieldPearls: "Gunpowder tattooing (stippling) represents embedded propellant grains that cannot be washed off; proves intermediate range (1-3 ft)."
    },
    {
      id: "for-bal-distant-abrasion-collar",
      name: "Distant Range Bullet Abrasion Collar (Friction Rim & Bullet Wipe)",
      category: "Distant Ballistics",
      subType: "Range >3 Feet • Absence of Flame, Soot, or Stippling • Concentric Abrasion Collar (Friction Ring) + Grease Collar",
      forensicProfile: "Muzzle-to-target distance exceeds the travel range of hot gases, carbon soot, and powder particles.",
      pathologyMechanism: "Bullet tip indents, stretches, and scrapes the epidermis before perforating, leaving a concentric marginal abrasion ring.",
      clinicalHallmarks: "Clean circular or oval defect with an abrasion collar and grease/dirt wipe; total absence of thermal or powder residue.",
      highYieldPearls: "Distant gunshot wounds exhibit only a central defect with an abrasion collar and grease collar, lacking any soot or stippling."
    }
  ],

  asphyxia: [
    {
      id: "for-asph-hanging-suspension",
      name: "Suicidal Hanging Suspension Traumatology (Oblique Mark & Salivary Dribble)",
      category: "Hanging Asphyxia",
      subType: "Oblique, Non-Continuous Mark • Above Thyroid Cartilage • Highest at Suspension Apex (Knot) • Salivary Dribble",
      forensicProfile: "Gravitational constriction of the neck by a ligature energized by the victim's own body weight.",
      pathologyMechanism: "Carotid artery (5 kg) and jugular vein (2 kg) occlusion; suspension gap at knot; parchment-like grooved base with hyperemic margins.",
      clinicalHallmarks: "Oblique inverted-V ligature mark above thyroid cartilage, salivary dribble on side opposite knot (ANTE-MORTEM proof); pale face.",
      highYieldPearls: "Salivary dribbling opposite the suspension knot is pathognomonic evidence of ante-mortem suspension hanging."
    },
    {
      id: "for-asph-ligature-strangulation",
      name: "Homicidal Ligature Strangulation (Horizontal Continuous Mark & Tardieu)",
      category: "Strangulation Asphyxia",
      subType: "Horizontal, Continuous, Transverse Mark • At / Below Thyroid Cartilage • Florid Facial Cyanosis & Tardieu Petechiae",
      forensicProfile: "Constriction of the neck by an external ligature tightened by an outside human force.",
      pathologyMechanism: "Complete circumferential venous compression with continued arterial supply produces extreme cephalic venous hypertension.",
      clinicalHallmarks: "Horizontal continuous groove below thyroid cartilage, deep cyanosis, facial puffiness, profuse subconjunctival Tardieu petechiae.",
      highYieldPearls: "Ligature strangulation features a horizontal, continuous mark encircling the neck, marked cyanosis, and Tardieu petechiae."
    },
    {
      id: "for-asph-throttling-hyoid",
      name: "Manual Strangulation & Hyoid Fractures (Crescentic Fingernail Scratches)",
      category: "Manual Asphyxia",
      subType: "Crescentic Fingernail Abrasions & Fingertip Bruises • High Incidence of Hyoid Bone Greater Horn Fractures (60-70%)",
      forensicProfile: "Direct compression of the neck by human hands, fingers, or palms (throttling).",
      pathologyMechanism: "Direct digital force crushes laryngeal cartilage, compresses carotid vessels, and fractures greater horns of hyoid bone.",
      clinicalHallmarks: "Crescentic fingernail abrasions, deep strap muscle hematomas, hyoid greater horn fractures (inward displacement); homicide.",
      highYieldPearls: "Manual strangulation (throttling) has the highest incidence of hyoid bone and thyroid cartilage fractures (60-70%)."
    },
    {
      id: "for-asph-drowning-diatoms",
      name: "Aquatic Drowning Pathophysiology (Mushroom of Foam & Marrow Diatoms)",
      category: "Submersion Asphyxia",
      subType: "Persistent 'Mushroom of Foam' Froth at Mouth/Nose • Paltauf's Hemorrhages • Diatom Test in Closed Femur Bone Marrow",
      forensicProfile: "Submersion in liquid resulting in fatal aspiration, alveolar flooding, and asphyxial hypoxemia.",
      pathologyMechanism: "Inhaled water agitates alveolar surfactant and mucus into tenacious foam; diatoms enter pulmonary circulation and reach bone marrow.",
      clinicalHallmarks: "Fine, white, leathery foam at nostrils (increases on wiping), heavy waterlogged lungs (emphysema aquosum), marrow diatoms.",
      highYieldPearls: "Detection of aquatic diatoms in closed femoral bone marrow is gold-standard proof of ante-mortem drowning."
    }
  ],

  toxicology: [
    {
      id: "for-tox-carbon-monoxide",
      name: "Carbon Monoxide Poisoning Autopsy Signs (Cherry-Red Lividity & Globus Pallidus)",
      category: "Asphyxiant Gas",
      subType: "Affinity for Hb >200x • Left-Shift Oxy-Hb Curve • Bright Cherry-Red Postmortem Lividity • Bilateral Globus Pallidus Necrosis",
      forensicProfile: "Inhalation of colorless, odorless combustion gas binding hemoglobin and intracellular myoglobin/cytochromes.",
      pathologyMechanism: "Carboxyhemoglobin (COHb) impairs oxygen delivery; cellular dysoxia causes selective ischemic necrosis of basal ganglia.",
      clinicalHallmarks: "Bright cherry-red skin, muscles, and blood; bilateral symmetric globus pallidus hemorrhagic necrosis; 100% normobaric/hyperbaric O2.",
      highYieldPearls: "Carbon monoxide produces pathognomonic cherry-red postmortem lividity and bilateral necrosis of the globus pallidus."
    },
    {
      id: "for-tox-cyanide-histotoxic",
      name: "Acute Cyanide Histotoxic Hypoxia (Cytochrome c Oxidase & Hydroxocobalamin)",
      category: "Cellular Asphyxiant",
      subType: "Inhibits Cytochrome c Oxidase (Fe3+ Complex IV) • Severe Lactic Acidosis • Bright Pink Lividity • Bitter Almond Odor",
      forensicProfile: "Rapidly fatal toxin binding mitochondrial respiratory chain enzyme, completely paralyzing aerobic cellular respiration.",
      pathologyMechanism: "Tissues cannot extract oxygen from blood; venous blood returns fully oxygenated (SvO2 >90%), yielding bright pink hypostasis.",
      clinicalHallmarks: "Profound high-anion-gap lactic acidosis, bright pink mucous membranes, bitter almond scent; Antidote: IV Hydroxocobalamin.",
      highYieldPearls: "Cyanide halts mitochondrial respiration via Cytochrome c Oxidase, yielding high venous SvO2 and bright pink lividity."
    },
    {
      id: "for-tox-heavy-metals-arsenic-lead",
      name: "Heavy Metal Toxicities (Arsenic Mees Lines & Lead Burton Lines)",
      category: "Heavy Metal Toxins",
      subType: "Arsenic (Pyruvate Dehydrogenase / Garlic Breath / Mees Lines) • Lead (Burton Gingival Lines / Basophilic Stippling)",
      forensicProfile: "Systemic multi-organ toxicity from environmental, industrial, or homicidal heavy metal exposure.",
      pathologyMechanism: "Arsenic binds lipoic acid -SH groups; Lead inhibits ferrochelatase and delta-ALA dehydratase in heme synthesis pathway.",
      clinicalHallmarks: "Arsenic (Aldrich-Mees transverse nail bands, garlic odor, raindrop skin; BAL); Lead (Burton blue line on gums, wrist drop; CaNa2EDTA).",
      highYieldPearls: "Arsenic produces transverse Aldrich-Mees nail bands and garlic breath; Lead produces Burton blue lines on gingival margins."
    },
    {
      id: "for-tox-organophosphates-sludge",
      name: "Organophosphate Cholinergic Crisis (AChE Paralyzed Synapse & 2-PAM)",
      category: "Cholinesterase Toxin",
      subType: "Irreversible Acetylcholinesterase (AChE) Inhibition • SLUDGE / DUMBELS Toxidrome • Pinpoint Pupils • Atropine + Pralidoxime",
      forensicProfile: "Agricultural pesticide poisoning causing massive acetylcholine accumulation at muscarinic and nicotinic synapses.",
      pathologyMechanism: "Phosphorylates serine hydroxyl group on AChE active site; 'aging' causes irreversible bond maturation.",
      clinicalHallmarks: "Pinpoint pupils, copious frothing bronchorrhea, bradycardia, fasciculations; Antidote: IV Atropine (muscarinic) + Pralidoxime 2-PAM.",
      highYieldPearls: "Organophosphates irreversibly inhibit AChE; Atropine treats muscarinic symptoms while Pralidoxime (2-PAM) regenerates the enzyme."
    }
  ]
};

interface ClinicalForensicLabViewerProps {
  initialMode?: ForensicLabMode;
  height?: string;
  onNodeSelect?: (node: ForensicLabNode) => void;
}

export default function ClinicalForensicLabViewer({
  initialMode = "thanatology",
  height = "560px",
  onNodeSelect,
}: ClinicalForensicLabViewerProps) {
  const [activeMode, setActiveMode] = useState<ForensicLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Thanatology Profiler State
  const [selectedThan, setSelectedThan] = useState<"algor" | "rigor" | "livor" | "decomp">("livor");

  // Asphyxia Profiler State
  const [selectedAsph, setSelectedAsph] = useState<"hanging" | "ligature" | "throttling" | "drowning">("hanging");

  const thanDetails = useMemo(() => {
    if (selectedThan === "algor") {
      return {
        title: "Algor Mortis (Body Cooling & Henssge Nomogram)",
        indices: "Cooling Rate ~1.5°F / hour (0.8°C/h) • Rectal Temperature vs Ambient • Body Weight Correction",
        rx: "Calculate PMI using Henssge Nomogram with correction factors for clothing, air movement, and immersion",
        pearl: "Algor mortis is the primary method for estimating PMI during the initial 18-24 hours postmortem."
      };
    } else if (selectedThan === "rigor") {
      return {
        title: "Rigor Mortis (Postmortem Rigidity & ATP Depletion)",
        indices: "1-2h Heart -> 2-4h Jaw -> 12h Complete Rigidity -> Maintained 12-24h -> Resolves 36-48h",
        rx: "Follows Nysten's law (jaw -> neck -> upper limbs -> trunk -> lower limbs); broken rigidity does not return",
        pearl: "Rigor mortis is caused by complete cellular ATP depletion preventing actin-myosin detachment."
      };
    } else if (selectedThan === "livor") {
      return {
        title: "Livor Mortis (Postmortem Lividity & Hypostasis)",
        indices: "Onset 30-60 min • Fully Fixed 8-12h • Cherry-Red in CO/Cyanide • Chocolate-Brown in Met-Hb",
        rx: "Pressure blanching indicates PMI <8-12h; fixed hypostasis proves body was not repositioned early",
        pearl: "Cherry-red lividity indicates Carbon Monoxide (COHb) or Cyanide (histotoxic cellular hypoxia)."
      };
    } else {
      return {
        title: "Decomposition, Putrefaction & Casper's Dictum",
        indices: "24-36h RIF Green Discoloration • 36-48h Marbling • Casper Ratio (1 Air : 2 Water : 8 Soil)",
        rx: "Cecal Clostridium welchii converts hemoglobin to sulfhemoglobin producing right iliac fossa greening",
        pearl: "Green discoloration of the right iliac fossa (24-36h) is the earliest visible sign of putrefaction."
      };
    }
  }, [selectedThan]);

  const asphDetails = useMemo(() => {
    if (selectedAsph === "hanging") {
      return {
        title: "Ante-Mortem Suspension Hanging Traumatology",
        indices: "Oblique, Non-Continuous Ligature Mark • Above Thyroid Cartilage • Highest at Suspension Knot",
        rx: "Salivary dribbling from angle of mouth opposite suspension knot confirms ante-mortem hanging",
        pearl: "Salivary dribbling opposite the knot is pathognomonic evidence of true ante-mortem hanging."
      };
    } else if (selectedAsph === "ligature") {
      return {
        title: "Homicidal Ligature Strangulation",
        indices: "Horizontal, Continuous, Transverse Mark • At or Below Thyroid Cartilage • Tardieu Petechiae",
        rx: "Florid facial congestion, cyanosis, and profuse subconjunctival petechiae due to venous outflow block",
        pearl: "Ligature strangulation features a horizontal, continuous furrow encircling the neck, marked cyanosis, and Tardieu petechiae."
      };
    } else if (selectedAsph === "throttling") {
      return {
        title: "Manual Strangulation / Throttling",
        indices: "Crescentic Fingernail Abrasions & Fingertip Bruises • High Hyoid Bone Fracture Rate (60-70%)",
        rx: "Digital compression crushes laryngeal structures; fractures greater horns of hyoid bone inward/outward",
        pearl: "Manual strangulation has the highest incidence of hyoid bone and thyroid cartilage fractures (60-70%)."
      };
    } else {
      return {
        title: "Aquatic Drowning & Submersion Pathophysiology",
        indices: "Persistent 'Mushroom of Foam' Froth • Paltauf's Subpleural Hemorrhages • Femur Marrow Diatoms",
        rx: "Fine, white, leathery foam at mouth and nostrils; detection of diatoms in closed femur marrow proves ante-mortem drowning",
        pearl: "Detection of aquatic diatoms in closed femoral bone marrow is gold-standard proof of ante-mortem drowning."
      };
    }
  }, [selectedAsph]);

  const currentNodes = useMemo(() => {
    return FORENSIC_LAB_NODES[activeMode] || FORENSIC_LAB_NODES.thanatology;
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
            <Activity size={14} /> FOR-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "thanatology" && "Thanatology & Postmortem Interval (PMI): Algor, Rigor, Livor Mortis & Putrefaction"}
            {activeMode === "ballistics" && "Forensic Ballistics: Range of Fire (Contact, Stippling, Tattooing) & Entrance vs Exit Wounds"}
            {activeMode === "asphyxia" && "Mechanical Asphyxia: Hanging vs Ligature Strangulation vs Throttling & Drowning Pathophysiology"}
            {activeMode === "toxicology" && "Medicolegal Autopsy Toxicology: Carbon Monoxide, Cyanide, Heavy Metals (Arsenic, Lead) & Antidotes"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Forensic Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Forensic Pathology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Forensic Entity / Finding: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-indigo-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-indigo-950 text-xs rounded border border-indigo-700 text-indigo-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Thanatology & PMI */}
          {activeMode === "thanatology" && (
            <div className={styles.forCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Thermometer size={14} /> Thanatological Markers &amp; Postmortem Interval (PMI)
                </span>
                <span className="text-[11px] text-slate-400">Algor Mortis &bull; Rigor Mortis &bull; Livor Mortis &bull; Putrefaction</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedThan("algor")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedThan === "algor"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌡️ Algor Mortis (1.5°F/h)
                </button>
                <button
                  onClick={() => setSelectedThan("rigor")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedThan === "rigor"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💪 Rigor Mortis (ATP)
                </button>
                <button
                  onClick={() => setSelectedThan("livor")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedThan === "livor"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩸 Livor Mortis (8-12h Fixed)
                </button>
                <button
                  onClick={() => setSelectedThan("decomp")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedThan === "decomp"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🦠 Putrefaction (Casper)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{thanDetails.title}</div>
                <div className="text-indigo-400 font-bold mt-1">{thanDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Forensic Protocol:</strong> {thanDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Medicolegal Rule:</strong> {thanDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Forensic Ballistics */}
          {activeMode === "ballistics" && (
            <div className={styles.forCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crosshair size={14} /> Gunshot Wound Dynamics &amp; Range of Fire Classification
                </span>
                <span className="text-[11px] text-slate-400">Contact &bull; Close Range &bull; Intermediate (Stippling) &bull; Distant</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Hard Contact Cranial Stellate Tears vs Soot Smudging</div>
                  <div className="text-slate-300 mt-1">Hard contact wounds over flat bony skull cause high-pressure gas expansion in the subgaleal space, violently tearing the scalp into stellate/cruciform tears. Close range wounds (&lt;few inches) present with thermal flame singeing and washable superficial carbon soot (fouling).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Intermediate Tattooing (Stippling) vs Distant Abrasion Collar</div>
                  <div className="text-slate-300 mt-1">Intermediate range (1-3 feet) is defined by unburnt propellant powder flakes embedding into the viable dermis (tattooing/stippling), which CANNOT be washed off. Distant range (&gt;3 feet) exhibits only a central defect with an abrasion collar (friction ring) and grease collar (bullet wipe).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Mechanical Asphyxia */}
          {activeMode === "asphyxia" && (
            <div className={styles.forCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Mechanical Asphyxia &amp; Neck Compression Traumatology
                </span>
                <span className="text-[11px] text-slate-400">Hanging &bull; Ligature Strangulation &bull; Throttling &bull; Drowning</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedAsph("hanging")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAsph === "hanging"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🪢 Ante-Mortem Hanging
                </button>
                <button
                  onClick={() => setSelectedAsph("ligature")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAsph === "ligature"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚠️ Ligature Strangulation
                </button>
                <button
                  onClick={() => setSelectedAsph("throttling")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAsph === "throttling"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ✋ Throttling (Hyoid)
                </button>
                <button
                  onClick={() => setSelectedAsph("drowning")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAsph === "drowning"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌊 Aquatic Drowning (Diatoms)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{asphDetails.title}</div>
                <div className="text-indigo-400 font-bold mt-1">{asphDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Autopsy Protocol:</strong> {asphDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Medicolegal Hallmark:</strong> {asphDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Autopsy Toxicology */}
          {activeMode === "toxicology" && (
            <div className={styles.forCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TestTube size={14} /> Medicolegal Autopsy Toxicology &amp; Fatal Toxidromes
                </span>
                <span className="text-[11px] text-slate-400">Carbon Monoxide &bull; Cyanide &bull; Arsenic/Lead &bull; Organophosphates</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Carbon Monoxide (COHb) vs Cyanide (Complex IV)</div>
                  <div className="text-slate-300 mt-1">Carbon monoxide binds Hb with &gt;200x affinity producing bright cherry-red lividity and bilateral globus pallidus necrosis (treated with 100% O2). Cyanide inhibits mitochondrial Cytochrome c Oxidase causing histotoxic cellular hypoxia, bright pink lividity, and bitter almond odor (treated with Hydroxocobalamin).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Heavy Metal Signatures &amp; Organophosphates</div>
                  <div className="text-slate-300 mt-1">Arsenic exhibits garlic breath, Aldrich-Mees nail bands, and raindrop pigmentation (antidote: Dimercaprol/Succimer). Lead presents with Burton gingival blue lines, basophilic stippling, and wrist drop (antidote: CaNa2EDTA + Succimer). Organophosphates irreversibly inhibit AChE causing SLUDGE toxidrome (antidote: Atropine + 2-PAM).</div>
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
                    <span className="text-indigo-400 font-bold">Forensic:</span> {node.forensicProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect autopsy protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Forensic Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Forensic Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Medicolegal Entity / Traumatology</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Biophysical &amp; Pathological Mechanism</div>
            <div className="text-xs text-indigo-300 font-semibold">{activeNode.forensicProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Autopsy Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Forensic Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("thanatology")}
          className={`${styles.modeTab} ${activeMode === "thanatology" ? styles.modeTabActive : ""}`}
        >
          ⏱️ 1. Thanatology &amp; PMI
        </button>
        <button
          onClick={() => setActiveMode("ballistics")}
          className={`${styles.modeTab} ${activeMode === "ballistics" ? styles.modeTabActive : ""}`}
        >
          🎯 2. Forensic Ballistics
        </button>
        <button
          onClick={() => setActiveMode("asphyxia")}
          className={`${styles.modeTab} ${activeMode === "asphyxia" ? styles.modeTabActive : ""}`}
        >
          🪢 3. Mechanical Asphyxia
        </button>
        <button
          onClick={() => setActiveMode("toxicology")}
          className={`${styles.modeTab} ${activeMode === "toxicology" ? styles.modeTabActive : ""}`}
        >
          🧪 4. Autopsy Toxicology
        </button>
      </div>
    </div>
  );
}
