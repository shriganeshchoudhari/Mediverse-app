"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalAnatomy2LabViewer.module.css";
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

export type Anatomy2LabMode = "cranial" | "spaces" | "cavernous" | "embryology";

export interface Anatomy2LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  anatProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const ANATOMY2_LAB_NODES: Record<Anatomy2LabMode, Anatomy2LabNode[]> = {
  cranial: [
    {
      id: "anat2-cr-wallenberg-pica-ambiguus",
      name: "Lateral Medullary Wallenberg (PICA Occlusion, Nucleus Ambiguus & Dysphagia)",
      category: "Brainstem Stroke",
      subType: "PICA / Vertebral Artery • Nucleus Ambiguus (CN IX/X) • Spinal Trigeminal V • Horner Syndrome",
      anatProfile: "Infarction of the posterolateral medulla causing classic crossed sensory and cranial nerve deficits.",
      pathophysiologyMechanism: "Ischemia to nucleus ambiguus halts SVE branchial motor innervation to palatal and pharyngeal constrictors.",
      clinicalHallmarks: "Loss of gag reflex, dysphagia, hoarseness, ipsilateral facial pain/temp loss, contralateral body pain/temp loss; Horner syndrome.",
      highYieldPearls: "Wallenberg syndrome (PICA occlusion) impairs nucleus ambiguus (dysphagia/hoarseness) with crossed sensory deficit."
    },
    {
      id: "anat2-cr-dejerine-asa-hypoglossal",
      name: "Medial Medullary Dejerine (Anterior Spinal Artery & Hypoglossal Deviation)",
      category: "Medullary Infarction",
      subType: "Anterior Spinal Artery (ASA) • Hypoglossal Nucleus (CN XII) • Corticospinal Tract • Medial Lemniscus",
      anatProfile: "Infarction of the anteromedial medulla affecting the hypoglossal nerve and descending pyramidal motor pathways.",
      pathophysiologyMechanism: "Ischemia of the CN XII nucleus causes flaccid paralysis of ipsilateral genioglossus, causing tongue deviation to the lesion side.",
      clinicalHallmarks: "Tongue deviates toward the side of the lesion (ipsilateral XII palsy) + contralateral hemiparesis and dorsal column loss.",
      highYieldPearls: "Medial medullary syndrome (ASA occlusion) causes tongue deviation to the side of the lesion plus contralateral hemiplegia."
    },
    {
      id: "anat2-cr-weber-pca-oculomotor",
      name: "Medial Midbrain Weber Syndrome (Posterior Cerebral Artery & Oculomotor Nerve Palsy)",
      category: "Mesencephalic Stroke",
      subType: "PCA Paramedian Branches • Oculomotor Fascicles (CN III) • Cerebral Peduncle • Ptosis & Mydriasis",
      anatProfile: "Vascular lesion of the medial ventral midbrain involving exiting CN III fibers and the crus cerebri.",
      pathophysiologyMechanism: "Interruption of parasympathetic and somatic motor fibers of CN III combined with upper motor neuron corticospinal tract.",
      clinicalHallmarks: "Ipsilateral ptosis, dilated fixed pupil, 'down and out' gaze + contralateral spastic hemiparesis of limbs and lower face.",
      highYieldPearls: "Weber syndrome (PCA midbrain branch) causes ipsilateral CN III palsy (down-and-out, dilated pupil) + contralateral hemiplegia."
    },
    {
      id: "anat2-cr-marie-foix-aica-facial",
      name: "Lateral Pontine Marie-Foix (AICA Stroke, Facial Droop & Sensorineural Deafness)",
      category: "Pontine Infarction",
      subType: "AICA Occlusion • Facial Nucleus (CN VII) • Vestibulocochlear (CN VIII) • Spinal V • LMN Facial Palsy",
      anatProfile: "Ischemic stroke of the dorsolateral caudal pons affecting the facial, cochlear, and vestibular nuclei.",
      pathophysiologyMechanism: "Infarction of the facial motor nucleus causes complete lower motor neuron paralysis of the ipsilateral face.",
      clinicalHallmarks: "Ipsilateral LMN facial droop, sensorineural hearing loss, vertigo, nystagmus + contralateral spinothalamic loss.",
      highYieldPearls: "Lateral pontine syndrome (AICA occlusion) involves the facial motor nucleus (CN VII droop) and cochlear nucleus (deafness)."
    }
  ],

  spaces: [
    {
      id: "anat2-sp-danger-space-mediastinitis",
      name: "Retropharyngeal Danger Space (Alar-Prevertebral Plane & Descending Mediastinitis)",
      category: "Deep Fascial Space",
      subType: "Between Alar & Prevertebral Fascia • Extends Skull Base to T1-T4 Posterior Mediastinum • Fatal Sepsis",
      anatProfile: "Continuous fascial conduit providing an unobstructed highway for suppurative head/neck infections into the thorax.",
      pathophysiologyMechanism: "Lack of anatomical compartmental barriers allows rapid gravitational spread of anaerobic odontogenic/pharyngeal bacteria.",
      clinicalHallmarks: "Severe neck pain, odynophagia, high fever, widened mediastinum on chest radiography, pleural effusion, septic shock.",
      highYieldPearls: "The 'danger space' lies between alar and prevertebral fascia, extending directly into the posterior mediastinum."
    },
    {
      id: "anat2-sp-ludwig-angina-submandibular",
      name: "Submandibular Space Ludwig Angina (Mylohyoid Ridge, Lingual Elevation & Airway Threat)",
      category: "Odontogenic Emergency",
      subType: "2nd/3rd Mandibular Molars • Sublingual + Submylohyoid Spaces • Massive Tongue Elevation • Brawny Edema",
      anatProfile: "Rapidly spreading bilateral gangrenous cellulitis of the submandibular, sublingual, and submental compartments.",
      pathophysiologyMechanism: "Molar root apices penetrate below the mylohyoid attachment, discharging oral flora directly into deep submandibular tissue.",
      clinicalHallmarks: "Brawny submandibular induration, severe tongue elevation, stridor, drooling; requires urgent awake fiberoptic/surgical airway.",
      highYieldPearls: "Ludwig angina is a bilateral submandibular cellulitis from mandibular molars that forces the tongue upward to obstruct the airway."
    },
    {
      id: "anat2-sp-pterygopalatine-fossa-gateways",
      name: "Pterygopalatine Fossa Gateways (Foramen Rotundum V2, Sphenopalatine Artery & Vidian Canal)",
      category: "Skull Base Hub",
      subType: "Foramen Rotundum (V2) • Pterygomaxillary Fissure • Sphenopalatine Foramen (Epistaxis) • Vidian Nerve",
      anatProfile: "Pyramidal space behind the maxilla serving as a central neurovascular routing junction between orbit, nose, and middle fossa.",
      pathophysiologyMechanism: "Transmits maxillary artery branches and parasympathetic secretomotor fibers to the lacrimal and nasal glands.",
      clinicalHallmarks: "Sphenopalatine artery ligation is performed here for posterior epistaxis; V2 neuralgia triggers facial paroxysmal pain.",
      highYieldPearls: "Pterygopalatine fossa connects to middle cranial fossa via foramen rotundum (V2) and to nasal cavity via sphenopalatine foramen."
    },
    {
      id: "anat2-sp-carotid-sheath-lemierre",
      name: "Carotid Sheath Conduit (Internal Jugular Vein, Carotid Artery & Lemierre Thrombophlebitis)",
      category: "Vascular Sheath",
      subType: "Common/Internal Carotid • Internal Jugular Vein • Vagus Nerve (CN X) • Deep Cervical Lymph Nodes",
      anatProfile: "Fibrous condensation enclosing the primary vertical neurovascular bundle of the neck from base of skull to root of neck.",
      pathophysiologyMechanism: "Oropharyngeal Fusobacterium necrophorum infection spreads to the parapharyngeal space, causing suppurative IJV septic thrombophlebitis.",
      clinicalHallmarks: "Tender anterior cervical cord, high fever, septic pulmonary emboli with cavitary lung lesions on CT; IV Ampicillin-Sulbactam.",
      highYieldPearls: "Carotid sheath contains CCA/ICA, IJV, and Vagus nerve (CN X); Lemierre syndrome causes septic thrombophlebitis of the IJV."
    }
  ],

  cavernous: [
    {
      id: "anat2-cav-cavernous-sinus-cst-cn6",
      name: "Cavernous Sinus Neurovascular Axis (Free Lumen CN VI & Lateral Wall III/IV/V1/V2 Infiltration)",
      category: "Dural Venous Sinus",
      subType: "Center: ICA + CN VI • Lateral Wall: CN III, IV, V1, V2 • Early Lateral Rectus Palsy • Total Ophthalmoplegia",
      anatProfile: "Trabeculated venous space on either side of the sella turcica communicating with orbital, facial, and cerebral veins.",
      pathophysiologyMechanism: "Septic thrombosis compresses the centrally positioned abducens nerve first, followed by lateral wall cranial nerves.",
      clinicalHallmarks: "Early failure of abduction (CN VI), rapidly followed by complete ophthalmoplegia (III, IV), ptosis, fixed pupil, midface anesthesia.",
      highYieldPearls: "CN VI is the only cranial nerve traveling freely inside the cavernous sinus lumen (most vulnerable to septic thrombosis)."
    },
    {
      id: "anat2-cav-danger-triangle-face-veins",
      name: "Facial Danger Area & Ophthalmic Veins (Valveless Retrograde Venous Embolization)",
      category: "Venous Anastomosis",
      subType: "Nasolabial Danger Area • Facial Vein to Superior/Inferior Ophthalmic Veins • Valveless Venous Flow",
      anatProfile: "Superficial midfacial venous territory lacking valves that permits bidirectional and retrograde venous blood flow.",
      pathophysiologyMechanism: "Furuncle squeezing drives infected bacterial emboli backward through the superior ophthalmic vein into the cavernous sinus.",
      clinicalHallmarks: "Periorbital swelling, chemosis, fever, papilledema, bilateral progressive ophthalmoplegia; IV Vancomycin + Ceftriaxone.",
      highYieldPearls: "Infections in the facial danger triangle spread to the cavernous sinus via valveless ophthalmic veins."
    },
    {
      id: "anat2-cav-middle-ear-ossicles-chain",
      name: "Middle Ear Ossicular Mechanics (Malleus-Incus-Stapes Acoustic Impedance Matching)",
      category: "Acoustic Transmission",
      subType: "Tympanic Membrane • Malleus • Incus • Stapes Footplate at Oval Window • Tegmen Tympani Roof",
      anatProfile: "Air-filled tympanic cavity housing the ossicular chain that transfers acoustic energy from air to liquid perilymph.",
      pathophysiologyMechanism: "Area ratio of tympanic membrane to stapes footplate (17:1) plus ossicular lever arm provides ~22-fold pressure gain.",
      clinicalHallmarks: "Otosclerosis causes stapes fixation with conductive hearing loss (Carhart notch on audiogram); Tegmen tympani breach causes abscess.",
      highYieldPearls: "The stapes footplate inserts into the oval window; the tegmen tympani separates the middle ear from the temporal lobe."
    },
    {
      id: "anat2-cav-otic-inner-ear-labyrinth",
      name: "Otic Bony-Membranous Labyrinth (Perilymphatic Scala Vestibuli & Endolymphatic Organ of Corti)",
      category: "Auditory & Vestibular",
      subType: "Cochlea • Semicircular Canals • Scala Tympani / Vestibuli (Perilymph) • Scala Media (Endolymph K+)",
      anatProfile: "Fluid-filled sensory organ inside the petrous temporal bone mediating auditory transduction and balance.",
      pathophysiologyMechanism: "Endolymph in scala media contains high potassium (K+) secreted by the stria vascularis, driving hair cell depolarization.",
      clinicalHallmarks: "Ménière disease involves endolymphatic hydrops (vertigo, tinnitus, low-frequency sensorineural hearing loss); Gentamicin toxicity.",
      highYieldPearls: "Endolymph (high K+) fills the scala media; perilymph (high Na+) fills the scala vestibuli and scala tympani."
    }
  ],

  embryology: [
    {
      id: "anat2-emb-pharyngeal-arches-mesoderm",
      name: "Pharyngeal Arch Mesodermal Craniofacial Axis (1st Arch Mandibular Meckel & 2nd Arch Hyoid Reichert)",
      category: "Pharyngeal Apparatus",
      subType: "1st Arch: CN V3, Mastication, Malleus/Incus • 2nd Arch: CN VII, Facial Expression, Stapes/Styloid",
      anatProfile: "Embryonic mesenchymal bars containing cranial nerves, aortic arch arteries, and skeletal precursors.",
      pathophysiologyMechanism: "Defective neural crest migration into the 1st arch results in bilateral micrognathia and zygomatic hypoplasia.",
      clinicalHallmarks: "Treacher Collins syndrome: downward-slanting palpebral fissures, micrognathia, conductive deafness, cleft palate.",
      highYieldPearls: "1st arch yields CN V3, muscles of mastication, malleus, incus; 2nd arch yields CN VII, facial muscles, stapes, styloid."
    },
    {
      id: "anat2-emb-pharyngeal-pouches-digeorge",
      name: "Endodermal Pouch Immunodevelopmental Axis (3rd/4th Pouch Thymic & Parathyroid Differentiation DiGeorge)",
      category: "Branchial Pouches",
      subType: "3rd Pouch: Inferior Parathyroids + THYMUS • 4th Pouch: Superior Parathyroids • 22q11.2 Deletion",
      anatProfile: "Internal endodermal outpocketings giving rise to critical endocrine and lymphoid immunological organs.",
      pathophysiologyMechanism: "Failure of 3rd and 4th pouch differentiation leads to congenital athymia and absence of parathyroid tissue.",
      clinicalHallmarks: "DiGeorge syndrome: severe neonatal hypocalcemic tetany, profound T-cell deficiency, absent thymic shadow, cleft palate, truncus arteriosus.",
      highYieldPearls: "3rd pouch forms the thymus and inferior parathyroids; failure causes DiGeorge syndrome (absent T-cells, hypocalcemia)."
    },
    {
      id: "anat2-emb-branchial-cleft-vs-thyroglossal",
      name: "Branchial Cleft vs Thyroglossal Duct (Lateral SCM Remnants vs Midline Foramen Cecum Descent)",
      category: "Congenital Neck Masses",
      subType: "Branchial Cyst: Lateral SCM Border • Thyroglossal Cyst: Midline, Elevates with Tongue Protrusion",
      anatProfile: "Differential diagnostic anatomy of persistent embryonic cervical sinuses versus thyroid migration tracts.",
      pathophysiologyMechanism: "Incomplete obliteration of the 2nd pharyngeal cleft forms a lateral cyst; persistent thyroglossal tract leaves a midline cyst.",
      clinicalHallmarks: "Thyroglossal cyst is midline and moves upward with swallowing and tongue protrusion; Sistrunk excision removes hyoid body.",
      highYieldPearls: "Thyroglossal duct cyst is MIDLINE and elevates with tongue protrusion; Branchial cleft cyst is LATERAL along anterior SCM."
    },
    {
      id: "anat2-emb-craniofacial-dysostosis-complexes",
      name: "Craniofacial Dysostosis Complexes (Neural Crest Migration Treacher Collins & Pierre Robin)",
      category: "Embryonic Dysmorphology",
      subType: "Treacher Collins (TCOF1 / 1st Arch) • Pierre Robin Sequence (Micrognathia -> Glossoptosis -> Cleft Palate)",
      anatProfile: "Syndromic craniofacial deformities resulting from abnormal pharyngeal arch development and neural crest apoptosis.",
      pathophysiologyMechanism: "Primary mandibular hypoplasia prevents normal caudal descent of the tongue, physically blocking palatal shelf fusion.",
      clinicalHallmarks: "Pierre Robin sequence: micrognathia, glossoptosis causing acute neonatal airway obstruction, and U-shaped cleft palate.",
      highYieldPearls: "Pierre Robin triad: micrognathia, glossoptosis, and secondary cleft palate; caused by mechanical failure of palatal shelf closure."
    }
  ]
};

interface ClinicalAnatomy2LabViewerProps {
  initialMode?: Anatomy2LabMode;
  height?: string;
  onNodeSelect?: (node: Anatomy2LabNode) => void;
}

export default function ClinicalAnatomy2LabViewer({
  initialMode = "cranial",
  height = "560px",
  onNodeSelect,
}: ClinicalAnatomy2LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Anatomy2LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return ANATOMY2_LAB_NODES[activeMode] || ANATOMY2_LAB_NODES.cranial;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Anatomy2LabNode) => {
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
            <Brain size={14} /> ANAT-102
          </span>
          <span className={styles.titleText}>
            {activeMode === "cranial" && "Cranial Nerves (I-XII) & Brainstem Stroke Syndromes: Wallenberg, Weber & Dejerine"}
            {activeMode === "spaces" && "Deep Cervical Fascia & Spaces: Danger Space, Ludwig Angina & Infratemporal Fossa"}
            {activeMode === "cavernous" && "Orbit, Cavernous Sinus & Otic Labyrinth: CST (CN VI) & Middle Ear Mechanics"}
            {activeMode === "embryology" && "Clinical Embryology: Pharyngeal Arches (1-6), Pouches (1-4), Clefts & DiGeorge"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Anatomy Diagnostic Quiz"}
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
                  Anatomy Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Anatomical Structure / Syndrome: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Brainstem Stroke Syndromes */}
          {activeMode === "cranial" && (
            <div className={styles.anatCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Brainstem Cross-Sectional Stroke Localization Matrix
                </span>
                <span className="text-[11px] text-slate-400">PICA (Wallenberg) &bull; ASA (Dejerine) &bull; PCA (Weber) &bull; AICA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Lateral Medullary (Wallenberg / PICA)</div>
                  <div className="text-slate-300 mt-1">Nucleus ambiguus (CN IX/X) loss of gag, dysphagia, hoarseness. Spinal V nucleus causes ipsilateral facial pain/temp loss. Spinothalamic tract causes contralateral body pain/temp loss. Horner syndrome + vertigo/ataxia. Corticospinal tract is spared.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Medial Medullary (Dejerine / ASA)</div>
                  <div className="text-slate-300 mt-1">Hypoglossal nucleus (CN XII) causes tongue deviation to the side of the lesion (ipsilateral XII palsy). Pyramidal corticospinal tract causes contralateral spastic hemiparesis. Medial lemniscus causes contralateral loss of proprioception/vibration.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Deep Cervical Fascial Spaces */}
          {activeMode === "spaces" && (
            <div className={styles.anatCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} /> Cervical Fascial Planes &amp; Descending Infection Pathways
                </span>
                <span className="text-[11px] text-slate-400">Danger Space &bull; Ludwig Angina &bull; Pterygopalatine Fossa</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Retropharyngeal Danger Space</div>
                  <div className="text-slate-300 mt-1">Lies between the alar fascia anteriorly and prevertebral fascia posteriorly. Extends uninterrupted from the skull base all the way into the posterior mediastinum (T1-T4), enabling fatal descending necrotizing mediastinitis.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Submandibular Space (Ludwig Angina)</div>
                  <div className="text-slate-300 mt-1">Mandibular 2nd/3rd molar roots penetrate below the mylohyoid ridge into the submandibular/sublingual space. Bilateral infection causes brawny submandibular swelling and massive posterosuperior tongue elevation, triggering airway obstruction.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Cavernous Sinus & Otic Anatomy */}
          {activeMode === "cavernous" && (
            <div className={styles.anatCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crosshair size={14} /> Cavernous Sinus Neurovascular Architecture &amp; CST
                </span>
                <span className="text-[11px] text-slate-400">Center: ICA + CN VI &bull; Lateral Wall: CN III, IV, V1, V2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Cavernous Sinus Lumen vs Wall</div>
                  <div className="text-slate-300 mt-1">CN VI (Abducens) and Internal Carotid Artery travel directly through the center of the venous lumen (CN VI is paralyzed earliest in CST). The lateral dural wall carries CN III, CN IV, CN V1, and CN V2 in top-down order.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Danger Triangle &amp; Middle Ear Roof</div>
                  <div className="text-slate-300 mt-1">Infections of the nasolabial fold spread backward through valveless ophthalmic veins to the cavernous sinus. The thin tegmen tympani bone forms the middle ear roof, separating it from the temporal lobe of the brain.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Clinical Embryology & Branchial Apparatus */}
          {activeMode === "embryology" && (
            <div className={styles.anatCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Dna size={14} /> Pharyngeal Arch, Pouch &amp; Cleft Embryological Derivatives
                </span>
                <span className="text-[11px] text-slate-400">1st/2nd Arch &bull; 3rd/4th Pouch (DiGeorge) &bull; Thyroglossal vs Branchial</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">DiGeorge Syndrome (3rd &amp; 4th Pouches)</div>
                  <div className="text-slate-300 mt-1">Chromosome 22q11.2 microdeletion causing defective neural crest migration. 3rd pouch fails to form Thymus (absent T-cells) and inferior parathyroids; 4th pouch fails to form superior parathyroids (severe neonatal hypocalcemic tetany).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-sky-300 font-bold">Thyroglossal Duct vs Branchial Cleft Cyst</div>
                  <div className="text-slate-300 mt-1">Thyroglossal cyst: Midline neck mass along thyroid descent tract from foramen cecum; ELEVATES with tongue protrusion and swallowing. Branchial cyst: LATERAL neck mass along anterior border of SCM; does NOT elevate with tongue protrusion.</div>
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
                    <span className="text-sky-400 font-bold">Anat:</span> {node.anatProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Anatomy</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Anatomy Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Anatomy Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Anatomical Entity / Syndrome</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Gross Architecture &amp; Topography</div>
            <div className="text-xs text-sky-300 font-semibold">{activeNode.anatProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Anatomy Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("cranial")}
          className={`${styles.modeTab} ${activeMode === "cranial" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Brainstem Syndromes
        </button>
        <button
          onClick={() => setActiveMode("spaces")}
          className={`${styles.modeTab} ${activeMode === "spaces" ? styles.modeTabActive : ""}`}
        >
          🔄 2. Cervical Spaces &amp; Danger
        </button>
        <button
          onClick={() => setActiveMode("cavernous")}
          className={`${styles.modeTab} ${activeMode === "cavernous" ? styles.modeTabActive : ""}`}
        >
          👁️ 3. Cavernous Sinus &amp; Otic
        </button>
        <button
          onClick={() => setActiveMode("embryology")}
          className={`${styles.modeTab} ${activeMode === "embryology" ? styles.modeTabActive : ""}`}
        >
          🛡️ 4. Branchial Embryology
        </button>
      </div>
    </div>
  );
}
