"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Sliders,
  FileText,
  CheckCircle,
  AlertTriangle,
  Droplets,
  Calculator,
  RefreshCw,
  Info,
} from "lucide-react";
import RenalGraphs from "../../../components/simulators/RenalGraphs";
import {
  solveRenalFiltration,
  solveRenalClearance,
  solveFractionalSodiumExcretion,
} from "../../../lib/simulations/renalSolver";
import { asMmHg } from "../../../lib/simulations/types";

export default function RenalFiltrationLab() {
  // Mode tabs: 'starling' (Glomerular Filtration & Hemodynamics) vs 'clearance' (Clearance & FeNa Diagnostic Lab)
  const [activeTab, setActiveTab] = useState<"starling" | "clearance">("starling");

  // Control mode for starling: 'vascular' (Arteriolar resistances/radii) vs 'direct_pressures' (Direct Starling forces)
  const [controlMode, setControlMode] = useState<"vascular" | "direct_pressures">("vascular");

  // Vascular / Resistance inputs
  const [affRadius, setAffRadius] = useState<number>(10.0); // micrometers
  const [effRadius, setEffRadius] = useState<number>(10.0); // micrometers
  const [bloodPressure, setBloodPressure] = useState<number>(100); // mmHg MAP

  // Direct Starling Pressure inputs
  const [directPgc, setDirectPgc] = useState<number>(60.0); // Glomerular Capillary Hydrostatic Pressure (P_gc, mmHg)
  const [directPbs, setDirectPbs] = useState<number>(18.0); // Bowman's Space Hydrostatic Pressure (P_bs, mmHg)
  const [directPiGc, setDirectPiGc] = useState<number>(32.0); // Plasma Colloid Osmotic Pressure (pi_gc, mmHg)
  const [directPiBs, setDirectPiBs] = useState<number>(0.0); // Bowman's Space Colloid Pressure (pi_bs, mmHg)
  const [kf, setKf] = useState<number>(12.5); // Ultrafiltration coefficient (mL/min/mmHg)

  // Clearance & FeNa Calculator States
  const [clearanceSubstance, setClearanceSubstance] = useState<string>("Inulin");
  const [uConc, setUConc] = useState<number>(125); // mg/dL
  const [uFlow, setUFlow] = useState<number>(1.0); // mL/min
  const [pConc, setPConc] = useState<number>(1.0); // mg/dL

  // FeNa States
  const [uNa, setUNa] = useState<number>(15); // mEq/L
  const [pNa, setPNa] = useState<number>(140); // mEq/L
  const [uCr, setUCr] = useState<number>(150); // mg/dL
  const [pCr, setPCr] = useState<number>(2.0); // mg/dL

  const presets = [
    {
      name: "Normal Baseline",
      mode: "vascular" as const,
      aff: 10.0,
      eff: 10.0,
      bp: 100,
      pgc: 60.5,
      pbs: 18.0,
      piGc: 32.0,
      style: "hover:border-slate-500 bg-slate-800 text-white",
    },
    {
      name: "NSAID Toxicity (Afferent Constriction)",
      mode: "vascular" as const,
      aff: 6.8,
      eff: 10.0,
      bp: 100,
      pgc: 48.0,
      pbs: 18.0,
      piGc: 32.0,
      style: "hover:border-red-500 bg-red-950/20 text-red-400 border-red-900/40",
    },
    {
      name: "ACE Inhibitor (Efferent Dilation)",
      mode: "vascular" as const,
      aff: 10.0,
      eff: 14.0,
      bp: 100,
      pgc: 51.0,
      pbs: 18.0,
      piGc: 32.0,
      style: "hover:border-amber-500 bg-amber-950/20 text-amber-400 border-amber-900/40",
    },
    {
      name: "Angiotensin II (Efferent Constriction)",
      mode: "vascular" as const,
      aff: 10.0,
      eff: 7.8,
      bp: 90,
      pgc: 67.0,
      pbs: 18.0,
      piGc: 33.0,
      style: "hover:border-purple-500 bg-purple-950/20 text-purple-400 border-purple-900/40",
    },
    {
      name: "Nephrotic Syndrome (Low Oncotic πgc)",
      mode: "direct_pressures" as const,
      aff: 10.0,
      eff: 10.0,
      bp: 100,
      pgc: 60.0,
      pbs: 18.0,
      piGc: 19.0,
      style: "hover:border-emerald-500 bg-emerald-950/20 text-emerald-400 border-emerald-900/40",
    },
    {
      name: "Ureteral Obstruction (High Bowman Pbs)",
      mode: "direct_pressures" as const,
      aff: 10.0,
      eff: 10.0,
      bp: 100,
      pgc: 60.0,
      pbs: 34.0,
      piGc: 32.0,
      style: "hover:border-rose-500 bg-rose-950/20 text-rose-400 border-rose-900/40",
    },
  ];

  const applyPreset = (p: (typeof presets)[0]) => {
    setControlMode(p.mode);
    setAffRadius(p.aff);
    setEffRadius(p.eff);
    setBloodPressure(p.bp);
    setDirectPgc(p.pgc);
    setDirectPbs(p.pbs);
    setDirectPiGc(p.piGc);
  };

  // Real-time calculation using pure functional solveRenalFiltration
  const filtrationResults = useMemo(() => {
    if (controlMode === "direct_pressures") {
      return solveRenalFiltration({
        pGlomerularCapillary: asMmHg(directPgc),
        pBowmansSpace: asMmHg(directPbs),
        piGlomerularCapillary: asMmHg(directPiGc),
        piBowmansSpace: asMmHg(directPiBs),
        kf,
        meanArterialPressure: asMmHg(bloodPressure),
      });
    } else {
      return solveRenalFiltration({
        afferentRadius: affRadius,
        efferentRadius: effRadius,
        meanArterialPressure: asMmHg(bloodPressure),
        pBowmansSpace: asMmHg(directPbs),
        piBowmansSpace: asMmHg(directPiBs),
        kf,
      });
    }
  }, [
    controlMode,
    directPgc,
    directPbs,
    directPiGc,
    directPiBs,
    kf,
    affRadius,
    effRadius,
    bloodPressure,
  ]);

  // Keep directPgc and directPiGc synchronized when in vascular mode
  useEffect(() => {
    if (controlMode === "vascular") {
      setDirectPgc(filtrationResults.pGlomerularCapillary);
      setDirectPiGc(filtrationResults.piGlomerularCapillary);
    }
  }, [controlMode, filtrationResults.pGlomerularCapillary, filtrationResults.piGlomerularCapillary]);

  // Generate Autoregulation Curve data (GFR vs BP from 50 to 200 mmHg)
  const autoregData = useMemo(() => {
    const points = [];
    for (let bp = 50; bp <= 200; bp += 10) {
      const res = solveRenalFiltration({
        afferentRadius: affRadius,
        efferentRadius: effRadius,
        meanArterialPressure: asMmHg(bp),
        pBowmansSpace: asMmHg(directPbs),
        piBowmansSpace: asMmHg(directPiBs),
        kf,
      });
      points.push({
        bp,
        gfr: parseFloat(res.gfr.toFixed(1)),
      });
    }
    return points;
  }, [affRadius, effRadius, directPbs, directPiBs, kf]);

  // Starling Forces Balance Data for Bar Chart
  const starlingData = useMemo(() => {
    return [
      { name: "Capillary Hydrostatic (Pg)", value: filtrationResults.pGlomerularCapillary },
      { name: "Bowman's Space (Pb)", value: filtrationResults.pBowmansSpace },
      { name: "Colloid Osmotic (πG)", value: filtrationResults.piGlomerularCapillary },
      { name: "Net Filtration (NFP)", value: filtrationResults.netFiltrationPressure },
    ];
  }, [filtrationResults]);

  // Renal Clearance and FeNa Calculations
  const clearanceResults = useMemo(() => {
    return solveRenalClearance({
      urineConcentration: uConc,
      urineFlowRate: uFlow,
      plasmaConcentration: pConc,
      substanceName: clearanceSubstance,
      gfrReference: filtrationResults.gfr,
    });
  }, [uConc, uFlow, pConc, clearanceSubstance, filtrationResults.gfr]);

  const fenaResults = useMemo(() => {
    return solveFractionalSodiumExcretion({
      urineSodium: uNa,
      plasmaSodium: pNa,
      urineCreatinine: uCr,
      plasmaCreatinine: pCr,
    });
  }, [uNa, pNa, uCr, pCr]);

  const getClinicalState = () => {
    const gfr = filtrationResults.gfr;
    if (gfr < 30) {
      return {
        label: "Severe Renal Failure (Oliguric AKI / CKD Stage 4-5)",
        color: "text-red-400 bg-red-950/30 border-red-800/40",
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      };
    }
    if (gfr < 90) {
      return {
        label: "Impaired Renal Filtration (CKD Stage 2-3 equivalent)",
        color: "text-amber-400 bg-amber-950/30 border-amber-800/40",
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      };
    }
    if (gfr > 150) {
      return {
        label: "Glomerular Hyperfiltration State (Early Diabetic / Hypoalbuminemia)",
        color: "text-purple-400 bg-purple-950/30 border-purple-800/40",
        icon: <Activity className="w-5 h-5 text-purple-400" />,
      };
    }
    return {
      label: "Normal Physiological Glomerular Filtration",
      color: "text-emerald-400 bg-emerald-950/30 border-emerald-800/40",
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    };
  };

  const getVascularExplanation = () => {
    if (controlMode === "direct_pressures") {
      if (directPiGc < 25) {
        return {
          title: "Starling Forces: Hypoalbuminemic Hyperfiltration",
          mechanism:
            "Reduced plasma protein concentration lowers capillary oncotic pressure (π_gc), diminishing the opposing Starling force and accelerating net filtration into Bowman's space.",
        };
      }
      if (directPbs > 25) {
        return {
          title: "Starling Forces: Postrenal Hydrostatic Back-Pressure",
          mechanism:
            "Urinary tract obstruction (e.g., nephrolithiasis, BPH) elevates Bowman's space hydrostatic pressure (P_bs), opposing filtration and precipitating postrenal azotemia.",
        };
      }
      return {
        title: "Starling Forces: Direct Microvascular Balance",
        mechanism:
          "Filtration equilibrium is governed by the balance between outward hydrostatic driving pressure (P_gc) and opposing forces (P_bs + π_gc).",
      };
    }

    if (affRadius < 8.5) {
      if (bloodPressure > 140) {
        return {
          title: "Vessels: Myogenic Autoregulatory Response",
          mechanism:
            "The afferent arteriole constricts in response to elevated systemic perfusion pressure to shield the delicate glomerular capillary bed from hypertensive trauma.",
        };
      }
      return {
        title: "Vessels: Afferent Constriction (NSAIDs / Endothelin)",
        mechanism:
          "Constriction of the afferent arteriole increases pre-glomerular resistance, sharply dropping glomerular capillary hydrostatic pressure (P_gc), RBF, and GFR.",
      };
    }
    if (effRadius > 12.0) {
      return {
        title: "Vessels: Efferent Dilation (ACE Inhibitors / ARBs)",
        mechanism:
          "Dilation of the efferent arteriole decreases outflow resistance, allowing blood to exit the glomerulus rapidly. This decreases intraglomerular pressure (P_gc), lowering GFR while preserving overall RBF.",
      };
    }
    if (effRadius < 8.5) {
      return {
        title: "Vessels: Efferent Constriction (Angiotensin II)",
        mechanism:
          "Constriction of the efferent arteriole backs up blood in the glomerular capillaries, elevating P_gc and maintaining GFR despite reduced systemic renal blood flow.",
      };
    }
    return {
      title: "Vessels: Hemodynamically Balanced",
      mechanism:
        "Afferent and efferent arteriolar vascular tones are physiological, maintaining capillary hydrostatic pressure at ~60 mmHg and resting GFR at ~125 mL/min.",
    };
  };

  const clinicalState = getClinicalState();
  const vasExp = getVascularExplanation();

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/simulators"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Labs
        </Link>

        {/* Page Header */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
              <Droplets className="w-8 h-8 text-teal-400" />
              Renal Filtration <span className="text-teal-400">&</span> GFR Clearance Lab
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Explore Glomerular Starling forces [GFR = Kf × ((P_gc - P_bs) - (π_gc - π_bs))], arteriolar hemodynamics, and clinical clearance equations.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("starling")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "starling"
                  ? "bg-teal-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Filtration & Hemodynamics
            </button>
            <button
              onClick={() => setActiveTab("clearance")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "clearance"
                  ? "bg-teal-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Clearance & FeNa
            </button>
          </div>
        </header>

        {/* Diagnostic Status Card */}
        <div className={`p-4 md:p-5 rounded-2xl border flex gap-4 items-center mb-6 ${clinicalState.color}`}>
          {clinicalState.icon}
          <div className="flex-1">
            <h2 className="font-bold text-base md:text-lg text-white mb-0.5">
              Renal Filtration Status: {clinicalState.label}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Net Filtration Pressure (NFP) is currently{" "}
              <strong className="text-teal-300">{filtrationResults.netFiltrationPressure} mmHg</strong>, producing a GFR of{" "}
              <strong className="text-teal-300">{filtrationResults.gfr} mL/min</strong> with a Renal Blood Flow of{" "}
              <strong className="text-white">{filtrationResults.renalBloodFlow} mL/min</strong>.
            </p>
          </div>
        </div>

        {activeTab === "starling" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Presets & Mode Selector */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-5 shadow-xl">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" />
                    Clinical Physiology Presets
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyPreset(p)}
                        className={`px-2.5 py-1.5 rounded-lg border border-transparent text-xs font-semibold transition ${p.style}`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Control Mode:</span>
                    <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                      <button
                        onClick={() => setControlMode("vascular")}
                        className={`px-2.5 py-1 rounded font-semibold transition ${
                          controlMode === "vascular"
                            ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Arterioles
                      </button>
                      <button
                        onClick={() => setControlMode("direct_pressures")}
                        className={`px-2.5 py-1 rounded font-semibold transition ${
                          controlMode === "direct_pressures"
                            ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Direct Starling
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-5">
                  {controlMode === "vascular" ? (
                    <>
                      {/* Afferent Arteriolar Resistance / Radius */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">
                            Afferent Arteriole Radius (r_a)
                          </span>
                          <span className="text-teal-400 font-bold text-xs bg-teal-400/10 px-2 py-0.5 rounded">
                            {affRadius.toFixed(1)} μm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5.0"
                          max="20.0"
                          step="0.5"
                          value={affRadius}
                          onChange={(e) => setAffRadius(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Constriction (NSAIDs)</span>
                          <span>Dilation</span>
                        </div>
                      </div>

                      {/* Efferent Arteriolar Resistance / Radius */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">
                            Efferent Arteriole Radius (r_e)
                          </span>
                          <span className="text-teal-400 font-bold text-xs bg-teal-400/10 px-2 py-0.5 rounded">
                            {effRadius.toFixed(1)} μm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5.0"
                          max="20.0"
                          step="0.5"
                          value={effRadius}
                          onChange={(e) => setEffRadius(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Constriction (Ang II)</span>
                          <span>Dilation (ACE-I)</span>
                        </div>
                      </div>

                      {/* Systemic Blood Pressure */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">
                            Mean Arterial Pressure (MAP)
                          </span>
                          <span className="text-teal-400 font-bold text-xs bg-teal-400/10 px-2 py-0.5 rounded">
                            {bloodPressure} mmHg
                          </span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          step="5"
                          value={bloodPressure}
                          onChange={(e) => setBloodPressure(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Hypotension</span>
                          <span>Hypertension</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Glomerular Capillary Hydrostatic Pressure (P_gc) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">
                            Capillary Hydrostatic (P_gc)
                          </span>
                          <span className="text-blue-400 font-bold text-xs bg-blue-400/10 px-2 py-0.5 rounded">
                            {directPgc.toFixed(1)} mmHg
                          </span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="80"
                          step="1"
                          value={directPgc}
                          onChange={(e) => setDirectPgc(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>

                      {/* Bowman's Space Hydrostatic Pressure (P_bs) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">
                            Bowman Space Hydrostatic (P_bs)
                          </span>
                          <span className="text-rose-400 font-bold text-xs bg-rose-400/10 px-2 py-0.5 rounded">
                            {directPbs.toFixed(1)} mmHg
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="40"
                          step="1"
                          value={directPbs}
                          onChange={(e) => setDirectPbs(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                      </div>

                      {/* Glomerular Capillary Oncotic Pressure (pi_gc) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">
                            Plasma Colloid Oncotic (π_gc)
                          </span>
                          <span className="text-amber-400 font-bold text-xs bg-amber-400/10 px-2 py-0.5 rounded">
                            {directPiGc.toFixed(1)} mmHg
                          </span>
                        </div>
                        <input
                          type="range"
                          min="15"
                          max="50"
                          step="1"
                          value={directPiGc}
                          onChange={(e) => setDirectPiGc(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </>
                  )}

                  {/* Ultrafiltration Coefficient Kf */}
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-300">
                        Filtration Coefficient (K_f)
                      </span>
                      <span className="text-teal-400 font-bold text-xs bg-teal-400/10 px-2 py-0.5 rounded">
                        {kf.toFixed(1)} mL/min/mmHg
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="20.0"
                      step="0.5"
                      value={kf}
                      onChange={(e) => setKf(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Numerical Metrics Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-400" />
                  Glomerular Microcirculation Metrics
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400 font-medium">Glomerular Filtration Rate (GFR)</span>
                    <span className="font-black text-teal-400 text-sm">
                      {filtrationResults.gfr} mL/min
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Net Filtration Pressure (NFP)</span>
                    <span className="font-bold text-white">
                      {filtrationResults.netFiltrationPressure} mmHg
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Renal Blood Flow (RBF)</span>
                    <span className="font-bold text-white">
                      {filtrationResults.renalBloodFlow} mL/min
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Renal Plasma Flow (RPF)</span>
                    <span className="font-bold text-white">
                      {filtrationResults.renalPlasmaFlow} mL/min
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Filtration Fraction (FF = GFR/RPF)</span>
                    <span className="font-bold text-teal-300">
                      {filtrationResults.filtrationFraction}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Graphs & Educational Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <RenalGraphs
                autoregData={autoregData}
                starlingData={starlingData}
                currentBp={bloodPressure}
                currentGfr={filtrationResults.gfr}
              />

              {/* Physiological Mechanism Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3 shadow-lg">
                <h4 className="font-bold text-sm text-teal-400 flex items-center gap-2">
                  <Info className="w-4 h-4" /> {vasExp.title}
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {vasExp.mechanism}
                </p>
                <div className="mt-2 text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-400">
                  <strong className="text-white">Starling Filtration Law:</strong> GFR = K_f × [(P_gc - P_bs) - (π_gc - π_bs)] = {kf.toFixed(1)} × [({filtrationResults.pGlomerularCapillary} - {filtrationResults.pBowmansSpace}) - ({filtrationResults.piGlomerularCapillary} - {filtrationResults.piBowmansSpace})] = <span className="text-teal-400 font-bold">{filtrationResults.gfr} mL/min</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Clearance & FeNa Interactive Diagnostic Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Substance Clearance Calculator */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-teal-400" />
                  Renal Clearance Solver [C = (U_x × V) / P_x]
                </h3>
                <p className="text-xs text-slate-400">
                  Compare renal clearances against baseline GFR ({filtrationResults.gfr} mL/min) to determine tubular handling.
                </p>
              </div>

              {/* Substance Presets */}
              <div className="flex gap-2">
                {[
                  { name: "Inulin (GFR)", u: 125, v: 1.0, p: 1.0 },
                  { name: "Creatinine (Est GFR)", u: 140, v: 1.0, p: 1.0 },
                  { name: "PAH (RPF Marker)", u: 600, v: 1.0, p: 1.0 },
                  { name: "Urea (Reabsorbed)", u: 60, v: 1.0, p: 1.0 },
                  { name: "Glucose (100% Reabsorbed)", u: 0, v: 1.0, p: 1.0 },
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setClearanceSubstance(s.name.split(" ")[0]);
                      setUConc(s.u);
                      setUFlow(s.v);
                      setPConc(s.p);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 border border-slate-700 transition"
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold">Urine Conc (U_x)</label>
                  <input
                    type="number"
                    value={uConc}
                    onChange={(e) => setUConc(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">mg/dL or mmol/L</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold">Urine Flow (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={uFlow}
                    onChange={(e) => setUFlow(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">mL/min</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold">Plasma Conc (P_x)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pConc}
                    onChange={(e) => setPConc(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">mg/dL or mmol/L</span>
                </div>
              </div>

              {/* Clearance Results Card */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Calculated Renal Clearance:</span>
                  <span className="text-xl font-black text-teal-400">
                    {clearanceResults.clearance} mL/min
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Excretion Rate (U_x × V):</span>
                  <span className="font-bold text-white">{clearanceResults.excretionRate} mass/min</span>
                </div>
                {clearanceResults.fractionalExcretion !== undefined && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Fractional Excretion (FE_x):</span>
                    <span className="font-bold text-teal-300">{clearanceResults.fractionalExcretion}%</span>
                  </div>
                )}
                <p className="text-xs text-slate-300 pt-2 border-t border-slate-850 leading-relaxed">
                  {clearanceResults.tubularHandlingDescription}
                </p>
              </div>
            </div>

            {/* Fractional Excretion of Sodium (FeNa) Diagnostic Lab */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-400" />
                  Fractional Excretion of Sodium (FeNa)
                </h3>
                <p className="text-xs text-slate-400">
                  FeNa = (U_Na × P_Cr) / (P_Na × U_Cr) × 100%. Clinically differentiates Prerenal Azotemia from Intrinsic ATN.
                </p>
              </div>

              {/* Patient Case Presets */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setUNa(12);
                    setPNa(140);
                    setUCr(160);
                    setPCr(2.2);
                  }}
                  className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold rounded-lg transition"
                >
                  Case: Prerenal Azotemia
                </button>
                <button
                  onClick={() => {
                    setUNa(68);
                    setPNa(138);
                    setUCr(35);
                    setPCr(3.2);
                  }}
                  className="px-3 py-1.5 bg-red-950/40 border border-red-800/50 hover:bg-red-900/40 text-red-300 text-xs font-semibold rounded-lg transition"
                >
                  Case: Acute Tubular Necrosis (ATN)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold">Urine Sodium (U_Na)</label>
                  <input
                    type="number"
                    value={uNa}
                    onChange={(e) => setUNa(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">mEq/L (Normal &lt; 20 in prerenal)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold">Plasma Sodium (P_Na)</label>
                  <input
                    type="number"
                    value={pNa}
                    onChange={(e) => setPNa(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">mEq/L (Typ. 135 - 145)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold">Urine Creatinine (U_Cr)</label>
                  <input
                    type="number"
                    value={uCr}
                    onChange={(e) => setUCr(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">mg/dL</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold">Plasma Creatinine (P_Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pCr}
                    onChange={(e) => setPCr(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">mg/dL</span>
                </div>
              </div>

              {/* FeNa Diagnostic Output */}
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  fenaResults.etiology === "prerenal"
                    ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                    : fenaResults.etiology === "intrinsic"
                    ? "bg-red-950/20 border-red-800/40 text-red-300"
                    : "bg-amber-950/20 border-amber-800/40 text-amber-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Diagnostic Category
                  </span>
                  <span className="text-xl font-black text-white">
                    FeNa: {fenaResults.feNa}%
                  </span>
                </div>
                <div className="font-bold text-sm text-white">{fenaResults.clinicalCategory}</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {fenaResults.interpretation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
