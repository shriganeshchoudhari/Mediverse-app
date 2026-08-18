"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalEntAdvLabViewer.module.css";
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
  Volume2,
  Mic,
} from "lucide-react";

export type EntLabMode = "airway" | "vestibular" | "otology" | "headNeckOnc";

export interface EntLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  entProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const ENT_LAB_NODES: Record<EntLabMode, EntLabNode[]> = {
  airway: [
    {
      id: "ent-air-ludwig-angina",
      name: "Ludwig Angina Submandibular Phlegmon (Woody Induration, Tongue Elevation & Awake Tracheostomy)",
      category: "Airway Emergency",
      subType: "Bilateral Submandibular/Sublingual • 2nd/3rd Lower Molar • 'Woody' Neck • Awake Intubation",
      entProfile: "Rapidly progressive cellulitis/phlegmon of the floor of the mouth compromising the upper airway.",
      pathophysiologyMechanism: "Odontogenic infection penetrates thin lingual cortical bone below mylohyoid ridge into submandibular space.",
      clinicalHallmarks: "Rock-hard woody induration, elevated/protruded tongue, drooling, trismus, inspiratory stridor; awake fiberoptic intubation.",
      highYieldPearls: "Ludwig angina requires an immediate awake airway (fiberoptic or tracheostomy); blind intubation triggers fatal airway collapse."
    },
    {
      id: "ent-air-quinsy-peritonsillar",
      name: "Peritonsillar Quinsy Abscess (Uvular Contralateral Deviation & Needle Aspiration)",
      category: "Pharyngeal Emergency",
      subType: "Tonsillar Capsule / Pharyngeal Constrictor • 'Hot Potato Voice' • Uvular Deviation • Needle Aspiration",
      entProfile: "Suppurative collection between the palatine tonsil capsule and the superior pharyngeal constrictor muscle.",
      pathophysiologyMechanism: "Suppuration of Weber glands in the supratonsillar fossa spreading into the potential peritonsillar space.",
      clinicalHallmarks: "Severe unilateral sore throat, trismus, muffled voice, contralateral uvular deviation, superior pole palatal bulge; I&D.",
      highYieldPearls: "Peritonsillar abscess (quinsy) presents with trismus and contralateral uvular deviation; treated with needle aspiration/I&D."
    },
    {
      id: "ent-air-danger-space-mediastinitis",
      name: "Danger Space Retropharyngeal Spread (Descending Necrotizing Mediastinitis & Drainage)",
      category: "Deep Fascial Plane",
      subType: "Space 4 (Alar to Prevertebral Fascia) • Skull Base to Diaphragm • Descending Mediastinitis • Urgent Surgery",
      entProfile: "Gravitational tracking of deep cervical infection into the posterior mediastinum via the retrovisceral Danger Space.",
      pathophysiologyMechanism: "Loose areolar tissue offers zero anatomical resistance from skull base down to the posterior mediastinum and diaphragm.",
      clinicalHallmarks: "Prevertebral soft tissue widening on lateral neck radiograph (>7mm at C2, >14-22mm at C6), chest pain, dyspnea, septic shock.",
      highYieldPearls: "The 'Danger Space' extends from the skull base to the diaphragm, allowing retropharyngeal infections to cause lethal mediastinitis."
    },
    {
      id: "ent-air-lemierre-syndrome",
      name: "Lemierre Syndrome IJV Thrombophlebitis (Fusobacterium necrophorum & Septic Emboli)",
      category: "Vascular Sepsis",
      subType: "Fusobacterium necrophorum • Internal Jugular Vein Thrombosis • Cavitary Pulmonary Septic Emboli",
      entProfile: "Septic thrombophlebitis of the internal jugular vein secondary to an acute oropharyngeal/parapharyngeal infection.",
      pathophysiologyMechanism: "Anaerobic bacteremia triggers platelet aggregation and suppurative thrombophlebitis within the carotid sheath.",
      clinicalHallmarks: "Post-pharyngitis fever, tenderness along anterior sternocleidomastoid border, metastatic cavitary lung nodules on CT; IV Unasyn.",
      highYieldPearls: "Lemierre syndrome is post-anginal septic thrombophlebitis of the IJV caused by Fusobacterium necrophorum with septic lung emboli."
    }
  ],

  vestibular: [
    {
      id: "ent-ves-bppv-epley",
      name: "Benign Paroxysmal Positional Vertigo BPPV (Posterior Canal Canalithiasis & Epley Particle Repositioning)",
      category: "Peripheral Vertigo",
      subType: "Otoconia in Posterior Semicircular Canal • Dix-Hallpike Test • Geotropic Torsional Nystagmus • Epley Maneuver",
      entProfile: "Mechanical displacement of calcium carbonate otoconia crystals from utricular macula into semicircular canals.",
      pathophysiologyMechanism: "Gravitational movement of free-floating otoconial debris (canalithiasis) induces abnormal cupular deflection during head movement.",
      clinicalHallmarks: "Brief episodes of spinning vertigo (<1 minute) triggered by rolling over in bed; Dix-Hallpike produces latency and torsional nystagmus.",
      highYieldPearls: "BPPV is diagnosed by Dix-Hallpike (torsional geotropic nystagmus with latency) and cured by Epley canalith repositioning."
    },
    {
      id: "ent-ves-meniere-hydrops",
      name: "Ménière Endolymphatic Hydrops (Low-Frequency SNHL Fluctuations & Sodium Restriction)",
      category: "Endolymphatic Hydrops",
      subType: "Episodic Vertigo (20m-12h) • Fluctuating Low-Frequency SNHL • Roaring Tinnitus • Salt Restriction <2g/d",
      entProfile: "Idiopathic distension of the endolymphatic compartment (scala media) within the membranous inner ear labyrinth.",
      pathophysiologyMechanism: "Impaired endolymphatic sac resorption leads to microscopic membrane ruptures and toxic potassium depolarization of hair cells.",
      clinicalHallmarks: "Spontaneous episodic vertigo (2-4 hours), fluctuating low-frequency SNHL on audiogram, roaring tinnitus, aural fullness; HCTZ.",
      highYieldPearls: "Ménière disease presents with the classic tetrad of episodic vertigo, fluctuating low-frequency SNHL, tinnitus, and aural fullness."
    },
    {
      id: "ent-ves-acoustic-neuroma",
      name: "Vestibular Schwannoma Acoustic Neuroma (Cerebellopontine Angle Tumor & Gadolinium MRI)",
      category: "Retrocochlear Neoplasm",
      subType: "Schwann Cell Tumor of CN VIII • Internal Auditory Canal (IAC) • Asymmetric High-Frequency SNHL • Poor SDS",
      entProfile: "Benign, slow-growing neoplasm of the superior or inferior vestibular nerve at the cerebellopontine angle (CPA).",
      pathophysiologyMechanism: "Compression of the cochlear nerve produces disproportionately severe loss of speech discrimination relative to pure-tone loss.",
      clinicalHallmarks: "Unilateral progressive high-frequency SNHL, unilateral tinnitus, facial numbness (CN V); diagnostic gold standard is Gadolinium MRI.",
      highYieldPearls: "Unilateral progressive sensorineural hearing loss with poor speech discrimination is an acoustic neuroma until proven otherwise on MRI."
    },
    {
      id: "ent-ves-neuritis-labyrinthitis",
      name: "Acute Vestibular Neuritis (Post-Viral Neuropathy & Short-Term Vestibular Suppression)",
      category: "Acute Vestibulopathy",
      subType: "Sudden Severe Vertigo (2-5 Days) • Horizontal Unidirectional Nystagmus • Normal Hearing (No SNHL) • Meclizine",
      entProfile: "Acute unilateral loss of peripheral vestibular afferent tone, commonly following a viral upper respiratory infection.",
      pathophysiologyMechanism: "Inflammatory deafferentation of vestibular nerve fibers creates severe central vestibular tone asymmetry.",
      clinicalHallmarks: "Continuous debilitating vertigo, nausea, and horizontal nystagmus beating away from affected ear; hearing is normal (unlike labyrinthitis).",
      highYieldPearls: "Vestibular neuritis causes continuous severe vertigo for days with preserved hearing; labyrinthitis includes hearing loss."
    }
  ],

  otology: [
    {
      id: "ent-oto-cholesteatoma-attic",
      name: "Attic Cholesteatoma Keratin Pocket (Pars Flaccida Retraction & Tympanomastoidectomy)",
      category: "Destructive Otology",
      subType: "Pars Flaccida Retraction Pocket • White Keratin Debris • Foul Painless Otorrhea • Collagenase Osteolysis",
      entProfile: "Expansile, destructive keratinizing squamous epithelial cyst developing within the middle ear and mastoid cavity.",
      pathophysiologyMechanism: "Perimatrix osteoclasts and collagenases mediate enzymatic osteolysis of ossicles (incus), scutum, and tegmen tympani.",
      clinicalHallmarks: "Foul-smelling painless otorrhea, conductive hearing loss, attic retraction pocket on otoscopy; high-res temporal CT; surgery.",
      highYieldPearls: "Cholesteatoma is a destructive keratinizing lesion in the attic causing painless foul otorrhea and ossicular bone erosion."
    },
    {
      id: "ent-oto-labyrinthine-fistula",
      name: "Labyrinthine Fistula Erosion (Lateral Semicircular Canal Osteolysis & Hennebert Fistula Sign)",
      category: "Otologic Complication",
      subType: "Lateral Semicircular Canal Erosion • Hennebert Sign / Positive Fistula Test • Pneumatic Otoscopy Vertigo",
      entProfile: "Direct pathological communication between the middle ear air space and the inner ear membranous labyrinth.",
      pathophysiologyMechanism: "Cholesteatoma erodes the bony dome of the horizontal (lateral) canal, transmitting pressure waves directly to the cupula.",
      clinicalHallmarks: "Pneumatic otoscopy or tragal pressure produces immediate nystagmus and vertigo (positive fistula test); urgent mastoidectomy.",
      highYieldPearls: "A positive fistula test (nystagmus on pneumatic otoscopy) indicates cholesteatoma erosion into the lateral semicircular canal."
    },
    {
      id: "ent-oto-otosclerosis-carhart",
      name: "Otosclerosis Stapes Fixation (Carhart Notch 2000Hz Dip & Stapedotomy Piston)",
      category: "Otic Capsule Remodeling",
      subType: "Autosomal Dominant • Stapes Footplate Fixation at Oval Window • Carhart Notch at 2,000 Hz • Stapedotomy",
      entProfile: "Metabolic bone remodeling disorder of the otic capsule locking the stapes footplate and preventing sound transmission.",
      pathophysiologyMechanism: "Vascular spongiotic bone replaces lamellar bone at the fissula ante fenestram, fusing the annular ligament and stapes.",
      clinicalHallmarks: "Young female with progressive bilateral conductive hearing loss; Carhart's notch (dip in bone conduction at 2 kHz); stapedotomy.",
      highYieldPearls: "Otosclerosis presents with progressive conductive hearing loss, stapes footplate fixation, and a Carhart notch at 2,000 Hz."
    },
    {
      id: "ent-oto-tympanic-perforation",
      name: "Tympanic Membrane Perforation (Pars Tensa Central Defect & Fascia Graft Tympanoplasty)",
      category: "Middle Ear Reconstruction",
      subType: "Pars Tensa Central Defect • Conductive Hearing Loss • Water Precautions • Underlay Tympanoplasty",
      entProfile: "Loss of integrity of the three-layered tympanic membrane secondary to infection, barotrauma, or acoustic blast injury.",
      pathophysiologyMechanism: "Reduction in surface area of the vibrating drum reduces hydraulic areal transformation ratio from drum to oval window.",
      clinicalHallmarks: "Conductive hearing loss proportional to defect size; keep ear strictly dry; treated surgically with temporalis fascia tympanoplasty.",
      highYieldPearls: "Central pars tensa perforations cause conductive hearing loss and are repaired with temporalis fascia underlay tympanoplasty."
    }
  ],

  headNeckOnc: [
    {
      id: "ent-onc-hpv-opscc-p16",
      name: "HPV-16 Oropharyngeal OPSCC (Strong p16 Overexpression & Chemoradiation Sensitivity)",
      category: "Viral Oncology",
      subType: "High-Risk HPV-16 • Strong p16 IHC Positivity • Palatine / Lingual Tonsils • Level II Cystic Neck Mass",
      entProfile: "Malignant squamous cell transformation of tonsillar crypt lymphoepithelium driven by oncogenic HPV-16.",
      pathophysiologyMechanism: "Viral oncoprotein E6 ubiquitinates p53, while E7 binds and inactivates retinoblastoma protein (pRb), releasing E2F.",
      clinicalHallmarks: "Younger non-smokers with painless cystic Level II neck node; exquisitely radiosensitive; treated with Cisplatin + IMRT or TORS.",
      highYieldPearls: "HPV-positive oropharyngeal cancer overexpresses p16, arises in tonsils/base of tongue, and has a significantly superior prognosis."
    },
    {
      id: "ent-onc-glottic-larynx-ca",
      name: "Glottic Laryngeal Carcinoma (Early True Vocal Cord Hoarseness & Laser Microsurgery)",
      category: "Laryngeal Malignancy",
      subType: "True Vocal Cords • Tobacco Smoking • Early Persistent Hoarseness • Sparse Lymphatic Metastasis",
      entProfile: "Squamous cell carcinoma arising from the stratified squamous epithelium of the true vocal cords (anterior 2/3).",
      pathophysiologyMechanism: "Direct carcinogen exposure from tobacco smoke causes dysplasia and invasive carcinoma with minimal lymphatics in Reinke space.",
      clinicalHallmarks: "Presents early with hoarseness lasting >3-4 weeks; high cure rate with Transoral Laser Microsurgery (TLM) or definitive radiotherapy.",
      highYieldPearls: "Glottic laryngeal cancer presents early with hoarseness and has a low rate of nodal metastasis due to sparse vocal cord lymphatics."
    },
    {
      id: "ent-onc-radical-neck-dissection",
      name: "Comprehensive Radical Neck Dissection (Levels I-V with Sacrificed CN XI, IJV & SCM)",
      category: "Cervical Lymphadenectomy",
      subType: "Levels I–V Lymph Nodes • Sacrifices CN XI (Trapezius Drop), IJV & SCM Muscle • Historic Gold Standard",
      entProfile: "En bloc surgical eradication of all cervical lymph node levels (I through V) for advanced metastatic head and neck cancer.",
      pathophysiologyMechanism: "Complete clearance of all lymphatic channels and fibrofatty tissue investing the major neurovascular sheath of the neck.",
      clinicalHallmarks: "Sacrifice of spinal accessory nerve (CN XI) leads to trapezius denervation, shoulder drop, and restricted abduction above 90 degrees.",
      highYieldPearls: "Radical neck dissection removes lymph node levels I-V and sacrifices 3 non-lymphatic structures: CN XI, IJV, and SCM."
    },
    {
      id: "ent-onc-mrnd-functional-preservation",
      name: "Modified Radical Neck Dissection MRND (Functional Preservation Types I-III & Spinal Accessory Sparing)",
      category: "Organ Preservation",
      subType: "Levels I–V Removal • Type I (Sparing CN XI) • Type II (Sparing CN XI + IJV) • Type III / Functional (Sparing All 3)",
      entProfile: "Cervical lymphadenectomy removing all node levels (I–V) while selectively preserving non-lymphatic structures.",
      pathophysiologyMechanism: "Preservation of CN XI preserves trapezius motor innervation and shoulder girdle biomechanics with equivalent oncologic cure.",
      clinicalHallmarks: "Type III MRND (Functional Neck Dissection) preserves CN XI, IJV, and SCM; standard of care for clinically node-positive necks.",
      highYieldPearls: "Type III Modified Radical Neck Dissection preserves all 3 structures (CN XI, IJV, SCM) while removing all lymph nodes (I-V)."
    }
  ]
};

interface ClinicalEntAdvLabViewerProps {
  initialMode?: EntLabMode;
  height?: string;
  onNodeSelect?: (node: EntLabNode) => void;
}

export default function ClinicalEntAdvLabViewer({
  initialMode = "airway",
  height = "560px",
  onNodeSelect,
}: ClinicalEntAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<EntLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Audiometry Simulator State
  const [selectedVertigo, setSelectedVertigo] = useState<"bppv" | "meniere" | "neuroma" | "neuritis">("meniere");

  // Neck Dissection Selector State
  const [selectedDissection, setSelectedDissection] = useState<"rnd" | "mrnd1" | "mrnd2" | "mrnd3">("mrnd3");

  const vertigoDetails = useMemo(() => {
    if (selectedVertigo === "bppv") {
      return {
        title: "Benign Paroxysmal Positional Vertigo (BPPV)",
        indices: "Brief Seconds (<1 min) • Triggered by Head Turn • Posterior Canal Canalithiasis",
        rx: "Diagnostic: Dix-Hallpike Test -> Therapeutic: Epley Canalith Repositioning Maneuver",
        pearl: "Dix-Hallpike produces torsional geotropic upbeating nystagmus with latency and fatigability."
      };
    } else if (selectedVertigo === "meniere") {
      return {
        title: "Ménière Disease (Endolymphatic Hydrops)",
        indices: "Episodic (20 min - 12 hours) • Fluctuating Low-Frequency SNHL • Roaring Tinnitus • Fullness",
        rx: "Dietary salt restriction (<2,000 mg/day) + Hydrochlorothiazide-Triamterene + Intratympanic Steroids",
        pearl: "Classic tetrad: episodic vertigo, fluctuating low-frequency SNHL, roaring tinnitus, and aural fullness."
      };
    } else if (selectedVertigo === "neuroma") {
      return {
        title: "Vestibular Schwannoma (Acoustic Neuroma)",
        indices: "Unilateral Progressive High-Frequency SNHL • Disproportionately Poor Speech Discrimination",
        rx: "Diagnostic Gold Standard: Gadolinium-Enhanced Brain/IAC MRI -> Gamma Knife / Microsurgery",
        pearl: "Unilateral progressive SNHL is a vestibular schwannoma until proven otherwise on MRI."
      };
    } else {
      return {
        title: "Acute Vestibular Neuritis",
        indices: "Continuous Severe Vertigo (2-5 Days) • Horizontal Unidirectional Nystagmus • NORMAL Hearing",
        rx: "Short-term vestibular suppressants (Meclizine <=48 hours) + Vestibular Physical Therapy Rehab",
        pearl: "Vestibular neuritis spares hearing; if acute hearing loss is present, the diagnosis is labyrinthitis."
      };
    }
  }, [selectedVertigo]);

  const dissectionDetails = useMemo(() => {
    if (selectedDissection === "rnd") {
      return {
        title: "Comprehensive Radical Neck Dissection (RND)",
        indices: "Levels I–V Nodes Removed • Sacrifices ALL 3: CN XI (Spinal Accessory), IJV, and SCM Muscle",
        rx: "Used for massive extranodal extension invading carotid sheath and muscle; causes severe shoulder drop",
        pearl: "Sacrifice of CN XI causes trapezius denervation and severe loss of shoulder abduction above 90 degrees."
      };
    } else if (selectedDissection === "mrnd1") {
      return {
        title: "Modified Radical Neck Dissection Type I",
        indices: "Levels I–V Nodes Removed • Preserves Spinal Accessory Nerve (CN XI) • Sacrifices IJV and SCM",
        rx: "Maintains trapezius shoulder function while achieving complete lymphatic clearance",
        pearl: "Type I MRND preserves the spinal accessory nerve (CN XI)."
      };
    } else if (selectedDissection === "mrnd2") {
      return {
        title: "Modified Radical Neck Dissection Type II",
        indices: "Levels I–V Nodes Removed • Preserves CN XI and Internal Jugular Vein (IJV) • Sacrifices SCM",
        rx: "Preserves cerebral venous outflow and shoulder elevation",
        pearl: "Type II MRND preserves both CN XI and the internal jugular vein."
      };
    } else {
      return {
        title: "Modified Radical Neck Dissection Type III (Functional Neck Dissection)",
        indices: "Levels I–V Nodes Removed • PRESERVES ALL 3: CN XI, Internal Jugular Vein (IJV), and SCM",
        rx: "Standard of care for clinically node-positive head and neck squamous cell carcinoma without invasion",
        pearl: "Type III Functional Neck Dissection preserves CN XI, IJV, and SCM with identical oncologic survival."
      };
    }
  }, [selectedDissection]);

  const currentNodes = useMemo(() => {
    return ENT_LAB_NODES[activeMode] || ENT_LAB_NODES.airway;
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
            <Volume2 size={14} /> ENT-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "airway" && "Deep Neck Space Infections: Ludwig Angina, Quinsy & Danger Space Mediastinitis"}
            {activeMode === "vestibular" && "Vestibular Pathology & Neurotology: BPPV (Epley), Ménière Disease & Neuroma"}
            {activeMode === "otology" && "Otology & Middle Ear Disorders: Cholesteatoma (Mastoidectomy) & Otosclerosis"}
            {activeMode === "headNeckOnc" && "Head & Neck Surgical Oncology: HPV-16 Oropharyngeal & Neck Dissections (I-VI)"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Otolaryngology Diagnostic Quiz"}
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
                  Otolaryngology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify ENT Clinical Entity / Surgical Step: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Deep Neck Infections & Airway */}
          {activeMode === "airway" && (
            <div className={styles.entCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Deep Neck Space &amp; Airway Emergency Protocols
                </span>
                <span className="text-[11px] text-slate-400">Ludwig &bull; Quinsy &bull; Danger Space (Mediastinitis) &bull; Lemierre</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Ludwig Angina &amp; Airway Mandate</div>
                  <div className="text-slate-300 mt-1">Originates from 2nd/3rd lower molar infection, causing bilateral submandibular and sublingual woody induration with tongue elevation. Blind intubation is strictly contraindicated due to risk of fatal airway collapse; secure airway via awake fiberoptic intubation or awake tracheostomy under local anesthesia.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Quinsy &amp; Danger Space Spread</div>
                  <div className="text-slate-300 mt-1">Peritonsillar abscess presents with trismus, hot potato voice, and contralateral uvular deviation (needle aspiration/I&D). Retropharyngeal abscess tracks through the Danger Space (between alar and prevertebral fascia) down into the posterior mediastinum, causing descending necrotizing mediastinitis.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Vestibular & Neurotology */}
          {activeMode === "vestibular" && (
            <div className={styles.entCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Vestibular Pathology &amp; Neurotology Profiler
                </span>
                <span className="text-[11px] text-slate-400">BPPV &bull; Ménière &bull; Acoustic Neuroma &bull; Vestibular Neuritis</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedVertigo("bppv")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedVertigo === "bppv"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔄 BPPV (Dix-Hallpike)
                </button>
                <button
                  onClick={() => setSelectedVertigo("meniere")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedVertigo === "meniere"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌊 Ménière (Hydrops)
                </button>
                <button
                  onClick={() => setSelectedVertigo("neuroma")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedVertigo === "neuroma"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧠 Acoustic Neuroma
                </button>
                <button
                  onClick={() => setSelectedVertigo("neuritis")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedVertigo === "neuritis"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Vestibular Neuritis
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-emerald-300">{vertigoDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{vertigoDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-emerald-400">Action:</strong> {vertigoDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Neurotology Pearl:</strong> {vertigoDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Otology & Middle Ear Disorders */}
          {activeMode === "otology" && (
            <div className={styles.entCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 size={14} /> Otology &amp; Middle Ear Reconstructive Surgery
                </span>
                <span className="text-[11px] text-slate-400">Cholesteatoma &bull; Labyrinthine Fistula &bull; Otosclerosis (Carhart)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Attic Cholesteatoma &amp; Fistula Test</div>
                  <div className="text-slate-300 mt-1">Presents with painless foul otorrhea, conductive hearing loss, and a white keratin pocket in pars flaccida. Enzymatic osteolysis of the lateral semicircular canal causes a positive fistula test (vertigo on pneumatic otoscopy). Requires Tympanomastoidectomy (CWU vs CWD).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Otosclerosis &amp; Carhart's Notch</div>
                  <div className="text-slate-300 mt-1">Autosomal dominant otic capsule remodeling causing stapes footplate fixation at the oval window in young adults. Audiometry reveals an air-bone gap with Carhart's notch (dip in bone conduction at 2,000 Hz). Managed surgically with Stapedotomy and piston prosthesis.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Head & Neck Surgical Oncology */}
          {activeMode === "headNeckOnc" && (
            <div className={styles.entCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Head &amp; Neck Oncology &amp; Neck Dissections (I-VI)
                </span>
                <span className="text-[11px] text-slate-400">HPV-16 OPSCC &bull; Glottic Cancer &bull; Radical vs MRND Types I-III</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedDissection("rnd")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDissection === "rnd"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Radical (RND)
                </button>
                <button
                  onClick={() => setSelectedDissection("mrnd1")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDissection === "mrnd1"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  MRND Type I (Spares XI)
                </button>
                <button
                  onClick={() => setSelectedDissection("mrnd2")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDissection === "mrnd2"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  MRND Type II (+ IJV)
                </button>
                <button
                  onClick={() => setSelectedDissection("mrnd3")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDissection === "mrnd3"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  MRND Type III (Functional)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-emerald-300">{dissectionDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{dissectionDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-emerald-400">Significance:</strong> {dissectionDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Oncologic Rule:</strong> {dissectionDetails.pearl}</div>
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
                    <span className="text-emerald-400 font-bold">ENT:</span> {node.entProfile}
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

        {/* Right Side: High-Yield Clinical Otolaryngology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              ENT Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>👂 Otolaryngology Entity / Pathology</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Head &amp; Neck Surgical Anatomy</div>
            <div className="text-xs text-emerald-300 font-semibold">{activeNode.entProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard ENT Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("airway")}
          className={`${styles.modeTab} ${activeMode === "airway" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Deep Neck Infections
        </button>
        <button
          onClick={() => setActiveMode("vestibular")}
          className={`${styles.modeTab} ${activeMode === "vestibular" ? styles.modeTabActive : ""}`}
        >
          🔄 2. Vestibular &amp; Audiology
        </button>
        <button
          onClick={() => setActiveMode("otology")}
          className={`${styles.modeTab} ${activeMode === "otology" ? styles.modeTabActive : ""}`}
        >
          👂 3. Cholesteatoma &amp; Otology
        </button>
        <button
          onClick={() => setActiveMode("headNeckOnc")}
          className={`${styles.modeTab} ${activeMode === "headNeckOnc" ? styles.modeTabActive : ""}`}
        >
          🛡️ 4. Head &amp; Neck Oncology
        </button>
      </div>
    </div>
  );
}
