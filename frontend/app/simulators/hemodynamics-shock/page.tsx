'use client';

/**
 * Hemodynamic Shock Classifier & Swan-Ganz Catheter Simulator
 * Location: frontend/app/simulators/hemodynamics-shock/page.tsx
 *
 * Implements:
 * 1. Swan-Ganz Pulmonary Artery Catheter data acquisition (CO, SVR, PCWP, CVP, SvO₂).
 * 2. Automated Diagnostic Decision Engine classifying 4 classic shock phenotypes:
 *    - Hypovolemic Shock (Hemorrhagic / Fluid Depletion)
 *    - Cardiogenic Shock (Myocardial Infarction / Heart Failure)
 *    - Distributive / Septic Shock (Sepsis / Anaphylaxis / Neurogenic)
 *    - Obstructive Shock (Pulmonary Embolism / Cardiac Tamponade / Tension Pneumothorax)
 * 3. Recharts RadarChart 5-axis hemodynamic fingerprint comparison.
 * 4. Evidence-based first-line resuscitative protocols (fluids, inotropes, vasopressors).
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft,
  Stethoscope,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Syringe,
  Zap,
} from 'lucide-react';

interface ShockPreset {
  name: string;
  co: number; // L/min (normal 4.0 - 8.0)
  svr: number; // dyn·s/cm⁵ (normal 800 - 1200)
  pcwp: number; // mmHg (normal 6 - 12)
  cvp: number; // mmHg (normal 2 - 6)
  svo2: number; // % (normal 65 - 75)
  diagnosis: string;
  treatment: string;
}

const SHOCK_PRESETS: Record<string, ShockPreset> = {
  hypovolemic: {
    name: 'Hemorrhagic / Hypovolemic',
    co: 2.8,
    svr: 1850,
    pcwp: 4,
    cvp: 1,
    svo2: 48,
    diagnosis: 'Hypovolemic Shock',
    treatment: 'Immediate volume resuscitation with balanced crystalloids or blood products (MTP 1:1:1); identify and control surgical bleeding.',
  },
  cardiogenic: {
    name: 'Acute Myocardial Infarction / Cardiogenic',
    co: 2.2,
    svr: 2100,
    pcwp: 24,
    cvp: 14,
    svo2: 42,
    diagnosis: 'Cardiogenic Shock',
    treatment: 'Inotropic support (Dobutamine / Milrinone), urgent coronary revascularization (PCI), mechanical circulatory support (IABP/Impella). Avoid large fluid boluses.',
  },
  septic: {
    name: 'Hyperdynamic Septic / Distributive',
    co: 8.5,
    svr: 450,
    pcwp: 8,
    cvp: 4,
    svo2: 82,
    diagnosis: 'Distributive (Septic) Shock',
    treatment: 'Surviving Sepsis Campaign bundle: 30 mL/kg IV crystalloid within 3 hours, first-line vasopressor Norepinephrine (target MAP >= 65 mmHg), early broad-spectrum antibiotics.',
  },
  obstructive: {
    name: 'Massive PE / Obstructive Shock',
    co: 2.5,
    svr: 1900,
    pcwp: 7,
    cvp: 18,
    svo2: 45,
    diagnosis: 'Obstructive Shock',
    treatment: 'Relief of mechanical obstruction: systemic thrombolysis (tPA) or catheter embolectomy for PE; pericardiocentesis for tamponade; needle decompression for tension pneumothorax.',
  },
  normal: {
    name: 'Normal Resting Hemodynamics',
    co: 5.5,
    svr: 1050,
    pcwp: 9,
    cvp: 4,
    svo2: 72,
    diagnosis: 'Normal Hemodynamics',
    treatment: 'Patient is clinically compensated with adequate end-organ tissue perfusion and balanced oxygen delivery/consumption.',
  },
};

export default function HemodynamicsShockPage() {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('hypovolemic');
  const [co, setCo] = useState<number>(2.8);
  const [svr, setSvr] = useState<number>(1850);
  const [pcwp, setPcwp] = useState<number>(4);
  const [cvp, setCvp] = useState<number>(1);
  const [svo2, setSvo2] = useState<number>(48);

  const applyPreset = (key: string) => {
    const p = SHOCK_PRESETS[key];
    if (!p) return;
    setSelectedPresetKey(key);
    setCo(p.co);
    setSvr(p.svr);
    setPcwp(p.pcwp);
    setCvp(p.cvp);
    setSvo2(p.svo2);
  };

  // Automated Algorithmic Classification of Shock State
  const classification = useMemo(() => {
    // Distributive: Vasodilated (low SVR), elevated or normal CO, low/normal PCWP
    if (svr < 700 && co >= 4.5) {
      return {
        type: 'Distributive (Septic) Shock',
        color: 'text-amber-400',
        bg: 'bg-amber-950/40 border-amber-500/50',
        description: 'Severe peripheral vasodilation driven by cytokine release and endothelial dysfunction.',
        treatment: 'Norepinephrine first-line, IV crystalloids 30 mL/kg, empiric broad-spectrum antimicrobial therapy.',
      };
    }

    // Cardiogenic: Pump failure (Low CO), High filling pressures (High PCWP > 15), High SVR (compensatory vasoconstriction)
    if (co < 3.8 && pcwp > 15 && svr > 1300) {
      return {
        type: 'Cardiogenic Shock',
        color: 'text-rose-400',
        bg: 'bg-rose-950/40 border-rose-500/50',
        description: 'Primary pump failure resulting in elevated left-ventricular end-diastolic pressure and pulmonary congestion.',
        treatment: 'Inotropes (Dobutamine), revascularization, cautious diuresis if congested, mechanical circulatory support (Impella/ECMO).',
      };
    }

    // Obstructive: Low CO, High SVR, Disproportionately high CVP with normal/low PCWP (e.g. PE / RV strain) OR high both with pulsus paradoxus (Tamponade)
    if (co < 3.8 && cvp > 10 && pcwp <= 14) {
      return {
        type: 'Obstructive Shock (RV Strain / PE)',
        color: 'text-purple-400',
        bg: 'bg-purple-950/40 border-purple-500/50',
        description: 'Extracardiac mechanical impediment to cardiac filling or right ventricular outflow.',
        treatment: 'Emergency thrombolysis/embolectomy for PE, surgical decompression, avoid excessive fluid overload.',
      };
    }

    // Hypovolemic: Low CO, Low PCWP (<10), Low CVP (<3), High SVR (compensatory vasoconstriction)
    if (co < 3.8 && pcwp <= 10 && svr > 1300) {
      return {
        type: 'Hypovolemic Shock',
        color: 'text-blue-400',
        bg: 'bg-blue-950/40 border-blue-500/50',
        description: 'Critically diminished intravascular blood volume leading to decreased venous return and stroke volume.',
        treatment: 'Rapid IV volume expansion (crystalloids / blood products), source control for hemorrhage or loss.',
      };
    }

    // Normal or Undifferentiated
    return {
      type: 'Compensated / Borderline Hemodynamics',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-500/50',
      description: 'Hemodynamic parameters fall within acceptable compensation limits.',
      treatment: 'Continue supportive monitoring and optimize tissue oxygen delivery.',
    };
  }, [co, svr, pcwp, cvp]);

  // Normalize metrics to 0-100 scale for Radar Chart
  const radarData = useMemo(() => {
    return [
      { metric: 'Cardiac Output', value: Math.min(100, Math.round((co / 10) * 100)), fullMark: 100 },
      { metric: 'SVR', value: Math.min(100, Math.round((svr / 2500) * 100)), fullMark: 100 },
      { metric: 'PCWP', value: Math.min(100, Math.round((pcwp / 30) * 100)), fullMark: 100 },
      { metric: 'CVP', value: Math.min(100, Math.round((cvp / 20) * 100)), fullMark: 100 },
      { metric: 'SvO₂', value: Math.min(100, Math.round((svo2 / 90) * 100)), fullMark: 100 },
    ];
  }, [co, svr, pcwp, cvp, svo2]);

  // Derived calculations: MAP = (CO * SVR / 80) + CVP
  const calculatedMap = Math.round((co * svr) / 80 + cvp);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-mono text-orange-400 hover:text-orange-300 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Physiology Simulators
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-950/80 border border-orange-500/30 text-orange-400">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Hemodynamic Shock Classifier &amp; Swan-Ganz Simulator
              </h1>
              <p className="text-xs text-slate-400">
                Pulmonary artery catheterization hemodynamics, 5-axis fingerprinting, and resuscitative guidelines
              </p>
            </div>
          </div>
        </div>

        {/* Diagnosis Pill */}
        <div className={`px-4 py-2 rounded-xl border font-mono text-xs font-bold ${classification.bg} ${classification.color} flex items-center gap-2 shadow-lg`}>
          <AlertTriangle className="w-4 h-4" />
          {classification.type.toUpperCase()}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Selector & Catheter Value Inputs */}
        <div className="lg:col-span-4 space-y-5">
          {/* Preset Buttons */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Clinical Scenarios
            </h3>
            <div className="space-y-2">
              {Object.entries(SHOCK_PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`w-full text-left text-xs p-2.5 rounded-xl border transition ${
                    selectedPresetKey === key
                      ? 'bg-orange-600/30 border-orange-500 text-white font-semibold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-medium">{p.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    CO: {p.co} L/m &bull; SVR: {p.svr} &bull; PCWP: {p.pcwp} mmHg
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Swan-Ganz Catheter Sliders */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Swan-Ganz Catheter Data
            </h3>

            {/* Cardiac Output */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Cardiac Output (CO)</span>
                <span className="font-mono text-emerald-400 font-bold">{co.toFixed(1)} L/min</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.1"
                value={co}
                onChange={(e) => setCo(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Normal: 4.0 – 8.0 L/min</span>
            </div>

            {/* SVR */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Systemic Vascular Resistance (SVR)</span>
                <span className="font-mono text-blue-400 font-bold">{svr} dyn·s/cm⁵</span>
              </div>
              <input
                type="range"
                min="300"
                max="2800"
                step="25"
                value={svr}
                onChange={(e) => setSvr(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Normal: 800 – 1200 dyn·s/cm⁵</span>
            </div>

            {/* PCWP */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Pulmonary Capillary Wedge (PCWP)</span>
                <span className="font-mono text-purple-400 font-bold">{pcwp} mmHg</span>
              </div>
              <input
                type="range"
                min="2"
                max="32"
                step="1"
                value={pcwp}
                onChange={(e) => setPcwp(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Normal: 6 – 12 mmHg</span>
            </div>

            {/* CVP */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Central Venous Pressure (CVP)</span>
                <span className="font-mono text-cyan-400 font-bold">{cvp} mmHg</span>
              </div>
              <input
                type="range"
                min="0"
                max="22"
                step="1"
                value={cvp}
                onChange={(e) => setCvp(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Normal: 2 – 6 mmHg</span>
            </div>

            {/* SvO2 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Mixed Venous Saturation (SvO₂)</span>
                <span className="font-mono text-rose-400 font-bold">{svo2}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="88"
                step="1"
                value={svo2}
                onChange={(e) => setSvo2(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Normal: 65 – 75%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Radar Fingerprint & Treatment Protocols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Calculated MAP</span>
              <span className="text-lg font-bold font-mono text-orange-400">{calculatedMap} mmHg</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Cardiac Index (CI)</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {(co / 1.8).toFixed(2)} L/min/m²
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Stroke Volume (SV)</span>
              <span className="text-lg font-bold font-mono text-blue-400">
                {Math.round((co * 1000) / 75)} mL/beat
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">O₂ Extraction Ratio</span>
              <span className="text-lg font-bold font-mono text-purple-400">
                {(100 - svo2)}%
              </span>
            </div>
          </div>

          {/* Hemodynamic Radar Fingerprint */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-400" /> 5-Axis Hemodynamic Radar Fingerprint
              </h3>
              <span className="text-xs font-mono text-slate-400">Normalized Vector Envelope</span>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#475569" tick={false} />
                  <Radar
                    name="Hemodynamic Profile"
                    dataKey="value"
                    stroke="#f97316"
                    fill="#ea580c"
                    fillOpacity={0.45}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* First-Line Resuscitative Therapy Guidance */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-emerald-400" /> Evidence-Based First-Line Clinical Protocol
            </h3>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
              <div>
                <strong className="text-white block mb-1">Diagnostic Pathophysiology:</strong>
                <p className="text-slate-400">{classification.description}</p>
              </div>
              <div className="border-t border-slate-800/80 pt-2">
                <strong className="text-emerald-400 block mb-1">Recommended Pharmacotherapy &amp; Intervention:</strong>
                <p className="text-slate-200">{classification.treatment}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
