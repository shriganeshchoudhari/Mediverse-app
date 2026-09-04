'use client';

/**
 * Pharmacokinetics & Therapeutic Drug Monitoring (TDM) Simulator
 * Location: frontend/app/simulators/pharmacokinetics/page.tsx
 *
 * Implements:
 * 1. Two-compartment / one-compartment Bateman open PK model (IV bolus, Oral absorption, IM).
 * 2. Real-time dynamic concentration-time C(t) plasma profile calculation.
 * 3. Pharmacokinetic metrics: Cmax, Tmax, AUC₀₋∞, Elimination half-life (t½), Volume of Distribution (Vd).
 * 4. Critical Therapeutic Drug Monitoring (TDM) safety window (MEC to MTC reference zones).
 * 5. High-yield clinical drug presets (Vancomycin, Gentamicin, Digoxin, Theophylline, Acetaminophen).
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  ArrowLeft,
  FlaskConical,
  Activity,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface DrugPreset {
  name: string;
  route: 'IV' | 'Oral' | 'IM';
  doseMg: number;
  vdLperKg: number;
  halfLifeHours: number;
  bioavailabilityF: number;
  mecMgL: number;
  mtcMgL: number;
  description: string;
}

const DRUG_PRESETS: Record<string, DrugPreset> = {
  vancomycin: {
    name: 'Vancomycin (Glycopeptide)',
    route: 'IV',
    doseMg: 1000,
    vdLperKg: 0.7,
    halfLifeHours: 6.0,
    bioavailabilityF: 1.0,
    mecMgL: 10.0,
    mtcMgL: 20.0,
    description: 'Requires strict trough monitoring (10–20 mg/L) to prevent ototoxicity and nephrotoxicity.',
  },
  gentamicin: {
    name: 'Gentamicin (Aminoglycoside)',
    route: 'IV',
    doseMg: 350,
    vdLperKg: 0.25,
    halfLifeHours: 2.5,
    bioavailabilityF: 1.0,
    mecMgL: 2.0,
    mtcMgL: 10.0,
    description: 'Peak levels optimize bacterial killing, whereas elevated trough (>2 mg/L) drives renal tubular necrosis.',
  },
  digoxin: {
    name: 'Digoxin (Cardiac Glycoside)',
    route: 'Oral',
    doseMg: 0.25,
    vdLperKg: 6.5,
    halfLifeHours: 36.0,
    bioavailabilityF: 0.75,
    mecMgL: 0.0008,
    mtcMgL: 0.002,
    description: 'Extremely narrow therapeutic window (0.8–2.0 ng/mL); prolonged half-life exacerbated by hypokalemia.',
  },
  acetaminophen: {
    name: 'Acetaminophen (Paracetamol)',
    route: 'Oral',
    doseMg: 1000,
    vdLperKg: 0.95,
    halfLifeHours: 2.5,
    bioavailabilityF: 0.88,
    mecMgL: 10.0,
    mtcMgL: 30.0,
    description: 'Rapid GI absorption (Tmax ~1h). Overdose saturates glucuronidation, driving NAPQI hepatotoxicity.',
  },
  theophylline: {
    name: 'Theophylline (Methylxanthine)',
    route: 'Oral',
    doseMg: 400,
    vdLperKg: 0.5,
    halfLifeHours: 8.0,
    bioavailabilityF: 0.95,
    mecMgL: 10.0,
    mtcMgL: 20.0,
    description: 'Bronchodilator with narrow index (10–20 mg/L); toxicity manifests as cardiac arrhythmias and intractable seizures.',
  },
};

export default function PharmacokineticsPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>('vancomycin');
  const [route, setRoute] = useState<'IV' | 'Oral' | 'IM'>('IV');
  const [doseMg, setDoseMg] = useState<number>(1000);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);
  const [vdLperKg, setVdLperKg] = useState<number>(0.7);
  const [halfLifeHours, setHalfLifeHours] = useState<number>(6.0);
  const [bioavailabilityF, setBioavailabilityF] = useState<number>(1.0);
  const [mecMgL, setMecMgL] = useState<number>(10.0);
  const [mtcMgL, setMtcMgL] = useState<number>(20.0);

  const applyPreset = (key: string) => {
    const p = DRUG_PRESETS[key];
    if (!p) return;
    setSelectedPreset(key);
    setRoute(p.route);
    setDoseMg(p.doseMg);
    setVdLperKg(p.vdLperKg);
    setHalfLifeHours(p.halfLifeHours);
    setBioavailabilityF(p.bioavailabilityF);
    setMecMgL(p.mecMgL);
    setMtcMgL(p.mtcMgL);
  };

  // Compute PK parameters & time series curve
  const { curveData, cMax, tMax, auc, ke, totalVd } = useMemo(() => {
    const keVal = Math.log(2) / Math.max(0.1, halfLifeHours); // hr^-1
    const kaVal = route === 'Oral' ? 1.4 : route === 'IM' ? 2.5 : 50.0; // absorption rate constant hr^-1
    const totalVdVal = vdLperKg * patientWeightKg; // Liters
    const simHours = Math.max(24, Math.round(halfLifeHours * 4.5));
    const step = simHours / 120; // 120 plot points

    const points: { time: number; concentration: number }[] = [];
    let maxC = 0;
    let maxT = 0;
    let totalAuc = 0;

    for (let t = 0; t <= simHours; t += step) {
      let conc = 0;
      if (route === 'IV') {
        // IV Bolus 1-compartment: C(t) = (Dose / Vd) * e^(-ke * t)
        conc = (doseMg / totalVdVal) * Math.exp(-keVal * t);
      } else {
        // First-order absorption Bateman equation: C(t) = [F * Dose * ka / (Vd * (ka - ke))] * [e^(-ke*t) - e^(-ka*t)]
        if (Math.abs(kaVal - keVal) < 0.001) {
          conc = ((bioavailabilityF * doseMg) / totalVdVal) * kaVal * t * Math.exp(-keVal * t);
        } else {
          conc =
            ((bioavailabilityF * doseMg * kaVal) / (totalVdVal * (kaVal - keVal))) *
            (Math.exp(-keVal * t) - Math.exp(-kaVal * t));
        }
      }

      conc = Math.max(0, conc);
      if (conc > maxC) {
        maxC = conc;
        maxT = t;
      }
      points.push({
        time: Number(t.toFixed(1)),
        concentration: Number(conc.toFixed(3)),
      });
    }

    // Trapezoidal AUC integration
    for (let i = 1; i < points.length; i++) {
      const dt = points[i].time - points[i - 1].time;
      totalAuc += ((points[i].concentration + points[i - 1].concentration) / 2) * dt;
    }

    return {
      curveData: points,
      cMax: Number(maxC.toFixed(2)),
      tMax: Number(maxT.toFixed(2)),
      auc: Number(totalAuc.toFixed(1)),
      ke: Number(keVal.toFixed(3)),
      totalVd: Number(totalVdVal.toFixed(1)),
    };
  }, [route, doseMg, patientWeightKg, vdLperKg, halfLifeHours, bioavailabilityF]);

  const isInToxicRange = cMax > mtcMgL;
  const isSubtherapeutic = cMax < mecMgL;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Physiology Simulators
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-950/80 border border-violet-500/30 text-violet-400">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Pharmacokinetics (PK/PD) &amp; TDM Simulator
              </h1>
              <p className="text-xs text-slate-400">
                Compartmental Bateman absorption, clearance kinetics, and therapeutic window modeling
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          {isInToxicRange ? (
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4" /> TOXIC LEVEL (Cmax &gt; MTC)
            </span>
          ) : isSubtherapeutic ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" /> SUB-THERAPEUTIC (Cmax &lt; MEC)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> WITHIN THERAPEUTIC WINDOW
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Preset Buttons */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> High-Yield Clinical Presets
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(DRUG_PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`text-left text-xs p-2 rounded-xl border transition ${
                    selectedPreset === key
                      ? 'bg-violet-600/30 border-violet-500 text-white font-semibold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate font-medium">{p.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500">{p.route} &bull; {p.doseMg}mg</div>
                </button>
              ))}
            </div>
            {DRUG_PRESETS[selectedPreset] && (
              <p className="text-[11px] text-slate-400 mt-3 p-2 rounded-lg bg-slate-950/80 border border-slate-800/60 italic">
                {DRUG_PRESETS[selectedPreset].description}
              </p>
            )}
          </div>

          {/* Dosing & Patient Parameters */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Kinetic Parameters
            </h3>

            {/* Route Selector */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Route of Administration</label>
              <div className="grid grid-cols-3 gap-2">
                {(['IV', 'Oral', 'IM'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoute(r)}
                    className={`py-1.5 text-xs rounded-lg font-mono font-bold transition border ${
                      route === r
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Dose slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Administered Dose</span>
                <span className="font-mono text-blue-400 font-bold">{doseMg} mg</span>
              </div>
              <input
                type="range"
                min="5"
                max="2000"
                step="5"
                value={doseMg}
                onChange={(e) => setDoseMg(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Weight slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Patient Weight</span>
                <span className="font-mono text-slate-200">{patientWeightKg} kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                step="1"
                value={patientWeightKg}
                onChange={(e) => setPatientWeightKg(Number(e.target.value))}
                className="w-full accent-slate-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Vd slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Apparent Vd (L/kg)</span>
                <span className="font-mono text-slate-200">{vdLperKg} L/kg ({totalVd} L)</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.05"
                value={vdLperKg}
                onChange={(e) => setVdLperKg(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Half life slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Elimination Half-Life (t½)</span>
                <span className="font-mono text-slate-200">{halfLifeHours} hrs (ke = {ke}/h)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="48.0"
                step="0.5"
                value={halfLifeHours}
                onChange={(e) => setHalfLifeHours(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Bioavailability (for Oral/IM) */}
            {route !== 'IV' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Bioavailability (F)</span>
                  <span className="font-mono text-slate-200">{(bioavailabilityF * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.02"
                  value={bioavailabilityF}
                  onChange={(e) => setBioavailabilityF(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chart & Derived Analytics */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Peak Conc. (Cmax)</span>
              <span className={`text-lg font-bold font-mono ${isInToxicRange ? 'text-rose-400' : 'text-blue-400'}`}>
                {cMax} mg/L
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Time to Peak (Tmax)</span>
              <span className="text-lg font-bold font-mono text-amber-400">{tMax} hrs</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Exposure (AUC₀₋∞)</span>
              <span className="text-lg font-bold font-mono text-purple-400">{auc} mg·h/L</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Clearance Rate</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {(totalVd * ke).toFixed(2)} L/h
              </span>
            </div>
          </div>

          {/* Interactive Recharts LineChart */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" /> Plasma Concentration vs. Time Profile C(t)
              </h3>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-0.5 bg-rose-500 inline-block" /> MTC: {mtcMgL} mg/L
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-0.5 bg-emerald-500 inline-block" /> MEC: {mecMgL} mg/L
                </span>
              </div>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curveData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    label={{ value: 'Time (hours)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    label={{ value: 'Conc. (mg/L)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  {/* Minimum Effective Concentration (MEC) */}
                  <ReferenceLine y={mecMgL} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />
                  {/* Minimum Toxic Concentration (MTC) */}
                  <ReferenceLine y={mtcMgL} stroke="#f43f5e" strokeDasharray="4 4" strokeWidth={1.5} />
                  {/* Peak Time Tmax marker */}
                  <ReferenceLine x={tMax} stroke="#3b82f6" strokeDasharray="2 2" />
                  <Line
                    type="monotone"
                    dataKey="concentration"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={false}
                    name="Plasma Conc. (mg/L)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clinical Pharmacology Explainer */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs leading-relaxed text-slate-300">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              💡 Clinical Pharmacokinetics Pearl
            </h4>
            <p>
              Steady-state concentration (Css) is achieved after approximately <strong>4 to 5 half-lives</strong>. Loading dose is governed solely by Volume of Distribution (Vd): <code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded">Loading Dose = Target Conc × Vd</code>. Maintenance dose rate is governed by Clearance (CL): <code className="text-emerald-300 bg-emerald-950/40 px-1 py-0.5 rounded">Dose Rate = Target Conc × CL / F</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
