"use client";

import React, { useState, useMemo } from "react";
import styles from "./GeneticsLabViewer.module.css";
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
} from "lucide-react";

export type GeneticsLabMode = "aneuploidy" | "mendelian" | "imprinting" | "diagnostics";

export interface GeneticsLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  cytogeneticMechanism: string;
  diagnosticCriteria: string;
  clinicalPresentation: string;
  highYieldPearl: string;
}

export const GENETICS_NODES: Record<GeneticsLabMode, GeneticsLabNode[]> = {
  aneuploidy: [
    {
      id: "gen-down-syndrome-trisomy-21",
      name: "Down Syndrome (Trisomy 21)",
      category: "Autosomal Aneuploidy",
      subType: "Meiotic Nondisjunction (95%) • Robertsonian rob(14;21) (4%) • Mosaicism (1%)",
      cytogeneticMechanism: "Maternal Meiosis I nondisjunction linked to advanced maternal age. Complete atrioventricular canal defect and duodenal atresia.",
      diagnosticCriteria: "Karyotype 47,XX,+21 or 47,XY,+21. Karyotype 46,XX,+21,rob(14;21) in translocation. Elevated hCG/inhibin A, low AFP/estriol in quad screen.",
      clinicalPresentation: "Flat facies, upslanting fissures, epicanthal folds, Brushfield spots, single palmar crease, duodenal atresia ('double bubble'), AV canal defect.",
      highYieldPearl: "Children with Down syndrome have a 500-fold increased risk of developing Acute Megakaryoblastic Leukemia (AMKL / M7 AML) before age 5."
    },
    {
      id: "gen-edwards-patau-syndromes",
      name: "Edwards (Trisomy 18) & Patau (Trisomy 13)",
      category: "Autosomal Aneuploidy",
      subType: "Trisomy 18 (Clenched Hands / Rocker-Bottom) • Trisomy 13 (Holoprosencephaly / Clefts)",
      cytogeneticMechanism: "Edwards: Chromosome 18 nondisjunction. Patau: Chromosome 13 nondisjunction causing defective prechordal mesoderm fusion.",
      diagnosticCriteria: "Edwards: Clenched fists with overlapping fingers, rocker-bottom feet, micrognathia. Patau: Holoprosencephaly, microphthalmia, cutis aplasia, polydactyly.",
      clinicalPresentation: "Severe intellectual disability, congenital heart defects, rocker-bottom feet. Mortality >90% within the first year of life.",
      highYieldPearl: "Clenched fists with the 2nd index finger overlapping the 3rd, and 5th over 4th, combined with rocker-bottom feet is pathognomonic for Edwards syndrome (Trisomy 18)."
    },
    {
      id: "gen-turner-klinefelter-syndromes",
      name: "Turner (45,X) & Klinefelter (47,XXY) Syndromes",
      category: "Sex Chromosome Aneuploidies",
      subType: "Turner (Streak Ovaries / Bicuspid Aorta) • Klinefelter (Hypergonadotropic / Gynecomastia)",
      cytogeneticMechanism: "Turner: Loss of paternal sex chromosome (SHOX haploinsufficiency). Klinefelter: Extra X chromosome in male (Barr body positive).",
      diagnosticCriteria: "Turner: 45,X karyotype, elevated FSH/LH, streak gonads. Klinefelter: 47,XXY karyotype, elevated FSH/LH, low testosterone, azoospermia.",
      clinicalPresentation: "Turner: Webbed neck, shield chest, short stature, coarctation of aorta, primary amenorrhea. Klinefelter: Tall eunuchoid habitus, gynecomastia, small firm testes.",
      highYieldPearl: "Turner syndrome (45,X) is the most common cause of primary amenorrhea with high gonadotropins (hypergonadotropic hypogonadism) and streak gonads."
    }
  ],

  mendelian: [
    {
      id: "gen-autosomal-dominant-recessive",
      name: "Autosomal Dominant vs Autosomal Recessive",
      category: "Mendelian Patterns",
      subType: "AD (50% Risk, Vertical, FBN1/HTT/FGFR3) • AR (25% Risk, Horizontal, CFTR/HBB/HEXA)",
      cytogeneticMechanism: "AD: Structural protein defects / gain of function. AR: Enzymatic deficiencies / loss of function (consanguinity increases risk).",
      diagnosticCriteria: "AD: Male-to-male transmission, affects every generation. AR: Siblings affected, parents unaffected carriers (25% recurrence).",
      clinicalPresentation: "AD: Marfan (aortic root dilatation), Achondroplasia (dwarfism). AR: Cystic Fibrosis (DeltaF508), Sickle Cell Anemia, Phenylketonuria.",
      highYieldPearl: "Achondroplasia exhibits full penetrance; >80% of cases are caused by de novo gain-of-function mutations in FGFR3 strongly associated with advanced paternal age."
    },
    {
      id: "gen-mitochondrial-heteroplasmy-lhon",
      name: "Mitochondrial Inheritance & Heteroplasmy (MELAS/LHON)",
      category: "Non-Mendelian Genetics",
      subType: "Strict Maternal Transmission (0% from Fathers) • Heteroplasmy Threshold Effect • LHON & MELAS",
      cytogeneticMechanism: "Mitochondrial DNA transmitted exclusively via maternal oocyte. Unequal partitioning of mutant vs normal mtDNA causes variable tissue severity.",
      diagnosticCriteria: "Affected mother passes mutation to 100% of children. Affected father passes to 0% of offspring. Homoplasmic or heteroplasmic mtDNA mutations.",
      clinicalPresentation: "LHON (painless bilateral central vision loss in young adults), MELAS (stroke-like episodes and lactic acidosis), MERRF (ragged red fibers).",
      highYieldPearl: "An affected father with a mitochondrial disease (such as Leber Hereditary Optic Neuropathy) has a 0% recurrence risk of transmitting the condition to his biological children."
    }
  ],

  imprinting: [
    {
      id: "gen-prader-willi-vs-angelman-15q",
      name: "Genomic Imprinting: Prader-Willi vs Angelman (15q11-q13)",
      category: "Epigenetics & Imprinting",
      subType: "Prader-Willi (Paternal 15q Loss / Maternal UPD) • Angelman (Maternal 15q Loss / UBE3A)",
      cytogeneticMechanism: "Parent-of-origin differential DNA methylation. PWS: Loss of active paternal alleles (SNRPN). AS: Loss of active maternal allele (UBE3A ligase).",
      diagnosticCriteria: "Methylation-Specific PCR (MS-PCR) is the gold standard first test. 70% deletion, 25% uniparental disomy (UPD).",
      clinicalPresentation: "PWS: Neonatal hypotonia -> Early childhood hyperphagia and morbid obesity. AS: Ataxia, paroxysms of laughter ('happy puppet'), seizures, severe ID.",
      highYieldPearl: "In Prader-Willi syndrome, the biphasic switch from severe neonatal hypotonia/feeding failure to insatiable hyperphagia and morbid obesity occurs around age 2 to 3."
    },
    {
      id: "gen-trinucleotide-repeat-huntington-fragile-x",
      name: "Trinucleotide Repeats & Genetic Anticipation",
      category: "Dynamic Mutations",
      subType: "Huntington (CAG polyQ) • Fragile X (CGG FMR1) • Myotonic Dystrophy (CTG) • Friedreich (GAA)",
      cytogeneticMechanism: "Dynamic slippage and expansion during gametogenesis causing earlier onset and greater severity in subsequent generations (Anticipation).",
      diagnosticCriteria: "Huntington: CAG >=36-40. Fragile X: CGG >200 (promoter hypermethylation). Myotonic Dystrophy: CTG >50. Friedreich: intronic GAA.",
      clinicalPresentation: "Huntington (caudate atrophy, chorea, dementia). Fragile X (macroorchidism, long face, large ears, autism). Myotonic (myotonia, cataracts, balding).",
      highYieldPearl: "Fragile X syndrome is caused by a CGG trinucleotide expansion (>200 repeats) leading to epigenetic hypermethylation and transcriptional silencing of the FMR1 gene."
    }
  ],

  diagnostics: [
    {
      id: "gen-cma-karyotype-fish-acmg",
      name: "Molecular Cytogenetic Hierarchy (CMA, FISH, NGS)",
      category: "Diagnostic Genomics",
      subType: "Karyotype (5-10 Mb) • FISH (100-200 kb) • CMA (20-50 kb First-Tier) • ACMG 5-Tier Variant",
      cytogeneticMechanism: "Chromosomal microarray (array CGH/SNP) detects submicroscopic copy number variations (CNVs). ACMG classifies variants from Class 5 to Class 1.",
      diagnosticCriteria: "CMA is FIRST-TIER for unexplained intellectual disability, developmental delay, autism, and multiple congenital anomalies.",
      clinicalPresentation: "Detects submicroscopic microdeletions (22q11.2 DiGeorge, 7q11.23 Williams) that are invisible on standard G-banded karyotyping.",
      highYieldPearl: "Chromosomal Microarray (CMA) is the first-tier diagnostic investigation for patients with unexplained intellectual disability, autism, or multiple congenital anomalies."
    }
  ]
};

interface GeneticsLabViewerProps {
  initialMode?: GeneticsLabMode;
  height?: string;
  onNodeSelect?: (node: GeneticsLabNode) => void;
}

export default function GeneticsLabViewer({
  initialMode = "aneuploidy",
  height = "560px",
  onNodeSelect,
}: GeneticsLabViewerProps) {
  const [activeMode, setActiveMode] = useState<GeneticsLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Aneuploidy Syndrome State
  const [selectedAneuploidy, setSelectedAneuploidy] = useState<"down" | "edwards" | "patau" | "turner" | "klinefelter">("down");

  // 15q11-q13 Imprinting Switch State
  const [selectedImprinting, setSelectedImprinting] = useState<"pws" | "as">("pws");

  // Aneuploidy Details
  const aneuploidyDetails = useMemo(() => {
    if (selectedAneuploidy === "down") {
      return {
        title: "Down Syndrome (Trisomy 21 • 47,XX,+21 / 47,XY,+21)",
        mechanism: "95% Maternal Meiosis I Nondisjunction (linked to advanced maternal age); 4% Robertsonian Translocation rob(14;21).",
        cardinalFindings: "Duodenal atresia ('double bubble'), Complete Atrioventricular Canal defect, Brushfield spots, AMKL (M7 AML) risk.",
        color: "text-indigo-400 font-bold"
      };
    } else if (selectedAneuploidy === "edwards") {
      return {
        title: "Edwards Syndrome (Trisomy 18 • 47,XX,+18 / 47,XY,+18)",
        mechanism: "Meiotic nondisjunction of chromosome 18. Maternal age related. Severe multiorgan dysgenesis.",
        cardinalFindings: "Clenched fists with 2nd over 3rd and 5th over 4th overlapping fingers, Rocker-bottom feet, Micrognathia, >90% infant mortality.",
        color: "text-blue-400 font-bold"
      };
    } else if (selectedAneuploidy === "patau") {
      return {
        title: "Patau Syndrome (Trisomy 13 • 47,XX,+13 / 47,XY,+13)",
        mechanism: "Meiotic nondisjunction of chromosome 13. Defective prechordal mesoderm development.",
        cardinalFindings: "Holoprosencephaly, Cleft lip and palate, Microphthalmia, Cutis aplasia (scalp defect), Postaxial polydactyly, >90% mortality.",
        color: "text-purple-400 font-bold"
      };
    } else if (selectedAneuploidy === "turner") {
      return {
        title: "Turner Syndrome (45,X • Female Phenotype)",
        mechanism: "Paternal meiotic loss of sex chromosome (70%). SHOX gene haploinsufficiency causes short stature.",
        cardinalFindings: "Streak ovaries, primary amenorrhea, high FSH/LH, webbed neck (cystic hygroma), Bicuspid aortic valve (30%), Coarctation of aorta.",
        color: "text-pink-400 font-bold"
      };
    } else {
      return {
        title: "Klinefelter Syndrome (47,XXY • Male Phenotype)",
        mechanism: "Maternal or paternal nondisjunction. Presence of one inactive Barr body in phenotypic male.",
        cardinalFindings: "Tall eunuchoid stature, gynecomastia, testicular atrophy/fibrosis, hypergonadotropic hypogonadism, azoospermia, female pubic hair pattern.",
        color: "text-amber-400 font-bold"
      };
    }
  }, [selectedAneuploidy]);

  const imprintingDetails = useMemo(() => {
    if (selectedImprinting === "pws") {
      return {
        syndrome: "Prader-Willi Syndrome (PWS)",
        defect: "Loss of active PATERNAL 15q11-q13 genes (SNRPN/NDN).",
        causes: "70% Paternal microdeletion; 25% Maternal Uniparental Disomy (UPD).",
        phenotype: "Severe neonatal hypotonia ('floppy infant') & poor suckling -> Hyperphagia, morbid obesity, hypogonadism & small hands/feet.",
        test: "Methylation-Specific PCR (MS-PCR) shows maternal-only methylation pattern."
      };
    } else {
      return {
        syndrome: "Angelman Syndrome (AS • 'Happy Puppet')",
        defect: "Loss of active MATERNAL 15q11-q13 gene (UBE3A ubiquitin ligase).",
        causes: "70% Maternal microdeletion; 10% UBE3A mutation; 5% Paternal UPD.",
        phenotype: "Paroxysms of inappropriate laughter, jerky puppet-like ataxic gait, severe speech impairment, microcephaly & seizures.",
        test: "Methylation-Specific PCR + UBE3A targeted sequencing."
      };
    }
  }, [selectedImprinting]);

  const currentNodes = useMemo(() => {
    return GENETICS_NODES[activeMode] || GENETICS_NODES.aneuploidy;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: GeneticsLabNode) => {
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
            <Award size={14} /> GEN-201
          </span>
          <span className={styles.titleText}>
            {activeMode === "aneuploidy" && "Chromosomal Aneuploidies (Trisomies 21, 18, 13, Turner & Klinefelter)"}
            {activeMode === "mendelian" && "Mendelian Inheritance Modes, Mitochondrial Heteroplasmy & Penetrance"}
            {activeMode === "imprinting" && "Genomic Imprinting (15q11-q13 PWS vs AS) & Trinucleotide Expansions"}
            {activeMode === "diagnostics" && "Molecular Cytogenetics (Karyotype, FISH, CMA 1st-Tier) & ACMG Tiers"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Genetics Quiz"}
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
                  Medical Genetics Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Genetic Disorder: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: Aneuploidy Selector */}
          {activeMode === "aneuploidy" && (
            <div className={styles.genSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Chromosomal Aneuploidy Karyotype Explorer
                </span>
                <span className="text-[11px] text-slate-400">Trisomies &bull; Sex Chromosomes</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <button
                  onClick={() => setSelectedAneuploidy("down")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAneuploidy === "down"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Trisomy 21 (Down)
                </button>
                <button
                  onClick={() => setSelectedAneuploidy("edwards")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAneuploidy === "edwards"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Trisomy 18 (Edwards)
                </button>
                <button
                  onClick={() => setSelectedAneuploidy("patau")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAneuploidy === "patau"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Trisomy 13 (Patau)
                </button>
                <button
                  onClick={() => setSelectedAneuploidy("turner")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAneuploidy === "turner"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Turner (45,X)
                </button>
                <button
                  onClick={() => setSelectedAneuploidy("klinefelter")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAneuploidy === "klinefelter"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Klinefelter (47,XXY)
                </button>
              </div>

              <div className={styles.genResultsGrid}>
                <div className={styles.genResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Syndrome &amp; Karyotype</div>
                  <div className={`text-xs font-bold mt-1 ${aneuploidyDetails.color}`}>{aneuploidyDetails.title}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div><strong className="text-indigo-400">Cytogenetic Mechanism:</strong> {aneuploidyDetails.mechanism}</div>
                <div className="mt-1"><strong className="text-indigo-400">Cardinal Malformations:</strong> {aneuploidyDetails.cardinalFindings}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Mendelian & Mitochondrial */}
          {activeMode === "mendelian" && (
            <div className={styles.genSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Mendelian Recurrence Risks &amp; Maternal Heteroplasmy
                </span>
                <span className="text-[11px] text-slate-400">AD &bull; AR &bull; XLR &bull; mtDNA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                  <div className="text-indigo-300 font-bold">Autosomal Dominant</div>
                  <div className="text-slate-300 mt-1">50% transmission risk per child. Vertical pedigree. Examples: Marfan, Achondroplasia, Huntington.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                  <div className="text-indigo-300 font-bold">Autosomal Recessive</div>
                  <div className="text-slate-300 mt-1">25% affected, 50% carrier from carrier parents. Consanguinity increases risk. Examples: CF, PKU.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                  <div className="text-indigo-300 font-bold">Mitochondrial (mtDNA)</div>
                  <div className="text-slate-300 mt-1">Mother passes to 100% of children; Father passes to 0%. Heteroplasmy threshold. Example: LHON, MELAS.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Imprinting & Trinucleotide */}
          {activeMode === "imprinting" && (
            <div className={styles.genSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> 15q11-q13 Genomic Imprinting Switch
                </span>
                <span className="text-[11px] text-slate-400">PWS vs Angelman</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setSelectedImprinting("pws")}
                  className={`p-2.5 rounded font-bold border transition ${
                    selectedImprinting === "pws"
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Prader-Willi Syndrome (Paternal Loss)
                </button>
                <button
                  onClick={() => setSelectedImprinting("as")}
                  className={`p-2.5 rounded font-bold border transition ${
                    selectedImprinting === "as"
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Angelman Syndrome (Maternal Loss)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{imprintingDetails.syndrome}</div>
                <div className="text-slate-300 mt-1 font-medium"><strong className="text-indigo-400">Molecular Defect:</strong> {imprintingDetails.defect}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Etiology Breakdown:</strong> {imprintingDetails.causes}</div>
                <div className="text-amber-300 mt-1.5 font-bold">{imprintingDetails.phenotype}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Molecular Diagnostics & ACMG */}
          {activeMode === "diagnostics" && (
            <div className={styles.genSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} /> Molecular Diagnostic Hierarchy &amp; ACMG Tiers
                </span>
                <span className="text-[11px] text-slate-400">CMA First-Tier &bull; WES/WGS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Chromosomal Microarray (CMA)</div>
                  <div className="text-slate-300 mt-1">Resolution 20–50 kb. <strong>First-tier diagnostic test</strong> for unexplained intellectual disability, autism, and multiple congenital anomalies.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">ACMG Variant Tiers</div>
                  <div className="text-slate-300 mt-1">Class 5 (Pathogenic &gt;99%), Class 4 (Likely Pathogenic &gt;90%), Class 3 (VUS - do NOT alter surgical management), Class 1 (Benign).</div>
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
                    <span className="text-indigo-400 font-bold">Presentation:</span> {node.clinicalPresentation}
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

        {/* Right Side: High-Yield Genetics Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Genetics Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Topic &amp; Focus</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Cytogenetic &amp; Molecular Mechanism</div>
            <div className={styles.inspectorBody}>{activeNode.cytogeneticMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Presentation</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Genetic Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("aneuploidy")}
          className={`${styles.modeTab} ${activeMode === "aneuploidy" ? styles.modeTabActive : ""}`}
        >
          🧬 1. Aneuploidy Karyotypes
        </button>
        <button
          onClick={() => setActiveMode("mendelian")}
          className={`${styles.modeTab} ${activeMode === "mendelian" ? styles.modeTabActive : ""}`}
        >
          👨‍👩‍👧 2. Mendelian &amp; mtDNA
        </button>
        <button
          onClick={() => setActiveMode("imprinting")}
          className={`${styles.modeTab} ${activeMode === "imprinting" ? styles.modeTabActive : ""}`}
        >
          ✨ 3. Imprinting &amp; Repeats
        </button>
        <button
          onClick={() => setActiveMode("diagnostics")}
          className={`${styles.modeTab} ${activeMode === "diagnostics" ? styles.modeTabActive : ""}`}
        >
          🔍 4. CMA &amp; ACMG Diagnostics
        </button>
      </div>
    </div>
  );
}
