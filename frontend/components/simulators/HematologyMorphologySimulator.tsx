'use client';

import React, { useState, useMemo } from 'react';
import {
  CompleteBloodCount,
  PeripheralDifferential,
  RbcMorphologyFeatures,
  BoneMarrowFeatures,
  MolecularCytogenetics,
  CairoBishopTlsParams,
  evaluateHematologyMorphology,
  HEMATOLOGY_PRESETS,
} from '../../.gemini/skills/HematologyMorphologyEngine';
import {
  Microscope,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Sparkles,
  RefreshCw,
  Droplets,
  Flame,
  FileText,
  Sliders,
  Dna,
} from 'lucide-react';

export default function HematologyMorphologySimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('acute-promyelocytic-leukemia-apml');

  // CBC state
  const [wbc, setWbc] = useState<number>(14.5);
  const [hb, setHb] = useState<number>(7.8);
  const [mcv, setMcv] = useState<number>(92);
  const [plt, setPlt] = useState<number>(18);
  const [retic, setRetic] = useState<number>(0.4);

  // Differential state
  const [blasts, setBlasts] = useState<number>(8);
  const [promyelocytes, setPromyelocytes] = useState<number>(68);
  const [myelocytes, setMyelocytes] = useState<number>(4);
  const [metamyelocytes, setMetamyelocytes] = useState<number>(2);
  const [neutrophils, setNeutrophils] = useState<number>(10);
  const [lymphocytes, setLymphocytes] = useState<number>(6);

  // RBC Morphology state
  const [schistocytes, setSchistocytes] = useState<boolean>(true);
  const [spherocytes, setSpherocytes] = useState<boolean>(false);
  const [targetCells, setTargetCells] = useState<boolean>(false);
  const [tearDrops, setTearDrops] = useState<boolean>(false);
  const [sickleCells, setSickleCells] = useState<boolean>(false);
  const [biteCells, setBiteCells] = useState<boolean>(false);
  const [rouleaux, setRouleaux] = useState<boolean>(false);
  const [auerRods, setAuerRods] = useState<boolean>(true);

  // Marrow state
  const [cellularity, setCellularity] = useState<number>(95);
  const [marrowMyeloid, setMarrowMyeloid] = useState<number>(85);
  const [marrowErythroid, setMarrowErythroid] = useState<number>(5);
  const [marrowPlasma, setMarrowPlasma] = useState<number>(1);
  const [marrowBlasts, setMarrowBlasts] = useState<number>(75);
  const [dryTap, setDryTap] = useState<boolean>(false);

  // Molecular state
  const [bcrAbl1, setBcrAbl1] = useState<boolean>(false);
  const [pmlRara, setPmlRara] = useState<boolean>(true);
  const [jak2, setJak2] = useState<boolean>(false);
  const [flowMarkers, setFlowMarkers] = useState<string[]>(['CD33+', 'CD13+', 'MPO+', 'CD34-', 'HLA-DR-']);

  // TLS Cairo-Bishop state
  const [uricAcid, setUricAcid] = useState<number>(8.6);
  const [potassium, setPotassium] = useState<number>(5.8);
  const [phosphorus, setPhosphorus] = useState<number>(4.8);
  const [calcium, setCalcium] = useState<number>(7.2);
  const [creatinine, setCreatinine] = useState<number>(1.4);
  const [oliguria, setOliguria] = useState<boolean>(false);

  // Run Master Evaluation Engine
  const evaluation = useMemo(() => {
    const cbcObj: CompleteBloodCount = {
      wbc10x9L: wbc,
      hemoglobinGPerDl: hb,
      mcvFl: mcv,
      platelets10x9L: plt,
      reticulocytePct: retic,
    };
    const diffObj: PeripheralDifferential = {
      blastsPct: blasts,
      promyelocytesPct: promyelocytes,
      myelocytesPct: myelocytes,
      metamyelocytesPct: metamyelocytes,
      bandsPct: 2,
      segmentedNeutrophilsPct: neutrophils,
      lymphocytesPct: lymphocytes,
      monocytesPct: 2,
      eosinophilsPct: 0,
      basophilsPct: 0,
    };
    const rbcObj: RbcMorphologyFeatures = {
      schistocytesPresent: schistocytes,
      spherocytesPresent: spherocytes,
      targetCellsPresent: targetCells,
      tearDropDacryocytesPresent: tearDrops,
      sickleCellsDrepanocytesPresent: sickleCells,
      biteCellsDegmacytesPresent: biteCells,
      rouleauxFormationPresent: rouleaux,
      howellJollyBodiesPresent: false,
      hypersegmentedNeutrophilsPresent: false,
      auerRodsPresent: auerRods,
    };
    const marrowObj: BoneMarrowFeatures = {
      cellularityPct: cellularity,
      myeloidPct: marrowMyeloid,
      erythroidPct: marrowErythroid,
      plasmaCellsPct: marrowPlasma,
      blastCountMarrowPct: marrowBlasts,
      ringSideroblastsPresent: false,
      dryTapAspiration: dryTap,
    };
    const molecularObj: MolecularCytogenetics = {
      bcrAbl1T9_22: bcrAbl1,
      pmlRaraT15_17: pmlRara,
      jak2V617F: jak2,
      flowImmunophenotype: flowMarkers,
    };
    const tlsObj: CairoBishopTlsParams = {
      uricAcidMgDl: uricAcid,
      potassiumMeqL: potassium,
      phosphorusMgDl: phosphorus,
      calciumMgDl: calcium,
      creatinineMgDl: creatinine,
      oliguriaPresent: oliguria,
      seizuresOrArrhythmiasPresent: false,
    };

    return evaluateHematologyMorphology(cbcObj, diffObj, rbcObj, marrowObj, molecularObj, tlsObj);
  }, [
    wbc,
    hb,
    mcv,
    plt,
    retic,
    blasts,
    promyelocytes,
    myelocytes,
    metamyelocytes,
    neutrophils,
    lymphocytes,
    schistocytes,
    spherocytes,
    targetCells,
    tearDrops,
    sickleCells,
    biteCells,
    rouleaux,
    auerRods,
    cellularity,
    marrowMyeloid,
    marrowErythroid,
    marrowPlasma,
    marrowBlasts,
    dryTap,
    bcrAbl1,
    pmlRara,
    jak2,
    flowMarkers,
    uricAcid,
    potassium,
    phosphorus,
    calcium,
    creatinine,
    oliguria,
  ]);

  // Handle Preset Selection
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const p = HEMATOLOGY_PRESETS.find(item => item.id === id);
    if (p) {
      setWbc(p.cbc.wbc10x9L);
      setHb(p.cbc.hemoglobinGPerDl);
      setMcv(p.cbc.mcvFl);
      setPlt(p.cbc.platelets10x9L);
      setRetic(p.cbc.reticulocytePct);

      setBlasts(p.diff.blastsPct);
      setPromyelocytes(p.diff.promyelocytesPct);
      setMyelocytes(p.diff.myelocytesPct);
      setMetamyelocytes(p.diff.metamyelocytesPct);
      setNeutrophils(p.diff.segmentedNeutrophilsPct);
      setLymphocytes(p.diff.lymphocytesPct);

      setSchistocytes(p.rbc.schistocytesPresent);
      setSpherocytes(p.rbc.spherocytesPresent);
      setTargetCells(p.rbc.targetCellsPresent);
      setTearDrops(p.rbc.tearDropDacryocytesPresent);
      setSickleCells(p.rbc.sickleCellsDrepanocytesPresent);
      setBiteCells(p.rbc.biteCellsDegmacytesPresent);
      setRouleaux(p.rbc.rouleauxFormationPresent);
      setAuerRods(p.rbc.auerRodsPresent);

      setCellularity(p.marrow.cellularityPct);
      setMarrowMyeloid(p.marrow.myeloidPct);
      setMarrowErythroid(p.marrow.erythroidPct);
      setMarrowPlasma(p.marrow.plasmaCellsPct);
      setMarrowBlasts(p.marrow.blastCountMarrowPct);
      setDryTap(p.marrow.dryTapAspiration);

      setBcrAbl1(p.molecular.bcrAbl1T9_22);
      setPmlRara(p.molecular.pmlRaraT15_17);
      setJak2(p.molecular.jak2V617F);
      setFlowMarkers(p.molecular.flowImmunophenotype);

      setUricAcid(p.tls.uricAcidMgDl);
      setPotassium(p.tls.potassiumMeqL);
      setPhosphorus(p.tls.phosphorusMgDl);
      setCalcium(p.tls.calciumMgDl);
      setCreatinine(p.tls.creatinineMgDl);
      setOliguria(p.tls.oliguriaPresent);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100 p-2 sm:p-4">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-rose-950 border border-purple-600/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-400">
                <Microscope className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Hematology Smear &amp; Marrow Morphology Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                    WHO 2022 &amp; M:E Solver
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Peripheral blood smear morphology, bone marrow M:E ratio, acute vs chronic leukemic blast kinetics, and Cairo-Bishop tumor lysis triage.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">WBC:</span>{' '}
              <span className={`font-bold ${wbc >= 50 ? 'text-rose-400' : 'text-white'}`}>
                {wbc} &times;10&sup9;/L
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">M:E Ratio:</span>{' '}
              <span className={`font-bold ${evaluation.isMeRatioNormal ? 'text-emerald-400' : 'text-amber-400'}`}>
                {evaluation.myeloidToErythroidRatio} : 1
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">TLS:</span>{' '}
              <span className={`font-bold ${evaluation.tumorLysisSyndromeStage !== 'NONE' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {evaluation.tumorLysisSyndromeStage.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-5 pt-4 border-t border-purple-900/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5 mr-2">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Presets:
          </span>
          {HEMATOLOGY_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'bg-slate-800/80 text-zinc-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls (Left 5 cols) & Diagnostic Evaluation (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CBC, Differential, Smear Features, Marrow (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: CBC & Peripheral Differential */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" /> Complete Blood Count &amp; Diff
              </h2>
              <span className="font-mono text-purple-300 font-bold">
                Hb: {hb} g/dL | Plt: {plt}k
              </span>
            </div>

            {/* WBC Slider */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Total WBC Count:</span>
                <span className={`font-mono font-bold ${wbc >= 100 ? 'text-rose-400' : wbc >= 50 ? 'text-amber-400' : 'text-white'}`}>
                  {wbc} &times; 10&sup9;/L
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="180.0"
                step="0.5"
                value={wbc}
                onChange={e => setWbc(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
              />
              <div className="text-[10px] text-zinc-500">&gt; 50-100 in acute leukemia risks leukostasis</div>
            </div>

            {/* Hb & Plt Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Hemoglobin:</span>
                  <span className="font-mono font-bold text-rose-400">{hb} g/dL</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="18.0"
                  step="0.2"
                  value={hb}
                  onChange={e => setHb(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Platelets:</span>
                  <span className={`font-mono font-bold ${plt < 20 ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {plt} &times; 10&sup9;/L
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="600"
                  value={plt}
                  onChange={e => setPlt(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* Differential sliders: Blasts, Promyelocytes, Lymphocytes */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80">
              <div>
                <label className="text-zinc-400">Blasts: <span className="font-mono font-bold text-rose-400">{blasts}%</span></label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={blasts}
                  onChange={e => setBlasts(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500 mt-1"
                />
              </div>

              <div>
                <label className="text-zinc-400">Promyelo: <span className="font-mono font-bold text-purple-300">{promyelocytes}%</span></label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={promyelocytes}
                  onChange={e => setPromyelocytes(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500 mt-1"
                />
              </div>

              <div>
                <label className="text-zinc-400">Lymphs: <span className="font-mono font-bold text-cyan-300">{lymphocytes}%</span></label>
                <input
                  type="range"
                  min="0"
                  max="95"
                  value={lymphocytes}
                  onChange={e => setLymphocytes(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Bone Marrow & M:E Ratio */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-amber-400" /> Bone Marrow Aspirate &amp; Biopsy
              </h2>
              <span className="font-mono text-amber-400 font-bold">
                M:E {evaluation.myeloidToErythroidRatio}:1
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Myeloid Lineage:</span>
                  <span className="font-mono font-bold text-white">{marrowMyeloid}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={marrowMyeloid}
                  onChange={e => setMarrowMyeloid(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Erythroid Lineage:</span>
                  <span className="font-mono font-bold text-rose-400">{marrowErythroid}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={marrowErythroid}
                  onChange={e => setMarrowErythroid(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Marrow Blasts:</span>
                  <span className={`font-mono font-bold ${marrowBlasts >= 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {marrowBlasts}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="95"
                  value={marrowBlasts}
                  onChange={e => setMarrowBlasts(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
                <div className="text-[10px] text-zinc-500">&ge; 20% defines Acute Leukemia</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Plasma Cells:</span>
                  <span className={`font-mono font-bold ${marrowPlasma >= 10 ? 'text-amber-400' : 'text-white'}`}>
                    {marrowPlasma}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={marrowPlasma}
                  onChange={e => setMarrowPlasma(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                />
                <div className="text-[10px] text-zinc-500">&gt; 10% clonal = Myeloma criteria</div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={dryTap}
                onChange={e => setDryTap(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500"
              />
              <span className="text-zinc-300 font-semibold">Dry Tap on Aspiration (Fibrosis / Packing)</span>
            </label>
          </div>

          {/* Card 3: Microscopic Morphology Features Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Sliders className="w-4 h-4 text-cyan-400" /> Peripheral Smear Morphological Findings
            </h2>

            <div className="grid grid-cols-2 gap-2.5 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={schistocytes}
                  onChange={e => setSchistocytes(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500"
                />
                <span className="text-zinc-300">Schistocytes (Helmet Cells / TTP)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={auerRods}
                  onChange={e => setAuerRods(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500"
                />
                <span className="text-rose-300 font-semibold">Auer Rods / Faggot Cells</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tearDrops}
                  onChange={e => setTearDrops(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500"
                />
                <span className="text-zinc-300">Tear-Drops (Dacryocytes)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rouleaux}
                  onChange={e => setRouleaux(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span className="text-zinc-300">Rouleaux Formation (Coin Stacks)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={targetCells}
                  onChange={e => setTargetCells(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500"
                />
                <span className="text-zinc-300">Target Cells (Codocytes)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={spherocytes}
                  onChange={e => setSpherocytes(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-500"
                />
                <span className="text-zinc-300">Microspherocytes (HS / AIHA)</span>
              </label>
            </div>
          </div>

          {/* Card 4: Cairo-Bishop TLS Metabolic Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Flame className="w-4 h-4 text-amber-400" /> Cairo-Bishop Tumor Lysis Syndrome
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-zinc-400">Uric Acid: <span className={`font-mono font-bold ${uricAcid >= 8 ? 'text-rose-400' : 'text-white'}`}>{uricAcid}</span></label>
                <input
                  type="range"
                  min="2.0"
                  max="16.0"
                  step="0.2"
                  value={uricAcid}
                  onChange={e => setUricAcid(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500 mt-1"
                />
              </div>

              <div>
                <label className="text-zinc-400">Potassium: <span className={`font-mono font-bold ${potassium >= 6 ? 'text-rose-400' : 'text-white'}`}>{potassium}</span></label>
                <input
                  type="range"
                  min="3.0"
                  max="8.0"
                  step="0.1"
                  value={potassium}
                  onChange={e => setPotassium(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500 mt-1"
                />
              </div>

              <div>
                <label className="text-zinc-400">Phos: <span className={`font-mono font-bold ${phosphorus >= 4.5 ? 'text-rose-400' : 'text-white'}`}>{phosphorus}</span></label>
                <input
                  type="range"
                  min="2.0"
                  max="10.0"
                  step="0.2"
                  value={phosphorus}
                  onChange={e => setPhosphorus(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-zinc-400">Calcium: <span className={`font-mono font-bold ${calcium <= 7 ? 'text-rose-400' : 'text-white'}`}>{calcium} mg/dL</span></label>
                <input
                  type="range"
                  min="5.0"
                  max="14.0"
                  step="0.2"
                  value={calcium}
                  onChange={e => setCalcium(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-500 mt-1"
                />
              </div>

              <div>
                <label className="text-zinc-400">Creatinine: <span className={`font-mono font-bold ${creatinine >= 1.8 ? 'text-rose-400' : 'text-white'}`}>{creatinine} mg/dL</span></label>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={creatinine}
                  onChange={e => setCreatinine(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500 mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Synthesis, Emergency Action & Workup (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Primary Diagnosis Callout Banner */}
          <div
            className={`p-5 rounded-2xl border ${
              evaluation.emergencyActionRequired
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                : evaluation.category === 'NORMAL_PERIPHERAL_SMEAR'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                : 'bg-purple-950/40 border-purple-800/80 text-purple-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <ShieldAlert className="w-5 h-5 shrink-0 text-purple-400" />
                <span>{evaluation.categoryTitle}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-900/80 border border-slate-700">
                {evaluation.category.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs leading-relaxed font-medium opacity-90">
              {evaluation.morphologySummary}
            </p>
          </div>

          {/* Emergency Action Plan & Urgent Interventions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-400" /> Action Plan &amp; Critical Emergency Interventions
              </h3>
              {evaluation.emergencyActionRequired && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-rose-900/80 text-rose-300 border border-rose-600 animate-pulse">
                  CRITICAL ACTION REQUIRED
                </span>
              )}
            </div>

            <p className="text-xs leading-relaxed text-zinc-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              {evaluation.recommendedAction}
            </p>

            {evaluation.leukostasisRisk !== 'NONE' && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>
                  <strong>Leukostasis Alert:</strong> Microvascular occlusion risk is {evaluation.leukostasisRisk.replace(/_/g, ' ')}. Hyperhydration and urgent cytoreduction required.
                </span>
              </div>
            )}
          </div>

          {/* Multi-Modality Morphology & Cytogenetics Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Dna className="w-4 h-4 text-cyan-400" /> Bone Marrow Metrics &amp; Diagnostic Confirmation Checklist
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Myeloid:Erythroid (M:E)</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    evaluation.isMeRatioNormal ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {evaluation.myeloidToErythroidRatio} : 1
                </div>
                <div className="text-[9px] text-zinc-500">Normal range: 1.5 - 4.5:1</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Blast Burden</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    marrowBlasts >= 20 || blasts >= 20 ? 'text-rose-400' : 'text-cyan-300'
                  }`}
                >
                  {Math.max(marrowBlasts, blasts)}%
                </div>
                <div className="text-[9px] text-zinc-500">&ge; 20% = Acute Leukemia</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Cairo-Bishop Criteria</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    evaluation.tlsCriteriaCount >= 2 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {evaluation.tlsCriteriaCount} / 4 Met
                </div>
                <div className="text-[9px] text-zinc-500">&ge; 2 met = Lab TLS</div>
              </div>
            </div>

            {/* Confirmatory Workup Checklist */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" /> Essential Confirmatory Workup:
              </span>
              <ul className="space-y-1 text-zinc-400 font-sans text-[11px]">
                {evaluation.confirmatoryWorkup.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Pearls (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <Droplets className="w-4 h-4" /> 1. The M:E Ratio &amp; Hyperplasia
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The normal myeloid-to-erythroid (M:E) ratio ranges from 2:1 to 4:1. An elevated M:E ratio (&gt; 5:1) indicates myeloid hyperplasia (infection, leukemoid reaction, or CML) or erythroid hypoplasia (pure red cell aplasia). A depressed M:E ratio (&lt; 1.5:1) reflects erythroid hyperplasia driven by erythropoietin in hemolytic anemias (TTP, hereditary spherocytosis) or ineffective erythropoiesis.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" /> 2. APML, Auer Rods &amp; Emergent ATRA
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Acute Promyelocytic Leukemia (APML) is a true medical emergency. Abnormal promyelocytes release procoagulant granules that trigger catastrophic disseminated intravascular coagulation (DIC). Multiple stacked Auer rods (&ldquo;faggot cells&rdquo;) are pathognomonic. Oral All-Trans Retinoic Acid (ATRA) must be administered immediately upon morphological suspicion to induce blast differentiation and abort the consumptive coagulopathy.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4" /> 3. Cairo-Bishop TLS &amp; Leukostasis
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Laboratory Tumor Lysis Syndrome requires &ge;2 metabolic derangements within 3-7 days of chemotherapy: hyperuricemia (&ge;8 mg/dL), hyperkalemia (&ge;6 mEq/L), hyperphosphatemia (&ge;4.5 mg/dL), and hypocalcemia (&le;7 mg/dL). Clinical TLS adds acute kidney injury, seizures, or fatal cardiac arrhythmias. Recombinant urate oxidase (Rasburicase) converts insoluble uric acid to allantoin, preventing obstructive nephropathy.
          </p>
        </div>
      </div>
    </div>
  );
}
