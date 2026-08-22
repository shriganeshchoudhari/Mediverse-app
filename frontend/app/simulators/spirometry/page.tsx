"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Sliders, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import SpirometryGraphs from "../../../components/simulators/SpirometryGraphs";

export default function SpirometryLab() {
  // Slider states
  const [radius, setRadius] = useState<number>(2.0); // mm
  const [compliance, setCompliance] = useState<number>(0.20); // L/cm H2O

  // Derived metrics
  const [fvc, setFvc] = useState<number>(5.5);
  const [fev1, setFev1] = useState<number>(4.4);
  const [ratio, setRatio] = useState<number>(80);
  const [pefr, setPefr] = useState<number>(8.5);

  const [volumeTimeData, setVolumeTimeData] = useState<any[]>([]);
  const [flowVolumeData, setFlowVolumeData] = useState<any[]>([]);
  const [normalVolumeTimeData, setNormalVolumeTimeData] = useState<any[]>([]);
  const [normalFlowVolumeData, setNormalFlowVolumeData] = useState<any[]>([]);

  // Normal predicted values (constant baseline references)
  const predictedFvc = 5.5;
  const predictedFev1 = 4.4;
  const predictedRatio = 80.0;

  // Standard deviations for normal population
  const sdFvc = 0.5;
  const sdFev1 = 0.4;
  const sdRatio = 5.0;

  // Lower Limit of Normal (LLN) at 5th percentile (Z-score = -1.645)
  const llnFvc = predictedFvc - 1.645 * sdFvc; // ~4.68 L
  const llnFev1 = predictedFev1 - 1.645 * sdFev1; // ~3.74 L
  const llnRatio = predictedRatio - 1.645 * sdRatio; // ~71.8%

  const presets = [
    { name: "Normal Control", radius: 2.0, compliance: 0.20, style: "hover:border-slate-500 bg-slate-800 text-white" },
    { name: "Asthma Attack", radius: 0.8, compliance: 0.20, style: "hover:border-red-500 bg-red-950/20 text-red-400 border-red-900/40" },
    { name: "COPD & Emphysema", radius: 1.2, compliance: 0.38, style: "hover:border-amber-500 bg-amber-950/20 text-amber-400 border-amber-900/40" },
    { name: "Pulmonary Fibrosis", radius: 2.0, compliance: 0.08, style: "hover:border-purple-500 bg-purple-950/20 text-purple-400 border-purple-900/40" }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setRadius(p.radius);
    setCompliance(p.compliance);
  };

  useEffect(() => {
    // Calculate normal reference dataset once
    const normVt = [];
    const normFv = [];
    
    // Normal constants
    const normTau = 0.6; // Normal airway time constant
    const normFvcVal = 5.5;
    const normPefrVal = 9.0;
    
    for (let t = 0; t <= 6; t += 0.1) {
      const vol = normFvcVal * (1 - Math.exp(-t / normTau));
      normVt.push({
        time: parseFloat(t.toFixed(1)),
        volume: parseFloat(vol.toFixed(2)),
      });
    }
    setNormalVolumeTimeData(normVt);

    const fvSteps = 40;
    for (let i = 0; i <= fvSteps; i++) {
      const volPct = i / fvSteps;
      const vol = volPct * normFvcVal;
      const flow = volPct <= 0.1 ? normPefrVal * (volPct / 0.1) : normPefrVal * (1.0 - (volPct - 0.1) / 0.9);
      normFv.push({ volume: parseFloat(vol.toFixed(2)), flow: parseFloat(flow.toFixed(2)) });
    }
    const normPeakInspFlow = 4.5;
    for (let i = fvSteps; i >= 0; i--) {
      const volPct = i / fvSteps;
      const vol = volPct * normFvcVal;
      const flow = -normPeakInspFlow * Math.sin(volPct * Math.PI);
      normFv.push({ volume: parseFloat(vol.toFixed(2)), flow: parseFloat(flow.toFixed(2)) });
    }
    setNormalFlowVolumeData(normFv);
  }, []);

  useEffect(() => {
    // Resistance R is inversely proportional to r^3
    const R = 1.0 / Math.pow(radius, 3);
    const tau = Math.max(0.1, R * compliance * 15.0);

    // FVC is determined by lung compliance
    const computedFvc = Math.min(6.5, Math.max(1.0, 1.0 + 22.5 * compliance));
    const computedFev1 = computedFvc * (1 - Math.exp(-1.0 / tau));
    const computedRatio = (computedFev1 / computedFvc) * 100;
    const computedPefr = Math.min(12.0, (2.8 * computedFvc) / tau);

    setFvc(parseFloat(computedFvc.toFixed(2)));
    setFev1(parseFloat(computedFev1.toFixed(2)));
    setRatio(parseFloat(computedRatio.toFixed(1)));
    setPefr(parseFloat(computedPefr.toFixed(2)));

    // Generate active dataset points
    const vtPoints = [];
    for (let t = 0; t <= 6; t += 0.1) {
      const vol = computedFvc * (1 - Math.exp(-t / tau));
      vtPoints.push({
        time: parseFloat(t.toFixed(1)),
        volume: parseFloat(vol.toFixed(2)),
      });
    }
    setVolumeTimeData(vtPoints);

    const fvPoints = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const volPct = i / steps;
      const vol = volPct * computedFvc;
      const flow = volPct <= 0.1 ? computedPefr * (volPct / 0.1) : computedPefr * (1.0 - (volPct - 0.1) / 0.9);
      fvPoints.push({ volume: parseFloat(vol.toFixed(2)), flow: parseFloat(flow.toFixed(2)) });
    }
    const peakInspFlow = 4.5 * (compliance / 0.2);
    for (let i = steps; i >= 0; i--) {
      const volPct = i / steps;
      const vol = volPct * computedFvc;
      const flow = -peakInspFlow * Math.sin(volPct * Math.PI);
      fvPoints.push({ volume: parseFloat(vol.toFixed(2)), flow: parseFloat(flow.toFixed(2)) });
    }
    setFlowVolumeData(fvPoints);
  }, [radius, compliance]);

  // Z-scores
  const zFvc = (fvc - predictedFvc) / sdFvc;
  const zFev1 = (fev1 - predictedFev1) / sdFev1;
  const zRatio = (ratio - predictedRatio) / sdRatio;

  const getDiagnostics = () => {
    // Obstructive indicator: Ratio is below LLN
    if (ratio < llnRatio) {
      // If FVC is also low, it might be mixed or emphysema
      if (compliance > 0.30) {
        return {
          label: "Obstructive Defect (Emphysema Variant)",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          description: "Characterized by airway obstruction (FEV1/FVC < LLN) combined with hyper-compliance (increased lung compliance due to alveolar septal destruction and loss of elastic recoil). Typical of chronic emphysema."
        };
      }
      return {
        label: "Obstructive Ventilatory Defect",
        color: "text-red-400 bg-red-500/10 border-red-500/20",
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        description: "Expiratory airflow limitation indicated by FEV1/FVC ratio below the Lower Limit of Normal (LLN). Airway narrowing (reduced radius) increases resistance, slowing forced expiration."
      };
    }
    // Restrictive indicator: Ratio is normal, but FVC is below LLN
    if (fvc < llnFvc) {
      return {
        label: "Restrictive Ventilatory Defect",
        color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        icon: <AlertTriangle className="w-5 h-5 text-purple-400" />,
        description: "Characterized by restricted lung expansion (FVC below LLN) with a preserved or elevated FEV1/FVC ratio. Suggests interstitial lung disease (fibrosis) or chest wall restriction."
      };
    }
    return {
      label: "Normal Pulmonary Function",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      description: "Pulmonary parameters are within normal boundaries. FVC, FEV1, and FEV1/FVC ratio are all above the Lower Limit of Normal (Z-score > -1.645)."
    };
  };

  const diagnostic = getDiagnostics();

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <Link href="/simulators" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Labs
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Spirometry <span className="text-sky-500">&</span> Pulmonary Function
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Simulate spirometer flow loops and verify obstructive vs. restrictive pathophysiology.</p>
        </header>

        {/* Dynamic Diagnostics */}
        <div className={`p-5 rounded-2xl border flex gap-4 items-center mb-8 ${diagnostic.color}`}>
          {diagnostic.icon}
          <div>
            <h2 className="font-bold text-lg text-white mb-0.5">Diagnostic Report: {diagnostic.label}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{diagnostic.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Presets and Variables */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  Clinical Presets
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(p)}
                      className={`px-3 py-1.5 rounded-lg border border-transparent text-xs font-semibold transition ${p.style}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <hr className="border-slate-850 my-2" />
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2 mt-2">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  Custom Variables
                </h3>
              </div>

              <div className="space-y-6">
                {/* Airway Radius */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-350">Airway Radius (mm)</span>
                    <span className="text-sky-400 font-bold text-sm bg-sky-400/10 px-2 py-0.5 rounded">{radius.toFixed(1)}</span>
                  </div>
                  <input
                    type="range" min="0.5" max="4.0" step="0.1"
                    value={radius} onChange={(e) => setRadius(parseFloat(e.target.value))}
                    className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Lung Compliance */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-350">Compliance (L/cm H₂O)</span>
                    <span className="text-sky-400 font-bold text-sm bg-sky-400/10 px-2 py-0.5 rounded">{compliance.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.05" max="0.40" step="0.01"
                    value={compliance} onChange={(e) => setCompliance(parseFloat(e.target.value))}
                    className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Calculations & Z-scores */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                Calculated Metrics (Z-scores)
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs py-1.5 border-b border-slate-850">
                  <span className="text-slate-450">FVC (Volume)</span>
                  <div className="text-right">
                    <div className="font-bold text-white">{fvc.toFixed(2)} L</div>
                    <div className={`text-[10px] ${zFvc < -1.645 ? 'text-red-400' : 'text-slate-500'}`}>
                      Z-score: {zFvc.toFixed(2)} {zFvc < -1.645 ? '(Low)' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs py-1.5 border-b border-slate-850">
                  <span className="text-slate-450">FEV₁ (1s Exhaled)</span>
                  <div className="text-right">
                    <div className="font-bold text-white">{fev1.toFixed(2)} L</div>
                    <div className={`text-[10px] ${zFev1 < -1.645 ? 'text-red-400' : 'text-slate-500'}`}>
                      Z-score: {zFev1.toFixed(2)} {zFev1 < -1.645 ? '(Low)' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs py-1.5 border-b border-slate-850">
                  <span className="text-slate-450 font-bold">FEV₁/FVC Ratio</span>
                  <div className="text-right">
                    <div className={`font-black ${ratio < llnRatio ? 'text-red-400' : 'text-emerald-400'}`}>
                      {ratio.toFixed(1)}%
                    </div>
                    <div className={`text-[10px] ${zRatio < -1.645 ? 'text-red-400' : 'text-slate-500'}`}>
                      Z-score: {zRatio.toFixed(2)} {zRatio < -1.645 ? '(Low)' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs py-1.5">
                  <span className="text-slate-450">Peak Flow (PEF)</span>
                  <div className="font-bold text-white">{pefr.toFixed(2)} L/s</div>
                </div>
              </div>
            </div>

          </div>

          {/* Graph Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <SpirometryGraphs 
              volumeTimeData={volumeTimeData} 
              flowVolumeData={flowVolumeData}
              normalVolumeTimeData={normalVolumeTimeData}
              normalFlowVolumeData={normalFlowVolumeData}
              fev1={fev1}
              fvc={fvc}
            />

            {/* Pathophysiology explanation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">Pathophysiology Guide</h3>
              <p className="text-slate-400 text-sm leading-relaxed space-y-2">
                By comparing the patient's loops with the <strong className="text-white font-semibold">Normal Control (Ref)</strong>, we can analyze changes in compliance and resistance. 
                In <strong className="text-white font-semibold">obstruction</strong> (e.g. Asthma), a reduced radius increases resistance, causing a characteristic <em className="text-sky-300 not-italic font-medium">scooped-out</em> expiratory curve. 
                In <strong className="text-white font-semibold">restriction</strong> (e.g. Fibrosis), a loss of compliance limits lung expansion, resulting in a compressed, narrow loop that preserves the slope (normal ratio) but severely limits the maximum volume (FVC).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
