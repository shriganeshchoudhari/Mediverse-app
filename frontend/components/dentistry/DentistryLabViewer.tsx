"use client";

import React, { useState, useMemo } from "react";
import styles from "./DentistryLabViewer.module.css";
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
  Award,
} from "lucide-react";

export type DentistryLabMode = "notation" | "infections" | "trauma" | "pathology";

export interface DentistryLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  anatomicalBasis: string;
  diagnosticCriteria: string;
  surgicalIntervention: string;
  highYieldPearl: string;
}

export const DENTISTRY_NODES: Record<DentistryLabMode, DentistryLabNode[]> = {
  notation: [
    {
      id: "dent-enamel-dentin-histology",
      name: "Enamel, Dentin & Dental Pulp Histology",
      category: "Dental Microanatomy",
      subType: "Enamel (96% Hydroxyapatite) • Dentin (Odontoblasts) • Pulp (A-delta & C Fibers)",
      anatomicalBasis: "Enamel is acellular/avascular (hardest bodily tissue). Dentin contains tubular extensions of odontoblasts. Pulp contains nociceptive nerve fibers.",
      diagnosticCriteria: "Critical pH for enamel demineralization is <=5.5. A-delta fibers mediate sharp fleeting pain; C fibers mediate unprovoked throbbing pain.",
      surgicalIntervention: "Operative restoration / resin composite for enamel/dentin caries. Root canal treatment (pulpectomy) for irreversible pulpitis.",
      highYieldPearl: "Ameloblasts are lost upon tooth eruption, preventing cellular enamel regeneration, whereas odontoblasts persist in the pulp periphery to lay down secondary and tertiary reparative dentin."
    },
    {
      id: "dent-fdi-universal-eruption-chronology",
      name: "FDI & Universal Tooth Notation & Eruption Sequences",
      category: "Dental Nomenclature",
      subType: "Permanent 32 (FDI 11–48) • Deciduous 20 (FDI 51–85) • 6-Year First Permanent Molar",
      anatomicalBasis: "First permanent molar (FDI 46/36/16/26) erupts at age 6 behind deciduous second molars without preceding tooth exfoliation (non-succedaneous).",
      diagnosticCriteria: "FDI system: 1st digit = Quadrant (1-4 permanent, 5-8 primary), 2nd digit = Tooth (1 central incisor to 8 third molar). Universal: 1 to 32.",
      surgicalIntervention: "Fissure sealants on 6-year and 12-year permanent molars to prevent pit and fissure caries.",
      highYieldPearl: "The permanent first molar ('6-year molar') is the most important cornerstone of adult dental occlusion (Angle Class I key) and does not replace any deciduous predecessor."
    }
  ],

  infections: [
    {
      id: "dent-ludwig-angina-emergency-airway",
      name: "Ludwig's Angina & Deep Neck Fascial Spaces",
      category: "Maxillofacial Emergency",
      subType: "Bilateral Submandibular • Bilateral Sublingual • Submental • Awake Fiberoptic Airway",
      anatomicalBasis: "Infection from lower 2nd/3rd molars perforates lingually below the mylohyoid ridge into the submandibular space, spreading bilaterally to sublingual and submental spaces.",
      diagnosticCriteria: "Woody brawny induration of neck, elevated retrodisplaced tongue ('double tongue'), trismus, stridor, and drooling without initial fluctuance.",
      surgicalIntervention: "Mandatory Awake Fiberoptic Intubation / Tracheostomy + Broad-spectrum IV Ampicillin-Sulbactam + Submandibular incision and drainage.",
      highYieldPearl: "Standard paralytic rapid-sequence induction in Ludwig's angina is catastrophic due to complete airway collapse; Awake Fiberoptic Intubation in the OR is the gold standard."
    },
    {
      id: "dent-danger-space-descending-mediastinitis",
      name: "Danger Space 4 & Descending Necrotizing Mediastinitis",
      category: "Deep Fascial Conduit",
      subType: "Between Alar Fascia & Prevertebral Fascia • Extends from Skull Base to Diaphragm (T12)",
      anatomicalBasis: "Space 4 (Danger Space) contains loose areolar tissue and communicates directly from the skull base down into the posterior mediastinum.",
      diagnosticCriteria: "Pleural effusion, widening of superior mediastinum on CXR, severe sepsis, retrosternal chest pain following odontogenic infection.",
      surgicalIntervention: "Emergent combined transcervical and thoracotomy drainage + high-dose IV Carbapenem / Vancomycin (mortality >50%).",
      highYieldPearl: "The danger space (Space 4) lies between the alar and prevertebral layers of the deep cervical fascia, providing an unobstructed highway to the posterior mediastinum."
    }
  ],

  trauma: [
    {
      id: "dent-le-fort-i-ii-iii-fractures",
      name: "Le Fort I, II & III Midfacial Fractures",
      category: "Midfacial Skeletal Trauma",
      subType: "Le Fort I (Floating Palate) • Le Fort II (Floating Maxilla) • Le Fort III (Craniofacial Dysjunction)",
      anatomicalBasis: "René Le Fort lines of weakness: Le Fort I (transmaxillary Guerin), Le Fort II (pyramidal nasomaxillary/orbital), Le Fort III (craniofacial disjunction with skull base separation).",
      diagnosticCriteria: "Le Fort I: Mobile palate only. Le Fort II: Mobile maxilla + nose + bilateral V2 numbness + orbital rim step-off. Le Fort III: Floating face, dish-face deformity, CSF rhinorrhea, raccoon eyes.",
      surgicalIntervention: "Open Reduction and Internal Fixation (ORIF) with titanium miniplates across facial buttresses (zygomaticomaxillary, nasofrontal, and infraorbital rims).",
      highYieldPearl: "Pterygoid plate disruption on coronal/axial CT is the sine qua non (mandatory diagnostic feature) common to all three Le Fort fractures."
    },
    {
      id: "dent-mandibular-fractures-sublingual-hematoma",
      name: "Mandibular Fractures & Coleman's Sublingual Hematoma",
      category: "Mandibular Trauma",
      subType: "Condyle (30%) • Angle (25% Third Molar) • Parasymphysis • Sublingual Hematoma Pathognomonic",
      anatomicalBasis: "Thin condylar neck absorbs symphyseal impact. Impacted 3rd molars weaken the mandibular angle. Mental nerve (V3) exits at premolar apex.",
      diagnosticCriteria: "Dental malocclusion, sublingual hematoma in floor of mouth (Coleman's sign), chin deviation to side of condylar fracture on opening.",
      surgicalIntervention: "Maxillomandibular Fixation (MMF / Arch bars) x 4-6 weeks or ORIF along Champy's ideal lines of osteosynthesis.",
      highYieldPearl: "Coleman's sign (sublingual hematoma in the floor of the mouth) is pathognomonic of a fracture of the mandibular body or symphysis."
    }
  ],

  pathology: [
    {
      id: "dent-ameloblastoma-soap-bubble-mandible",
      name: "Ameloblastoma Multilocular Neoplasm & Fibula Flap",
      category: "Odontogenic Neoplasms",
      subType: "Multilocular 'Soap Bubble' Radiolucency • Mandibular Angle (80%) • Segmental Resection 1.5 cm",
      anatomicalBasis: "Benign but locally aggressive epithelial odontogenic neoplasm arising from dental lamina rests with extensive medullary invasion.",
      diagnosticCriteria: "X-ray shows 'soap bubble' or 'honeycomb' radiolucency with cortical expansion and root resorption. Histology: Peripheral columnar palisading with reversed nuclear polarity.",
      surgicalIntervention: "Wide segmental mandibulectomy with 1.0 to 1.5 cm clear margins + primary reconstruction with vascularized free fibula flap.",
      highYieldPearl: "Simple curettage of an ameloblastoma carries an unacceptable >50-90% recurrence rate; wide bony resection with 1.0-1.5 cm negative margins is mandatory."
    },
    {
      id: "dent-tmj-anterior-disc-nelaton-maneuver",
      name: "TMJ Disc Disorders & Acute Dislocation (Nélaton Maneuver)",
      category: "Temporomandibular Joint",
      subType: "Disc Displacement With vs Without Reduction • Acute Condylar Dislocation • Nélaton Maneuver",
      anatomicalBasis: "Articular fibrocartilage disc between mandibular condyle and glenoid fossa. Dislocation occurs when condyle translates anterior to articular eminence.",
      diagnosticCriteria: "With reduction: Reciprocal click. Without reduction ('Closed lock'): Opening <30 mm, jaw deviates to affected side. Dislocation: Inability to close mouth ('Open lock').",
      surgicalIntervention: "Manual reduction via Nélaton maneuver (firm downward and backward force on mandibular molars with protected thumbs).",
      highYieldPearl: "During the Nélaton maneuver for acute TMJ dislocation, the examiner must wrap their thumbs in gauze and apply downward pressure on the molars to distract the condyle below the articular eminence."
    }
  ]
};

interface DentistryLabViewerProps {
  initialMode?: DentistryLabMode;
  height?: string;
  onNodeSelect?: (node: DentistryLabNode) => void;
}

export default function DentistryLabViewer({
  initialMode = "notation",
  height = "560px",
  onNodeSelect,
}: DentistryLabViewerProps) {
  const [activeMode, setActiveMode] = useState<DentistryLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Dental Notation State
  const [selectedTooth, setSelectedTooth] = useState<"46" | "11" | "13" | "48">("46");

  // Maxillofacial Le Fort State
  const [selectedLeFort, setSelectedLeFort] = useState<"1" | "2" | "3">("2");

  // Tooth details calculator
  const toothDetails = useMemo(() => {
    if (selectedTooth === "46") {
      return {
        name: "Mandibular Right 1st Permanent Molar ('6-Year Molar')",
        fdi: "Tooth 46",
        universal: "Tooth #30",
        palmer: "6_| (Lower Right 6)",
        eruptionAge: "6 to 7 Years",
        clinicalRole: "Cornerstone of Class I adult occlusion; non-succedaneous (erupts behind primary 2nd molar).",
        rootFascialRelation: "Mesial root above mylohyoid ridge; Distal root apex often extends BELOW mylohyoid ridge."
      };
    } else if (selectedTooth === "11") {
      return {
        name: "Maxillary Right Central Incisor",
        fdi: "Tooth 11",
        universal: "Tooth #8",
        palmer: "|_1 (Upper Right 1)",
        eruptionAge: "7 to 8 Years",
        clinicalRole: "Aesthetic guide and anterior guidance; primary site of dental trauma in children.",
        rootFascialRelation: "Periapical spread perforates labially into vestibular space or palatally."
      };
    } else if (selectedTooth === "13") {
      return {
        name: "Maxillary Right Permanent Canine ('Eye Tooth')",
        fdi: "Tooth 13",
        universal: "Tooth #6",
        palmer: "|_3 (Upper Right 3)",
        eruptionAge: "11 to 12 Years",
        clinicalRole: "Canine guidance in lateral excursions; longest root in human dentition; canine space abscess.",
        rootFascialRelation: "Root apex lies above levator anguli oris -> Canine Space infection with infraorbital swelling."
      };
    } else {
      return {
        name: "Mandibular Right 3rd Permanent Molar ('Wisdom Tooth')",
        fdi: "Tooth 48",
        universal: "Tooth #32",
        palmer: "8_| (Lower Right 8)",
        eruptionAge: "17 to 21 Years",
        clinicalRole: "Highest incidence of impaction and pericoronitis; predisposes mandibular angle to trauma.",
        rootFascialRelation: "Root apices lie completely BELOW mylohyoid ridge -> Submandibular Space & Ludwig's Angina!"
      };
    }
  }, [selectedTooth]);

  const leFortDetails = useMemo(() => {
    if (selectedLeFort === "1") {
      return {
        name: "Le Fort I (Guerin / Horizontal Maxillary Fracture)",
        clinicalSign: "'Floating Palate' with anterior open bite",
        fracturePath: "Transverse through pyriform aperture, anterior maxillary antrum, and lower pterygoid plates.",
        keyFinding: "Mobility of hard palate and upper dental arch only; nasal bridge and orbits remain completely stable.",
        color: "text-amber-300 font-bold"
      };
    } else if (selectedLeFort === "2") {
      return {
        name: "Le Fort II (Pyramidal Midfacial Fracture)",
        clinicalSign: "'Floating Maxilla' with Bilateral V2 Infraorbital Anesthesia",
        fracturePath: "Pyramidal through nasofrontal suture, lacrimal bones, inferior orbital rim, and lateral maxillary wall.",
        keyFinding: "Mobility of maxilla and nose together; step-off deformity at inferior orbital rims; telecanthus.",
        color: "text-purple-300 font-bold"
      };
    } else {
      return {
        name: "Le Fort III (Craniofacial Dysjunction / 'Dish-Face')",
        clinicalSign: "'Floating Face' with Raccoon Eyes & CSF Rhinorrhea",
        fracturePath: "Complete separation through nasofrontal, superior orbital fissure, zygomaticofrontal suture, and high pterygoids.",
        keyFinding: "Entire facial skeleton moves as a single block; dish-face flattening; cribriform plate CSF leak.",
        color: "text-rose-400 font-extrabold"
      };
    }
  }, [selectedLeFort]);

  const currentNodes = useMemo(() => {
    return DENTISTRY_NODES[activeMode] || DENTISTRY_NODES.notation;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: DentistryLabNode) => {
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
            <Award size={14} /> DENT-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "notation" && "Dental Anatomy, FDI/Universal Tooth Notation & Eruption Lab"}
            {activeMode === "infections" && "Odontogenic Fascial Spaces & Ludwig's Angina Emergency Airway"}
            {activeMode === "trauma" && "Maxillofacial Trauma: Le Fort Fractures & Mandibular Skeletal Fixation"}
            {activeMode === "pathology" && "Oral Pathology, Ameloblastoma 'Soap Bubble' & TMJ Nélaton Reducer"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Dentistry Quiz"}
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
                  Dentistry Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Scenario: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: Tooth Notation & Eruption Inspector */}
          {activeMode === "notation" && (
            <div className={styles.dentSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> Tooth Notation &amp; Eruption Chronology
                </span>
                <span className="text-[11px] text-slate-400">FDI vs Universal vs Palmer</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedTooth("46")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTooth === "46"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Tooth 46 (Lower 1st Molar)
                </button>
                <button
                  onClick={() => setSelectedTooth("11")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTooth === "11"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Tooth 11 (Upper Central Incisor)
                </button>
                <button
                  onClick={() => setSelectedTooth("13")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTooth === "13"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Tooth 13 (Upper Canine)
                </button>
                <button
                  onClick={() => setSelectedTooth("48")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTooth === "48"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Tooth 48 (Lower 3rd Molar)
                </button>
              </div>

              <div className={styles.dentResultsGrid}>
                <div className={styles.dentResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">FDI / Universal / Palmer</div>
                  <div className="text-xs font-bold text-purple-300 mt-1">{toothDetails.fdi} • {toothDetails.universal} • {toothDetails.palmer}</div>
                </div>
                <div className={styles.dentResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Eruption Age</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">{toothDetails.eruptionAge}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div><strong className="text-purple-400">Clinical Role:</strong> {toothDetails.clinicalRole}</div>
                <div className="mt-1"><strong className="text-purple-400">Mylohyoid / Fascial Relationship:</strong> {toothDetails.rootFascialRelation}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Ludwig's Angina Airway */}
          {activeMode === "infections" && (
            <div className={styles.dentSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Ludwig's Angina Emergency Airway &amp; Decompression Algorithm
                </span>
                <span className="text-[11px] text-slate-400">Mylohyoid Line Anatomic Spread</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Anatomic Spread Triad</div>
                  <div className="text-slate-300 mt-1">Bilateral Submandibular + Bilateral Sublingual + Submental spaces involved bilaterally with board-like woody induration.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Mandatory Airway Rule</div>
                  <div className="text-slate-300 mt-1">Awake Fiberoptic Intubation in OR with tracheostomy tray open. NEVER give paralytics (causes fatal airway collapse).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Maxillofacial Le Fort Fractures */}
          {activeMode === "trauma" && (
            <div className={styles.dentSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors size={14} /> Le Fort Midfacial Fracture Level Selector
                </span>
                <span className="text-[11px] text-slate-400">Pterygoid Disruption</span>
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setSelectedLeFort("1")}
                  className={`px-3 py-1.5 rounded font-semibold border ${
                    selectedLeFort === "1"
                      ? "bg-purple-700 text-white border-purple-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  Le Fort I (Horizontal)
                </button>
                <button
                  onClick={() => setSelectedLeFort("2")}
                  className={`px-3 py-1.5 rounded font-semibold border ${
                    selectedLeFort === "2"
                      ? "bg-purple-700 text-white border-purple-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  Le Fort II (Pyramidal)
                </button>
                <button
                  onClick={() => setSelectedLeFort("3")}
                  className={`px-3 py-1.5 rounded font-semibold border ${
                    selectedLeFort === "3"
                      ? "bg-purple-700 text-white border-purple-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  Le Fort III (Craniofacial Dysjunction)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className={`text-sm ${leFortDetails.color}`}>{leFortDetails.name}</div>
                <div className="text-slate-300 mt-1 font-semibold">{leFortDetails.clinicalSign}</div>
                <div className="text-slate-400 mt-1">{leFortDetails.fracturePath}</div>
                <div className="text-purple-300 font-bold mt-1.5">{leFortDetails.keyFinding}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Oral Pathology & TMJ */}
          {activeMode === "pathology" && (
            <div className={styles.dentSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Ameloblastoma &amp; TMJ Nélaton Maneuver Reducer
                </span>
                <span className="text-[11px] text-slate-400">Soap Bubble Radiolucency</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Ameloblastoma Multilocular Neoplasm</div>
                  <div className="text-slate-300 mt-1">Mandibular molar soap-bubble radiolucency. Wide segmental resection with 1.0–1.5 cm margins + vascularized free fibula flap.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">TMJ Acute Dislocation (Nélaton Maneuver)</div>
                  <div className="text-slate-300 mt-1">Condyle anterior to articular eminence ('Open lock'). Apply steady DOWNWARD and BACKWARD pressure on mandibular molars with gauze-wrapped thumbs.</div>
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
                    <span className="text-purple-400 font-bold">Clinical Action:</span> {node.surgicalIntervention}
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

        {/* Right Side: High-Yield Dentistry Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Dentistry Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🦷 Clinical Topic</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Anatomical Basis</div>
            <div className={styles.inspectorBody}>{activeNode.anatomicalBasis}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Key Findings &amp; Diagnostic Criteria</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Clinical Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("notation")}
          className={`${styles.modeTab} ${activeMode === "notation" ? styles.modeTabActive : ""}`}
        >
          🦷 1. Notation &amp; Eruption
        </button>
        <button
          onClick={() => setActiveMode("infections")}
          className={`${styles.modeTab} ${activeMode === "infections" ? styles.modeTabActive : ""}`}
        >
          🚨 2. Ludwig's Angina
        </button>
        <button
          onClick={() => setActiveMode("trauma")}
          className={`${styles.modeTab} ${activeMode === "trauma" ? styles.modeTabActive : ""}`}
        >
          💥 3. Le Fort Trauma
        </button>
        <button
          onClick={() => setActiveMode("pathology")}
          className={`${styles.modeTab} ${activeMode === "pathology" ? styles.modeTabActive : ""}`}
        >
          🔬 4. Ameloblastoma &amp; TMJ
        </button>
      </div>
    </div>
  );
}
