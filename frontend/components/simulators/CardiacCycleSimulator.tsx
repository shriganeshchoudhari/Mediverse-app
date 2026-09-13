"use client";

import React, { useState, useMemo } from 'react';
import CardiacControlPanel from '@/components/simulators/CardiacControlPanel';
import PressureVolumeLoopGraph from '@/components/simulators/PressureVolumeLoopGraph';
import WiggersDiagramGraph from '@/components/simulators/WiggersDiagramGraph';
import FrankStarlingGraph from '@/components/simulators/FrankStarlingGraph';
import { ArrowLeft, BookOpen, Activity, Heart, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { solveCardiacCycle } from '@/lib/simulations/cardiacSolver';
import { asBeatsPerMinute, asMilliliters, asMmHg } from '@/lib/simulations/types';
import SimulatorPresetPanel, { SimulatorPreset } from '@/components/simulators/SimulatorPresetPanel';

const CARDIAC_PRESETS: SimulatorPreset[] = [
  {
    id: 'normal', label: 'Normal Heart', icon: '💚', description: 'Healthy adult at rest. HR 70, normal preload/afterload.',
    values: { heartRate: 70, preload: 120, afterload: 80, contractility: 2.0 },
  },
  {
    id: 'hf-dcm', label: 'Dilated CMP', icon: '❤️', badge: 'HF', description: 'Dilated cardiomyopathy: low contractility, high preload, normal afterload.',
    values: { heartRate: 95, preload: 180, afterload: 85, contractility: 0.8 },
  },
  {
    id: 'hocm', label: 'HOCM', icon: '🫀', badge: 'Obstructive', description: 'Hypertrophic obstructive CMP: high contractility, small cavity, high afterload.',
    values: { heartRate: 80, preload: 90, afterload: 110, contractility: 3.5 },
  },
  {
    id: 'as', label: 'Aortic Stenosis', icon: '🔴', badge: 'Valvular', description: 'Severe AS: high afterload, compensatory hypertrophy (high contractility), low SV.',
    values: { heartRate: 70, preload: 140, afterload: 150, contractility: 2.8 },
  },
  {
    id: 'ar', label: 'Aortic Regurg', icon: '🟠', badge: 'Valvular', description: 'Chronic AR: high preload (volume overload), low diastolic BP (low afterload).',
    values: { heartRate: 75, preload: 200, afterload: 55, contractility: 2.2 },
  },
  {
    id: 'tamponade', label: 'Cardiac Tamponade', icon: '⚠️', badge: 'Emergency', badgeColor: 'rgba(220,38,38,0.8)', description: 'Pericardial tamponade: severely reduced preload, compensatory tachycardia.',
    values: { heartRate: 115, preload: 70, afterload: 95, contractility: 1.8 },
  },
];

export default function CardiacCycleSimulator() {
  const [heartRate, setHeartRate] = useState(70);
  const [preload, setPreload] = useState(120); // EDV
  const [afterload, setAfterload] = useState(80); // Diastolic Aortic P
  const [contractility, setContractility] = useState(2.0);
  const [activeTab, setActiveTab] = useState<"wiggers" | "pvloop" | "starling">("wiggers");

  const handlePresetApply = (values: Record<string, number | boolean>) => {
    if (typeof values.heartRate === 'number') setHeartRate(values.heartRate);
    if (typeof values.preload === 'number') setPreload(values.preload);
    if (typeof values.afterload === 'number') setAfterload(values.afterload);
    if (typeof values.contractility === 'number') setContractility(values.contractility);
  };

  const handlePresetReset = () => {
    setHeartRate(70);
    setPreload(120);
    setAfterload(80);
    setContractility(2.0);
  };

  // Real-time Suga-Sagawa time-varying elastance physiological solver
  const results = useMemo(() => {
    return solveCardiacCycle({
      preloadEDV: asMilliliters(preload),
      afterloadSVR: asMmHg(afterload),
      inotropyEes: contractility,
      heartRate: asBeatsPerMinute(heartRate),
    });
  }, [preload, afterload, contractility, heartRate]);

  const {
    strokeVolume,
    ejectionFraction,
    cardiacOutput,
    systolicPressure,
    diastolicPressure,
    endSystolicVolume: esv,
  } = results;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <Link href="/simulators" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Labs
        </Link>
        
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              Cardiac Cycle <span className="text-rose-500">&</span> Hemodynamics
            </h1>
            <p className="text-slate-400 text-sm md:text-base">Interactive simulation of Left Ventricular pressures, volumes, and clinical relationships.</p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Real-Time Engine Active</span>
          </div>
        </header>

        <SimulatorPresetPanel presets={CARDIAC_PRESETS} onApply={handlePresetApply} onReset={handlePresetReset} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <CardiacControlPanel 
              heartRate={heartRate} setHeartRate={setHeartRate}
              preload={preload} setPreload={setPreload}
              afterload={afterload} setAfterload={setAfterload}
              contractility={contractility} setContractility={setContractility}
            />

            {/* Vital Signs Output */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Live Patient Vitals
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Stroke Volume</div>
                  <div className="text-2xl font-black text-white">{strokeVolume.toFixed(0)} <span className="text-xs font-medium text-slate-400">mL</span></div>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ejection Fraction</div>
                  <div className={`text-2xl font-black ${ejectionFraction < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {ejectionFraction.toFixed(1)} <span className="text-xs font-medium text-slate-400">%</span>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Cardiac Output</div>
                  <div className="text-2xl font-black text-blue-400">{cardiacOutput.toFixed(1)} <span className="text-xs font-medium text-slate-400">L/min</span></div>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Blood Pressure</div>
                  <div className="text-2xl font-black text-white">{systolicPressure.toFixed(0)}/{afterload} <span className="text-xs font-medium text-slate-400">mmHg</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const msg = `Interpret these cardiac hemodynamics: HR=${heartRate} bpm, EDV=${preload}mL, Afterload=${afterload}mmHg, Contractility Ees=${contractility}. Calculated: SV=${Math.round(strokeVolume)}mL, EF=${Math.round(ejectionFraction)}%, CO=${cardiacOutput.toFixed(1)}L/min, SBP=${Math.round(systolicPressure)}/${Math.round(diastolicPressure)}mmHg. What does this pattern suggest clinically?`;
                  window.dispatchEvent(new CustomEvent('mediverse:ask-ai', { detail: { text: msg } }));
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '0.625rem',
                  color: '#60a5fa',
                  fontSize: '0.75rem', fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '0.75rem',
                  width: '100%',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
              >
                🤖 AI Interpret These Values
              </button>
            </div>
          </div>

          {/* Graphs / Viewport Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[580px]">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 mb-6 gap-2">
                <button
                  onClick={() => setActiveTab("wiggers")}
                  className={`px-4 py-2 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                    activeTab === "wiggers" ? 'border-rose-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-4 h-4" /> Wiggers Diagram
                </button>
                <button
                  onClick={() => setActiveTab("pvloop")}
                  className={`px-4 py-2 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                    activeTab === "pvloop" ? 'border-rose-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Pressure-Volume Loop
                </button>
                <button
                  onClick={() => setActiveTab("starling")}
                  className={`px-4 py-2 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                    activeTab === "starling" ? 'border-rose-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Heart className="w-4 h-4" /> Frank-Starling Curve
                </button>
              </div>

              {/* Active Graph Viewport */}
              <div className="flex-1 min-h-0">
                {activeTab === "wiggers" && (
                  <WiggersDiagramGraph 
                    heartRate={heartRate}
                    preload={preload} 
                    afterload={afterload} 
                    contractility={contractility} 
                  />
                )}
                {activeTab === "pvloop" && (
                  <PressureVolumeLoopGraph 
                    preload={preload} 
                    afterload={afterload} 
                    contractility={contractility} 
                  />
                )}
                {activeTab === "starling" && (
                  <FrankStarlingGraph 
                    preload={preload} 
                    contractility={contractility} 
                    currentStrokeVolume={strokeVolume}
                  />
                )}
              </div>
            </div>

            {/* Educational notes/guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">Physiological Guide</h3>
              <p className="text-slate-400 text-sm leading-relaxed space-y-2">
                The <strong className="text-white font-semibold">Wiggers Diagram</strong> coordinates electrical events (ECG) and acoustic signals (Phonocardiogram) with dynamic pressure and volume profiles in the left atrium, left ventricle, and aorta.
                Notice how the <strong className="text-white font-semibold">S1 Heart Sound</strong> occurs during <em className="text-blue-300 not-italic font-medium">isovolumetric contraction</em> right as the Mitral valve closes, while the <strong className="text-white font-semibold">S2 Heart Sound</strong> occurs during <em className="text-blue-300 not-italic font-medium">isovolumetric relaxation</em> as the Aortic valve snaps shut.
                Switch to the <strong className="text-white font-semibold">Frank-Starling Curve</strong> to see how stretching the myocardium (increasing Preload) increases the force of contraction and Stroke Volume, conforming to the length-tension relationship of cardiac sarcomeres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
