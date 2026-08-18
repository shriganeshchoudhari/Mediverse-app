"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalInt7LabViewer.module.css";
import {
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Flame,
  Calculator,
  TrendingUp,
  Gauge,
  Thermometer,
  Shield,
  Crosshair,
  Pill,
  Brain,
  Award,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
  UserCheck,
  Users,
  Activity,
  ClipboardList,
  Wind,
  Zap,
  Eye,
  Scissors,
} from "lucide-react";

export type Int7LabMode = "derm" | "psych" | "eye" | "ent";

export interface Int7LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const INT7_LAB_NODES: Record<Int7LabMode, Int7LabNode[]> = {
  derm: [
    {
      id: "int7-de-sjs-ten-detachment-spectrum",
      name: "SJS vs TEN Cutaneous Detachment Spectrum (SJS <10% vs TEN >30% TBSA & Positive Nikolsky Sign)",
      category: "SJS/TEN Spectrum",
      subType: "SJS (<10% TBSA) &bull; Overlap (10-30%) &bull; TEN (>30% TBSA) &bull; &ge;2 Mucosal Sites &bull; Nikolsky Sign",
      proceduralProfile: "Severe immune-mediated cytotoxic epidermal necrolysis producing full-thickness epidermal detachment.",
      proceduralMechanism: "Granulysin and Fas-FasL interactions induce widespread keratinocyte apoptosis and epidermal-dermal sloughing.",
      clinicalHallmarks: "Confluent purpuric macules, flaccid bullae, severe multi-mucosal ulcerations, positive Nikolsky/Asboe-Hansen signs.",
      highYieldPearls: "SJS affects <10% TBSA; TEN affects >30% TBSA with positive Nikolsky sign; stop offending drugs immediately."
    },
    {
      id: "int7-de-scorten-mortality-prognostication",
      name: "SCORTEN In-Hospital Mortality Prognostication (7-Point Risk Stratification & Burn ICU Triaging)",
      category: "SCORTEN Score",
      subType: "Age &ge;40, Malignancy, TBSA &ge;10%, Urea >10, Glucose >14, Bicarb <20, HR &ge;120 &bull; Score &ge;5 (>90% Mortality)",
      proceduralProfile: "Standardized clinical prognostic tool calculated within 24 hours of hospital admission to predict TEN mortality.",
      proceduralMechanism: "Reflects systemic metabolic exhaustion, prerenal azotemia, and massive trans-epidermal barrier breakdown.",
      clinicalHallmarks: "Calculate SCORTEN on Day 1; transfer patients with SCORTEN &ge;3 to specialized Burn Intensive Care Units.",
      highYieldPearls: "SCORTEN score &ge;5 confers >90% in-hospital mortality; mandates immediate transfer to a specialized Burn ICU."
    },
    {
      id: "int7-de-high-dose-ivig-cyclosporine",
      name: "High-Dose IVIG & Immunomodulatory Resuscitation (IVIG 1-2 g/kg, Cyclosporine & Non-Adherent Dressings)",
      category: "TEN Resuscitation",
      subType: "IVIG (1-2 g/kg over 3-4 Days) &bull; Cyclosporine (3-5 mg/kg/day) &bull; Amniotic Membrane for Eyes",
      proceduralProfile: "Targeted immunomodulation halting progressive keratinocyte apoptosis and preventing mucosal symblepharon.",
      proceduralMechanism: "IVIG blocks Fas-mediated apoptosis; Cyclosporine inhibits calcineurin-mediated T-cell cytotoxic activation.",
      clinicalHallmarks: "Administer IVIG/Cyclosporine, warm room (30-32°C), non-adherent dressings without debridement, ophthalmology consult.",
      highYieldPearls: "Manage TEN with immediate drug cessation, Burn ICU barrier nursing, IVIG/cyclosporine, and proactive eye care."
    },
    {
      id: "int7-de-exfoliative-erythroderma-protocols",
      name: "Exfoliative Erythroderma Systemic Protocols (>90% TBSA Scaling, Thermoregulatory Failure & Sepsis Control)",
      category: "Erythroderma",
      subType: ">90% TBSA Erythema &bull; High-Output Heart Failure &bull; Hypothermia &bull; Staph Sepsis Prevention",
      proceduralProfile: "Generalized severe inflammatory dermatosis characterized by erythema and scaling affecting almost the entire skin.",
      proceduralMechanism: "Profound cutaneous vasodilation shunts blood flow to the skin, causing heat loss, protein loss, and cardiac strain.",
      clinicalHallmarks: "Diffuse scaling >90% TBSA, hypothermia, peripheral edema, lymphadenopathy; assess for underlying psoriasis or CTCL.",
      highYieldPearls: "Erythroderma affects >90% TBSA; major systemic risks include hypothermia, high-output cardiac failure, and sepsis."
    }
  ],

  psych: [
    {
      id: "int7-ps-nms-lead-pipe-rigidity-dantrolene",
      name: "Neuroleptic Malignant Syndrome Lead-Pipe Rigidity (Dopamine Antagonism, Malignant Hyperthermia & Dantrolene)",
      category: "NMS Tetrad",
      subType: "D2 Antagonists &bull; 'Lead-Pipe' Rigidity &bull; Temp >38.5-40°C &bull; CK >1,000-50,000 IU/L &bull; Dantrolene + Bromocriptine",
      proceduralProfile: "Life-threatening idiosyncratic reaction to dopamine receptor antagonists or abrupt withdrawal of dopamine agonists.",
      proceduralMechanism: "Central dopamine D2 blockade in the hypothalamus and striatum induces extreme rigidity, hyperthermia, and rhabdomyolysis.",
      clinicalHallmarks: "Severe 'lead-pipe' rigidity, hyporeflexia, labile BP, diaphoresis, massive CK elevation; treat with Dantrolene and Bromocriptine.",
      highYieldPearls: "NMS features severe lead-pipe rigidity, hyperthermia, and massive CK elevation; treat with Dantrolene and Bromocriptine."
    },
    {
      id: "int7-ps-serotonin-syndrome-clonus",
      name: "Serotonin Syndrome Neuromuscular Hyperactivity (Hunter Criteria, Inducible Clonus & Cyproheptadine)",
      category: "Serotonin Syndrome",
      subType: "SSRIs/MAOIs/Linezolid &bull; Neuromuscular Hyperreflexia &bull; Spontaneous / Ocular Clonus &bull; Cyproheptadine",
      proceduralProfile: "Potentially fatal toxidrome resulting from excessive central and peripheral serotonergic agonism.",
      proceduralMechanism: "Overstimulation of 5-HT1A and 5-HT2A receptors causes motor hyperactivity, autonomic instability, and agitation.",
      clinicalHallmarks: "Hunter criteria: Spontaneous clonus, inducible clonus with agitation, or ocular clonus with tremor; antidote is Cyproheptadine.",
      highYieldPearls: "Serotonin Syndrome is diagnosed by clonus and hyperreflexia (Hunter criteria); antidote is Cyproheptadine (5-HT2A antagonist)."
    },
    {
      id: "int7-ps-rapid-tranquilization-b52",
      name: "Rapid Tranquilization & Behavioral Agitation Control (B52 Regimen: Haloperidol + Lorazepam + Diphenhydramine)",
      category: "Rapid Tranquilization",
      subType: "Haloperidol 5 mg IM + Lorazepam 2 mg IM + Diphenhydramine 50 mg IM ('B52') &bull; De-escalation First",
      proceduralProfile: "Protocolized pharmacological containment for severe unmanageable psychiatric agitation endangering patient or staff.",
      proceduralMechanism: "Synergistic D2 blockade and GABA-A positive allosteric modulation provide rapid sedation while preventing dystonia.",
      clinicalHallmarks: "Attempt verbal de-escalation first; if refractory, administer IM Haloperidol 5mg + Lorazepam 2mg + Diphenhydramine 50mg.",
      highYieldPearls: "Emergency rapid tranquilization 'B52': IM Haloperidol 5mg + Lorazepam 2mg + Diphenhydramine 50mg (prevents dystonia)."
    },
    {
      id: "int7-ps-columbia-suicide-stratification",
      name: "Columbia Suicide Risk Stratification (Active Ideation, Lethal Means & 1-to-1 Visual Monitoring)",
      category: "Suicide Triage",
      subType: "C-SSRS Scoring &bull; Active Plan / Intent &bull; Prior Attempts &bull; 1-to-1 Constant Observation &bull; Safety Environment",
      proceduralProfile: "Evidence-based clinical triage quantifying suicide severity and determining inpatient psychiatric admission needs.",
      proceduralMechanism: "Identifies lethal intent, access to means, and acute precipitating stressors to guide immediate protective containment.",
      clinicalHallmarks: "Patients with active plan/intent mandate immediate 1-to-1 constant visual observation and removal of all hazardous items.",
      highYieldPearls: "High-risk suicide ideation with active intent mandates immediate continuous 1-to-1 visual observation and safe containment."
    }
  ],

  eye: [
    {
      id: "int7-ey-acute-angle-closure-glaucoma-triad",
      name: "Acute Angle-Closure Glaucoma Diagnostic Recognition (Shallow Anterior Chamber, Steamy Cornea & Elevated IOP 40-70)",
      category: "Angle-Closure Glaucoma",
      subType: "Severe Ocular Pain + Haloes &bull; Steamy Cornea &bull; Mid-Dilated Oval Pupil &bull; IOP 40-70 mmHg &bull; Rock-Hard Globe",
      proceduralProfile: "Ophthalmic emergency caused by sudden mechanical obstruction of the trabecular meshwork by the peripheral iris.",
      proceduralMechanism: "Pupillary block traps aqueous humor in the posterior chamber, bowing the peripheral iris forward and closing the angle.",
      clinicalHallmarks: "Unilateral ocular pain, headache, nausea, blurred vision with haloes, steamy cornea, fixed mid-dilated pupil, IOP >40 mmHg.",
      highYieldPearls: "Acute Angle-Closure Glaucoma features severe eye pain, haloes, steamy cornea, fixed mid-dilated pupil, and IOP 40-70 mmHg."
    },
    {
      id: "int7-ey-medical-iop-lowering-cocktail",
      name: "Emergency Medical IOP-Lowering Cocktail (IV Acetazolamide, Timolol, Apraclonidine & IV Mannitol 20%)",
      category: "IOP Cocktail",
      subType: "IV Acetazolamide 500mg + Topical Timolol 0.5% + Apraclonidine 1% + IV Mannitol 20% (1-2 g/kg)",
      proceduralProfile: "Aggressive multi-pathway pharmacological regimen rapidly suppressing aqueous humor synthesis and vitreous volume.",
      proceduralMechanism: "Carbonic anhydrase and beta-receptor blockade shut down aqueous secretion; Mannitol osmotically shrinks the vitreous.",
      clinicalHallmarks: "Administer IV Acetazolamide 500mg, Timolol 0.5%, Apraclonidine 1%, and IV Mannitol 20% immediately upon presentation.",
      highYieldPearls: "Emergency IOP cocktail: IV Acetazolamide 500mg + topical Timolol + Apraclonidine + IV Mannitol 20% rapidly lower IOP."
    },
    {
      id: "int7-ey-pilocarpine-laser-iridotomy",
      name: "Parasympathomimetic Pilocarpine & Laser Iridotomy (Pilocarpine 2% Dosing Rule & Bilateral Laser Peripheral Iridotomy)",
      category: "Definitive Cure",
      subType: "Pilocarpine 2% (ONLY when IOP <40 mmHg) &bull; Bilateral Laser Peripheral Iridotomy (LPI) &bull; Iris Bypass",
      proceduralProfile: "Definitive mechanical and surgical restoration of aqueous humor drainage pathways.",
      proceduralMechanism: "Pilocarpine induces miosis, pulling iris away from trabecular mesh; LPI creates a permanent iris bypass channel.",
      clinicalHallmarks: "Withhold Pilocarpine until IOP <40 mmHg (iris sphincter is ischemic at higher pressures); perform bilateral LPI once clear.",
      highYieldPearls: "Give Pilocarpine 2% ONLY after IOP drops <40 mmHg (ischemic sphincter unresponsive); perform bilateral Laser Iridotomy."
    },
    {
      id: "int7-ey-crao-foveal-cherry-red-spot",
      name: "Central Retinal Artery Occlusion Ischemia (Milky-White Retinal Edema, Foveal Cherry-Red Spot & Ocular Massage)",
      category: "CRAO Ischemia",
      subType: "Sudden Painless Vision Loss &bull; Pale Edematous Retina &bull; Cherry-Red Spot at Fovea &bull; Ocular Massage <4-6h",
      proceduralProfile: "Emergency retinal infarction resulting from embolic or thrombotic occlusion of the central retinal artery ('eye stroke').",
      proceduralMechanism: "Ischemia of the inner 2/3 of the retina causes cell swelling and opacification; the thin fovea transmits choroidal red.",
      clinicalHallmarks: "Sudden, severe, painless monocular blindness; fundoscopy shows milky-white retina with bright cherry-red foveal spot.",
      highYieldPearls: "CRAO presents with sudden painless vision loss and a fundoscopic 'cherry-red spot'; emergency ocular massage within <4-6 hours."
    }
  ],

  ent: [
    {
      id: "int7-en-kiesselbach-vs-woodruff-epistaxis",
      name: "Kiesselbach vs Woodruff Vascular Epistaxis Localization (Anterior Little's Area vs Posterior Sphenopalatine Artery)",
      category: "Epistaxis Vascular",
      subType: "Anterior (90%): Kiesselbach's Plexus &bull; Posterior (10%): Woodruff's / Sphenopalatine Artery &bull; Compression",
      proceduralProfile: "Vascular differentiation between anterior septal capillary bleeding and posterior arterial hemorrhage.",
      proceduralMechanism: "Anterior bleeding arises from anastomotic mucosal plexus; posterior arises from branches of sphenopalatine artery.",
      clinicalHallmarks: "Anterior bleeds resolve with 10-15m direct pinching and silver nitrate cautery; posterior bleeds flow down pharynx.",
      highYieldPearls: "Anterior epistaxis arises from Kiesselbach's plexus (90%); posterior epistaxis arises from Woodruff's plexus (sphenopalatine artery)."
    },
    {
      id: "int7-en-posterior-nasal-packing-tamponade",
      name: "Posterior Nasal Packing & Tamponade Protocols (Dual-Balloon Catheter, Continuous Pulse Oximetry & TSS Prophylaxis)",
      category: "Posterior Packing",
      subType: "Dual-Balloon Catheter / Foley 10-14 Fr &bull; Inpatient Admission + Continuous SpO2 &bull; Oral Augmentin for TSS",
      proceduralProfile: "Emergency tamponade protocol controlling profuse posterior nasopharyngeal arterial hemorrhage.",
      proceduralMechanism: "Inflated balloon compresses the sphenopalatine and descending palatine arteries against the choana and nasal walls.",
      clinicalHallmarks: "Insert dual-balloon catheter or Foley with 5-10 mL saline; admit with continuous SpO2 (nasopulmonary reflex) and antibiotics.",
      highYieldPearls: "Posterior nasal packing requires inpatient admission with continuous pulse oximetry and prophylactic antibiotics (TSS prevention)."
    },
    {
      id: "int7-en-peritonsillar-abscess-tetrad",
      name: "Peritonsillar Abscess Diagnostic Tetrad (Severe Odynophagia, Trismus, Hot-Potato Voice & Uvular Deviation)",
      category: "Quinsy Tetrad",
      subType: "Severe Unilateral Throat Pain + Trismus (Internal Pterygoid Spasm) + Hot-Potato Voice + Contralateral Uvular Deviation",
      proceduralProfile: "Clinical identification of suppurative collection in the peritonsillar space between tonsil capsule and pharyngeal constrictor.",
      proceduralMechanism: "Bacterial spread from intratonsillar crypts leads to cellulitis and pocketed purulent abscess formation.",
      clinicalHallmarks: "Unilateral palatine tonsillar bulge displacing uvula to opposite side, severe trismus, and drooling with muffled voice.",
      highYieldPearls: "Peritonsillar Abscess (Quinsy) tetrad: Unilateral sore throat, 'hot potato' voice, trismus, and contralateral uvular deviation."
    },
    {
      id: "int7-en-guarded-needle-aspiration-id",
      name: "Guarded Needle Aspiration & Incision and Drainage (Superior Tonsillar Pole Landmark & Carotid Artery Protection)",
      category: "Quinsy Drainage",
      subType: "Guarded 19G Needle (1-1.5 cm Exposed) &bull; Superior Pole Maximal Fluctuance &bull; IV Ampicillin-Sulbactam + Steroid",
      proceduralProfile: "Emergency bedside decompressive drainage and antimicrobial therapy for peritonsillar abscess.",
      proceduralMechanism: "Evacuation of pus relieves local tension and trismus; guards prevent fatal internal carotid artery puncture.",
      clinicalHallmarks: "Aspirate at point of maximal fluctuance using a guarded needle (tape exposed 1 cm); administer IV Ampicillin-Sulbactam + Dexamethasone.",
      highYieldPearls: "Aspirate quinsy with a guarded needle (1-1.5 cm exposed to protect internal carotid artery) + IV Ampicillin-Sulbactam + Dexamethasone."
    }
  ]
};

interface ClinicalInt7LabViewerProps {
  initialMode?: Int7LabMode;
  height?: string;
  onNodeSelect?: (node: Int7LabNode) => void;
}

export default function ClinicalInt7LabViewer({
  initialMode = "derm",
  height = "560px",
  onNodeSelect,
}: ClinicalInt7LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Int7LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return INT7_LAB_NODES[activeMode] || INT7_LAB_NODES.derm;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Int7LabNode) => {
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
            <Sparkles size={14} /> INT-507
          </span>
          <span className={styles.titleText}>
            {activeMode === "derm" && "Inpatient Dermatology: SJS/TEN Spectrum, SCORTEN Prognostication & Erythroderma"}
            {activeMode === "psych" && "Emergency Psychiatry: NMS (Dantrolene), Serotonin Syndrome & Rapid Tranquilization (B52)"}
            {activeMode === "eye" && "Ophthalmic Emergencies: Acute Angle-Closure Glaucoma (IOP Cocktail) & CRAO Ischemia"}
            {activeMode === "ent" && "ENT Emergencies: Severe Epistaxis (Posterior Balloon Packing) & Quinsy Drainage"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Subspecialty Consult Quiz"}
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
                <div className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                  Subspecialty Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Subspecialty Protocol: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-orange-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-orange-950 text-xs rounded border border-orange-700 text-orange-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Dermatology */}
          {activeMode === "derm" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> SJS/TEN &amp; Inpatient Dermatologic Emergencies
                </span>
                <span className="text-[11px] text-slate-400">SJS &lt;10% &bull; TEN &gt;30% &bull; Nikolsky Sign &bull; SCORTEN &bull; IVIG/Cyclosporine</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-orange-300 font-bold">SJS / TEN Cutaneous Detachment</div>
                  <div className="text-slate-300 mt-1">SJS affects &lt;10% TBSA; TEN affects &gt;30% TBSA with multi-mucosal erosions and positive Nikolsky sign. Stop all offending medications immediately. Admit to specialized Burn ICU.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-orange-300 font-bold">SCORTEN Score &amp; Resuscitation</div>
                  <div className="text-slate-300 mt-1">SCORTEN &ge;5 predicts &gt;90% mortality. Administer high-dose IVIG (1-2 g/kg over 3-4 days) or Cyclosporine (3-5 mg/kg/day) with non-adherent sterile dressings and proactive eye care.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Psychiatry */}
          {activeMode === "psych" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Emergency Psychiatry (NMS vs Serotonin Syndrome)
                </span>
                <span className="text-[11px] text-slate-400">NMS Lead-Pipe Rigidity &bull; Dantrolene &bull; Serotonin Clonus &bull; Cyproheptadine &bull; B52</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-orange-300 font-bold">NMS vs Serotonin Syndrome</div>
                  <div className="text-slate-300 mt-1">NMS: D2 antagonists, severe 'lead-pipe' rigidity, hyperthermia, CK &gt;10k; treat with Dantrolene + Bromocriptine. Serotonin Syndrome: SSRIs, hyperreflexia, clonus; treat with Cyproheptadine.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-orange-300 font-bold">Rapid Tranquilization Protocol</div>
                  <div className="text-slate-300 mt-1">For severe violent agitation: IM Haloperidol 5 mg + Lorazepam 2 mg + Diphenhydramine 50 mg ('B52 Regimen') provides rapid behavioral control while preventing acute extrapyramidal dystonias.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Eye */}
          {activeMode === "eye" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye size={14} /> Ophthalmic Emergencies (AACG &amp; CRAO)
                </span>
                <span className="text-[11px] text-slate-400">IOP 40-70 mmHg &bull; Acetazolamide + Mannitol &bull; Pilocarpine when IOP &lt;40 &bull; Laser Iridotomy &bull; CRAO</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-orange-300 font-bold">Acute Angle-Closure Glaucoma</div>
                  <div className="text-slate-300 mt-1">Severe eye pain, haloes, steamy cornea, fixed mid-dilated pupil, IOP 40-70 mmHg. Medical cocktail: IV Acetazolamide 500mg + Timolol 0.5% + Apraclonidine 1% + IV Mannitol 20%.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-orange-300 font-bold">Pilocarpine Rule &amp; CRAO Ischemia</div>
                  <div className="text-slate-300 mt-1">Give Pilocarpine 2% ONLY when IOP drops &lt;40 mmHg (ischemic sphincter unresponsive at higher pressures). Perform bilateral Laser Iridotomy. CRAO: Sudden painless loss with foveal cherry-red spot.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: ENT */}
          {activeMode === "ent" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors size={14} /> ENT Emergencies (Epistaxis &amp; Quinsy Drainage)
                </span>
                <span className="text-[11px] text-slate-400">Kiesselbach vs Woodruff &bull; Posterior Balloon &bull; Quinsy Trismus &bull; Guarded Needle I&amp;D</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-orange-300 font-bold">Anterior vs Posterior Epistaxis</div>
                  <div className="text-slate-300 mt-1">Anterior (90%): Kiesselbach's plexus on septum. Posterior (10%): Woodruff's / sphenopalatine artery. Posterior packing requires hospital admission, continuous pulse oximetry, and antibiotics for TSS.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-orange-300 font-bold">Peritonsillar Abscess (Quinsy)</div>
                  <div className="text-slate-300 mt-1">Unilateral tonsillar bulge, trismus, hot potato voice, contralateral uvular deviation. Aspirate with a guarded 19G needle (1 cm exposed to protect carotid) + IV Ampicillin-Sulbactam + Dexamethasone.</div>
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
                    <span className="text-orange-400 font-bold">Protocol:</span> {node.proceduralProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Subspecialty Protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Consult Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Subspecialty Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Subspecialty Pathophysiology</div>
            <div className="text-xs text-orange-300 font-semibold">{activeNode.proceduralProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Actions</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Consult Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("derm")}
          className={`${styles.modeTab} ${activeMode === "derm" ? styles.modeTabActive : ""}`}
        >
          🧴 1. SJS/TEN &amp; Derm
        </button>
        <button
          onClick={() => setActiveMode("psych")}
          className={`${styles.modeTab} ${activeMode === "psych" ? styles.modeTabActive : ""}`}
        >
          🧠 2. NMS &amp; Psychiatry
        </button>
        <button
          onClick={() => setActiveMode("eye")}
          className={`${styles.modeTab} ${activeMode === "eye" ? styles.modeTabActive : ""}`}
        >
          👁️ 3. Glaucoma &amp; Eye
        </button>
        <button
          onClick={() => setActiveMode("ent")}
          className={`${styles.modeTab} ${activeMode === "ent" ? styles.modeTabActive : ""}`}
        >
          👂 4. Epistaxis &amp; ENT
        </button>
      </div>
    </div>
  );
}
