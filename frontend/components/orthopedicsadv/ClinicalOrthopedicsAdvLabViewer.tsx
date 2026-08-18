"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalOrthopedicsAdvLabViewer.module.css";
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

export type OrthopedicsLabMode = "compartment" | "openFractures" | "pediatricHip" | "boneOncology";

export interface OrthopedicsLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  orthopedicProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const ORTHOPEDICS_LAB_NODES: Record<OrthopedicsLabMode, OrthopedicsLabNode[]> = {
  compartment: [
    {
      id: "ort-cs-cardinal-signs",
      name: "Acute Compartment Syndrome (The 6 'P's, Muscle Ischemia & Intracompartmental Manometry)",
      category: "Orthopedic Emergency",
      subType: "Pain Out of Proportion • Pain on Passive Stretch • Paresthesias • Woody Compartment • Emergency",
      orthopedicProfile: "Elevated hydrostatic tissue pressure within an inelastic osteofascial envelope compromising microcirculation.",
      pathophysiologyMechanism: "Tissue pressure exceeding capillary closing pressure leads to cellular hypoxia, myocyte necrosis, and nerve ischemia.",
      clinicalHallmarks: "Excruciating pain unresponsive to escalating IV opioids; agonizing pain on passive stretch of ischemic muscle.",
      highYieldPearls: "Pain on passive stretch is the most sensitive early clinical sign; pulselessness is an extremely late and irreversible sign."
    },
    {
      id: "ort-cs-delta-pressure",
      name: "Delta Pressure Diagnostic Threshold (Diastolic BP - Compartment Pressure <= 30 mmHg)",
      category: "Diagnostic Manometry",
      subType: "Delta P = Diastolic BP - Compartment Pressure • Delta P <=30 mmHg = Absolute Operative Indication",
      orthopedicProfile: "Perfusion pressure gradient determining microvascular tissue viability across closed osteofascial compartments.",
      pathophysiologyMechanism: "When Delta P drops <=30 mmHg, capillary transmural pressure gradient collapses, causing complete microvascular cessation.",
      clinicalHallmarks: "Direct needle manometry (Stryker needle); absolute compartment pressure >30 mmHg or Delta P <=30 mmHg mandates surgery.",
      highYieldPearls: "Delta Pressure <= 30 mmHg (Diastolic BP - Compartment Pressure) is the gold-standard indication for emergent fasciotomy."
    },
    {
      id: "ort-cs-dual-incision-fasciotomy",
      name: "Dual-Incision 4-Compartment Leg Fasciotomy (Anterolateral & Posteromedial Decompression)",
      category: "Surgical Decompression",
      subType: "Anterolateral Incision (Anterior + Lateral) • Posteromedial Incision (Superficial + Deep Posterior)",
      orthopedicProfile: "Complete surgical release of all four osteofascial compartments of the leg to restore microvascular perfusion.",
      pathophysiologyMechanism: "Full-length longitudinal dermato-fasciotomy relieves tissue tamponade before irreversible muscle necrosis at 6-8 hours.",
      clinicalHallmarks: "Anterolateral incision decompresses anterior & lateral compartments; posteromedial incision decompresses posterior compartments.",
      highYieldPearls: "Always decompress all 4 compartments of the leg; watch for superficial peroneal nerve during anterolateral fasciotomy."
    },
    {
      id: "ort-cs-volkmann-contracture",
      name: "Volkmann Ischemic Contracture (Irreversible Muscle Necrosis & Claw Hand)",
      category: "Late Ischemic Sequela",
      subType: "Flexor Digitorum Profundus & FPL Necrosis • Fibrotic Contracture • Median / Ulnar Neuropathy",
      orthopedicProfile: "End-stage cicatricial contracture of the forearm and hand following unrecognized or untreated compartment syndrome.",
      pathophysiologyMechanism: "Ischemic myonecrosis replaced by dense fibrotic scar tissue, creating fixed wrist flexion and claw fingers.",
      clinicalHallmarks: "Classically follows supracondylar humerus fractures in children or crush injuries of the forearm.",
      highYieldPearls: "Volkmann ischemic contracture is the permanent fibrotic outcome of untreated acute forearm compartment syndrome."
    }
  ],

  openFractures: [
    {
      id: "ort-of-gustilo-type-1-2",
      name: "Gustilo-Anderson Type I & II Open Fractures (Cefazolin Prophylaxis & Low-Pressure Lavage)",
      category: "Open Fracture Triage",
      subType: "Type I (<1 cm Clean) • Type II (1-10 cm Moderate Energy) • Cefazolin IV (1st-Gen Cephalosporin)",
      orthopedicProfile: "Low- to moderate-energy open fractures with minimal soft tissue stripping and clean wound edges.",
      pathophysiologyMechanism: "Direct communication between bone and external environment without extensive devitalized muscle beds.",
      clinicalHallmarks: "Type I: wound <1 cm from inside-out puncture; Type II: 1-10 cm without extensive soft tissue loss; Cefazolin for 24h.",
      highYieldPearls: "Gustilo Types I and II require IV Cefazolin within 1 hour and formal operative irrigation and debridement."
    },
    {
      id: "ort-of-gustilo-type-3a-3b",
      name: "Gustilo Type IIIa & IIIb Severe Soft Tissue Loss (Gentamicin, Penicillin G & Flap Reconstruction)",
      category: "High-Energy Trauma",
      subType: "Type IIIa (Adequate Bone Coverage) • Type IIIb (Bone Exposed / Flap Required) • Gentamicin + Penicillin",
      orthopedicProfile: "High-energy open fractures with extensive soft tissue tearing, periosteal stripping, and high osteomyelitis risk.",
      pathophysiologyMechanism: "Extensive soft tissue crushing, devitalized bone fragments, and severe polymicrobial bacterial inoculation.",
      clinicalHallmarks: "Type IIIa has adequate soft tissue coverage; Type IIIb has bare bone requiring rotational or free plastic flap coverage.",
      highYieldPearls: "Type III open fractures mandate dual coverage with Cefazolin + Gentamicin; add Penicillin G if farm/soil contamination."
    },
    {
      id: "ort-of-gustilo-type-3c-vascular",
      name: "Gustilo Type IIIc Vascular Crisis (Mangled Extremity & Emergent Revascularization)",
      category: "Limb Salvage Emergency",
      subType: "Open Fracture with Arterial Injury Requiring Vascular Repair • MESS Score • Emergent Shunt / Bypass",
      orthopedicProfile: "Open fracture of any dimension associated with an arterial injury that threatens limb viability without revascularization.",
      pathophysiologyMechanism: "Arterial transection or intimal dissection produces severe warm ischemia, requiring restoration within 6 hours.",
      clinicalHallmarks: "Cold, pulseless extremity with open fracture; temporary intravascular shunting and external skeletal stabilization.",
      highYieldPearls: "Any open fracture with an arterial injury requiring surgical repair is classified as Gustilo Type IIIc."
    },
    {
      id: "ort-of-tetanus-debridement",
      name: "Tetanus Prophylaxis & Surgical Debridement (Pulsatile Lavage & Temporary External Fixation)",
      category: "Trauma Protocol",
      subType: "Tetanus Toxoid +/- TIG • Low-Pressure Pulsatile Lavage (>=9L for Type III) • Span-Scan-Plan Protocol",
      orthopedicProfile: "Systematic infection prevention and skeletal stabilization in severe polytrauma open fractures.",
      pathophysiologyMechanism: "Excision of all non-viable, necrotic tissue eliminates the substrate for bacterial proliferation and biofilm formation.",
      clinicalHallmarks: "Tetanus toxoid + TIG if unimmunized; copious low-pressure saline lavage; temporary bridging external fixation.",
      highYieldPearls: "Antibiotics administered within 1 hour of open fracture injury are the single most effective intervention to prevent infection."
    }
  ],

  pediatricHip: [
    {
      id: "ort-ped-ddh-pavlik",
      name: "Developmental Dysplasia of the Hip DDH (Ortolani/Barlow Relocation & Pavlik Harness)",
      category: "Pediatric Dysplasia",
      subType: "Ortolani (+ Relocation) • Barlow (+ Dislocation) • Ultrasound (<6m) • Pavlik Harness (Flexion + Abduction)",
      orthopedicProfile: "Abnormal development of the acetabulum and femoral head leading to instability, subluxation, or dislocation.",
      pathophysiologyMechanism: "Acetabular dysplasia with insufficient bony roof coverage; risk factors include female sex, breech presentation, firstborn.",
      clinicalHallmarks: "Palpable clunk on Ortolani relocation; Galeazzi sign (asymmetric knee height); dynamic ultrasound under 6 months.",
      highYieldPearls: "First-line treatment for DDH in infants <6 months is the Pavlik harness, maintaining hip in 100-110 deg flexion and abduction."
    },
    {
      id: "ort-ped-scfe-in-situ",
      name: "Slipped Capital Femoral Epiphysis SCFE (Klein Line Failure, Obturator Referred Pain & In Situ Pinning)",
      category: "Adolescent Epiphyseal",
      subType: "Obese Adolescent Boys (11-14y) • Referred Knee Pain • Klein Line Trethowan Sign • In Situ Single Screw",
      orthopedicProfile: "Anterosuperior displacement of the femoral neck relative to the femoral head epiphysis through the physeal hypertrophic zone.",
      pathophysiologyMechanism: "Shearing biomechanical forces across the weakened proximal femoral physis during the adolescent growth spurt.",
      clinicalHallmarks: "Dull groin or referred medial knee pain with obligatory external rotation on hip flexion; Klein's line fails to intersect head.",
      highYieldPearls: "NEVER attempt closed reduction in SCFE (destroys retinacular vessels causing AVN); perform emergent in situ single screw fixation."
    },
    {
      id: "ort-ped-legg-calve-perthes",
      name: "Legg-Calvé-Perthes Osteonecrosis (Femoral Head Avascular Necrosis & Crescent Sign)",
      category: "Pediatric Osteonecrosis",
      subType: "Idiopathic Femoral Head AVN • Young Boys (4-8y) • Painless/Mild Limp • Radiographic Subchondral Crescent",
      orthopedicProfile: "Self-limiting idiopathic avascular necrosis of the proximal femoral epiphysis with subsequent revascularization.",
      pathophysiologyMechanism: "Interruption of blood supply to the capital femoral epiphysis followed by infarction, collapse, and creeping substitution.",
      clinicalHallmarks: "Insidious antalgic limp with loss of hip internal rotation and abduction; subchondral radiolucent crescent sign on AP radiograph.",
      highYieldPearls: "Legg-Calvé-Perthes disease presents in young boys (4-8y) with painless limp and restricted internal rotation/abduction."
    },
    {
      id: "ort-ped-septic-arthritis-kocher",
      name: "Pediatric Septic Arthritis (Kocher Diagnostic Criteria & Emergent Arthrotomy)",
      category: "Pediatric Infection",
      subType: "Kocher Criteria: Fever >38.5C, Non-Weight Bearing, ESR >40, WBC >12k • Emergent Arthrotomy & Drainage",
      orthopedicProfile: "Bacterial infection of the joint space (*Staphylococcus aureus*) causing rapid enzymatic destruction of articular cartilage.",
      pathophysiologyMechanism: "Bacterial metalloproteinases and neutrophil degranulation digest hyaluronic acid and type II collagen within 24-48 hours.",
      clinicalHallmarks: "Child holds hip flexed, abducted, and externally rotated; refusal to bear weight; Kocher score 4/4 = 99% probability.",
      highYieldPearls: "Septic arthritis of the hip is an orthopedic surgical emergency requiring immediate diagnostic arthrocentesis and operative drainage."
    }
  ],

  boneOncology: [
    {
      id: "ort-onc-osteosarcoma-map",
      name: "High-Grade Conventional Osteosarcoma (Metaphyseal Sunburst, Codman Triangle & MAP Chemotherapy)",
      category: "Malignant Bone Sarcoma",
      subType: "Metaphysis of Long Bones (Distal Femur) • Sunburst Spiculation • Codman Triangle • Malignant Osteoid",
      orthopedicProfile: "Most common primary malignant bone tumor in children and adolescents, characterized by neoplastic osteoid matrix.",
      pathophysiologyMechanism: "Malignant mesenchymal osteoblasts produce dense unmineralized osteoid and woven bone, breaking through the cortex.",
      clinicalHallmarks: "Bimodal age (10-20y and >60y with Paget's); 'sunburst' periosteal reaction and Codman's triangle; MAP neoadjuvant chemo + surgery.",
      highYieldPearls: "Osteosarcoma occurs in long bone metaphyses, shows sunburst periosteal reaction with Codman triangle, and makes osteoid."
    },
    {
      id: "ort-onc-ewing-sarcoma-cd99",
      name: "Ewing Sarcoma of Long Bones (Diaphyseal Onion Skinning, t(11;22) & CD99 Positivity)",
      category: "Neuroectodermal Sarcoma",
      subType: "Diaphysis • 'Onion Skinning' Multi-Layered Periosteum • t(11;22) EWS-FLI1 • Small Round Blue Cells (CD99+)",
      orthopedicProfile: "Second most common pediatric malignant bone tumor, originating from primitive neuroectodermal cells.",
      pathophysiologyMechanism: "Reciprocal chromosomal translocation t(11;22)(q24;q12) generates the chimeric EWS-FLI1 oncogenic transcription factor.",
      clinicalHallmarks: "Diaphyseal destructive lesion with concentric 'onion skin' periosteal lamellation; CD99 (MIC2) positivity; multi-agent chemo.",
      highYieldPearls: "Ewing sarcoma features diaphyseal onion skinning, t(11;22) translocation, and CD99+ small round blue cells."
    },
    {
      id: "ort-onc-gct-denosumab",
      name: "Giant Cell Tumor of Bone (Epiphyseal Soap-Bubble Lesions & RANKL Monoclonal Denosumab)",
      category: "Locally Aggressive Tumor",
      subType: "Epiphysis of Skeletally Mature Adults (20-40y) • 'Soap-Bubble' Lytic Lesion • Multinucleated Giant Cells • Denosumab",
      orthopedicProfile: "Locally destructive epiphyseal tumor composed of neoplastic stromal cells and reactive multinucleated osteoclasts.",
      pathophysiologyMechanism: "Stromal cells overexpress RANK Ligand (RANKL), inducing intense osteoclastogenesis and extensive subchondral osteolysis.",
      clinicalHallmarks: "Expansile 'soap-bubble' lucency extending to subchondral bone plate without sclerotic margin; treated with curettage + Denosumab.",
      highYieldPearls: "Giant cell tumor of bone occurs in the epiphysis of mature adults (20-40y), shows soap-bubble appearance, and responds to Denosumab."
    },
    {
      id: "ort-onc-chondrosarcoma-calc",
      name: "Malignant Chondrosarcoma (Ring-and-Arc Calcifications & Chemorad-Resistant Resection)",
      category: "Cartilaginous Malignancy",
      subType: "Axial Skeleton & Pelvis • Adults >40y • 'Ring-and-Arc' / 'Popcorn' Calcifications • Wide Surgical Excision",
      orthopedicProfile: "Malignant cartilage-forming tumor arising in the pelvis, proximal femur, and shoulder girdle of older adults.",
      pathophysiologyMechanism: "Neoplastic chondrocytes secrete abundant cartilaginous matrix with endochondral ossification and cortical scalloping.",
      clinicalHallmarks: "Radiographs show punctate 'ring-and-arc' or 'popcorn' chondroid calcifications; resistant to chemo/radiation; wide excision.",
      highYieldPearls: "Chondrosarcoma is chemo- and radiation-resistant; wide en bloc surgical resection with clear margins is the definitive treatment."
    }
  ]
};

interface ClinicalOrthopedicsAdvLabViewerProps {
  initialMode?: OrthopedicsLabMode;
  height?: string;
  onNodeSelect?: (node: OrthopedicsLabNode) => void;
}

export default function ClinicalOrthopedicsAdvLabViewer({
  initialMode = "compartment",
  height = "560px",
  onNodeSelect,
}: ClinicalOrthopedicsAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<OrthopedicsLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Delta Pressure Simulator State
  const [diastolicBp, setDiastolicBp] = useState<number>(75);
  const [compartmentPressure, setCompartmentPressure] = useState<number>(52);

  // Open Fracture Selector State
  const [selectedGustilo, setSelectedGustilo] = useState<"t1" | "t2" | "t3a" | "t3b" | "t3c">("t3b");

  const deltaPressure = useMemo(() => {
    return diastolicBp - compartmentPressure;
  }, [diastolicBp, compartmentPressure]);

  const isCompartmentSyndrome = useMemo(() => {
    return deltaPressure <= 30 || compartmentPressure >= 30;
  }, [deltaPressure, compartmentPressure]);

  const gustiloDetails = useMemo(() => {
    if (selectedGustilo === "t1") {
      return {
        title: "Gustilo-Anderson Type I Open Fracture",
        indices: "Wound < 1 cm • Clean Puncture (Inside-Out) • Minimal Soft Tissue Damage",
        rx: "IV Cefazolin (2 g q8h x 24h) + Operative Irrigation & Debridement (3 L)",
        pearl: "Type I open fractures carry a 0-2% infection rate when debrided and treated with 1st-generation cephalosporins."
      };
    } else if (selectedGustilo === "t2") {
      return {
        title: "Gustilo-Anderson Type II Open Fracture",
        indices: "Wound 1 - 10 cm • Moderate Energy Soft Tissue Injury • Minimal Periosteal Stripping",
        rx: "IV Cefazolin (2 g q8h x 24h) + Operative Irrigation & Debridement (6 L)",
        pearl: "Moderate comminution without severe periosteal stripping; infection rate is ~2-7%."
      };
    } else if (selectedGustilo === "t3a") {
      return {
        title: "Gustilo-Anderson Type IIIa Open Fracture",
        indices: "Wound > 10 cm • High-Energy Comminution • ADEQUATE Bone Soft Tissue Coverage",
        rx: "IV Cefazolin + IV Gentamicin (5 mg/kg) +/- Penicillin G + I&D (9 L)",
        pearl: "Adequate local soft tissue coverage over fractured bone despite extensive laceration."
      };
    } else if (selectedGustilo === "t3b") {
      return {
        title: "Gustilo-Anderson Type IIIb Open Fracture (Severe Bone Exposure)",
        indices: "Wound > 10 cm • Severe Periosteal Stripping • REQUIRES Plastic Flap Reconstruction",
        rx: "IV Cefazolin + IV Gentamicin + Penicillin G (if barnyard) + Rotational/Free Flap",
        pearl: "Bare exposed bone cannot be covered by local soft tissue; requires reconstructive flap coverage."
      };
    } else {
      return {
        title: "Gustilo-Anderson Type IIIc Open Fracture (Vascular Crisis)",
        indices: "Any Open Fracture Associated with ARTERIAL INJURY Requiring Vascular Repair",
        rx: "Emergency Vascular Shunt / Saphenous Vein Bypass + Bridging External Fixation",
        pearl: "Warm ischemia >6 hours causes irreversible neuromuscular damage; prioritize rapid revascularization."
      };
    }
  }, [selectedGustilo]);

  const currentNodes = useMemo(() => {
    return ORTHOPEDICS_LAB_NODES[activeMode] || ORTHOPEDICS_LAB_NODES.compartment;
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
            <Activity size={14} /> ORT-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "compartment" && "Acute Compartment Syndrome: The 6 'P's, Delta Pressure & Fasciotomy"}
            {activeMode === "openFractures" && "Open Fractures: Gustilo-Anderson Classification & Limb Salvage"}
            {activeMode === "pediatricHip" && "Pediatric Orthopedics: DDH (Pavlik), SCFE (In Situ Pinning) & Perthes"}
            {activeMode === "boneOncology" && "Musculoskeletal Oncology: Osteosarcoma, Ewing Sarcoma & Giant Cell Tumor"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Orthopedic Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Orthopedic Surgery Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Entity / Surgical Protocol: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-rose-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-rose-950 text-xs rounded border border-rose-700 text-rose-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Compartment Syndrome & Delta Pressure Simulator */}
          {activeMode === "compartment" && (
            <div className={styles.orthoCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Delta Pressure Manometry Calculator
                </span>
                <span className="text-[11px] text-slate-400">&Delta;P = Diastolic BP - Compartment Pressure</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Diastolic Blood Pressure:</span>
                    <span className="font-bold text-rose-300">{diastolicBp} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="110"
                    step="1"
                    value={diastolicBp}
                    onChange={(e) => setDiastolicBp(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Intracompartmental Pressure:</span>
                    <span className="font-bold text-rose-300">{compartmentPressure} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="75"
                    step="1"
                    value={compartmentPressure}
                    onChange={(e) => setCompartmentPressure(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>

              <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                isCompartmentSyndrome
                  ? "bg-red-950/80 border-red-500 text-red-200"
                  : "bg-emerald-950/80 border-emerald-500 text-emerald-200"
              }`}>
                <div>
                  <div className="font-bold text-sm">
                    Calculated Delta Pressure (&Delta;P): {deltaPressure} mmHg
                  </div>
                  <div className="text-[11px] mt-0.5">
                    {isCompartmentSyndrome
                      ? "🚨 CRITICAL ISCHEMIA: Emergent Dual-Incision 4-Compartment Leg Fasciotomy Indicated"
                      : "✅ Adequate Tissue Perfusion: Continue Serial Neurovascular Monitoring"}
                  </div>
                </div>
                <div className="text-right text-[10px] opacity-80">
                  Threshold: &Delta;P &le; 30 mmHg or Pressure &gt; 30 mmHg
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Open Fractures & Gustilo-Anderson */}
          {activeMode === "openFractures" && (
            <div className={styles.orthoCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Gustilo-Anderson Open Fracture Classification
                </span>
                <span className="text-[11px] text-slate-400">Wound Dimension &bull; Soft Tissue Loss &bull; Vascular Injury</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <button
                  onClick={() => setSelectedGustilo("t1")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGustilo === "t1"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Type I (&lt;1cm)
                </button>
                <button
                  onClick={() => setSelectedGustilo("t2")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGustilo === "t2"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Type II (1-10cm)
                </button>
                <button
                  onClick={() => setSelectedGustilo("t3a")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGustilo === "t3a"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Type IIIa (Covered)
                </button>
                <button
                  onClick={() => setSelectedGustilo("t3b")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGustilo === "t3b"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Type IIIb (Flap)
                </button>
                <button
                  onClick={() => setSelectedGustilo("t3c")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGustilo === "t3c"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Type IIIc (Arterial)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-rose-300">{gustiloDetails.title}</div>
                <div className="text-pink-400 font-bold mt-1">{gustiloDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-rose-400">Management:</strong> {gustiloDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Clinical Pearl:</strong> {gustiloDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Pediatric Orthopedics */}
          {activeMode === "pediatricHip" && (
            <div className={styles.orthoCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Pediatric Hip Pathologies &amp; Biomechanics
                </span>
                <span className="text-[11px] text-slate-400">DDH (Pavlik) &bull; SCFE (Klein Line Pinning) &bull; Perthes</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">DDH &amp; Pavlik Harness Principles</div>
                  <div className="text-slate-300 mt-1">Screening with Ortolani (relocation) and Barlow (dislocation) maneuvers in neonates. Dynamic ultrasound under 6 months. Pavlik harness maintains hips in 100-110 degrees of flexion and 40-60 degrees of abduction to stimulate normal concentric acetabular remodeling.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">SCFE &amp; Emergent In Situ Pinning</div>
                  <div className="text-slate-300 mt-1">Obese adolescent boys (11-14y) presenting with dull groin or referred medial knee pain and obligatory external rotation on flexion. Klein line fails to intersect the epiphysis. Treat immediately with emergent in situ single cannulated screw fixation; NEVER perform closed reduction.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Musculoskeletal Oncology */}
          {activeMode === "boneOncology" && (
            <div className={styles.orthoCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Primary Bone Tumors &amp; Radiographic Hallmarks
                </span>
                <span className="text-[11px] text-slate-400">Osteosarcoma &bull; Ewing Sarcoma &bull; Giant Cell Tumor &bull; Chondrosarcoma</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Osteosarcoma vs Ewing Sarcoma</div>
                  <div className="text-slate-300 mt-1">Osteosarcoma arises in the metaphysis (distal femur), shows 'sunburst' periosteal reaction and Codman's triangle, producing malignant osteoid (MAP chemo + wide resection). Ewing sarcoma arises in the diaphysis, shows 'onion skin' periosteal lamellation with t(11;22) translocation and CD99+ small round blue cells.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Giant Cell Tumor &amp; Chondrosarcoma</div>
                  <div className="text-slate-300 mt-1">Giant cell tumor occurs at the epiphysis of mature adults (20-40y) with 'soap-bubble' expansile lytic appearance (curettage + Denosumab RANKL inhibitor). Chondrosarcoma occurs in axial skeleton/pelvis of older adults with 'popcorn/ring-and-arc' calcifications (chemo/radiation-resistant; wide excision).</div>
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
                    <span className="text-rose-400 font-bold">Ortho:</span> {node.orthopedicProfile}
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

        {/* Right Side: High-Yield Clinical Orthopedic Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Ortho Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🦴 Orthopedic Entity / Fracture</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Biomechanics &amp; Pathophysiology</div>
            <div className="text-xs text-rose-300 font-semibold">{activeNode.orthopedicProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Imaging</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Orthopedic Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("compartment")}
          className={`${styles.modeTab} ${activeMode === "compartment" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Compartment Syndrome
        </button>
        <button
          onClick={() => setActiveMode("openFractures")}
          className={`${styles.modeTab} ${activeMode === "openFractures" ? styles.modeTabActive : ""}`}
        >
          🩹 2. Open Fractures
        </button>
        <button
          onClick={() => setActiveMode("pediatricHip")}
          className={`${styles.modeTab} ${activeMode === "pediatricHip" ? styles.modeTabActive : ""}`}
        >
          👶 3. Pediatric Hip
        </button>
        <button
          onClick={() => setActiveMode("boneOncology")}
          className={`${styles.modeTab} ${activeMode === "boneOncology" ? styles.modeTabActive : ""}`}
        >
          🛡️ 4. Bone Tumors
        </button>
      </div>
    </div>
  );
}
