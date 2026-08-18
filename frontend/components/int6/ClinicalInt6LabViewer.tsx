"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalInt6LabViewer.module.css";
import {
  Users,
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
  Activity,
  ClipboardList,
  Wind,
  Zap,
} from "lucide-react";

export type Int6LabMode = "ntep" | "malaria" | "primary" | "nutrition";

export interface Int6LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const INT6_LAB_NODES: Record<Int6LabMode, Int6LabNode[]> = {
  ntep: [
    {
      id: "int6-nt-cbnaat-molecular-diagnostics",
      name: "NTEP Tuberculosis Molecular Diagnostics (CBNAAT GeneXpert MTB/RIF & Sputum Algorithms)",
      category: "TB Diagnostics",
      subType: "Upfront CBNAAT / Truenat &bull; Sputum for Presumptive TB &bull; Simultaneous Rifampicin Resistance Detection",
      proceduralProfile: "Real-time automated cartridge-based PCR diagnostic identifying Mycobacterium tuberculosis and rpoB gene mutations.",
      proceduralMechanism: "Amplifies IS6110 and rpoB core region in 2 hours, eliminating culture delays.",
      clinicalHallmarks: "Presumptive TB (cough &ge;2 weeks, fever, night sweats, weight loss) mandates upfront CBNAAT testing.",
      highYieldPearls: "Upfront molecular testing (CBNAAT / GeneXpert MTB/RIF) is the mandatory first diagnostic test for presumptive TB."
    },
    {
      id: "int6-nt-ds-tb-fdc-regimens",
      name: "Drug-Sensitive TB Regimens & Fixed-Dose Combinations (2HRZE Intensive + 4HRE Continuation Phase & 99DOTS)",
      category: "DS-TB Regimens",
      subType: "2HRZE (2m Isoniazid, Rifampicin, Pyrazinamide, Ethambutol) + 4HRE (4m Continuation) &bull; Daily FDCs",
      proceduralProfile: "Standardized weight-banded daily oral regimen for drug-sensitive pulmonary and extrapulmonary tuberculosis.",
      proceduralMechanism: "Combination bactericidal and sterilizing agents rapidly reduce bacillary load and eradicate persisting persisters.",
      clinicalHallmarks: "Daily weight-banded 4-drug FDC for 2 months followed by 3-drug FDC for 4 months; digital 99DOTS tracking.",
      highYieldPearls: "Standard DS-TB regimen: 2HRZE Intensive Phase (2 months) followed by 4HRE Continuation Phase (4 months) daily."
    },
    {
      id: "int6-nt-nacp-treat-all-tld-regimen",
      name: "NACP Treat All First-Line Antiretroviral Regimen (TLD Tenofovir + Lamivudine + Dolutegravir Single Tablet)",
      category: "NACP Treat All",
      subType: "TLD: Tenofovir (300 mg) + Lamivudine (300 mg) + Dolutegravir (50 mg) Single Tablet Daily &bull; Lifelong ART",
      proceduralProfile: "Universal public health antiretroviral strategy initiating therapy on all confirmed HIV cases immediately.",
      proceduralMechanism: "Dolutegravir (integrase strand transfer inhibitor) provides rapid viral suppression with high genetic barrier to resistance.",
      clinicalHallmarks: "Initiate single-tablet TLD immediately upon HIV diagnosis regardless of CD4 count; monitor viral load at 6 and 12 months.",
      highYieldPearls: "'Treat All' Policy: All individuals diagnosed with HIV start daily TLD (TDF+3TC+DTG) immediately regardless of CD4 count."
    },
    {
      id: "int6-nt-post-exposure-prophylaxis-pep",
      name: "Post-Exposure Prophylaxis Protocols (PEP Initiation &le;72h & 28-Day Regimen Adherence)",
      category: "PEP Protocols",
      subType: "Initiate PEP within &le;72h of Exposure &bull; TLD Regimen for 28 Full Days &bull; Baseline & Serial HIV Testing",
      proceduralProfile: "Emergency short-course antiretroviral prophylaxis preventing HIV seroconversion following occupational/sexual exposure.",
      proceduralMechanism: "Blocks viral integration into host CD4+ T-cell genome during initial local replication and dendritic presentation.",
      clinicalHallmarks: "Start TLD regimen immediately (ideally within 2 hours, maximum 72 hours) and maintain uninterrupted for 28 days.",
      highYieldPearls: "HIV Post-Exposure Prophylaxis (PEP) must be initiated within 72 hours of exposure and continued for exactly 28 days."
    }
  ],

  malaria: [
    {
      id: "int6-ma-falciparum-act-regimens",
      name: "Plasmodium falciparum Artemisinin Regimens (ACT-SP 3-Day Course & Gametocytocidal Primaquine)",
      category: "P. falciparum",
      subType: "ACT-SP (Artesunate + SP) for 3 Days &bull; Single Dose Primaquine (0.75 mg/kg) on Day 2 &bull; Gametocytocidal",
      proceduralProfile: "First-line combination schizontocidal and gametocytocidal therapy for uncomplicated falciparum malaria.",
      proceduralMechanism: "Artesunate rapidly clears asexual parasitemia; Primaquine clears sexual gametocytes, interrupting transmission.",
      clinicalHallmarks: "Administer 3 days of oral ACT-SP plus a single dose of Primaquine 0.75 mg/kg on Day 2 (avoid in pregnancy/infancy).",
      highYieldPearls: "P. falciparum requires 3 days of ACT-SP PLUS a single gametocytocidal dose of Primaquine (0.75 mg/kg) on Day 2."
    },
    {
      id: "int6-ma-vivax-radical-cure-primaquine",
      name: "Plasmodium vivax Anti-Hypnozoite Radical Cure (Chloroquine 3 Days + Primaquine 14 Days & G6PD Safety)",
      category: "P. vivax Cure",
      subType: "Chloroquine (25 mg/kg over 3 Days) + Primaquine (0.25 mg/kg Daily for 14 Days) &bull; Check G6PD Status",
      proceduralProfile: "Definitive dual-action antimalarial therapy eliminating erythrocytic forms and dormant liver hypnozoites.",
      proceduralMechanism: "Chloroquine eradicates blood-stage schizonts; 14 days of Primaquine clears hepatic hypnozoites, preventing relapses.",
      clinicalHallmarks: "Verify normal G6PD status; dispense 3 days Chloroquine followed by 14 days of daily Primaquine (0.25 mg/kg/day).",
      highYieldPearls: "P. vivax radical cure requires 3 days of Chloroquine PLUS 14 full days of Primaquine (0.25 mg/kg/day) to clear hypnozoites."
    },
    {
      id: "int6-ma-severe-malaria-iv-artesunate",
      name: "Severe Malaria Parenteral Protocols (Intravenous Artesunate 2.4 mg/kg Dosing & Hypoglycemia Checks)",
      category: "Severe Malaria",
      subType: "IV Artesunate 2.4 mg/kg at 0, 12, 24 Hours &bull; Cerebral Malaria / Renal Failure &bull; Switch to Oral ACT",
      proceduralProfile: "Emergency intravenous antimalarial treatment for complicated falciparum or vivax malaria with organ dysfunction.",
      proceduralMechanism: "Rapid cleavage of endoperoxide bridge generates reactive oxygen species, destroying cytoadherent trophozoites.",
      clinicalHallmarks: "Administer IV Artesunate 2.4 mg/kg at 0, 12, and 24 hours, then daily until oral intake tolerated; monitor blood glucose.",
      highYieldPearls: "Intravenous Artesunate (2.4 mg/kg at 0, 12, 24h) is the drug of choice for severe malaria in all age groups."
    },
    {
      id: "int6-ma-dengue-critical-phase-triage",
      name: "Dengue Staging & Critical Phase Fluid Titration (NS1 Antigen, Hematocrit Plasma Leakage & Fluid Management)",
      category: "Dengue Protocol",
      subType: "NS1 (Day 1-5) &bull; IgM (Day 5+) &bull; Critical Phase (Day 3-7): Hct Rise &ge;20% &bull; Titrate Isotonic Crystalloids",
      proceduralProfile: "Bedside triage and fluid protocol preventing severe dengue shock syndrome and iatrogenic fluid overload.",
      proceduralMechanism: "Transient endothelial glycocalyx disruption produces capillary leakage during defervescence (Days 3-7).",
      clinicalHallmarks: "Monitor for warning signs (abdominal pain, persistent vomiting, mucosal bleed); titrate crystalloids to hematocrit.",
      highYieldPearls: "Dengue Critical Phase (Days 3-7): Meticulously titrate IV crystalloids during plasma leakage; stop fluids once afebrile."
    }
  ],

  primary: [
    {
      id: "int6-pr-ayushman-bharat-hwc-tiers",
      name: "Ayushman Bharat Health & Wellness Centre Tiers (Sub-Centre CHO + PHC Medical Officer + CHC Specialists)",
      category: "Ayushman Bharat",
      subType: "SHC (CHO + ANM/ASHA, 5k pop) &bull; PHC (MO MBBS, 30k pop) &bull; CHC (FRU Specialists, 120k pop) &bull; 12 CPHC Packages",
      proceduralProfile: "Institutional hierarchy delivering comprehensive primary healthcare and financial risk protection.",
      proceduralMechanism: "Decentralized wellness centers expand access from selective maternal/child care to universal NCD coverage.",
      clinicalHallmarks: "Community Health Officer (CHO) leads Sub-Centre; PHC provides medical officer consultations and tele-medicine.",
      highYieldPearls: "Ayushman Bharat transforms Sub-Centres and PHCs into Health & Wellness Centres delivering 12 CPHC service packages."
    },
    {
      id: "int6-pr-ncd-population-screening-cbac",
      name: "NCD Population-Based Screening CBAC Framework (Door-to-Door Screening for Age &ge;30 & Hypertension Algorithms)",
      category: "NCD Screening",
      subType: "Community Based Assessment Checklist (CBAC) for &ge;30 Years &bull; SBP &ge;140/90 &bull; Telmisartan / Amlodipine",
      proceduralProfile: "Universal door-to-door community risk assessment for early detection of hypertension, diabetes, and cancers.",
      proceduralMechanism: "Early pharmacotherapy and lifestyle modifications halt microvascular and macrovascular target organ damage.",
      clinicalHallmarks: "ASHA completes CBAC for age &ge;30; individuals with high risk or BP &ge;140/90 start Telmisartan 40 mg or Amlodipine 5 mg.",
      highYieldPearls: "Population-Based Screening (PBS) utilizes CBAC checklists for all adults aged &ge;30 to detect hypertension, diabetes, and oral/breast/cervical cancer."
    },
    {
      id: "int6-pr-naco-sti-color-coded-kits",
      name: "NACO STI/RTI Syndromic Management Kits (Kit 1 Grey Urethral Discharge & Kit 2 Green Vaginitis)",
      category: "STI Syndromic Kits",
      subType: "Kit 1 Grey: Azithromycin 1g + Cefixime 400mg &bull; Kit 2 Green: Secnidazole 2g + Fluconazole 150mg &bull; Partner Treatment",
      proceduralProfile: "Standardized point-of-care color-coded antimicrobial pre-packs treating mixed sexually transmitted syndromes.",
      proceduralMechanism: "Empiric combination therapy eradicates major co-pathogens without relying on unavailable diagnostic microscopy.",
      clinicalHallmarks: "Dispense Kit 1 (Grey) for male urethral discharge; dispense Kit 2 (Green) for vaginal discharge; treat sex partners.",
      highYieldPearls: "NACO STI Kit 1 (Grey): Azithromycin 1g + Cefixime 400mg for urethral/cervical discharge; Kit 2 (Green) for vaginitis."
    },
    {
      id: "int6-pr-esanjeevani-teleconsultation",
      name: "eSanjeevani Teleconsultation & Rural Health Outreach (Digital Diagnostics, Medicine Dispensation & FRU Referral)",
      category: "Digital Health",
      subType: "Doctor-to-Doctor Teleconsultation (HWC to Hub Specialist) &bull; eSanjeevani HWC Platform &bull; Continuum of Care",
      proceduralProfile: "National telemedicine system connecting rural primary healthcare providers with hospital specialists.",
      proceduralMechanism: "Real-time video/data transmission enables expert specialty consults at the primary care level, reducing travel burdens.",
      clinicalHallmarks: "CHO initiates eSanjeevani teleconsultation with District Hospital specialists for complex medical cases.",
      highYieldPearls: "eSanjeevani connects rural Health & Wellness Centres with specialist hubs for real-time virtual tele-consultations."
    }
  ],

  nutrition: [
    {
      id: "int6-nu-universal-immunization-schedule",
      name: "Universal Immunization Programme Milestone Grid (BCG, Pentavalent, Rotavirus, fIPV, PCV & MR Booster)",
      category: "UIP Schedule",
      subType: "Birth: BCG + OPV0 + HepB &bull; 6, 10, 14w: Penta + Rota + fIPV + PCV &bull; 9-12m: MR1 + JE1 + Vit A &bull; 16-24m: MR2 + DPT-B",
      proceduralProfile: "National routine childhood immunization schedule protecting against 12 vaccine-preventable diseases.",
      proceduralMechanism: "Active antigenic stimulation induces long-lived humoral and cell-mediated memory immunity in pediatric cohorts.",
      clinicalHallmarks: "Ensure BCG (0.1 mL ID left deltoid), Pentavalent (IM anterolateral thigh), and MR (SC right upper arm) are timely.",
      highYieldPearls: "UIP Schedule: Birth (BCG, OPV-0, HepB); 6, 10, 14 weeks (Pentavalent, Rotavirus, fIPV, PCV); 9 months (MR-1, Vit A)."
    },
    {
      id: "int6-nu-sam-screening-nrc-protocols",
      name: "Severe Acute Malnutrition Screening & NRC Protocols (MUAC <11.5 cm, WHZ <-3 SD & F-75/F-100 Formulas)",
      category: "SAM Management",
      subType: "MUAC <11.5 cm OR WHZ <-3 SD OR Bilateral Edema &bull; Admit to NRC &bull; F-75 Starter &rarr; F-100 Catch-up &bull; RUTF",
      proceduralProfile: "Targeted nutritional resuscitation protocol for infants and young children with life-threatening acute wasting.",
      proceduralMechanism: "Initial low-protein F-75 formula stabilizes metabolic imbalances without refeeding syndrome; F-100 promotes rapid weight gain.",
      clinicalHallmarks: "Red zone on Shakir strip (MUAC <11.5 cm) mandates NRC admission; start F-75 milk, antibiotics, and warm environment.",
      highYieldPearls: "Severe Acute Malnutrition (SAM) is defined by MUAC <11.5 cm, Weight-for-Height <-3 SD, or bilateral nutritional edema."
    },
    {
      id: "int6-nu-10-step-outbreak-investigation",
      name: "10-Step Epidemiological Outbreak Investigation (Case Definition, Epidemic Curve & Spot Map Clustering)",
      category: "Outbreak Steps",
      subType: "1. Confirm Outbreak &bull; 2. Verify Diagnosis &bull; 3. Case Def &bull; 4. Epi-Curve/Spot Map &bull; 6. Case-Control (Odds Ratio)",
      proceduralProfile: "Systematic scientific methodology to identify the source, transmission route, and control measures for disease clusters.",
      proceduralMechanism: "Descriptive and analytical epidemiology identifies etiologic vehicles to interrupt disease transmission chains.",
      clinicalHallmarks: "Plot epidemic curve (time) and spot map (place); calculate Odds Ratio to confirm source; implement source control.",
      highYieldPearls: "10-Step Outbreak Framework: Define cases, plot Epi-Curve and Spot Map, calculate Odds Ratio/RR, and implement immediate source control."
    },
    {
      id: "int6-nu-point-source-control-chlorination",
      name: "Point-Source Epidemic Control & Water Chlorination (Odds Ratio Calculation, Super-Chlorination & ORS Delivery)",
      category: "Source Control",
      subType: "Point-Source Common Vehicle &bull; High Odds Ratio &bull; Super-Chlorination (0.5 mg/L Free Chlorine) &bull; Halogen Tablets",
      proceduralProfile: "Environmental sanitization and medical emergency response to water-borne enteric epidemic outbreaks.",
      proceduralMechanism: "Hypochlorous acid disrupts bacterial cell wall integrity and viral capsids, sterilizing contaminated water sources.",
      clinicalHallmarks: "Super-chlorinate implicated wells (target 0.5 ppm residual chlorine); distribute ORS packets and water purification tablets.",
      highYieldPearls: "Point-source water outbreaks require super-chlorination of village water sources (0.5 mg/L residual chlorine) and ORS distribution."
    }
  ]
};

interface ClinicalInt6LabViewerProps {
  initialMode?: Int6LabMode;
  height?: string;
  onNodeSelect?: (node: Int6LabNode) => void;
}

export default function ClinicalInt6LabViewer({
  initialMode = "ntep",
  height = "560px",
  onNodeSelect,
}: ClinicalInt6LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Int6LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return INT6_LAB_NODES[activeMode] || INT6_LAB_NODES.ntep;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Int6LabNode) => {
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
            <Users size={14} /> INT-506
          </span>
          <span className={styles.titleText}>
            {activeMode === "ntep" && "National Health Programs: NTEP TB Regimens (2HRZE/4HRE) & NACP Treat All (TLD)"}
            {activeMode === "malaria" && "Vector-Borne Diseases: NVBDCP Malaria (ACT-SP & 14d Primaquine) & Dengue Triage"}
            {activeMode === "primary" && "Rural Primary Care: Ayushman Bharat HWCs, NCD Screening & STI Syndromic Kits"}
            {activeMode === "nutrition" && "Maternal-Child Health: Universal Immunization (UIP) & 10-Step Outbreak Control"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Public Health Quiz"}
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
                  Community Health Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Public Health Protocol: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: NTEP & NACP */}
          {activeMode === "ntep" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill size={14} /> National Tuberculosis &amp; AIDS Control Programs
                </span>
                <span className="text-[11px] text-slate-400">CBNAAT &bull; 2HRZE/4HRE &bull; Nikshay Poshan &bull; TLD Treat All &bull; PEP &le;72h</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">NTEP Tuberculosis Regimens</div>
                  <div className="text-slate-300 mt-1">Upfront CBNAAT/GeneXpert molecular testing. Standard DS-TB: 2 months Intensive Phase (2HRZE) + 4 months Continuation Phase (4HRE) as daily weight-banded FDCs with Nikshay 99DOTS adherence.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">NACP V &amp; Antiretroviral Regimens</div>
                  <div className="text-slate-300 mt-1">Treat All Policy: Lifelong single-tablet TLD (Tenofovir + Lamivudine + Dolutegravir) for all HIV patients immediately. PEP: Initiate TLD within 72 hours of exposure and continue for 28 days.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Malaria & Dengue */}
          {activeMode === "malaria" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Vector-Borne Diseases (NVBDCP Protocols)
                </span>
                <span className="text-[11px] text-slate-400">ACT-SP + Primaquine &bull; Chloroquine + 14d Primaquine &bull; IV Artesunate &bull; Dengue Critical Phase</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Malaria Treatment Regimens</div>
                  <div className="text-slate-300 mt-1">P. falciparum: ACT-SP for 3 days + Primaquine 0.75 mg/kg on Day 2. P. vivax: Chloroquine 25 mg/kg over 3 days + Primaquine 0.25 mg/kg daily for 14 days (radical cure; check G6PD). Severe: IV Artesunate 2.4 mg/kg.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Dengue Critical Phase Management</div>
                  <div className="text-slate-300 mt-1">NS1 Antigen positive on Days 1-5; IgM antibodies on Day 5+. Critical phase (Days 3-7): Watch for hematocrit rise &ge;20% and plasma leakage; titrate isotonic crystalloids and avoid fluid overload.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Primary Care & HWCs */}
          {activeMode === "primary" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Rural Primary Care &amp; Ayushman Bharat HWCs
                </span>
                <span className="text-[11px] text-slate-400">Sub-Centre CHO &bull; PHC Medical Officer &bull; NCD CBAC Age &ge;30 &bull; STI Color Kits</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Ayushman Bharat HWC Hierarchy</div>
                  <div className="text-slate-300 mt-1">Sub-Centre HWC led by Community Health Officer (CHO) and ANM/ASHA (5k pop); PHC HWC led by MBBS Medical Officer (30k pop); CHC First Referral Unit (120k pop). 12 Comprehensive CPHC packages.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">NCD Screening &amp; STI Syndromic Kits</div>
                  <div className="text-slate-300 mt-1">CBAC checklist for all adults &ge;30. NACO STI Kits: Kit 1 (Grey: Azithromycin 1g + Cefixime 400mg) for urethral discharge; Kit 2 (Green: Secnidazole 2g + Fluconazole 150mg) for vaginitis; partner treatment mandatory.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Nutrition & Outbreak */}
          {activeMode === "nutrition" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck size={14} /> Maternal-Child Nutrition &amp; Outbreak Control
                </span>
                <span className="text-[11px] text-slate-400">UIP Vaccination &bull; SAM MUAC &lt;11.5 cm &bull; NRC F-75/F-100 &bull; 10-Step Epi Investigation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">UIP Immunization &amp; SAM Criteria</div>
                  <div className="text-slate-300 mt-1">UIP schedule: Birth (BCG, OPV0, HepB); 6, 10, 14w (Pentavalent, Rota, fIPV, PCV); 9m (MR1, Vit A). Severe Acute Malnutrition: MUAC &lt;11.5 cm or WHZ &lt;-3 SD; manage in NRC with F-75 and F-100 milk formulas.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">10-Step Outbreak Investigation</div>
                  <div className="text-slate-300 mt-1">1. Confirm outbreak; 2. Verify diagnosis; 3. Case definition; 4. Epi-Curve &amp; Spot Map; 5. Hypotheses; 6. Analytical study (Odds Ratio); 8. Source control (super-chlorination of wells with 0.5 mg/L residual chlorine).</div>
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
                    <span className="text-emerald-400 font-bold">Protocol:</span> {node.proceduralProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Public Health Protocol</span>
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
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Community Outreach Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Programmatic Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Epidemiological Mechanism</div>
            <div className="text-xs text-emerald-300 font-semibold">{activeNode.proceduralProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Actions</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Public Health Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("ntep")}
          className={`${styles.modeTab} ${activeMode === "ntep" ? styles.modeTabActive : ""}`}
        >
          💊 1. NTEP &amp; NACP
        </button>
        <button
          onClick={() => setActiveMode("malaria")}
          className={`${styles.modeTab} ${activeMode === "malaria" ? styles.modeTabActive : ""}`}
        >
          🦟 2. Malaria &amp; Dengue
        </button>
        <button
          onClick={() => setActiveMode("primary")}
          className={`${styles.modeTab} ${activeMode === "primary" ? styles.modeTabActive : ""}`}
        >
          🏥 3. Primary Care HWCs
        </button>
        <button
          onClick={() => setActiveMode("nutrition")}
          className={`${styles.modeTab} ${activeMode === "nutrition" ? styles.modeTabActive : ""}`}
        >
          👶 4. Nutrition &amp; Outbreak
        </button>
      </div>
    </div>
  );
}
