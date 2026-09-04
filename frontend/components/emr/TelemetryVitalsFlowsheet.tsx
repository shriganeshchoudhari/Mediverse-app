'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Activity, Heart, Droplets, Thermometer, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export interface VitalsDataPoint {
  time: string;
  heartRate: number;
  systolicBp: number;
  diastolicBp: number;
  spO2: number;
  respRate: number;
  intervention?: string;
}

const INITIAL_VITALS_TIMELINE: VitalsDataPoint[] = [
  { time: '08:00', heartRate: 108, systolicBp: 88, diastolicBp: 56, spO2: 92, respRate: 24 },
  { time: '08:15', heartRate: 112, systolicBp: 86, diastolicBp: 54, spO2: 91, respRate: 26 },
  { time: '08:30', heartRate: 104, systolicBp: 90, diastolicBp: 58, spO2: 94, respRate: 22, intervention: 'Oxygen 4L NC' },
  { time: '08:45', heartRate: 98, systolicBp: 94, diastolicBp: 62, spO2: 96, respRate: 20, intervention: 'Aspirin 300mg + Ticagrelor 180mg' },
  { time: '09:00', heartRate: 92, systolicBp: 102, diastolicBp: 68, spO2: 98, respRate: 18, intervention: 'Primary PCI Door-to-Balloon' },
  { time: '09:30', heartRate: 84, systolicBp: 114, diastolicBp: 74, spO2: 99, respRate: 16 },
  { time: '10:00', heartRate: 78, systolicBp: 120, diastolicBp: 78, spO2: 99, respRate: 15 },
];

export default function TelemetryVitalsFlowsheet() {
  const [data, setData] = useState<VitalsDataPoint[]>(INITIAL_VITALS_TIMELINE);
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'hemodynamics' | 'respiratory'>('all');

  const latestPoint = data[data.length - 1];

  const applyIntervention = (name: string, hrDelta: number, sbpDelta: number, spo2Delta: number) => {
    const nextTime = `10:${(data.length * 15) % 60 || '15'}`;
    const newPoint: VitalsDataPoint = {
      time: nextTime,
      heartRate: Math.max(45, Math.min(180, latestPoint.heartRate + hrDelta)),
      systolicBp: Math.max(50, Math.min(220, latestPoint.systolicBp + sbpDelta)),
      diastolicBp: Math.max(30, Math.min(130, latestPoint.diastolicBp + Math.round(sbpDelta * 0.6))),
      spO2: Math.max(70, Math.min(100, latestPoint.spO2 + spo2Delta)),
      respRate: Math.max(8, Math.min(40, latestPoint.respRate - Math.round(hrDelta * 0.1))),
      intervention: name,
    };
    setData([...data, newPoint]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 text-slate-100">
      {/* Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-400 animate-pulse">
            <Activity size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">ICU Telemetry & Vitals Flowsheet</h3>
            <p className="text-xs text-slate-400">Continuous 24-hour hemodynamic trending and pharmacodynamic response curves.</p>
          </div>
        </div>

        {/* Current Live Vitals Banner */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs font-mono">
          <div className="flex items-center gap-1.5 text-rose-400">
            <Heart size={14} />
            <span>{latestPoint.heartRate} BPM</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="text-amber-300">
            BP: {latestPoint.systolicBp}/{latestPoint.diastolicBp}
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <Droplets size={13} />
            <span>{latestPoint.spO2}%</span>
          </div>
        </div>
      </div>

      {/* Metric Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center text-xs">
          <button
            onClick={() => setSelectedMetric('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedMetric === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Parameters
          </button>
          <button
            onClick={() => setSelectedMetric('hemodynamics')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedMetric === 'hemodynamics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BP & Heart Rate
          </button>
          <button
            onClick={() => setSelectedMetric('respiratory')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedMetric === 'respiratory' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Oxygen & Resp Rate
          </button>
        </div>

        <button
          onClick={() => setData(INITIAL_VITALS_TIMELINE)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono transition-colors"
        >
          <RefreshCw size={12} /> Reset Timeline
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[40, 160]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

            {(selectedMetric === 'all' || selectedMetric === 'hemodynamics') && (
              <>
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate (BPM)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f43f5e' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="systolicBp"
                  name="Systolic BP (mmHg)"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#fbbf24' }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolicBp"
                  name="Diastolic BP (mmHg)"
                  stroke="#d97706"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              </>
            )}

            {(selectedMetric === 'all' || selectedMetric === 'respiratory') && (
              <>
                <Line
                  type="monotone"
                  dataKey="spO2"
                  name="SpO2 (%)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10b981' }}
                />
                <Line
                  type="monotone"
                  dataKey="respRate"
                  name="Resp Rate (/min)"
                  stroke="#818cf8"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Simulated Bedside Interventions Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
        <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
          <Sparkles size={13} className="text-indigo-400" />
          Test Bedside Hemodynamic Response (Simulated Intervention):
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyIntervention('IV Normal Saline 500 mL', -6, 12, 1)}
            className="text-xs bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 px-3 py-1.5 rounded-lg transition-all"
          >
            + 500 mL IV Fluid Bolus (Raises Preload/BP)
          </button>
          <button
            onClick={() => applyIntervention('IV Furosemide 40 mg', 4, -14, 2)}
            className="text-xs bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 px-3 py-1.5 rounded-lg transition-all"
          >
            + IV Furosemide 40 mg (Diuresis/Lowers BP)
          </button>
          <button
            onClick={() => applyIntervention('Sublingual Nitroglycerin 0.4 mg', 12, -22, 0)}
            className="text-xs bg-slate-900 border border-slate-800 hover:border-rose-500 text-rose-300 px-3 py-1.5 rounded-lg transition-all"
          >
            + SL Nitroglycerin (Preload Drop / Hypotension Risk)
          </button>
          <button
            onClick={() => applyIntervention('High-Flow Nasal Cannula O2', -4, 2, 4)}
            className="text-xs bg-slate-900 border border-slate-800 hover:border-emerald-500 text-emerald-300 px-3 py-1.5 rounded-lg transition-all"
          >
            + High-Flow O2 (Increases SpO2)
          </button>
        </div>
      </div>
    </div>
  );
}
