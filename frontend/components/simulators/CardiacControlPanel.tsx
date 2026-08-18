import React from 'react';
import { Activity, Heart, Zap, ShieldAlert, Sliders } from 'lucide-react';

interface CardiacControlPanelProps {
  heartRate: number;
  setHeartRate: (val: number) => void;
  preload: number;
  setPreload: (val: number) => void;
  afterload: number;
  setAfterload: (val: number) => void;
  contractility: number;
  setContractility: (val: number) => void;
}

export default function CardiacControlPanel({
  heartRate, setHeartRate,
  preload, setPreload,
  afterload, setAfterload,
  contractility, setContractility
}: CardiacControlPanelProps) {

  const presets = [
    { name: "Normal", hr: 70, preload: 120, afterload: 80, contractility: 2.0, style: "hover:border-slate-500 bg-slate-800 text-white" },
    { name: "Heart Failure", hr: 90, preload: 165, afterload: 75, contractility: 0.8, style: "hover:border-rose-500 bg-rose-950/20 text-rose-400 border-rose-900/40" },
    { name: "Hypertension", hr: 75, preload: 130, afterload: 135, contractility: 2.2, style: "hover:border-purple-500 bg-purple-950/20 text-purple-400 border-purple-900/40" },
    { name: "Hypovolemic Shock", hr: 115, preload: 80, afterload: 55, contractility: 2.5, style: "hover:border-amber-500 bg-amber-950/20 text-amber-400 border-amber-900/40" },
    { name: "Exercise State", hr: 140, preload: 135, afterload: 70, contractility: 3.8, style: "hover:border-emerald-500 bg-emerald-950/20 text-emerald-400 border-emerald-900/40" }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setHeartRate(preset.hr);
    setPreload(preset.preload);
    setAfterload(preset.afterload);
    setContractility(preset.contractility);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
      <div>
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
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
        <hr className="border-slate-800/80 my-2" />
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2 mt-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          Custom Parameters
        </h3>
      </div>

      <div className="space-y-6">
        {/* Heart Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-white font-medium flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-rose-400" /> Heart Rate
            </label>
            <span className="text-rose-400 font-bold bg-rose-400/10 px-2 py-1 rounded-md text-sm">{heartRate} bpm</span>
          </div>
          <input 
            type="range" min="40" max="200" step="1" 
            value={heartRate} onChange={(e) => setHeartRate(Number(e.target.value))}
            className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Bradycardia (40)</span>
            <span>Tachycardia (200)</span>
          </div>
        </div>

        {/* Preload */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-white font-medium flex items-center gap-2 text-sm">
              <DropletIcon className="w-4 h-4 text-blue-400" /> Preload (EDV)
            </label>
            <span className="text-blue-400 font-bold bg-blue-400/10 px-2 py-1 rounded-md text-sm">{preload} mL</span>
          </div>
          <input 
            type="range" min="80" max="200" step="1" 
            value={preload} onChange={(e) => setPreload(Number(e.target.value))}
            className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Hypovolemia (80)</span>
            <span>Hypervolemia (200)</span>
          </div>
        </div>

        {/* Afterload */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-white font-medium flex items-center gap-2 text-sm">
              <ShieldAlert className="w-4 h-4 text-purple-400" /> Afterload (Aortic P)
            </label>
            <span className="text-purple-400 font-bold bg-purple-400/10 px-2 py-1 rounded-md text-sm">{afterload} mmHg</span>
          </div>
          <input 
            type="range" min="40" max="160" step="1" 
            value={afterload} onChange={(e) => setAfterload(Number(e.target.value))}
            className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Vasodilation (40)</span>
            <span>Hypertension (160)</span>
          </div>
        </div>

        {/* Contractility */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-white font-medium flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-emerald-400" /> Contractility (Inotropy)
            </label>
            <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-md text-sm">{contractility.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="0.5" max="5.0" step="0.1" 
            value={contractility} onChange={(e) => setContractility(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Heart Failure (0.5)</span>
            <span>Hyper-Inotropic (5.0)</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <h4 className="text-blue-400 font-bold text-sm mb-2">Clinical Insights</h4>
        <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
          {contractility < 1.2 && <li><strong>Low Contractility:</strong> Characteristic of systolic heart failure (reduced Ejection Fraction).</li>}
          {afterload > 120 && <li><strong>High Afterload:</strong> Chronic hypertension leading to concentric left ventricular hypertrophy.</li>}
          {preload < 100 && <li><strong>Low Preload:</strong> Decreased venous return, possibly due to hemorrhage or severe dehydration.</li>}
          {preload >= 150 && <li><strong>Congestive Preload:</strong> Volume overload. High risk of pulmonary congestion if contractility is reduced.</li>}
          {contractility >= 1.2 && afterload <= 120 && preload >= 100 && preload < 150 && <li>Hemodynamics are currently compensated and stable.</li>}
        </ul>
      </div>
    </div>
  );
}

function DropletIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}
