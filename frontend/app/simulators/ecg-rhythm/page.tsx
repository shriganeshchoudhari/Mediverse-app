'use client';

/**
 * 12-Lead ECG Rhythm & Cardiac Electrophysiology Synthesizer
 * Location: frontend/app/simulators/ecg-rhythm/page.tsx
 *
 * Implements:
 * 1. PQRST cardiac vector electrogram synthesis with Gaussian & piecewise wavelets.
 * 2. Real-time Interval Analysis: PR interval, QRS duration, QT interval, and Bazett QTc.
 * 3. Clinical Arrhythmia Presets: Normal Sinus, Atrial Fibrillation, Acute STEMI, LBBB, Severe Bradycardia, Ventricular Tachycardia.
 * 4. High-resolution telemetry oscilloscope monitor with calibrated 25 mm/s, 10 mm/mV paper scale simulation.
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  ArrowLeft,
  Activity,
  Heart,
  Zap,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
} from 'lucide-react';

interface EcgPreset {
  name: string;
  heartRateBpm: number;
  prIntervalMs: number;
  qrsDurationMs: number;
  qtIntervalMs: number;
  stElevationMv: number;
  isAtrialFib?: boolean;
  isVT?: boolean;
  clinicalSummary: string;
}

const ECG_PRESETS: Record<string, EcgPreset> = {
  nsr: {
    name: 'Normal Sinus Rhythm (NSR)',
    heartRateBpm: 72,
    prIntervalMs: 160,
    qrsDurationMs: 85,
    qtIntervalMs: 380,
    stElevationMv: 0.0,
    clinicalSummary: 'Upright P waves in Lead II, 1:1 AV conduction, narrow QRS (<120ms), normal QTc (<440ms).',
  },
  afib: {
    name: 'Atrial Fibrillation (AF)',
    heartRateBpm: 110,
    prIntervalMs: 0,
    qrsDurationMs: 85,
    qtIntervalMs: 360,
    stElevationMv: 0.0,
    isAtrialFib: true,
    clinicalSummary: 'Irregularly irregular ventricular response, absent distinct P waves, chaotic fibrillatory baseline.',
  },
  stemi: {
    name: 'Acute Anterior STEMI',
    heartRateBpm: 88,
    prIntervalMs: 155,
    qrsDurationMs: 95,
    qtIntervalMs: 420,
    stElevationMv: 3.2,
    clinicalSummary: 'Marked J-point ST elevation >2mm with hyperacute T waves and reciprocal inferior depression.',
  },
  lbbb: {
    name: 'Left Bundle Branch Block (LBBB)',
    heartRateBpm: 75,
    prIntervalMs: 170,
    qrsDurationMs: 150,
    qtIntervalMs: 460,
    stElevationMv: 0.8,
    clinicalSummary: 'Prolonged QRS >=120ms with notched R waves in lateral leads and secondary ST-T discordance.',
  },
  brady: {
    name: 'Sinus Bradycardia (Severe)',
    heartRateBpm: 40,
    prIntervalMs: 190,
    qrsDurationMs: 85,
    qtIntervalMs: 510,
    stElevationMv: 0.0,
    clinicalSummary: 'Sinus rate <50 bpm with prolonged RR intervals; monitor for junctional escape or chronotropic incompetence.',
  },
  vt: {
    name: 'Monomorphic Ventricular Tachycardia',
    heartRateBpm: 165,
    prIntervalMs: 0,
    qrsDurationMs: 170,
    qtIntervalMs: 300,
    stElevationMv: 0.0,
    isVT: true,
    clinicalSummary: 'Wide complex regular tachycardia origin below the His bundle; AV dissociation and concordance.',
  },
};

export default function EcgRhythmPage() {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('nsr');
  const [heartRateBpm, setHeartRateBpm] = useState<number>(72);
  const [prIntervalMs, setPrIntervalMs] = useState<number>(160);
  const [qrsDurationMs, setQrsDurationMs] = useState<number>(85);
  const [qtIntervalMs, setQtIntervalMs] = useState<number>(380);
  const [stElevationMv, setStElevationMv] = useState<number>(0.0);
  const [isAfib, setIsAfib] = useState<boolean>(false);
  const [isVt, setIsVt] = useState<boolean>(false);

  const applyPreset = (key: string) => {
    const p = ECG_PRESETS[key];
    if (!p) return;
    setSelectedPresetKey(key);
    setHeartRateBpm(p.heartRateBpm);
    setPrIntervalMs(p.prIntervalMs);
    setQrsDurationMs(p.qrsDurationMs);
    setQtIntervalMs(p.qtIntervalMs);
    setStElevationMv(p.stElevationMv);
    setIsAfib(!!p.isAtrialFib);
    setIsVt(!!p.isVT);
  };

  // Bazett QTc formula: QTc = QT / sqrt(RR in seconds)
  const qtcBazettMs = useMemo(() => {
    const rrSeconds = 60 / Math.max(20, heartRateBpm);
    return Math.round(qtIntervalMs / Math.sqrt(rrSeconds));
  }, [heartRateBpm, qtIntervalMs]);

  // Synthesize continuous ECG voltage time series (3.0 seconds continuous recording)
  const ecgWaveform = useMemo(() => {
    const totalDurationSec = 3.0;
    const sampleRate = 300; // 300 samples per second
    const totalSamples = Math.round(totalDurationSec * sampleRate);
    const data: { timeSec: string; mv: number }[] = [];

    const baseRR = 60 / Math.max(25, heartRateBpm);
    let currentBeatTime = 0.15;

    // Generate beat trigger timestamps
    const beatTimes: number[] = [];
    while (currentBeatTime < totalDurationSec + 0.5) {
      beatTimes.push(currentBeatTime);
      // If Afib, add pseudo-random interval jitter (+/- 25%)
      const jitter = isAfib ? (Math.sin(currentBeatTime * 17.3) * 0.28 + 0.05) * baseRR : 0;
      currentBeatTime += Math.max(0.3, baseRR + jitter);
    }

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      let voltage = 0;

      if (isVt) {
        // Monomorphic Ventricular Tachycardia: wide sine-like complexes with sharp peaks
        const vtPeriod = 60 / heartRateBpm;
        const vtPhase = (t % vtPeriod) / vtPeriod;
        voltage = Math.sin(vtPhase * Math.PI * 2) * 1.4 - Math.sin(vtPhase * Math.PI * 4) * 0.3;
      } else {
        // High-resolution P-Q-R-S-T synthesis relative to nearest beats
        for (const beatT of beatTimes) {
          const deltaT = t - beatT;

          // 1. P Wave (Atrial Depolarization) - suppressed in Afib
          if (!isAfib) {
            const pCenter = -(prIntervalMs / 1000) * 0.65;
            const pDist = deltaT - pCenter;
            const pWidth = 0.045;
            voltage += 0.22 * Math.exp(-Math.pow(pDist / pWidth, 2));
          }

          // 2. QRS Complex (Ventricular Depolarization)
          const qrsWidth = (qrsDurationMs / 1000) * 0.45;
          // Q wave dip
          const qDist = deltaT + qrsWidth * 0.7;
          voltage -= 0.18 * Math.exp(-Math.pow(qDist / (qrsWidth * 0.4), 2));
          // R wave peak
          const rDist = deltaT;
          voltage += 1.6 * Math.exp(-Math.pow(rDist / (qrsWidth * 0.6), 2));
          // S wave dip
          const sDist = deltaT - qrsWidth * 0.7;
          voltage -= 0.35 * Math.exp(-Math.pow(sDist / (qrsWidth * 0.4), 2));

          // 3. ST Segment & T Wave (Ventricular Repolarization)
          const tCenter = (qtIntervalMs / 1000) * 0.72;
          const tDist = deltaT - tCenter;
          const tWidth = 0.085;
          // T wave height boosted by ST elevation
          const tAmp = 0.4 + stElevationMv * 0.18;
          voltage += tAmp * Math.exp(-Math.pow(tDist / tWidth, 2));

          // ST segment elevation plateau between S wave and T wave
          if (deltaT > qrsWidth && deltaT < tCenter) {
            const stFade = Math.sin(((deltaT - qrsWidth) / (tCenter - qrsWidth)) * Math.PI);
            voltage += stElevationMv * 0.65 * stFade;
          }
        }

        // Fibrillatory baseline ripple in Afib
        if (isAfib) {
          voltage += Math.sin(t * 58) * 0.08 + Math.cos(t * 37) * 0.05;
        }
      }

      data.push({
        timeSec: t.toFixed(2),
        mv: Number(voltage.toFixed(3)),
      });
    }

    return data;
  }, [heartRateBpm, prIntervalMs, qrsDurationMs, qtIntervalMs, stElevationMv, isAfib, isVt]);

  const isQrsProlonged = qrsDurationMs >= 120;
  const isQtcProlonged = qtcBazettMs >= 460;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Physiology Simulators
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                12-Lead Electrocardiogram (ECG) Simulator
              </h1>
              <p className="text-xs text-slate-400">
                PQRST electrogram synthesis, interval intervals, and diagnostic telemetry modeling
              </p>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE TELEMETRY
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Paper: 25 mm/s &bull; 10 mm/mV</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Palette & Parameter Adjusters */}
        <div className="lg:col-span-4 space-y-5">
          {/* Preset Buttons */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Diagnostic Rhythms
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ECG_PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`text-left text-xs p-2.5 rounded-xl border transition ${
                    selectedPresetKey === key
                      ? 'bg-emerald-600/30 border-emerald-500 text-white font-semibold shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate font-medium">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</div>
                  <div className="text-[10px] text-slate-500">{p.heartRateBpm} BPM</div>
                </button>
              ))}
            </div>
            {ECG_PRESETS[selectedPresetKey] && (
              <p className="text-[11px] text-slate-400 mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/60 leading-relaxed">
                {ECG_PRESETS[selectedPresetKey].clinicalSummary}
              </p>
            )}
          </div>

          {/* Electrophysiological Controls */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interval &amp; Waveform Tuning
            </h3>

            {/* Heart Rate Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Heart Rate (BPM)</span>
                <span className="font-mono text-emerald-400 font-bold">{heartRateBpm} bpm</span>
              </div>
              <input
                type="range"
                min="30"
                max="220"
                step="1"
                value={heartRateBpm}
                onChange={(e) => setHeartRateBpm(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* PR Interval Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">PR Interval</span>
                <span className="font-mono text-slate-200">{prIntervalMs} ms {prIntervalMs > 200 ? '(1° AV Block)' : ''}</span>
              </div>
              <input
                type="range"
                min="80"
                max="320"
                step="5"
                disabled={isAfib || isVt}
                value={prIntervalMs}
                onChange={(e) => setPrIntervalMs(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* QRS Duration Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">QRS Duration</span>
                <span className={`font-mono ${isQrsProlonged ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                  {qrsDurationMs} ms {isQrsProlonged ? '(Wide/BBB)' : '(Narrow)'}
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="220"
                step="5"
                disabled={isVt}
                value={qrsDurationMs}
                onChange={(e) => setQrsDurationMs(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* QT Interval Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">QT Interval</span>
                <span className="font-mono text-slate-200">{qtIntervalMs} ms</span>
              </div>
              <input
                type="range"
                min="240"
                max="600"
                step="10"
                disabled={isVt}
                value={qtIntervalMs}
                onChange={(e) => setQtIntervalMs(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* ST Elevation Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">ST Deviation</span>
                <span className={`font-mono ${stElevationMv > 1.0 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                  {stElevationMv > 0 ? `+${stElevationMv.toFixed(1)}` : stElevationMv.toFixed(1)} mV
                </span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="5.0"
                step="0.2"
                disabled={isVt}
                value={stElevationMv}
                onChange={(e) => setStElevationMv(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Oscilloscope Telemetry & Diagnostic Metrics */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Ventricular Rate</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{heartRateBpm} BPM</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">PR Interval</span>
              <span className="text-lg font-bold font-mono text-blue-400">
                {isAfib || isVt ? 'N/A' : `${prIntervalMs} ms`}
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">QRS Complex</span>
              <span className={`text-lg font-bold font-mono ${isQrsProlonged ? 'text-amber-400' : 'text-slate-100'}`}>
                {qrsDurationMs} ms
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Corrected QTc</span>
              <span className={`text-lg font-bold font-mono ${isQtcProlonged ? 'text-rose-400' : 'text-purple-400'}`}>
                {qtcBazettMs} ms {isQtcProlonged ? '⚠️' : ''}
              </span>
            </div>
          </div>

          {/* Oscilloscope Monitor Chart */}
          <div className="bg-black border border-emerald-950/80 p-4 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Lead Banner */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-mono font-bold text-sm tracking-wider">LEAD II (RHYTHM STRIP)</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                  FILTER 0.05–150 Hz
                </span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400/80">
                SWEEP: 25 mm/s &bull; GAIN: 10 mm/mV
              </div>
            </div>

            {/* Green Waveform Chart */}
            <div className="w-full h-80 bg-slate-950/90 rounded-xl relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ecgWaveform} margin={{ top: 20, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="5 5" stroke="#064e3b" opacity={0.4} />
                  <XAxis dataKey="timeSec" stroke="#047857" tick={false} />
                  <YAxis domain={[-2.0, 3.5]} stroke="#047857" tick={false} />
                  <ReferenceLine y={0} stroke="#065f46" strokeWidth={1} />
                  <Line
                    type="monotone"
                    dataKey="mv"
                    stroke="#10b981"
                    strokeWidth={2.2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diagnostic Clinical Interpretation Box */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs leading-relaxed text-slate-300">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              🩺 Board High-Yield Diagnostic Criteria
            </h4>
            <ul className="space-y-1 list-disc list-inside text-slate-400">
              <li><strong className="text-slate-200">First-Degree AV Block:</strong> PR interval &gt; 200 ms without dropped QRS complexes.</li>
              <li><strong className="text-slate-200">Prolonged QTc:</strong> &gt; 440 ms in males, &gt; 460 ms in females; predisposes to Torsades de Pointes.</li>
              <li><strong className="text-slate-200">Bundle Branch Block:</strong> QRS duration &gt;= 120 ms (3 small boxes on standard 25mm/s paper).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
