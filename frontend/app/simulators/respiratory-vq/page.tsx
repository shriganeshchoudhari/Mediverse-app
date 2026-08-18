'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wind, Activity, RefreshCw, Info, AlertCircle } from 'lucide-react';
import { solveAlveolarGasEquation } from '@/lib/simulations/respiratorySolver';
import { asMmHg } from '@/lib/simulations/types';

export default function RespiratoryVQSimulator() {
  const [fiO2, setFiO2] = useState<number>(0.21); // Room air 21%
  const [barometricPressure, setBarometricPressure] = useState<number>(760); // mmHg (sea level)
  const [paCO2, setPaCO2] = useState<number>(40); // mmHg (arterial PCO2)
  const [respiratoryQuotient, setRespiratoryQuotient] = useState<number>(0.8);
  const [tidalVolume, setTidalVolume] = useState<number>(500); // mL
  const [respiratoryRate, setRespiratoryRate] = useState<number>(12); // bpm
  const [deadSpaceRatio, setDeadSpaceRatio] = useState<number>(0.3); // Vd/Vt (30%)

  // Real-time mathematical solver
  const results = useMemo(() => {
    return solveAlveolarGasEquation({
      fractionInspiredO2: fiO2,
      barometricPressure: asMmHg(barometricPressure),
      arterialPCO2: asMmHg(paCO2),
      respiratoryQuotient: respiratoryQuotient,
      tidalVolumeMl: tidalVolume,
      respiratoryRate: respiratoryRate,
      deadSpaceFraction: deadSpaceRatio,
    });
  }, [fiO2, barometricPressure, paCO2, respiratoryQuotient, tidalVolume, respiratoryRate, deadSpaceRatio]);

  const {
    alveolarPO2,
    minuteVentilation,
    alveolarVentilation,
    arterialPO2Estimated,
    aAGradient,
  } = results;

  const isHypoxemic = arterialPO2Estimated < 60;
  const isHighAltitude = barometricPressure < 600;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/simulators"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Labs
        </Link>

        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              Respiratory Mechanics <span className="text-cyan-400">&</span> Alveolar Gas Exchange
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Interactive simulation of the Alveolar Gas Equation, Oxygen Cascade, and Ventilation/Perfusion dynamics.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Alveolar Solver Active</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Parameter Controls Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                <Wind className="w-4 h-4 text-cyan-400" />
                Ventilatory & Environmental Controls
              </h3>

              <div className="space-y-4">
                {/* FiO2 Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Fraction Inspired O₂ (FiO₂)</span>
                    <span className="font-mono text-cyan-400">{(fiO2 * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.21"
                    max="1.0"
                    step="0.01"
                    value={fiO2}
                    onChange={(e) => setFiO2(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Room Air (21%)</span>
                    <span>100% O₂</span>
                  </div>
                </div>

                {/* PaCO2 Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Arterial PCO₂ (PaCO₂)</span>
                    <span className="font-mono text-cyan-400">{paCO2} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="1"
                    value={paCO2}
                    onChange={(e) => setPaCO2(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Hyperventilation (15)</span>
                    <span>Hypoventilation (80)</span>
                  </div>
                </div>

                {/* Barometric Pressure Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Barometric Pressure (P_b)</span>
                    <span className="font-mono text-cyan-400">{barometricPressure} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="760"
                    step="10"
                    value={barometricPressure}
                    onChange={(e) => setBarometricPressure(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Mt. Everest (250)</span>
                    <span>Sea Level (760)</span>
                  </div>
                </div>

                {/* Tidal Volume & RR */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Tidal Volume: {tidalVolume} mL
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="800"
                      step="25"
                      value={tidalVolume}
                      onChange={(e) => setTidalVolume(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Resp Rate: {respiratoryRate} /min
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="35"
                      step="1"
                      value={respiratoryRate}
                      onChange={(e) => setRespiratoryRate(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Preset Scenarios */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Clinical Presets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setFiO2(0.21);
                    setBarometricPressure(760);
                    setPaCO2(40);
                    setTidalVolume(500);
                    setRespiratoryRate(12);
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-xl text-left text-xs text-slate-300 transition"
                >
                  <div className="font-bold text-white">Normal Baseline</div>
                  <div className="text-[10px] text-slate-500">Room air, sea level</div>
                </button>
                <button
                  onClick={() => {
                    setFiO2(0.21);
                    setBarometricPressure(400); // ~18,000 ft
                    setPaCO2(28);
                    setRespiratoryRate(22);
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-xl text-left text-xs text-slate-300 transition"
                >
                  <div className="font-bold text-amber-400">High Altitude</div>
                  <div className="text-[10px] text-slate-500">Hypobaric hypoxia</div>
                </button>
                <button
                  onClick={() => {
                    setFiO2(0.21);
                    setPaCO2(65); // Hypoventilation
                    setRespiratoryRate(6);
                    setTidalVolume(300);
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-rose-500 rounded-xl text-left text-xs text-slate-300 transition"
                >
                  <div className="font-bold text-rose-400">Opioid Overdose</div>
                  <div className="text-[10px] text-slate-500">Severe hypoventilation</div>
                </button>
                <button
                  onClick={() => {
                    setFiO2(0.5);
                    setPaCO2(40);
                    setBarometricPressure(760);
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-xl text-left text-xs text-slate-300 transition"
                >
                  <div className="font-bold text-blue-400">Venturi Mask 50%</div>
                  <div className="text-[10px] text-slate-500">Supplemental O₂ therapy</div>
                </button>
              </div>
            </div>
          </div>

          {/* Results & Visual Cascade Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Live Gas Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-slate-400 text-xs font-semibold mb-1">Alveolar PO₂ (P_A O₂)</div>
                <div className="text-2xl font-black text-cyan-400 font-mono">{alveolarPO2} <span className="text-xs text-slate-400">mmHg</span></div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-slate-400 text-xs font-semibold mb-1">Est. Arterial PaO₂</div>
                <div className={`text-2xl font-black font-mono ${isHypoxemic ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {arterialPO2Estimated} <span className="text-xs text-slate-400">mmHg</span>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-slate-400 text-xs font-semibold mb-1">Minute Ventilation (V_e)</div>
                <div className="text-2xl font-black text-white font-mono">{minuteVentilation} <span className="text-xs text-slate-400">L/min</span></div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-slate-400 text-xs font-semibold mb-1">Alveolar Vent. (V_a)</div>
                <div className="text-2xl font-black text-blue-400 font-mono">{alveolarVentilation} <span className="text-xs text-slate-400">L/min</span></div>
              </div>
            </div>

            {/* Oxygen Cascade Visualizer Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                <span>The Oxygen Cascade (From Dry Air to Capillaries)</span>
                <span className="text-xs text-slate-400">Formula: P_A O₂ = (P_b - 47) × FiO₂ - (PaCO₂ / 0.8)</span>
              </h3>

              <div className="space-y-4">
                {/* Step 1: Dry Ambient Air */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>1. Dry Ambient Air (P_O₂)</span>
                    <span className="font-mono text-slate-400">
                      {(barometricPressure * fiO2).toFixed(1)} mmHg
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, ((barometricPressure * fiO2) / 760) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Step 2: Humidified Tracheal Air */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>2. Humidified Tracheal Air (P_I O₂ = [P_b - 47] × FiO₂)</span>
                    <span className="font-mono text-slate-400">
                      {((barometricPressure - 47) * fiO2).toFixed(1)} mmHg
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (((barometricPressure - 47) * fiO2) / 760) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Step 3: Alveolar Gas */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>3. Alveolar Gas (P_A O₂ after CO₂ dilution)</span>
                    <span className="font-mono text-cyan-400 font-bold">{alveolarPO2} mmHg</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (alveolarPO2 / 760) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Step 4: Arterial Blood */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>4. Pulmonary End-Capillary / Arterial Blood (PaO₂ with normal A-a gradient)</span>
                    <span className={`font-mono font-bold ${isHypoxemic ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {arterialPO2Estimated} mmHg
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isHypoxemic ? 'bg-rose-500' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.min(100, (arterialPO2Estimated / 760) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {isHypoxemic && (
                <div className="mt-6 p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl flex items-start gap-3 text-rose-300 text-xs leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Clinical Alert: Hypoxemia Detected (PaO₂ &lt; 60 mmHg)</strong>
                    The simulated conditions produce arterial oxygen levels below the threshold of adequate hemoglobin saturation. Consider increasing FiO₂ or improving ventilation.
                  </div>
                </div>
              )}
            </div>

            {/* High-Yield Clinical Physiology Notes */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                NMC CBME Competency PY6.2 High-Yield Pearls
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Hypoventilation vs. Shunt:</strong> Hypoventilation always causes elevated PaCO₂ with a <em>normal</em> A-a gradient, whereas $V/Q$ mismatch or shunt causes an <em>elevated</em> A-a gradient.
                </li>
                <li>
                  <strong>High Altitude:</strong> Decreased barometric pressure reduces inspired PO₂, causing hyperventilation which lowers PaCO₂ to partially restore alveolar PO₂.
                </li>
                <li>
                  <strong>Respiratory Quotient (R):</strong> R = V&#775;CO₂ / V&#775;O₂ ≈ 0.8 on a standard mixed carbohydrate/fat diet.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
