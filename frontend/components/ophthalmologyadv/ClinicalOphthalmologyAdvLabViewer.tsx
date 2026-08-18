"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalOphthalmologyAdvLabViewer.module.css";
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
  Eye,
} from "lucide-react";

export type OphthalmologyLabMode = "glaucoma" | "retina" | "uveitis" | "cornea";

export interface OphthalmologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  ophthalmicProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const OPHTHALMOLOGY_LAB_NODES: Record<OphthalmologyLabMode, OphthalmologyLabNode[]> = {
  glaucoma: [
    {
      id: "oph-aacg-pupillary-block",
      name: "Acute Angle-Closure Glaucoma (Pupillary Block, Mid-Dilated Oval Pupil & IOP Spike)",
      category: "Ophthalmic Emergency",
      subType: "IOP 40-70 mmHg • Steamy Cornea • Fixed Mid-Dilated Pupil (4-6mm) • Rainbow Halos",
      ophthalmicProfile: "Relative pupillary block bowing peripheral iris against trabecular meshwork in anatomically shallow chambers.",
      pathophysiologyMechanism: "Complete occlusion of aqueous humor drainage through the iridocorneal angle, precipitating acute IOP spikes.",
      clinicalHallmarks: "Excruciating periorbital pain, headache, nausea/vomiting, steamy cornea, fixed mid-dilated oval pupil, rock-hard globe.",
      highYieldPearls: "Acute angle-closure glaucoma presents with a fixed mid-dilated pupil and steamy cornea; IOP is dramatically elevated (40-70 mmHg)."
    },
    {
      id: "oph-aacg-medical-decompression",
      name: "Multi-Agent Medical Decompression (Timolol, Apraclonidine, IV Acetazolamide & Mannitol)",
      category: "Pharmacotherapy",
      subType: "Timolol 0.5% • Apraclonidine 1% • IV Acetazolamide (500mg) • IV Mannitol (1-2 g/kg)",
      ophthalmicProfile: "Rapid multi-modal reduction of aqueous secretion and osmotic dehydration of the hyperhydrated vitreous body.",
      pathophysiologyMechanism: "Combines beta-adrenergic, alpha-2, and carbonic anhydrase blockade with hyperosmotic vascular gradient extraction.",
      clinicalHallmarks: "Administer drops 1 minute apart; IV Acetazolamide rapidly stops carbonic anhydrase-mediated bicarbonate secretion.",
      highYieldPearls: "Medical therapy aims to rapidly lower IOP <40 mmHg to relieve iris ischemia before Pilocarpine can take effect."
    },
    {
      id: "oph-aacg-pilocarpine-miosis",
      name: "Pilocarpine Parasympathomimetic Miosis (Mechanical Iris Retraction & Trabecular Outflow)",
      category: "Aqueous Outflow",
      subType: "Pilocarpine 1-2% • Muscarinic M3 Agonist • Iris Sphincter Contraction • Angle Opening",
      ophthalmicProfile: "Direct-acting parasympathomimetic that constricts the pupillary sphincter muscle and pulls peripheral iris from the angle.",
      pathophysiologyMechanism: "Centripetal traction on the peripheral iris root mechanically unblocks the trabecular meshwork filtration surface.",
      clinicalHallmarks: "Administer once IOP drops <40 mmHg (ineffective when IOP >40 mmHg due to ischemic paralysis of the iris sphincter).",
      highYieldPearls: "Pilocarpine is ineffective at IOP >40 mmHg due to iris sphincter ischemia; lower pressure first with beta-blockers/carbonic anhydrase inhibitors."
    },
    {
      id: "oph-aacg-laser-iridotomy",
      name: "Laser Peripheral Iridotomy LPI (Nd:YAG Coloboma Bypass Conduit & Bilateral Cure)",
      category: "Microsurgical Cure",
      subType: "Nd:YAG Laser • Full-Thickness Superior Iris Window • Pressure Equalization • Mandatory Bilateral",
      ophthalmicProfile: "Definitive surgical cure creating an alternate anatomical conduit between posterior and anterior chambers.",
      pathophysiologyMechanism: "Eliminates the trans-iris pressure differential, allowing the peripheral iris to fall backward away from the meshwork.",
      clinicalHallmarks: "Performed once corneal edema clears; mandatory prophylactic LPI to fellow eye due to shared shallow angle anatomy.",
      highYieldPearls: "Nd:YAG Laser Peripheral Iridotomy is the definitive cure for pupillary block and must be performed in BOTH eyes."
    }
  ],

  retina: [
    {
      id: "oph-ret-crao-cherry-red",
      name: "Central Retinal Artery Occlusion CRAO (Foveal Cherry-Red Spot & Embolic Amaurosis)",
      category: "Vascular Emergency",
      subType: "Sudden Painless Monocular Vision Loss • Retinal Edema • Cherry-Red Spot • Boxcarring",
      ophthalmicProfile: "Acute thrombotic or embolic (carotid plaque / Hollenhorst) occlusion of the central retinal artery end-artery system.",
      pathophysiologyMechanism: "Inner retinal ischemic intracellular edema turns the fundus opaque white; thin fovea reveals underlying red choroid.",
      clinicalHallmarks: "Profound sudden painless vision loss (count fingers), afferent pupillary defect (RAPD), cherry-red spot at fovea.",
      highYieldPearls: "CRAO produces a classic 'cherry-red spot' against a pale ischemic retina; irreversible ganglion cell death occurs in 90-100 min."
    },
    {
      id: "oph-ret-crvo-blood-thunder",
      name: "Central Retinal Vein Occlusion CRVO (Blood and Thunder Fundus & Anti-VEGF Therapy)",
      category: "Retinal Vascular",
      subType: "Thrombosis at Lamina Cribrosa • 'Blood and Thunder' Hemorrhages • Disc Edema • Anti-VEGF",
      ophthalmicProfile: "Thrombotic occlusion of the central retinal vein causing massive venous engorgement and capillary rupture.",
      pathophysiologyMechanism: "Impaired venous outflow elevates capillary pressure, causing widespread intraretinal flame hemorrhages and macular edema.",
      clinicalHallmarks: "Subacute painless vision blur; fundus shows massive flame hemorrhages and disc edema; treat with anti-VEGF injections.",
      highYieldPearls: "CRVO produces a classic 'blood and thunder' fundus with extensive flame-shaped hemorrhages and risk of 90-day glaucoma."
    },
    {
      id: "oph-ret-rrd-curtain-shafer",
      name: "Rhegmatogenous Retinal Detachment RRD (Shafer Tobacco Dust & Pneumatic Retinopexy)",
      category: "Vitreoretinal Surgery",
      subType: "Photopsias (Flashes) • Floaters • Progressive 'Curtain Falling' Field Defect • Shafer's Sign",
      ophthalmicProfile: "Full-thickness retinal tear allowing liquefied vitreous fluid to dissect into the potential subretinal space.",
      pathophysiologyMechanism: "Tractional separation of the neurosensory retina from the underlying nourishing retinal pigment epithelium (RPE).",
      clinicalHallmarks: "Shafer's sign ('tobacco dust' RPE clumps in anterior vitreous); corrugated elevated retina; urgent surgical reattachment.",
      highYieldPearls: "Rhegmatogenous retinal detachment presents with flashes, floaters, and a 'curtain coming down' visual field defect."
    },
    {
      id: "oph-ret-neovascular-glaucoma",
      name: "90-Day Neovascular Glaucoma (VEGF-Driven Rubeosis Iridis & Panretinal Photocoagulation)",
      category: "Ischemic Complication",
      subType: "Ischemic CRVO / Proliferative Diabetic Retinopathy • Rubeosis Iridis • Angle Neovascularization • PRP",
      ophthalmicProfile: "Severe secondary angle-closure glaucoma triggered by widespread posterior segment retinal ischemia.",
      pathophysiologyMechanism: "Ischemia upregulates VEGF, driving fibrovascular membrane growth across the anterior chamber angle and trabecular meshwork.",
      clinicalHallmarks: "Neovascular tufts at pupillary margin (rubeosis iridis); intractable high IOP; panretinal photocoagulation (PRP) + anti-VEGF.",
      highYieldPearls: "Ischemic CRVO can lead to '90-day glaucoma' via VEGF-driven neovascularization of the iris (rubeosis iridis)."
    }
  ],

  uveitis: [
    {
      id: "oph-uve-anterior-hypopyon",
      name: "HLA-B27 Acute Anterior Uveitis (Hypopyon, Keratic Precipitates & Topical Steroids)",
      category: "Autoimmune Uveitis",
      subType: "HLA-B27 Spondyloarthropathies • Ciliary Flush • Keratic Precipitates • Sterile Hypopyon",
      ophthalmicProfile: "Autoimmune lymphocytic inflammation of the iris and ciliary body with blood-aqueous barrier breakdown.",
      pathophysiologyMechanism: "Extravasation of protein (flare) and leukocytes (cells) into the anterior chamber; gravity causes hypopyon sedimentation.",
      clinicalHallmarks: "Pain, severe photophobia, ciliary flush, keratic precipitates on corneal endothelium, hypopyon; Prednisolone 1% drops.",
      highYieldPearls: "Acute anterior uveitis is strongly associated with HLA-B27 (ankylosing spondylitis) and presents with ciliary flush and hypopyon."
    },
    {
      id: "oph-uve-posterior-synechiae",
      name: "Posterior Synechiae Prevention (Cyclopentolate Ciliary Spasmolysis & Mydriasis)",
      category: "Therapeutic Cycloplegia",
      subType: "Cyclopentolate 1% / Atropine 1% • Ciliary Muscle Spasmolysis • Pupil Dilation • Synechiae Lysis",
      ophthalmicProfile: "Pharmacological cycloplegia and pupillary dilation in acute intraocular inflammatory states.",
      pathophysiologyMechanism: "Paralyzes the inflamed ciliary body to relieve excruciating spasm and moves iris pupillary border away from lens.",
      clinicalHallmarks: "Prevents permanent adherence of the iris to the anterior lens capsule (posterior synechiae) that causes iris bombé.",
      highYieldPearls: "Cycloplegics (Cyclopentolate/Atropine) in uveitis serve two crucial purposes: relieve painful ciliary spasm and prevent synechiae."
    },
    {
      id: "oph-uve-toxoplasmosis-headlight",
      name: "Ocular Toxoplasmosis Chorioretinitis (Headlight in the Fog & Antimicrobial Antagonism)",
      category: "Infectious Uveitis",
      subType: "Toxoplasma gondii • 'Headlight in the Fog' Focal Lesion • Adjacent Hyperpigmented Scar • Pyrimethamine",
      ophthalmicProfile: "Necrotizing retinochoroiditis caused by reactivation of encysted Toxoplasma bradyzoites in the neuroretina.",
      pathophysiologyMechanism: "Focal intracellular tachyzoite replication with intense focal retinal necrosis and dense overlying vitreous inflammation.",
      clinicalHallmarks: "Fluffy yellow-white focal retinal lesion adjacent to an old pigmented chorioretinal scar; Pyrimethamine + Sulfadiazine + Folinic acid.",
      highYieldPearls: "Ocular toxoplasmosis classically presents as a 'headlight in the fog' lesion adjacent to an old hyperpigmented chorioretinal scar."
    },
    {
      id: "oph-uve-cmv-retinitis-pizza",
      name: "Cytomegalovirus Opportunistic Retinitis (Pizza-Pie Necrosis in Advanced HIV & Ganciclovir)",
      category: "Opportunistic Viral",
      subType: "Advanced HIV/AIDS (CD4 <50/uL) • 'Pizza-Pie' / 'Cottage Cheese & Ketchup' Lesions • Oral Valganciclovir",
      ophthalmicProfile: "Full-thickness necrotizing viral retinitis occurring almost exclusively in severely immunocompromised hosts.",
      pathophysiologyMechanism: "CMV viral replication in retinal pericytes and endothelia producing microvascular infarction and brushfire necrosis.",
      clinicalHallmarks: "Painless floaters/vision loss; dense perivascular white retinal infiltrates with extensive retinal hemorrhages ('pizza-pie').",
      highYieldPearls: "CMV retinitis occurs at CD4 <50/uL, produces a 'pizza-pie' fundus (hemorrhage + granular necrosis), and is treated with Valganciclovir."
    }
  ],

  cornea: [
    {
      id: "oph-cor-pseudomonas-ulcer",
      name: "Pseudomonas Bacterial Keratitis (Contact Lens Stromal Infiltrate & Fortified Antibiotics)",
      category: "Microbial Keratitis",
      subType: "Extended Contact Lens Wear • Pseudomonas aeruginosa • Rapid Stromal Melting • Fortified Vancomycin/Tobramycin",
      ophthalmicProfile: "Rapidly destructive suppurative bacterial infection of the corneal stroma in contact lens wearers.",
      pathophysiologyMechanism: "Bacterial elastases, alkaline proteases, and exotoxin A mediate rapid stromal melting and corneal perforation.",
      clinicalHallmarks: "Dense yellowish-white stromal infiltrate, overlying epithelial defect, thick mucopurulent discharge, hypopyon; fortified drops.",
      highYieldPearls: "Pseudomonas bacterial keratitis is an emergency in contact lens wearers; requires immediate intensive fortified bactericidal drops."
    },
    {
      id: "oph-cor-hsv-dendritic-ulcer",
      name: "Herpes Simplex Dendritic Keratitis (Branching End-Bulbs & Steroid Contraindication)",
      category: "Viral Keratitis",
      subType: "HSV-1 Reactivation • Branching Dendrite with Terminal Bulbs • Topical Ganciclovir • STRICTLY NO STEROIDS",
      ophthalmicProfile: "Reactivation of latent HSV-1 from the ophthalmic division of the trigeminal ganglion (V1).",
      pathophysiologyMechanism: "Active intraepithelial viral replication causes linear branching epithelial ulceration with characteristic terminal swollen bulbs.",
      clinicalHallmarks: "Fluorescein stains ulcer bed; Rose Bengal stains devitalized margin cells; topical Ganciclovir 0.15% or oral Acyclovir.",
      highYieldPearls: "Topical corticosteroids are STRICTLY CONTRAINDICATED in epithelial HSV keratitis (causes massive geographic ulceration and perforation)."
    },
    {
      id: "oph-cor-fungal-vegetative-natamycin",
      name: "Filamentous Fungal Keratitis (Vegetative Trauma, Feathery Margins & Natamycin)",
      category: "Fungal Infection",
      subType: "Agricultural Plant Trauma • Fusarium / Aspergillus • Feathery Branching Borders • Topical Natamycin 5%",
      ophthalmicProfile: "Fungal infection of the corneal stroma following trauma with organic or vegetative matter (twigs, soil, leaves).",
      pathophysiologyMechanism: "Fungal hyphae penetrate deep through intact Descemet membrane into the anterior chamber, causing recalcitrant disease.",
      clinicalHallmarks: "Dry, grayish-white infiltrate with feathery, branching indistinct margins and satellite lesions; topical Natamycin 5%.",
      highYieldPearls: "Fungal keratitis follows vegetative trauma, shows feathery branching margins with satellite lesions, and is treated with Natamycin."
    },
    {
      id: "oph-cor-acanthamoeba-keratitis",
      name: "Acanthamoeba Radial Keratoneuritis (Severe Pain Out of Proportion & Biguanide Therapy)",
      category: "Parasitic Keratitis",
      subType: "Tap Water / Hot Tub Contact Lens Use • Severe Pain Out of Proportion • Radial Perineural Infiltrates • PHMB",
      ophthalmicProfile: "Protozoan parasitic infection of the corneal epithelium and stroma caused by free-living *Acanthamoeba*.",
      pathophysiologyMechanism: "Trophozoites migrate along radial corneal sensory nerves, causing severe perineural inflammation and stromal necrosis.",
      clinicalHallmarks: "Excruciating pain out of all proportion to early slit-lamp findings; radial keratoneuritis; ring infiltrate; treated with PHMB.",
      highYieldPearls: "Acanthamoeba keratitis features excruciating pain out of proportion to exam and is linked to contact lenses cleaned in tap water."
    }
  ]
};

interface ClinicalOphthalmologyAdvLabViewerProps {
  initialMode?: OphthalmologyLabMode;
  height?: string;
  onNodeSelect?: (node: OphthalmologyLabNode) => void;
}

export default function ClinicalOphthalmologyAdvLabViewer({
  initialMode = "glaucoma",
  height = "560px",
  onNodeSelect,
}: ClinicalOphthalmologyAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<OphthalmologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Glaucoma IOP Simulator State
  const [initialIop, setInitialIop] = useState<number>(56);
  const [appliedRx, setAppliedRx] = useState<{
    timolol: boolean;
    apraclonidine: boolean;
    acetazolamide: boolean;
    mannitol: boolean;
    pilocarpine: boolean;
    lpi: boolean;
  }>({
    timolol: false,
    apraclonidine: false,
    acetazolamide: false,
    mannitol: false,
    pilocarpine: false,
    lpi: false,
  });

  // Keratitis Selector State
  const [selectedKeratitis, setSelectedKeratitis] = useState<"bacterial" | "hsv" | "fungal" | "acanth">("hsv");

  const currentIop = useMemo(() => {
    let iop = initialIop;
    if (appliedRx.timolol) iop -= 8;
    if (appliedRx.apraclonidine) iop -= 7;
    if (appliedRx.acetazolamide) iop -= 12;
    if (appliedRx.mannitol) iop -= 14;
    if (appliedRx.pilocarpine && (iop < 40 || appliedRx.lpi)) iop -= 6;
    if (appliedRx.lpi) iop = Math.min(iop, 14);
    return Math.max(iop, 12);
  }, [initialIop, appliedRx]);

  const keratitisDetails = useMemo(() => {
    if (selectedKeratitis === "bacterial") {
      return {
        title: "Bacterial Keratitis (Pseudomonas in Contact Lens Wearers)",
        indices: "Dense Stromal Infiltrate • Epithelial Defect • Yellow-Green Discharge • Hypopyon",
        rx: "Intensive hourly topical fortified Vancomycin (25 mg/mL) + Tobramycin (14 mg/mL) or Fluoroquinolones",
        pearl: "Pseudomonas produces rapid stromal melting; never patch a contact lens-associated corneal abrasion!"
      };
    } else if (selectedKeratitis === "hsv") {
      return {
        title: "Herpes Simplex Virus (HSV) Epithelial Keratitis",
        indices: "Dendritic Ulcer with Terminal Bulbs • Fluorescein/Rose Bengal Staining • Decreased Sensation",
        rx: "Topical Ganciclovir 0.15% gel (5x/day) or Oral Acyclovir (400 mg 5x/day); STRICTLY NO CORTICOSTEROIDS",
        pearl: "Topical steroids are STRICTLY CONTRAINDICATED (causes massive geographic amoebic ulceration and perforation)."
      };
    } else if (selectedKeratitis === "fungal") {
      return {
        title: "Filamentous Fungal Keratitis (Vegetative / Agricultural Trauma)",
        indices: "Feathery Branching Margins • Satellite Lesions • Gray-White Infiltrate • Hypopyon",
        rx: "Topical Natamycin 5% suspension hourly + topical/oral Voriconazole; slow prolonged course",
        pearl: "Suspect fungal keratitis in any corneal ulcer developing after trauma with plant material or tree branches."
      };
    } else {
      return {
        title: "Acanthamoeba Keratitis (Tap Water Contact Lens Disinfection)",
        indices: "Severe Pain Out of Proportion • Radial Perineural Infiltrates • Ring Ulcer",
        rx: "Topical Chlorhexidine 0.02% + Polyhexamethylene Biguanide (PHMB 0.02%) + Bellergal drops",
        pearl: "Severe agonizing ocular pain out of proportion to early subtle slit-lamp findings is the cardinal clue."
      };
    }
  }, [selectedKeratitis]);

  const currentNodes = useMemo(() => {
    return OPHTHALMOLOGY_LAB_NODES[activeMode] || OPHTHALMOLOGY_LAB_NODES.glaucoma;
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
            <Eye size={14} /> OPH-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "glaucoma" && "Acute Angle-Closure Glaucoma: Pupillary Block, Pressure Lowering & Laser Iridotomy"}
            {activeMode === "retina" && "Retinal Emergencies: Central Retinal Artery (CRAO), CRVO & Detachment"}
            {activeMode === "uveitis" && "Uveitis & Ocular Immunology: HLA-B27 Anterior Hypopyon, Toxoplasmosis & CMV"}
            {activeMode === "cornea" && "Corneal Ulcers & Keratitis: Pseudomonas, HSV Dendritic, Fungal & Acanthamoeba"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Ophthalmology Diagnostic Quiz"}
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
                  Ophthalmology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Ocular Pathology / Microsurgical Step: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Acute Glaucoma Simulator */}
          {activeMode === "glaucoma" && (
            <div className={styles.ophCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Acute Angle-Closure IOP Decompression Simulator
                </span>
                <span className="text-[11px] text-slate-400">Target IOP: 10-21 mmHg</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Initial Presentation IOP:</span>
                    <span className="font-bold text-indigo-300">{initialIop} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="75"
                    step="1"
                    value={initialIop}
                    onChange={(e) => setInitialIop(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-center">
                  <div className={`p-3 w-full rounded-lg border text-center ${
                    currentIop > 30
                      ? "bg-red-950/80 border-red-500 text-red-200"
                      : currentIop > 21
                      ? "bg-amber-950/80 border-amber-500 text-amber-200"
                      : "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                  }`}>
                    <div className="text-xs font-bold uppercase tracking-wider">Current Intraocular Pressure</div>
                    <div className="text-2xl font-black">{currentIop} mmHg</div>
                    <div className="text-[10px] mt-0.5 opacity-90">
                      {currentIop > 30 ? "🚨 Acute Vision-Threatening Pressure Spike" : currentIop > 21 ? "⚠️ Borderline / Moderate Tension" : "✅ Target Physiological IOP Restored"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Agent Pharmacotherapy Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setAppliedRx(p => ({ ...p, timolol: !p.timolol }))}
                  className={`p-2 rounded font-bold border transition ${
                    appliedRx.timolol ? "bg-indigo-600 text-white border-indigo-400" : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💧 Timolol 0.5% (Beta-Blocker)
                </button>
                <button
                  onClick={() => setAppliedRx(p => ({ ...p, apraclonidine: !p.apraclonidine }))}
                  className={`p-2 rounded font-bold border transition ${
                    appliedRx.apraclonidine ? "bg-indigo-600 text-white border-indigo-400" : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💧 Apraclonidine 1% (Alpha-2)
                </button>
                <button
                  onClick={() => setAppliedRx(p => ({ ...p, acetazolamide: !p.acetazolamide }))}
                  className={`p-2 rounded font-bold border transition ${
                    appliedRx.acetazolamide ? "bg-indigo-600 text-white border-indigo-400" : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💉 IV Acetazolamide 500mg (CAI)
                </button>
                <button
                  onClick={() => setAppliedRx(p => ({ ...p, mannitol: !p.mannitol }))}
                  className={`p-2 rounded font-bold border transition ${
                    appliedRx.mannitol ? "bg-indigo-600 text-white border-indigo-400" : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧪 IV Mannitol 20% (Osmotic)
                </button>
                <button
                  onClick={() => setAppliedRx(p => ({ ...p, pilocarpine: !p.pilocarpine }))}
                  className={`p-2 rounded font-bold border transition ${
                    appliedRx.pilocarpine ? "bg-indigo-600 text-white border-indigo-400" : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  👁️ Pilocarpine 2% (Miosis)
                </button>
                <button
                  onClick={() => setAppliedRx(p => ({ ...p, lpi: !p.lpi }))}
                  className={`p-2 rounded font-bold border transition ${
                    appliedRx.lpi ? "bg-emerald-600 text-white border-emerald-400" : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Bilateral Laser Iridotomy (LPI)
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: Retinal Emergencies */}
          {activeMode === "retina" && (
            <div className={styles.ophCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Retinal Emergencies &amp; Fundoscopic Patterns
                </span>
                <span className="text-[11px] text-slate-400">CRAO &bull; CRVO &bull; Retinal Detachment &bull; 90-Day Glaucoma</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">CRAO vs CRVO</div>
                  <div className="text-slate-300 mt-1">CRAO presents with sudden painless complete monocular vision loss, showing diffuse retinal whitening with a classic 'cherry-red spot' at the fovea (ischemic window &lt;90-100 min). CRVO presents with subacute vision loss, showing massive 'blood and thunder' retinal flame hemorrhages and disc edema, carrying a risk of VEGF-driven neovascular glaucoma.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Rhegmatogenous Retinal Detachment (RRD)</div>
                  <div className="text-slate-300 mt-1">RRD occurs when a full-thickness tear allows liquefied vitreous into the subretinal space, presenting with flashes (photopsias), floaters, Shafer's sign ('tobacco dust' RPE clumps in anterior vitreous), and a progressive 'curtain coming down' field defect. Treat with pneumatic retinopexy, scleral buckle, or vitrectomy.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Uveitis & Ocular Immunology */}
          {activeMode === "uveitis" && (
            <div className={styles.ophCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Uveitis &amp; Infectious Retinitis Classification
                </span>
                <span className="text-[11px] text-slate-400">HLA-B27 Anterior &bull; Toxoplasmosis &bull; CMV Retinitis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">HLA-B27 Anterior Uveitis &amp; Synechiae</div>
                  <div className="text-slate-300 mt-1">Presents with severe pain, photophobia, ciliary flush, keratic precipitates, and sterile hypopyon. Dual therapy: Intensive topical Prednisolone acetate 1% drops plus Cyclopentolate/Atropine to relieve painful ciliary spasm and prevent permanent posterior synechiae adhesions to the lens.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Toxoplasmosis &amp; CMV Retinitis</div>
                  <div className="text-slate-300 mt-1">Ocular toxoplasmosis presents as a 'headlight in the fog' focal necrotizing lesion adjacent to an old pigmented scar (Pyrimethamine + Sulfadiazine). CMV retinitis in advanced HIV (CD4 &lt;50/uL) presents with 'pizza-pie' hemorrhagic retinal necrosis along vascular arcades (IV/oral Valganciclovir).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Corneal Ulcers & Refractive Surgery */}
          {activeMode === "cornea" && (
            <div className={styles.ophCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Microbial Keratitis &amp; Critical Contraindications
                </span>
                <span className="text-[11px] text-slate-400">Pseudomonas &bull; HSV &bull; Fungal &bull; Acanthamoeba</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedKeratitis("bacterial")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedKeratitis === "bacterial"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧫 Pseudomonas (Contacts)
                </button>
                <button
                  onClick={() => setSelectedKeratitis("hsv")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedKeratitis === "hsv"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌿 HSV Dendrite (NO STEROIDS)
                </button>
                <button
                  onClick={() => setSelectedKeratitis("fungal")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedKeratitis === "fungal"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🍄 Fungal (Vegetative)
                </button>
                <button
                  onClick={() => setSelectedKeratitis("acanth")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedKeratitis === "acanth"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💧 Acanthamoeba (Tap Water)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{keratitisDetails.title}</div>
                <div className="text-pink-400 font-bold mt-1">{keratitisDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Treatment:</strong> {keratitisDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Ophthalmic Pearl:</strong> {keratitisDetails.pearl}</div>
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
                    <span className="text-indigo-400 font-bold">Ophth:</span> {node.ophthalmicProfile}
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

        {/* Right Side: High-Yield Clinical Ophthalmology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Ophthalmic Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>👁️ Ophthalmic Entity / Emergency</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Microscopic &amp; Ophthalmoscopic Mechanics</div>
            <div className="text-xs text-indigo-300 font-semibold">{activeNode.ophthalmicProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Slit-Lamp Signs</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Ophthalmology Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("glaucoma")}
          className={`${styles.modeTab} ${activeMode === "glaucoma" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Angle-Closure Glaucoma
        </button>
        <button
          onClick={() => setActiveMode("retina")}
          className={`${styles.modeTab} ${activeMode === "retina" ? styles.modeTabActive : ""}`}
        >
          🩸 2. Retinal Emergencies
        </button>
        <button
          onClick={() => setActiveMode("uveitis")}
          className={`${styles.modeTab} ${activeMode === "uveitis" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. Uveitis &amp; Retinitis
        </button>
        <button
          onClick={() => setActiveMode("cornea")}
          className={`${styles.modeTab} ${activeMode === "cornea" ? styles.modeTabActive : ""}`}
        >
          🌿 4. Corneal Ulcers
        </button>
      </div>
    </div>
  );
}
